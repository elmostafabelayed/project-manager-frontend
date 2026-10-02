import api from './api'

export const getProjects = async () => { const response = await api.get('/projects', { params: { available: true } }); return { ...response, data: response.data.data }; }
export const getOwnProjects = () => api.get('/my-projects', { params: { per_page: 5 } })
export const getProject     = (id)   => api.get(`/projects/${id}`)
export const createProject   = (data) => api.post('/projects', data)
export const createProjectFromProposal = (data) => api.post('/projects/from-proposal', data)
export const updateProject   = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject   = (id) => api.delete(`/projects/${id}`)
