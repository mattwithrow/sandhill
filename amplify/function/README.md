# Unverified User Cleanup Function

This Lambda function automatically deletes unverified user accounts that have not verified their email address within 24 hours of signing up.

## How it works

1. **Manual Execution**: The function can be triggered manually via the admin interface
2. **User Discovery**: Queries all users in the Cognito User Pool
3. **Verification Check**: Identifies users who are not confirmed and were created more than 24 hours ago
4. **Cleanup Process**: 
   - Deletes the user from Cognito User Pool
   - Note: User profiles in DynamoDB will be automatically cleaned up when the user is deleted from Cognito
5. **Logging**: Provides detailed logs of the cleanup process

## Configuration

- **Timeout**: 5 minutes (300 seconds)
- **Memory**: 256 MB
- **Runtime**: Node.js (latest)

## Required Permissions

The function requires the following IAM permissions:
- `cognito-idp:ListUsers` - To list all users in the User Pool
- `cognito-idp:AdminDeleteUser` - To delete unverified users

## Environment Variables

The function expects the following environment variables:
- `AUTH_USERPOOL_ID` - The Cognito User Pool ID
- `AWS_REGION` - The AWS region (automatically set by Lambda)

## Usage

### Manual Trigger via Web Interface
1. Navigate to `/admin/cleanup` in your application
2. Click "Trigger Cleanup" button
3. View the results in real-time

### Programmatic Invocation
You can also invoke the function programmatically using the AWS SDK or Amplify's `invokeFunction` API.

## Monitoring

The function logs the following information:
- Number of users processed
- Number of users deleted
- Any errors encountered during the process

You can monitor the function execution in CloudWatch Logs.

## Setting Up Automatic Scheduling

To set up automatic cleanup, you can:

1. **Use AWS EventBridge** to create a scheduled rule that triggers the function
2. **Set up a cron job** to call the function periodically
3. **Use AWS Lambda with EventBridge** to schedule the function directly

Example EventBridge rule (runs every hour):
```json
{
  "schedule": "rate(1 hour)",
  "target": {
    "arn": "arn:aws:lambda:us-east-1:123456789012:function:cleanupUnverifiedUsers"
  }
}
```
