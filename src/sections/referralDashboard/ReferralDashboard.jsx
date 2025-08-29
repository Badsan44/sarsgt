// src/sections/referralDashboard/ReferralDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import ReferralDashboardWrapper from './ReferralDashboard.style';
import ReferralLinkGenerator from '../../components/referral/ReferralLinkGenerator';
import ReferralStats from '../../components/referral/ReferralStats';
import TierProgress from '../../components/referral/TierProgress';
import WithdrawSection from '../../components/referral/WithdrawSection';
import HistorySection from '../../components/referral/HistorySection';
import MaterialsTab from '../../components/referral/MaterialsTab';
import { 
  getEthReferralCalls, 
  getBnbReferralCalls, 
  getCurrentTier,
  WITHDRAWAL_COOLDOWN,
  parseReferrerInfo,
  formatNativeCurrency
} from '../../contracts/referralConfig';
import * as ConfigModuleEth from '../../contracts/configEth';
import * as ConfigModuleBnb from '../../contracts/configBnb';

// Chain IDs
const ETH_CHAIN_ID = 11155111; // Sepolia testnet
const BNB_CHAIN_ID = 97; // BSC testnet

const ReferralDashboard = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isWithdrawing, setIsWithdrawing] = useState({
    eth: false,
    bnb: false
  });
  const [withdrawChain, setWithdrawChain] = useState(null);
  
  // Local state to track withdrawal timestamps for immediate UI updates
  const [localWithdrawalTimestamps, setLocalWithdrawalTimestamps] = useState({
    eth: null,
    bnb: null
  });

  // Get contract calls for both chains
  const ethCalls = address ? getEthReferralCalls(address) : {};
  const bnbCalls = address ? getBnbReferralCalls(address) : {};

  // ETH Chain Data - Use comprehensive referrer info
  const { data: ethReferrerInfo, refetch: refetchEthReferrerInfo } = useReadContract({
    ...ethCalls.referrerInfo,
    enabled: !!address
  });

  const { data: ethMinPayout } = useReadContract({
    ...ethCalls.minReferralPayout,
    enabled: !!address
  });

  const { data: ethWithdrawalHistory, refetch: refetchEthWithdrawalHistory } = useReadContract({
    ...ethCalls.withdrawalHistory,
    enabled: !!address
  });

  // BNB Chain Data - Use comprehensive referrer info
  const { data: bnbReferrerInfo, refetch: refetchBnbReferrerInfo } = useReadContract({
    ...bnbCalls.referrerInfo,
    enabled: !!address
  });

  const { data: bnbMinPayout } = useReadContract({
    ...bnbCalls.minReferralPayout,
    enabled: !!address
  });

  const { data: bnbWithdrawalHistory, refetch: refetchBnbWithdrawalHistory } = useReadContract({
    ...bnbCalls.withdrawalHistory,
    enabled: !!address
  });

  // Token Names
  const { data: ethTokenName } = useReadContract({
    ...ConfigModuleEth.tokenNameCall,
    enabled: !!address
  });

  const { data: bnbTokenName } = useReadContract({
    ...ConfigModuleBnb.tokenNameCall,
    enabled: !!address
  });

  // Withdrawal functions
  const { writeContract: withdrawEth, data: ethWithdrawHash, reset: resetEthWithdraw } = useWriteContract();
  const { writeContract: withdrawBnb, data: bnbWithdrawHash, reset: resetBnbWithdraw } = useWriteContract();

  // Wait for withdrawal transactions
  const { 
    isLoading: isEthWithdrawPending, 
    error: ethWithdrawError,
    status: ethWithdrawStatus 
  } = useWaitForTransactionReceipt({
    hash: ethWithdrawHash,
  });

  const { 
    isLoading: isBnbWithdrawPending, 
    error: bnbWithdrawError,
    status: bnbWithdrawStatus 
  } = useWaitForTransactionReceipt({
    hash: bnbWithdrawHash,
  });

  // Parse referrer info from contract responses
  const ethInfo = parseReferrerInfo(ethReferrerInfo);
  const bnbInfo = parseReferrerInfo(bnbReferrerInfo);

  // Calculate aggregated data
  const totalReferrals = ethInfo.totalReferrals + bnbInfo.totalReferrals;
  const totalEarned = ethInfo.totalEarned + bnbInfo.totalEarned;
  const availableToWithdraw = ethInfo.pendingCashback + bnbInfo.pendingCashback;
  const currentTier = getCurrentTier(totalReferrals);

  // Helper function to get the most recent withdrawal timestamp
  const getLastWithdrawalTimestamp = (contractTimestamp, localTimestamp) => {
    // Use local timestamp if it exists and is more recent than contract data
    if (localTimestamp && contractTimestamp) {
      return Math.max(localTimestamp, contractTimestamp - WITHDRAWAL_COOLDOWN);
    }
    // Use local timestamp if contract data is not available
    if (localTimestamp) {
      return localTimestamp;
    }
    // Fall back to contract data
    return contractTimestamp ? contractTimestamp - WITHDRAWAL_COOLDOWN : 0;
  };

  // Prepare chain-specific data
  const ethData = {
    referrals: ethInfo.totalReferrals,
    earned: ethInfo.totalEarned,
    bonus: ethInfo.pendingCashback,
    lastWithdrawal: getLastWithdrawalTimestamp(ethInfo.nextWithdrawalTime, localWithdrawalTimestamps.eth),
    minPayout: Number(ethMinPayout || 0),
    withdrawalHistory: ethWithdrawalHistory || [],
    withdrawalCount: ethInfo.withdrawalCount
  };

  const bnbData = {
    referrals: bnbInfo.totalReferrals,
    earned: bnbInfo.totalEarned,
    bonus: bnbInfo.pendingCashback,
    lastWithdrawal: getLastWithdrawalTimestamp(bnbInfo.nextWithdrawalTime, localWithdrawalTimestamps.bnb),
    minPayout: Number(bnbMinPayout || 0),
    withdrawalHistory: bnbWithdrawalHistory || [],
    withdrawalCount: bnbInfo.withdrawalCount
  };

  // Handle withdrawal with automatic network switching
  const handleWithdraw = async (chain) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsWithdrawing(prev => ({ ...prev, [chain]: true }));
    setWithdrawChain(chain);

    try {
      const targetChainId = chain === 'eth' ? ETH_CHAIN_ID : BNB_CHAIN_ID;
      const chainName = chain === 'eth' ? 'Ethereum (Sepolia)' : 'BNB Smart Chain (Testnet)';

      // Check if we need to switch networks
      if (chainId !== targetChainId) {
        toast.info(`Switching to ${chainName}...`);
        
        try {
          await switchChain({ chainId: targetChainId });
          toast.success(`Successfully switched to ${chainName}`);
          
          // Small delay to ensure network switch is complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError) {
          console.error('Network switch error:', switchError);
          
          // Handle network switch cancellation
          const switchErrorMessage = switchError.message?.toLowerCase() || '';
          const switchErrorCode = switchError.code;
          
          if (
            switchErrorMessage.includes('user rejected') ||
            switchErrorMessage.includes('user denied') ||
            switchErrorMessage.includes('user cancelled') ||
            switchErrorCode === 4001 ||
            switchErrorCode === 'ACTION_REJECTED'
          ) {
            toast.warn('Network switch was cancelled by user.');
          } else {
            toast.error(`Failed to switch to ${chainName}. Please switch manually in your wallet.`);
          }
          
          setIsWithdrawing(prev => ({ ...prev, [chain]: false }));
          setWithdrawChain(null);
          return;
        }
      }

      // Proceed with withdrawal on correct network
      if (chain === 'eth') {
        await withdrawEth({
          ...ethCalls.withdrawReferralBonus
        });
        toast.success('ETH withdrawal initiated! Please confirm the transaction.');
      } else if (chain === 'bnb') {
        await withdrawBnb({
          ...bnbCalls.withdrawReferralBonus
        });
        toast.success('BNB withdrawal initiated! Please confirm the transaction.');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      
      // Handle specific error cases with comprehensive user rejection detection
      const errorMessage = error.message?.toLowerCase() || '';
      const errorCode = error.code;
      
      if (
        errorMessage.includes('user rejected') ||
        errorMessage.includes('user denied') ||
        errorMessage.includes('user cancelled') ||
        errorMessage.includes('rejected by user') ||
        errorMessage.includes('cancelled by user') ||
        errorMessage.includes('transaction was rejected') ||
        errorCode === 4001 || // MetaMask user rejection code
        errorCode === 'ACTION_REJECTED' // Wagmi rejection code
      ) {
        toast.warn('Transaction was cancelled by user.');
      } else if (errorMessage.includes('insufficient funds')) {
        toast.error('Insufficient funds for gas fees.');
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('gas')) {
        toast.error('Gas estimation failed. Please try again.');
      } else {
        toast.error(error.message || 'Withdrawal failed. Please try again.');
      }
    } finally {
      setIsWithdrawing(prev => ({ ...prev, [chain]: false }));
      setWithdrawChain(null);
    }
  };

  // Handle successful withdrawals
  useEffect(() => {
    if (ethWithdrawHash && !isEthWithdrawPending) {
      toast.success('ETH withdrawal completed successfully!');
      
      // Immediately update local timestamp to trigger cooldown
      const currentTimestamp = Math.floor(Date.now() / 1000);
      setLocalWithdrawalTimestamps(prev => ({
        ...prev,
        eth: currentTimestamp
      }));
      
      // Reset ETH withdrawal state and clear transaction hash
      setIsWithdrawing(prev => ({ ...prev, eth: false }));
      resetEthWithdraw();
      
      // Refetch contract data to update available amounts
      refetchEthReferrerInfo();
      refetchEthWithdrawalHistory();
    }
  }, [ethWithdrawHash, isEthWithdrawPending, refetchEthReferrerInfo, refetchEthWithdrawalHistory, resetEthWithdraw]);

  useEffect(() => {
    if (bnbWithdrawHash && !isBnbWithdrawPending) {
      toast.success('BNB withdrawal completed successfully!');
      
      // Immediately update local timestamp to trigger cooldown
      const currentTimestamp = Math.floor(Date.now() / 1000);
      setLocalWithdrawalTimestamps(prev => ({
        ...prev,
        bnb: currentTimestamp
      }));
      
      // Reset BNB withdrawal state and clear transaction hash
      setIsWithdrawing(prev => ({ ...prev, bnb: false }));
      resetBnbWithdraw();
      
      // Refetch contract data to update available amounts
      refetchBnbReferrerInfo();
      refetchBnbWithdrawalHistory();
    }
  }, [bnbWithdrawHash, isBnbWithdrawPending, refetchBnbReferrerInfo, refetchBnbWithdrawalHistory, resetBnbWithdraw]);

  // Handle ETH withdrawal transaction failures
  useEffect(() => {
    if (ethWithdrawError) {
      console.error('ETH withdrawal transaction failed:', ethWithdrawError);
      toast.error('ETH withdrawal transaction failed. Please try again.');
      setIsWithdrawing(prev => ({ ...prev, eth: false }));
      resetEthWithdraw();
    }
  }, [ethWithdrawError, resetEthWithdraw]);

  // Handle BNB withdrawal transaction failures
  useEffect(() => {
    if (bnbWithdrawError) {
      console.error('BNB withdrawal transaction failed:', bnbWithdrawError);
      toast.error('BNB withdrawal transaction failed. Please try again.');
      setIsWithdrawing(prev => ({ ...prev, bnb: false }));
      resetBnbWithdraw();
    }
  }, [bnbWithdrawError, resetBnbWithdraw]);

  // Reset local timestamps and withdrawal states when address changes
  useEffect(() => {
    setLocalWithdrawalTimestamps({
      eth: null,
      bnb: null
    });
    setIsWithdrawing({
      eth: false,
      bnb: false
    });
    resetEthWithdraw();
    resetBnbWithdraw();
  }, [address, resetEthWithdraw, resetBnbWithdraw]);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ReferralDashboardWrapper>
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Referral Dashboard</h1>
          <p className="dashboard-subtitle">
            Share your referral link and earn bonus tokens from every successful purchase!
          </p>
        </div>

        <div className="dashboard-content">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'materials', label: 'Materials for Referrers' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  background: activeTab === t.key ? 'linear-gradient(135deg, #d22626, #b91c1c)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid',
                  borderColor: activeTab === t.key ? '#d22626' : '#444',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Referral Link Generator */}
          <ReferralLinkGenerator 
            walletAddress={address}
            isConnected={isConnected}
          />

          {isConnected && address && activeTab === 'overview' && (
            <>
              {/* Referral Statistics */}
              <ReferralStats
                totalReferrals={totalReferrals}
                totalEarned={totalEarned}
                availableToWithdraw={availableToWithdraw}
                currentTier={currentTier}
                ethStats={ethData}
                bnbStats={bnbData}
              />

              {/* Tier Progress */}
              <TierProgress referralCount={totalReferrals} />

              {/* History Section */}
              <HistorySection 
                userAddress={address}
                isConnected={isConnected}
              />

              {/* Withdrawal Section */}
              <WithdrawSection
                ethData={ethData}
                bnbData={bnbData}
                onWithdraw={handleWithdraw}
                isEthWithdrawing={isWithdrawing.eth || isEthWithdrawPending}
                isBnbWithdrawing={isWithdrawing.bnb || isBnbWithdrawPending}
                currentChainId={chainId}
                ethChainId={ETH_CHAIN_ID}
                bnbChainId={BNB_CHAIN_ID}
                ethTokenName={ethTokenName}
                bnbTokenName={bnbTokenName}
              />
            </>

          )}

          {isConnected && address && activeTab === 'materials' && (
            <MaterialsTab />
          )}

          {!isConnected && (
            <div className="connect-wallet-prompt">
              <div className="prompt-content">
                <h3>Connect Your Wallet</h3>
                <p>
                  Connect your wallet to view your referral statistics, generate referral links, 
                  and withdraw your earned bonuses.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReferralDashboardWrapper>
  );
};

export default ReferralDashboard;