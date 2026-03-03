// backend/routes/outlookOAuth.js
// Updated to fetch user profile (firstName, lastName) from Microsoft Graph

import express from 'express';
import { ConfidentialClientApplication } from '@azure/msal-node';
import User from '../models/User.js';
import { encryptToken } from '../utils/crypto.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required. Add it to .env');

const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID;
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET;
const OUTLOOK_TENANT_ID = process.env.OUTLOOK_TENANT_ID || 'common';
const OUTLOOK_REDIRECT_URI = process.env.OUTLOOK_REDIRECT_URI;
const OUTLOOK_AUTH_SCOPE = [
  'openid',
  'email',
  'profile',
  'offline_access',
  'https://graph.microsoft.com/User.Read',
  'https://graph.microsoft.com/Mail.Read',
  'https://graph.microsoft.com/Mail.ReadWrite',
  'https://graph.microsoft.com/Mail.Send'
];

// ── Provider availability check ──────────────────────────────────────────────
const OUTLOOK_CONFIGURED =
  !!OUTLOOK_CLIENT_ID && !!OUTLOOK_CLIENT_SECRET && !!OUTLOOK_REDIRECT_URI;

if (!OUTLOOK_CONFIGURED) {
  console.warn(
    "[outlookOAuth] ⚠️  Outlook OAuth is DISABLED — missing OUTLOOK_CLIENT_ID, " +
    "OUTLOOK_CLIENT_SECRET, or OUTLOOK_REDIRECT_URI. Set these in your environment."
  );
}

const msalConfig = OUTLOOK_CONFIGURED ? {
  auth: {
    clientId: OUTLOOK_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${OUTLOOK_TENANT_ID}`,
    clientSecret: OUTLOOK_CLIENT_SECRET,
  },
} : null;

const cca = OUTLOOK_CONFIGURED ? new ConfidentialClientApplication(msalConfig) : null;

/** Guard: returns 503 when Outlook OAuth is not configured. */
function requireOutlookConfig(req, res, next) {
  if (!OUTLOOK_CONFIGURED) {
    return res.status(503).json({ error: "Outlook OAuth is not configured on this server." });
  }
  return next();
}

/**
 * Helper function to fetch user profile from Microsoft Graph
 */
async function fetchMicrosoftProfile(accessToken) {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      firstName: response.data.givenName || '',
      lastName: response.data.surname || '',
      email: response.data.mail || response.data.userPrincipalName,
      displayName: response.data.displayName || '',
    };
  } catch (error) {
    console.error('❌ Error fetching Microsoft profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch user profile from Microsoft Graph');
  }
}

/**
 * STEP 1: Initiate OAuth Login
 */
router.get('/outlook/login', requireOutlookConfig, (req, res) => {
  const state = req.query.state || '';

  const authCodeUrlParameters = {
    scopes: OUTLOOK_AUTH_SCOPE,
    redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    state: state,
    prompt: 'select_account',
  };

  console.log("👉 redirectUri sent to Microsoft:", process.env.OUTLOOK_REDIRECT_URI);

  cca.getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => res.redirect(response))
    .catch((error) => {
      console.error("Error generating auth URL:", error);
      res.status(500).send("Auth initialization failed");
    });
});

/**
 * STEP 2: Handle OAuth Callback
 */
router.get('/outlook/callback', requireOutlookConfig, async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).send('Authorization code missing');

  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code,
      scopes: OUTLOOK_AUTH_SCOPE,
      redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    });

    console.log("✅ Token response received from Microsoft");

    const { accessToken, account, expiresOn } = tokenResponse;
    // Note: MSAL Node puts the refresh token in the cache, but usually returns it if requested?
    // Actually acquireTokenByCode for ConfidentialClientApplication returns access_token.
    // We can try to get familyId or something, but usually `tokenResponse` has it?
    // Let's assume standard parsing or just rely on accessToken for now, and try to grab refresh token if available.
    // MSAL Node response type: AuthenticationResult

    if (!accessToken) {
      console.log("⚠️ No access token returned!");
      return res.status(400).send("No access token received.");
    }

    // ✅ Fetch user profile from Microsoft Graph
    const userProfile = await fetchMicrosoftProfile(accessToken);

    // ✅ Find or create user in database with full profile
    let user = await User.findOne({ email: userProfile.email });

    if (!user) {
      // Create new user with profile data
      user = await User.create({
        name: userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        provider: 'outlook',
        password: 'oauth_' + Math.random().toString(36).slice(2),
        outlookAccessToken: accessToken,
        outlookTokenExpiry: expiresOn,
        // Set initial quotas for launch
        chatTokensLimit: 50000,
        chatTokensRemaining: 50000,
        emailsLimitDaily: 10,
        emailsRemainingToday: 10,
        nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      console.log("✅ New user created with profile data and initial quotas");
    } else {
      // Update existing user with profile data if missing AND update tokens
      user.outlookAccessToken = accessToken;
      user.outlookTokenExpiry = expiresOn;

      if (!user.firstName || !user.lastName) {
        user.firstName = userProfile.firstName;
        user.lastName = userProfile.lastName;
        user.name = userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`.trim();
      }
      await user.save();
      console.log("✅ Updated existing user with profile data and tokens");
    }

    // ✅ Generate JWT with user data
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Store access token temporarily for session
    global._outlookTempTokens = global._outlookTempTokens || {};
    const sessionCode = Math.random().toString(36).slice(2, 10);
    global._outlookTempTokens[sessionCode] = {
      // accessToken: accessToken, // 🔒 REMOVED for security
      jwtToken: jwtToken,
      userProfile: userProfile
    };

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error("[outlookOAuth] ❌ FRONTEND_URL is not set. Cannot redirect after OAuth.");
      return res.status(500).send("Server misconfiguration: FRONTEND_URL is not defined.");
    }
    const redirect = `${frontendUrl}/?provider=outlook&session_code=${sessionCode}`;
    console.log("[outlookOAuth] 🔄 Redirecting user to frontend:", redirect);
    return res.redirect(redirect);

  } catch (error) {
    console.error("❌ OAuth callback error:", error.message);
    res.status(500).send("Authentication failed. Please try again.");
  }
});

/**
 * STEP 3: Exchange session code for tokens
 */
router.get('/outlook/exchange', (req, res) => {
  const { code } = req.query;
  if (!code || !global._outlookTempTokens?.[code]) {
    return res.status(404).json({ error: 'Invalid or expired session code' });
  }

  const sessionData = global._outlookTempTokens[code];
  delete global._outlookTempTokens[code]; // one-time use

  return res.json({
    // accessToken: sessionData.accessToken, // 🔒 REMOVED
    jwtToken: sessionData.jwtToken,
    userProfile: sessionData.userProfile
  });
});

/**
 * STEP 4: Check Connection Status
 */
router.get('/outlook/status', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ connected: false, error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('+outlookRefreshToken firstName lastName');

    res.json({
      connected: !!user.outlookRefreshToken,
      provider: user.provider,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
    });
  } catch (error) {
    res.status(401).json({ connected: false, error: 'Invalid token' });
  }
});

export default router;