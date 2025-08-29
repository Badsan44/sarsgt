// src/components/referralInfo/ReferralInfo.jsx
import React, { useContext, useState } from 'react';
import { PresaleContext } from '../../utils/PresaleContext';
import { 
  getCurrentReferrer, 
  clearCurrentReferrer, 
  generateReferralCode, 
  addReferralCode,
  getAllReferralCodes 
} from '../../utils/referralManager';
import { useAccount } from 'wagmi';

const ReferralInfo = () => {
  const { currentReferrer } = useContext(PresaleContext);
  const { address, isConnected } = useAccount();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [newReferralCode, setNewReferralCode] = useState('');

  const handleClearReferrer = () => {
    clearCurrentReferrer();
    window.location.reload(); // Refresh to update context
  };

  const handleGenerateCode = () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      const code = generateReferralCode(address);
      addReferralCode(code, address);
      setNewReferralCode(code);
      alert(`Generated referral code: ${code}`);
    } catch (error) {
      alert(`Error generating code: ${error.message}`);
    }
  };

  const copyReferralLink = () => {
    if (!newReferralCode) {
      alert('Generate a referral code first');
      return;
    }
    
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${newReferralCode}`;
    
    navigator.clipboard.writeText(referralUrl).then(() => {
      alert('Referral link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '12px',
      margin: '20px 0',
      color: 'white',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em' }}>🎯 Referral System</h3>
      
      {currentReferrer ? (
        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
            <strong>✅ Active Referrer:</strong>
          </p>
          <p style={{ 
            margin: '5px 0', 
            fontFamily: 'monospace', 
            background: 'rgba(255,255,255,0.1)', 
            padding: '8px', 
            borderRadius: '6px',
            fontSize: '0.8em',
            wordBreak: 'break-all'
          }}>
            {currentReferrer}
          </p>
          <button 
            onClick={handleClearReferrer}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
          >
            Clear Referrer
          </button>
        </div>
      ) : (
        <p style={{ margin: '5px 0', fontSize: '0.9em', opacity: '0.8' }}>
          No active referrer. Share a referral link to earn bonuses!
        </p>
      )}

      <div style={{ marginTop: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1em' }}>🔗 Your Referral</h4>
        
        {isConnected ? (
          <div>
            <button 
              onClick={handleGenerateCode}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: '0.9em'
              }}
            >
              Generate Code
            </button>
            
            {newReferralCode && (
              <button 
                onClick={copyReferralLink}
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                Copy Link
              </button>
            )}
            
            {newReferralCode && (
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '0.8em',
                background: 'rgba(255,255,255,0.1)',
                padding: '8px',
                borderRadius: '6px'
              }}>
                <strong>Your Code:</strong> {newReferralCode}
              </p>
            )}
          </div>
        ) : (
          <p style={{ margin: '5px 0', fontSize: '0.8em', opacity: '0.7' }}>
            Connect wallet to generate referral codes
          </p>
        )}
      </div>

      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.7em'
          }}
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info
        </button>
        
        {showDebugInfo && (
          <div style={{ 
            marginTop: '10px', 
            fontSize: '0.7em', 
            background: 'rgba(0,0,0,0.2)', 
            padding: '10px', 
            borderRadius: '6px' 
          }}>
            <p><strong>All Referral Codes:</strong></p>
            <pre style={{ margin: '5px 0', overflow: 'auto' }}>
              {JSON.stringify(getAllReferralCodes(), null, 2)}
            </pre>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Connected Address:</strong> {address || 'Not connected'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralInfo;