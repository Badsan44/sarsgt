import React from 'react';
import { useUnifiedReferralData } from '../hooks/useUnifiedReferralData';
import { shouldUseTheGraph } from '../config/features';

const GraphTestComponent = () => {
  const { 
    referralData, 
    withdrawalData, 
    loading, 
    error, 
    stats, 
    refresh,
    dataSource 
  } = useUnifiedReferralData();

  const isUsingTheGraph = shouldUseTheGraph();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Referral Data Integration Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Data Source:</strong> {isUsingTheGraph ? 'The Graph Protocol' : 'Legacy Block Scanning'} ({dataSource})
        <button 
          onClick={refresh} 
          style={{ marginLeft: '10px', padding: '5px 10px' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4>Statistics</h4>
        <p>Total Referrals: {stats.totalReferrals}</p>
        <p>Total Earned: {stats.totalEarned} ETH/BNB</p>
        <p>Total Withdrawn: {stats.totalWithdrawn} ETH/BNB</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Recent Referrals ({referralData.length})</h4>
        {referralData.length > 0 ? (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {referralData.slice(0, 5).map((referral, index) => (
              <div key={referral.id || index} style={{ 
                padding: '10px', 
                border: '1px solid #eee', 
                marginBottom: '5px',
                fontSize: '12px'
              }}>
                <div><strong>Chain:</strong> {referral.chain}</div>
                <div><strong>Buyer:</strong> {referral.buyer}</div>
                <div><strong>USD Amount:</strong> ${referral.usdAmount}</div>
                <div><strong>Cashback:</strong> {referral.cashbackAmount}</div>
                <div><strong>Time:</strong> {referral.timestamp}</div>
                {referral.transactionHash && (
                  <div><strong>Tx:</strong> {referral.transactionHash.slice(0, 10)}...</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No referral data available</p>
        )}
      </div>

      <div>
        <h4>Recent Withdrawals ({withdrawalData.length})</h4>
        {withdrawalData.length > 0 ? (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {withdrawalData.slice(0, 5).map((withdrawal, index) => (
              <div key={withdrawal.id || index} style={{ 
                padding: '10px', 
                border: '1px solid #eee', 
                marginBottom: '5px',
                fontSize: '12px'
              }}>
                <div><strong>Chain:</strong> {withdrawal.chain}</div>
                <div><strong>Amount:</strong> {withdrawal.amount}</div>
                <div><strong>Time:</strong> {withdrawal.timestamp}</div>
                <div><strong>Total Withdrawn:</strong> {withdrawal.totalWithdrawnToDate}</div>
                {withdrawal.transactionHash && (
                  <div><strong>Tx:</strong> {withdrawal.transactionHash.slice(0, 10)}...</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No withdrawal data available</p>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Note:</strong> This component demonstrates the unified data integration.</p>
        <p>Switch between The Graph and legacy approaches using the feature flag in src/config/features.js</p>
        {isUsingTheGraph && (
          <p style={{ color: 'orange' }}>
            ⚠️ The Graph integration requires deployed subgraphs. Update URLs in features.js after deployment.
          </p>
        )}
      </div>
    </div>
  );
};

export default GraphTestComponent;