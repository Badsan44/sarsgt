# Comprehensive Attestation System Deployment Guide

This guide provides detailed, step-by-step instructions for deploying the cross-chain referral attestation system on your Hostinger server. The attestation system enables users to maintain their referral tier benefits across multiple blockchains.

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Private Key Generation](#private-key-generation)
4. [Database Setup](#database-setup)
5. [PHP Dependencies Installation](#php-dependencies-installation)
6. [API Files Configuration](#api-files-configuration)
7. [Smart Contract Configuration](#smart-contract-configuration)
8. [Frontend Integration](#frontend-integration)
9. [Testing and Verification](#testing-and-verification)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)
11. [Troubleshooting](#troubleshooting)
12. [Security Best Practices](#security-best-practices)

## System Overview

The attestation system consists of:

- **Backend API**: Generates cryptographically signed attestations of global referral counts
- **Database**: Tracks referral counts across multiple blockchains
- **Smart Contract Integration**: Verifies attestations on-chain
- **Frontend Integration**: Requests attestations during purchases

This system allows users who have made referrals on one blockchain to receive appropriate tier benefits when making purchases on another blockchain.

## Prerequisites

Before starting, ensure you have:

- Access to your Hostinger cPanel
- SSH access to your Hostinger server (optional but helpful)
- Admin access to your smart contracts
- A secure environment for generating cryptographic keys

## Private Key Generation

The attestation system requires a private key for signing messages. This key must be generated securely and kept confidential.

### Option 1: Using MetaMask (Recommended)

1. Install the MetaMask browser extension
2. Create a new account specifically for attestation signing:
   - Click your account icon → Create Account → "Attestation Signer"
3. Export the private key:
   - Click the three dots next to the new account → Account details
   - Click "Export Private Key" and enter your password
4. Copy both the private key and the account address (public key)
5. Store the private key securely (password manager recommended)

### Option 2: Using Command Line

```bash
# Install Node.js and ethers.js
npm install -g ethers

# Create and run a key generation script
cat > generate-key.js << 'EOF'
const ethers = require("ethers");
const wallet = ethers.Wallet.createRandom();
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
EOF

node generate-key.js

# Delete the script after use
rm generate-key.js
```

### Option 3: Using Hardware Wallet

If you have a hardware wallet (Ledger, Trezor, etc.):
1. Create a new account on your device
2. Export the private key following your wallet's documentation
3. Use this key for the attestation service

**CRITICAL SECURITY NOTE**: Never share this private key or store it in plain text. This key has the power to sign attestations that directly affect your smart contract's behavior.

## Database Setup

### 1. Access phpMyAdmin

1. Log into your Hostinger cPanel
2. Click on "MySQL Databases" or "phpMyAdmin"
3. Select your existing database (the same one used for your referral system)

### 2. Create Required Tables

1. Click on the "SQL" tab
2. Copy and paste the following SQL:

```sql
-- Global referral counts table
CREATE TABLE IF NOT EXISTS global_referral_counts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    referral_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (referrer_address)
);

-- Referral purchases table for tracking all purchases
CREATE TABLE IF NOT EXISTS referral_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    buyer_address VARCHAR(42) NOT NULL,
    chain_id VARCHAR(20) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    usd_amount DECIMAL(18,6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (chain_id, tx_hash)
);

-- Attestation logs table for debugging and auditing
CREATE TABLE IF NOT EXISTS attestation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    attested_count INT NOT NULL,
    deadline BIGINT NOT NULL,
    sync_fee VARCHAR(78) NOT NULL,
    signature TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX idx_referrer_address ON global_referral_counts(referrer_address);
CREATE INDEX idx_referrer_address_purchases ON referral_purchases(referrer_address);
CREATE INDEX idx_buyer_address ON referral_purchases(buyer_address);
CREATE INDEX idx_chain_tx ON referral_purchases(chain_id, tx_hash);
```

3. Click "Go" to execute the SQL
4. Verify the tables were created by checking the left sidebar

## PHP Dependencies Installation

The attestation system requires the Web3 PHP library for cryptographic operations.

### 1. Install Composer

If Composer is not already installed on your Hostinger server:

1. Access your server via SSH or Terminal in cPanel:
   ```bash
   ssh u599161029@156.67.74.51
   # Replace with your actual username and server
   ```

2. Navigate to your website's root directory:
   ```bash
   cd ~/public_html
   ```

3. Download and install Composer:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   mv composer.phar composer
   chmod +x composer
   ```

### 2. Install Web3 PHP Library

1. Navigate to your API directory:
   ```bash
   cd ~/public_html/api
   ```

2. Create a composer.json file:
   ```bash
   cat > composer.json << 'EOF'
   {
       "require": {
           "web3p/web3.php": "^0.1.6"
       }
   }
   EOF
   ```

3. Install the dependencies:
   ```bash
   php ../composer install
   ```

4. Verify the installation:
   ```bash
   ls -la vendor/web3p
   ```

## API Files Configuration

### 1. Upload API Files

If you're using File Manager in cPanel:

1. Navigate to your API directory (usually `/public_html/api`)
2. Click "Upload" and select these files from your repository:
   - `attest.php`
   - `webhook.php`
   - `referral_tiers.php`
3. Set file permissions to 644:
   - Select all uploaded files
   - Click "Permissions"
   - Set numeric value to 644
   - Click "Change Permissions"

If you're using SSH:

```bash
cd ~/public_html/api
chmod 644 attest.php webhook.php referral_tiers.php
```

### 2. Configure Environment Variables

1. Create or edit the `.htaccess` file in your API directory:

```
# Add to existing .htaccess file or create new one
<IfModule mod_env.c>
    # Private key for attestation signing (KEEP THIS SECURE!)
    SetEnv AGGREGATOR_SIGNER_PK your_private_key_here
</IfModule>
```

Replace `your_private_key_here` with the actual private key you generated earlier.

### 3. Update config.php

Add the attestation configuration to your existing `config.php` file:

```php
// Attestation Service Configuration
$attestation_config = [
    // Private key for signing attestations (from environment variable)
    'signer_private_key' => getenv('AGGREGATOR_SIGNER_PK') ?: 'YOUR_PRIVATE_KEY_HERE',
    
    // The corresponding public address (must match what's set in the contract)
    'signer_address' => '0xYourPublicAddressHere', // Replace with your actual address
    
    // Fee recipient address (where sync fees will be sent)
    'fee_recipient' => '0xYourFeeRecipientAddressHere', // Can be the same as signer_address
    
    // Maximum sync fee in basis points (300 = 3%)
    'max_sync_fee_bps' => 300,
    
    // Default sync fee in basis points (50 = 0.5%)
    'default_sync_fee_bps' => 50,
];

// Add webhook secret to security_config if not already present
$security_config['webhook_secret'] = 'YourStrongRandomSecretHere'; // Generate a random string
```

Replace the placeholder values with your actual addresses and a strong random secret.

## Smart Contract Configuration

You need to configure your smart contracts to work with the attestation service. This is done through your contract management interface.

### 1. Set Aggregator Signer

Call the `setAggregatorSigner` function on your contracts with the public address from your key generation:

```javascript
// Using web3.js
const tx = await contract.methods.setAggregatorSigner("0xYourPublicAddressHere").send({from: ownerAddress});

// Using ethers.js
const tx = await contract.setAggregatorSigner("0xYourPublicAddressHere");
await tx.wait();
```

### 2. Set Fee Recipient

Call the `setStampFeeRecipient` function:

```javascript
// Using web3.js
const tx = await contract.methods.setStampFeeRecipient("0xYourFeeRecipientAddressHere").send({from: ownerAddress});

// Using ethers.js
const tx = await contract.setStampFeeRecipient("0xYourFeeRecipientAddressHere");
await tx.wait();
```

### 3. Set Maximum Sync Fee (Optional)

If needed, adjust the maximum sync fee:

```javascript
// Using web3.js
const tx = await contract.methods.setMaxSyncFeeBps(300).send({from: ownerAddress}); // 3%

// Using ethers.js
const tx = await contract.setMaxSyncFeeBps(300); // 3%
await tx.wait();
```

### 4. Verify Contract Configuration

After setting these parameters, verify they are correctly set:

```javascript
// Using web3.js
const signer = await contract.methods.aggregatorSigner().call();
const recipient = await contract.methods.stampFeeRecipient().call();
const maxFee = await contract.methods.maxSyncFeeBps().call();

console.log("Aggregator Signer:", signer);
console.log("Fee Recipient:", recipient);
console.log("Max Sync Fee (bps):", maxFee);

// Using ethers.js
const signer = await contract.aggregatorSigner();
const recipient = await contract.stampFeeRecipient();
const maxFee = await contract.maxSyncFeeBps();

console.log("Aggregator Signer:", signer);
console.log("Fee Recipient:", recipient);
console.log("Max Sync Fee (bps):", maxFee);
```

## Frontend Integration

### 1. Update API Base URL

Edit `src/services/attestationService.js` to point to your actual API endpoint:

```javascript
// src/services/attestationService.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://yourdomain.com/api';
```

### 2. Set Environment Variable in Frontend Build

When building your frontend, set the API base URL:

```bash
REACT_APP_API_BASE_URL=https://yourdomain.com/api npm run build
```

### 3. Deploy Updated Frontend

Upload the built files to your Hostinger server.

## Testing and Verification

### 1. Create Test Scripts

Create a file named `test_attestation.php` in your API directory:

```php
<?php
// Test script for attestation service
header('Content-Type: text/html; charset=utf-8');

// Function to make a test request
function testAttestation($referrer, $buyerPlannedValueWei, $chainId) {
    // Create request payload
    $payload = json_encode([
        'referrer' => $referrer,
        'buyerPlannedValueWei' => $buyerPlannedValueWei,
        'chainId' => $chainId
    ]);

    // Set up cURL request to the attestation service
    $ch = curl_init('http://' . $_SERVER['HTTP_HOST'] . '/api/attest.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);

    // Execute the request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [
        'http_code' => $httpCode,
        'response' => $response ? json_decode($response, true) : null,
        'error' => $error
    ];
}

// Test parameters
$referrer = "0x123456789abcdef123456789abcdef123456789a"; // Example address
$buyerPlannedValueWei = "1000000000000000000"; // 1 ETH in wei
$chainId = "1"; // Ethereum mainnet

// Run the test
$result = testAttestation($referrer, $buyerPlannedValueWei, $chainId);

// Display results
echo "<!DOCTYPE html>
<html>
<head>
    <title>Attestation Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Attestation Service Test</h1>
    
    <h2>Request</h2>
    <pre>" . htmlspecialchars(json_encode([
        'referrer' => $referrer,
        'buyerPlannedValueWei' => $buyerPlannedValueWei,
        'chainId' => $chainId
    ], JSON_PRETTY_PRINT)) . "</pre>
    
    <h2>Response</h2>
    <p>HTTP Status Code: <strong>" . $result['http_code'] . "</strong></p>";

if ($result['error']) {
    echo "<p class='error'>Error: " . htmlspecialchars($result['error']) . "</p>";
} elseif ($result['http_code'] == 200 && isset($result['response']['success']) && $result['response']['success']) {
    echo "<p class='success'>Success! Attestation generated correctly.</p>";
    echo "<pre>" . htmlspecialchars(json_encode($result['response'], JSON_PRETTY_PRINT)) . "</pre>";
    
    // Verify signature is present
    if (isset($result['response']['sig']) && !empty($result['response']['sig'])) {
        echo "<p class='success'>✓ Signature is present</p>";
    } else {
        echo "<p class='error'>✗ Signature is missing</p>";
    }
} else {
    echo "<p class='error'>Failed to generate attestation.</p>";
    echo "<pre>" . htmlspecialchars(json_encode($result['response'], JSON_PRETTY_PRINT)) . "</pre>";
}

echo "</body>
</html>";
?>
```

### 2. Test Database Connection

Create a file named `test_db.php`:

```php
<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'config.php';
require_once 'database.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>Database Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Database Connection Test</h1>";

$pdo = getDbConnection();

if ($pdo) {
    echo "<p class='success'>✓ Database connection successful!</p>";
    
    // Test tables
    $tables = ['global_referral_counts', 'referral_purchases', 'attestation_logs'];
    
    echo "<h2>Table Status</h2>
    <table>
        <tr>
            <th>Table</th>
            <th>Status</th>
            <th>Record Count</th>
        </tr>";
    
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
            $count = $stmt->fetchColumn();
            echo "<tr>
                <td>$table</td>
                <td class='success'>Exists</td>
                <td>$count</td>
            </tr>";
        } catch (PDOException $e) {
            echo "<tr>
                <td>$table</td>
                <td class='error'>Error: " . htmlspecialchars($e->getMessage()) . "</td>
                <td>N/A</td>
            </tr>";
        }
    }
    
    echo "</table>";
} else {
    echo "<p class='error'>✗ Database connection failed!</p>
    <p>Please check your database configuration in config.php</p>";
}

echo "</body>
</html>";
?>
```

### 3. Verify Web3 PHP Installation

Create a file named `test_web3.php`:

```php
<?php
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>
<html>
<head>
    <title>Web3 PHP Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
    </style>
</head>
<body>
    <h1>Web3 PHP Library Test</h1>";

try {
    require_once 'vendor/autoload.php';
    
    if (class_exists('Web3\Web3')) {
        echo "<p class='success'>✓ Web3 PHP library is installed correctly!</p>";
        
        // Test basic functionality
        $web3 = new Web3\Web3();
        $utils = $web3->utils;
        
        // Test SHA3
        $hash = $utils->sha3('test');
        echo "<h2>SHA3 Test</h2>";
        echo "<p>Input: 'test'</p>";
        echo "<p>Output: $hash</p>";
        
        // Test address checksum
        $address = '0x123456789abcdef123456789abcdef123456789a';
        $checksumAddress = $utils->toChecksumAddress($address);
        echo "<h2>Address Checksum Test</h2>";
        echo "<p>Input: $address</p>";
        echo "<p>Output: $checksumAddress</p>";
        
    } else {
        echo "<p class='error'>✗ Web3 PHP library class not found!</p>";
        echo "<p>Please check your Composer installation and vendor directory.</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Error loading Web3 PHP library: " . htmlspecialchars($e->getMessage()) . "</p>";
    
    // Check if vendor directory exists
    if (!is_dir('vendor')) {
        echo "<p>Vendor directory not found. Please run Composer install:</p>";
        echo "<pre>cd " . htmlspecialchars(dirname($_SERVER['SCRIPT_FILENAME'])) . "\nphp ../composer install</pre>";
    }
}

echo "</body>
</html>";
?>
```

### 4. Access Test Scripts

Access these test scripts in your browser:
- `https://yourdomain.com/api/test_attestation.php`
- `https://yourdomain.com/api/test_db.php`
- `https://yourdomain.com/api/test_web3.php`

Verify that all tests pass successfully.

## Monitoring and Maintenance

### 1. Create a Log Viewer

Create a file named `view_logs.php` in your API directory:

```php
<?php
// Simple log viewer with basic authentication
// IMPORTANT: Set a strong username and password!
$username = "admin";
$password = "YourStrongPasswordHere"; // Change this!

// Basic authentication
if (!isset($_SERVER['PHP_AUTH_USER']) || 
    $_SERVER['PHP_AUTH_USER'] != $username || 
    $_SERVER['PHP_AUTH_PW'] != $password) {
    header('WWW-Authenticate: Basic realm="Attestation Logs"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Authentication required';
    exit;
}

// Set content type
header('Content-Type: text/html; charset=utf-8');

// Database connection
require_once 'config.php';
require_once 'database.php';

$pdo = getDbConnection();

if (!$pdo) {
    die("Database connection failed");
}

// Get log type from query parameter
$logType = isset($_GET['type']) ? $_GET['type'] : 'attestation';
$validTypes = ['attestation', 'referral'];

if (!in_array($logType, $validTypes)) {
    $logType = 'attestation';
}

// Get page from query parameter
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$perPage = 50;
$offset = ($page - 1) * $perPage;

// Get the logs based on type
if ($logType === 'attestation') {
    $countStmt = $pdo->query("SELECT COUNT(*) FROM attestation_logs");
    $totalLogs = $countStmt->fetchColumn();
    
    $stmt = $pdo->prepare("
        SELECT * FROM attestation_logs 
        ORDER BY created_at DESC 
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $logs = $stmt->fetchAll();
} else {
    $countStmt = $pdo->query("SELECT COUNT(*) FROM referral_purchases");
    $totalLogs = $countStmt->fetchColumn();
    
    $stmt = $pdo->prepare("
        SELECT * FROM referral_purchases 
        ORDER BY created_at DESC 
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $logs = $stmt->fetchAll();
}

$totalPages = ceil($totalLogs / $perPage);

// Display logs
echo "<!DOCTYPE html>
<html>
<head>
    <title>Attestation System Logs</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .pagination { margin-top: 20px; }
        .pagination a, .pagination span { 
            padding: 8px 16px; 
            text-decoration: none;
            border: 1px solid #ddd;
            margin: 0 4px;
        }
        .pagination a:hover { background-color: #f2f2f2; }
        .pagination .active { 
            background-color: #4CAF50;
            color: white;
            border: 1px solid #4CAF50;
        }
        .tab {
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            margin-bottom: 20px;
        }
        .tab button {
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
        }
        .tab button:hover {
            background-color: #ddd;
        }
        .tab button.active {
            background-color: #ccc;
        }
    </style>
</head>
<body>
    <h1>Attestation System Logs</h1>
    
    <div class='tab'>
        <button class='" . ($logType === 'attestation' ? 'active' : '') . "' onclick=\"window.location='?type=attestation'\">Attestation Logs</button>
        <button class='" . ($logType === 'referral' ? 'active' : '') . "' onclick=\"window.location='?type=referral'\">Referral Purchase Logs</button>
    </div>";

if ($logType === 'attestation') {
    echo "<h2>Attestation Logs</h2>
    <p>Showing " . count($logs) . " of $totalLogs logs</p>
    <table>
        <tr>
            <th>ID</th>
            <th>Referrer</th>
            <th>Count</th>
            <th>Deadline</th>
            <th>Sync Fee</th>
            <th>IP</th>
            <th>Created At</th>
        </tr>";

    foreach ($logs as $log) {
        echo "<tr>
            <td>{$log['id']}</td>
            <td>{$log['referrer_address']}</td>
            <td>{$log['attested_count']}</td>
            <td>" . date('Y-m-d H:i:s', $log['deadline']) . "</td>
            <td>{$log['sync_fee']}</td>
            <td>{$log['ip_address']}</td>
            <td>{$log['created_at']}</td>
        </tr>";
    }
} else {
    echo "<h2>Referral Purchase Logs</h2>
    <p>Showing " . count($logs) . " of $totalLogs logs</p>
    <table>
        <tr>
            <th>ID</th>
            <th>Referrer</th>
            <th>Buyer</th>
            <th>Chain ID</th>
            <th>TX Hash</th>
            <th>USD Amount</th>
            <th>Created At</th>
        </tr>";

    foreach ($logs as $log) {
        echo "<tr>
            <td>{$log['id']}</td>
            <td>{$log['referrer_address']}</td>
            <td>{$log['buyer_address']}</td>
            <td>{$log['chain_id']}</td>
            <td>{$log['tx_hash']}</td>
            <td>{$log['usd_amount']}</td>
            <td>{$log['created_at']}</td>
        </tr>";
    }
}

echo "</table>

<div class='pagination'>";

// Pagination links
if ($totalPages > 1) {
    if ($page > 1) {
        echo "<a href='?type=$logType&page=1'>First</a>";
        echo "<a href='?type=$logType&page=" . ($page - 1) . "'>Previous</a>";
    }
    
    $startPage = max(1, $page - 2);
    $endPage = min($totalPages, $page + 2);
    
    for ($i = $startPage; $i <= $endPage; $i++) {
        if ($i == $page) {
            echo "<span class='active'>$i</span>";
        } else {
            echo "<a href='?type=$logType&page=$i'>$i</a>";
        }
    }
    
    if ($page < $totalPages) {
        echo "<a href='?type=$logType&page=" . ($page + 1) . "'>Next</a>";
        echo "<a href='?type=$logType&page=$totalPages'>Last</a>";
    }
}

echo "</div>

</body>
</html>";
?>
```

### 2. Set Up Regular Database Backups

Create a backup script named `backup_db.php`:

```php
<?php
// This script should be run via cron job, not directly accessed
// Check if it's being run from CLI
if (php_sapi_name() !== 'cli') {
    header('HTTP/1.0 403 Forbidden');
    exit('This script can only be run from the command line');
}

// Include database config
require_once dirname(__FILE__) . '/config.php';

// Backup directory
$backupDir = dirname(__FILE__) . '/../backups';

// Create backup directory if it doesn't exist
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Generate backup filename with date
$date = date('Y-m-d_H-i-s');
$backupFile = $backupDir . "/attestation_db_backup_$date.sql";

// Build mysqldump command
$command = sprintf(
    'mysqldump -h %s -u %s -p%s %s global_referral_counts referral_purchases attestation_logs > %s',
    escapeshellarg($db_config['host']),
    escapeshellarg($db_config['username']),
    escapeshellarg($db_config['password']),
    escapeshellarg($db_config['dbname']),
    escapeshellarg($backupFile)
);

// Execute backup
system($command, $returnValue);

// Check if backup was successful
if ($returnValue === 0) {
    echo "Backup created successfully: $backupFile\n";
    
    // Compress the backup
    system("gzip $backupFile");
    echo "Backup compressed: $backupFile.gz\n";
    
    // Delete backups older than 30 days
    $oldBackups = glob("$backupDir/attestation_db_backup_*.sql.gz");
    $now = time();
    
    foreach ($oldBackups as $file) {
        if (is_file($file)) {
            if ($now - filemtime($file) >= 30 * 24 * 60 * 60) { // 30 days
                unlink($file);
                echo "Deleted old backup: $file\n";
            }
        }
    }
} else {
    echo "Backup failed with error code: $returnValue\n";
}
?>
```

Set up a cron job to run this script daily:

```bash
0 2 * * * php /home/username/public_html/api/backup_db.php
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Web3 PHP Library Not Found

**Symptoms**: Error messages about missing Web3 classes

**Solution**:
```bash
cd ~/public_html/api
php ../composer require web3p/web3.php
```

#### 2. Database Connection Failures

**Symptoms**: Error messages about database connection

**Solution**:
1. Verify database credentials in `config.php`
2. Check database server status
3. Ensure the database user has proper permissions

#### 3. Invalid Signatures

**Symptoms**: Smart contract rejects attestations with "invalid signature" errors

**Solutions**:
1. Verify the private key and public address match
2. Ensure the correct signer address is set in the smart contract
3. Check the Web3 PHP library is working correctly

#### 4. CORS Issues

**Symptoms**: Frontend cannot connect to attestation API

**Solution**:
Add proper CORS headers to your `.htaccess` file:

```
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://yourdomain.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Api-Key"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
```

## Security Best Practices

### 1. Private Key Protection

- **Never** store the private key in your code or config files
- Use environment variables or secure key management
- Consider using a hardware security module (HSM) for production
- Rotate the key periodically (requires updating the contract)

### 2. Access Control

- Protect monitoring scripts with strong authentication
- Use IP restrictions for sensitive endpoints
- Implement proper rate limiting

### 3. Regular Audits

- Monitor attestation logs for unusual patterns
- Regularly check for unauthorized access attempts
- Verify smart contract parameters haven't been changed

### 4. Secure Communications

- Always use HTTPS for all API endpoints
- Keep your SSL certificates up to date
- Implement proper Content Security Policy headers

### 5. Data Protection

- Regularly back up your database
- Encrypt sensitive data at rest
- Implement proper error handling to avoid information leakage

## Conclusion

By following this comprehensive guide, you should have a fully functional attestation system integrated with your Hostinger server. This system enables cross-chain referral tier synchronization, enhancing your referral program's capabilities.

Remember to keep your private key secure and regularly monitor the system for any issues. The troubleshooting scripts will help identify and resolve problems quickly.

For any questions or additional support, please refer to the API documentation or contact the development team.