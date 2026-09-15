const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    techStack: {
      type: [String],
      required: [true, 'At least one technology must be listed'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'techStack must contain at least one technology',
      },
    },
    imageUrl: {
      type: String,
      required: [true, 'Project image URL or upload is required'],
      trim: true,
    },
    imagePublicId: {
      type: String, // Cloudinary public_id if uploaded via Cloudinary
      default: null,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
      default: 'Full Stack',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String, // e.g. "2026-03", "Aug 2026"
      default: () => new Date().toISOString().substring(0, 7),
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting newest first
PortfolioSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
