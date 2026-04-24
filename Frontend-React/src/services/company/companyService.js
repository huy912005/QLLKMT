import api from '../api';

const companyService = {
  getAll: async () => {
    try {
      const response = await api.get('/congty');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error.response?.data || error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/congty', data);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error.response?.data || error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/congty/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error.response?.data || error;
    }
  },
  remove: async (id) => {
    try {
      const response = await api.delete(`/congty/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error.response?.data || error;
    }
  }
};

export default companyService;
