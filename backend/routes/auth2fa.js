import express from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   POST /api/2fa/generate
 * @desc    Generate a 2FA secret and QR code
 * @access  Private
 */
router.post('/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `LetterLab (${user.email})`,
            issuer: 'LetterLab'
        });

        // Save secret temporarily (or enable only after verify?)
        // Strategy: Save secret, but keep enabled=false until verified
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Generate QR
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ error: 'Could not generate QR code' });

            res.json({
                success: true,
                secret: secret.base32, // Optional: if manual entry needed
                qrCode: data_url
            });
        });

    } catch (error) {
        console.error('2FA Generate Error:', error);
        res.status(500).json({ error: 'Server error generating 2FA' });
    }
});

/**
 * @route   POST /api/2fa/verify
 * @desc    Verify TOTP token and enable 2FA
 * @access  Private
 */
router.post('/verify', auth, async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token is required' });

        const user = await User.findById(req.user.id).select('+twoFactorSecret');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ success: true, message: '2FA Enabled successfully' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid token' });
        }

    } catch (error) {
        console.error('2FA Verify Error:', error);
        res.status(500).json({ error: 'Server error verifying 2FA' });
    }
});

/**
 * @route   POST /api/2fa/disable
 * @desc    Disable 2FA
 * @access  Private
 */
router.post('/disable', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined; // Clear secret
        await user.save();

        res.json({ success: true, message: '2FA Disabled' });

    } catch (error) {
        console.error('2FA Disable Error:', error);
        res.status(500).json({ error: 'Server error disabling 2FA' });
    }
});

/**
 * @route   GET /api/2fa/status
 * @desc    Check if 2FA is enabled
 * @access  Private
 */
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ enabled: !!user?.twoFactorEnabled });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
