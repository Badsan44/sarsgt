// src/components/referral/ReferralStatus.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiGift, FiX } from 'react-icons/fi';
import { getReferralStatus } from '../../utils/referralEnhancedBuy';

const ReferralStatusWrapper = styled.div`
  margin-bottom: 20px;
  
  .referral-banner {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 12px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: slideIn 0.3s ease;
    
    .referral-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .referral-icon {
        font-size: 1.2rem;
        color: #22c55e;
        flex-shrink: 0;
      }
      
      .referral-content {
        .referral-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #22c55e;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .referral-text {
          font-size: 0.8rem;
          color: #ffffff;
          opacity: 0.9;
        }
      }
    }
    
    .close-button {
      background: none;
      border: none;
      color: #22c55e;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(34, 197, 94, 0.1);
      }
    }
  }
  
  .no-referral-info {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    
    .info-text {
      font-size: 0.8rem;
      color: #60a5fa;
      margin-bottom: 8px;
    }
    
    .referral-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.8rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .referral-banner {
      padding: 12px 15px;
      
      .referral-info {
        gap: 10px;
        
        .referral-content {
          .referral-title {
            font-size: 0.85rem;
          }
          
          .referral-text {
            font-size: 0.75rem;
          }
        }
      }
    }
    
    .no-referral-info {
      padding: 10px 12px;
      
      .info-text,
      .referral-link {
        font-size: 0.75rem;
      }
    }
  }
`;

const ReferralStatus = ({ showPrompt = true }) => {
  const [referralStatus, setReferralStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const status = getReferralStatus();
    setReferralStatus(status);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  if (referralStatus?.hasReferral) {
    return (
      <ReferralStatusWrapper>
        <div className="referral-banner">
          <div className="referral-info">
            <FiGift className="referral-icon" />
            <div className="referral-content">
              <div className="referral-title">
                <FiUsers size={14} />
                Referral Bonus Active!
              </div>
              <div className="referral-text">
                {referralStatus.displayText}
              </div>
            </div>
          </div>
          <button className="close-button" onClick={handleClose}>
            <FiX size={16} />
          </button>
        </div>
      </ReferralStatusWrapper>
    );
  }

  if (showPrompt && !referralStatus?.hasReferral) {
    return (
      <ReferralStatusWrapper>
        <div className="no-referral-info">
          <div className="info-text">
            Want to earn referral bonuses? Create your referral link!
          </div>
          <a href="#/referral-dashboard" className="referral-link">
            Go to Referral Dashboard →
          </a>
        </div>
      </ReferralStatusWrapper>
    );
  }

  return null;
};

export default ReferralStatus;