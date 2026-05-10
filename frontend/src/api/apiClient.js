import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:9000/api';

const normalizeApiBaseUrl = (baseUrl) => {
  const trimmed = (baseUrl || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const getAuthToken = () => localStorage.getItem('token');

export const createApiClient = (path) => {
  const API = axios.create({
    baseURL: `${API_BASE_URL}/${path.replace(/^\/+/, '')}`,
    timeout: 15000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem('token');
      }

      error.userMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.code === 'ECONNABORTED' && 'The request timed out. Please try again.') ||
        (!error.response && 'Unable to reach the server. Check the API URL and CORS settings.') ||
        error.message ||
        'Something went wrong. Please try again.';

      return Promise.reject(error);
    }
  );

  return API;
};
