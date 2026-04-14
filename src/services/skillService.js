import api from './api';

const skillService = {
  // Get all available skills
  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Sync skills for the authenticated user
  syncUserSkills: async (skillIds) => {
    const response = await api.post('/user/skills', { skills: skillIds });
    return response.data;
  }
};

export default skillService;
