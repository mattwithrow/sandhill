/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const getTodo = /* GraphQL */ `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTodoQueryVariables, APITypes.GetTodoQuery>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      content
      createdAt
      id
      isRead
      owner
      recipientId
      senderId
      subject
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const listTodos = /* GraphQL */ `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      content
      createdAt
      id
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTodosQueryVariables, APITypes.ListTodosQuery>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
