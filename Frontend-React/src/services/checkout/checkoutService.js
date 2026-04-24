import api from '../api';

/**
 * checkoutService
 * Handles checkout & MoMo payment API calls to Java Spring Boot backend
 */
const checkoutService = {
  /**
   * Confirm order with COD or other non-redirect methods
   * POST /api/checkout/confirm
   */
  confirmOrder: async (paymentMethod = 'cod') => {
    try {
      const response = await api.post('/checkout/confirm', { paymentMethod });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create MoMo payment link
   * POST /api/checkout/momo/create
   * Returns { payUrl, ... }
   */
  createMomoPayment: async ({ fullName, orderInfo, amount }) => {
    try {
      const response = await api.post('/checkout/momo/create', {
        fullName,
        orderInfo,
        amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify/save MoMo payment after return
   * Called from MomoReturn page if needed
   * POST /api/checkout/momo/verify
   */
  verifyMomoPayment: async (params) => {
    try {
      const response = await api.post('/checkout/momo/verify', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default checkoutService;
