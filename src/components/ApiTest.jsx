'use client';
import { useState } from 'react';
import { loginUser } from '@/lib/api';

export default function ApiTest() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      const response = await loginUser({
        email: 'test@example.com',
        password: 'testpassword'
      });
      
      setTestResult(`✅ API Response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ API Error: ${error.message}\n\nFull Error: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Test</h3>
      <button
        onClick={testLogin}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Login API'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-white rounded border">
          <pre className="text-sm overflow-auto max-h-96">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
