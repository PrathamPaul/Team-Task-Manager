import { createApiClient } from './apiClient';

const API = createApiClient('activity');

export const getAllLogs = () => API.get('/');
export const getEntityLogs = (entityType, entityId) => API.get(`/${entityType}/${entityId}`);

