# Unverified User Cleanup Function

This Lambda function automatically deletes unverified user accounts that have not verified their email address within 24 hours of signing up.

## How it works

1. **Scheduled Execution**: The function runs every hour via an EventBridge scheduled rule
2. **User Discovery**: Queries all users in the Cognito User Pool
3. **Verification Check**: Identifies users who are not confirmed and were created more than 24 hours ago
4. **Cleanup Process**: 
   - Deletes the user from Cognito User Pool
   - Deletes any associated user profile from DynamoDB
5. **Logging**: Provides detailed logs of the cleanup process

## Configuration

- **Schedule**: Runs every hour
- **Timeout**: 5 minutes (300 seconds)
- **Memory**: 256 MB
- **Runtime**: Node.js 18.x

## Required Permissions

The function requires the following IAM permissions:
- `cognito-idp:ListUsers` - To list all users in the User Pool
- `cognito-idp:AdminDeleteUser` - To delete unverified users
- `dynamodb:Query` - To query for user profiles
- `dynamodb:DeleteItem` - To delete user profiles

## Environment Variables

The function expects the following environment variables:
- `AUTH_USERPOOL_ID` - The Cognito User Pool ID
- `API_SANDHILL_USERTABLE_NAME` - The DynamoDB table name for user profiles
- `AWS_REGION` - The AWS region (automatically set by Lambda)

## Monitoring

The function logs the following information:
- Number of users processed
- Number of users deleted
- Any errors encountered during the process

You can monitor the function execution in CloudWatch Logs.
