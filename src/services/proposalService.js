import api from './api';

const proposalService = {
  // Fetch all proposals for a given project
  getProjectProposals: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/proposals`);
    return response.data; // Assuming backend returns the actual list of proposals
  },
  
  // Accept a proposal
  acceptProposal: async (proposalId) => {
    const response = await api.put(`/proposals/${proposalId}/accept`);
    return response.data; // Assuming backend returns success status / created contract
  },

  // Submit a new proposal
  sendProposal: async (proposalData) => {
    // proposalData should include projectId, price, duration, cover_letter
    const response = await api.post('/proposals', proposalData);
    return response.data;
  }
};

export default proposalService;
