# 🏹 Premium E-commerce Store

专业电商产品展示网站 - 面向美国、巴西、澳大利亚市场

## 📋 功能特点

### 前端功能
- ✅ 现代化响应式设计（适配美/巴/澳用户审美）
- ✅ 产品展示 + 使用场景模拟
- ✅ 用户注册/登录系统
- ✅ WhatsApp 客服集成
- ✅ 多货币支持（USD/BRL/AUD）
- ✅ 移动端优化

### 后台管理
- ✅ 客户信息管理（查看注册信息、国家分布）
- ✅ 产品管理（增删改查）
- ✅ 数据统计面板
- ✅ WhatsApp 快捷联系入口
- ✅ 管理员权限控制

### 技术栈
- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: Node.js + Express
- **数据库**: MongoDB
- **认证**: JWT
- **样式**: 自定义 CSS（无框架依赖）

## 🚀 快速开始

### 1. 环境要求
- Node.js 16+ 
- MongoDB 4.4+
- npm 或 yarn

### 2. 安装依赖
```bash
cd ecommerce-site
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，修改以下配置：
# - JWT_SECRET（生产环境必须修改）
# - MONGODB_URI（MongoDB 连接字符串）
# - WHATSAPP_NUMBER（你的 WhatsApp 商务号码）
```

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

访问地址：
- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin
- 登录：http://localhost:3000/login

## 📁 项目结构

```
ecommerce-site/
├── backend/
│   ├── server.js          # 主服务器文件
│   ├── models/            # 数据库模型
│   │   ├── User.js       # 用户模型
│   │   └── Product.js    # 产品模型
│   └── routes/            # API 路由
│       ├── auth.js       # 认证路由
│       ├── products.js   # 产品路由
│       └── customers.js  # 客户管理路由
├── frontend/
│   ├── pages/            # HTML 页面
│   │   ├── index.html    # 首页
│   │   ├── products.html # 产品列表
│   │   ├── login.html    # 登录页
│   │   ├── register.html # 注册页
│   │   └── admin.html    # 后台管理
│   ├── styles/           # CSS 样式
│   │   ├── main.css      # 主样式
│   │   └── admin.css     # 后台样式
│   └── js/               # JavaScript
│       ├── main.js       # 前端逻辑
│       └── admin.js      # 后台逻辑
├── public/               # 静态资源
├── uploads/              # 上传文件（需创建）
├── package.json
├── .env.example
└── README.md
```

## 🎨 设计说明

### 针对目标市场的优化

**美国用户**:
- 简洁专业的视觉风格
- 清晰的 CTA 按钮
- 信任标识突出（安全支付、快速配送）

**巴西用户**:
- 热情色彩点缀（橙色/绿色）
- 社交证明强化（评价、客户数）
- WhatsApp 优先（巴西最常用通讯工具）

**澳大利亚用户**:
- 自然色调
- 真实场景图片
- 环保/品质导向文案

### 颜色方案
- 主色：`#2563eb`（专业蓝）
- WhatsApp：`#25D366`（品牌绿）
- 强调色：`#f59e0b`（活力橙）

## 🔐 创建管理员账户

默认情况下，第一个注册用户可以通过 MongoDB 手动修改为管理员：

```bash
# 连接 MongoDB
mongosh

# 切换到数据库
use ecommerce_db

# 将用户修改为管理员
db.users.updateOne(
  { email: "your-admin@email.com" },
  { $set: { role: "admin" } }
)
```

或者使用以下脚本创建管理员：

```javascript
// create-admin.js
const User = require('./backend/models/User');
// 运行后创建管理员账户
```

## 📱 WhatsApp 集成

### 配置步骤
1. 在 `.env` 中设置 `WHATSAPP_NUMBER`
2. 格式：`+15551234567`（包含国家码，无空格/符号）
3. 客户点击 WhatsApp 按钮会自动跳转到对话

### 快捷功能
- 前台：悬浮按钮，随时联系客服
- 后台：客户列表直接跳转 WhatsApp
- 自动填充问候语

## 🌐 部署指南

### 部署到 Vercel/Netlify（前端）
```bash
# 构建静态文件（如需要）
npm run build

# 部署
vercel deploy
```

### 部署到 Heroku/Railway（全栈）
```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 部署到 Heroku
heroku create your-app-name
git push heroku main

# 设置环境变量
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongo-uri
```

### 部署到自有服务器
```bash
# 使用 PM2 管理进程
npm install -g pm2
pm2 start backend/server.js --name ecommerce

# 使用 Nginx 反向代理
# 配置 SSL 证书
```

## 📊 API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户

### 产品
- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取单个产品
- `GET /api/products/featured/homepage` - 获取首页推荐产品
- `POST /api/products` - 创建产品（管理员）
- `PUT /api/products/:id` - 更新产品（管理员）
- `DELETE /api/products/:id` - 删除产品（管理员）

### 客户（管理员）
- `GET /api/customers` - 获取客户列表
- `GET /api/customers/:id` - 获取单个客户
- `GET /api/customers/stats/overview` - 获取统计数据
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户

## 🛠️ 开发说明

### 添加新产品类别
1. 在后台管理添加产品时指定 category
2. 前端会自动在筛选器显示

### 修改 WhatsApp 号码
1. 更新 `.env` 中的 `WHATSAPP_NUMBER`
2. 重启服务器
3. 或在后台设置页面修改

### 自定义样式
- 主样式：`frontend/styles/main.css`
- CSS 变量在 `:root` 中定义，方便全局修改

## ⚠️ 安全注意事项

1. **生产环境必须修改 JWT_SECRET**
2. **启用 HTTPS**（使用 Let's Encrypt 免费证书）
3. **限制上传文件大小和类型**
4. **定期备份 MongoDB 数据库**
5. **使用强密码策略**

## 📞 技术支持

- 文档：查看本 README
- WhatsApp：+1 (555) 123-4567
- Email：support@premiumstore.com

---

**版本**: 1.0.0  
**最后更新**: 2026-09-13  
**许可**: MIT
