import axios from 'axios';

import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log de configuración inicial
console.log('🔧 API Config:', {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  hasBaseURL: !!import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    console.log('📤 Request Interceptor:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!accessToken,
    });

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para debuggear
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response Success:', {
      status: response.status,
      url: response.config.url,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;