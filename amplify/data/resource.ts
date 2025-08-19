import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  UserProfile: a
    .model({
      email: a.string(),
      username: a.string(),
      userType: a.enum(['expert', 'ventures', 'both']),
      bio: a.string(),
      experience: a.string(),
      passions: a.string(),
      values: a.string(),
      missionValuesAlignment: a.string(),
      ventureInterests: a.string(),
      preferredEngagement: a.string(),
      contributionGoals: a.string(),
      skills: a.string(),
      location: a.string(),
      timezone: a.string(),
      latitude: a.float(),
      longitude: a.float(),
      timeCommitment: a.string(),
      expertSupportNeeded: a.string(),
      linkedinUrl: a.string(),
      githubUrl: a.string(),
      portfolioUrl: a.string(),
      twitterUrl: a.string(),
      instagramUrl: a.string(),
      websiteUrl: a.string(),
      projectDetails: a.string(),
      // Messaging preferences
      messagingEnabled: a.boolean().default(true),
      // Relationships
      sentMessages: a.hasMany('Message', 'senderId'),
      receivedMessages: a.hasMany('Message', 'recipientId'),
    })
    .authorization((allow) => [
      allow.owner(), // Users can only access their own profile
      allow.publicApiKey(), // Allow API key access for all operations (temporary for testing)
    ]),

  Message: a
    .model({
      content: a.string(),
      subject: a.string(),
      senderId: a.string(),
      recipientId: a.string(),
      conversationId: a.string(),
      isRead: a.boolean().default(false),
      // Relationships
      sender: a.belongsTo('UserProfile', 'senderId'),
      recipient: a.belongsTo('UserProfile', 'recipientId'),
    })
    .authorization((allow) => [
      allow.publicApiKey(), // Allow API key access for all operations (temporary for testing)
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
