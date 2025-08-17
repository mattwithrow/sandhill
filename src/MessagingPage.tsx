import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import MessagingInbox from './components/MessagingInbox';
import ComposeMessage from './components/ComposeMessage';

type MessagingTab = 'inbox' | 'compose';

const MessagingPage: React.FC = () => {
  const { authStatus } = useAuthenticator();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<MessagingTab>('inbox');
  const [composeRecipientId, setComposeRecipientId] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');

  // Check URL parameters for compose mode
  useEffect(() => {
    const compose = searchParams.get('compose');
    const recipient = searchParams.get('recipient');
    
    if (compose === 'true' && recipient) {
      setActiveTab('compose');
      // We'll need to find the recipient's ID by username
      // This will be handled in the ComposeMessage component
    }
  }, [searchParams]);

  // Check if user is authenticated
  const isAuthenticated = authStatus === 'authenticated';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleComposeMessage = (recipientId?: string, subject?: string) => {
    setComposeRecipientId(recipientId || '');
    setComposeSubject(subject || '');
    setActiveTab('compose');
  };

  const handleMessageSent = () => {
    setActiveTab('inbox');
    setComposeRecipientId('');
    setComposeSubject('');
  };

  const handleCancelCompose = () => {
    setActiveTab('inbox');
    setComposeRecipientId('');
    setComposeSubject('');
  };

  return (
    <div className="messaging-page">
      <div className="container">
        <div className="messaging-header">
          <h1>Messaging</h1>
          <p>Connect with other users to start meaningful conversations</p>
        </div>

        <div className="messaging-tabs">
          <button
            className={`tab-button ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
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
            <MessagingInbox onComposeMessage={handleComposeMessage} />
          ) : (
            <ComposeMessage
              recipientId={composeRecipientId}
              recipientUsername={searchParams.get('recipient') || undefined}
              subject={composeSubject}
              onMessageSent={handleMessageSent}
              onCancel={handleCancelCompose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
