const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// In-memory database (for development without MongoDB)
const db = {
  users: [],
  products: [],
  orders: [],
  carts: {}
};

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8083',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    req.user = db.users.find(u => u.id === decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NANA Backend DEV API is running',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      cart: [],
      wishlist: [],
      addresses: []
    };
    
    db.users.push(user);
    
    // Generate token
    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// Google OAuth (simplified for dev)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // In a real app, verify the Google token
    // For dev, we'll create a mock user
    const mockGoogleUser = {
      id: 'google_' + Date.now().toString(),
      name: 'Google User',
      email: `user${Date.now()}@gmail.com`,
      avatar: 'https://via.placeholder.com/150',
      loginType: 'google',
      createdAt: new Date(),
      cart: [],
      wishlist: [],
      addresses: []
    };
    
    // Check if user exists
    let user = db.users.find(u => u.email === mockGoogleUser.email);
    if (!user) {
      db.users.push(mockGoogleUser);
      user = mockGoogleUser;
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during Google login'
    });
  }
});

// Get current user
app.get('/api/auth/me', verifyToken, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      user: userWithoutPassword
    }
  });
});

// ==================== PRODUCTS ROUTES ====================

// Initialize sample products
const initProducts = () => {
  if (db.products.length === 0) {
    const categories = ['fashion', 'beauty', 'lifestyle'];
    const types = ['collection', 'beauty', 'lifestyle'];
    
    for (let i = 1; i <= 30; i++) {
      db.products.push({
        id: i.toString(),
        name: `Product ${i}`,
        description: `This is a beautiful product ${i}`,
        price: Math.floor(Math.random() * 50000) + 10000,
        category: categories[i % 3],
        type: types[i % 3],
        images: [`https://picsum.photos/400/600?random=${i}`],
        colors: ['#FFB7C5', '#87CEEB', '#E6E6FA'],
        sizes: ['S', 'M', 'L', 'XL'],
        inventory: { quantity: 100, trackQuantity: true },
        status: 'active',
        isActive: true,
        isFeatured: i <= 8,
        badge: i <= 3 ? 'NEW' : i <= 6 ? 'BEST' : null,
        createdAt: new Date()
      });
    }
  }
};

initProducts();

// Get all products
app.get('/api/products', (req, res) => {
  const { category, type, page = 1, limit = 20, sort = 'createdAt' } = req.query;
  
  let filteredProducts = [...db.products];
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Filter by type
  if (type) {
    filteredProducts = filteredProducts.filter(p => p.type === type);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.status(200).json({
    status: 'success',
    results: paginatedProducts.length,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(filteredProducts.length / limit),
      total: filteredProducts.length
    },
    data: {
      products: paginatedProducts
    }
  });
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  const featuredProducts = db.products.filter(p => p.isFeatured);
  res.status(200).json({
    status: 'success',
    data: {
      products: featuredProducts
    }
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// ==================== CART ROUTES ====================

// Get cart
app.get('/api/cart', verifyToken, (req, res) => {
  const userCart = db.carts[req.userId] || [];
  
  // Calculate totals
  let subtotal = 0;
  const cartItems = userCart.map(item => {
    const product = db.products.find(p => p.id === item.productId);
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    return {
      _id: item.id,
      product,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      total: itemTotal
    };
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        items: cartItems,
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        total: subtotal
      }
    }
  });
});

// Add to cart
app.post('/api/cart', verifyToken, (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;
  
  // Check if product exists
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  
  // Initialize user cart if doesn't exist
  if (!db.carts[req.userId]) {
    db.carts[req.userId] = [];
  }
  
  // Check if item already in cart
  const existingItem = db.carts[req.userId].find(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    db.carts[req.userId].push({
      id: Date.now().toString(),
      productId,
      quantity,
      size,
      color,
      addedAt: new Date()
    });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Item added to cart successfully'
  });
});

// Remove from cart
app.delete('/api/cart/:itemId', verifyToken, (req, res) => {
  if (db.carts[req.userId]) {
    db.carts[req.userId] = db.carts[req.userId].filter(
      item => item.id !== req.params.itemId
    );
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart'
  });
});

// ==================== ORDERS ROUTES ====================

// Create order
app.post('/api/orders', verifyToken, (req, res) => {
  const { items, shippingAddress, payment } = req.body;
  
  const order = {
    id: Date.now().toString(),
    orderNumber: `NANA${Date.now()}`,
    userId: req.userId,
    items,
    shippingAddress,
    payment,
    status: 'pending',
    createdAt: new Date()
  };
  
  db.orders.push(order);
  
  // Clear user cart
  db.carts[req.userId] = [];
  
  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get user orders
app.get('/api/orders', verifyToken, (req, res) => {
  const userOrders = db.orders.filter(o => o.userId === req.userId);
  
  res.status(200).json({
    status: 'success',
    data: {
      orders: userOrders
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🌸 NANA Backend DEV Server is running!
📍 Port: ${PORT}
🌍 Environment: development (In-Memory Database)
🎯 Health Check: http://localhost:${PORT}/api/health

⚠️  Note: This is a development server using in-memory storage.
    Data will be lost when the server restarts.
  `);
});