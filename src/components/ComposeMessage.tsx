import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listUserProfiles } from '../../queries';
import { createMessage } from '../../mutations';

interface UserProfile {
  id: string;
  username: string | null;
  userType: 'expert' | 'ventures' | 'both' | null;
  messagingEnabled: boolean | null;
}

interface ComposeMessageProps {
  recipientId?: string;
  recipientUsername?: string;
  subject?: string;
  onMessageSent: () => void;
  onCancel: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({ 
  recipientId, 
  recipientUsername,
  subject = '', 
  onMessageSent, 
  onCancel 
}) => {
  const { user } = useAuthenticator();
  const [recipients, setRecipients] = useState<UserProfile[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>(recipientId || '');
  const [messageSubject, setMessageSubject] = useState(subject);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.userId) {
      loadRecipients();
    }
  }, [user?.userId]);

  // Handle recipient selection by username
  useEffect(() => {
    if (recipientUsername && recipients.length > 0) {
      const recipient = recipients.find(r => r.username === recipientUsername);
      if (recipient) {
        setSelectedRecipient(recipient.id);
        setSearchTerm(recipient.username || '');
      }
    }
  }, [recipientUsername, recipients]);

  // If we have a recipientUsername but no recipients loaded yet, store it for later
  const [pendingRecipient, setPendingRecipient] = useState<string>('');
  
  useEffect(() => {
    if (recipientUsername && !selectedRecipient) {
      setPendingRecipient(recipientUsername);
    }
  }, [recipientUsername, selectedRecipient]);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      setError(null);

      const client = generateClient();
      
      // Get all users
      const profilesResult = await client.graphql({
        query: listUserProfiles,
        variables: {}
      });

      const profiles = profilesResult.data.listUserProfiles.items;

      // Filter out the current user
      const currentUserProfile = profiles.find(
        (profile: any) => profile.email === user?.signInDetails?.loginId
      );

      const availableRecipients = profiles
        .filter((profile: any) => profile.id !== currentUserProfile?.id)
        .map((profile: any) => ({
          id: profile.id,
          username: profile.username || 'Unknown User',
          userType: profile.userType || 'both',
          messagingEnabled: profile.messagingEnabled !== false // Default to true if not explicitly false
        }));

      setRecipients(availableRecipients);
      
      // If we have a pending recipient, try to find and select it
      if (pendingRecipient && availableRecipients.length > 0) {
        const recipient = availableRecipients.find(r => r.username === pendingRecipient);
        if (recipient) {
          setSelectedRecipient(recipient.id);
          setSearchTerm(recipient.username || '');
          setPendingRecipient(''); // Clear pending recipient
        }
      }
    } catch (error) {
      console.error('Error loading recipients:', error);
      setError('Failed to load recipients');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedRecipient || !messageSubject.trim() || !messageContent.trim()) {
      setError('Please fill in all fields');
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

      // Create the message
      await client.graphql({
        query: createMessage,
        variables: {
          input: {
            content: messageContent,
            subject: messageSubject,
            senderId: senderProfile.id,
            recipientId: selectedRecipient,
            isRead: false
          }
        }
      });

      onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient =>
    (recipient.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipient.userType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="compose-message">
      <div className="compose-header">
        <h2>New Message</h2>
        <button onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
      </div>

      <div className="compose-form">
        <div className="form-group">
          <label htmlFor="recipient">
            {selectedRecipient ? 'Message to:' : 'To:'}
          </label>
          {selectedRecipient ? (
            // Show selected recipient (completely non-editable)
            <div className="selected-recipient-display">
              <div className="recipient-info">
                <span className="recipient-name">{recipients.find(r => r.id === selectedRecipient)?.username}</span>
                <span className="recipient-type">({recipients.find(r => r.id === selectedRecipient)?.userType})</span>
              </div>
            </div>
          ) : (
            // Show search interface only when starting from Messages page (no pre-filled recipient)
            <div className="recipient-selector">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
              {searchTerm && (
                <div className="recipient-dropdown">
                  {loading ? (
                    <div className="loading-item">Loading...</div>
                  ) : filteredRecipients.length === 0 ? (
                    <div className="no-results">No users found</div>
                  ) : (
                    filteredRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className={`recipient-option ${selectedRecipient === recipient.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedRecipient(recipient.id);
                          setSearchTerm(recipient.username || '');
                        }}
                      >
                        <span className="recipient-name">{recipient.username}</span>
                        <span className="recipient-type">{recipient.userType}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            className="form-input"
            placeholder="Enter subject..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Message:</label>
          <textarea
            id="content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="form-textarea"
            placeholder="Type your message..."
            rows={8}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="compose-actions">
          <button 
            onClick={sendMessage} 
            disabled={sending || !selectedRecipient || !messageSubject.trim() || !messageContent.trim()}
            className="btn btn-primary"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessage;
