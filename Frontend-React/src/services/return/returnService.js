import api from '../api';

const returnService = {
  submitReturnRequest: async (formData) => {
    try {
      const response = await api.post('/YeuCauDoiTra', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể gửi yêu cầu đổi trả' };
    }
  },

  getMyReturnRequests: async () => {
    try {
      const response = await api.get('/YeuCauDoiTra/get-my-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tải danh sách yêu cầu' };
    }
  },

  cancelReturnRequest: async (id) => {
    try {
      const response = await api.delete(`/YeuCauDoiTra/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể hủy yêu cầu' };
    }
  },
};

export default returnService;
