import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';

export const createApiClient = (path) => {
  const API = axios.create({
    baseURL: `${API_BASE_URL.replace(/\/$/, '')}/${path}`,
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return API;
};
