const Portfolio = require('../models/Portfolio');
const cloudinary = require('../config/cloudinary');

class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Uploads a buffer or file path to Cloudinary
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio_projects',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * 1. Create a new portfolio item
 */
const createPortfolioItem = async (itemData, file = null) => {
  let finalImageUrl = itemData.imageUrl;
  let imagePublicId = null;

  // If a file was uploaded via multipart/form-data and Cloudinary is configured
  if (file && file.buffer) {
    try {
      const uploadResult = await uploadToCloudinary(file.buffer);
      finalImageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      throw new ServiceError(`Failed to upload image to Cloudinary: ${err.message}`, 500);
    }
  }

  if (!finalImageUrl) {
    throw new ServiceError('Please provide an imageUrl or upload an image file.', 400);
  }

  // Parse techStack if sent as JSON string or comma-separated string
  let techStackArray = itemData.techStack;
  if (typeof techStackArray === 'string') {
    try {
      techStackArray = JSON.parse(techStackArray);
    } catch {
      techStackArray = techStackArray.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  const newItem = await Portfolio.create({
    title: itemData.title,
    description: itemData.description,
    techStack: techStackArray,
    imageUrl: finalImageUrl,
    imagePublicId,
    githubUrl: itemData.githubUrl || '',
    liveUrl: itemData.liveUrl || '',
    category: itemData.category || 'Full Stack',
    featured: itemData.featured === true || itemData.featured === 'true',
    date: itemData.date || new Date().toISOString().substring(0, 7),
  });

  return newItem;
};

/**
 * 2. Get all portfolio items (sorted newest first)
 */
const getAllPortfolioItems = async ({ category, search } = {}) => {
  const query = {};

  if (category && category !== 'All') {
    query.category = new RegExp(`^${category}$`, 'i');
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { techStack: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Always sorted newest first by createdAt
  const items = await Portfolio.find(query).sort({ createdAt: -1 });
  return items;
};

/**
 * 3. Get single portfolio item by ID
 */
const getPortfolioItemById = async (id) => {
  const item = await Portfolio.findById(id);
  if (!item) {
    throw new ServiceError(`Portfolio project with ID '${id}' not found`, 404);
  }
  return item;
};

/**
 * 4. Update portfolio item by ID
 */
const updatePortfolioItem = async (id, updateData, file = null) => {
  const item = await Portfolio.findById(id);
  if (!item) {
    throw new ServiceError(`Portfolio project with ID '${id}' not found`, 404);
  }

  // If a new image file is uploaded
  if (file && file.buffer) {
    try {
      // Optional cleanup of old image in Cloudinary
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId).catch(() => {});
      }
      const uploadResult = await uploadToCloudinary(file.buffer);
      item.imageUrl = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    } catch (err) {
      throw new ServiceError(`Failed to update image on Cloudinary: ${err.message}`, 500);
    }
  } else if (updateData.imageUrl) {
    item.imageUrl = updateData.imageUrl;
  }

  if (updateData.title !== undefined) item.title = updateData.title;
  if (updateData.description !== undefined) item.description = updateData.description;
  if (updateData.githubUrl !== undefined) item.githubUrl = updateData.githubUrl;
  if (updateData.liveUrl !== undefined) item.liveUrl = updateData.liveUrl;
  if (updateData.category !== undefined) item.category = updateData.category;
  if (updateData.date !== undefined) item.date = updateData.date;
  if (updateData.featured !== undefined) {
    item.featured = updateData.featured === true || updateData.featured === 'true';
  }

  if (updateData.techStack !== undefined) {
    let techStackArray = updateData.techStack;
    if (typeof techStackArray === 'string') {
      try {
        techStackArray = JSON.parse(techStackArray);
      } catch {
        techStackArray = techStackArray.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }
    item.techStack = techStackArray;
  }

  await item.save();
  return item;
};

/**
 * 5. Delete portfolio item by ID
 */
const deletePortfolioItem = async (id) => {
  const item = await Portfolio.findById(id);
  if (!item) {
    throw new ServiceError(`Portfolio project with ID '${id}' not found`, 404);
  }

  // Remove Cloudinary image if it exists
  if (item.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(item.imagePublicId);
    } catch (err) {
      console.warn('Cloudinary delete warning:', err.message);
    }
  }

  await Portfolio.deleteOne({ _id: id });
  return { message: 'Portfolio item deleted successfully', id };
};

module.exports = {
  createPortfolioItem,
  getAllPortfolioItems,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
};
