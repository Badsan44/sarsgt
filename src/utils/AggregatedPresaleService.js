import { createPublicClient, http, formatEther, formatUnits } from 'viem';
import { mainnet, bsc, sepolia, bscTestnet } from 'viem/chains';
import * as ConfigModuleEth from "../contracts/configEth";
import * as ConfigModuleBnb from "../contracts/configBnb";
import PresaleContractAbi from "../contracts/PresaleContractAbi.json";
import TokenContractAbi from "../contracts/TokenContractAbi.json";

// Chain configurations
const CHAINS = {
  ETH: {
    chain: sepolia, // Sepolia testnet
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com', // Public RPC for Sepolia
    presaleContract: '0xa35f69cd2f2e10a4801bd4b6c7a555f9b24de48a',
    tokenContract: '0x7695d1d53273d9d8684cd9de0beb4998bf1d9727',
    configModule: ConfigModuleEth
  },
  BNB: {
    chain: bscTestnet, // BSC Testnet
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    presaleContract: '0xb292906c7590104a0015703e5fc8ba64385756cb',
    tokenContract: '0x5e846c0cefc6ebd2bde68925aa510fb436c63ca1',
    configModule: ConfigModuleBnb
  }
};

class AggregatedPresaleService {
  constructor() {
    this.clients = {};
    this.initializeClients();
    this.cache = {
      data: null,
      timestamp: 0,
      ttl: 30000 // 30 seconds cache
    };
  }

  initializeClients() {
    // Initialize ETH client
    this.clients.ETH = createPublicClient({
      chain: CHAINS.ETH.chain,
      transport: http(CHAINS.ETH.rpcUrl)
    });

    // Initialize BNB client
    this.clients.BNB = createPublicClient({
      chain: CHAINS.BNB.chain,
      transport: http(CHAINS.BNB.rpcUrl)
    });
  }

  async getContractData(network) {
    const client = this.clients[network];
    const config = CHAINS[network];

    try {
      // Get all required data in parallel
      const [
        presaleTokenAmount,
        totalSold,
        maxStage,
        currentStageId,
        tokenDecimals
      ] = await Promise.all([
        client.readContract({
          address: config.presaleContract,
          abi: PresaleContractAbi,
          functionName: 'presaleTokenAmount'
        }),
        client.readContract({
          address: config.presaleContract,
          abi: PresaleContractAbi,
          functionName: 'totalSold'
        }),
        client.readContract({
          address: config.presaleContract,
          abi: PresaleContractAbi,
          functionName: 'maxStage'
        }),
        client.readContract({
          address: config.presaleContract,
          abi: PresaleContractAbi,
          functionName: 'getCurrentStageIdActive'
        }),
        client.readContract({
          address: config.tokenContract,
          abi: TokenContractAbi,
          functionName: 'decimals'
        })
      ]);

      // Get current stage info
      const currentStageInfo = await client.readContract({
        address: config.presaleContract,
        abi: PresaleContractAbi,
        functionName: 'stages',
        args: [currentStageId]
      });

      // Calculate next stage
      const nextStageId = Number(currentStageId) + 1;
      let nextStageInfo = null;
      
      if (nextStageId <= Number(maxStage)) {
        nextStageInfo = await client.readContract({
          address: config.presaleContract,
          abi: PresaleContractAbi,
          functionName: 'stages',
          args: [BigInt(nextStageId)]
        });
      }

      return {
        network,
        presaleTokenAmount: Number(formatEther(presaleTokenAmount)),
        totalSold: Number(formatEther(totalSold)),
        maxStage: Number(maxStage),
        currentStageId: Number(currentStageId),
        currentStage: {
          id: Number(currentStageId),
          bonus: Number(currentStageInfo[1]), // bonus percentage
          price: Number(formatEther(currentStageInfo[2])), // price in ETH/BNB
          startTime: Number(currentStageInfo[3]),
          endTime: Number(currentStageInfo[4])
        },
        nextStage: nextStageInfo ? {
          id: nextStageId,
          bonus: Number(nextStageInfo[1]),
          price: Number(formatEther(nextStageInfo[2])),
          startTime: Number(nextStageInfo[3]),
          endTime: Number(nextStageInfo[4])
        } : null,
        tokenDecimals: Number(tokenDecimals)
      };
    } catch (error) {
      console.error(`Error fetching data from ${network}:`, error);
      return null;
    }
  }

  async getAggregatedData() {
    // Check cache first
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.cache.ttl) {
      return this.cache.data;
    }

    try {
      // Fetch data from both networks in parallel
      const [ethData, bnbData] = await Promise.all([
        this.getContractData('ETH'),
        this.getContractData('BNB')
      ]);

      if (!ethData || !bnbData) {
        throw new Error('Failed to fetch data from one or both networks');
      }

      // Determine current stage based on time (stages should be synchronized)
      const currentTime = Math.floor(Date.now() / 1000);
      let currentStage = ethData.currentStage;
      let nextStage = ethData.nextStage;

      // If current stage has ended, check if we should move to next stage
      if (currentTime > currentStage.endTime && nextStage) {
        currentStage = nextStage;
        // You might want to fetch the stage after next here
      }

      // Aggregate the data
      const aggregatedData = {
        // Total supply from both contracts
        totalSupply: ethData.presaleTokenAmount + bnbData.presaleTokenAmount,
        
        // Total tokens sold from both contracts
        totalSold: ethData.totalSold + bnbData.totalSold,
        
        // Current stage info (should be the same on both networks)
        currentStage: {
          id: currentStage.id,
          bonus: currentStage.bonus,
          price: currentStage.price,
          startTime: currentStage.startTime,
          endTime: currentStage.endTime
        },
        
        // Next stage info
        nextStage: nextStage,
        
        // Progress percentage
        progressPercentage: Math.min(
          ((ethData.totalSold + bnbData.totalSold) / (ethData.presaleTokenAmount + bnbData.presaleTokenAmount)) * 100,
          100
        ),
        
        // Individual network data for debugging/display
        networks: {
          ETH: {
            totalSupply: ethData.presaleTokenAmount,
            totalSold: ethData.totalSold,
            currentStageId: ethData.currentStageId
          },
          BNB: {
            totalSupply: bnbData.presaleTokenAmount,
            totalSold: bnbData.totalSold,
            currentStageId: bnbData.currentStageId
          }
        },
        
        // Metadata
        maxStage: ethData.maxStage,
        lastUpdated: now
      };

      // Cache the result
      this.cache.data = aggregatedData;
      this.cache.timestamp = now;

      return aggregatedData;
    } catch (error) {
      console.error('Error aggregating presale data:', error);
      return null;
    }
  }

  // Get current stage based on time
  getCurrentStageByTime() {
    const currentTime = Math.floor(Date.now() / 1000);
    
    // This should match your contract's stage timing logic
    // You'll need to implement this based on your specific stage configuration
    return this.getAggregatedData().then(data => {
      if (!data) return null;
      
      return data.currentStage;
    });
  }

  // Get time remaining for current stage
  getTimeRemaining() {
    return this.getAggregatedData().then(data => {
      if (!data) return 0;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = data.currentStage.endTime - currentTime;
      
      return Math.max(timeRemaining, 0);
    });
  }

  // Force refresh cache
  async refreshData() {
    this.cache.timestamp = 0;
    return this.getAggregatedData();
  }
}

// Create singleton instance
const aggregatedPresaleService = new AggregatedPresaleService();

export default aggregatedPresaleService;

// Export utility functions
export const getAggregatedPresaleData = () => aggregatedPresaleService.getAggregatedData();
export const refreshPresaleData = () => aggregatedPresaleService.refreshData();
export const getCurrentStageByTime = () => aggregatedPresaleService.getCurrentStageByTime();
export const getTimeRemaining = () => aggregatedPresaleService.getTimeRemaining();