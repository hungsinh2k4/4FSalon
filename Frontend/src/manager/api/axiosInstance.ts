// src/manager/api/axiosInstance.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để thêm token vào headers nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung, ví dụ: logout nếu token hết hạn
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/manager/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
