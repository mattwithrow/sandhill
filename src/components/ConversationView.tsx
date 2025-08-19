import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, getUserProfile, listUserProfiles } from '../../queries';
import { createMessage } from '../../mutations';

interface Message {
  id: string;
  content: string | null;
  subject: string | null;
  senderId: string | null;
  recipientId: string | null;
  conversationId: string | null;
  isRead: boolean | null;
  createdAt: string;
  sender?: {
    username: string | null;
  };
  recipient?: {
    username: string | null;
  };
}

interface ConversationViewProps {
  conversationId: string;
  otherUserId: string;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId, 
  otherUserId, 
  onBack 
}) => {
  const { user } = useAuthenticator();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ username: string | null } | null>(null);

  useEffect(() => {
    if (user?.userId) {
      loadConversation();
      loadOtherUser();
    }
  }, [user?.userId, conversationId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      const client = generateClient();
      
      // Get messages for this conversation
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: {
            conversationId: { eq: conversationId }
          }
        }
      });

      const conversationMessages = messagesResult.data.listMessages.items;
      
      // Get sender information for each message
      const messagesWithSenders = await Promise.all(
        conversationMessages.map(async (message: any) => {
          try {
            if (!message.senderId) {
              return {
                id: message.id,
                content: message.content,
                subject: message.subject,
                senderId: message.senderId,
                recipientId: message.recipientId,
                conversationId: message.conversationId,
                isRead: message.isRead,
                createdAt: message.createdAt,
                sender: { username: 'Unknown User' },
                recipient: { username: null }
              };
            }
            const senderResult = await client.graphql({
              query: getUserProfile,
              variables: { id: message.senderId }
            });
            return {
              id: message.id,
              content: message.content,
              subject: message.subject,
              senderId: message.senderId,
              recipientId: message.recipientId,
              conversationId: message.conversationId,
              isRead: message.isRead,
              createdAt: message.createdAt,
              sender: {
                username: senderResult.data.getUserProfile?.username || 'Unknown User'
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
              conversationId: message.conversationId,
              isRead: message.isRead,
              createdAt: message.createdAt,
              sender: { username: 'Unknown User' },
              recipient: { username: null }
            };
          }
        })
      );

      setMessages(messagesWithSenders.sort((a: Message, b: Message) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUser = async () => {
    try {
      const client = generateClient();
      const userResult = await client.graphql({
        query: getUserProfile,
        variables: { id: otherUserId }
      });
      setOtherUser({
        username: userResult.data.getUserProfile?.username || 'Unknown User'
      });
    } catch (error) {
      console.error('Error loading other user:', error);
    }
  };

  const sendReply = async () => {
    if (!replyContent.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const client = generateClient();
      
      // Get current user's profile
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
        return;
      }

      const senderProfile = profiles[0];

      // Create the reply message
      await client.graphql({
        query: createMessage,
        variables: {
          input: {
            content: replyContent,
            subject: messages[0]?.subject || 'Re: Message',
            senderId: senderProfile.id,
            recipientId: otherUserId,
            conversationId: conversationId,
            isRead: false
          }
        }
      });

      setReplyContent('');
      loadConversation(); // Reload conversation to show new message
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply');
    } finally {
      setSending(false);
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
      <div className="conversation-view">
        <div className="conversation-header">
          <button onClick={onBack} className="btn btn-ghost">
            ← Back
          </button>
          <h2>Loading conversation...</h2>
        </div>
        <div className="loading-state">
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-view">
        <div className="conversation-header">
          <button onClick={onBack} className="btn btn-ghost">
            ← Back
          </button>
          <h2>Error</h2>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadConversation} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-view">
      <div className="conversation-header">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <h2>Conversation with {otherUser?.username}</h2>
      </div>

      <div className="conversation-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages in this conversation yet.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${message.senderId === user?.userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-meta">
                <span className="message-time">{formatDate(message.createdAt)}</span>
                {message.senderId === user?.userId && (
                  <span className="message-status">
                    {message.isRead ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="conversation-reply">
        <div className="reply-input">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
            className="form-textarea"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
          />
          <button
            onClick={sendReply}
            disabled={sending || !replyContent.trim()}
            className="btn btn-primary"
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
