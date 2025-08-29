// src/components/referral/TierProgress.jsx
import React from 'react';
import styled from 'styled-components';
import { REFERRAL_TIERS, getCurrentTier, getNextTier, getTierProgress } from '../../contracts/referralConfig';

const TierProgressWrapper = styled.div`
  background: rgba(12, 12, 12, 0.8);
  border: 2px solid #d22626;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  .header {
    text-align: center;
    margin-bottom: 30px;
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 10px;
    }
    
    .current-tier {
      font-size: 2rem;
      font-weight: 700;
      color: #d22626;
      margin-bottom: 5px;
    }
    
    .tier-label {
      font-size: 1.1rem;
      color: #cccccc;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .progress-section {
    margin-bottom: 30px;
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .progress-label {
        color: #ffffff;
        font-weight: 500;
      }
      
      .progress-value {
        color: #d22626;
        font-weight: 600;
      }
    }
    
    .progress-bar {
      width: 100%;
      height: 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #d22626, #f87171);
        border-radius: 6px;
        transition: width 0.5s ease;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }
      }
    }
    
    .next-tier-info {
      margin-top: 15px;
      text-align: center;
      color: #cccccc;
      font-size: 0.9rem;
      
      .highlight {
        color: #d22626;
        font-weight: 600;
      }
    }
  }

  .tier-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .tier-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #444;
    border-radius: 10px;
    padding: 15px 10px;
    text-align: center;
    transition: all 0.3s ease;
    
    &.current {
      background: rgba(210, 38, 38, 0.2);
      border-color: #d22626;
      transform: scale(1.05);
    }
    
    &.completed {
      background: rgba(34, 197, 94, 0.1);
      border-color: #22c55e;
    }
    
    .tier-number {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 5px;
      
      &.current {
        color: #d22626;
      }
      
      &.completed {
        color: #22c55e;
      }
      
      &.locked {
        color: #666;
      }
    }
    
    .tier-label {
      font-size: 0.8rem;
      color: #cccccc;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .tier-bonus {
      font-size: 0.9rem;
      font-weight: 600;
      
      &.current {
        color: #d22626;
      }
      
      &.completed {
        color: #22c55e;
      }
      
      &.locked {
        color: #666;
      }
    }
    
    .tier-requirement {
      font-size: 0.7rem;
      color: #888;
      margin-top: 5px;
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const TierProgress = ({ referralCount = 0 }) => {
  const currentTier = getCurrentTier(referralCount);
  const nextTier = getNextTier(referralCount);
  const progress = getTierProgress(referralCount);
  
  const remainingReferrals = nextTier ? nextTier.minBuyers - referralCount : 0;

  return (
    <TierProgressWrapper>
      <div className="header">
        <div className="title">Referral Tier Progress</div>
        <div className="current-tier">Tier {currentTier.tier}</div>
        <div className="tier-label">{currentTier.label} - {currentTier.bonus}% Bonus</div>
      </div>

      {nextTier && (
        <div className="progress-section">
          <div className="progress-header">
            <div className="progress-label">Progress to Tier {nextTier.tier}</div>
            <div className="progress-value">{Math.round(progress)}%</div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="next-tier-info">
            <span className="highlight">{remainingReferrals}</span> more referrals needed to reach{' '}
            <span className="highlight">Tier {nextTier.tier} ({nextTier.label})</span> with{' '}
            <span className="highlight">{nextTier.bonus}% bonus</span>
          </div>
        </div>
      )}

      {!nextTier && (
        <div className="progress-section">
          <div className="next-tier-info">
            🎉 Congratulations! You've reached the maximum tier with <span className="highlight">{currentTier.bonus}% bonus</span>
          </div>
        </div>
      )}

      <div className="tier-grid">
        {REFERRAL_TIERS.map((tier, index) => {
          const isCompleted = referralCount >= tier.minBuyers && tier.tier < currentTier.tier;
          const isCurrent = tier.tier === currentTier.tier;
          const isLocked = tier.tier > currentTier.tier;
          
          // Calculate additional referrals needed to reach next tier
          let requirementText = '';
          if (tier.tier === 8) {
            // Tier 8 is maximum tier, show special message
            requirementText = 'Become a Legend';
          } else {
            const nextTierIndex = index + 1;
            const nextTier = REFERRAL_TIERS[nextTierIndex];
            const additionalNeeded = nextTier.minBuyers - tier.minBuyers;
            
            if (tier.tier === 1) {
              requirementText = `${additionalNeeded} referrals to tier ${nextTier.tier}`;
            } else {
              requirementText = `+${additionalNeeded} referrals to tier ${nextTier.tier}`;
            }
          }
          
          return (
            <div 
              key={tier.tier} 
              className={`tier-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className={`tier-number ${isCurrent ? 'current' : isCompleted ? 'completed' : 'locked'}`}>
                {tier.tier}
              </div>
              <div className="tier-label">{tier.label}</div>
              <div className={`tier-bonus ${isCurrent ? 'current' : isCompleted ? 'completed' : 'locked'}`}>
                {tier.bonus}%
              </div>
              {requirementText && (
                <div className="tier-requirement">
                  {requirementText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </TierProgressWrapper>
  );
};

export default TierProgress;