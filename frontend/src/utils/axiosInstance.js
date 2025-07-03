import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/', // Change to your backend base URL
});

// Request interceptor — attach access token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor — handle 401 errors and refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 401, and not retrying, and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest.url.includes('/token/refresh/') &&
      !originalRequest.url.includes('/lms/login/') &&
      !originalRequest.url.includes('/lms/register/')
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
          throw new Error('No refresh token found');
        }

        // Use base Axios (not `api`) to avoid interceptors
        const tokenResponse = await axios.post('http://localhost:8000/lms/token/refresh/', {
          refresh,
        });

        const newAccessToken = tokenResponse.data.access;
        localStorage.setItem('access', newAccessToken);

        // Update token in original request and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
