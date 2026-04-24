import api from '../api';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      // Theo cấu trúc UserController, getAll() trả về trực tiếp mảng các user
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error.response?.data || error;
    }
  },

  getRoles: async () => {
    try {
      const response = await api.get('/admin/users/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error.response?.data || error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users/create', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error.response?.data || error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || error;
    }
  }
};

export default userService;
