import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAggregatedPresale } from "./useAggregatedPresale";
import { usePresaleData } from "./PresaleContext";
import stageSupplyService from "./StageSupplyService";

// Create context for aggregated presale data
export const AggregatedPresaleContext = createContext();

// Hook to use aggregated presale data
export const useAggregatedPresaleData = () => useContext(AggregatedPresaleContext);

const AggregatedPresaleContextProvider = ({ children }) => {
  // Get aggregated data from both networks
  const { 
    data: aggregatedData, 
    loading: aggregatedLoading, 
    error: aggregatedError, 
    refresh: refreshAggregated 
  } = useAggregatedPresale(30000); // Refresh every 30 seconds

  // Get current wallet-connected data for transactions
  const walletPresaleData = usePresaleData();

  // State for combined data
  const [combinedData, setCombinedData] = useState({
    // Aggregated data from both networks
    totalSupply: 0,
    totalSold: 0,
    totalPercent: 0,
    currentStage: 1,
    currentBonus: "20",
    currentPrice: "0.001",
    stageEnd: Math.floor(Date.now() / 1000) + 86400, // Default to 24 hours from now
    nextStage: 2,
    nextPrice: "0.002",
    maxStage: 9, // Updated to 9 stages
    
    // Stage-based supply data
    currentStageSupply: 0,
    currentStageProgress: 0,
    soldInCurrentStage: 0,
    remainingInCurrentStage: 0,
    isCurrentStageComplete: false,
    isAllStagesComplete: false,
    
    // Network-specific data
    networks: {
      ETH: { totalSupply: 0, totalSold: 0 },
      BNB: { totalSupply: 0, totalSold: 0 }
    },
    
    // Loading and error states
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Update combined data when aggregated data changes
  useEffect(() => {
    if (aggregatedData) {
      // Get stage-based supply information using the total sold from contracts
      const stageProgressData = stageSupplyService.getStageProgressForUI(aggregatedData.totalSold);
      
      setCombinedData(prev => ({
        ...prev,
        // Use manual stage-based supply instead of contract supply
        totalSupply: stageProgressData.totalSupply,
        totalSold: aggregatedData.totalSold, // Keep actual sold from contracts
        totalPercent: Math.round(stageProgressData.currentStageProgress), // Progress within current stage (0-100)
        currentStage: stageProgressData.currentStage,
        currentBonus: stageProgressData.currentBonus.toString(),
        currentPrice: stageProgressData.currentPrice.toString(),
        stageEnd: aggregatedData.currentStage.endTime, // Keep contract stage timing
        nextStage: stageProgressData.nextStage || stageProgressData.currentStage,
        nextPrice: stageProgressData.nextPrice ? stageProgressData.nextPrice.toString() : stageProgressData.currentPrice.toString(),
        maxStage: 9, // Fixed to 9 stages
        
        // Stage-based supply data
        currentStageSupply: stageProgressData.currentStageSupply,
        currentStageProgress: stageProgressData.currentStageProgress,
        soldInCurrentStage: stageProgressData.soldInCurrentStage,
        remainingInCurrentStage: stageProgressData.remainingInCurrentStage,
        isCurrentStageComplete: stageProgressData.isCurrentStageComplete,
        isAllStagesComplete: stageProgressData.isAllStagesComplete,
        
        networks: aggregatedData.networks,
        isLoading: false,
        error: null,
        lastUpdated: new Date(aggregatedData.lastUpdated)
      }));
    }
  }, [aggregatedData]);

  // Handle loading and error states
  useEffect(() => {
    setCombinedData(prev => ({
      ...prev,
      isLoading: aggregatedLoading,
      error: aggregatedError
    }));
  }, [aggregatedLoading, aggregatedError]);

  // Format number utility (using stage supply service)
  const formatNumber = (num) => {
    return stageSupplyService.formatSupply(num);
  };

  // Get time remaining for current stage
  const getTimeRemaining = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = combinedData.stageEnd - currentTime;
    return Math.max(timeRemaining, 0);
  };

  // Check if current stage has ended
  const isStageEnded = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > combinedData.stageEnd;
  };

  // Get stage progress (0-100) - now returns current stage progress
  const getStageProgress = () => {
    return Math.min(combinedData.currentStageProgress, 100);
  };

  // Get overall progress across all stages (0-100)
  const getOverallProgress = () => {
    if (combinedData.totalSupply === 0) return 0;
    return Math.min((combinedData.totalSold / combinedData.totalSupply) * 100, 100);
  };

  // Context value
  const contextValue = {
    // Aggregated data (now using stage-based supply)
    totalSupply: combinedData.totalSupply, // Manual stage-based total supply
    totalSold: combinedData.totalSold, // Actual sold from contracts
    totalPercent: combinedData.totalPercent, // Current stage progress
    currentStage: combinedData.currentStage,
    currentBonus: combinedData.currentBonus,
    currentPrice: combinedData.currentPrice,
    stageEnd: combinedData.stageEnd,
    nextStage: combinedData.nextStage,
    nextPrice: combinedData.nextPrice,
    maxStage: combinedData.maxStage,
    
    // Stage-based supply data
    currentStageSupply: combinedData.currentStageSupply,
    currentStageProgress: combinedData.currentStageProgress,
    soldInCurrentStage: combinedData.soldInCurrentStage,
    remainingInCurrentStage: combinedData.remainingInCurrentStage,
    isCurrentStageComplete: combinedData.isCurrentStageComplete,
    isAllStagesComplete: combinedData.isAllStagesComplete,
    
    // Network breakdown
    networks: combinedData.networks,
    
    // Formatted values (abbreviated)
    formattedTotalSupply: formatNumber(combinedData.totalSupply),
    formattedTotalSold: formatNumber(combinedData.totalSold),
    formattedCurrentStageSupply: formatNumber(combinedData.currentStageSupply),
    formattedSoldInCurrentStage: formatNumber(combinedData.soldInCurrentStage),
    formattedRemainingInCurrentStage: formatNumber(combinedData.remainingInCurrentStage),
    
    // Formatted values (full with commas)
    formattedTotalSupplyFull: combinedData.totalSupply.toLocaleString(),
    formattedTotalSoldFull: combinedData.totalSold.toLocaleString(),
    formattedCurrentStageSupplyFull: combinedData.currentStageSupply.toLocaleString(),
    formattedSoldInCurrentStageFull: combinedData.soldInCurrentStage.toLocaleString(),
    formattedRemainingInCurrentStageFull: combinedData.remainingInCurrentStage.toLocaleString(),
    
    // Utility functions
    getTimeRemaining,
    isStageEnded,
    getStageProgress, // Returns current stage progress (0-100)
    getOverallProgress, // Returns overall progress across all stages (0-100)
    refreshData: refreshAggregated,
    
    // Stage utility functions
    getStageSupply: (stageNumber) => stageSupplyService.getStageSupply(stageNumber),
    getAllStages: () => stageSupplyService.getAllStages(),
    
    // State flags
    isLoading: combinedData.isLoading,
    error: combinedData.error,
    lastUpdated: combinedData.lastUpdated,
    
    // Wallet-connected data for transactions (from original context)
    walletData: walletPresaleData
  };

  return (
    <AggregatedPresaleContext.Provider value={contextValue}>
      {children}
    </AggregatedPresaleContext.Provider>
  );
};

AggregatedPresaleContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AggregatedPresaleContextProvider;