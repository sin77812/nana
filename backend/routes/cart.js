const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price images inventory status isActive'
      });

    // Filter out inactive products or products not found
    const validCartItems = user.cart.filter(item => 
      item.product && 
      item.product.isActive && 
      item.product.status === 'active'
    );

    // Update cart if items were filtered out
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }

    // Calculate totals
    let subtotal = 0;
    const cartItems = validCartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        total: itemTotal,
        addedAt: item.addedAt
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cartItems,
          itemCount: cartItems.length,
          totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: subtotal,
          total: subtotal // For now, just subtotal. Add shipping, tax later
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting cart'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Size cannot be empty'),
  body('color')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Color cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity = 1, size, color } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive || product.status !== 'active') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or not available'
      });
    }

    // Check inventory if tracked
    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient inventory',
        available: product.inventory.quantity
      });
    }

    // Add to cart
    const user = await User.findById(req.user.id);
    await user.addToCart(productId, quantity, size, color);

    // Return updated cart
    const updatedUser = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price images'
      });

    const addedItem = updatedUser.cart[updatedUser.cart.length - 1];

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully',
      data: {
        item: {
          _id: addedItem._id,
          product: addedItem.product,
          quantity: addedItem.quantity,
          size: addedItem.size,
          color: addedItem.color,
          total: addedItem.product.price * addedItem.quantity,
          addedAt: addedItem.addedAt
        }
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error adding item to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
router.put('/:itemId', [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user.id)
      .populate('cart.product');

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }

    // Check inventory if tracked
    if (cartItem.product.inventory.trackQuantity && 
        cartItem.product.inventory.quantity < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient inventory',
        available: cartItem.product.inventory.quantity
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated successfully',
      data: {
        item: {
          _id: cartItem._id,
          product: cartItem.product,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          total: cartItem.product.price * cartItem.quantity
        }
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating cart item'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const user = await User.findById(req.user.id);
    await user.removeFromCart(itemId);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error removing item from cart'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.clearCart();

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error clearing cart'
    });
  }
});

module.exports = router;