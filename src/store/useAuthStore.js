import { create } from 'zustand';
import { tokenService } from '@/api/tokenService';
import { authApi } from '@/features/auth/api/authApi';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user_profile') || 'null');
  } catch {
    return null;
  }
};

const initialUser = tokenService.getAccessToken() ? getStoredUser() : null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  accessToken: tokenService.getAccessToken(),
  refreshToken: tokenService.getRefreshToken(),
  role: initialUser ? initialUser.roleCode : null,
  permissions: initialUser ? initialUser.permissions : [],
  isAuthenticated: !!tokenService.getAccessToken(),
  isLoading: false,

  setLoading: (isLoading) => set({ isLoading }),

  setAuthTokens: (accessToken, refreshToken) => {
    tokenService.setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: !!accessToken });
  },

  login: async ({ username, password, rememberMe }) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ username, password, rememberMe });
      tokenService.setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem('user_profile', JSON.stringify(response.user));

      set({
        isAuthenticated: true,
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        role: response.user.roleCode,
        permissions: response.user.permissions,
        isLoading: false,
      });

      return response;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API failures
    } finally {
      tokenService.clearTokens();
      localStorage.removeItem('user_profile');
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        role: null,
        permissions: [],
        isLoading: false,
      });
    }
  },

  updateUserProfile: (updates) =>
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updates } : null;
      if (newUser) {
        localStorage.setItem('user_profile', JSON.stringify(newUser));
      }
      return { user: newUser };
    }),
}));
