import api from './config.js';

// Products API functions
export const productsAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await api.get(endpoint);
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    return await api.get(`/products/featured?limit=${limit}`);
  },

  // Get products by category
  getByCategory: async (category, limit = 20) => {
    return await api.get(`/products/category/${category}?limit=${limit}`);
  },

  // Get single product
  getProduct: async (productId) => {
    return await api.get(`/products/${productId}`);
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    const params = { search: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/products?${queryString}`);
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  // Update product (Admin only)
  updateProduct: async (productId, productData) => {
    return await api.put(`/products/${productId}`, productData);
  },

  // Delete product (Admin only)
  deleteProduct: async (productId) => {
    return await api.delete(`/products/${productId}`);
  }
};

export default productsAPI;