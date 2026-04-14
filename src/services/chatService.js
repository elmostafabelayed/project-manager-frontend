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
  sendMessage: async (conversationId, message, receiverId) => {
    const payload = {
      conversation_id: conversationId,
      message: message
    };
    if (receiverId) {
       payload.receiver_id = receiverId;
    }
    const response = await api.post('/messages', payload);
    return response.data;
  }
};

export default chatService;
