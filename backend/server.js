const express = require('express');  
const cors = require('cors');  
const path = require('path');  
const Database = require('better-sqlite3');  
  
const app = express();  
const PORT = process.env.PORT || 3000;  
  
// Middleware  
app.use(cors());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(express.static(path.join(__dirname, '../frontend')));  
  
// 创建数据库连接  
const db = new Database(path.join(__dirname, '../ecommerce.db'));  
  
// 初始化数据库表  
try {  
db.exec(`  
CREATE TABLE IF NOT EXISTS users (  
id INTEGER PRIMARY KEY AUTOINCREMENT,  
email TEXT UNIQUE NOT NULL,  
password TEXT NOT NULL,  
firstName TEXT NOT NULL,  
lastName TEXT NOT NULL,  
phone TEXT,  
country TEXT DEFAULT 'US',  
whatsapp TEXT,  
role TEXT DEFAULT 'customer',  
isActive INTEGER DEFAULT 1,  
lastLogin DATETIME,  
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP  
)  
`);  
  
db.exec(`  
CREATE TABLE IF NOT EXISTS products (  
id INTEGER PRIMARY KEY AUTOINCREMENT,  
name TEXT NOT NULL,  
description TEXT NOT NULL,  
shortDescription TEXT,  
price REAL NOT NULL,  
comparePrice REAL,  
currency TEXT DEFAULT 'USD',  
category TEXT NOT NULL,  
stock INTEGER DEFAULT 0,  
sku TEXT UNIQUE,  
featured INTEGER DEFAULT 0,  
isActive INTEGER DEFAULT 1,  
rating REAL DEFAULT 0,  
ratingCount INTEGER DEFAULT 0,  
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP  
)  
`);  
  
db.exec(`  
CREATE TABLE IF NOT EXISTS product_images (  
id INTEGER PRIMARY KEY AUTOINCREMENT,  
productId INTEGER NOT NULL,  
url TEXT NOT NULL,  
alt TEXT,  
isPrimary INTEGER DEFAULT 0,  
FOREIGN KEY (productId) REFERENCES products(id)  
)  
`);  
  
console.log('✅ SQLite Database Connected');  
} catch (error) {  
console.error('❌ Database Error:', error.message);  
}  
  
// 路由  
const authRoutes = require('./routes/auth');  
const productRoutes = require('./routes/products');  
const customerRoutes = require('./routes/customers');  
  
// 将数据库实例传递给路由  
app.use('/api/auth', authRoutes(db));  
app.use('/api/products', productRoutes(db));  
app.use('/api/customers', customerRoutes(db));  
  
// 前端路由  
app.get('/', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));  
});  

app.get('/product/:id', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/product-detail.html'));  
});  
  
app.get('/admin', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));  
});  
  
app.get('/login', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));  
});  
  
app.get('/register', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));  
});  
  
app.get('/products', (req, res) => {  
res.sendFile(path.join(__dirname, '../frontend/pages/products.html'));  
});  
  
// 启动服务器  
app.listen(PORT, () => {  
console.log(`🚀 Server running on http://localhost:$ {PORT}`);  
console.log(`📦 Frontend: http://localhost:$ {PORT}`);  
console.log(`🔐 Admin Panel: http://localhost:$ {PORT}/admin`);  
});  
