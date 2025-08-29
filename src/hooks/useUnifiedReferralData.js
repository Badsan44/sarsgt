import { shouldUseTheGraph } from '../config/features';
import { useGraphReferralData } from './useGraphReferralData';
import { useIndividualReferralData } from './useIndividualReferralData';

/**
 * Unified hook that switches between The Graph and legacy block scanning
 * based on the feature flag configuration
 */
export const useUnifiedReferralData = () => {
  const useTheGraph = shouldUseTheGraph();
  
  // Use The Graph Protocol data source
  const graphData = useGraphReferralData();
  
  // Use legacy block scanning data source
  const legacyData = useIndividualReferralData();
  
  // Return the appropriate data source based on feature flag
  if (useTheGraph) {
    return {
      ...graphData,
      dataSource: 'thegraph'
    };
  } else {
    return {
      ...legacyData,
      dataSource: 'legacy'
    };
  }
};