import { createApiClient } from './apiClient';

const API = createApiClient('teams');

export const createTeam = (data) => API.post('/create', data);
export const joinTeam = (data) => API.post('/join', data);
export const getUserTeams = () => API.get('/my-teams');
