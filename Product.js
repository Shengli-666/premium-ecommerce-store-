const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'BRL', 'AUD'],
    default: 'USD'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    thumbnail: String,
    title: String
  }],
  usageScenes: [{
    title: String,
    description: String,
    image: String,
    video: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
