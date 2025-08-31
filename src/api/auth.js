import api from './config.js';

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('nana_token', response.data.token);
      localStorage.setItem('nana_user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('nana_token', response.data.token);
      localStorage.setItem('nana_user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Google OAuth login
  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    if (response.data.token) {
      localStorage.setItem('nana_token', response.data.token);
      localStorage.setItem('nana_user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Get current user
  getMe: async () => {
    return await api.get('/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await api.put('/auth/password', { currentPassword, newPassword });
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('nana_token');
      localStorage.removeItem('nana_user');
      localStorage.removeItem('nana_login_status');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('nana_token');
  },

  // Get stored user data
  getCurrentUser: () => {
    const userStr = localStorage.getItem('nana_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authAPI;