import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, listUserProfiles, getUserProfile } from '../../queries';

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

interface MessagingOutboxProps {}

const MessagingOutbox: React.FC<MessagingOutboxProps> = () => {
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

      const client = generateClient();
      
      // Get user's profile to find their ID
      const profileResult = await client.graphql({
        query: listUserProfiles,
        variables: {
          filter: {
            email: { eq: user?.signInDetails?.loginId }
          }
        }
      });

      const profiles = profileResult.data.listUserProfiles.items;
      if (profiles.length === 0) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      const userProfile = profiles[0];
      
      // Get sent messages
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: {
            senderId: { eq: userProfile.id }
          }
        }
      });

      const messages = messagesResult.data.listMessages.items;
      
      // Get recipient information for each message
      const messagesWithRecipients = await Promise.all(
        messages.map(async (message: any) => {
          try {
            if (!message.recipientId) {
              return {
                id: message.id,
                content: message.content,
                subject: message.subject,
                senderId: message.senderId,
                recipientId: message.recipientId,
                isRead: message.isRead,
                createdAt: message.createdAt,
                sender: { username: null },
                recipient: { username: 'Unknown User' }
              };
            }
            const recipientResult = await client.graphql({
              query: getUserProfile,
              variables: { id: message.recipientId }
            });
            return {
              id: message.id,
              content: message.content,
              subject: message.subject,
              senderId: message.senderId,
              recipientId: message.recipientId,
              isRead: message.isRead,
              createdAt: message.createdAt,
              sender: { username: null },
              recipient: {
                username: recipientResult.data.getUserProfile?.username || 'Unknown User'
              }
            };
          } catch (error) {
            console.error('Error fetching recipient:', error);
            return {
              id: message.id,
              content: message.content,
              subject: message.subject,
              senderId: message.senderId,
              recipientId: message.recipientId,
              isRead: message.isRead,
              createdAt: message.createdAt,
              sender: { username: null },
              recipient: { username: 'Unknown User' }
            };
          }
        })
      );

      setMessages(messagesWithRecipients.sort((a: Message, b: Message) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
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
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="messaging-inbox">
        <div className="loading-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sent messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messaging-inbox">
        <div className="error-state">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadMessages}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="messaging-inbox">
        <div className="empty-state">
          <div className="text-4xl mb-4">📤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Sent Messages</h3>
          <p className="text-gray-600 mb-4">You haven't sent any messages yet.</p>
          <p className="text-sm text-gray-500">
            Visit user profiles to start conversations and send messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-inbox">
      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${message.isRead === false ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
            onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
          >
            <div className="message-header">
              <div className="message-sender">
                <span className="font-medium">To: {message.recipient?.username || 'Unknown User'}</span>
              </div>
              <div className="message-date">
                {formatDate(message.createdAt)}
              </div>
            </div>
            <div className="message-subject">
              {message.subject || 'No subject'}
            </div>
            <div className="message-preview">
              {message.content ? (message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content) : 'No content'}
            </div>
            {message.isRead === false && (
              <div className="unread-indicator">
                <span className="unread-dot"></span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div className="message-detail">
          <div className="message-detail-header">
            <button
              onClick={() => setSelectedMessage(null)}
              className="close-button"
            >
              ×
            </button>
          </div>
          <div className="message-detail-content">
            <div className="message-detail-info">
              <div className="message-detail-row">
                <span className="label">To:</span>
                <span className="value">{selectedMessage.recipient?.username || 'Unknown User'}</span>
              </div>
              <div className="message-detail-row">
                <span className="label">Subject:</span>
                <span className="value">{selectedMessage.subject || 'No subject'}</span>
              </div>
              <div className="message-detail-row">
                <span className="label">Sent:</span>
                <span className="value">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
              <div className="message-detail-row">
                <span className="label">Status:</span>
                <span className={`value ${selectedMessage.isRead === false ? 'unread-status' : 'read-status'}`}>
                  {selectedMessage.isRead === false ? 'Unread' : 'Read'}
                </span>
              </div>
            </div>
            <div className="message-detail-body">
              <p>{selectedMessage.content || 'No content'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingOutbox;
