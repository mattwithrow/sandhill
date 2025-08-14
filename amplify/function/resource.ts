import { defineFunction } from '@aws-amplify/backend';

export const cleanupUnverifiedUsers = defineFunction({
  name: 'cleanupUnverifiedUsers',
  entry: './handler.ts',
  runtime: 'nodejs18.x',
  timeoutSeconds: 300,
  memory: '256 MB',
  permissions: [
    {
      actions: [
        'cognito-idp:ListUsers',
        'cognito-idp:AdminDeleteUser'
      ],
      resources: ['*']
    },
    {
      actions: [
        'dynamodb:Query',
        'dynamodb:DeleteItem'
      ],
      resources: ['*']
    }
  ]
});
