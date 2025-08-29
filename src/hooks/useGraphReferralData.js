import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  queryBothNetworks, 
  combineUserData, 
  GET_USER_REFERRALS, 
  GET_USER_WITHDRAWALS,
  formatAmount,
  formatTimestamp 
} from '../services/graphql';

export const useGraphReferralData = () => {
  const { address, isConnected } = useAccount();
  const [referralData, setReferralData] = useState([]);
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarned: '0',
    totalWithdrawn: '0'
  });

  const fetchReferralData = async () => {
    if (!address) {
      setReferralData([]);
      setWithdrawalData([]);
      setStats({ totalReferrals: 0, totalEarned: '0', totalWithdrawn: '0' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch referral data from both networks
      const { ethData: ethReferrals, bscData: bscReferrals } = await queryBothNetworks(
        GET_USER_REFERRALS,
        { userAddress: address.toLowerCase() }
      );

      // Fetch withdrawal data from both networks
      const { ethData: ethWithdrawals, bscData: bscWithdrawals } = await queryBothNetworks(
        GET_USER_WITHDRAWALS,
        { userAddress: address.toLowerCase() }
      );



      // Combine user data from both networks
      const combinedUser = combineUserData(
        ethReferrals?.user,
        bscReferrals?.user
      );

      const combinedWithdrawals = combineUserData(
        ethWithdrawals?.user,
        bscWithdrawals?.user
      );



      if (combinedUser) {
        // Format referral data for display
        const formattedReferrals = combinedUser.referralEvents.map(event => ({
          id: event.id,
          buyer: event.buyer,
          usdAmount: formatAmount(event.usdAmount, 18), // Using 18 decimals to match contract storage
          nativeCurrencyPaid: formatAmount(event.nativeCurrencyPaid),
          cashbackAmount: formatAmount(event.cashbackAmount),
          bonusPercent: event.bonusPercent,
          timestamp: formatTimestamp(event.timestamp),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          chain: event.chain,
          rawTimestamp: event.timestamp
        }));


        setReferralData(formattedReferrals);

        // Update stats
        setStats({
          totalReferrals: combinedUser.totalReferrals,
          totalEarned: formatAmount(combinedUser.totalEarned.toString()),
          totalWithdrawn: formatAmount(combinedUser.totalWithdrawn.toString())
        });
      } else {
        setReferralData([]);
        setStats({ totalReferrals: 0, totalEarned: '0', totalWithdrawn: '0' });
      }

      if (combinedWithdrawals) {
        // Format withdrawal data for display
        const formattedWithdrawals = combinedWithdrawals.withdrawalEvents.map(event => ({
          id: event.id,
          amount: formatAmount(event.amount),
          timestamp: formatTimestamp(event.timestamp),
          totalWithdrawnToDate: formatAmount(event.totalWithdrawnToDate),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          chain: event.chain,
          rawTimestamp: event.timestamp
        }));


        setWithdrawalData(formattedWithdrawals);
      } else {
        setWithdrawalData([]);
      }

    } catch (err) {
      console.error('Error fetching referral data from The Graph:', err);
      setError(err.message);
      
      // Fallback to empty data on error
      setReferralData([]);
      setWithdrawalData([]);
      setStats({ totalReferrals: 0, totalEarned: '0', totalWithdrawn: '0' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [address]);

  // Refresh function for manual updates
  const refresh = () => {
    fetchReferralData();
  };

  return {
    referralData,
    withdrawalData,
    loading,
    error,
    stats,
    refresh
  };
};