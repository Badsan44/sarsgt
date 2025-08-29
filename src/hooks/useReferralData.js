// src/hooks/useReferralData.js
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  getEthReferralCalls, 
  getBnbReferralCalls,
  formatNativeCurrency
} from '../contracts/referralConfig';

export const useReferralData = (userAddress) => {
  const [referralHistory, setReferralHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get contract calls for both chains
  const ethCalls = userAddress ? getEthReferralCalls(userAddress) : {};
  const bnbCalls = userAddress ? getBnbReferralCalls(userAddress) : {};

  // ETH Chain Data
  const { data: ethReferrerInfo, isLoading: ethReferrerLoading, error: ethReferrerError } = useReadContract({
    ...ethCalls.referrerInfo,
    enabled: !!userAddress
  });

  const { data: ethWithdrawalHistory, isLoading: ethWithdrawalLoading, error: ethWithdrawalError } = useReadContract({
    ...ethCalls.withdrawalHistory,
    enabled: !!userAddress
  });

  // BNB Chain Data
  const { data: bnbReferrerInfo, isLoading: bnbReferrerLoading, error: bnbReferrerError } = useReadContract({
    ...bnbCalls.referrerInfo,
    enabled: !!userAddress
  });

  const { data: bnbWithdrawalHistory, isLoading: bnbWithdrawalLoading, error: bnbWithdrawalError } = useReadContract({
    ...bnbCalls.withdrawalHistory,
    enabled: !!userAddress
  });

  // Process data when contract calls complete
  useEffect(() => {
    if (!userAddress) {
      setReferralHistory([]);
      setWithdrawalHistory([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const isLoadingAny = ethReferrerLoading || ethWithdrawalLoading || bnbReferrerLoading || bnbWithdrawalLoading;
    const hasError = ethReferrerError || ethWithdrawalError || bnbReferrerError || bnbWithdrawalError;

    setIsLoading(isLoadingAny);

    if (hasError) {
      console.error('Contract read errors:', {
        ethReferrerError,
        ethWithdrawalError,
        bnbReferrerError,
        bnbWithdrawalError
      });
      setError('Failed to load referral data from contracts');
      return;
    }

    if (!isLoadingAny) {
      try {
        // Process withdrawal history from both chains
        const processedWithdrawals = [];

        // Process ETH withdrawals
        if (ethWithdrawalHistory && Array.isArray(ethWithdrawalHistory)) {
          ethWithdrawalHistory.forEach((withdrawal, index) => {
            if (withdrawal && withdrawal.amount && withdrawal.timestamp) {
              processedWithdrawals.push({
                id: `eth-withdrawal-${index}`,
                chain: 'ETH',
                chainId: 11155111,
                amount: formatNativeCurrency(withdrawal.amount.toString(), 18, 6),
                timestamp: Number(withdrawal.timestamp) * 1000, // Convert to milliseconds
                blockNumber: withdrawal.blockNumber ? Number(withdrawal.blockNumber) : null,
                // Note: We don't have transaction hash from contract storage
                // This is a limitation of using contract storage vs events
                transactionHash: null
              });
            }
          });
        }

        // Process BNB withdrawals
        if (bnbWithdrawalHistory && Array.isArray(bnbWithdrawalHistory)) {
          bnbWithdrawalHistory.forEach((withdrawal, index) => {
            if (withdrawal && withdrawal.amount && withdrawal.timestamp) {
              processedWithdrawals.push({
                id: `bnb-withdrawal-${index}`,
                chain: 'BNB',
                chainId: 97,
                amount: formatNativeCurrency(withdrawal.amount.toString(), 18, 6),
                timestamp: Number(withdrawal.timestamp) * 1000, // Convert to milliseconds
                blockNumber: withdrawal.blockNumber ? Number(withdrawal.blockNumber) : null,
                // Note: We don't have transaction hash from contract storage
                transactionHash: null
              });
            }
          });
        }

        // Sort withdrawals by timestamp (newest first)
        processedWithdrawals.sort((a, b) => b.timestamp - a.timestamp);

        // Limit to latest 20 withdrawals for performance
        const limitedWithdrawals = processedWithdrawals.slice(0, 20);

        // For referral history, we can only show summary data from getReferrerInfo
        // since the contract doesn't store individual referral purchase details
        const processedReferrals = [];

        // Create summary entries based on referrer info
        if (ethReferrerInfo && ethReferrerInfo[0] > 0) { // totalReferrals > 0
          processedReferrals.push({
            id: 'eth-referral-summary',
            chain: 'ETH',
            chainId: 11155111,
            buyer: 'Multiple Buyers',
            usdAmount: 'N/A',
            nativeCurrencyPaid: 'N/A',
            cashbackAmount: formatNativeCurrency(ethReferrerInfo[4].toString(), 18, 6), // totalEarned
            bonusPercent: Number(ethReferrerInfo[2]), // bonusPercentage
            newReferralCount: Number(ethReferrerInfo[0]), // totalReferrals
            timestamp: Date.now(), // Current time as placeholder
            transactionHash: null,
            blockNumber: null,
            isSummary: true
          });
        }

        if (bnbReferrerInfo && bnbReferrerInfo[0] > 0) { // totalReferrals > 0
          processedReferrals.push({
            id: 'bnb-referral-summary',
            chain: 'BNB',
            chainId: 97,
            buyer: 'Multiple Buyers',
            usdAmount: 'N/A',
            nativeCurrencyPaid: 'N/A',
            cashbackAmount: formatNativeCurrency(bnbReferrerInfo[4].toString(), 18, 6), // totalEarned
            bonusPercent: Number(bnbReferrerInfo[2]), // bonusPercentage
            newReferralCount: Number(bnbReferrerInfo[0]), // totalReferrals
            timestamp: Date.now(), // Current time as placeholder
            transactionHash: null,
            blockNumber: null,
            isSummary: true
          });
        }

        // Limit referral history to latest 20 entries for performance
        const limitedReferrals = processedReferrals.slice(0, 20);

        setWithdrawalHistory(limitedWithdrawals);
        setReferralHistory(limitedReferrals);
        setError(null);
      } catch (err) {
        console.error('Error processing referral data:', err);
        setError('Failed to process referral data');
      }
    }
  }, [
    userAddress,
    ethReferrerInfo,
    ethWithdrawalHistory,
    bnbReferrerInfo,
    bnbWithdrawalHistory,
    ethReferrerLoading,
    ethWithdrawalLoading,
    bnbReferrerLoading,
    bnbWithdrawalLoading,
    ethReferrerError,
    ethWithdrawalError,
    bnbReferrerError,
    bnbWithdrawalError
  ]);

  const refetch = () => {
    // The useReadContract hooks will automatically refetch when dependencies change
    // We can trigger a manual refetch by updating a state that forces re-render
    setError(null);
  };

  return {
    referralHistory,
    withdrawalHistory,
    isLoading,
    error,
    refetch
  };
};