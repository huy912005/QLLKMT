import api from '../api';
import { STORAGE_KEYS } from './constants';

export const authService = {
  /**
   * Đăng nhập người dùng
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} Response từ backend
   */
  login: async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.data.success && res.data.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.data.token);
        localStorage.setItem(STORAGE_KEYS.USERNAME, res.data.data.username);
        if (res.data.data.userId) {
          localStorage.setItem(STORAGE_KEYS.USER_ID, res.data.data.userId);
        }
        // Dispatch custom event for Header to update immediately
        window.dispatchEvent(new Event('authStateChanged'));
      }
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  /**
   * Đăng ký tài khoản mới
   * @param {string} username - Username
   * @param {string} email - Email
   * @param {string} password - Password
   * @param {string} hoTen - Họ và tên
   * @returns {Promise} Response từ backend
   */
  register: async (username, email, password, hoTen) => {
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        hoTen,
        // Không gửi confirmPassword lên backend
      });
      // ✅ KHÔNG lưu token ở đây — người dùng cần tự ĐỢI ĐĂNG NHẬP sau khi tạo tài khoản
      // Việc lưu token tự động sau register gây hiện tên trên header trước khi đăng nhập
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  /**
   * Quên mật khẩu
   * @param {string} email - Email
   * @returns {Promise} Response từ backend
   */
  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {object} Thông tin từ localStorage hoặc null
   */
  getCurrentUser: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME);
    
    if (token && username) {
      return {
        token,
        username,
        userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
      };
    }
    return null;
  },

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Đăng xuất
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    // Dispatch custom event for Header to update immediately
    window.dispatchEvent(new Event('authStateChanged'));
  },
};

export default authService;
