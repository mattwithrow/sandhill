import { defineBackend } from '@aws-amplify/backend';
//TW:import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
//  auth,
  data,
});
