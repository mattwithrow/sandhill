# Messaging Feature

## Overview

The messaging feature allows users to communicate with each other on the Sandhill platform, facilitating introductions and potential engagements between experts and ventures.

## Features

### 1. User Messaging Preferences
- **Messaging Toggle**: Users can enable/disable messaging in their profile settings
- **Profile Integration**: Messaging preference is stored in the user profile
- **Access Control**: Users with messaging disabled cannot send or receive messages

### 2. Messaging Interface
- **Inbox**: View and manage received messages
- **Compose**: Send new messages to other users
- **Tabbed Interface**: Easy switching between inbox and compose modes
- **Real-time Updates**: Messages are marked as read when opened

### 3. Message Management
- **Message List**: Shows sender, subject, preview, and timestamp
- **Message Detail**: Full message view with reply functionality
- **Read Status**: Visual indicators for unread messages
- **Reply Feature**: Quick reply to messages from the detail view

### 4. User Discovery
- **Recipient Search**: Search for users by username or user type
- **Filtering**: Only shows users who have messaging enabled
- **Profile Integration**: Message buttons on public profiles

## Technical Implementation

### Database Schema

#### UserProfile Model
```typescript
UserProfile: {
  // ... existing fields
  messagingEnabled: boolean (default: true)
  sentMessages: hasMany('Message', 'senderId')
  receivedMessages: hasMany('Message', 'recipientId')
}
```

#### Message Model
```typescript
Message: {
  content: string
  subject: string
  senderId: string
  recipientId: string
  isRead: boolean (default: false)
  sender: belongsTo('UserProfile', 'senderId')
  recipient: belongsTo('UserProfile', 'recipientId')
}
```

### Components

1. **MessagingPage**: Main messaging interface with tabbed navigation
2. **MessagingInbox**: Displays received messages and message details
3. **ComposeMessage**: Form for creating and sending new messages

### Routes

- `/messages` - Main messaging page (protected route)
- `/messages?compose=true&recipient=username` - Direct compose to specific user

### Navigation

- Added "Messages" link to authenticated navigation
- Message buttons on public profiles (when messaging is enabled)

## User Experience

### For Users with Messaging Enabled
- Can send messages to other users who have messaging enabled
- Can receive messages from other users
- Full access to inbox and compose functionality
- Message buttons visible on public profiles

### For Users with Messaging Disabled
- Cannot send messages to other users
- Cannot receive messages from other users
- Message buttons hidden on their public profile
- Still have access to other platform features

### Profile Settings
- Checkbox in My Account page to enable/disable messaging
- Clear explanation of what happens when messaging is disabled
- Immediate effect on messaging capabilities

## Security & Privacy

- Messages are only visible to sender and recipient
- Users can control who can message them
- No public message history
- Respects user messaging preferences

## Future Enhancements

Potential improvements for the messaging system:
- Real-time notifications
- Message threading/conversations
- File attachments
- Message templates
- Block/unblock functionality
- Message search and filtering
