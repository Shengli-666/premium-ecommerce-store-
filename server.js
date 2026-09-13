const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);

// Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
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

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/product-detail.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Frontend: http://localhost:${PORT}`);
  console.log(`🔐 Admin Panel: http://localhost:${PORT}/admin`);
});
