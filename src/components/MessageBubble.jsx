import React from 'react';
import './MessageBubble.css';

export default function MessageBubble({ message, isOwnMessage }) {

  return (
    <div className={`message-bubble-wrapper ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-bubble">
        <p className="message-text">{message.content || message.message || message.body || message.text || "No content"}</p>
        <span className="message-time">
          {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
    </div>
  );
}