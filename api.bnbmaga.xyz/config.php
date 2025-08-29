<?php
// ===================== DATABASES =====================
$referral_db_config = [
    'host'     => 'localhost',
    'dbname'   => 'u599161029_ReferralDB',
    'username' => 'u599161029_RefDB',
    'password' => 'C31Patru@',
];

$attestation_db_config = [
    'host'     => 'localhost',
    'dbname'   => 'u599161029_attestation',
    'username' => 'u599161029_AttDB',
    'password' => 'Don3otoiash',
];

// For backward compatibility
$db_config = $referral_db_config;

// ===================== SECURITY ======================
$security_config = [
    // Add www + (optionally) localhost for dev
    'allowed_origins' => [
        'https://bnbmaga.xyz',
        'https://www.bnbmaga.xyz',
        // 'http://localhost:3000', // dev only
        // 'http://localhost:5173', // dev only
    ],

    'rate_limit' => 60,

    // Keep in env in production if you can; fallback is okay for now
    'api_key' => getenv('BNBMAGA_API_KEY')
        ?: '771644fbcdbddb5c68083e07f82b09057df6bf99905dbb13be4dc02ab7808941',

    'webhook_secret' => getenv('BNBMAGA_WEBHOOK_SECRET')
        ?: '3da501bc400fe1e49d607bde3ec587b769cd0e703591337a4e02083023b97ad6',

    'debug_mode' => true,
];

// ===================== ATTESTATION ====================
// Make sure signer_address = address of signer_private_key
$attestation_config = [
    'signer_private_key' => getenv('AGGREGATOR_SIGNER_PK')
        ?: 'e66a9cfd9d41fb7fde9ea0ffc447bf99fa6471b1eda4cff2fe22b293951e934d',

    'signer_address'  => '0x9bd86b9887CBaB60207a9708cF834A6Cc5C7019a',
    'fee_recipient'   => '0xb6FA8Be10f890E40AbDb3F3E9F2DA36d983eEa60',

    // Basis points
    'max_sync_fee_bps'     => 300, // must be <= contract maxSyncFeeBps
    'default_sync_fee_bps' => 50,  // 0.5%

    // Must match Solidity thresholds (desc)
    'tier_thresholds_desc' => [930, 430, 180, 80, 40, 15, 5, 0],

    // --- SUPPORTED CHAINS ---
    // Fill the RPC + actual BNBRFPresale addresses you deployed.
    // Keep only what you use; remove others to avoid unnecessary RPC calls.
    'chains' => [
        // Ethereum mainnet
        //1 => [
        //    'name'     => 'ethereum',
        //    'rpc'      => 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY', // TODO
        //    'contract' => '0xYOUR_ETH_MAINNET_PRESALE',                   // TODO
       // ],

        // BSC mainnet
       // 56 => [
       //     'name'     => 'bsc',
       //     'rpc'      => 'https://bsc-dataseed.binance.org',
        //    'contract' => '0xYOUR_BSC_MAINNET_PRESALE',                   // TODO
       // ],

        // ---- Remove testnets below if not used in production ----
        
         //BSC testnet
         97 => [
             'name'     => 'bscTestnet',
             'rpc'      => 'https://bsc-testnet.drpc.org',
             'contract' => '0xb292906c7590104a0015703e5fc8ba64385756cb',
         ],

         //Sepolia (if you are testing there)
         11155111 => [
             'name'     => 'sepolia',
             'rpc'      => 'https://ethereum-sepolia-rpc.publicnode.com',
             'contract' => '0xa35f69cd2f2e10a4801bd4b6c7a555f9b24de48a',
         ],
    ],
];