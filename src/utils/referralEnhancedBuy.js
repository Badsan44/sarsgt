// src/utils/referralEnhancedBuy.js
import { parseReferralFromUrl, isValidAddress } from './referralUtils';

// Enhanced buy token function with referral support
export const enhancedBuyToken = (originalBuyToken, writeContract, configModule, buyAmount, paymentPrice, parseEther, makeEmptyInputs, setPresaleStatus) => {
  return () => {
    // Get referral information from URL
    const referralInfo = parseReferralFromUrl();
    
    // Prepare contract arguments - no longer passing buyAmount as the contract uses msg.value
    let contractArgs = [];
    
    // If there's a valid referral, add the referrer address to the arguments
    if (referralInfo && referralInfo.isValidReferral) {
      // The contract expects buyToken(address _referrer)
      contractArgs.push(referralInfo.referrerAddress);
      
      console.log('Purchasing with referral:', {
        referrer: referralInfo.referrerAddress,
        referralCode: referralInfo.referralCode
      });
      
      setPresaleStatus(`Purchasing with referral bonus from ${referralInfo.referrerAddress.slice(0, 6)}...${referralInfo.referrerAddress.slice(-4)}`);
    }
    
    // Call the original buy function with enhanced arguments
    writeContract({
      ...configModule.buyTokenCall,
      args: contractArgs,
      value: parseEther(paymentPrice.toString()),
    });
    
    makeEmptyInputs();
  };
};

// Function to display referral status in UI
export const getReferralStatus = () => {
  const referralInfo = parseReferralFromUrl();
  
  if (referralInfo && referralInfo.isValidReferral) {
    return {
      hasReferral: true,
      referrerAddress: referralInfo.referrerAddress,
      referralCode: referralInfo.referralCode,
      displayText: `Referred by: ${referralInfo.referrerAddress.slice(0, 6)}...${referralInfo.referrerAddress.slice(-4)}`
    };
  }
  
  return {
    hasReferral: false,
    referrerAddress: null,
    referralCode: null,
    displayText: null
  };
};

// Function to show referral bonus notification
export const showReferralBonus = (referrerAddress) => {
  if (!referrerAddress || referrerAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }
  
  return {
    type: 'success',
    title: 'Referral Bonus Applied!',
    message: `Your purchase will earn bonus tokens for ${referrerAddress.slice(0, 6)}...${referrerAddress.slice(-4)}`,
    duration: 5000
  };
};