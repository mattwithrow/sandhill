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
  messageDirection: 'sent' | 'received'; // for visual indicators
}

const MessagingCombinedView: React.FC = () => {
  const { user } = useAuthenticator();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'inbox' | 'outbox'>('all');

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
      
      // Get all messages where user is sender or recipient
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
        authMode: 'userPool'
      });

      const allMessages = messagesResult.data.listMessages.items;
      
      // Group messages by conversation
      const conversationMap = new Map();
      
      for (const message of allMessages) {
        if (!message.conversationId) continue;
        
        const conversationId = message.conversationId;
        const isOutbox = message.senderId === userProfile.id;
        const otherUserId = isOutbox ? message.recipientId : message.senderId;
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            conversationId,
            otherUserId,
            messages: [],
            unreadCount: 0,
            isOutbox: false, // will be determined by last message
            messageDirection: 'received' as const
          });
        }
        
        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(message);
        
        // Count unread messages (only for received messages)
        if (!isOutbox && message.recipientId === userProfile.id && !message.isRead) {
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
          const isOutbox = lastMessage.senderId === userProfile.id;
          
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
            isOutbox,
            messageDirection: isOutbox ? 'sent' as const : 'received' as const
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

  const filteredConversations = conversations.filter(conversation => {
    if (filter === 'all') return true;
    if (filter === 'inbox') return !conversation.isOutbox;
    if (filter === 'outbox') return conversation.isOutbox;
    return true;
  });

  if (loading) {
    return (
      <div className="messaging-combined-view">
        <div className="loading-state">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messaging-combined-view">
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
    <div className="messaging-combined-view">
      {/* Left Panel - Conversation List (30%) */}
      <div className="conversation-list-panel">
        <div className="conversation-list-header">
          <h2>All Messages</h2>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({conversations.length})
            </button>
            <button
              className={`filter-tab ${filter === 'inbox' ? 'active' : ''}`}
              onClick={() => setFilter('inbox')}
            >
              Inbox ({conversations.filter(c => !c.isOutbox).length})
            </button>
            <button
              className={`filter-tab ${filter === 'outbox' ? 'active' : ''}`}
              onClick={() => setFilter('outbox')}
            >
              Sent ({conversations.filter(c => c.isOutbox).length})
            </button>
          </div>
        </div>
        
        <div className="conversation-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-state">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'No Messages Yet' : 
                 filter === 'inbox' ? 'No Received Messages' : 'No Sent Messages'}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' ? 'Start conversations to see messages here.' :
                 filter === 'inbox' ? 'When other users send you messages, they will appear here.' :
                 'When you send messages, they will appear here.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`conversation-item ${selectedConversation?.conversationId === conversation.conversationId ? 'selected' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''} ${conversation.messageDirection}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="conversation-header">
                  <div className="conversation-info">
                    <span className="conversation-name">
                      {conversation.otherUsername}
                    </span>
                    <div className="message-direction-indicator">
                      {conversation.messageDirection === 'sent' ? (
                        <span className="sent-indicator" title="Sent message">📤</span>
                      ) : (
                        <span className="received-indicator" title="Received message">📥</span>
                      )}
                    </div>
                  </div>
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

export default MessagingCombinedView;
