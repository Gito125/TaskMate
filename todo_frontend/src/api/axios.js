import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:8000/api/';
const BASE_URL = 'https://taskmate-production-8ca4.up.railway.app/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Inject token before request
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 🔁 Auto-refresh on 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Token expired and not retrying already?
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });

        localStorage.setItem('access_token', res.data.access);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;

        return axiosInstance(originalRequest); // 🔁 retry original
      } catch (refreshError) {
        // If refresh fails (token expired), redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
