import api from '../api';

/**
 * Order Service - Manages all order operations
 * Handles communication with backend API at /api/dondathang
 */

const orderService = {
  /**
   * Get current user's orders
   * @param {string} userId - User ID
   * @returns {Promise} - List of orders
   */
  getUserOrders: async (userId) => {
    try {
      if (!userId) {
        throw new Error('Vui lòng đăng nhập trước');
      }

      const response = await api.get(`/dondathang/my-orders/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Get order details
   * @param {string} orderId - Order ID
   * @returns {Promise} - Order details with items
   */
  getOrderDetail: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await api.get(`/dondathang/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  },

  /**
   * Get all orders (Admin)
   * @returns {Promise} - List of all orders
   */
  getAllOrders: async () => {
    try {
      const response = await api.get('/dondathang/admin/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  /**
   * Update order status (Admin)
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status (CHO_XAC_NHAN, DA_GIAO, etc)
   * @returns {Promise} - API response
   */
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await api.put(`/dondathang/${orderId}/trangthai?newStatus=${newStatus}`);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel order (Customer)
   * @param {string} orderId - Order ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  cancelOrder: async (orderId, userId) => {
    try {
      const response = await api.put(`/dondathang/${orderId}/cancel/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Reorder (Customer copies a past order to cart)
   * @param {string} orderId - Order ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  reorder: async (orderId, userId) => {
    try {
      const response = await api.post(`/dondathang/${orderId}/reorder/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error reordering:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Delete order (Admin)
   * @param {string} orderId - Order ID
   * @returns {Promise} - API response
   */
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/dondathang/admin/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error.response?.data || error;
    }
  }
};

export default orderService;
