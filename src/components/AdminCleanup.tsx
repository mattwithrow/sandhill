import React, { useState } from 'react';
import { invokeFunction } from 'aws-amplify/api';

const AdminCleanup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const triggerCleanup = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      // Invoke the Lambda function directly
      const response = await invokeFunction({
        name: 'cleanupUnverifiedUsers',
        payload: {} // Empty payload since the function doesn't need any input
      });
      
      setResult(`Cleanup completed successfully! Response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('Error triggering cleanup:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-cleanup" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Admin: Cleanup Unverified Users</h2>
      <p>
        This will delete all unverified user accounts that were created more than 24 hours ago.
        Use this for testing the cleanup functionality.
      </p>
      
      <button 
        onClick={triggerCleanup}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#ccc' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Running Cleanup...' : 'Trigger Cleanup'}
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
