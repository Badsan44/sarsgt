<?php
header('Content-Type: text/html; charset=utf-8');
require_once __DIR__ . '/config.php';

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Environment Variable Check</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
    </style>
</head>
<body>
<h1>Environment Variable Check</h1>";

// Check if the private key environment variable is set
$envPrivateKey = getenv('AGGREGATOR_SIGNER_PK');
$configPrivateKey = $attestation_config['signer_private_key'] ?? null;

echo "<h2>Private Key Configuration</h2>";

if ($envPrivateKey) {
    echo "<p class='success'>✓ AGGREGATOR_SIGNER_PK environment variable is set</p>";
    // Don't display the actual private key for security reasons
    echo "<p>Environment variable value: <code>[HIDDEN FOR SECURITY]</code></p>";
} else {
    echo "<p class='error'>✗ AGGREGATOR_SIGNER_PK environment variable is not set</p>";
    echo "<p>You need to set this in your .htaccess file:</p>";
    echo "<pre>&lt;IfModule mod_env.c&gt;
    SetEnv AGGREGATOR_SIGNER_PK your_private_key_here
&lt;/IfModule&gt;</pre>";
}

if ($configPrivateKey) {
    if ($configPrivateKey === 'YOUR_PRIVATE_KEY_HERE') {
        echo "<p class='error'>✗ Private key in config.php is set to the default placeholder value</p>";
    } else {
        echo "<p class='success'>✓ Private key is set in config.php</p>";
        echo "<p>Config value: <code>[HIDDEN FOR SECURITY]</code></p>";
    }
} else {
    echo "<p class='error'>✗ Private key is not set in config.php</p>";
}

// Check if the config is using the environment variable
if (strpos($attestation_config['signer_private_key'], 'getenv') !== false) {
    echo "<p class='success'>✓ config.php is configured to use the environment variable</p>";
} else {
    echo "<p class='warning'>⚠ config.php is not using the environment variable directly</p>";
}

// Check signer address
echo "<h2>Signer Address Configuration</h2>";
$signerAddress = $attestation_config['signer_address'] ?? null;

if ($signerAddress) {
    if ($signerAddress === '0xYourSignerAddressHere') {
        echo "<p class='error'>✗ Signer address in config.php is set to the default placeholder value</p>";
    } else {
        echo "<p class='success'>✓ Signer address is set in config.php: <code>" . htmlspecialchars($signerAddress) . "</code></p>";
    }
} else {
    echo "<p class='error'>✗ Signer address is not set in config.php</p>";
}

// Check fee recipient
echo "<h2>Fee Recipient Configuration</h2>";
$feeRecipient = $attestation_config['fee_recipient'] ?? null;

if ($feeRecipient) {
    if ($feeRecipient === '0xYourFeeRecipientAddressHere') {
        echo "<p class='error'>✗ Fee recipient in config.php is set to the default placeholder value</p>";
    } else {
        echo "<p class='success'>✓ Fee recipient is set in config.php: <code>" . htmlspecialchars($feeRecipient) . "</code></p>";
    }
} else {
    echo "<p class='error'>✗ Fee recipient is not set in config.php</p>";
}

// Check sync fee configuration
echo "<h2>Sync Fee Configuration</h2>";
$maxSyncFeeBps = $attestation_config['max_sync_fee_bps'] ?? null;
$defaultSyncFeeBps = $attestation_config['default_sync_fee_bps'] ?? null;

if ($maxSyncFeeBps !== null) {
    echo "<p class='success'>✓ Maximum sync fee is set: <code>" . htmlspecialchars((string)$maxSyncFeeBps) . " bps</code> (" . ($maxSyncFeeBps / 100) . "%)</p>";
} else {
    echo "<p class='error'>✗ Maximum sync fee is not set in config.php</p>";
}

if ($defaultSyncFeeBps !== null) {
    echo "<p class='success'>✓ Default sync fee is set: <code>" . htmlspecialchars((string)$defaultSyncFeeBps) . " bps</code> (" . ($defaultSyncFeeBps / 100) . "%)</p>";
} else {
    echo "<p class='error'>✗ Default sync fee is not set in config.php</p>";
}

// Check .htaccess file
echo "<h2>.htaccess File Check</h2>";
$htaccessPath = __DIR__ . '/.htaccess';

if (file_exists($htaccessPath)) {
    echo "<p class='success'>✓ .htaccess file exists</p>";
    
    // Try to read the file
    if (is_readable($htaccessPath)) {
        $htaccessContent = file_get_contents($htaccessPath);
        echo "<p>Contents of .htaccess file:</p>";
        echo "<pre>" . htmlspecialchars($htaccessContent) . "</pre>";
        
        // Check if it contains the environment variable
        if (strpos($htaccessContent, 'AGGREGATOR_SIGNER_PK') !== false) {
            echo "<p class='success'>✓ .htaccess file contains AGGREGATOR_SIGNER_PK setting</p>";
        } else {
            echo "<p class='error'>✗ .htaccess file does not contain AGGREGATOR_SIGNER_PK setting</p>";
        }
    } else {
        echo "<p class='error'>✗ Cannot read .htaccess file (permission denied)</p>";
    }
} else {
    echo "<p class='error'>✗ .htaccess file does not exist</p>";
    echo "<p>You need to create a .htaccess file with the following content:</p>";
    echo "<pre>&lt;IfModule mod_env.c&gt;
    SetEnv AGGREGATOR_SIGNER_PK your_private_key_here
&lt;/IfModule&gt;</pre>";
}

echo "</body>
</html>";
?>