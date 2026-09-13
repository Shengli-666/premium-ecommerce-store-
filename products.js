const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = 12, page = 1 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Get featured products
router.get('/featured/homepage', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });
  }
});

// Admin: Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Admin: Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Admin: Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
