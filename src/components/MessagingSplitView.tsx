import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, listUserProfiles, getUserProfile } from '../../queries';
import ConversationView from './ConversationView';

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

interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUsername: string;
  lastMessage: Message;
  unreadCount: number;
  isOutbox: boolean; // true for sent messages, false for received
}

interface MessagingSplitViewProps {
  mode: 'inbox' | 'outbox';
}

const MessagingSplitView: React.FC<MessagingSplitViewProps> = ({ mode }) => {
  const { user } = useAuthenticator();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (user?.userId) {
      loadConversations();
    }
  }, [user?.userId, mode]);

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
      
      // Get messages based on mode
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: mode === 'inbox' 
            ? { recipientId: { eq: userProfile.id } }
            : { senderId: { eq: userProfile.id } }
        },
        authMode: 'userPool'
      });

      const allMessages = messagesResult.data.listMessages.items;
      
      // Group messages by conversation
      const conversationMap = new Map();
      
      for (const message of allMessages) {
        if (!message.conversationId) continue;
        
        const conversationId = message.conversationId;
        const otherUserId = mode === 'inbox' 
          ? message.senderId 
          : message.recipientId;
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            conversationId,
            otherUserId,
            messages: [],
            unreadCount: 0,
            isOutbox: mode === 'outbox'
          });
        }
        
        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(message);
        
        if (mode === 'inbox' && message.recipientId === userProfile.id && !message.isRead) {
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
            unreadCount: conversation.unreadCount,
            isOutbox: conversation.isOutbox
          };
        })
      );

      const sortedConversations = conversationsWithDetails.sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );

      setConversations(sortedConversations);
      
      // Auto-select first conversation if none selected
      if (!selectedConversation && sortedConversations.length > 0) {
        setSelectedConversation(sortedConversations[0]);
      }
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

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleConversationUpdate = () => {
    // Reload conversations when a new message is sent
    loadConversations();
  };

  if (loading) {
    return (
      <div className="messaging-split-view">
        <div className="loading-state">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messaging-split-view">
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
    <div className="messaging-split-view">
      {/* Left Panel - Conversation List (30%) */}
      <div className="conversation-list-panel">
        <div className="conversation-list-header">
          <h2>{mode === 'inbox' ? 'Inbox' : 'Outbox'}</h2>
          <span className="conversation-count">{conversations.length} conversations</span>
        </div>
        
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <div className="text-4xl mb-4">
                {mode === 'inbox' ? '📥' : '📤'}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {mode === 'inbox' ? 'No Messages Yet' : 'No Sent Messages Yet'}
              </h3>
              <p className="text-gray-600">
                {mode === 'inbox' 
                  ? 'When other users send you messages, conversations will appear here.'
                  : 'When you send messages, conversations will appear here.'
                }
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`conversation-item ${selectedConversation?.conversationId === conversation.conversationId ? 'selected' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="conversation-header">
                  <span className="conversation-name">
                    {conversation.otherUsername}
                  </span>
                  <span className="conversation-date">
                    {formatDate(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                <div className="conversation-subject">
                  {conversation.lastMessage.subject || 'No subject'}
                </div>
                <div className="conversation-preview">
                  {conversation.lastMessage.content && conversation.lastMessage.content.length > 60 
                    ? `${conversation.lastMessage.content.substring(0, 60)}...` 
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

      {/* Right Panel - Conversation View (70%) */}
      <div className="conversation-view-panel">
        {selectedConversation ? (
          <ConversationView
            conversationId={selectedConversation.conversationId}
            otherUserId={selectedConversation.otherUserId}
            onBack={() => setSelectedConversation(null)}
            onMessageSent={handleConversationUpdate}
          />
        ) : (
          <div className="no-conversation-selected">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Select a Conversation
            </h3>
            <p className="text-gray-600">
              Choose a conversation from the list to view messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSplitView;
