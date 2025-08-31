const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Google OAuth 정보
  googleId: {
    type: String,
    sparse: true
  },
  loginType: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  // 주소 정보
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home'
    },
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'South Korea'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  // 위시리스트
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // 장바구니
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: String,
    color: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // 계정 설정
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      orders: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      newProducts: { type: Boolean, default: false }
    },
    language: {
      type: String,
      enum: ['ko', 'en', 'jp'],
      default: 'ko'
    },
    currency: {
      type: String,
      enum: ['KRW', 'USD', 'JPY'],
      default: 'KRW'
    }
  },
  // 비밀번호 재설정
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // 이메일 인증
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  // 마지막 로그인
  lastLogin: Date,
  lastLoginIP: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order count
userSchema.virtual('orderCount', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
  count: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ 'addresses.isDefault': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();
  
  // Only hash if password exists (for Google OAuth users)
  if (this.password) {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get JWT token
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Static method to find user by email or googleId
userSchema.statics.findByEmailOrGoogleId = function(email, googleId) {
  const query = { $or: [{ email }] };
  if (googleId) {
    query.$or.push({ googleId });
  }
  return this.findOne(query);
};

// Method to add item to cart
userSchema.methods.addToCart = function(productId, quantity = 1, size, color) {
  const existingItem = this.cart.find(
    item => item.product.toString() === productId.toString() && 
             item.size === size && 
             item.color === color
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity,
      size,
      color,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove item from cart
userSchema.methods.removeFromCart = function(cartItemId) {
  this.cart = this.cart.filter(item => item._id.toString() !== cartItemId.toString());
  return this.save();
};

// Method to clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);