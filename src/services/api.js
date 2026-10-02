import axios from 'axios'

export const backendUrl = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  withXSRFToken: true,
})


api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/auth/login')) {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
