import { createApiClient } from './apiClient';

const API = createApiClient('tasks');

export const createTask = (data) => API.post('/create', data);
export const getProjectTasks = (projectId) => API.get(`/${projectId}`);
export const updateTask = (taskId, data) => API.put(`/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/${taskId}`);
export const updateTaskStatus = (taskId, status) => API.patch(`/${taskId}/status`, { status });
