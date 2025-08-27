import { useState, useEffect, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listMessages, listUserProfiles } from '../../queries';

interface UnreadMessagesState {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useUnreadMessages = (): UnreadMessagesState => {
  const { user, authStatus } = useAuthenticator();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.userId || authStatus !== 'authenticated') {
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
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
        setUnreadCount(0);
        return;
      }

      const userProfile = profiles[0];
      
      // Get all messages where user is recipient and not read
      const messagesResult = await client.graphql({
        query: listMessages,
        variables: {
          filter: {
            and: [
              { recipientId: { eq: userProfile.id } },
              { isRead: { eq: false } }
            ]
          }
        },
        authMode: 'userPool'
      });

      const unreadMessages = messagesResult.data.listMessages.items;
      setUnreadCount(unreadMessages.length);
    } catch (err) {
      console.error('Error loading unread messages count:', err);
      setError('Failed to load unread messages count');
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, user?.signInDetails?.loginId, authStatus]);

  // Load unread count on mount and when user changes
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  // Set up polling to check for new messages every 30 seconds
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [loadUnreadCount, authStatus]);

  return {
    unreadCount,
    isLoading,
    error
  };
};
