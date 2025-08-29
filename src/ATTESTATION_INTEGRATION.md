# Referral Attestation Frontend Integration Guide

This guide explains how the frontend integrates with the attestation service for the global tier system.

## Overview

The attestation service enables cross-chain tier synchronization for referrers. When a user makes a purchase with a referrer, the frontend requests an attestation from the backend service, which provides a signed message that can be verified on-chain.

## How It Works

1. When a user makes a purchase with a referrer, the frontend calls the attestation service.
2. The service returns a signed attestation containing:
   - The referrer address
   - The global referral count
   - A deadline timestamp
   - A sync fee
   - A signature
3. The frontend includes this attestation data in the contract call.
4. The contract verifies the signature and updates the referrer's tier if needed.

## Integration Points

### 1. Attestation Service

The `attestationService.js` file provides functions to interact with the attestation API:

- `getAttestation(referrer, buyerPlannedValueWei, chainId)`: Gets an attestation for a referrer
- `hasHigherGlobalTier(contract, referrer)`: Checks if a referrer has a higher global tier than local tier
- `formatAttestationForContract(attestation)`: Formats attestation data for the contract call

### 2. Enhanced Purchase Flow

The `attestedReferralBuy.js` file provides a function to prepare the contract call with attestation:

- `prepareAttestedBuyTokenCall(configModule, referrerAddress, paymentAmount, chainId)`: Prepares the contract call with attestation

### 3. Contract Configuration

The contract configuration files (`configEth.js` and `configBnb.js`) include the new function for buying tokens with attestation:

```javascript
export const buyTokenWithAttestationCall = {
  ...presaleContractConfig,
  functionName: "buyToken",
  watch: true,
};
```

### 4. Purchase Context

The `PresaleContextProvider.jsx` file has been updated to use the attestation service when making purchases with referrers.

## Error Handling

If the attestation service fails, the frontend falls back to the regular referral purchase without attestation. This ensures that purchases can still be made even if the attestation service is unavailable.

## Environment Configuration

The attestation service URL is configured in the `attestationService.js` file:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.yourdomain.com';
```

Set the `REACT_APP_API_BASE_URL` environment variable to point to your attestation service.

## Testing

To test the attestation integration:

1. Make sure the attestation service is running and properly configured.
2. Make a purchase with a referrer on one chain (e.g., ETH).
3. Check that the referrer's tier is updated on the other chain (e.g., BSC).

## Troubleshooting

1. **Attestation Service Unavailable**: Check that the attestation service is running and accessible.
2. **Invalid Signature**: Ensure the attestation service is using the correct private key.
3. **Tier Not Updating**: Check that the contract's aggregator signer and fee recipient are properly configured.

## Security Considerations

1. **HTTPS**: Always use HTTPS for the attestation service to prevent man-in-the-middle attacks.
2. **Signature Verification**: The contract verifies the signature to ensure the attestation data is authentic.
3. **Deadline**: The attestation includes a deadline to prevent replay attacks.
4. **Sync Fee**: The sync fee is capped to prevent excessive fees.