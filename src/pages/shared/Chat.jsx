import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import MessageBubble from '../../components/MessageBubble';
import chatService from '../../services/chatService';
import './Chat.css';

export default function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Backend should return list of conversations for this user
        const response = await chatService.getConversations();
        const data = response.data || response;
        setConversations(data);
        if (data && data.length > 0) {
          // Auto-select first conversation
          handleSelectConversation(data[0]);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    try {
      const response = await chatService.getMessages(conversation.id);
      setMessages(response.data || response);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      // Create optimistic UI message
      const optimisticMsg = {
        id: Date.now(),
        conversation_id: activeConversation.id,
        sender_id: user.id,
        message: newMessage,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticMsg]);
      setNewMessage('');
      
      // Determine the receiver based on the conversation if possible. 
      // Assume backend might need it if it's not strictly tied to conversation context, 
      // or the API handles it via conversation_id. We'll rely on convention.
      await chatService.sendMessage(activeConversation.id, optimisticMsg.message);
      
      // Optionally refetch messages here, but optimistic update is sufficient for demo
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
      // We could remove the optimistic message on failure
    }
  };

  // Determine the name of the "other person" in the active conversation
  const getOtherParticipantName = (conversation) => {
    if (!conversation || !user) return 'User';
    // Very simplified check: if conversation has a `freelancer` and `client` tied to it, pick the 'other' one.
    // E.g., if user.role == 1 (client), return freelancer.name.
    if (user.role === '1' && conversation.freelancer) return conversation.freelancer.name;
    if (user.role === '2' && conversation.client) return conversation.client.name;
    
    // Fallback if backend provides a generic "other_participant" mapping
    return conversation.other_participant_name || 'Participant';
  };

  return (
    <div className="chat-page-container">
      <Navbar />
      <div className="chat-wrapper">
        
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Messages</h2>
          </div>
          {loading ? (
             <div className="text-center p-4"><div className="cl-spinner"></div></div>
          ) : conversations.length === 0 ? (
             <div className="p-4 text-center text-muted">No active conversations.</div>
          ) : (
            <ul className="conversations-list">
              {conversations.map((conv) => (
                <li 
                  key={conv.id} 
                  className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${getOtherParticipantName(conv)}&background=f1efe8&color=185fa5`} 
                    alt="avatar" 
                    className="conversation-avatar" 
                  />
                  <div className="conversation-details">
                    <h4>{getOtherParticipantName(conv)}</h4>
                    <p>Project: {conv.project?.title || 'Related Project'}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Chat Area */}
        {activeConversation ? (
          <main className="chat-main">
            <header className="chat-main-header">
              <h3>{getOtherParticipantName(activeConversation)}</h3>
              <span className="status">● Online</span>
            </header>
            
            <div className="chat-messages-area">
              {messages.length === 0 ? (
                 <div className="text-center text-muted mt-5">No messages yet. Say hi!</div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    isOwnMessage={msg.sender_id === user?.id} 
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn-send"
                disabled={!newMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </main>
        ) : (
          <main className="empty-chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2>Your Messages</h2>
            <p>Select a conversation from the sidebar to start chatting.</p>
          </main>
        )}
        
      </div>
    </div>
  );
}
