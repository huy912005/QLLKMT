import axios from 'axios';

// Đây là "gã đưa thư" của hệ thống React
const api = axios.create({
  // Địa chỉ của Backend Java Spring Boot
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Chỗ này dành cho tương lai: Mỗi khi gửi request, nếu đã đăng nhập thì nhét Token vào
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Đây là chuẩn Security của Java
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
