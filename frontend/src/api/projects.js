import { createApiClient } from './apiClient';

const API = createApiClient('projects');

export const createProject = (data) => API.post('/create', data);
export const getTeamProjects = (teamId) => API.get(`/${teamId}`);
export const updateProject = (projectId, data) => API.put(`/${projectId}`, data);
export const deleteProject = (projectId) => API.delete(`/${projectId}`);
