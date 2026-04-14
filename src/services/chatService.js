import api from './api';

const chatService = {
  // Get all conversations for the authenticated user
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Send a new message
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
