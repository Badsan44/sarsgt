/**
 * Stage Supply Service
 * Manages manual stage-based supply configuration and progress calculation
 */

class StageSupplyService {
  constructor() {
    // Manual stage configuration - 9 stages
    this.stageConfig = [
      { stage: 1, supply: 10000000, bonus: 50, price: 0.001 },
      { stage: 2, supply: 15000000, bonus: 35, price: 0.002 },
      { stage: 3, supply: 20000000, bonus: 30, price: 0.003 },
      { stage: 4, supply: 25000000, bonus: 22, price: 0.004 },
      { stage: 5, supply: 30000000, bonus: 15, price: 0.005 },
      { stage: 6, supply: 35000000, bonus: 12, price: 0.006 },
      { stage: 7, supply: 40000000, bonus: 10, price: 0.007 },
      { stage: 8, supply: 45000000, bonus: 10, price: 0.008 },
      { stage: 9, supply: 50000000, bonus: 8, price: 0.009 }
    ];

    // Calculate cumulative supplies for stage determination
    this.cumulativeSupplies = this.calculateCumulativeSupplies();
  }

  /**
   * Calculate cumulative supplies for each stage
   * @returns {Array} Array of cumulative supply values
   */
  calculateCumulativeSupplies() {
    let cumulative = 0;
    return this.stageConfig.map(stage => {
      cumulative += stage.supply;
      return {
        stage: stage.stage,
        cumulativeSupply: cumulative,
        stageSupply: stage.supply,
        bonus: stage.bonus,
        price: stage.price
      };
    });
  }

  /**
   * Get total supply across all stages
   * @returns {number} Total supply
   */
  getTotalSupply() {
    return this.stageConfig.reduce((total, stage) => total + stage.supply, 0);
  }

  /**
   * Get supply for a specific stage
   * @param {number} stageNumber - Stage number (1-9)
   * @returns {number} Supply for the stage
   */
  getStageSupply(stageNumber) {
    const stage = this.stageConfig.find(s => s.stage === stageNumber);
    return stage ? stage.supply : 0;
  }

  /**
   * Calculate display progress for progress bar (0-100% without decimals)
   * @param {number} soldInStage - Tokens sold in current stage
   * @param {number} stageSupply - Total supply for current stage
   * @param {number} stageNumber - Current stage number
   * @returns {number} Progress percentage (0-100, no decimals)
   */
  calculateDisplayProgress(soldInStage, stageSupply, stageNumber) {
    // Calculate actual percentage
    let actualProgress = (soldInStage / stageSupply) * 100;
    
    // Floor to remove decimals (so 0.67% becomes 0%, 1.2% becomes 1%)
    return Math.min(100, Math.max(0, Math.floor(actualProgress)));
  }

  /**
   * Get current stage based on total sold tokens
   * @param {number} totalSold - Total tokens sold across all networks
   * @returns {Object} Current stage information
   */
  getCurrentStageInfo(totalSold) {
    // Find which stage we're currently in based on total sold
    for (let i = 0; i < this.cumulativeSupplies.length; i++) {
      const stageInfo = this.cumulativeSupplies[i];
      
      if (totalSold <= stageInfo.cumulativeSupply) {
        // Calculate how much was sold in previous stages
        const previousCumulative = i > 0 ? this.cumulativeSupplies[i - 1].cumulativeSupply : 0;
        const soldInCurrentStage = totalSold - previousCumulative;
        
        return {
          currentStage: stageInfo.stage,
          currentStageSupply: stageInfo.stageSupply,
          soldInCurrentStage: Math.max(0, soldInCurrentStage),
          remainingInCurrentStage: Math.max(0, stageInfo.stageSupply - soldInCurrentStage),
          currentStageProgress: this.calculateDisplayProgress(soldInCurrentStage, stageInfo.stageSupply, stageInfo.stage),
          bonus: stageInfo.bonus,
          price: stageInfo.price,
          isStageComplete: soldInCurrentStage >= stageInfo.stageSupply
        };
      }
    }

    // If we've sold more than all stages, return the last stage as complete
    const lastStage = this.cumulativeSupplies[this.cumulativeSupplies.length - 1];
    return {
      currentStage: lastStage.stage,
      currentStageSupply: lastStage.stageSupply,
      soldInCurrentStage: lastStage.stageSupply,
      remainingInCurrentStage: 0,
      currentStageProgress: 100,
      bonus: lastStage.bonus,
      price: lastStage.price,
      isStageComplete: true
    };
  }

  /**
   * Get next stage information
   * @param {number} currentStageNumber - Current stage number
   * @returns {Object|null} Next stage information or null if no next stage
   */
  getNextStageInfo(currentStageNumber) {
    const nextStage = this.stageConfig.find(s => s.stage === currentStageNumber + 1);
    
    if (!nextStage) {
      return null;
    }

    return {
      stage: nextStage.stage,
      supply: nextStage.supply,
      bonus: nextStage.bonus,
      price: nextStage.price
    };
  }

  /**
   * Get overall progress across all stages
   * @param {number} totalSold - Total tokens sold
   * @returns {Object} Overall progress information
   */
  getOverallProgress(totalSold) {
    const totalSupply = this.getTotalSupply();
    const overallProgress = Math.min(100, (totalSold / totalSupply) * 100);
    
    return {
      totalSupply,
      totalSold,
      overallProgress,
      remainingTokens: Math.max(0, totalSupply - totalSold)
    };
  }

  /**
   * Get formatted supply numbers (abbreviated)
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatSupply(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  }

  /**
   * Get formatted supply numbers (full with commas)
   * @param {number} num - Number to format
   * @returns {string} Formatted number with commas
   */
  formatSupplyFull(num) {
    return Math.floor(num).toLocaleString();
  }

  /**
   * Get all stage configuration
   * @returns {Array} Complete stage configuration
   */
  getAllStages() {
    return this.stageConfig.map((stage, index) => ({
      ...stage,
      cumulativeSupply: this.cumulativeSupplies[index].cumulativeSupply
    }));
  }

  /**
   * Update stage configuration (for admin purposes)
   * @param {number} stageNumber - Stage to update
   * @param {Object} updates - Updates to apply
   */
  updateStageConfig(stageNumber, updates) {
    const stageIndex = this.stageConfig.findIndex(s => s.stage === stageNumber);
    
    if (stageIndex !== -1) {
      this.stageConfig[stageIndex] = {
        ...this.stageConfig[stageIndex],
        ...updates
      };
      
      // Recalculate cumulative supplies
      this.cumulativeSupplies = this.calculateCumulativeSupplies();
    }
  }

  /**
   * Get stage progress for display in UI
   * @param {number} totalSold - Total tokens sold
   * @returns {Object} Stage progress data for UI
   */
  getStageProgressForUI(totalSold) {
    const currentStageInfo = this.getCurrentStageInfo(totalSold);
    const nextStageInfo = this.getNextStageInfo(currentStageInfo.currentStage);
    const overallProgress = this.getOverallProgress(totalSold);

    return {
      // Current stage data
      currentStage: currentStageInfo.currentStage,
      currentStageSupply: currentStageInfo.currentStageSupply,
      currentStageProgress: currentStageInfo.currentStageProgress,
      soldInCurrentStage: currentStageInfo.soldInCurrentStage,
      remainingInCurrentStage: currentStageInfo.remainingInCurrentStage,
      currentBonus: currentStageInfo.bonus,
      currentPrice: currentStageInfo.price,
      
      // Next stage data
      nextStage: nextStageInfo ? nextStageInfo.stage : null,
      nextPrice: nextStageInfo ? nextStageInfo.price : null,
      nextBonus: nextStageInfo ? nextStageInfo.bonus : null,
      
      // Overall progress
      totalSupply: overallProgress.totalSupply,
      totalSold: overallProgress.totalSold,
      overallProgress: overallProgress.overallProgress,
      
      // Formatted values for display (abbreviated)
      formattedCurrentStageSupply: this.formatSupply(currentStageInfo.currentStageSupply),
      formattedSoldInCurrentStage: this.formatSupply(currentStageInfo.soldInCurrentStage),
      formattedTotalSupply: this.formatSupply(overallProgress.totalSupply),
      formattedTotalSold: this.formatSupply(overallProgress.totalSold),
      
      // Formatted values for display (full with commas)
      formattedCurrentStageSupplyFull: this.formatSupplyFull(currentStageInfo.currentStageSupply),
      formattedSoldInCurrentStageFull: this.formatSupplyFull(currentStageInfo.soldInCurrentStage),
      formattedTotalSupplyFull: this.formatSupplyFull(overallProgress.totalSupply),
      formattedTotalSoldFull: this.formatSupplyFull(overallProgress.totalSold),
      
      // Stage completion status
      isCurrentStageComplete: currentStageInfo.isStageComplete,
      isAllStagesComplete: currentStageInfo.currentStage === 9 && currentStageInfo.isStageComplete
    };
  }
}

// Create singleton instance
const stageSupplyService = new StageSupplyService();

export default stageSupplyService;

// Export utility functions
export const getCurrentStageInfo = (totalSold) => stageSupplyService.getCurrentStageInfo(totalSold);
export const getStageProgressForUI = (totalSold) => stageSupplyService.getStageProgressForUI(totalSold);
export const getTotalSupply = () => stageSupplyService.getTotalSupply();
export const getStageSupply = (stageNumber) => stageSupplyService.getStageSupply(stageNumber);
export const getAllStages = () => stageSupplyService.getAllStages();
export const formatSupply = (num) => stageSupplyService.formatSupply(num);
export const formatSupplyFull = (num) => stageSupplyService.formatSupplyFull(num);