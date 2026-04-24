import api from '../api';

const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/loaisanpham');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error.response?.data || error;
    }
  },
  upsert: async (data) => {
    try {
      const response = await api.post('/loaisanpham/upsert', data);
      return response.data;
    } catch (error) {
      console.error('Error upserting category:', error);
      throw error.response?.data || error;
    }
  },
  remove: async (id) => {
    try {
      const response = await api.delete(`/loaisanpham/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error.response?.data || error;
    }
  }
};

export default categoryService;
