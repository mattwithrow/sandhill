/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onCreateMessage(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    isRead
    owner
    recipient {
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
    bio
    contributionGoals
    createdAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    preferredEngagement
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
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onDeleteMessage(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    isRead
    owner
    recipient {
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
    bio
    contributionGoals
    createdAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    preferredEngagement
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
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onUpdateMessage(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    isRead
    owner
    recipient {
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
      bio
      contributionGoals
      createdAt
      email
      experience
      expertSupportNeeded
      githubUrl
      id
      instagramUrl
      latitude
      linkedinUrl
      location
      longitude
      messagingEnabled
      missionValuesAlignment
      owner
      passions
      portfolioUrl
      preferredEngagement
      projectDetails
      skills
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
    bio
    contributionGoals
    createdAt
    email
    experience
    expertSupportNeeded
    githubUrl
    id
    instagramUrl
    latitude
    linkedinUrl
    location
    longitude
    messagingEnabled
    missionValuesAlignment
    owner
    passions
    portfolioUrl
    preferredEngagement
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
