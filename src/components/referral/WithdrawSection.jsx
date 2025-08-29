// src/components/referral/WithdrawSection.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiDownload, FiClock, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import {
  canWithdraw,
  getTimeUntilNextWithdrawal,
  formatTimeRemaining,
  formatNativeCurrency,
  WITHDRAWAL_COOLDOWN
} from '../../contracts/referralConfig';

const WithdrawWrapper = styled.div`
  background: rgba(12, 12, 12, 0.8);
  border: 2px solid #d22626;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .icon {
      font-size: 1.5rem;
      color: #d22626;
      margin-right: 10px;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }
  }

  .withdraw-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 25px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .withdraw-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #444;
    border-radius: 12px;
    padding: 25px;
    
    .chain-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      .chain-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      
      .chain-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: #ffffff;
      }
    }
    
    .available-amount {
      text-align: center;
      margin-bottom: 20px;
      
      .amount {
        font-size: 2rem;
        font-weight: 700;
        color: #d22626;
        margin-bottom: 5px;
      }
      
      .label {
        color: #cccccc;
        font-size: 0.9rem;
      }
    }
    
    .withdraw-status {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      
      &.available {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #22c55e;
      }
      
      &.cooldown {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #f59e0b;
      }
      
      &.insufficient {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
      }
    }
    
    .withdraw-button {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &.available {
        background: linear-gradient(135deg, #d22626, #b91c1c);
        color: white;
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(210, 38, 38, 0.4);
        }
      }
      
      &.disabled {
        background: rgba(255, 255, 255, 0.1);
        color: #888;
        border: 1px solid #444;
      }
      
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
    
    .minimum-info {
      margin-top: 15px;
      font-size: 0.8rem;
      color: #888;
      text-align: center;
    }
  }

  .global-info {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 8px;
    padding: 20px;
    color: #60a5fa;
    
    .info-title {
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 5px;
        padding-left: 15px;
        position: relative;
        
        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #60a5fa;
        }
      }
    }
  }

  .network-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.8rem;
    margin-top: 5px;
    opacity: 0.8;

    &.current-network {
      color: #4CAF50;
    }

    &.different-network {
      color: #FF9800;
    }

    .network-switch-icon {
      font-size: 0.7rem;
    }
  }
`;

const WithdrawSection = ({ 
  ethData, 
  bnbData, 
  onWithdraw, 
  isEthWithdrawing,
  isBnbWithdrawing,
  currentChainId,
  ethChainId,
  bnbChainId,
  ethTokenName,
  bnbTokenName
}) => {
  const [timeRemaining, setTimeRemaining] = useState({
    eth: 0,
    bnb: 0
  });

  useEffect(() => {
    const updateTimeRemaining = () => {
      setTimeRemaining({
        eth: ethData?.lastWithdrawal ? getTimeUntilNextWithdrawal(Number(ethData.lastWithdrawal)) : 0,
        bnb: bnbData?.lastWithdrawal ? getTimeUntilNextWithdrawal(Number(bnbData.lastWithdrawal)) : 0
      });
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [ethData?.lastWithdrawal, bnbData?.lastWithdrawal]);

  const getWithdrawStatus = (chainData, timeLeft, minPayout) => {
    if (!chainData) return { type: 'insufficient', message: 'No data available' };
    
    const currentBonus = Number(chainData.bonus || 0);
    const minimumPayout = Number(minPayout || 0);
    const lastWithdrawal = Number(chainData.lastWithdrawal || 0);
    
    // Check if user has any balance
    if (currentBonus === 0) {
      return { 
        type: 'insufficient', 
        message: 'No ETH/BNB available to withdraw' 
      };
    }
    
    // Check minimum amount requirement
    if (currentBonus < minimumPayout) {
      return { 
        type: 'insufficient', 
        message: `Minimum ${formatNativeCurrency(minimumPayout, 18, 4)} required` 
      };
    }
    
    // Check cooldown period (2 weeks)
    if (timeLeft > 0) {
      return { 
        type: 'cooldown', 
        message: `Available in ${formatTimeRemaining(timeLeft)}` 
      };
    }
    
    // All conditions met
    return { type: 'available', message: 'Ready to withdraw' };
  };

  const ethStatus = getWithdrawStatus(ethData, timeRemaining.eth, ethData?.minPayout);
  const bnbStatus = getWithdrawStatus(bnbData, timeRemaining.bnb, bnbData?.minPayout);

  // Helper function to get network name
  const getNetworkName = (chainId) => {
    if (chainId === ethChainId) return 'Ethereum (Sepolia)';
    if (chainId === bnbChainId) return 'BNB Smart Chain (Testnet)';
    return 'Unknown Network';
  };

  // Check if user is on correct network for each chain
  const isOnEthNetwork = currentChainId === ethChainId;
  const isOnBnbNetwork = currentChainId === bnbChainId;

  return (
    <WithdrawWrapper>
      <div className="header">
        <FiDownload className="icon" />
        <h3 className="title">Withdraw Bonuses</h3>
      </div>

      <div className="withdraw-grid">
        {/* Ethereum Withdrawal */}
        <div className="withdraw-card">
          <div className="chain-header">
            <img 
              src="/assets/images/token/eth.png" 
              alt="Ethereum" 
              className="chain-icon"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="chain-name">Ethereum (ETH)</div>
          </div>
          
          <div className="available-amount">
            <div className="amount">
              {formatNativeCurrency(ethData?.bonus || 0, 18, 4)} ETH
            </div>
            <div className="label">Available to Withdraw</div>
          </div>
          
          <div className={`withdraw-status ${ethStatus.type}`}>
            {ethStatus.type === 'available' && <FiCheck />}
            {ethStatus.type === 'cooldown' && <FiClock />}
            {ethStatus.type === 'insufficient' && <FiAlertCircle />}
            {ethStatus.message}
          </div>
          

          
          <div className={`network-indicator ${isOnEthNetwork ? 'current-network' : 'different-network'}`}>
            {isOnEthNetwork ? (
              <>
                <FiCheck className="network-switch-icon" />
                Connected to Ethereum (Sepolia)
              </>
            ) : (
              <>
                <FiRefreshCw className="network-switch-icon" />
                Will switch to Ethereum (Sepolia)
              </>
            )}
          </div>
          
          <button
            className={`withdraw-button ${ethStatus.type === 'available' ? 'available' : 'disabled'}`}
            onClick={() => onWithdraw('eth')}
            disabled={ethStatus.type !== 'available' || isEthWithdrawing}
          >
            {isEthWithdrawing ? (
              <>
                <div className="spinner" />
                Withdrawing...
              </>
            ) : (
              <>
                <FiDownload />
                Withdraw on ETH
              </>
            )}
          </button>
          
          <div className="minimum-info">
            Minimum withdrawal: {formatNativeCurrency(ethData?.minPayout || 0, 18, 4)} ETH
          </div>
        </div>

        {/* Binance Smart Chain Withdrawal */}
        <div className="withdraw-card">
          <div className="chain-header">
            <img 
              src="/assets/images/token/bnb.png" 
              alt="Binance Smart Chain" 
              className="chain-icon"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="chain-name">Binance Smart Chain (BNB)</div>
          </div>
          
          <div className="available-amount">
            <div className="amount">
              {formatNativeCurrency(bnbData?.bonus || 0, 18, 4)} BNB
            </div>
            <div className="label">Available to Withdraw</div>
          </div>
          
          <div className={`withdraw-status ${bnbStatus.type}`}>
            {bnbStatus.type === 'available' && <FiCheck />}
            {bnbStatus.type === 'cooldown' && <FiClock />}
            {bnbStatus.type === 'insufficient' && <FiAlertCircle />}
            {bnbStatus.message}
          </div>
          

          
          <div className={`network-indicator ${isOnBnbNetwork ? 'current-network' : 'different-network'}`}>
            {isOnBnbNetwork ? (
              <>
                <FiCheck className="network-switch-icon" />
                Connected to BNB Smart Chain (Testnet)
              </>
            ) : (
              <>
                <FiRefreshCw className="network-switch-icon" />
                Will switch to BNB Smart Chain (Testnet)
              </>
            )}
          </div>
          
          <button
            className={`withdraw-button ${bnbStatus.type === 'available' ? 'available' : 'disabled'}`}
            onClick={() => onWithdraw('bnb')}
            disabled={bnbStatus.type !== 'available' || isBnbWithdrawing}
          >
            {isBnbWithdrawing ? (
              <>
                <div className="spinner" />
                Withdrawing...
              </>
            ) : (
              <>
                <FiDownload />
                Withdraw on BNB
              </>
            )}
          </button>
          
          <div className="minimum-info">
            Minimum withdrawal: {formatNativeCurrency(bnbData?.minPayout || 0, 18, 4)} BNB
          </div>
        </div>
      </div>

      <div className="global-info">
        <div className="info-title">
          <FiAlertCircle />
          Withdrawal Information
        </div>
        <ul className="info-list">
          <li><strong>2-Week Cooldown:</strong> Withdrawals are available every 2 weeks after your last withdrawal</li>
          <li><strong>Minimum Balance:</strong> You must have ETH/BNB available and meet the minimum withdrawal amount</li>                   
          <li><strong>Chain Specific:</strong> Each chain (ETH/BNB) has its own minimum balance requirement and separate withdrawal history.</li>
          <li><strong>Bonus Earning:</strong> ETH/BNB bonuses are earned when people purchase tokens through your referral link</li>
        </ul>
      </div>
    </WithdrawWrapper>
  );
};

export default WithdrawSection;