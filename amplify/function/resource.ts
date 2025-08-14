import { defineFunction } from '@aws-amplify/backend';

export const cleanupUnverifiedUsers = defineFunction({
  name: 'cleanupUnverifiedUsers',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memory: '256 MB',
  permissions: [
    {
      actions: [
        'cognito-idp:ListUsers',
        'cognito-idp:AdminDeleteUser'
      ],
      resources: ['*']
    }
  ]
});
