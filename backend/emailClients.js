// backend/emailClients.js
// FIXED VERSION with better error handling

import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID;
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET;
const OUTLOOK_TENANT_ID = process.env.OUTLOOK_TENANT_ID || 'common';
const OUTLOOK_AUTH_SCOPE = [
  "openid",
  "email",
  "profile",
  "offline_access",
  "https://graph.microsoft.com/User.Read",
  "https://graph.microsoft.com/Mail.Read",
];

// Validate environment variables
if (!OUTLOOK_CLIENT_ID || !OUTLOOK_CLIENT_SECRET) {
    throw new Error('Missing required Outlook environment variables: OUTLOOK_CLIENT_ID or OUTLOOK_CLIENT_SECRET');
}

const msalConfig = {
    auth: {
        clientId: OUTLOOK_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${OUTLOOK_TENANT_ID}`,
        clientSecret: OUTLOOK_CLIENT_SECRET,
    },
};

const cca = new ConfidentialClientApplication(msalConfig);

/**
 * Gmail Client (Mock for now - implement later)
 */
export function gmailClient(token) {
    console.log("MOCK: Initializing Gmail client with token.");
    return {
        searchAndFetchHeaders: async (criteria) => {
            console.log(`MOCK: Gmail search criteria received: ${criteria}`);
            return [];
        }
    };
}

/**
 * Outlook Client using Microsoft Graph API
 * @param {string} refreshToken - Decrypted refresh token from database
 * @returns {Client} Microsoft Graph Client instance
 */
export function outlookClient(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Missing or invalid Outlook access token");
  }
  console.log("🔑 Using short-lived access token for Graph client");
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}
