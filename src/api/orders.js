import api from './config.js';

// Orders API functions
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  // Get user's orders
  getMyOrders: async (page = 1, limit = 10) => {
    return await api.get(`/orders?page=${page}&limit=${limit}`);
  },

  // Get single order
  getOrder: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    return await api.put(`/orders/${orderId}/cancel`, { reason });
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/orders/admin/all?${queryString}` : '/orders/admin/all';
    return await api.get(endpoint);
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status, trackingInfo = {}) => {
    return await api.put(`/orders/${orderId}/status`, {
      status,
      ...trackingInfo
    });
  }
};

export default ordersAPI;