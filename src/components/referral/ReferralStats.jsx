// src/components/referral/ReferralStats.jsx
import React from 'react';
import styled from 'styled-components';
import { formatLargeNumber } from '../../utils/referralUtils';
import { formatNativeCurrency } from '../../contracts/referralConfig';

const StatsWrapper = styled.div`
  margin-bottom: 30px;
`;

const OverviewSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const StatCard = styled.div`
  background: rgba(12, 12, 12, 0.8);
  border: 2px solid #d22626;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(210, 38, 38, 0.3);
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #d22626;
    margin-bottom: 10px;
    font-family: ${({ theme }) => theme.fonts.title2};
  }

  .stat-label {
    font-size: 1rem;
    color: #ffffff;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stat-sublabel {
    font-size: 0.85rem;
    color: #cccccc;
    margin-top: 5px;
  }
`;

const NetworkStatsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChainStatsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChainStatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'chainColor'
})`
  background: rgba(12, 12, 12, 0.9);
  border: 2px solid ${props => props.chainColor || '#444'};
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px ${props => props.chainColor ? `${props.chainColor}40` : 'rgba(68, 68, 68, 0.4)'};
  }
  
  .chain-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    
    .chain-icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
    
    .chain-name {
      font-size: 1.2rem;
      font-weight: 700;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
  
  .chain-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    .chain-stat {
      text-align: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      
      .value {
        font-size: 1.8rem;
        font-weight: 700;
        color: ${props => props.chainColor || '#d22626'};
        margin-bottom: 8px;
        font-family: ${({ theme }) => theme.fonts.title2};
      }
      
      .label {
        font-size: 0.9rem;
        color: #cccccc;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }
  }
`;

const ReferralStats = ({ 
  totalReferrals, 
  totalEarned, 
  availableToWithdraw, 
  currentTier,
  ethStats,
  bnbStats 
}) => {
  return (
    <StatsWrapper>
      {/* Overview Section */}
      <OverviewSection>
        <StatCard>
          <div className="stat-value">{formatLargeNumber(totalReferrals)}</div>
          <div className="stat-label">Total Referrals</div>
          <div className="stat-sublabel">All Networks Combined</div>
        </StatCard>

        <StatCard>
          <div className="stat-value">{currentTier?.tier || 1}</div>
          <div className="stat-label">Current Tier</div>
          <div className="stat-sublabel">{currentTier?.label || 'Bronze'} - {currentTier?.bonus || 10}% Bonus</div>
        </StatCard>
      </OverviewSection>

      {/* Network-Specific Stats */}
      <NetworkStatsSection>
        <ChainStatsWrapper>
          <ChainStatCard chainColor="#627EEA">
            <div className="chain-header">
              <img 
                src="/assets/images/token/eth.png" 
                alt="Ethereum" 
                className="chain-icon"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="chain-name">Ethereum</div>
            </div>
            <div className="chain-stats">
              <div className="chain-stat">
                <div className="value">{ethStats?.referrals || 0}</div>
                <div className="label">Referrals</div>
              </div>
              <div className="chain-stat">
                <div className="value">{formatNativeCurrency(ethStats?.earned || 0, 18, 4)}</div>
                <div className="label">Total Earned</div>
              </div>
            </div>
          </ChainStatCard>

          <ChainStatCard chainColor="#F3BA2F">
            <div className="chain-header">
              <img 
                src="/assets/images/token/bnb.png" 
                alt="Binance Smart Chain" 
                className="chain-icon"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="chain-name">BSC</div>
            </div>
            <div className="chain-stats">
              <div className="chain-stat">
                <div className="value">{bnbStats?.referrals || 0}</div>
                <div className="label">Referrals</div>
              </div>
              <div className="chain-stat">
                <div className="value">{formatNativeCurrency(bnbStats?.earned || 0, 18, 4)}</div>
                <div className="label">Total Earned</div>
              </div>
            </div>
          </ChainStatCard>
        </ChainStatsWrapper>
      </NetworkStatsSection>
    </StatsWrapper>
  );
};

export default ReferralStats;