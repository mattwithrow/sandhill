import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import MessagingCombinedView from './components/MessagingCombinedView';
import ComposeMessage from './components/ComposeMessage';
import MessageTest from './components/MessageTest';

type MessagingTab = 'messages' | 'compose' | 'test';

const MessagingPage: React.FC = () => {
  const { authStatus } = useAuthenticator();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<MessagingTab>('messages');
  const [composeRecipient, setComposeRecipient] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');

  // Check if user is authenticated
  const isAuthenticated = authStatus === 'authenticated';

  // Handle URL parameters for compose functionality
  useEffect(() => {
    const composeParam = searchParams.get('compose');
    const recipientParam = searchParams.get('recipient');
    const subjectParam = searchParams.get('subject');

    if (composeParam === 'true') {
      setActiveTab('compose');
      if (recipientParam) {
        setComposeRecipient(recipientParam);
      }
      if (subjectParam) {
        setComposeSubject(subjectParam);
      }
    }
  }, [searchParams]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="messaging-page">
      <div className="container">
        <div className="messaging-header">
          <h1>Messages</h1>
          <p>View and manage all your conversations in one place</p>
        </div>

        <div className="messaging-tabs">
          <button
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`tab-button ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => setActiveTab('compose')}
          >
            New Message
          </button>
          <button
            className={`tab-button ${activeTab === 'test' ? 'active' : ''}`}
            onClick={() => setActiveTab('test')}
          >
            Test
          </button>
        </div>

        <div className="messaging-content">
          {activeTab === 'messages' ? (
            <MessagingCombinedView />
          ) : activeTab === 'test' ? (
            <MessageTest />
          ) : (
            <ComposeMessage
              recipientUsername={composeRecipient}
              subject={composeSubject}
              onMessageSent={() => {
                setActiveTab('messages');
                setComposeRecipient('');
                setComposeSubject('');
              }}
              onCancel={() => {
                setActiveTab('messages');
                setComposeRecipient('');
                setComposeSubject('');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
