import { defineFunction } from '@aws-amplify/backend';

export const cleanupUnverifiedUsers = defineFunction({
  name: 'cleanupUnverifiedUsers',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memoryMB: 256
});
