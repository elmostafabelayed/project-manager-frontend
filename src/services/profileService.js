import api from './api';

const profileService = {
  // Get the authenticated user's profile with skills and info
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    // profileData can be FormData for picture or object
    const response = await api.post('/profile', profileData);
    return response.data;
  },

  // Get a specific user's public profile
  getPublicProfile: async (id) => {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
  }
};

export default profileService;
