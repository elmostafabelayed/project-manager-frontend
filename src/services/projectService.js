import api from './api';

const projectService = {
  // Get all projects for browse page
  getAllProjects: async (category) => {
    const response = await api.get('/projects', { params: { category } });
    return response.data;
  },

  // Get current client's projects
  getMyProjects: async () => {
    const response = await api.get('/my-projects');
    return response.data;
  },

  // Create a new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Delete a project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;
