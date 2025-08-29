// src/components/referral/HistorySection.jsx
import React from 'react';
import styled from 'styled-components';
import ReferralHistory from './ReferralHistory';
import WithdrawalHistory from './WithdrawalHistory';
import { useUnifiedReferralData } from '../../hooks/useUnifiedReferralData';

const HistorySectionWrapper = styled.div`
  margin: 40px 0;
  
  .history-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  

  
  .error-state {
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.3);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    color: #FF3B30;
    margin-bottom: 20px;
    
    .error-title {
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .error-message {
      font-size: 14px;
      opacity: 0.8;
    }
  }
`;

const HistorySection = ({ userAddress, isConnected }) => {
  const { 
    referralData: referralHistory, 
    withdrawalData: withdrawalHistory, 
    loading: isLoading, 
    error, 
    refresh: refetch 
  } = useUnifiedReferralData();



  if (!isConnected || !userAddress) {
    return null;
  }

  return (
    <HistorySectionWrapper>
      {error && (
        <div className="error-state">
          <div className="error-title">Unable to Load History</div>
          <div className="error-message">
            There was an error loading your activity history. Please check your connection and try again.
          </div>
        </div>
      )}
      
      <div className="history-grid">
        <ReferralHistory 
          referralHistory={referralHistory}
          isLoading={isLoading}
          error={error}
        />
        <WithdrawalHistory 
          withdrawalHistory={withdrawalHistory}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </HistorySectionWrapper>
  );
};

export default HistorySection;