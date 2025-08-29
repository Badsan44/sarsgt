// src/config/api.js
// API Configuration

// UPDATE THIS WITH YOUR ACTUAL DOMAIN
export const API_CONFIG = {
  BASE_URL: 'https://bnbmaga.xyz/api',
  ENDPOINTS: {
    REFERRAL: '/referral.php'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export the referral API URL for convenience
export const REFERRAL_API_URL = getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL);

// Public API key used by frontend to access Hostinger PHP endpoints
export const API_KEY = '771644fbcdbddb5c68083e07f82b09057df6bf99905dbb13be4dc02ab7808941';