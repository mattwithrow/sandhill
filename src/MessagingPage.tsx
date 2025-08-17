import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import MessagingInbox from './components/MessagingInbox';
import MessagingOutbox from './components/MessagingOutbox';

type MessagingTab = 'inbox' | 'outbox';

const MessagingPage: React.FC = () => {
  const { authStatus } = useAuthenticator();
  const [activeTab, setActiveTab] = useState<MessagingTab>('inbox');

  // Check if user is authenticated
  const isAuthenticated = authStatus === 'authenticated';

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
        </div>

        <div className="messaging-content">
          {activeTab === 'inbox' ? (
            <MessagingInbox />
          ) : (
            <MessagingOutbox />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
