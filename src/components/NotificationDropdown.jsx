import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import bellIcon from "../assets/notification-bell-svgrepo-com.svg";
import "./css/NotificationDropdown.css";

export default function NotificationDropdown({ onMessageUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const updateCounts = useCallback((notificationsData) => {
    const unreadTotal = notificationsData.filter((n) => !n.read_at).length;
    const unreadMessages = notificationsData.filter(
      (n) => n.type === "message_new" && !n.read_at
    ).length;

    setNotifications(notificationsData);
    setUnreadCount(unreadTotal);

    if (typeof onMessageUnreadCountChange === "function") {
      onMessageUnreadCountChange(unreadMessages);
    }
  }, [onMessageUnreadCountChange]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      console.log("Calling API: /notifications");
      const response = await api.get("/notifications");
      console.log("Notifications response:", response.data);
      updateCounts(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [token, updateCounts]);

  useEffect(() => {
    if (token) {
      console.log("Fetching notifications...");
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    const refreshNotifications = () => {
      console.log("Refreshing notifications from event...");
      fetchNotifications();
    };
    window.addEventListener('notificationsUpdated', refreshNotifications);
    window.addEventListener('messageNotificationsRead', refreshNotifications);
    return () => {
      window.removeEventListener('notificationsUpdated', refreshNotifications);
      window.removeEventListener('messageNotificationsRead', refreshNotifications);
    };
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date() } : n
        );
        updateCounts(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await api.put(`/notifications/${notification.id}/read`);
      }

      if (notification.type === "message_new" && notification.data?.conversation_id) {
        navigate(`/shared/chat?conversationId=${notification.data.conversation_id}`);
      }

      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date() } : n
        );
        updateCounts(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error processing notification click:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, read_at: new Date() }));
        updateCounts(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case "proposal_new":
        return `New proposal from ${notification.data.freelancer_name} on your project.`;
      case "proposal_accepted":
        return `Your proposal has been accepted by ${notification.data.client_name}.`;
      case "message_new":
        return `New message from ${notification.data.sender_name}: ${notification.data.message_content}`;
      default:
        return "New notification.";
    }
  };

  return (
    <div className="notification-dropdown">
      <button
        className="notification-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img src={bellIcon} alt="Notifications" className="notification-icon" />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>
      {dropdownOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>
          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li className="no-notifications">No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item ${!notification.read_at ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p>{getNotificationMessage(notification)}</p>
                  <small>{new Date(notification.created_at).toLocaleString()}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}