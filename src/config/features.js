// Feature flags for the application
export const FEATURES = {
  // Set to true to use The Graph Protocol for referral data
  // Set to false to use the legacy block scanning approach
  USE_THE_GRAPH: true, // ✅ Using The Graph Protocol with updated contract addresses
  
  // The Graph subgraph URLs (update these after deployment)
  SUBGRAPH_URLS: {
    ethereum: 'https://api.studio.thegraph.com/query/116215/bnbmga-ethtest/v0.0.3', // ✅ Updated with new contract addresses
    bsc: 'https://api.studio.thegraph.com/query/116215/bnbmga-bn-btest/v0.0.3' // ✅ Updated with new contract addresses
  },
  
  // Block range settings for legacy approach
  BLOCK_RANGES: {
    ethereum: 1000n,
    bsc: 5000n // Increased from 1000n as per previous fix
  }
};

// Helper function to check if The Graph should be used
export const shouldUseTheGraph = () => {
  return FEATURES.USE_THE_GRAPH;
};

// Helper function to get subgraph URL for a network
export const getSubgraphUrl = (network) => {
  return FEATURES.SUBGRAPH_URLS[network];
};