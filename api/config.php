<?php
// Referral System Database Configuration
$referral_db_config = [
    'host' => 'localhost',
    'dbname' => 'u599161029_ReferralDB',  // Your referral database name
    'username' => 'u599161029_RefDB',      // Your referral database username
    'password' => 'C31Patru@',  // Your referral database password
];

// Attestation System Database Configuration
$attestation_db_config = [
    'host' => 'localhost',
    'dbname' => 'u599161029_attestation',  // Your attestation database name
    'username' => 'u599161029_AttDB',      // Your attestation database username
    'password' => 'Don3otoiash',  // Your attestation database password
];

// For backward compatibility with existing code
$db_config = $referral_db_config;

// API Security Configuration
$security_config = [
    // List of allowed origins for CORS (comma-separated)
    'allowed_origins' => ['https://bnbmaga.xyz', 'https://app.bnbmaga.xyz'],
    
    // Rate limiting: requests per minute per IP
    'rate_limit' => 60,
    
    // API key for authentication (use a strong random key in production)
    'api_key' => '771644fbcdbddb5c68083e07f82b09057df6bf99905dbb13be4dc02ab7808941',
    
    // Webhook secret for transaction event notifications
    'webhook_secret' => '3da501bc400fe1e49d607bde3ec587b769cd0e703591337a4e02083023b97ad6',
    
    // Enable detailed error logging (set to false in production)
    'debug_mode' => false,
];

// Attestation Service Configuration
$attestation_config = [
    // Private key for signing attestations (KEEP THIS SECURE!)
    // This should be stored in an environment variable in production
    'signer_private_key' => getenv('AGGREGATOR_SIGNER_PK') ?: 'e66a9cfd9d41fb7fde9ea0ffc447bf99fa6471b1eda4cff2fe22b293951e934d',
    
    // The corresponding public address (must match what's set in the contract via setAggregatorSigner)
    'signer_address' => '0x9bd86b9887CBaB60207a9708cF834A6Cc5C7019a',
    
    // Fee recipient address (must match what's set in the contract via setStampFeeRecipient)
    'fee_recipient' => '0xb6FA8Be10f890E40AbDb3F3E9F2DA36d983eEa60',
    
    // Maximum sync fee in basis points (1 bp = 0.01%, 300 = 3%)
    // This should match or be lower than the contract's maxSyncFeeBps
    'max_sync_fee_bps' => 300,
    
    // Default sync fee in basis points (50 = 0.5%)
    'default_sync_fee_bps' => 50,
];

// Database setup scripts
// For referral database: setup_referral_db.sql
// For attestation database: setup_attestation_db.sql
?>