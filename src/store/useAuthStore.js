import { create } from 'zustand';
import { tokenService } from '@/api/tokenService';
import { MOCK_USER_PROFILE } from '@/features/auth/constants/auth.mock';
import { authApi } from '@/features/auth/api/authApi';

export const useAuthStore = create((set, get) => ({
  user: tokenService.getAccessToken() ? MOCK_USER_PROFILE : null,
  accessToken: tokenService.getAccessToken(),
  refreshToken: tokenService.getRefreshToken(),
  role: tokenService.getAccessToken() ? MOCK_USER_PROFILE.roleCode : null,
  permissions: tokenService.getAccessToken() ? MOCK_USER_PROFILE.permissions : [],
  isAuthenticated: !!tokenService.getAccessToken(),
  isLoading: false,

  setLoading: (isLoading) => set({ isLoading }),

  login: async ({ username, password, rememberMe }) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ username, password, rememberMe });
      tokenService.setTokens(response.accessToken, response.refreshToken);

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
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
