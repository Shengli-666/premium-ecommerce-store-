// ===== Admin Dashboard JavaScript =====

// Check admin authentication on load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadDashboardStats();
});

// Check Admin Authentication
async function checkAdminAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = '/login';
    return;
  }
  
  const userData = JSON.parse(user);
  if (userData.role !== 'admin') {
    alert('Admin access required');
    window.location.href = '/';
    return;
  }
  
  // Update admin name in header
  const adminNameEl = document.getElementById('admin-name');
  if (adminNameEl) {
    adminNameEl.textContent = `${userData.firstName} ${userData.lastName}`;
  }
}

// Show Section
function showSection(sectionName) {
  // Update navigation
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
  
  // Update page title
  const titles = {
    'dashboard': 'Dashboard',
    'customers': 'Customer Management',
    'products': 'Product Management',
    'orders': 'Orders',
    'settings': 'Settings'
  };
  document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
  
  // Show/hide sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`${sectionName}-section`)?.classList.add('active');
  
  // Load section data
  switch(sectionName) {
    case 'dashboard':
      loadDashboardStats();
      break;
    case 'customers':
      loadCustomers();
      break;
    case 'products':
      loadAdminProducts();
      break;
  }
}

// Load Dashboard Statistics
async function loadDashboardStats() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/customers/stats/overview', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load stats');
    }
    
    const data = await response.json();
    const stats = data.statistics;
    
    // Update stat cards
    document.getElementById('total-customers').textContent = stats.totalCustomers || 0;
    document.getElementById('active-customers').textContent = stats.activeCustomers || 0;
    document.getElementById('total-products').textContent = '-'; // Load from products API
    
    // Render customers by country
    renderCustomersByCountry(stats.customersByCountry || []);
    
    // Render recent customers
    renderRecentCustomers(stats.recentCustomers || []);
    
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
    // Show sample data for demo
    showDemoDashboardData();
  }
}

// Show Demo Dashboard Data (when API not available)
function showDemoDashboardData() {
  document.getElementById('total-customers').textContent = '156';
  document.getElementById('active-customers').textContent = '142';
  document.getElementById('total-products').textContent = '24';
  
  const demoCountries = [
    { _id: 'US', count: 78 },
    { _id: 'BR', count: 45 },
    { _id: 'AU', count: 23 },
    { _id: 'OTHER', count: 10 }
  ];
  renderCustomersByCountry(demoCountries);
  
  const demoCustomers = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', country: 'US', createdAt: new Date().toISOString() },
    { firstName: 'Maria', lastName: 'Silva', email: 'maria@example.com', country: 'BR', createdAt: new Date().toISOString() },
    { firstName: 'James', lastName: 'Smith', email: 'james@example.com', country: 'AU', createdAt: new Date().toISOString() }
  ];
  renderRecentCustomers(demoCustomers);
}

// Render Customers by Country
function renderCustomersByCountry(countries) {
  const container = document.getElementById('customers-by-country');
  if (!container) return;
  
  const flags = {
    'US': '🇺🇸',
    'BR': '🇧🇷',
    'AU': '🇦🇺',
    'OTHER': '🌍'
  };
  
  const names = {
    'US': 'United States',
    'BR': 'Brazil',
    'AU': 'Australia',
    'OTHER': 'Other Countries'
  };
  
  container.innerHTML = countries.map(country => `
    <div class="country-bar">
      <span class="country-flag">${flags[country._id] || '🌍'}</span>
      <span class="country-name">${names[country._id] || country._id}</span>
      <span class="country-count">${country.count} customers</span>
    </div>
  `).join('');
}

// Render Recent Customers
function renderRecentCustomers(customers) {
  const container = document.getElementById('recent-customers');
  if (!container) return;
  
  container.innerHTML = customers.map(customer => `
    <div class="customer-item">
      <div class="customer-info">
        <div class="customer-avatar">${getInitials(customer.firstName, customer.lastName)}</div>
        <div class="customer-details">
          <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
          <div class="customer-email">${customer.email}</div>
        </div>
      </div>
      <div class="customer-date">${formatDate(customer.createdAt)}</div>
    </div>
  `).join('');
}

// Load Customers
async function loadCustomers() {
  try {
    const token = localStorage.getItem('token');
    const search = document.getElementById('customer-search')?.value || '';
    const country = document.getElementById('country-filter')?.value || '';
    
    let url = '/api/customers?page=1&limit=20';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (country) url += `&country=${country}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load customers');
    }
    
    const data = await response.json();
    renderCustomersTable(data.customers || []);
    
  } catch (error) {
    console.error('Failed to load customers:', error);
    // Show demo data
    showDemoCustomersData();
  }
}

// Show Demo Customers Data
function showDemoCustomersData() {
  const demoCustomers = [
    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', country: 'US', whatsapp: '+15551234567', createdAt: new Date().toISOString() },
    { _id: '2', firstName: 'Maria', lastName: 'Silva', email: 'maria@example.com', country: 'BR', whatsapp: '+5511999999999', createdAt: new Date().toISOString() },
    { _id: '3', firstName: 'James', lastName: 'Smith', email: 'james@example.com', country: 'AU', whatsapp: '+61412345678', createdAt: new Date().toISOString() },
    { _id: '4', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', country: 'US', whatsapp: '+15559876543', createdAt: new Date().toISOString() },
    { _id: '5', firstName: 'Pedro', lastName: 'Santos', email: 'pedro@example.com', country: 'BR', whatsapp: '+5521888888888', createdAt: new Date().toISOString() }
  ];
  renderCustomersTable(demoCustomers);
}

// Render Customers Table
function renderCustomersTable(customers) {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  
  const flags = {
    'US': '🇺🇸',
    'BR': '🇧🇷',
    'AU': '🇦🇺',
    'OTHER': '🌍'
  };
  
  tbody.innerHTML = customers.map(customer => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>${flags[customer.country] || '🌍'}</span>
          <strong>${customer.firstName} ${customer.lastName}</strong>
        </div>
      </td>
      <td>${customer.email}</td>
      <td>${customer.country}</td>
      <td>${customer.whatsapp || '-'}</td>
      <td>${formatDate(customer.createdAt)}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="contactWhatsApp('${customer.whatsapp}')" title="WhatsApp">💬</button>
          <button class="btn-icon" onclick="viewCustomer('${customer._id}')" title="View">👁️</button>
          <button class="btn-icon" onclick="deleteCustomer('${customer._id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Contact via WhatsApp
function contactWhatsApp(number) {
  if (!number) {
    alert('No WhatsApp number available');
    return;
  }
  const message = 'Hello! I saw your inquiry on our website. How can I help you?';
  window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
}

// View Customer
function viewCustomer(id) {
  alert(`View customer details: ${id}`);
  // Implement full customer detail view
}

// Delete Customer
async function deleteCustomer(id) {
  if (!confirm('Are you sure you want to delete this customer?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      alert('Customer deleted successfully');
      loadCustomers();
    } else {
      alert('Failed to delete customer');
    }
  } catch (error) {
    console.error('Delete customer error:', error);
    alert('Failed to delete customer');
  }
}

// Load Admin Products
async function loadAdminProducts() {
  try {
    const response = await fetch('/api/products?limit=20');
    const data = await response.json();
    renderAdminProducts(data.products || []);
  } catch (error) {
    console.error('Failed to load products:', error);
    showDemoProductsData();
  }
}

// Show Demo Products Data
function showDemoProductsData() {
  const demoProducts = [
    { _id: '1', name: 'Premium Wireless Headphones', price: 149.99, images: [{ url: '' }] },
    { _id: '2', name: 'Smart Watch Pro', price: 299.99, images: [{ url: '' }] },
    { _id: '3', name: 'Portable Bluetooth Speaker', price: 79.99, images: [{ url: '' }] },
    { _id: '4', name: 'USB-C Hub Adapter', price: 49.99, images: [{ url: '' }] }
  ];
  renderAdminProducts(demoProducts);
}

// Render Admin Products
function renderAdminProducts(products) {
  const grid = document.getElementById('admin-products-grid');
  if (!grid) return;
  
  grid.innerHTML = products.map(product => `
    <div class="admin-product-card">
      <div class="admin-product-image">
        ${product.images?.[0]?.url ? `<img src="${product.images[0].url}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">` : '📦'}
      </div>
      <div class="admin-product-info">
        <div class="admin-product-title">${product.name}</div>
        <div class="admin-product-price">$${product.price.toFixed(2)}</div>
        <div class="admin-product-actions">
          <button class="btn btn-outline btn-sm" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Edit Product
function editProduct(id) {
  alert(`Edit product: ${id}`);
  // Implement product edit modal
}

// Delete Product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      alert('Product deleted successfully');
      loadAdminProducts();
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    console.error('Delete product error:', error);
    alert('Failed to delete product');
  }
}

// Show Add Product Modal
function showAddProductModal() {
  alert('Add Product modal - implement full form');
  // Implement product add modal with form
}

// Save Settings
function saveSettings() {
  const whatsappNumber = document.getElementById('whatsapp-number')?.value;
  const whatsappMessage = document.getElementById('whatsapp-message')?.value;
  
  // Save to localStorage or backend
  localStorage.setItem('whatsappNumber', whatsappNumber);
  localStorage.setItem('whatsappMessage', whatsappMessage);
  
  alert('Settings saved successfully!');
}

// Search and Filter Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('customer-search');
  const countryFilter = document.getElementById('country-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      setTimeout(() => loadCustomers(), 500);
    });
  }
  
  if (countryFilter) {
    countryFilter.addEventListener('change', loadCustomers);
  }
});
