# My Account Features

## Overview
The My Account functionality allows authenticated users to manage their profile information and preferences.

## Features Implemented

### 1. Navigation Updates
- **My Account Button**: Added to the global navigation (to the left of Sign Out) for authenticated users
- **Conditional Display**: Only shows when user is authenticated
- **Mobile Support**: Works on both desktop and mobile navigation

### 2. User Profile Management
- **Automatic Profile Creation**: A user profile is automatically created when a user signs up
- **Profile Fields**:
  - **User Type**: Radio buttons for "Builder", "Ideas", or "Both"
  - **Social Links**: 
    - LinkedIn URL
    - GitHub URL
    - Portfolio URL
  - **Project Details**: Text area for describing ideas, projects, or interests

### 3. Technical Implementation

#### Database Schema (UserProfile Model)
```typescript
UserProfile: {
  userId: string (required)
  userType: enum ['builder', 'ideas', 'both'] (required)
  linkedinUrl: string (optional)
  githubUrl: string (optional)
  portfolioUrl: string (optional)
  projectDetails: string (optional)
}
```

#### Authorization Rules
- **Owner Access**: Users can only read/write their own profile
- **Public Read**: Anyone can read profiles (for discovery purposes)

#### Components Created
1. **MyAccountPage.tsx**: Main profile management page
2. **useUserProfile.ts**: Custom hook for profile state management
3. **Updated Navigation.tsx**: Added My Account button
4. **Updated App.tsx**: Added protected route for /my-account

### 4. User Experience
- **Loading States**: Shows loading indicator while fetching profile
- **Error Handling**: Displays error messages if operations fail
- **Success Feedback**: Shows success message when profile is saved
- **Form Validation**: Proper input types and validation
- **Responsive Design**: Works on all screen sizes

### 5. Route Protection
- **Protected Route**: /my-account is only accessible to authenticated users
- **Automatic Redirect**: Unauthenticated users are redirected to login

## Usage Flow

1. **User Signs Up**: Profile is automatically created with default values
2. **User Clicks "My Account"**: Navigates to profile management page
3. **User Updates Profile**: Fills in their information and preferences
4. **User Saves**: Profile is updated in the database
5. **Profile Available**: Information can be used throughout the app

## Future Enhancements
- Profile picture upload
- Additional social media links
- Skills/interests tags
- Project portfolio showcase
- Connection requests between users
- Profile visibility settings

## Technical Notes
- Uses Amplify Data for database operations
- Integrates with Amplify Authentication
- TypeScript interfaces for type safety
- Responsive CSS classes for styling
- Error boundaries and loading states 