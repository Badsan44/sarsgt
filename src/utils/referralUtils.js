// src/utils/referralUtils.js

// Storage keys
const REFERRAL_LINK_KEY = 'user_referral_link';
const REFERRAL_CODE_KEY = 'user_referral_code';

// Generate a unique referral code based on wallet address
export const generateReferralCode = (walletAddress) => {
  if (!walletAddress) return null;
  
  // Create a short, unique code from the wallet address
  const shortAddress = walletAddress.slice(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  
  return `${shortAddress}${timestamp}`;
};

// Generate referral link
export const generateReferralLink = (walletAddress) => {
  if (!walletAddress) return null;
  
  const referralCode = generateReferralCode(walletAddress);
  const baseUrl = window.location.origin + window.location.pathname;
  
  return `${baseUrl}#/?ref=${referralCode}&referrer=${walletAddress}`;
};

// Save referral link to localStorage
export const saveReferralLink = (walletAddress) => {
  if (!walletAddress) return null;
  
  // Check if user already has a referral link
  const existingLink = getReferralLink(walletAddress);
  if (existingLink) {
    return existingLink;
  }
  
  const referralCode = generateReferralCode(walletAddress);
  const referralLink = generateReferralLink(walletAddress);
  
  // Store both the code and link
  localStorage.setItem(`${REFERRAL_CODE_KEY}_${walletAddress}`, referralCode);
  localStorage.setItem(`${REFERRAL_LINK_KEY}_${walletAddress}`, referralLink);
  
  return referralLink;
};

// Get referral link from localStorage
export const getReferralLink = (walletAddress) => {
  if (!walletAddress) return null;
  
  return localStorage.getItem(`${REFERRAL_LINK_KEY}_${walletAddress}`);
};

// Get referral code from localStorage
export const getReferralCode = (walletAddress) => {
  if (!walletAddress) return null;
  
  return localStorage.getItem(`${REFERRAL_CODE_KEY}_${walletAddress}`);
};

// Check if user has generated a referral link
export const hasReferralLink = (walletAddress) => {
  return !!getReferralLink(walletAddress);
};

// Parse referral information from URL
export const parseReferralFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
  
  // Check both regular params and hash params
  const referralCode = urlParams.get('ref') || hashParams.get('ref');
  const referrerAddress = urlParams.get('referrer') || hashParams.get('referrer');
  
  if (referralCode && referrerAddress) {
    return {
      referralCode,
      referrerAddress,
      isValidReferral: isValidAddress(referrerAddress)
    };
  }
  
  return null;
};

// Validate Ethereum address format
export const isValidAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Format time remaining for display
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return 'Available now';
  
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Get time until next withdrawal is available
export const getTimeUntilNextWithdrawal = (lastWithdrawalTimestamp) => {
  if (!lastWithdrawalTimestamp) return 0;
  
  const now = Date.now();
  const lastWithdrawal = new Date(lastWithdrawalTimestamp).getTime();
  const nextWithdrawal = lastWithdrawal + (14 * 24 * 60 * 60 * 1000); // 14 days
  
  return Math.max(0, nextWithdrawal - now);
};

// Check if withdrawal is available
export const canWithdraw = (lastWithdrawalTimestamp) => {
  return getTimeUntilNextWithdrawal(lastWithdrawalTimestamp) === 0;
};

// Format token amount for display
export const formatTokenAmount = (amount, decimals = 18, displayDecimals = 4) => {
  if (!amount) return '0';
  
  const divisor = Math.pow(10, decimals);
  const formatted = (Number(amount) / divisor).toFixed(displayDecimals);
  
  // Remove trailing zeros
  return parseFloat(formatted).toString();
};

// Format large numbers with K, M, B suffixes
export const formatLargeNumber = (num) => {
  if (!num) return '0';
  
  const number = Number(num);
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return (part / total) * 100;
};

// Debounce function for API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get chain name from chain ID
export const getChainName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 11155111:
      return 'Sepolia';
    case 56:
      return 'BSC';
    case 97:
      return 'BSC Testnet';
    default:
      return 'Unknown';
  }
};

// Get explorer URL for transaction
export const getExplorerUrl = (chainId, txHash) => {
  // Convert chainId to number if it's a string
  const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId;
  
  switch (numericChainId) {
    case 1:
      return `https://etherscan.io/tx/${txHash}`;
    case 11155111:
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 56:
      return `https://bscscan.com/tx/${txHash}`;
    case 97:
      return `https://testnet.bscscan.com/tx/${txHash}`;
    default:
      console.error('Unknown chainId for explorer URL:', { chainId, numericChainId });
      return '#';
  }
};