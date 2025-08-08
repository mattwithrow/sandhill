/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Todo = {
  __typename: "Todo",
  content?: string | null,
  createdAt: string,
  id: string,
  updatedAt: string,
};

export type UserProfile = {
  __typename: "UserProfile",
  bio?: string | null,
  contributionGoals?: string | null,
  createdAt: string,
  email?: string | null,
  experience?: string | null,
  githubUrl?: string | null,
  id: string,
  instagramUrl?: string | null,
  linkedinUrl?: string | null,
  location?: string | null,
  owner?: string | null,
  passions?: string | null,
  portfolioUrl?: string | null,
  projectDetails?: string | null,
  skills?: string | null,
  twitterUrl?: string | null,
  updatedAt: string,
  userType?: UserProfileUserType | null,
  username?: string | null,
  values?: string | null,
  websiteUrl?: string | null,
};

export enum UserProfileUserType {
  both = "both",
  expert = "expert",
  ventures = "ventures",
}


export type ModelTodoFilterInput = {
  and?: Array< ModelTodoFilterInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTodoFilterInput | null,
  or?: Array< ModelTodoFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection",
  items:  Array<Todo | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  bio?: ModelStringInput | null,
  contributionGoals?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  experience?: ModelStringInput | null,
  githubUrl?: ModelStringInput | null,
  id?: ModelIDInput | null,
  instagramUrl?: ModelStringInput | null,
  linkedinUrl?: ModelStringInput | null,
  location?: ModelStringInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  passions?: ModelStringInput | null,
  portfolioUrl?: ModelStringInput | null,
  projectDetails?: ModelStringInput | null,
  skills?: ModelStringInput | null,
  twitterUrl?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userType?: ModelUserProfileUserTypeInput | null,
  username?: ModelStringInput | null,
  values?: ModelStringInput | null,
  websiteUrl?: ModelStringInput | null,
};

export type ModelUserProfileUserTypeInput = {
  eq?: UserProfileUserType | null,
  ne?: UserProfileUserType | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelTodoConditionInput = {
  and?: Array< ModelTodoConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTodoConditionInput | null,
  or?: Array< ModelTodoConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTodoInput = {
  content?: string | null,
  id?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  bio?: ModelStringInput | null,
  contributionGoals?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  experience?: ModelStringInput | null,
  githubUrl?: ModelStringInput | null,
  instagramUrl?: ModelStringInput | null,
  linkedinUrl?: ModelStringInput | null,
  location?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  owner?: ModelStringInput | null,
  passions?: ModelStringInput | null,
  portfolioUrl?: ModelStringInput | null,
  projectDetails?: ModelStringInput | null,
  skills?: ModelStringInput | null,
  twitterUrl?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userType?: ModelUserProfileUserTypeInput | null,
  username?: ModelStringInput | null,
  values?: ModelStringInput | null,
  websiteUrl?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  bio?: string | null,
  contributionGoals?: string | null,
  email?: string | null,
  experience?: string | null,
  githubUrl?: string | null,
  id?: string | null,
  instagramUrl?: string | null,
  linkedinUrl?: string | null,
  location?: string | null,
  passions?: string | null,
  portfolioUrl?: string | null,
  projectDetails?: string | null,
  skills?: string | null,
  twitterUrl?: string | null,
  userType?: UserProfileUserType | null,
  username?: string | null,
  values?: string | null,
  websiteUrl?: string | null,
};

export type DeleteTodoInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateTodoInput = {
  content?: string | null,
  id: string,
};

export type UpdateUserProfileInput = {
  bio?: string | null,
  contributionGoals?: string | null,
  email?: string | null,
  experience?: string | null,
  githubUrl?: string | null,
  id: string,
  instagramUrl?: string | null,
  linkedinUrl?: string | null,
  location?: string | null,
  passions?: string | null,
  portfolioUrl?: string | null,
  projectDetails?: string | null,
  skills?: string | null,
  twitterUrl?: string | null,
  userType?: UserProfileUserType | null,
  username?: string | null,
  values?: string | null,
  websiteUrl?: string | null,
};

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  bio?: ModelSubscriptionStringInput | null,
  contributionGoals?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  experience?: ModelSubscriptionStringInput | null,
  githubUrl?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  instagramUrl?: ModelSubscriptionStringInput | null,
  linkedinUrl?: ModelSubscriptionStringInput | null,
  location?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  passions?: ModelSubscriptionStringInput | null,
  portfolioUrl?: ModelSubscriptionStringInput | null,
  projectDetails?: ModelSubscriptionStringInput | null,
  skills?: ModelSubscriptionStringInput | null,
  twitterUrl?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userType?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  values?: ModelSubscriptionStringInput | null,
  websiteUrl?: ModelSubscriptionStringInput | null,
};

export type GetTodoQueryVariables = {
  id: string,
};

export type GetTodoQuery = {
  getTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      content?: string | null,
      createdAt: string,
      id: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      bio?: string | null,
      contributionGoals?: string | null,
      createdAt: string,
      email?: string | null,
      experience?: string | null,
      githubUrl?: string | null,
      id: string,
      instagramUrl?: string | null,
      linkedinUrl?: string | null,
      location?: string | null,
      owner?: string | null,
      passions?: string | null,
      portfolioUrl?: string | null,
      projectDetails?: string | null,
      skills?: string | null,
      twitterUrl?: string | null,
      updatedAt: string,
      userType?: UserProfileUserType | null,
      username?: string | null,
      values?: string | null,
      websiteUrl?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type DeleteTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: DeleteTodoInput,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type UpdateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: UpdateTodoInput,
};

export type UpdateTodoMutation = {
  updateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnCreateTodoSubscription = {
  onCreateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    bio?: string | null,
    contributionGoals?: string | null,
    createdAt: string,
    email?: string | null,
    experience?: string | null,
    githubUrl?: string | null,
    id: string,
    instagramUrl?: string | null,
    linkedinUrl?: string | null,
    location?: string | null,
    owner?: string | null,
    passions?: string | null,
    portfolioUrl?: string | null,
    projectDetails?: string | null,
    skills?: string | null,
    twitterUrl?: string | null,
    updatedAt: string,
    userType?: UserProfileUserType | null,
    username?: string | null,
    values?: string | null,
    websiteUrl?: string | null,
  } | null,
};
