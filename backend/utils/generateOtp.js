const crypto = require('crypto');

/**
 * Generates a cryptographically secure 6-digit OTP string.
 * @returns {string} 6-digit numeric string (e.g. "584920")
 */
const generateOtp = () => {
  // Generates integer between 100000 and 999999
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
};

module.exports = generateOtp;
