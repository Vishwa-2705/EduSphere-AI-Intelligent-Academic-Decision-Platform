import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edusphere_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('edusphere_refresh_token');
        if (refreshToken) {
          const res = await axios.post('/api/v1/auth/refresh', { refreshToken });
          if (res.data.success) {
            localStorage.setItem('edusphere_access_token', res.data.data.accessToken);
            localStorage.setItem('edusphere_refresh_token', res.data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        localStorage.removeItem('edusphere_access_token');
        localStorage.removeItem('edusphere_refresh_token');
        localStorage.removeItem('edusphere_user');
        localStorage.removeItem('edusphere_profile');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
