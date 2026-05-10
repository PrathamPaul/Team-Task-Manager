import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://team-task-manager-backend-kappa.vercel.app/api';
const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;

const getAuthToken = () => localStorage.getItem('token');

export const createApiClient = (path) => {
  const API = axios.create({
    baseURL: `${API_BASE_URL.replace(/\/$/, '')}/${path}`,
    timeout: 15000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  API.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }

      error.userMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';

      return Promise.reject(error);
    }
  );

  return API;
};
