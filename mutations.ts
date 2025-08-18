/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createMessage = /* GraphQL */ `mutation CreateMessage(
  $condition: ModelMessageConditionInput
  $input: CreateMessageInput!
) {
  createMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $condition: ModelTodoConditionInput
  $input: CreateTodoInput!
) {
  createTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteMessage = /* GraphQL */ `mutation DeleteMessage(
  $condition: ModelMessageConditionInput
  $input: DeleteMessageInput!
) {
  deleteMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMessageMutationVariables,
  APITypes.DeleteMessageMutation
>;
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $condition: ModelTodoConditionInput
  $input: DeleteTodoInput!
) {
  deleteTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateMessage = /* GraphQL */ `mutation UpdateMessage(
  $condition: ModelMessageConditionInput
  $input: UpdateMessageInput!
) {
  updateMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMessageMutationVariables,
  APITypes.UpdateMessageMutation
>;
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $condition: ModelTodoConditionInput
  $input: UpdateTodoInput!
) {
  updateTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
