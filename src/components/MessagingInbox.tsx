import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

interface Message {
  id: string;
  content: string;
  subject: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    username: string;
  };
  recipient?: {
    username: string;
  };
}

interface MessagingInboxProps {
  onComposeMessage: (recipientId?: string, subject?: string) => void;
}

const MessagingInbox: React.FC<MessagingInboxProps> = ({ onComposeMessage }) => {
  const { user } = useAuthenticator();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (user?.userId) {
      loadMessages();
    }
  }, [user?.userId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const client = generateClient<Schema>();
      
      // Get user's profile to find their ID
      const profileResult = await client.models.UserProfile.list({
        filter: {
          email: { eq: user?.signInDetails?.loginId }
        }
      });

      if (profileResult.data.length === 0) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      const userProfile = profileResult.data[0];
      
      // Get received messages
      const messagesResult = await client.models.Message.list({
        filter: {
          recipientId: { eq: userProfile.id }
        }
      });

      // Get sender information for each message
      const messagesWithSenders = await Promise.all(
        messagesResult.data.map(async (message) => {
          try {
            const senderResult = await client.models.UserProfile.get({
              id: message.senderId
            });
            return {
              ...message,
              sender: senderResult.data
            };
          } catch (error) {
            console.error('Error fetching sender:', error);
            return {
              ...message,
              sender: { username: 'Unknown User' }
            };
          }
        })
      );

      setMessages(messagesWithSenders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const client = generateClient<Schema>();
      await client.models.Message.update({
        id: messageId,
        isRead: true
      });

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="messaging-inbox">
        <div className="inbox-header">
          <h2>Messages</h2>
        </div>
        <div className="loading-state">
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messaging-inbox">
        <div className="inbox-header">
          <h2>Messages</h2>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadMessages} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-inbox">
      <div className="inbox-header">
        <h2>Messages</h2>
        <button 
          onClick={() => onComposeMessage()} 
          className="btn btn-primary"
        >
          New Message
        </button>
      </div>

      <div className="inbox-content">
        <div className="message-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet</p>
              <button 
                onClick={() => onComposeMessage()} 
                className="btn btn-primary"
              >
                Send your first message
              </button>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${!message.isRead ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-header">
                  <span className="sender-name">
                    {message.sender?.username || 'Unknown User'}
                  </span>
                  <span className="message-date">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
                <div className="message-subject">
                  {message.subject}
                </div>
                <div className="message-preview">
                  {message.content.length > 100 
                    ? `${message.content.substring(0, 100)}...` 
                    : message.content
                  }
                </div>
                {!message.isRead && <div className="unread-indicator" />}
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="message-detail-header">
              <h3>{selectedMessage.subject}</h3>
              <div className="message-meta">
                <span>From: {selectedMessage.sender?.username || 'Unknown User'}</span>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>
            <div className="message-content">
              {selectedMessage.content}
            </div>
            <div className="message-actions">
              <button 
                onClick={() => onComposeMessage(selectedMessage.senderId, `Re: ${selectedMessage.subject}`)}
                className="btn btn-secondary"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInbox;
