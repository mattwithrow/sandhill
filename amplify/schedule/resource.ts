import { defineSchedule } from '@aws-amplify/backend';
import { cleanupUnverifiedUsers } from '../function/resource';

export const cleanupSchedule = defineSchedule({
  name: 'cleanupUnverifiedUsers',
  rate: '1 hour',
  target: cleanupUnverifiedUsers,
});
