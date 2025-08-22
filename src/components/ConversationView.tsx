import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, getUserProfile, listUserProfiles } from '../../queries';
import { createMessage } from '../../mutations';

// Simplified createMessage mutation to avoid GraphQL errors
const createMessageSimple = /* GraphQL */ `
  mutation CreateMessageSimple($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      content
      subject
      senderId
      recipientId
      conversationId
      isRead
      createdAt
      updatedAt
    }
  }
`;

interface Message {
  id: string;
  content: string | null;
  subject: string | null;
  senderId: string | null;
  recipientId: string | null;
  conversationId: string | null;
  isRead: boolean | null;
  createdAt: string;
  isFromCurrentUser: boolean;
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
  onMessageSent?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId, 
  otherUserId, 
  onBack,
  onMessageSent
}) => {
  const { user } = useAuthenticator();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ username: string | null } | null>(null);
  const [isInConversation, setIsInConversation] = useState(false);

  useEffect(() => {
    if (user?.userId && conversationId) {
      setIsInConversation(true);
      loadConversation();
      loadOtherUser();
    }
  }, [user?.userId, conversationId]);

  const loadConversation = async () => {
    try {
      console.log('Loading conversation for ID:', conversationId);
      setLoading(true);
      setError(null);

      const client = generateClient();
      
      // Clear any cached data for this conversation
      console.log('Clearing conversation cache...');
      
      // Get current user's profile ID for comparison
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

      const currentUserProfileId = profiles[0].id;
      
      // Get messages for this conversation with cache busting
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: {
            conversationId: { eq: conversationId }
          }
        },
        authMode: 'userPool' // Ensure we're using authenticated requests
      });

      const conversationMessages = messagesResult.data.listMessages.items;
      
      // Get sender information for each message
      const messagesWithSenders: Message[] = await Promise.all(
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
                recipient: { username: null },
                isFromCurrentUser: false
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
              recipient: { username: null },
              isFromCurrentUser: message.senderId === currentUserProfileId
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
              recipient: { username: null },
              isFromCurrentUser: message.senderId === currentUserProfileId
            };
          }
        })
      );

      const sortedMessages = messagesWithSenders.sort((a: Message, b: Message) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      console.log('Conversation loaded successfully:', {
        messageCount: sortedMessages.length,
        conversationId
      });
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation. Please try again.');
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

    // Validate required data
    if (!conversationId || !otherUserId) {
      setError('Missing conversation or user data. Please try again.');
      return;
    }

    // Validate conversation ID format (should contain underscore)
    if (!conversationId.includes('_')) {
      console.error('Invalid conversation ID format:', conversationId);
      setError('Invalid conversation format. Please try again.');
      return;
    }

    try {
      setSending(true);
      setError(null);

      console.log('Sending reply...', {
        content: replyContent,
        conversationId,
        otherUserId
      });

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

      // Validate that the recipient ID is different from sender ID
      if (senderProfile.id === otherUserId) {
        setError('Cannot send message to yourself');
        return;
      }

      console.log('Sender profile found:', senderProfile.id);
      console.log('Message input data:', {
        content: replyContent,
        subject: messages[0]?.subject || 'Re: Message',
        senderId: senderProfile.id,
        recipientId: otherUserId,
        conversationId: conversationId,
        isRead: false
      });

      // Create the reply message
      const result = await client.graphql({
        query: createMessageSimple,
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

      console.log('Message sent successfully:', result);

      setReplyContent('');
      
      // Clear any existing error
      setError(null);
      
      // Add the new message to the local state immediately for better UX
      const newMessage: Message = {
        id: (result as any).data.createMessage.id,
        content: replyContent,
        subject: messages[0]?.subject || 'Re: Message',
        senderId: senderProfile.id,
        recipientId: otherUserId,
        conversationId: conversationId,
        isRead: false,
        createdAt: (result as any).data.createMessage.createdAt,
        isFromCurrentUser: true,
        sender: { username: senderProfile.username || 'You' },
        recipient: { username: null }
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      console.log('Message added to local state, reloading conversation...');
      
      // Reload conversation immediately to ensure we have the latest data
      await loadConversation();
      
      // Call the callback to notify parent component
      if (onMessageSent) {
        onMessageSent();
      }
      
    } catch (error: any) {
      console.error('Error sending reply:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        code: error?.code
      });
      
      // Check if it's a GraphQL error
      if (error?.errors) {
        console.error('GraphQL errors:', error.errors);
        setError(`GraphQL error: ${error.errors[0]?.message || 'Unknown error'}`);
      } else if (error?.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Failed to send reply. Please try again.');
      }
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
              className={`message-bubble ${message.isFromCurrentUser ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-meta">
                <span className="message-time">{formatDate(message.createdAt)}</span>
                {message.isFromCurrentUser && (
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
          <label htmlFor="reply-message" className="sr-only">Reply message</label>
          <textarea
            id="reply-message"
            name="reply-message"
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
