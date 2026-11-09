import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/user';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

            
  login: (username: string, password: string, expiresInMins?: number) => Promise<User>;
  fetchCurrentUser: () => Promise<User | null>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  checkAuthOnLoad: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (username: string, password: string, expiresInMins = 30): Promise<User> => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login(username, password, expiresInMins);
          const token = localStorage.getItem('access_token');
          set({
            user,
            isAuthenticated: true,
            accessToken: token,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Autentikasi gagal. Periksa kembali username dan password Anda.';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      fetchCurrentUser: async (): Promise<User | null> => {
        try {
          const user = await authService.getMe();
          set({ user, isAuthenticated: true });
          return user;
        } catch {
          return get().user;
        }
      },

      refreshToken: async () => {
        try {
          const { accessToken } = await authService.refreshToken();
          set({ accessToken });
        } catch {
          get().logout();
          throw new Error('Sesi telah kedaluwarsa. Silakan login kembali.');
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          isLoading: false,
          error: null,
        });
      },

      checkAuthOnLoad: async () => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user_info');

        if (token && userStr) {
          try {
            const cachedUser: User = JSON.parse(userStr);
            set({
              user: cachedUser,
              isAuthenticated: true,
              accessToken: token,
            });

                                                              
            try {
              const freshUser = await authService.getMe();
              set({ user: freshUser });
            } catch {
                                                                                  
            }
          } catch {
            get().logout();
          }
        } else {
          set({ user: null, isAuthenticated: false, accessToken: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuth;
