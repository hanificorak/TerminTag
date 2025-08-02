import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axios instance oluşturuyoruz
const api = axios.create({
  baseURL: 'http://localhost', // API URL'nizi buraya ekleyin
  headers: {
    'Content-Type': 'application/json', // Varsayılan header
  },
});

// Request interceptor ekliyoruz
api.interceptors.request.use(
  async (config) => {
    // Token'ı AsyncStorage'dan alıyoruz
    const token = await AsyncStorage.getItem('token');
    
    // Token varsa, Authorization header'ına ekliyoruz
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
