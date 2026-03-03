// backend/utils/crypto.js

import CryptoJS from 'crypto-js';

// CRITICAL: Use the secure key from your .env file
const CRYPTO_SECRET = process.env.CRYPTO_SECRET; 

if (!CRYPTO_SECRET) {
    console.error("❌ FATAL ERROR: CRYPTO_SECRET is missing from .env!");
    // It is safer to exit than to proceed without an encryption key.
    throw new Error("Missing CRYPTO_SECRET environment variable."); 
}

/**
 * Encrypts a string (e.g., a refresh token) using AES.
 * @param {string} token - The plain text token to encrypt.
 * @returns {string} The encrypted token string.
 */
export function encryptToken(token) {
    if (!token) return null;
    return CryptoJS.AES.encrypt(token, CRYPTO_SECRET).toString();
}

/**
 * Decrypts an encrypted string back into its original form.
 * @param {string} encryptedToken - The encrypted token string.
 * @returns {string} The decrypted plain text token.
 */
export function decryptToken(encryptedToken) {
    if (!encryptedToken) return null;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, CRYPTO_SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Token decryption failed:", e);
        // Return null or throw a specific error if decryption fails
        return null; 
    }
}