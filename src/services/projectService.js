import api from './api';

const projectService = {

  getAllProjects: async (category) => {
    const response = await api.get('/projects', { params: { category } });
    return response.data;
  },


  getMyProjects: async () => {
    const response = await api.get('/my-projects');
    return response.data;
  },


  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },


  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;
