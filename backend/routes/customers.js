const express = require('express');  
const jwt = require('jsonwebtoken');  
  
module.exports = function(db) {  
const router = express.Router();  
  
// 验证管理员中间件  
const verifyAdmin = (req, res, next) => {  
try {  
const token = req.headers.authorization?.replace('Bearer ', '');  
if (!token) {  
return res.status(401).json({ message: 'No token provided' });  
}  
  
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');  
  
if (decoded.role !== 'admin') {  
return res.status(403).json({ message: 'Admin access required' });  
}  
  
req.user = decoded;  
next();  
} catch (error) {  
res.status(401).json({ message: 'Invalid token' });  
}  
};  
  
// 获取所有客户（管理员专用）  
router.get('/', verifyAdmin, (req, res) => {  
try {  
const { page = 1, limit = 20, country, search } = req.query;  
  
let query = 'SELECT * FROM users WHERE role = ?';  
const params = ['customer'];  
  
if (country) {  
query += ' AND country = ?';  
params.push(country);  
}  
  
if (search) {  
query += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';  
params.push(`%${search}%`, `%${search}%`, `%${search}%`);  
}  
  
query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';  
params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));  
  
const customers = db.prepare(query).all(...params);  
  
// 不返回密码  
customers.forEach(customer => {  
delete customer.password;  
});  
  
const total = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('customer');  
  
res.json({  
customers,  
pagination: {  
current: parseInt(page),  
total: Math.ceil(total.count / parseInt(limit)),  
totalItems: total.count  
}  
});  
} catch (error) {  
console.error('Get customers error:', error);  
res.status(500).json({ message: 'Failed to fetch customers', error: error.message });  
}  
});  
  
// 获取单个客户（管理员专用）  
router.get('/:id', verifyAdmin, (req, res) => {  
try {  
const customer = db.prepare('SELECT * FROM users WHERE id = ? AND role = ?').get(req.params.id, 'customer');  
  
if (!customer) {  
return res.status(404).json({ message: 'Customer not found' });  
}  
  
// 不返回密码  
delete customer.password;  
  
res.json({ customer });  
} catch (error) {  
console.error('Get customer error:', error);  
res.status(500).json({ message: 'Failed to fetch customer', error: error.message });  
}  
});  
  
// 获取客户统计（管理员专用）  
router.get('/stats/overview', verifyAdmin, (req, res) => {  
try {  
const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('customer').count;  
const activeCustomers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ? AND isActive = 1').get('customer').count;  
  
const customersByCountry = db.prepare('SELECT country, COUNT(*) as count FROM users WHERE role = ? GROUP BY country').all('customer');  
  
const recentCustomers = db.prepare('SELECT firstName, lastName, email, country, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC LIMIT 5').all('customer');  
  
res.json({  
statistics: {  
totalCustomers,  
activeCustomers,  
inactiveCustomers: totalCustomers - activeCustomers,  
customersByCountry,  
recentCustomers  
}  
});  
} catch (error) {  
console.error('Get stats error:', error);  
res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });  
}  
});  
  
// 更新客户（管理员专用）  
router.put('/:id', verifyAdmin, (req, res) => {  
try {  
const { firstName, lastName, phone, country, whatsapp, isActive } = req.body;  
  
const stmt = db.prepare(`  
UPDATE users  
SET firstName = ?, lastName = ?, phone = ?, country = ?, whatsapp = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP  
WHERE id = ? AND role = 'customer'  
`);  
stmt.run(firstName, lastName, phone, country, whatsapp, isActive ? 1 : 0, req.params.id);  
  
res.json({ message: 'Customer updated' });  
} catch (error) {  
console.error('Update customer error:', error);  
res.status(500).json({ message: 'Failed to update customer', error: error.message });  
}  
});  
  
// 删除客户（管理员专用）  
router.delete('/:id', verifyAdmin, (req, res) => {  
try {  
db.prepare('DELETE FROM users WHERE id = ? AND role = ?').run(req.params.id, 'customer');  
  
res.json({ message: 'Customer deleted' });  
} catch (error) {  
console.error('Delete customer error:', error);  
res.status(500).json({ message: 'Failed to delete customer', error: error.message });  
}  
});  
  
return router;  
};  
