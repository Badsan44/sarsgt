# Contract Update Guide

This guide provides step-by-step instructions for updating the application to use new contract addresses. Follow these steps whenever you deploy new contracts and need to update the frontend and subgraphs.

## 📋 Prerequisites

- Access to The Graph Studio deployment keys
- New contract addresses for both networks
- New contract ABI (if the contract interface changed)
- Start block numbers for the new contracts

## 🔄 Step-by-Step Update Process

### 1. Update Frontend Contract Configuration

#### 1.1 Update Ethereum Contract Address
```bash
# Edit the Ethereum configuration file
nano src/contracts/configEth.js
```

Update the `presaleContractAddress`:
```javascript
// OLD
export const presaleContractAddress = "0x569462db0b5445289ada5a22dda3da827957438e";

// NEW - Replace with your new contract address
export const presaleContractAddress = "0xYOUR_NEW_ETH_CONTRACT_ADDRESS";
```

#### 1.2 Update BSC Contract Address
```bash
# Edit the BSC configuration file
nano src/contracts/configBnb.js
```

Update the `presaleContractAddress`:
```javascript
// OLD
export const presaleContractAddress = "0x35679280dad682b659c5e1e0f10e5cbbe0c9d608";

// NEW - Replace with your new contract address
export const presaleContractAddress = "0xYOUR_NEW_BSC_CONTRACT_ADDRESS";
```

#### 1.3 Update Contract ABI (if changed)
If the contract interface changed, update the ABI file:
```bash
# Replace the ABI file with the new contract ABI
cp /path/to/new/PresaleContractAbi.json src/contracts/PresaleContractAbi.json
```

### 2. Update Subgraph Configuration

#### 2.1 Update Ethereum Subgraph
```bash
# Navigate to subgraph directory
cd subgraph

# Edit Ethereum subgraph configuration
nano subgraph-ethereum.yaml
```

Update the contract address and start block:
```yaml
dataSources:
  - kind: ethereum
    name: PresaleEthereum
    network: sepolia
    source:
      address: "0xYOUR_NEW_ETH_CONTRACT_ADDRESS"  # Update this
      abi: Presale
      startBlock: YOUR_NEW_START_BLOCK            # Update this
```

#### 2.2 Update BSC Subgraph
```bash
# Edit BSC subgraph configuration
nano subgraph-bsc.yaml
```

Update the contract address and start block:
```yaml
dataSources:
  - kind: ethereum
    name: PresaleBSC
    network: bsc-testnet
    source:
      address: "0xYOUR_NEW_BSC_CONTRACT_ADDRESS"  # Update this
      abi: Presale
      startBlock: YOUR_NEW_START_BLOCK            # Update this
```

#### 2.3 Update Subgraph ABI (if changed)
If the contract ABI changed:
```bash
# Copy the new ABI to subgraph directory
cp ../src/contracts/PresaleContractAbi.json abis/Presale.json
```

### 3. Regenerate and Build Subgraphs

#### 3.1 Install Dependencies
```bash
# Make sure you're in the subgraph directory
cd subgraph

# Install dependencies
npm install
```

#### 3.2 Generate TypeScript Bindings
```bash
# Generate code for both networks
npm run codegen:eth
npm run codegen:bsc
```

#### 3.3 Build Subgraphs
```bash
# Build both subgraphs
npm run build:eth
npm run build:bsc
```

### 4. Deploy Updated Subgraphs

#### 4.1 Authenticate with The Graph Studio
```bash
# Replace YOUR_DEPLOY_KEY with your actual deployment key
npx graph auth --studio YOUR_DEPLOY_KEY
```

#### 4.2 Deploy Ethereum Subgraph
```bash
# Deploy with incremented version (e.g., v0.0.4, v0.0.5, etc.)
echo "v0.0.4" | npx graph deploy --studio bnbmga-ethtest subgraph-ethereum.yaml
```

#### 4.3 Deploy BSC Subgraph
```bash
# Deploy with the same version number
echo "v0.0.4" | npx graph deploy --studio bnbmga-bn-btest subgraph-bsc.yaml
```

### 5. Update Frontend Subgraph URLs

#### 5.1 Update Feature Configuration
```bash
# Navigate back to project root
cd ..

# Edit the features configuration
nano src/config/features.js
```

Update the subgraph URLs with the new version:
```javascript
SUBGRAPH_URLS: {
  ethereum: 'https://api.studio.thegraph.com/query/116215/bnbmga-ethtest/v0.0.4', // Update version
  bsc: 'https://api.studio.thegraph.com/query/116215/bnbmga-bn-btest/v0.0.4'     // Update version
},
```

### 6. Build and Deploy Frontend

#### 6.1 Build the Application
```bash
# Build the frontend application
npm run build
```

#### 6.2 Deploy to Production
```bash
# Deploy using your preferred method (examples):

# Option 1: Using Vercel
vercel --prod

# Option 2: Using Netlify
netlify deploy --prod --dir=dist

# Option 3: Using your own server
# Copy dist/ folder to your web server
```

## 🔍 Verification Steps

### 1. Check Subgraph Sync Status
Visit The Graph Studio and verify that both subgraphs are syncing:
- Ethereum: https://thegraph.com/studio/subgraph/bnbmga-ethtest
- BSC: https://thegraph.com/studio/subgraph/bnbmga-bn-btest

### 2. Test Frontend Functionality
1. Connect your wallet to the application
2. Navigate to the Referral Dashboard
3. Verify that referral history loads correctly
4. Test making a referral purchase (on testnet)
5. Check that new transactions appear in the history

### 3. Monitor for Errors
Check browser console for any GraphQL or network errors:
```javascript
// Open browser console and look for errors like:
// - GraphQL query failures
// - Network request errors
// - Subgraph sync issues
```

## 🚨 Troubleshooting

### Subgraph Not Syncing
- Check that the start block is correct
- Verify the contract address is accurate
- Ensure the ABI matches the deployed contract

### No Referral History Showing
- Wait for subgraphs to sync (can take 10-30 minutes)
- Check that the frontend is using the correct subgraph URLs
- Verify that events are being emitted by the new contracts

### GraphQL Errors
- Ensure subgraph version in URLs matches deployed version
- Check that the schema hasn't changed
- Verify network connectivity to The Graph endpoints

### React DOM Prop Warnings
If you see warnings about unrecognized DOM props (like `chainColor`), ensure styled-components are properly filtering props:
```javascript
// ✅ Correct way to filter props in styled-components
const StyledComponent = styled.div.attrs(({ customProp, ...rest }) => ({
  ...rest // Only pass through standard DOM props
}))`
  color: ${props => props.customProp || '#default'};
`;
```

## 📝 Important Notes

1. **Version Management**: Always increment the subgraph version (v0.0.1 → v0.0.2 → v0.0.3, etc.)

2. **Sync Time**: New subgraphs need time to sync. Historical data will appear gradually.

3. **Testing**: Always test on testnets before updating mainnet configurations.

4. **Backup**: Keep backups of working configurations before making changes.

5. **Monitoring**: Monitor the application after deployment to ensure everything works correctly.

## 📚 Quick Reference Commands

```bash
# Complete update workflow
cd subgraph
npm install
npm run codegen:eth && npm run codegen:bsc
npm run build:eth && npm run build:bsc
npx graph auth --studio YOUR_DEPLOY_KEY
echo "v0.0.X" | npx graph deploy --studio bnbmga-ethtest subgraph-ethereum.yaml
echo "v0.0.X" | npx graph deploy --studio bnbmga-bn-btest subgraph-bsc.yaml
cd ..
npm run build
```

## 🔗 Useful Links

- [The Graph Studio](https://thegraph.com/studio/)
- [Graph Protocol Documentation](https://thegraph.com/docs/)
- [Ethereum Sepolia Explorer](https://sepolia.etherscan.io/)
- [BSC Testnet Explorer](https://testnet.bscscan.com/)

---

**Last Updated**: July 16, 2025
**Current Contract Addresses**:
- ETH Sepolia: `0x569462db0b5445289ada5a22dda3da827957438e`
- BSC Testnet: `0x35679280dad682b659c5e1e0f10e5cbbe0c9d608`