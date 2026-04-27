import api from './api';

const profileService = {

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },


  updateProfile: async (profileData) => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },

  uploadProfilePicture: async (formData) => {
    const response = await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPublicProfile: async (id) => {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
  },


  getFreelancers: async (category) => {
    const response = await api.get('/freelancers', { params: { category } });
    return response.data;
  }
};

export default profileService;
