const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxLength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['fashion', 'beauty', 'lifestyle', 'accessories'],
    lowercase: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['collection', 'beauty', 'lifestyle'],
    required: true
  },
  // 상품 이미지
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  // 색상 옵션
  colors: [{
    name: String,
    code: String, // 헥사 컬러 코드
    image: String // 색상별 이미지 URL
  }],
  // 사이즈 옵션
  sizes: [{
    name: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
    },
    measurements: {
      chest: Number,
      waist: Number,
      hip: Number,
      length: Number
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  // 재고 관리
  inventory: {
    trackQuantity: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    }
  },
  // 상품 상태
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // 배지
  badge: {
    type: String,
    enum: ['NEW', 'BEST', 'SALE', 'LIMITED', 'LUXURY', 'VINTAGE'],
    uppercase: true
  },
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: String,
  metaDescription: String,
  tags: [String],
  // 배송 정보
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  // 상품 상세 정보
  details: {
    material: String,
    care: String,
    madeIn: String,
    modelInfo: String
  },
  // 평점 및 리뷰
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // 판매 통계
  sales: {
    totalSold: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  },
  // 매거진 관련 (Editorial Content)
  editorial: {
    isEditorial: {
      type: Boolean,
      default: false
    },
    storyTitle: String,
    storyContent: String,
    stylingTips: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0;
});

// Virtual for low stock
productSchema.virtual('isLowStock').get(function() {
  if (!this.inventory.trackQuantity) return false;
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, type: 1 });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 }, { unique: true });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 8) {
  return this.find({
    status: 'active',
    isActive: true,
    isFeatured: true
  }).limit(limit).sort({ createdAt: -1 });
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({
    status: 'active',
    isActive: true,
    category: category
  }).limit(limit).sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = -1,
    limit = 20,
    skip = 0
  } = options;

  let searchQuery = {
    status: 'active',
    isActive: true
  };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (category && category !== 'all') {
    searchQuery.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = minPrice;
    if (maxPrice) searchQuery.price.$lte = maxPrice;
  }

  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip);
};

// Method to update inventory
productSchema.methods.updateInventory = function(quantity) {
  if (this.inventory.trackQuantity) {
    this.inventory.quantity -= quantity;
    if (this.inventory.quantity < 0) {
      throw new Error('Insufficient inventory');
    }
  }
  return this.save();
};

// Method to add review (updates rating)
productSchema.methods.addReview = function(rating) {
  const totalRating = (this.rating.average * this.rating.count) + rating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);