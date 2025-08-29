// src/hooks/useIndividualReferralData.js
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  presaleContractAddress as ethPresaleAddress 
} from '../contracts/configEth';
import { 
  presaleContractAddress as bnbPresaleAddress 
} from '../contracts/configBnb';
import { 
  getEthReferralCalls, 
  getBnbReferralCalls,
  formatNativeCurrency
} from '../contracts/referralConfig';

export const useIndividualReferralData = (userAddress) => {
  const [referralHistory, setReferralHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ethClient = usePublicClient({ chainId: 11155111 }); // ETH Sepolia
  const bnbClient = usePublicClient({ chainId: 97 }); // BNB Testnet

  const fetchIndividualReferralData = async () => {
    if (!userAddress) {
      setReferralHistory([]);
      setWithdrawalHistory([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const referralEvents = [];
      const withdrawalEvents = [];

      // Helper function to get safe block range
      const getSafeBlockRange = async (client, chainId) => {
        try {
          const latestBlock = await client.getBlockNumber();
          // Use larger block range to get more history
          const blockRange = chainId === 97 ? 5000n : 5000n;
          const fromBlock = latestBlock - blockRange;
          return {
            fromBlock: fromBlock > 0n ? fromBlock : 0n,
            toBlock: latestBlock
          };
        } catch (error) {
          console.warn('Failed to get block number, skipping chain:', error);
          return null;
        }
      };

      // Fetch individual ReferralPurchase events from ETH chain
      if (ethClient) {
        try {
          const ethBlockRange = await getSafeBlockRange(ethClient, 11155111);
          
          if (ethBlockRange) {
            // Get ReferralPurchase events where user is the referrer
            const ethReferralLogs = await ethClient.getLogs({
              address: ethPresaleAddress,
              event: {
                type: 'event',
                name: 'ReferralPurchase',
                inputs: [
                  { name: 'referrer', type: 'address', indexed: true },
                  { name: 'buyer', type: 'address', indexed: true },
                  { name: 'usdAmount', type: 'uint256', indexed: false },
                  { name: 'nativeCurrencyPaid', type: 'uint256', indexed: false },
                  { name: 'cashbackAmount', type: 'uint256', indexed: false },
                  { name: 'bonusPercent', type: 'uint256', indexed: false },
                  { name: 'newReferralCount', type: 'uint256', indexed: false }
                ]
              },
              args: {
                referrer: userAddress
              },
              fromBlock: ethBlockRange.fromBlock,
              toBlock: ethBlockRange.toBlock
            });

            // Get ReferralWithdrawn events for user
            const ethWithdrawalLogs = await ethClient.getLogs({
              address: ethPresaleAddress,
              event: {
                type: 'event',
                name: 'ReferralWithdrawn',
                inputs: [
                  { name: 'referrer', type: 'address', indexed: true },
                  { name: 'amount', type: 'uint256', indexed: false },
                  { name: 'timestamp', type: 'uint256', indexed: false },
                  { name: 'totalWithdrawnToDate', type: 'uint256', indexed: false }
                ]
              },
              args: {
                referrer: userAddress
              },
              fromBlock: ethBlockRange.fromBlock,
              toBlock: ethBlockRange.toBlock
            });

            // Process ETH referral events
            for (const log of ethReferralLogs) {
              try {
                const block = await ethClient.getBlock({ blockHash: log.blockHash });
                referralEvents.push({
                  id: `eth-${log.transactionHash}-${log.logIndex}`,
                  chain: 'ETH',
                  chainId: 11155111,
                  buyer: log.args.buyer,
                  usdAmount: formatUnits(log.args.usdAmount, 18),
                  nativeCurrencyPaid: formatUnits(log.args.nativeCurrencyPaid, 18),
                  cashbackAmount: formatUnits(log.args.cashbackAmount, 18),
                  bonusPercent: log.args.bonusPercent.toString(),
                  newReferralCount: log.args.newReferralCount.toString(),
                  timestamp: Number(block.timestamp) * 1000,
                  transactionHash: log.transactionHash,
                  blockNumber: log.blockNumber,
                  isSummary: false
                });
              } catch (blockError) {
                console.warn('Error fetching block for ETH referral event:', blockError);
              }
            }

            // Process ETH withdrawal events
            for (const log of ethWithdrawalLogs) {
              try {
                const block = await ethClient.getBlock({ blockHash: log.blockHash });
                withdrawalEvents.push({
                  id: `eth-${log.transactionHash}-${log.logIndex}`,
                  chain: 'ETH',
                  chainId: 11155111,
                  amount: formatUnits(log.args.amount, 18),
                  timestamp: Number(log.args.timestamp) * 1000,
                  totalWithdrawnToDate: formatUnits(log.args.totalWithdrawnToDate, 18),
                  transactionHash: log.transactionHash,
                  blockNumber: log.blockNumber
                });
              } catch (blockError) {
                console.warn('Error fetching block for ETH withdrawal event:', blockError);
              }
            }
          }
        } catch (ethError) {
          console.warn('Error fetching ETH events:', ethError);
        }
      }

      // Fetch individual ReferralPurchase events from BNB chain
      if (bnbClient) {
        try {
          const bnbBlockRange = await getSafeBlockRange(bnbClient, 97);
          
          if (bnbBlockRange) {
            // Get ReferralPurchase events where user is the referrer
            const bnbReferralLogs = await bnbClient.getLogs({
              address: bnbPresaleAddress,
              event: {
                type: 'event',
                name: 'ReferralPurchase',
                inputs: [
                  { name: 'referrer', type: 'address', indexed: true },
                  { name: 'buyer', type: 'address', indexed: true },
                  { name: 'usdAmount', type: 'uint256', indexed: false },
                  { name: 'nativeCurrencyPaid', type: 'uint256', indexed: false },
                  { name: 'cashbackAmount', type: 'uint256', indexed: false },
                  { name: 'bonusPercent', type: 'uint256', indexed: false },
                  { name: 'newReferralCount', type: 'uint256', indexed: false }
                ]
              },
              args: {
                referrer: userAddress
              },
              fromBlock: bnbBlockRange.fromBlock,
              toBlock: bnbBlockRange.toBlock
            });

            // Get ReferralWithdrawn events for user
            const bnbWithdrawalLogs = await bnbClient.getLogs({
              address: bnbPresaleAddress,
              event: {
                type: 'event',
                name: 'ReferralWithdrawn',
                inputs: [
                  { name: 'referrer', type: 'address', indexed: true },
                  { name: 'amount', type: 'uint256', indexed: false },
                  { name: 'timestamp', type: 'uint256', indexed: false },
                  { name: 'totalWithdrawnToDate', type: 'uint256', indexed: false }
                ]
              },
              args: {
                referrer: userAddress
              },
              fromBlock: bnbBlockRange.fromBlock,
              toBlock: bnbBlockRange.toBlock
            });

            // Process BNB referral events
            for (const log of bnbReferralLogs) {
              try {
                const block = await bnbClient.getBlock({ blockHash: log.blockHash });
                referralEvents.push({
                  id: `bnb-${log.transactionHash}-${log.logIndex}`,
                  chain: 'BNB',
                  chainId: 97,
                  buyer: log.args.buyer,
                  usdAmount: formatUnits(log.args.usdAmount, 18),
                  nativeCurrencyPaid: formatUnits(log.args.nativeCurrencyPaid, 18),
                  cashbackAmount: formatUnits(log.args.cashbackAmount, 18),
                  bonusPercent: log.args.bonusPercent.toString(),
                  newReferralCount: log.args.newReferralCount.toString(),
                  timestamp: Number(block.timestamp) * 1000,
                  transactionHash: log.transactionHash,
                  blockNumber: log.blockNumber,
                  isSummary: false
                });
              } catch (blockError) {
                console.warn('Error fetching block for BNB referral event:', blockError);
              }
            }

            // Process BNB withdrawal events
            for (const log of bnbWithdrawalLogs) {
              try {
                const block = await bnbClient.getBlock({ blockHash: log.blockHash });
                withdrawalEvents.push({
                  id: `bnb-${log.transactionHash}-${log.logIndex}`,
                  chain: 'BNB',
                  chainId: 97,
                  amount: formatUnits(log.args.amount, 18),
                  timestamp: Number(log.args.timestamp) * 1000,
                  totalWithdrawnToDate: formatUnits(log.args.totalWithdrawnToDate, 18),
                  transactionHash: log.transactionHash,
                  blockNumber: log.blockNumber
                });
              } catch (blockError) {
                console.warn('Error fetching block for BNB withdrawal event:', blockError);
              }
            }
          }
        } catch (bnbError) {
          console.warn('Error fetching BNB events:', bnbError);
        }
      }

      // Sort events by timestamp (newest first)
      referralEvents.sort((a, b) => b.timestamp - a.timestamp);
      withdrawalEvents.sort((a, b) => b.timestamp - a.timestamp);

      // Limit to latest 50 entries for performance
      const limitedReferrals = referralEvents.slice(0, 50);
      const limitedWithdrawals = withdrawalEvents.slice(0, 50);

      setReferralHistory(limitedReferrals);
      setWithdrawalHistory(limitedWithdrawals);
      setError(null);
    } catch (err) {
      console.error('Error fetching individual referral data:', err);
      setError('Failed to load referral history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndividualReferralData();
  }, [userAddress, ethClient, bnbClient]);

  const refetch = () => {
    fetchIndividualReferralData();
  };

  return {
    referralHistory,
    withdrawalHistory,
    isLoading,
    error,
    refetch
  };
};