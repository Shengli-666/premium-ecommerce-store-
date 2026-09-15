const express = require('express');  
  
module.exports = function(db) {  
const router = express.Router();  
  
// 获取所有产品（带筛选）  
router.get('/', (req, res) => {  
try {  
const { category, featured, search, limit = 12, page = 1 } = req.query;  
  
let query = 'SELECT * FROM products WHERE isActive = 1';  
const params = [];  
  
if (category) {  
query += ' AND category = ?';  
params.push(category);  
}  
  
if (featured === 'true') {  
query += ' AND featured = 1';  
}  
  
if (search) {  
query += ' AND (name LIKE ? OR description LIKE ?)';  
params.push(`%${search}%`, `%${search}%`);  
}  
  
query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';  
params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));  
  
const products = db.prepare(query).all(...params);  
  
// 获取产品图片  
products.forEach(product => {  
const images = db.prepare('SELECT * FROM product_images WHERE productId = ?').all(product.id);  
product.images = images;  
});  
  
const total = db.prepare('SELECT COUNT(*) as count FROM products WHERE isActive = 1').get();  
  
res.json({  
products,  
pagination: {  
current: parseInt(page),  
total: Math.ceil(total.count / parseInt(limit)),  
totalItems: total.count  
}  
});  
} catch (error) {  
console.error('Get products error:', error);  
res.status(500).json({ message: 'Failed to fetch products', error: error.message });  
}  
});  
  
// 获取单个产品  
router.get('/:id', (req, res) => {  
try {  
const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);  
  
if (!product) {  
return res.status(404).json({ message: 'Product not found' });  
}  
  
// 获取产品图片  
const images = db.prepare('SELECT * FROM product_images WHERE productId = ?').all(product.id);  
product.images = images;  
  
res.json({ product });  
} catch (error) {  
console.error('Get product error:', error);  
res.status(500).json({ message: 'Failed to fetch product', error: error.message });  
}  
});  
  
// 获取推荐产品  
router.get('/featured/homepage', (req, res) => {  
try {  
const products = db.prepare('SELECT * FROM products WHERE featured = 1 AND isActive = 1 ORDER BY createdAt DESC LIMIT 8').all();  
  
// 获取产品图片  
products.forEach(product => {  
const images = db.prepare('SELECT * FROM product_images WHERE productId = ?').all(product.id);  
product.images = images;  
});  
  
res.json({ products });  
} catch (error) {  
console.error('Get featured products error:', error);  
res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });  
}  
});  
  
// 创建产品（管理员）  
router.post('/', (req, res) => {  
try {  
const { name, description, shortDescription, price, comparePrice, category, stock, sku, featured, images } = req.body;  
  
const stmt = db.prepare(`  
INSERT INTO products (name, description, shortDescription, price, comparePrice, category, stock, sku, featured)  
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)  
`);  
const result = stmt.run(name, description, shortDescription || '', price, comparePrice || null, category, stock || 0, sku || null, featured ? 1 : 0);  
  
// 添加产品图片  
if (images && images.length > 0) {  
const imgStmt = db.prepare('INSERT INTO product_images (productId, url, alt, isPrimary) VALUES (?, ?, ?, ?)');  
images.forEach((img, index) => {  
imgStmt.run(result.lastInsertRowid, img.url, img.alt || '', img.isPrimary ? 1 : 0);  
});  
}  
  
res.status(201).json({ message: 'Product created', product: { id: result.lastInsertRowid } });  
} catch (error) {  
console.error('Create product error:', error);  
res.status(500).json({ message: 'Failed to create product', error: error.message });  
}  
});  
  
// 更新产品（管理员）  
router.put('/:id', (req, res) => {  
try {  
const { name, description, shortDescription, price, comparePrice, category, stock, featured } = req.body;  
  
const stmt = db.prepare(`  
UPDATE products  
SET name = ?, description = ?, shortDescription = ?, price = ?, comparePrice = ?, category = ?, stock = ?, featured = ?, updatedAt = CURRENT_TIMESTAMP  
WHERE id = ?  
`);  
stmt.run(name, description, shortDescription, price, comparePrice, category, stock, featured ? 1 : 0, req.params.id);  
  
res.json({ message: 'Product updated' });  
} catch (error) {  
console.error('Update product error:', error);  
res.status(500).json({ message: 'Failed to update product', error: error.message });  
}  
});  
  
// 删除产品（管理员）  
router.delete('/:id', (req, res) => {  
try {  
db.prepare('DELETE FROM product_images WHERE productId = ?').run(req.params.id);  
db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);  
  
res.json({ message: 'Product deleted' });  
} catch (error) {  
console.error('Delete product error:', error);  
res.status(500).json({ message: 'Failed to delete product', error: error.message });  
}  
});  
  
return router;  
};  
