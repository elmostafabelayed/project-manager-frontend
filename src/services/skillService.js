import api from './api';

const skillService = {

  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },


  syncUserSkills: async (skillIds) => {
    const response = await api.post('/user/skills', { skills: skillIds });
    return response.data;
  }
};

export default skillService;
