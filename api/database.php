<?php
// database.php - Database connection and helper functions

// Include configuration
require_once 'config.php';

// Function to get connection to the referral database
function getReferralDbConnection() {
    global $referral_db_config;
    
    try {
        $pdo = new PDO(
            "mysql:host={$referral_db_config['host']};dbname={$referral_db_config['dbname']};charset=utf8mb4", 
            $referral_db_config['username'], 
            $referral_db_config['password']
        );
        
        // Set PDO attributes for better error handling
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        
        return $pdo;
    } catch(PDOException $e) {
        // Log the error
        error_log("Referral database connection error: " . $e->getMessage());
        
        // Return false to indicate connection failure
        return false;
    }
}

// Function to get connection to the attestation database
function getAttestationDbConnection() {
    global $attestation_db_config;
    
    try {
        $pdo = new PDO(
            "mysql:host={$attestation_db_config['host']};dbname={$attestation_db_config['dbname']};charset=utf8mb4", 
            $attestation_db_config['username'], 
            $attestation_db_config['password']
        );
        
        // Set PDO attributes for better error handling
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        
        return $pdo;
    } catch(PDOException $e) {
        // Log the error
        error_log("Attestation database connection error: " . $e->getMessage());
        
        // Return false to indicate connection failure
        return false;
    }
}

// For backward compatibility - returns the appropriate connection based on the file that called it
function getDbConnection() {
    $callerFile = debug_backtrace()[0]['file'] ?? '';
    $callerFile = basename($callerFile);
    
    // If the caller is an attestation-related file, return attestation DB connection
    if (in_array($callerFile, ['attest.php', 'webhook.php', 'referral_tiers.php'])) {
        return getAttestationDbConnection();
    }
    
    // Otherwise return referral DB connection (default)
    return getReferralDbConnection();
}

// Function to add a referral code
function addReferralCode($code, $address) {
    $pdo = getDbConnection();
    
    if (!$pdo) {
        return [
            'success' => false,
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to database'
        ];
    }
    
    try {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle existing codes
        $stmt = $pdo->prepare("
            INSERT INTO referral_codes (code, address) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE 
            address = VALUES(address), 
            updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([$code, $address]);
        
        return [
            'success' => true,
            'message' => 'Referral code added successfully',
            'code' => $code,
            'address' => $address
        ];
        
    } catch(PDOException $e) {
        // Log the error
        error_log("Database error in addReferralCode: " . $e->getMessage());
        
        return [
            'success' => false,
            'error' => 'Database error',
            'message' => 'Failed to add referral code'
        ];
    }
}

// Function to get referrer by code
function getReferrerByCode($code) {
    $pdo = getDbConnection();
    
    if (!$pdo) {
        return [
            'success' => false,
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to database'
        ];
    }
    
    try {
        $stmt = $pdo->prepare("SELECT address, created_at FROM referral_codes WHERE code = ?");
        $stmt->execute([$code]);
        $result = $stmt->fetch();
        
        if ($result) {
            return [
                'success' => true,
                'address' => $result['address'],
                'created_at' => $result['created_at']
            ];
        } else {
            return [
                'success' => true,
                'address' => null,
                'message' => 'Referral code not found'
            ];
        }
        
    } catch(PDOException $e) {
        // Log the error
        error_log("Database error in getReferrerByCode: " . $e->getMessage());
        
        return [
            'success' => false,
            'error' => 'Database error',
            'message' => 'Failed to retrieve referral code'
        ];
    }
}

// Function to get code by address
function getCodeByAddress($address) {
    $pdo = getDbConnection();
    
    if (!$pdo) {
        return [
            'success' => false,
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to database'
        ];
    }
    
    try {
        $stmt = $pdo->prepare("SELECT code, created_at FROM referral_codes WHERE address = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$address]);
        $result = $stmt->fetch();
        
        if ($result) {
            return [
                'success' => true,
                'code' => $result['code'],
                'created_at' => $result['created_at']
            ];
        } else {
            return [
                'success' => true,
                'code' => null,
                'message' => 'No referral code found for this address'
            ];
        }
        
    } catch(PDOException $e) {
        // Log the error
        error_log("Database error in getCodeByAddress: " . $e->getMessage());
        
        return [
            'success' => false,
            'error' => 'Database error',
            'message' => 'Failed to retrieve referral code'
        ];
    }
}
?>