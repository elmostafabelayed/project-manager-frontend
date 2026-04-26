import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import MessageBubble from '../../components/MessageBubble';
import chatService from '../../services/chatService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Chat.css';

export default function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const response = await chatService.getConversations();
        const data = response.data || response;
        setConversations(data);

        await markAllMessageNotificationsRead();

        const conversationIdFromUrl = searchParams.get('conversationId');
        const initialConversation = conversationIdFromUrl
          ? data.find((conv) => String(conv.id) === String(conversationIdFromUrl))
          : null;

        if (initialConversation) {
          handleSelectConversation(initialConversation);
        } else if (data && data.length > 0) {
          handleSelectConversation(data[0]);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [searchParams]);


  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    setMobileShowSidebar(false);
    try {
      const response = await chatService.getMessages(conversation.id);
      setMessages(response.data || response);
      await markConversationNotificationsRead(conversation.id);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const markConversationNotificationsRead = async (conversationId) => {
    try {
      await api.put(`/notifications/conversation/${conversationId}/read`);
      window.dispatchEvent(new Event('messageNotificationsRead'));
    } catch (error) {
      console.error("Failed to mark conversation notifications read:", error);
    }
  };

  const markAllMessageNotificationsRead = async () => {
    try {
      await api.put('/notifications/messages/read');
      window.dispatchEvent(new Event('messageNotificationsRead'));
    } catch (error) {
      console.error("Failed to mark all message notifications read:", error);
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {

      const optimisticMsg = {
        id: Date.now(),
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticMsg]);
      setNewMessage('');
      



      await chatService.sendMessage(activeConversation.id, optimisticMsg.content);
      

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");

    }
  };


  const getOtherParticipantName = (conversation) => {
    return conversation?.other_participant?.name || 'User';
  };

  const getOtherParticipantId = (conversation) => {
    return conversation?.other_participant?.id || null;
  };

  return (
    <div className="chat-page-container mt-5">
      <Navbar />
      <div className="chat-wrapper">
        
        
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

        
        {activeConversation ? (
          <main className="chat-main">
            <header className="chat-main-header">
              <h3>
                <Link to={`/shared/profile/${getOtherParticipantId(activeConversation)}`} className="text-decoration-none text-dark-blue">
                  {getOtherParticipantName(activeConversation)}
                </Link>
              </h3>
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
