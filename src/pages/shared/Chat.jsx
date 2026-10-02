import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MessageBubble from '../../components/MessageBubble';
import chatService from '../../services/chatService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getAvatarUrl } from '../../utils/avatarHelper';
import './Chat.css';

export default function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasOlder, setHasOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const latestMessageId = useRef(0);
  const conversationCursor = useRef(null);

  const messagesEndRef = useRef(null);
  const activeConversationId = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const markConversationNotificationsRead = useCallback(async (conversationId) => {
    try {
      await api.put(`/notifications/conversation/${conversationId}/read`);
      window.dispatchEvent(new Event('messageNotificationsRead'));
    } catch (error) {
      console.error("Failed to mark conversation notifications read:", error);
    }
  }, []);

  const handleSelectConversation = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    setMessages([]);
    activeConversationId.current = conversation.id;
    latestMessageId.current = 0;
    try {
      const response = await chatService.getMessages(conversation.id);
      if (activeConversationId.current !== conversation.id) return;
      setMessages(response);
      setHasOlder(response.length === 50);
      latestMessageId.current = response.at(-1)?.id || 0;
      await markConversationNotificationsRead(conversation.id);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, [markConversationNotificationsRead]);



  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const response = await chatService.getConversations();
        const data = response.data || response;
        setConversations(data);
        setHasMoreConversations(data.length === 50);
        conversationCursor.current = data.at(-1)?.id;


        const conversationIdFromUrl = searchParams.get('conversationId');
        const userIdFromUrl = searchParams.get('userId');
        let initialConversation = null;

        if (conversationIdFromUrl) {
          initialConversation = data.find((conv) => String(conv.id) === String(conversationIdFromUrl));
          if (!initialConversation) {
            const selected = await chatService.getConversations({ conversation_id: conversationIdFromUrl });
            initialConversation = selected[0];
            if (initialConversation) setConversations(previous => [initialConversation, ...previous]);
          }
        } else if (userIdFromUrl) {
          initialConversation = data.find((conv) => String(conv.other_participant?.id) === String(userIdFromUrl));

          // If not found in current list, try to create/fetch from server
          if (!initialConversation) {
            try {
              const newConv = await chatService.showOrCreateConversation(userIdFromUrl);
              // Refresh conversations to include the new one
              const refreshedResponse = await chatService.getConversations({ conversation_id: newConv.id });
              const refreshedData = refreshedResponse.data || refreshedResponse;
              setConversations(previous => [...refreshedData, ...previous.filter(item => item.id !== newConv.id)]);
              initialConversation = refreshedData.find(c => c.id === newConv.id);
            } catch (error) {
              console.error("Failed to show/create conversation:", error);
            }
          }
        }

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
  }, [searchParams, handleSelectConversation]);




  const newestVisibleMessageId = messages.at(-1)?.id;
  useEffect(() => {
    scrollToBottom();
  }, [newestVisibleMessageId]);

  useEffect(() => {
    if (!activeConversation) return;
    const id = activeConversation.id;
    const timer = setInterval(async () => {
      if (document.hidden) return;
      try {
        const data = await chatService.getMessages(id, { after_id: latestMessageId.current });
        if (activeConversationId.current === id) {
          if (data.length) {
            latestMessageId.current = data.at(-1).id;
            setMessages(previous => [...previous, ...data.filter(message => !previous.some(item => item.id === message.id))]);
          }
          await markConversationNotificationsRead(id);
        }
      } catch { /* The next refresh retries transient failures. */ }
    }, 10000);
    return () => clearInterval(timer);
  }, [activeConversation, markConversationNotificationsRead]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    const conversationId = activeConversation.id;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);
    try {
      const saved = await chatService.sendMessage(conversationId, content);
      if (activeConversationId.current === conversationId) {
        setMessages(prev => prev.some(message => message.id === saved.id) ? prev : [...prev, saved]);
      }
    } catch (error) {
      if (activeConversationId.current === conversationId) setNewMessage(content);
      toast.error("Failed to send message. Please retry.");
    } finally { setSending(false); }
  };


  const loadOlderMessages = async () => {
    if (!activeConversation || !messages.length || loadingOlder) return;
    const id = activeConversation.id;
    setLoadingOlder(true);
    try {
      const older = await chatService.getMessages(id, { before_id: messages[0].id });
      if (activeConversationId.current === id) {
        setMessages(previous => [...older, ...previous]);
        setHasOlder(older.length === 50);
      }
    } catch { toast.error('Could not load earlier messages.'); }
    finally { setLoadingOlder(false); }
  };

  const loadMoreConversations = async () => {
    if (loadingConversations || !conversations.length) return;
    setLoadingConversations(true);
    try {
      const rows = await chatService.getConversations({ before_id: conversationCursor.current });
      setConversations(previous => [...previous, ...rows.filter(row => !previous.some(item => item.id === row.id))]);
      setHasMoreConversations(rows.length === 50);
      conversationCursor.current = rows.at(-1)?.id;
    } catch { toast.error('Could not load conversations.'); }
    finally { setLoadingConversations(false); }
  };

  const getOtherParticipantName = (conversation) => {
    return conversation?.other_participant?.name || 'User';
  };

  const getOtherParticipantId = (conversation) => {
    return conversation?.other_participant?.id || null;
  };

  return (
    <div className="chat-page-container mt-5">

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
                  role="button"
                  tabIndex={0}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleSelectConversation(conv); } }}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img
                    src={getAvatarUrl(conv.other_participant)}
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
          {hasMoreConversations && <button type="button" className="btn btn-outline-primary btn-sm" disabled={loadingConversations} onClick={loadMoreConversations}>Load more conversations</button>}
        </aside>


        {activeConversation ? (
          <main className="chat-main">
            <header className="chat-main-header">
              <h3>
                <Link to={`/shared/profile/${getOtherParticipantId(activeConversation)}`} className="text-decoration-none text-dark-blue">
                  {getOtherParticipantName(activeConversation)}
                </Link>
              </h3>

            </header>

            <div className="chat-messages-area">
              {hasOlder && <button type="button" className="btn btn-outline-primary btn-sm" disabled={loadingOlder} onClick={loadOlderMessages}>Load earlier messages</button>}
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
                aria-label="Message"
                maxLength={10000}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                aria-label="Send message"
                type="submit"
                className="btn-send"
                disabled={sending || !newMessage.trim()}
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
