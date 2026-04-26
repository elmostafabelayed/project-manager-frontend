import api from './api';

const proposalService = {

  getProjectProposals: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/proposals`);
    return response.data;
  },
  

  acceptProposal: async (proposalId) => {
    const response = await api.put(`/proposals/${proposalId}/accept`);
    return response.data;
  },


  rejectProposal: async (proposalId) => {
    const response = await api.put(`/proposals/${proposalId}/reject`);
    return response.data;
  },


  sendProposal: async (proposalData) => {

    const response = await api.post('/proposals', proposalData);
    return response.data;
  },
  

  inviteFreelancer: async (invitationData) => {

    const response = await api.post('/invitations', invitationData);
    return response.data;
  },


  respondToInvitation: async (invitationId, responseData) => {

    const response = await api.put(`/invitations/${invitationId}/respond`, responseData);
    return response.data;
  },


  getMyProposals: async () => {
    const response = await api.get('/my-proposals');
    return response.data;
  }
};

export default proposalService;
