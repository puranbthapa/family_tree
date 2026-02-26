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
  get: (slug) => api.get(`/trees/${slug}`),
  create: (data) => api.post('/trees', data),
  update: (slug, data) => api.put(`/trees/${slug}`, data),
  delete: (slug) => api.delete(`/trees/${slug}`),
  statistics: (slug) => api.get(`/trees/${slug}/statistics`),
  // Public tree endpoints (no auth required)
  publicList: (params = {}) => api.get('/public/trees', { params }),
  publicGet: (slug) => api.get(`/public/trees/${slug}`),
};

// Persons API
export const personsApi = {
  list: (treeSlug, params = {}) => api.get(`/trees/${treeSlug}/persons`, { params }),
  get: (treeSlug, personId) => api.get(`/trees/${treeSlug}/persons/${personId}`),
  create: (treeSlug, data) => api.post(`/trees/${treeSlug}/persons`, data),
  update: (treeSlug, personId, data) => api.put(`/trees/${treeSlug}/persons/${personId}`, data),
  delete: (treeSlug, personId) => api.delete(`/trees/${treeSlug}/persons/${personId}`),
  search: (treeSlug, q) => api.get(`/trees/${treeSlug}/persons/search`, { params: { q } }),
  duplicates: (treeSlug) => api.get(`/trees/${treeSlug}/persons/duplicates`),
  updatePositions: (treeSlug, positions) => api.post(`/trees/${treeSlug}/persons/positions`, { positions }),
  uploadPhoto: (treeSlug, personId, formData) =>
    api.post(`/trees/${treeSlug}/persons/${personId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePhoto: (treeSlug, personId) => api.delete(`/trees/${treeSlug}/persons/${personId}/photo`),
};

// Relationships API
export const relationshipsApi = {
  list: (treeSlug) => api.get(`/trees/${treeSlug}/relationships`),
  create: (treeSlug, data) => api.post(`/trees/${treeSlug}/relationships`, data),
  update: (treeSlug, relId, data) => api.put(`/trees/${treeSlug}/relationships/${relId}`, data),
  delete: (treeSlug, relId) => api.delete(`/trees/${treeSlug}/relationships/${relId}`),
  calculate: (treeSlug, person1Id, person2Id) =>
    api.post(`/trees/${treeSlug}/relationships/calculate`, { person1_id: person1Id, person2_id: person2Id }),
};

// Life Events API
export const lifeEventsApi = {
  list: (treeSlug, personId) => api.get(`/trees/${treeSlug}/persons/${personId}/life-events`),
  create: (treeSlug, personId, data) => api.post(`/trees/${treeSlug}/persons/${personId}/life-events`, data),
  update: (treeSlug, personId, eventId, data) =>
    api.put(`/trees/${treeSlug}/persons/${personId}/life-events/${eventId}`, data),
  delete: (treeSlug, personId, eventId) =>
    api.delete(`/trees/${treeSlug}/persons/${personId}/life-events/${eventId}`),
  types: () => api.get('/life-event-types'),
};

// Media API
export const mediaApi = {
  list: (treeSlug, params = {}) => api.get(`/trees/${treeSlug}/media`, { params }),
  upload: (treeSlug, formData) =>
    api.post(`/trees/${treeSlug}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (treeSlug, mediaId) => api.delete(`/trees/${treeSlug}/media/${mediaId}`),
};

// Collaborators API
export const collaboratorsApi = {
  list: (treeSlug) => api.get(`/trees/${treeSlug}/collaborators`),
  invite: (treeSlug, data) => api.post(`/trees/${treeSlug}/collaborators/invite`, data),
  updateRole: (treeSlug, collabId, role) =>
    api.put(`/trees/${treeSlug}/collaborators/${collabId}`, { role }),
  remove: (treeSlug, collabId) => api.delete(`/trees/${treeSlug}/collaborators/${collabId}`),
  pendingInvites: () => api.get('/invites/pending'),
  acceptInvite: (token) => api.post('/invites/accept', { token }),
};

// Comments API
export const commentsApi = {
  list: (treeSlug, personId, page = 1) =>
    api.get(`/trees/${treeSlug}/persons/${personId}/comments?page=${page}`),
  create: (treeSlug, personId, data) =>
    api.post(`/trees/${treeSlug}/persons/${personId}/comments`, data),
  update: (treeSlug, personId, commentId, data) =>
    api.put(`/trees/${treeSlug}/persons/${personId}/comments/${commentId}`, data),
  delete: (treeSlug, personId, commentId) =>
    api.delete(`/trees/${treeSlug}/persons/${personId}/comments/${commentId}`),
};

// Export/Import API
export const exportImportApi = {
  exportGedcom: (treeSlug) => api.get(`/trees/${treeSlug}/export/gedcom`, { responseType: 'blob' }),
  importGedcom: (treeSlug, formData) =>
    api.post(`/trees/${treeSlug}/import/gedcom`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  exportJson: (treeSlug) => api.get(`/trees/${treeSlug}/export/json`, { responseType: 'blob' }),
  activityLog: (treeSlug, page = 1) => api.get(`/trees/${treeSlug}/activity?page=${page}`),
};

// Roles & Admin API
export const rolesApi = {
  list: () => api.get('/roles'),
  create: (data) => api.post('/admin/roles', data),
  update: (roleId, data) => api.put(`/admin/roles/${roleId}`, data),
  delete: (roleId) => api.delete(`/admin/roles/${roleId}`),
};

export const adminApi = {
  // Dashboard
  dashboard: () => api.get('/admin/dashboard'),

  // Users
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  assignRoles: (userId, roles) => api.put(`/admin/users/${userId}/roles`, { roles }),

  // Trees
  getTrees: (params = {}) => api.get('/admin/trees', { params }),
  deleteTree: (treeSlug) => api.delete(`/admin/trees/${treeSlug}`),

  // Activity
  getActivity: (params = {}) => api.get('/admin/activity', { params }),

  // Roles
  getRoles: () => api.get('/admin/roles'),
  createRole: (data) => api.post('/admin/roles', data),
  updateRole: (roleId, data) => api.put(`/admin/roles/${roleId}`, data),
  deleteRole: (roleId) => api.delete(`/admin/roles/${roleId}`),
};
