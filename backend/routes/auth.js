const express = require('express');  
const jwt = require('jsonwebtoken');  
const bcrypt = require('bcryptjs');  
  
module.exports = function(db) {  
const router = express.Router();  
  
// 注册  
router.post('/register', async (req, res) => {  
try {  
const { email, password, firstName, lastName, phone, country, whatsapp } = req.body;  
  
// 检查用户是否已存在  
const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);  
if (existingUser) {  
return res.status(400).json({ message: 'Email already registered' });  
}  
  
// 加密密码  
const hashedPassword = bcrypt.hashSync(password, 12);  
  
// 创建新用户  
const stmt = db.prepare(`  
INSERT INTO users (email, password, firstName, lastName, phone, country, whatsapp, role)  
VALUES (?, ?, ?, ?, ?, ?, ?, 'customer')  
`);  
const result = stmt.run(email, hashedPassword, firstName, lastName, phone || null, country || 'US', whatsapp || null);  
  
// 生成 token  
const token = jwt.sign(  
{ userId: result.lastInsertRowid, email: email, role: 'customer' },  
process.env.JWT_SECRET || 'your-secret-key',  
{ expiresIn: '7d' }  
);  
  
res.status(201).json({  
message: 'Registration successful',  
token,  
user: {  
id: result.lastInsertRowid,  
email: email,  
firstName: firstName,  
lastName: lastName,  
role: 'customer'  
}  
});  
} catch (error) {  
console.error('Register error:', error);  
res.status(500).json({ message: 'Registration failed', error: error.message });  
}  
});  
  
// 登录  
router.post('/login', async (req, res) => {  
try {  
const { email, password } = req.body;  
  
// 查找用户  
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);  
if (!user) {  
return res.status(401).json({ message: 'Invalid credentials' });  
}  
  
// 检查密码  
const isMatch = bcrypt.compareSync(password, user.password);  
if (!isMatch) {  
return res.status(401).json({ message: 'Invalid credentials' });  
}  
  
// 更新最后登录时间  
db.prepare('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);  
  
// 生成 token  
const token = jwt.sign(  
{ userId: user.id, email: user.email, role: user.role },  
process.env.JWT_SECRET || 'your-secret-key',  
{ expiresIn: '7d' }  
);  
  
res.json({  
message: 'Login successful',  
token,  
user: {  
id: user.id,  
email: user.email,  
firstName: user.firstName,  
lastName: user.lastName,  
role: user.role,  
country: user.country  
}  
});  
} catch (error) {  
console.error('Login error:', error);  
res.status(500).json({ message: 'Login failed', error: error.message });  
}  
});  
  
// 获取当前用户  
router.get('/me', async (req, res) => {  
try {  
const token = req.headers.authorization?.replace('Bearer ', '');  
if (!token) {  
return res.status(401).json({ message: 'No token provided' });  
}  
  
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');  
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);  
  
if (!user) {  
return res.status(404).json({ message: 'User not found' });  
}  
  
// 不返回密码  
delete user.password;  
res.json({ user });  
} catch (error) {  
res.status(401).json({ message: 'Invalid token' });  
}  
});  
  
return router;  
};  
