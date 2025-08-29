# Multi-Chain Aggregated Presale System

This document explains the implementation of the multi-chain aggregated presale system that combines data from both ETH and BNB networks.

## Overview

The aggregated presale system allows you to run presale contracts on both Ethereum and BNB Smart Chain networks simultaneously, while displaying combined statistics on your website. This provides users with flexibility in payment methods while maintaining a unified presale experience.

## Architecture

### 1. Core Components

#### AggregatedPresaleService (`src/utils/AggregatedPresaleService.js`)
- **Purpose**: Off-chain service that fetches data from both ETH and BNB presale contracts
- **Features**:
  - Connects to both networks using public RPC endpoints
  - Fetches presale data (total supply, tokens sold, current stage, etc.)
  - Aggregates data from both contracts
  - Implements caching to reduce RPC calls
  - Provides real-time updates

#### AggregatedPresaleContextProvider (`src/utils/AggregatedPresaleContextProvider.jsx`)
- **Purpose**: React context provider that manages aggregated presale state
- **Features**:
  - Combines data from both networks
  - Provides formatted values for display
  - Handles loading and error states
  - Auto-refreshes data every 30 seconds

#### useAggregatedPresale Hook (`src/utils/useAggregatedPresale.js`)
- **Purpose**: React hook for consuming aggregated presale data
- **Features**:
  - Automatic data fetching and refreshing
  - Loading and error state management
  - Manual refresh capability

### 2. Contract Configuration

#### ETH Network Configuration (`src/contracts/configEth.js`)
```javascript
// Sepolia Testnet (change to mainnet for production)
const tokenContractAddress = "0xF1CD03880758F286a167438B787Be3facc285e65";
const presaleContractAddress = "0xE429f7A2BDac87e8B02C9a14E68C668f417Ec6ec";
const contractChainId = 11155111; // Sepolia
```

#### BNB Network Configuration (`src/contracts/configBnb.js`)
```javascript
// BSC Mainnet
const tokenContractAddress = "0xf48c0eac4bb7037bfe47921b08cac3f5424e6cfb";
const presaleContractAddress = "0x36e71e0919caf8d88f4e08bbe7f2a9e8c68a1e15";
const contractChainId = 56; // BSC Mainnet
```

## Implementation Details

### 1. Data Aggregation

The system fetches the following data from each contract:
- `presaleTokenAmount`: Total tokens available for presale
- `totalSold`: Total tokens sold so far
- `getCurrentStageIdActive`: Current active stage ID
- `stages`: Stage information (bonus, price, timing)
- `maxStage`: Maximum number of stages

### 2. Aggregated Metrics

The following metrics are calculated and displayed:
- **Total Supply**: Sum of presale tokens from both networks
- **Total Sold**: Sum of tokens sold on both networks
- **Progress Percentage**: (Total Sold / Total Supply) × 100
- **Current Stage**: Based on time-based stage progression
- **Network Breakdown**: Individual stats for ETH and BNB networks

### 3. Stage Management

Stages are managed by time rather than token sales:
- Each stage has a start and end timestamp
- Stage progression is automatic based on time
- Both contracts should have synchronized stage timing
- Current stage and bonus are determined by the current timestamp

## Usage

### 1. Accessing the Aggregated View

Visit the aggregated presale page at:
```
https://your-domain.com/#/aggregated
```

### 2. Using the Aggregated Data in Components

```jsx
import { useAggregatedPresaleData } from "../utils/AggregatedPresaleContextProvider";

const MyComponent = () => {
  const {
    totalSupply,
    totalSold,
    totalPercent,
    currentStage,
    currentBonus,
    networks,
    isLoading,
    error,
    refreshData
  } = useAggregatedPresaleData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Stage {currentStage}: {currentBonus}% Bonus</h3>
      <p>Total Progress: {totalPercent}%</p>
      <p>ETH Network: {networks.ETH.totalSold} / {networks.ETH.totalSupply}</p>
      <p>BNB Network: {networks.BNB.totalSold} / {networks.BNB.totalSupply}</p>
      <button onClick={refreshData}>Refresh</button>
    </div>
  );
};
```

## Configuration

### 1. RPC Endpoints

Update the RPC URLs in `AggregatedPresaleService.js`:

```javascript
const CHAINS = {
  ETH: {
    rpcUrl: 'https://your-eth-rpc-endpoint.com',
    // ... other config
  },
  BNB: {
    rpcUrl: 'https://your-bnb-rpc-endpoint.com',
    // ... other config
  }
};
```

### 2. Contract Addresses

Update contract addresses in the respective config files:
- `src/contracts/configEth.js` for Ethereum contracts
- `src/contracts/configBnb.js` for BNB contracts

### 3. Network Selection

To switch between testnets and mainnets, update the chain configurations:

For Ethereum:
- Testnet: `sepolia` (Chain ID: 11155111)
- Mainnet: `mainnet` (Chain ID: 1)

For BNB:
- Testnet: `bscTestnet` (Chain ID: 97)
- Mainnet: `bsc` (Chain ID: 56)

## Contract Requirements

### 1. Required Functions

Your presale contracts must implement these functions:
- `presaleTokenAmount()`: Returns total tokens for presale
- `totalSold()`: Returns total tokens sold
- `getCurrentStageIdActive()`: Returns current active stage ID
- `stages(uint256)`: Returns stage info (bonus, price, start/end times)
- `maxStage()`: Returns maximum stage number

### 2. Stage Structure

Each stage should return:
```solidity
struct Stage {
    uint256 id;           // Stage ID
    uint256 bonus;        // Bonus percentage
    uint256 price;        // Price per token
    uint256 startTime;    // Stage start timestamp
    uint256 endTime;      // Stage end timestamp
}
```

### 3. Synchronization

Ensure both contracts have:
- Identical stage timing
- Synchronized stage progression
- Same bonus percentages per stage
- Compatible price structures

## Monitoring and Maintenance

### 1. Data Refresh

- Automatic refresh every 30 seconds
- Manual refresh button available
- Cache TTL of 30 seconds to reduce RPC calls

### 2. Error Handling

- Network connectivity issues
- Contract call failures
- Invalid contract responses
- RPC endpoint downtime

### 3. Performance Optimization

- Parallel contract calls
- Data caching
- Efficient re-rendering
- Minimal RPC requests

## Troubleshooting

### Common Issues

1. **RPC Endpoint Errors**
   - Check RPC URL validity
   - Verify network connectivity
   - Consider rate limiting

2. **Contract Call Failures**
   - Verify contract addresses
   - Check ABI compatibility
   - Ensure contracts are deployed

3. **Data Inconsistencies**
   - Verify stage synchronization
   - Check contract state
   - Review timing configurations

### Debug Mode

Enable debug logging by adding to console:
```javascript
localStorage.setItem('debug', 'aggregated-presale:*');
```

## Security Considerations

1. **RPC Endpoints**: Use trusted RPC providers
2. **Contract Verification**: Verify all contract addresses
3. **Data Validation**: Validate all contract responses
4. **Error Handling**: Graceful degradation on failures
5. **Rate Limiting**: Respect RPC provider limits

## Future Enhancements

1. **Additional Networks**: Support for more blockchain networks
2. **Real-time Updates**: WebSocket connections for live data
3. **Analytics Dashboard**: Detailed presale analytics
4. **Admin Panel**: Contract management interface
5. **API Endpoints**: REST API for external integrations

## Support

For technical support or questions about the aggregated presale system:
1. Check the troubleshooting section
2. Review contract implementations
3. Verify network configurations
4. Test with smaller amounts first

---

**Note**: This system is designed for production use but should be thoroughly tested on testnets before mainnet deployment.