import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
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
      localStorage.clear();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
