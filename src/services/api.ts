import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { User, DummyJsonAuthResponse, RefreshTokenResponse } from '../types/user';

const API_BASE_URL = 'https://dummyjson.com';

   
                                           
   
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


   
                       
                                                            
   
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

                                                         
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

   
                        
                                                                       
   
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

                              
    if (error.response?.status === 401) {
      const url = originalRequest?.url || '';
                                                                                 
      if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          isRefreshing = false;
          authService.logout();
          return Promise.reject(error);
        }

        try {
          const { accessToken } = await authService.refreshToken();
          processQueue(null, accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr as Error, null);
          authService.logout();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    }

                           
    if (error.response?.status === 403) {
      console.error('HTTP 403 Forbidden: Anda tidak memiliki izin untuk mengakses resource ini.');
    }

                                       
    if (error.response?.status === 500) {
      console.error('HTTP 500 Internal Server Error: Terjadi gangguan pada server DummyJSON.');
    }

    return Promise.reject(error);
  }
);

   
                                             
   
export const authService = {
     
                                                                    
     
  login: async (username: string, password: string, expiresInMins = 30): Promise<User> => {
    const response = await api.post<DummyJsonAuthResponse>('/auth/login', {
      username,
      password,
      expiresInMins,
    });

    const data = response.data;
    const accessToken = data.accessToken || data.token || '';
    const refreshToken = data.refreshToken || '';

    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username,
      avatar: data.image,
    };

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_info', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return user;
  },

     
                                                    
     
  getMe: async (): Promise<User> => {
    const response = await api.get<DummyJsonAuthResponse>('/auth/me');
    const data = response.data;
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username,
      avatar: data.image,
    };
    localStorage.setItem('user_info', JSON.stringify(user));
    return user;
  },

     
                                                                
     
  refreshToken: async (): Promise<{ accessToken: string; refreshToken?: string }> => {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (!storedRefreshToken) {
      throw new Error('Refresh token tidak tersedia');
    }

    const response = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: storedRefreshToken,
      expiresInMins: 30,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }
    return { accessToken, refreshToken: newRefreshToken };
  },

     
                                      
     
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

     
                                           
     
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth-storage');
    delete api.defaults.headers.common['Authorization'];
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },
};

export default api;
