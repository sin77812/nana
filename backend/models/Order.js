const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 주문 번호 (자동 생성)
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  // 주문 상품들
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // 상품명 스냅샷
    image: String, // 대표 이미지 URL
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String,
    total: {
      type: Number,
      required: true
    }
  }],
  // 배송 정보
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'South Korea'
    },
    instructions: String // 배송 요청사항
  },
  // 결제 정보
  payment: {
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'paypal', 'kakaopay', 'naverpay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String, // 결제 시스템의 거래 ID
    paymentDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundDate: Date
  },
  // 금액 정보
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  // 주문 상태
  status: {
    type: String,
    enum: [
      'pending',      // 결제 대기
      'paid',         // 결제 완료
      'processing',   // 준비중
      'shipped',      // 배송 중
      'delivered',    // 배송 완료
      'cancelled',    // 취소
      'refunded'      // 환불
    ],
    default: 'pending'
  },
  // 배송 추적
  tracking: {
    carrier: String,        // 택배사
    trackingNumber: String, // 송장번호
    shippedDate: Date,
    deliveredDate: Date,
    estimatedDelivery: Date
  },
  // 쿠폰 정보
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['fixed', 'percentage']
    }
  },
  // 주문 메모 (고객/관리자)
  notes: {
    customer: String,
    admin: String
  },
  // 취소/환불 정보
  cancellation: {
    reason: String,
    requestDate: Date,
    processedDate: Date,
    refundMethod: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for can cancel (within 24 hours and not shipped)
orderSchema.virtual('canCancel').get(function() {
  if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(this.status)) {
    return false;
  }
  const hoursSinceOrder = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  return hoursSinceOrder < 24;
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order number for today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const lastOrder = await this.constructor
      .findOne({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
      .sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.substr(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `NANA${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status })
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('items.product', 'name images slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get sales stats
orderSchema.statics.getSalesStats = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        status: { $in: ['paid', 'processing', 'shipped', 'delivered'] },
        createdAt: {
          $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          $lte: endDate || new Date()
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0
  };
};

// Method to update status with timestamp
orderSchema.methods.updateStatus = function(newStatus, note = null) {
  this.status = newStatus;
  
  // Update relevant timestamps
  switch (newStatus) {
    case 'paid':
      this.payment.status = 'completed';
      this.payment.paymentDate = new Date();
      break;
    case 'shipped':
      this.tracking.shippedDate = new Date();
      break;
    case 'delivered':
      this.tracking.deliveredDate = new Date();
      break;
    case 'cancelled':
      this.cancellation.processedDate = new Date();
      break;
  }
  
  if (note) {
    this.notes.admin = note;
  }
  
  return this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.pricing.total = this.pricing.subtotal + this.pricing.shippingCost + this.pricing.tax - this.pricing.discount;
  return this.pricing.total;
};

module.exports = mongoose.model('Order', orderSchema);