// src/hooks/useReferralEvents.js
// 
// ⚠️ DEPRECATED: This hook is no longer used and has been replaced by useReferralData.js
// 
// This hook was causing timeout errors due to RPC limitations when scanning blockchain events.
// The new useReferralData.js hook uses direct contract calls instead of event scanning.
// 
// This file can be safely removed in future cleanup.
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  presaleContractConfig as ethPresaleConfig,
  presaleContractAddress as ethPresaleAddress 
} from '../contracts/configEth';
import { 
  presaleContractConfig as bnbPresaleConfig,
  presaleContractAddress as bnbPresaleAddress 
} from '../contracts/configBnb';

export const useReferralEvents = (userAddress) => {
  const [referralHistory, setReferralHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ethClient = usePublicClient({ chainId: 11155111 }); // ETH Sepolia
  const bnbClient = usePublicClient({ chainId: 97 }); // BNB Testnet

  const fetchEvents = async () => {
    if (!userAddress || (!ethClient && !bnbClient)) return;

    setIsLoading(true);
    setError(null);

    try {
      const referralEvents = [];
      const withdrawalEvents = [];

      // Helper function to get safe block range (different limits for different chains)
      const getSafeBlockRange = async (client, chainId) => {
        try {
          const latestBlock = await client.getBlockNumber();
          // BNB testnet has very strict limits, use only 50 blocks
          // ETH Sepolia can handle more, use 500 blocks
          const blockRange = chainId === 97 ? 50n : 500n;
          const fromBlock = latestBlock - blockRange;
          return {
            fromBlock: fromBlock > 0n ? fromBlock : 0n,
            toBlock: latestBlock
          };
        } catch (error) {
          // If we can't get block number, skip this chain to avoid timeouts
          console.warn('Failed to get block number, skipping chain:', error);
          return null;
        }
      };

      // Fetch from ETH chain
      if (ethClient) {
        try {
          const ethBlockRange = await getSafeBlockRange(ethClient, 11155111);
          
          if (!ethBlockRange) {
            console.warn('Skipping ETH events due to block range error');
          } else {
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
              blockNumber: log.blockNumber
            });
          }

          // Process ETH withdrawal events
          for (const log of ethWithdrawalLogs) {
            const block = await ethClient.getBlock({ blockHash: log.blockHash });
            withdrawalEvents.push({
              id: `eth-${log.transactionHash}-${log.logIndex}`,
              chain: 'ETH',
              chainId: 11155111,
              amount: formatUnits(log.args.amount, 18),
              timestamp: Number(log.args.timestamp) * 1000, // Use timestamp from event
              totalWithdrawnToDate: formatUnits(log.args.totalWithdrawnToDate, 18),
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber
            });
          }
          } // End of else block for ethBlockRange
        } catch (ethError) {
          console.warn('Error fetching ETH events:', ethError);
        }
      }

      // Fetch from BNB chain
      if (bnbClient) {
        try {
          const bnbBlockRange = await getSafeBlockRange(bnbClient, 97);
          
          if (!bnbBlockRange) {
            console.warn('Skipping BNB events due to block range error');
          } else {
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
              blockNumber: log.blockNumber
            });
          }

          // Process BNB withdrawal events
          for (const log of bnbWithdrawalLogs) {
            const block = await bnbClient.getBlock({ blockHash: log.blockHash });
            withdrawalEvents.push({
              id: `bnb-${log.transactionHash}-${log.logIndex}`,
              chain: 'BNB',
              chainId: 97,
              amount: formatUnits(log.args.amount, 18),
              timestamp: Number(log.args.timestamp) * 1000, // Use timestamp from event
              totalWithdrawnToDate: formatUnits(log.args.totalWithdrawnToDate, 18),
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber
            });
          }
          } // End of else block for bnbBlockRange
        } catch (bnbError) {
          console.warn('Error fetching BNB events:', bnbError);
        }
      }

      // Sort events by timestamp (newest first)
      referralEvents.sort((a, b) => b.timestamp - a.timestamp);
      withdrawalEvents.sort((a, b) => b.timestamp - a.timestamp);

      setReferralHistory(referralEvents);
      setWithdrawalHistory(withdrawalEvents);
    } catch (err) {
      console.error('Error fetching referral events:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress) {
      fetchEvents();
    }
  }, [userAddress, ethClient, bnbClient]);

  return {
    referralHistory,
    withdrawalHistory,
    isLoading,
    error,
    refetch: fetchEvents
  };
};