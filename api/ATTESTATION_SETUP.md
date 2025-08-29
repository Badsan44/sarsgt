# Referral Attestation Service Setup Guide

This guide explains how to set up and configure the referral attestation service for the global tier system.

## Overview

The attestation service signs referral data to enable cross-chain tier synchronization. When a user makes a purchase with a referrer, the frontend requests an attestation from this service, which provides a signed message that can be verified on-chain.

## Prerequisites

1. PHP 7.4+ with PDO and MySQL extensions
2. MySQL/MariaDB database
3. Web3 PHP library (for signing attestations)
4. HTTPS-enabled web server (for security)

## Installation

1. Install the Web3 PHP library using Composer:

```bash
cd /path/to/api
composer require web3p/web3.php
```

2. Create the necessary database tables:

```bash
mysql -u your_username -p your_database < setup_tables.sql
```

3. Configure the service:

   - Edit `config.php` to set your database credentials
   - Set the `signer_private_key` in the attestation config (use an environment variable in production)
   - Set the `signer_address` to match the address derived from your private key
   - Set the `fee_recipient` address to receive sync fees

## Smart Contract Configuration

You need to configure the smart contract to work with the attestation service:

1. Set the aggregator signer address on both chains:

```solidity
// Call this function on both ETH and BSC contracts
function setAggregatorSigner(address _signer) external onlyOwner {
    require(_signer != address(0), "invalid signer");
    aggregatorSigner = _signer;
}
```

2. Set the fee recipient address on both chains:

```solidity
// Call this function on both ETH and BSC contracts
function setStampFeeRecipient(address _recipient) external onlyOwner {
    require(_recipient != address(0), "invalid fee recipient");
    stampFeeRecipient = _recipient;
}
```

3. (Optional) Adjust the maximum sync fee if needed:

```solidity
// Default is 300 basis points (3%)
function setMaxSyncFeeBps(uint16 bps) external onlyOwner {
    require(bps <= 10_000, "bps > 100%");
    maxSyncFeeBps = bps;
}
```

## Environment Variables

For production, set these environment variables:

```
AGGREGATOR_SIGNER_PK=your_private_key_here
```

## Security Considerations

1. **Private Key Security**: The private key used for signing attestations is highly sensitive. Never store it in the code or config files. Use environment variables or a secure key management system.

2. **HTTPS**: Always use HTTPS for the API to prevent man-in-the-middle attacks.

3. **Rate Limiting**: The API includes rate limiting to prevent abuse.

4. **Webhook Security**: The webhook endpoint uses a secret for authentication. Set a strong secret in the config.

## API Endpoints

### 1. Attestation Endpoint

**URL**: `/attest.php`
**Method**: `POST`
**Parameters**:
- `referrer`: The referrer address
- `buyerPlannedValueWei`: The planned purchase amount in wei
- `chainId`: The chain ID (1 for ETH mainnet, 56 for BSC mainnet, etc.)

**Response**:
```json
{
  "success": true,
  "referrer": "0x...",
  "attestedGlobalCount": 42,
  "deadline": 1628097600,
  "syncFee": "1000000000000000",
  "sig": "0x..."
}
```

### 2. Webhook Endpoint

**URL**: `/webhook.php`
**Method**: `POST`
**Headers**:
- `X-Webhook-Secret`: The webhook secret from config

**Parameters**:
```json
{
  "eventType": "ReferralPurchase",
  "chainId": "1",
  "txHash": "0x...",
  "blockNumber": "12345678",
  "eventData": {
    "referrer": "0x...",
    "buyer": "0x...",
    "usdAmount": "100000000000000000000",
    "nativeCurrencyPaid": "50000000000000000",
    "cashbackAmount": "5000000000000000",
    "bonusPercent": "10",
    "newReferralCount": "5"
  }
}
```

## Monitoring and Maintenance

1. Check the PHP error logs for any issues with the attestation service.
2. Monitor the database for growth and performance.
3. Regularly back up the database to prevent data loss.
4. Set up alerts for any failed attestations or webhook calls.

## Troubleshooting

1. **Invalid Signature**: Ensure the private key and signer address match.
2. **Database Connection Issues**: Check your database credentials and connection.
3. **Webhook Failures**: Verify the webhook secret and ensure the endpoint is accessible.