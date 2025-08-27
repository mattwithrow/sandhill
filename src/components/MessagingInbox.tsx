import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, listUserProfiles, getUserProfile } from '../../queries';
import { updateMessage } from '../../mutations';
import { useUnreadMessagesContext } from '../contexts/UnreadMessagesContext';

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
  onViewConversation?: (conversationId: string, otherUserId: string) => void;
}

const MessagingInbox: React.FC<MessagingInboxProps> = ({ onViewConversation }) => {
  const { user } = useAuthenticator();
  const { decrementUnreadCount } = useUnreadMessagesContext();
  const [conversations, setConversations] = useState<Array<{
    conversationId: string;
    otherUserId: string;
    otherUsername: string;
    lastMessage: Message;
    unreadCount: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userId) {
      loadConversations();
    }
  }, [user?.userId]);

  const loadConversations = async () => {
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
      
      // Get all messages where user is sender or recipient with cache busting
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: {
            or: [
              { senderId: { eq: userProfile.id } },
              { recipientId: { eq: userProfile.id } }
            ]
          }
        },
        authMode: 'userPool' // Ensure we're using authenticated requests
      });

      const allMessages = messagesResult.data.listMessages.items;
      
      // Group messages by conversation
      const conversationMap = new Map();
      
      for (const message of allMessages) {
        if (!message.conversationId) continue;
        
        const conversationId = message.conversationId;
        const otherUserId = message.senderId === userProfile.id ? message.recipientId : message.senderId;
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            conversationId,
            otherUserId,
            messages: [],
            unreadCount: 0
          });
        }
        
        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(message);
        
        if (message.recipientId === userProfile.id && !message.isRead) {
          conversation.unreadCount++;
        }
      }
      
      // Get the last message and other user info for each conversation
      const conversationsWithDetails = await Promise.all(
        Array.from(conversationMap.values()).map(async (conversation) => {
          const sortedMessages = conversation.messages.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          const lastMessage = sortedMessages[0];
          
          // Get other user's info
          const otherUserResult = await client.graphql({
            query: getUserProfile,
            variables: { id: conversation.otherUserId }
          });
          
          return {
            conversationId: conversation.conversationId,
            otherUserId: conversation.otherUserId,
            otherUsername: otherUserResult.data.getUserProfile?.username || 'Unknown User',
            lastMessage: {
              id: lastMessage.id,
              content: lastMessage.content,
              subject: lastMessage.subject,
              senderId: lastMessage.senderId,
              recipientId: lastMessage.recipientId,
              conversationId: lastMessage.conversationId,
              isRead: lastMessage.isRead,
              createdAt: lastMessage.createdAt,
              sender: { username: null },
              recipient: { username: null }
            },
            unreadCount: conversation.unreadCount
          };
        })
      );

      setConversations(conversationsWithDetails.sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations');
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
      return date.toLocaleDateString();
    }
  };

  const handleConversationClick = async (conversationId: string, otherUserId: string, unreadCount: number) => {
    // Mark messages as read when conversation is opened
    if (unreadCount > 0) {
      try {
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
        if (profiles.length > 0) {
          const userProfile = profiles[0];
          
          // Get unread messages in this conversation
          const messagesResult = await client.graphql({
            query: listMessages,
            variables: {
              filter: {
                and: [
                  { conversationId: { eq: conversationId } },
                  { recipientId: { eq: userProfile.id } },
                  { isRead: { eq: false } }
                ]
              }
            }
          });

          const unreadMessages = messagesResult.data.listMessages.items;
          
          // Mark each unread message as read
          for (const message of unreadMessages) {
            await client.graphql({
              query: updateMessage,
              variables: {
                input: {
                  id: message.id,
                  isRead: true
                }
              }
            });
          }

          // Update local unread count
          for (let i = 0; i < unreadMessages.length; i++) {
            decrementUnreadCount();
          }
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }

    // Call the original onViewConversation callback
    if (onViewConversation) {
      onViewConversation(conversationId, otherUserId);
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
          <button onClick={loadConversations} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="messaging-inbox">
      <div className="inbox-header">
        <h2>Conversations</h2>
      </div>

      <div className="inbox-content">
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Conversations Yet</h3>
              <p className="text-gray-600 mb-4">You haven't had any conversations yet.</p>
              <p className="text-sm text-gray-500">
                When other users send you messages, conversations will appear here.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`conversation-item ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationClick(conversation.conversationId, conversation.otherUserId, conversation.unreadCount)}
              >
                <div className="conversation-header">
                  <span className="conversation-name">
                    {conversation.otherUsername}
                  </span>
                  <span className="conversation-date">
                    {formatDate(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                <div className="conversation-preview">
                  {conversation.lastMessage.content && conversation.lastMessage.content.length > 100 
                    ? `${conversation.lastMessage.content.substring(0, 100)}...` 
                    : conversation.lastMessage.content || 'No content'
                  }
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="unread-indicator">
                    <span className="unread-count">{conversation.unreadCount}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingInbox;
