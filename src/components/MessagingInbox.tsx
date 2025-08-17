import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

interface Message {
  id: string;
  content: string | null;
  subject: string | null;
  senderId: string | null;
  recipientId: string | null;
  isRead: boolean | null;
  createdAt: string;
  sender?: {
    username: string | null;
  };
  recipient?: {
    username: string | null;
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
              if (!message.senderId) {
                return {
                  id: message.id,
                  content: message.content,
                  subject: message.subject,
                  senderId: message.senderId,
                  recipientId: message.recipientId,
                  isRead: message.isRead,
                  createdAt: message.createdAt,
                  sender: { username: 'Unknown User' },
                  recipient: { username: null }
                };
              }
              const senderResult = await client.models.UserProfile.get({
                id: message.senderId
              });
              return {
                id: message.id,
                content: message.content,
                subject: message.subject,
                senderId: message.senderId,
                recipientId: message.recipientId,
                isRead: message.isRead,
                createdAt: message.createdAt,
                sender: {
                  username: senderResult.data?.username || 'Unknown User'
                },
                recipient: { username: null }
              };
            } catch (error) {
              console.error('Error fetching sender:', error);
              return {
                id: message.id,
                content: message.content,
                subject: message.subject,
                senderId: message.senderId,
                recipientId: message.recipientId,
                isRead: message.isRead,
                createdAt: message.createdAt,
                sender: { username: 'Unknown User' },
                recipient: { username: null }
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
    if (message.isRead === false) {
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
                  className={`message-item ${message.isRead === false ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
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
                  {message.subject || 'No Subject'}
                </div>
                <div className="message-preview">
                  {message.content && message.content.length > 100 
                    ? `${message.content.substring(0, 100)}...` 
                    : message.content || 'No content'
                  }
                </div>
                {message.isRead === false && <div className="unread-indicator" />}
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="message-detail-header">
              <h3>{selectedMessage.subject || 'No Subject'}</h3>
              <div className="message-meta">
                <span>From: {selectedMessage.sender?.username || 'Unknown User'}</span>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>
            <div className="message-content">
              {selectedMessage.content || 'No content'}
            </div>
            <div className="message-actions">
              <button 
                onClick={() => onComposeMessage(selectedMessage.senderId || undefined, `Re: ${selectedMessage.subject || 'No Subject'}`)}
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
