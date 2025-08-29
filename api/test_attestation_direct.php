<?php
// Direct test for attestation service functions
header('Content-Type: text/html; charset=utf-8');

// Include required files
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/referral_tiers.php';

// Test parameters
$referrer = "0x123456789abcdef123456789abcdef123456789a"; // Example address
$buyerPlannedValueWei = "1000000000000000000"; // 1 ETH in wei
$chainId = "1"; // Ethereum mainnet

echo "<!DOCTYPE html>
<html>
<head>
    <title>Direct Attestation Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
        .section { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Direct Attestation Service Test</h1>";

// Test database connection
echo "<div class='section'>
    <h2>1. Database Connection Test</h2>";

try {
    $pdo = getAttestationDbConnection();
    if (!$pdo) {
        throw new Exception("Failed to connect to attestation database");
    }
    echo "<p class='success'>✓ Database connection successful</p>";
    
    // Show which DB we're connected to
    $currentDb = $pdo->query("SELECT DATABASE()")->fetchColumn();
    echo "<p>Connected to database: <strong>" . htmlspecialchars((string)$currentDb) . "</strong></p>";
} catch (Exception $e) {
    echo "<p class='error'>✗ Database connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Test global referral count function
echo "<div class='section'>
    <h2>2. Global Referral Count Test</h2>";

try {
    // Explicitly use attestation DB connection
    $pdo = getAttestationDbConnection();
    if (!$pdo) {
        throw new Exception("Failed to connect to attestation database");
    }
    
    // Check if the function exists
    if (!function_exists('getGlobalReferralCount')) {
        throw new Exception("Function getGlobalReferralCount does not exist");
    }
    
    // Get global referral count
    $globalCount = getGlobalReferralCount($referrer);
    echo "<p>Global referral count for {$referrer}: <strong>{$globalCount}</strong></p>";
    
    // Check if the referrer exists in the database
    $stmt = $pdo->prepare("SELECT * FROM global_referral_counts WHERE referrer_address = ?");
    $stmt->execute([$referrer]);
    $referrerData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($referrerData) {
        echo "<p class='success'>✓ Referrer found in database</p>";
        echo "<pre>" . htmlspecialchars(json_encode($referrerData, JSON_PRETTY_PRINT)) . "</pre>";
    } else {
        echo "<p>Referrer not found in database. A new record should be created.</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Global referral count test failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Test sync fee calculation
echo "<div class='section'>
    <h2>3. Sync Fee Calculation Test</h2>";

try {
    // Define the calculateSyncFee function if it doesn't exist
    if (!function_exists('calculateSyncFee')) {
        function calculateSyncFee($valueWei) {
            // Convert to a number for calculation
            $value = gmp_init($valueWei);
            
            // Calculate 0.5% of the transaction value (50 basis points)
            $feePercent = 50; // 0.5% = 50 basis points
            $fee = gmp_div(gmp_mul($value, $feePercent), 10000);
            
            // Ensure minimum fee of 0.0001 ETH/BNB (or equivalent)
            $minFee = gmp_init('100000000000000'); // 0.0001 ETH/BNB in wei
            
            if (gmp_cmp($fee, $minFee) < 0) {
                $fee = $minFee;
            }
            
            // Return as string
            return gmp_strval($fee);
        }
    }
    
    $syncFee = calculateSyncFee($buyerPlannedValueWei);
    echo "<p>Calculated sync fee for {$buyerPlannedValueWei} wei: <strong>{$syncFee} wei</strong></p>";
    
    // Convert to ETH for readability
    $syncFeeEth = bcdiv($syncFee, "1000000000000000000", 18);
    echo "<p>Sync fee in ETH: <strong>{$syncFeeEth} ETH</strong></p>";
} catch (Exception $e) {
    echo "<p class='error'>✗ Sync fee calculation test failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Test Web3 PHP library
echo "<div class='section'>
    <h2>4. Web3 PHP Library Test</h2>";

try {
    // Check if the vendor directory exists
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        throw new Exception("Vendor directory not found. Please run 'composer install' to install dependencies.");
    }
    
    // Try to load the Web3 PHP library
    require_once __DIR__ . '/vendor/autoload.php';
    
    // Check if Web3 class exists
    if (!class_exists('Web3\Web3')) {
        throw new Exception("Web3 class not found. The Web3 PHP library may not be installed correctly.");
    }
    
    echo "<p class='success'>✓ Web3 PHP library is available</p>";
} catch (Exception $e) {
    echo "<p class='error'>✗ Web3 PHP library test failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Test attestation generation
echo "<div class='section'>
    <h2>5. Attestation Generation Test</h2>";

try {
    // Check if the private key is set
    $privateKey = $attestation_config['signer_private_key'] ?? null;
    
    if (empty($privateKey) || $privateKey === 'YOUR_PRIVATE_KEY_HERE') {
        echo "<p class='error'>✗ Private key is not set or is using the default placeholder value</p>";
        
        // Check if environment variable is set
        $envPrivateKey = getenv('AGGREGATOR_SIGNER_PK');
        if ($envPrivateKey) {
            echo "<p class='success'>✓ Environment variable AGGREGATOR_SIGNER_PK is set</p>";
        } else {
            echo "<p class='error'>✗ Environment variable AGGREGATOR_SIGNER_PK is not set</p>";
        }
    } else {
        // Don't show the actual private key, just indicate it's set
        echo "<p class='success'>✓ Private key is set in the configuration</p>";
    }
    
    // Check signer address
    $signerAddress = $attestation_config['signer_address'] ?? null;
    if (empty($signerAddress) || $signerAddress === '0xYourSignerAddressHere') {
        echo "<p class='error'>✗ Signer address is not set or is using the default placeholder value</p>";
    } else {
        echo "<p class='success'>✓ Signer address is set: " . htmlspecialchars($signerAddress) . "</p>";
    }
    
    // Check fee recipient
    $feeRecipient = $attestation_config['fee_recipient'] ?? null;
    if (empty($feeRecipient) || $feeRecipient === '0xYourFeeRecipientAddressHere') {
        echo "<p class='error'>✗ Fee recipient is not set or is using the default placeholder value</p>";
    } else {
        echo "<p class='success'>✓ Fee recipient is set: " . htmlspecialchars($feeRecipient) . "</p>";
    }
    
    // Define the generateAttestation function if it doesn't exist
    if (!function_exists('generateAttestation')) {
        function generateAttestation($referrer, $attestedGlobalCount, $deadline, $syncFee) {
            global $attestation_config;
            
            // Get the private key from environment or config
            $privateKey = $attestation_config['signer_private_key'];
            
            if (empty($privateKey)) {
                error_log("Attestation error: Missing signer private key");
                return false;
            }
            
            // Load the Web3 PHP library
            require_once __DIR__ . '/vendor/autoload.php';
            
            try {
                // Create Web3 instance
                $web3 = new Web3\Web3();
                $eth = $web3->eth;
                
                // Prepare the message to sign
                // keccak256(abi.encode(keccak256("BNBRF-REFERRAL-v1"), referrer, attestedGlobalCount, deadline, syncFee))
                $projectId = Web3\Utils::sha3('BNBRF-REFERRAL-v1');
                
                // ABI encode the parameters
                $encoder = new Web3\Contracts\Ethabi();
                $types = ['bytes32', 'address', 'uint256', 'uint256', 'uint256'];
                $values = [$projectId, $referrer, $attestedGlobalCount, $deadline, $syncFee];
                
                $encodedData = $encoder->encodeParameters($types, $values);
                $messageHash = Web3\Utils::sha3($encodedData);
                
                // Sign the message hash using personal_sign format
                $personalMessage = "\x19Ethereum Signed Message:\n32" . $messageHash;
                $personalMessageHash = Web3\Utils::sha3($personalMessage);
                
                // Sign with private key
                $signature = Web3\Account::sign($personalMessageHash, $privateKey);
                
                return $signature;
                
            } catch (Exception $e) {
                error_log("Attestation signing error: " . $e->getMessage());
                return false;
            }
        }
    }
    
    // Try to generate an attestation
    $globalCount = getGlobalReferralCount($referrer);
    $deadline = time() + (15 * 60); // 15 minutes from now
    $syncFee = calculateSyncFee($buyerPlannedValueWei);
    
    echo "<p>Attempting to generate attestation with:</p>";
    echo "<ul>";
    echo "<li>Referrer: " . htmlspecialchars($referrer) . "</li>";
    echo "<li>Global Count: " . htmlspecialchars((string)$globalCount) . "</li>";
    echo "<li>Deadline: " . htmlspecialchars((string)$deadline) . " (" . date('Y-m-d H:i:s', $deadline) . ")</li>";
    echo "<li>Sync Fee: " . htmlspecialchars($syncFee) . " wei</li>";
    echo "</ul>";
    
    $signature = generateAttestation($referrer, $globalCount, $deadline, $syncFee);
    
    if ($signature) {
        echo "<p class='success'>✓ Attestation generated successfully</p>";
        echo "<p>Signature: <code>" . htmlspecialchars($signature) . "</code></p>";
        
        // Create the complete attestation response
        $attestation = [
            'success' => true,
            'referrer' => $referrer,
            'attestedGlobalCount' => $globalCount,
            'deadline' => $deadline,
            'syncFee' => $syncFee,
            'sig' => $signature
        ];
        
        echo "<p>Complete attestation data:</p>";
        echo "<pre>" . htmlspecialchars(json_encode($attestation, JSON_PRETTY_PRINT)) . "</pre>";
    } else {
        echo "<p class='error'>✗ Failed to generate attestation</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Attestation generation test failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

echo "</body>
</html>";
?>