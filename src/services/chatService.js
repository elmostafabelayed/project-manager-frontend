import api from './api';

const chatService = {

  getConversations: async (params = {}) => {
    const response = await api.get('/conversations', { params });
    return response.data;
  },
  
  showOrCreateConversation: async (userId, projectId = null) => {
    const response = await api.post('/conversations/show-or-create', { user_id: userId, project_id: projectId });
    return response.data;
  },


  getMessages: async (conversationId, params = {}) => {
    const response = await api.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  },


  sendMessage: async (conversationId, message) => {
    const payload = {
      conversation_id: conversationId,
      content: message
    };
    const response = await api.post('/messages', payload);
    return response.data;
  }
};

export default chatService;
