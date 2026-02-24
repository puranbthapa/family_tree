import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/password', data),
};

// Family Trees API
export const treesApi = {
  list: (page = 1) => api.get(`/trees?page=${page}`),
  get: (id) => api.get(`/trees/${id}`),
  create: (data) => api.post('/trees', data),
  update: (id, data) => api.put(`/trees/${id}`, data),
  delete: (id) => api.delete(`/trees/${id}`),
  statistics: (id) => api.get(`/trees/${id}/statistics`),
};

// Persons API
export const personsApi = {
  list: (treeId, params = {}) => api.get(`/trees/${treeId}/persons`, { params }),
  get: (treeId, personId) => api.get(`/trees/${treeId}/persons/${personId}`),
  create: (treeId, data) => api.post(`/trees/${treeId}/persons`, data),
  update: (treeId, personId, data) => api.put(`/trees/${treeId}/persons/${personId}`, data),
  delete: (treeId, personId) => api.delete(`/trees/${treeId}/persons/${personId}`),
  search: (treeId, q) => api.get(`/trees/${treeId}/persons/search`, { params: { q } }),
  duplicates: (treeId) => api.get(`/trees/${treeId}/persons/duplicates`),
  updatePositions: (treeId, positions) => api.post(`/trees/${treeId}/persons/positions`, { positions }),
  uploadPhoto: (treeId, personId, formData) =>
    api.post(`/trees/${treeId}/persons/${personId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePhoto: (treeId, personId) => api.delete(`/trees/${treeId}/persons/${personId}/photo`),
};

// Relationships API
export const relationshipsApi = {
  list: (treeId) => api.get(`/trees/${treeId}/relationships`),
  create: (treeId, data) => api.post(`/trees/${treeId}/relationships`, data),
  update: (treeId, relId, data) => api.put(`/trees/${treeId}/relationships/${relId}`, data),
  delete: (treeId, relId) => api.delete(`/trees/${treeId}/relationships/${relId}`),
  calculate: (treeId, person1Id, person2Id) =>
    api.post(`/trees/${treeId}/relationships/calculate`, { person1_id: person1Id, person2_id: person2Id }),
};

// Life Events API
export const lifeEventsApi = {
  list: (treeId, personId) => api.get(`/trees/${treeId}/persons/${personId}/life-events`),
  create: (treeId, personId, data) => api.post(`/trees/${treeId}/persons/${personId}/life-events`, data),
  update: (treeId, personId, eventId, data) =>
    api.put(`/trees/${treeId}/persons/${personId}/life-events/${eventId}`, data),
  delete: (treeId, personId, eventId) =>
    api.delete(`/trees/${treeId}/persons/${personId}/life-events/${eventId}`),
  types: () => api.get('/life-event-types'),
};

// Media API
export const mediaApi = {
  list: (treeId, params = {}) => api.get(`/trees/${treeId}/media`, { params }),
  upload: (treeId, formData) =>
    api.post(`/trees/${treeId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (treeId, mediaId) => api.delete(`/trees/${treeId}/media/${mediaId}`),
};

// Collaborators API
export const collaboratorsApi = {
  list: (treeId) => api.get(`/trees/${treeId}/collaborators`),
  invite: (treeId, data) => api.post(`/trees/${treeId}/collaborators/invite`, data),
  updateRole: (treeId, collabId, role) =>
    api.put(`/trees/${treeId}/collaborators/${collabId}`, { role }),
  remove: (treeId, collabId) => api.delete(`/trees/${treeId}/collaborators/${collabId}`),
  pendingInvites: () => api.get('/invites/pending'),
  acceptInvite: (token) => api.post('/invites/accept', { token }),
};

// Comments API
export const commentsApi = {
  list: (treeId, personId, page = 1) =>
    api.get(`/trees/${treeId}/persons/${personId}/comments?page=${page}`),
  create: (treeId, personId, data) =>
    api.post(`/trees/${treeId}/persons/${personId}/comments`, data),
  update: (treeId, personId, commentId, data) =>
    api.put(`/trees/${treeId}/persons/${personId}/comments/${commentId}`, data),
  delete: (treeId, personId, commentId) =>
    api.delete(`/trees/${treeId}/persons/${personId}/comments/${commentId}`),
};

// Export/Import API
export const exportImportApi = {
  exportGedcom: (treeId) => api.get(`/trees/${treeId}/export/gedcom`, { responseType: 'blob' }),
  importGedcom: (treeId, formData) =>
    api.post(`/trees/${treeId}/import/gedcom`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  exportJson: (treeId) => api.get(`/trees/${treeId}/export/json`, { responseType: 'blob' }),
  activityLog: (treeId, page = 1) => api.get(`/trees/${treeId}/activity?page=${page}`),
};
