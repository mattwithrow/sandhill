import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages } from '../../queries';

const MessageTest: React.FC = () => {
  const { user } = useAuthenticator();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userId) {
      loadMessages();
    }
  }, [user?.userId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Testing message loading...');
      console.log('👤 Current user:', user?.signInDetails?.loginId);

      const client = generateClient();
      
      // Try to get all messages without any filters
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {}
      });

      console.log('✅ Messages query result:', messagesResult);
      
      const allMessages = messagesResult.data.listMessages.items;
      console.log('💬 Found messages:', allMessages.length);
      console.log('📄 Messages:', allMessages);

      setMessages(allMessages);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error('GraphQL Errors:', (error as any).errors);
        const graphqlErrors = (error as any).errors;
        if (graphqlErrors && graphqlErrors.length > 0) {
          console.error('GraphQL Error Details:', graphqlErrors.map((err: any) => ({
            message: err.message,
            path: err.path,
            extensions: err.extensions
          })));
        }
      }
      
      setError(`Failed to load messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={loadMessages} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Message Test</h2>
      <p>Found {messages.length} messages</p>
      {messages.length > 0 ? (
        <div className="mt-4">
          {messages.map((message) => (
            <div key={message.id} className="border p-2 mb-2 rounded">
              <p><strong>ID:</strong> {message.id}</p>
              <p><strong>Subject:</strong> {message.subject}</p>
              <p><strong>Content:</strong> {message.content}</p>
              <p><strong>Sender ID:</strong> {message.senderId}</p>
              <p><strong>Recipient ID:</strong> {message.recipientId}</p>
              <p><strong>Conversation ID:</strong> {message.conversationId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No messages found in the database.</p>
      )}
    </div>
  );
};

export default MessageTest;
