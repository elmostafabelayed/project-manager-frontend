import api from './api'

export const getMyProposals       = ()     => api.get('/my-proposals')
export const getProjectProposals  = (projectId) => api.get(`/projects/${projectId}/proposals`)
export const submitProposal       = (data) => api.post('/proposals', data)
export const acceptProposal       = (id)   => api.put(`/proposals/${id}/accept`)
