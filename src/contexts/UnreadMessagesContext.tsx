import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

interface UnreadMessagesContextType {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refreshUnreadCount: () => void;
  decrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

interface UnreadMessagesProviderProps {
  children: ReactNode;
}

export const UnreadMessagesProvider: React.FC<UnreadMessagesProviderProps> = ({ children }) => {
  const { unreadCount, isLoading, error } = useUnreadMessages();
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  // Update local count when hook count changes
  React.useEffect(() => {
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  const refreshUnreadCount = useCallback(() => {
    // This will trigger a re-fetch in the hook
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  const decrementUnreadCount = useCallback(() => {
    setLocalUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const resetUnreadCount = useCallback(() => {
    setLocalUnreadCount(0);
  }, []);

  const value: UnreadMessagesContextType = {
    unreadCount: localUnreadCount,
    isLoading,
    error,
    refreshUnreadCount,
    decrementUnreadCount,
    resetUnreadCount
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessagesContext = (): UnreadMessagesContextType => {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error('useUnreadMessagesContext must be used within an UnreadMessagesProvider');
  }
  return context;
};
