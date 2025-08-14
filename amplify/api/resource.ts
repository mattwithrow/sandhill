import { defineApi } from '@aws-amplify/backend';
import { cleanupUnverifiedUsers } from '../function/resource';

export const api = defineApi({
  name: 'cleanup-api',
  routes: {
    '/cleanup': {
      post: {
        function: cleanupUnverifiedUsers
      }
    }
  }
});
