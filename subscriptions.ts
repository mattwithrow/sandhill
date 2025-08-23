/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onCreateMessage(filter: $filter) {
    content
    conversationId
    createdAt
    id
    isRead
    recipient {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    recipientId
    sender {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    senderId
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onCreateTodo = /* GraphQL */ `subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onCreateTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTodoSubscriptionVariables,
  APITypes.OnCreateTodoSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onCreateUserProfile(filter: $filter, owner: $owner) {
    accountStatus
    bio
    contributionGoals
    createdAt
    deletedAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    isDeleted
    isProfileHidden
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    projectDetails
    receivedMessages {
      nextToken
      __typename
    }
    sentMessages {
      nextToken
      __typename
    }
    skills
    statusMessage
    timeCommitment
    timezone
    twitterUrl
    updatedAt
    userType
    username
    values
    ventureInterests
    websiteUrl
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
  onDeleteMessage(filter: $filter) {
    content
    conversationId
    createdAt
    id
    isRead
    recipient {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    recipientId
    sender {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    senderId
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessageSubscriptionVariables,
  APITypes.OnDeleteMessageSubscription
>;
export const onDeleteTodo = /* GraphQL */ `subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
  onDeleteTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTodoSubscriptionVariables,
  APITypes.OnDeleteTodoSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onDeleteUserProfile(filter: $filter, owner: $owner) {
    accountStatus
    bio
    contributionGoals
    createdAt
    deletedAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    isDeleted
    isProfileHidden
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    projectDetails
    receivedMessages {
      nextToken
      __typename
    }
    sentMessages {
      nextToken
      __typename
    }
    skills
    statusMessage
    timeCommitment
    timezone
    twitterUrl
    updatedAt
    userType
    username
    values
    ventureInterests
    websiteUrl
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onUpdateMessage(filter: $filter) {
    content
    conversationId
    createdAt
    id
    isRead
    recipient {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    recipientId
    sender {
      accountStatus
      bio
      contributionGoals
      createdAt
      deletedAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      isDeleted
      isProfileHidden
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      projectDetails
      skills
      statusMessage
      timeCommitment
      timezone
      twitterUrl
      updatedAt
      userType
      username
      values
      ventureInterests
      websiteUrl
      __typename
    }
    senderId
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMessageSubscriptionVariables,
  APITypes.OnUpdateMessageSubscription
>;
export const onUpdateTodo = /* GraphQL */ `subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onUpdateTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTodoSubscriptionVariables,
  APITypes.OnUpdateTodoSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onUpdateUserProfile(filter: $filter, owner: $owner) {
    accountStatus
    bio
    contributionGoals
    createdAt
    deletedAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    isDeleted
    isProfileHidden
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    projectDetails
    receivedMessages {
      nextToken
      __typename
    }
    sentMessages {
      nextToken
      __typename
    }
    skills
    statusMessage
    timeCommitment
    timezone
    twitterUrl
    updatedAt
    userType
    username
    values
    ventureInterests
    websiteUrl
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
