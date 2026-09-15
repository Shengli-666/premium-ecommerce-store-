// ===== Main JavaScript =====

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  
  if (mobileMenuBtn) {
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Contact form handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // In production, send to backend
      console.log('Contact form submitted:', data);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon via WhatsApp.');
      contactForm.reset();
      
      // Optionally redirect to WhatsApp
      // window.open(`https://wa.me/15551234567?text=${encodeURIComponent(data.message)}`, '_blank');
    });
  }
  
  // Check auth status on page load
  checkAuthStatus();
});

// Auth Status Check
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    const userData = JSON.parse(user);
    updateNavForLoggedInUser(userData);
  }
}

// Update Navigation for Logged In User
function updateNavForLoggedInUser(user) {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;
  
  if (user.role === 'admin') {
    navActions.innerHTML = `
      <a href="/admin" class="btn btn-outline">Admin Panel</a>
      <button onclick="logout()" class="btn btn-danger">Logout</button>
    `;
  } else {
    navActions.innerHTML = `
      <span class="btn btn-outline" style="cursor: default;">Hi, ${user.firstName}</span>
      <button onclick="logout()" class="btn btn-outline">Logout</button>
    `;
  }
}

// Logout Function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Format Currency
function formatCurrency(amount, currency = 'USD') {
  const locales = {
    'USD': 'en-US',
    'BRL': 'pt-BR',
    'AUD': 'en-AU'
  };
  
  const symbols = {
    'USD': '$',
    'BRL': 'R$',
    'AUD': 'A$'
  };
  
  return new Intl.NumberFormat(locales[currency] || 'en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Get User Initials
function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Copy WhatsApp Link
function copyWhatsAppLink() {
  const number = '+15551234567';
  const message = 'Hello! I am interested in your products.';
  const link = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  copyToClipboard(link);
}

// API Helper
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

// Detect User Country (for future localization)
function detectUserCountry() {
  // This is a placeholder - in production, use IP geolocation
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles')) {
    return 'US';
  } else if (timezone.includes('America/Sao_Paulo')) {
    return 'BR';
  } else if (timezone.includes('Australia/')) {
    return 'AU';
  }
  
  return 'OTHER';
}

// Console welcome message
console.log('%c Premium Store ', 'background: #2563eb; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px;');
console.log('Welcome to Premium Store - Global E-commerce Platform');
