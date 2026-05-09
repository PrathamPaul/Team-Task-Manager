import { createApiClient } from './apiClient';

const API = createApiClient('auth');

export const signupUser = (data) => API.post('/signup', data);
export const loginUser = (data) => API.post('/login', data);
export const getCurrentUser = () => API.get('/me');
