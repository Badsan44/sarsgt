// src/contracts/referralConfig.js
import * as ConfigModuleEth from "./configEth";
import * as ConfigModuleBnb from "./configBnb";

// Referral tier configuration matching the contract
// Contract tiers: [930, 430, 180, 80, 40, 15, 5, 0] with bonuses [70, 50, 40, 30, 25, 20, 15, 10]
export const REFERRAL_TIERS = [
  { tier: 1, bonus: 10, minBuyers: 0, label: "Bronze" },
  { tier: 2, bonus: 15, minBuyers: 5, label: "Silver" },
  { tier: 3, bonus: 20, minBuyers: 15, label: "Gold" },
  { tier: 4, bonus: 25, minBuyers: 40, label: "Platinum" },
  { tier: 5, bonus: 30, minBuyers: 80, label: "Diamond" },
  { tier: 6, bonus: 40, minBuyers: 180, label: "Master" },
  { tier: 7, bonus: 50, minBuyers: 430, label: "Grandmaster" },
  { tier: 8, bonus: 70, minBuyers: 930, label: "Legend" }
];

// Withdrawal cooldown (2 weeks in seconds)
export const WITHDRAWAL_COOLDOWN = 2 * 7 * 24 * 60 * 60; // 2 weeks

// Get referral contract calls for ETH
export const getEthReferralCalls = (address) => ({
  // Get comprehensive referrer info (new function)
  referrerInfo: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "getReferrerInfo",
    args: [address],
    watch: true,
  },
  
  // Get referral count
  referralCount: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "referralCounts",
    args: [address],
    watch: true,
  },
  
  // Get referral bonus (ETH amount)
  referralBonus: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "referralBonus",
    args: [address],
    watch: true,
  },
  
  // Get last withdrawal timestamp
  lastWithdrawal: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "lastWithdrawal",
    args: [address],
    watch: true,
  },
  
  // Get total withdrawn amount
  totalWithdrawn: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "totalWithdrawn",
    args: [address],
    watch: true,
  },
  
  // Get withdrawal history
  withdrawalHistory: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "getWithdrawalHistory",
    args: [address],
    watch: true,
  },
  
  // Get referral bonus percentage
  referralBonusPercentage: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "getReferralBonusPercentage",
    watch: true,
  },
  
  // Get minimum referral payout for ETH
  minReferralPayout: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "minReferralPayoutEth",
    watch: true,
  },
  
  // Withdraw referral bonus
  withdrawReferralBonus: {
    ...ConfigModuleEth.presaleContractConfig,
    functionName: "withdrawReferralBonus",
  }
});

// Get referral contract calls for BNB
export const getBnbReferralCalls = (address) => ({
  // Get comprehensive referrer info (new function)
  referrerInfo: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "getReferrerInfo",
    args: [address],
    watch: true,
  },
  
  // Get referral count
  referralCount: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "referralCounts",
    args: [address],
    watch: true,
  },
  
  // Get referral bonus (BNB amount)
  referralBonus: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "referralBonus",
    args: [address],
    watch: true,
  },
  
  // Get last withdrawal timestamp
  lastWithdrawal: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "lastWithdrawal",
    args: [address],
    watch: true,
  },
  
  // Get total withdrawn amount
  totalWithdrawn: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "totalWithdrawn",
    args: [address],
    watch: true,
  },
  
  // Get withdrawal history
  withdrawalHistory: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "getWithdrawalHistory",
    args: [address],
    watch: true,
  },
  
  // Get referral bonus percentage
  referralBonusPercentage: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "getReferralBonusPercentage",
    watch: true,
  },
  
  // Get minimum referral payout for BNB
  minReferralPayout: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "minReferralPayoutBnb",
    watch: true,
  },
  
  // Withdraw referral bonus
  withdrawReferralBonus: {
    ...ConfigModuleBnb.presaleContractConfig,
    functionName: "withdrawReferralBonus",
  }
});

// Helper function to get current tier based on referral count
export const getCurrentTier = (referralCount) => {
  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (referralCount >= REFERRAL_TIERS[i].minBuyers) {
      return REFERRAL_TIERS[i];
    }
  }
  return REFERRAL_TIERS[0];
};

// Helper function to get next tier
export const getNextTier = (referralCount) => {
  const currentTier = getCurrentTier(referralCount);
  const currentIndex = REFERRAL_TIERS.findIndex(tier => tier.tier === currentTier.tier);
  
  if (currentIndex < REFERRAL_TIERS.length - 1) {
    return REFERRAL_TIERS[currentIndex + 1];
  }
  return null; // Already at max tier
};

// Helper function to calculate progress to next tier
export const getTierProgress = (referralCount) => {
  const currentTier = getCurrentTier(referralCount);
  const nextTier = getNextTier(referralCount);
  
  if (!nextTier) {
    return 100; // Max tier reached
  }
  
  const progress = ((referralCount - currentTier.minBuyers) / (nextTier.minBuyers - currentTier.minBuyers)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Helper function to check if withdrawal is available
export const canWithdraw = (lastWithdrawalTimestamp, minPayout, currentBonus) => {
  const now = Math.floor(Date.now() / 1000);
  const cooldownPassed = now >= (lastWithdrawalTimestamp + WITHDRAWAL_COOLDOWN);
  const hasMinimumAmount = currentBonus >= minPayout;
  
  return cooldownPassed && hasMinimumAmount;
};

// Helper function to get time until next withdrawal
export const getTimeUntilNextWithdrawal = (lastWithdrawalTimestamp) => {
  const now = Math.floor(Date.now() / 1000);
  const nextWithdrawalTime = lastWithdrawalTimestamp + WITHDRAWAL_COOLDOWN;
  
  if (now >= nextWithdrawalTime) {
    return 0;
  }
  
  return nextWithdrawalTime - now;
};

// Helper function to format time remaining
export const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) return "Available now";
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Helper function to format ETH/BNB amounts (18 decimals)
export const formatNativeCurrency = (amount, decimals = 18, displayDecimals = 4) => {
  if (!amount) return '0';
  
  const divisor = Math.pow(10, decimals);
  const formatted = (Number(amount) / divisor).toFixed(displayDecimals);
  
  // Remove trailing zeros
  return parseFloat(formatted).toString();
};

// Helper function to get currency symbol based on chain ID
export const getCurrencySymbol = (chainId) => {
  switch (chainId) {
    case 1:
    case 11155111: // Sepolia
      return 'ETH';
    case 56:
    case 97: // BSC Testnet
      return 'BNB';
    default:
      return 'ETH';
  }
};

// Helper function to parse referrer info from contract response
export const parseReferrerInfo = (referrerInfoArray) => {
  if (!referrerInfoArray || referrerInfoArray.length !== 6) {
    return {
      totalReferrals: 0,
      pendingCashback: 0,
      bonusPercentage: 0,
      nextWithdrawalTime: 0,
      totalEarned: 0,
      withdrawalCount: 0
    };
  }

  return {
    totalReferrals: Number(referrerInfoArray[0]),
    pendingCashback: Number(referrerInfoArray[1]),
    bonusPercentage: Number(referrerInfoArray[2]),
    nextWithdrawalTime: Number(referrerInfoArray[3]),
    totalEarned: Number(referrerInfoArray[4]),
    withdrawalCount: Number(referrerInfoArray[5])
  };
};