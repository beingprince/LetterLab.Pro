// backend/utils/validation.js

/**
 * Basic check for email format validation.
 * Used to ensure the targetEmail is safe before being passed to the service layer.
 * @param {string} email - The string to validate.
 * @returns {boolean} True if the email format is generally valid.
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    // Standard regex for basic email format check
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// You can add other validation functions here later (e.g., isValidPassword, etc.)