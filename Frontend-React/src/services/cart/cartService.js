import api from '../api';

/**
 * Cart Service - Manages all shopping cart operations
 * Handles communication with backend API at /api/giohang
 */

const cartService = {
  /**
   * Get current user's cart
   * @returns {Promise} - List of cart items with product details
   */
  getUserCart: async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.get(`/giohang/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  /**
   * Add item to cart
   * @param {string} idSanPham - Product ID
   * @param {number} soLuong - Quantity to add
   * @returns {Promise} - API response
   */
  addToCart: async (idSanPham, soLuong = 1) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.post(`/giohang/${userId}`, {
        idSanPham,
        soLuongTrongGio: soLuong
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   * @param {string} idSanPham - Product ID
   * @returns {Promise} - API response
   */
  removeFromCart: async (idSanPham) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.delete(`/giohang/${userId}/xoamon/${idSanPham}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Increase product quantity in cart
   * @param {string} idSanPham - Product ID
   * @returns {Promise} - New quantity
   */
  increaseQuantity: async (idSanPham) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.put(`/giohang/${userId}/plus/${idSanPham}`);
      return response.data;
    } catch (error) {
      console.error('Error increasing quantity:', error);
      throw error;
    }
  },

  /**
   * Decrease product quantity in cart
   * @param {string} idSanPham - Product ID
   * @returns {Promise} - New quantity
   */
  decreaseQuantity: async (idSanPham) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.put(`/giohang/${userId}/minus/${idSanPham}`);
      return response.data;
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      throw error;
    }
  },

  /**
   * Clear entire cart (optional - if backend supports)
   * @returns {Promise} - API response
   */
  clearCart: async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      // This endpoint may not exist on backend yet
      const response = await api.delete(`/giohang/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Clear cart not supported:', error.message);
      throw error;
    }
  }
};

export default cartService;
