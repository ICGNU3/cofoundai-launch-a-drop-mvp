
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount, useConnect } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
}

export const IntegrationTestSuite: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending' },
    { name: 'Authentication System', status: 'pending' },
    { name: 'Wallet Connection', status: 'pending' },
    { name: 'Project Creation', status: 'pending' },
    { name: 'Edge Functions', status: 'pending' },
  ]);

  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();

  const updateTest = (name: string, status: TestResult['status'], error?: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, error } : test
    ));
  };

  const runDatabaseTest = async () => {
    updateTest('Database Connection', 'running');
    try {
      const { data, error } = await supabase.from('projects').select('count').limit(1);
      if (error) throw error;
      updateTest('Database Connection', 'passed');
    } catch (error: any) {
      updateTest('Database Connection', 'failed', error.message);
    }
  };

  const runAuthTest = async () => {
    updateTest('Authentication System', 'running');
    try {
      const { data } = await supabase.auth.getSession();
      if (isAuthenticated && data.session) {
        updateTest('Authentication System', 'passed');
      } else {
        updateTest('Authentication System', 'failed', 'Not authenticated');
      }
    } catch (error: any) {
      updateTest('Authentication System', 'failed', error.message);
    }
  };

  const runWalletTest = async () => {
    updateTest('Wallet Connection', 'running');
    try {
      if (isConnected) {
        updateTest('Wallet Connection', 'passed');
      } else {
        updateTest('Wallet Connection', 'failed', 'Wallet not connected');
      }
    } catch (error: any) {
      updateTest('Wallet Connection', 'failed', error.message);
    }
  };

  const runProjectTest = async () => {
    updateTest('Project Creation', 'running');
    try {
      // Test project insertion
      const testProject = {
        project_idea: 'Test Project for Integration',
        project_type: 'Test',
        owner_id: '00000000-0000-0000-0000-000000000000', // Test UUID
        wallet_address: '0x0000000000000000000000000000000000000000',
      };
      
      const { error } = await supabase.from('projects').insert(testProject);
      if (error) throw error;
      
      // Clean up test data
      await supabase.from('projects').delete().eq('project_idea', 'Test Project for Integration');
      
      updateTest('Project Creation', 'passed');
    } catch (error: any) {
      updateTest('Project Creation', 'failed', error.message);
    }
  };

  const runEdgeFunctionTest = async () => {
    updateTest('Edge Functions', 'running');
    try {
      const { data, error } = await supabase.functions.invoke('stats');
      if (error) throw error;
      updateTest('Edge Functions', 'passed');
    } catch (error: any) {
      updateTest('Edge Functions', 'failed', error.message);
    }
  };

  const runAllTests = async () => {
    await runDatabaseTest();
    await runAuthTest();
    await runWalletTest();
    await runProjectTest();
    await runEdgeFunctionTest();
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'passed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Integration Test Suite</CardTitle>
        <Button onClick={runAllTests} className="w-fit">
          Run All Tests
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <span className="font-medium">{test.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {test.status === 'failed' && test.error && (
                  <span className="text-red-600">{test.error}</span>
                )}
                {test.status === 'passed' && (
                  <span className="text-green-600">✓ Passed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
