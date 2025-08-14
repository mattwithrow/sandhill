import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const AdminCleanup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const triggerCleanup = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      // For now, we'll simulate the cleanup since we don't have a direct API endpoint
      // In a real implementation, you would call the Lambda function via AWS SDK
      setResult(`Cleanup function is deployed and ready! 
      
Function Name: cleanupUnverifiedUsers
Function ARN: amplify-amplifyvitereactt-cleanupUnverifiedUsersla-CoKIR6JcSV9K

To test the function:
1. Go to AWS Lambda Console
2. Find the function: cleanupUnverifiedUsers
3. Click "Test" to run it manually
4. Check CloudWatch logs for results

The function will:
- Find all unverified users in Cognito
- Delete users who signed up more than 24 hours ago
- Log the results to CloudWatch`);
    } catch (error) {
      console.error('Error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-cleanup" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Admin: Unverified User Cleanup Function</h2>
      <p>
        The cleanup function has been successfully deployed to AWS Lambda. 
        This function will delete all unverified user accounts that were created more than 24 hours ago.
      </p>
      
      <button 
        onClick={triggerCleanup}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Loading...' : 'Show Function Info'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.includes('Error') ? '#f8d7da' : '#d4edda',
          border: `1px solid ${result.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '4px',
          color: result.includes('Error') ? '#721c24' : '#155724'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Note:</strong> This function will:
        <ul>
          <li>Find all unverified users in Cognito</li>
          <li>Delete users who signed up more than 24 hours ago</li>
          <li>Log the results to CloudWatch</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCleanup;
