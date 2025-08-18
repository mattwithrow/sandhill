import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import MessagingInbox from './components/MessagingInbox';
import MessagingOutbox from './components/MessagingOutbox';
import ComposeMessage from './components/ComposeMessage';

type MessagingTab = 'inbox' | 'outbox' | 'compose';

const MessagingPage: React.FC = () => {
  const { authStatus } = useAuthenticator();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<MessagingTab>('inbox');
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
          <p>View and manage your conversations</p>
        </div>

        <div className="messaging-tabs">
          <button
            className={`tab-button ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          <button
            className={`tab-button ${activeTab === 'outbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('outbox')}
          >
            Outbox
          </button>
          <button
            className={`tab-button ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => setActiveTab('compose')}
          >
            New Message
          </button>
        </div>

        <div className="messaging-content">
          {activeTab === 'inbox' ? (
            <MessagingInbox />
          ) : activeTab === 'outbox' ? (
            <MessagingOutbox />
          ) : (
            <ComposeMessage
              recipientUsername={composeRecipient}
              subject={composeSubject}
              onMessageSent={() => {
                setActiveTab('outbox');
                setComposeRecipient('');
                setComposeSubject('');
              }}
              onCancel={() => {
                setActiveTab('inbox');
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
