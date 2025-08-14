import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  try {
    console.log('Starting cleanup of unverified users...');
    
    const userPoolId = process.env.AUTH_USERPOOL_ID;
    if (!userPoolId) {
      throw new Error('AUTH_USERPOOL_ID environment variable is not set');
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cutoffTime = Math.floor(twentyFourHoursAgo.getTime() / 1000);

    // List all users in the user pool
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: userPoolId,
    });

    const usersResponse = await cognitoClient.send(listUsersCommand);
    const users = usersResponse.Users || [];

    let deletedCount = 0;
    const errors: string[] = [];

    for (const user of users) {
      try {
        // Check if user is not verified and was created more than 24 hours ago
        const isVerified = user.UserStatus === 'CONFIRMED';
        const createdAt = user.UserCreateDate ? Math.floor(user.UserCreateDate.getTime() / 1000) : 0;
        
        if (!isVerified && createdAt < cutoffTime) {
          console.log(`Deleting unverified user: ${user.Username}`);
          
          // Delete user from Cognito
          const deleteUserCommand = new AdminDeleteUserCommand({
            UserPoolId: userPoolId,
            Username: user.Username,
          });
          
          await cognitoClient.send(deleteUserCommand);
          
          deletedCount++;
        }
      } catch (error) {
        const errorMessage = `Error processing user ${user.Username}: ${error}`;
        console.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} unverified users.`);
    
    if (errors.length > 0) {
      console.error('Errors encountered:', errors);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Cleanup completed. Deleted ${deletedCount} unverified users.`,
        deletedCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
    };
  } catch (error) {
    console.error('Error in cleanup function:', error);
    throw error;
  }
};
