import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Role helpers
  hasRole: (...roles) => {
    const user = get().user;
    if (!user || !user.role_names) return false;
    return roles.some((r) => user.role_names.includes(r));
  },

  isAdmin: () => {
    const user = get().user;
    return user?.role_names?.includes('admin') ?? false;
  },

  isModerator: () => {
    const user = get().user;
    if (!user?.role_names) return false;
    return user.role_names.includes('admin') || user.role_names.includes('moderator');
  },
}));

export default useAuthStore;
