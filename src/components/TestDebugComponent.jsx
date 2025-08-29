// Temporary test component to debug data flow
import React, { useEffect, useState } from 'react';
import { useGraphReferralData } from '../hooks/useGraphReferralData';

const TestDebugComponent = () => {
  const mockAddress = '0xD5750BE371414bE28F39e0f88B68e3b0748d3B39';
  const [debugInfo, setDebugInfo] = useState('Loading...');
  
  // Use the actual hook to test data flow
  const { referralData, withdrawalData, loading, error } = useGraphReferralData();

  useEffect(() => {
    const info = {
      address: mockAddress,
      referralCount: referralData?.length || 0,
      withdrawalCount: withdrawalData?.length || 0,
      loading,
      error: error?.message || 'none',
      referralData: referralData?.map(r => ({
        amount: r.amount,
        timestamp: r.timestamp,
        network: r.network
      })) || [],
      withdrawalData: withdrawalData?.map(w => ({
        amount: w.amount,
        timestamp: w.timestamp,
        network: w.network
      })) || []
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('=== FULL DEBUG INFO ===', info);
  }, [referralData, withdrawalData, loading, error]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '10px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Debug Data Flow</div>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '9px' }}>{debugInfo}</pre>
    </div>
  );
};

export default TestDebugComponent;