# The Graph Protocol Deployment Guide

This guide explains how to deploy the BNBZNN subgraphs to The Graph Protocol and integrate them with the frontend.

## Overview

The Graph Protocol implementation provides persistent, queryable history for referral and withdrawal events across both Ethereum (Sepolia) and BSC (Chapel) testnets. This replaces the current block-scanning approach that loses data after time windows.

## Architecture

- **Two separate subgraphs**: One for Ethereum, one for BSC
- **Unified frontend integration**: Single hook that queries both networks
- **Feature flag system**: Easy switching between The Graph and legacy approaches
- **Persistent data**: All historical events stored permanently

## Deployment Steps

### 1. Create The Graph Studio Account

1. Go to [The Graph Studio](https://thegraph.com/studio/)
2. Connect your wallet
3. Create a new subgraph for each network:
   - `bnbznn-ethereum` (for Sepolia testnet)
   - `bnbznn-bsc` (for BSC Chapel testnet)

### 2. Deploy Ethereum Subgraph

```bash
cd subgraph

# Authenticate with The Graph Studio
graph auth --studio YOUR_DEPLOY_KEY

# Deploy Ethereum subgraph
npm run deploy:eth
```

### 3. Deploy BSC Subgraph

```bash
# Deploy BSC subgraph
npm run deploy:bsc
```

### 4. Update Configuration

After deployment, update the subgraph URLs in `src/config/features.js`:

```javascript
SUBGRAPH_URLS: {
  ethereum: 'https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/bnbznn-ethereum/version/latest',
  bsc: 'https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/bnbznn-bsc/version/latest'
}
```

### 5. Enable The Graph

Set the feature flag to use The Graph:

```javascript
USE_THE_GRAPH: true
```

## Contract Events Indexed

### ReferralPurchase Event
- `referrer` (indexed): Address of the referrer
- `buyer` (indexed): Address of the buyer
- `usdAmount`: USD amount of the purchase
- `nativeCurrencyPaid`: Native currency amount paid
- `cashbackAmount`: Cashback amount earned by referrer
- `bonusPercent`: Bonus percentage applied
- `newReferralCount`: Updated referral count

### ReferralWithdrawn Event
- `referrer` (indexed): Address of the referrer
- `amount`: Amount withdrawn
- `timestamp`: Withdrawal timestamp
- `totalWithdrawnToDate`: Total amount withdrawn to date

## GraphQL Schema

### User Entity
```graphql
type User {
  id: ID! # wallet address
  totalReferrals: Int!
  totalEarned: BigInt!
  totalWithdrawn: BigInt!
  referralEvents: [ReferralEvent!]!
  withdrawalEvents: [WithdrawalEvent!]!
  createdAt: BigInt!
  updatedAt: BigInt!
}
```

### ReferralEvent Entity
```graphql
type ReferralEvent {
  id: ID! # tx_hash-log_index
  referrer: User!
  buyer: Bytes!
  usdAmount: BigInt!
  nativeCurrencyPaid: BigInt!
  cashbackAmount: BigInt!
  bonusPercent: BigInt!
  newReferralCount: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
  blockNumber: BigInt!
  chain: String!
  createdAt: BigInt!
}
```

## Frontend Integration

### Using the Unified Hook

```javascript
import { useUnifiedReferralData } from './hooks/useUnifiedReferralData';

function ReferralComponent() {
  const { 
    referralData, 
    withdrawalData, 
    loading, 
    error, 
    stats, 
    refresh,
    dataSource 
  } = useUnifiedReferralData();

  // Component logic...
}
```

### Direct GraphQL Usage

```javascript
import { queryBothNetworks, GET_USER_REFERRALS } from './services/graphql';

const fetchUserData = async (userAddress) => {
  const { ethData, bscData } = await queryBothNetworks(
    GET_USER_REFERRALS,
    { userAddress: userAddress.toLowerCase() }
  );
  
  // Process combined data...
};
```

## Benefits

1. **Persistent History**: No data loss after time windows
2. **Efficient Querying**: GraphQL provides flexible, efficient queries
3. **Cross-Chain Support**: Unified interface for both Ethereum and BSC
4. **Real-time Updates**: Subgraphs update automatically with new blocks
5. **Cost Effective**: Free tier supports 100k queries/month (perfect for 10k users/month)
6. **Scalable**: Can handle growth without infrastructure changes

## Monitoring

- Monitor subgraph sync status in The Graph Studio
- Check query usage against free tier limits
- Monitor error rates in frontend GraphQL queries

## Fallback Strategy

The feature flag system allows instant fallback to the legacy block-scanning approach if needed:

```javascript
// In src/config/features.js
USE_THE_GRAPH: false // Switches back to legacy approach
```

## Testing

1. Deploy subgraphs to testnet
2. Perform test transactions on both networks
3. Verify events are indexed correctly
4. Test frontend integration with both data sources
5. Validate cross-chain data aggregation

## Production Considerations

1. **Mainnet Deployment**: Update contract addresses and network names for mainnet
2. **Monitoring**: Set up alerts for subgraph sync issues
3. **Backup**: Keep legacy system as fallback during initial rollout
4. **Performance**: Monitor query performance and optimize as needed