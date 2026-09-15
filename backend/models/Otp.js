const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      default: 'PASSWORD_RESET',
      enum: ['PASSWORD_RESET', 'CHANGE_CONTACT'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL Index: documents automatically deleted when expiresAt is reached
      index: { expires: '10m' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Otp', OtpSchema);
