// src/components/referral/ReferralHistory.jsx
import React from 'react';
import styled from 'styled-components';
import { FiUsers, FiExternalLink, FiClock, FiTrendingUp } from 'react-icons/fi';
import { getExplorerUrl } from '../../utils/referralUtils';

const ReferralHistoryCard = styled.div`
  background: rgba(12, 12, 12, 0.8);
  border: 2px solid #d22626;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
    
    .icon {
      width: 24px;
      height: 24px;
      color: #d22626;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }
  }
  
  .history-content {
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: rgba(255, 255, 255, 0.6);
      
      .empty-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 16px;
        opacity: 0.5;
      }
      
      .empty-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .empty-description {
        font-size: 14px;
        line-height: 1.5;
      }
    }
    
    .loading-state {
      text-align: center;
      padding: 40px 20px;
      color: rgba(255, 255, 255, 0.6);
      
      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(210, 38, 38, 0.3);
        border-top: 3px solid #d22626;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
    
    .history-list {
      /* Increased height to fit 4 history items (each item is ~70px with margin) */
      max-height: 300px;
      overflow-y: auto;
      padding-right: 10px; /* Add space for scrollbar to prevent clipping cards */
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(210, 38, 38, 0.5);
        border-radius: 3px;
        
        &:hover {
          background: rgba(210, 38, 38, 0.7);
        }
      }
    }
    
    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      margin-top: 3px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(210, 38, 38, 0.3);
        transform: translateY(-1px);
      }
      
      .item-left {
        flex: 1;
        
        .buyer-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          
          .buyer-address {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #FFFFFF;
            font-weight: 500;
          }
          
          .chain-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            
            &.eth {
              background: rgba(98, 126, 234, 0.2);
              color: #627EEA;
              border: 1px solid rgba(98, 126, 234, 0.3);
            }
            
            &.bnb {
              background: rgba(243, 186, 47, 0.2);
              color: #F3BA2F;
              border: 1px solid rgba(243, 186, 47, 0.3);
            }
          }
        }
        
        .purchase-details {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: 4px;
            
            .detail-icon {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
      
      .item-right {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .bonus-info {
          text-align: right;
          
          .bonus-percent {
            font-size: 16px;
            font-weight: 600;
            color: #d22626;
            margin-bottom: 2px;
          }
          
          .purchase-amount {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
        
        .external-link {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: color 0.3s ease;
          
          &:hover {
            color: #d22626;
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    
    .card-header .title {
      font-size: 20px;
    }
    
    .history-content .history-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      
      .item-right {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
`;

const ReferralHistory = ({ referralHistory, isLoading, error }) => {


  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openTransaction = (txHash, chain) => {
    // Convert chain string to chainId
    let chainId;
    if (chain === 'ETH') {
      chainId = 11155111; // Ethereum Sepolia
    } else if (chain === 'BNB') {
      chainId = 97; // BSC Testnet
    } else {
      console.error('Unknown chain for explorer URL:', chain);
      return;
    }
    
    const explorerUrl = getExplorerUrl(chainId, txHash);
    if (explorerUrl === '#') {
      console.error('Invalid chainId for explorer URL:', chainId);
      return;
    }
    window.open(explorerUrl, '_blank');
  };

  return (
    <ReferralHistoryCard>
      <div className="card-header">
        <FiUsers className="icon" />
        <h3 className="title">Referral History</h3>
        {referralHistory.length > 0 && (
          <span style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginLeft: 'auto',
            fontWeight: '400'
          }}>
            Latest {Math.min(referralHistory.length, 50)} referrals
          </span>
        )}
      </div>
      
      <div className="history-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading referral history...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <FiUsers className="empty-icon" />
            <div className="empty-title">Error Loading History</div>
            <div className="empty-description">
              Unable to load referral history. Please try again later.
            </div>
          </div>
        ) : referralHistory.length === 0 ? (
          <div className="empty-state">
            <FiUsers className="empty-icon" />
            <div className="empty-title">No Referrals Yet</div>
            <div className="empty-description">
              Share your referral link to start earning bonuses from successful purchases!
            </div>
          </div>
        ) : (
          <div className="history-list">
            {referralHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="item-left">
                  <div className="buyer-info">
                    <span className="buyer-address">
                      {formatAddress(item.buyer)}
                    </span>
                    <span className={`chain-badge ${item.chain.toLowerCase()}`}>
                      {item.chain}
                    </span>
                  </div>
                  <div className="purchase-details">
                    <div className="detail-item">
                      <FiClock className="detail-icon" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                    <div className="detail-item">
                      <FiTrendingUp className="detail-icon" />
                      <span>${parseFloat(item.usdAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="item-right">
                  <div className="bonus-info">
                    <div className="bonus-percent">
                      {item.bonusPercent}% Bonus
                    </div>
                    <div className="purchase-amount">
                      Cashback: {parseFloat(item.cashbackAmount || 0).toFixed(4)} {item.chain === 'ETH' ? 'ETH' : 'BNB'}
                    </div>
                  </div>
                  {item.transactionHash && (
                    <FiExternalLink 
                      className="external-link"
                      onClick={() => openTransaction(item.transactionHash, item.chain)}
                    />
                  )}
                  {!item.transactionHash && (
                    <div className="external-link" style={{ opacity: 0.3, cursor: 'not-allowed' }}>
                      <FiExternalLink />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ReferralHistoryCard>
  );
};

export default ReferralHistory;