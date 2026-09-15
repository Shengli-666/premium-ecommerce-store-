const Database = require('better-sqlite3');  
const bcrypt = require('bcryptjs');  
const path = require('path');  
  
// 创建数据库连接  
const dbPath = path.join(__dirname, '../../ecommerce.db');  
const db = new Database(dbPath);  
  
// 创建用户表  
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
  
// 创建产品表  
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
  
// 创建产品图片表  
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
  
// 创建管理员账户  
const adminEmail = 'admin@premiumstore.com';  
const adminPassword = bcrypt.hashSync('admin123', 12);  
  
try {  
const stmt = db.prepare(`  
INSERT OR IGNORE INTO users (email, password, firstName, lastName, role)  
VALUES (?, ?, ?, ?, ?)  
`);  
stmt.run(adminEmail, adminPassword, 'Admin', 'User', 'admin');  
console.log('✅ 管理员账户创建成功');  
console.log(' 邮箱：admin@premiumstore.com');  
console.log(' 密码：admin123');  
} catch (error) {  
console.log('管理员账户已存在');  
}  
  
// 添加示例产品  
const sampleProducts = [  
{  
name: 'Premium Wireless Headphones',  
description: 'High-quality wireless headphones with noise cancellation',  
shortDescription: 'Premium sound quality with ANC',  
price: 149.99,  
comparePrice: 199.99,  
category: 'Electronics',  
stock: 50,  
sku: 'WH-001',  
featured: 1  
},  
{  
name: 'Smart Watch Pro',  
description: 'Advanced smartwatch with health monitoring',  
shortDescription: 'Track your fitness and health',  
price: 299.99,  
category: 'Electronics',  
stock: 30,  
sku: 'SW-001',  
featured: 1  
},  
{  
name: 'Portable Bluetooth Speaker',  
description: 'Compact speaker with powerful sound',  
shortDescription: 'Great sound anywhere',  
price: 79.99,  
category: 'Electronics',  
stock: 100,  
sku: 'BS-001',  
featured: 1  
}  
];  
  
sampleProducts.forEach(product => {  
try {  
const stmt = db.prepare(`  
INSERT OR IGNORE INTO products (name, description, shortDescription, price, comparePrice, category, stock, sku, featured)  
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)  
`);  
stmt.run(  
product.name,  
product.description,  
product.shortDescription,  
product.price,  
product.comparePrice,  
product.category,  
product.stock,  
product.sku,  
product.featured  
);  
console.log(`✅ 添加产品：${product.name}`);  
} catch (error) {  
console.log(`产品已存在：${product.name}`);  
}  
});  
  
console.log('✅ 数据库初始化完成！');  
db.close();  
