import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { getSubgraphUrl } from '../config/features';

// The Graph endpoints
const ETHEREUM_SUBGRAPH_URL = getSubgraphUrl('ethereum');
const BSC_SUBGRAPH_URL = getSubgraphUrl('bsc');

// Create Apollo clients for each network
export const ethereumClient = new ApolloClient({
  uri: ETHEREUM_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

export const bscClient = new ApolloClient({
  uri: BSC_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

// GraphQL queries
export const GET_USER_REFERRALS = gql`
  query GetUserReferrals($userAddress: String!, $first: Int = 100, $skip: Int = 0) {
    user(id: $userAddress) {
      id
      totalReferrals
      totalEarned
      totalWithdrawn
      referralEvents(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
        id
        buyer
        usdAmount
        nativeCurrencyPaid
        cashbackAmount
        bonusPercent
        timestamp
        transactionHash
        blockNumber
        chain
      }
    }
  }
`;

export const GET_USER_WITHDRAWALS = gql`
  query GetUserWithdrawals($userAddress: String!, $first: Int = 100, $skip: Int = 0) {
    user(id: $userAddress) {
      id
      totalWithdrawn
      withdrawalEvents(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
        id
        amount
        timestamp
        totalWithdrawnToDate
        transactionHash
        blockNumber
        chain
      }
    }
  }
`;

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStats(id: "global") {
      totalUsers
      totalReferrals
      totalVolume
      totalWithdrawn
      updatedAt
    }
  }
`;

// Helper function to query both networks and combine results
export const queryBothNetworks = async (query, variables = {}) => {
  try {
    const [ethResult, bscResult] = await Promise.allSettled([
      ethereumClient.query({ query, variables }),
      bscClient.query({ query, variables })
    ]);

    const ethData = ethResult.status === 'fulfilled' ? ethResult.value.data : null;
    const bscData = bscResult.status === 'fulfilled' ? bscResult.value.data : null;

    return { ethData, bscData };
  } catch (error) {
    console.error('Error querying subgraphs:', error);
    return { ethData: null, bscData: null };
  }
};

// Helper function to combine user data from both networks
export const combineUserData = (ethUser, bscUser) => {
  if (!ethUser && !bscUser) return null;

  const combined = {
    id: ethUser?.id || bscUser?.id,
    totalReferrals: (ethUser?.totalReferrals || 0) + (bscUser?.totalReferrals || 0),
    totalEarned: BigInt(ethUser?.totalEarned || 0) + BigInt(bscUser?.totalEarned || 0),
    totalWithdrawn: BigInt(ethUser?.totalWithdrawn || 0) + BigInt(bscUser?.totalWithdrawn || 0),
    referralEvents: [
      ...(ethUser?.referralEvents || []),
      ...(bscUser?.referralEvents || [])
    ].sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)),
    withdrawalEvents: [
      ...(ethUser?.withdrawalEvents || []),
      ...(bscUser?.withdrawalEvents || [])
    ].sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
  };

  return combined;
};

// Helper function to format amounts for display
export const formatAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  const divisor = BigInt(10 ** decimals);
  const wholePart = BigInt(amount) / divisor;
  const fractionalPart = BigInt(amount) % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return trimmedFractional ? `${wholePart}.${trimmedFractional}` : wholePart.toString();
};

// Helper function to format timestamp
export const formatTimestamp = (timestamp) => {
  return new Date(parseInt(timestamp) * 1000).toLocaleString();
};