import api from '../api';

const reviewService = {
  getReviewsByProduct: async (idSanPham) => {
    try {
      const response = await api.get(`/DanhGia?idSanPham=${idSanPham}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tải đánh giá' };
    }
  },

  submitReview: async (formData) => {
    try {
      // Vì là multipart/form-data (có file), ta gửi formData trực tiếp
      const response = await api.post('/DanhGia', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể gửi đánh giá' };
    }
  },
};

export default reviewService;
