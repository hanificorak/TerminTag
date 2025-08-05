import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './RootNavigation';  // burayı ekle
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://localhost',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      Alert.alert('Uyarı', 'Giriş süreniz doldu. Lütfen tekrar giriş yapınız.');
      navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
