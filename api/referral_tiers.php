<?php
// api/referral_tiers.php - Global Referral Tier Tracking

// Include database connection
require_once 'database.php';

/**
 * Get the global referral count for a referrer across all chains
 * 
 * @param string $referrer The referrer address
 * @param PDO $pdo Optional PDO connection to use
 * @return int The global referral count
 */
function getGlobalReferralCount($referrer, $pdo = null) {
    // If no PDO connection is provided, explicitly use the attestation database
    if (!$pdo) {
        $pdo = getAttestationDbConnection();
        
        if (!$pdo) {
            // Log error and return 0 as fallback
            error_log("Attestation database connection failed in getGlobalReferralCount");
            return 0;
        }
    }
    
    try {
        // Check if we have a record for this referrer
        $stmt = $pdo->prepare("SELECT referral_count FROM global_referral_counts WHERE referrer_address = ?");
        $stmt->execute([$referrer]);
        $result = $stmt->fetch();
        
        if ($result) {
            return (int)$result['referral_count'];
        } else {
            // No record found, create one with count 0
            $stmt = $pdo->prepare("INSERT INTO global_referral_counts (referrer_address, referral_count) VALUES (?, 0)");
            $stmt->execute([$referrer]);
            return 0;
        }
    } catch(PDOException $e) {
        // Log the error
        error_log("Database error in getGlobalReferralCount: " . $e->getMessage());
        return 0;
    }
}

/**
 * Update the global referral count for a referrer
 * 
 * @param string $referrer The referrer address
 * @param int $newCount The new global count
 * @param PDO $pdo Optional PDO connection to use
 * @return bool Success status
 */
function updateGlobalReferralCount($referrer, $newCount, $pdo = null) {
    // If no PDO connection is provided, explicitly use the attestation database
    if (!$pdo) {
        $pdo = getAttestationDbConnection();
        
        if (!$pdo) {
            error_log("Attestation database connection failed in updateGlobalReferralCount");
            return false;
        }
    }
    
    try {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both insert and update
        $stmt = $pdo->prepare("
            INSERT INTO global_referral_counts (referrer_address, referral_count, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP) 
            ON DUPLICATE KEY UPDATE 
            referral_count = VALUES(referral_count),
            updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([$referrer, $newCount]);
        return true;
    } catch(PDOException $e) {
        error_log("Database error in updateGlobalReferralCount: " . $e->getMessage());
        return false;
    }
}

/**
 * Increment the global referral count for a referrer
 * 
 * @param string $referrer The referrer address
 * @param PDO $pdo Optional PDO connection to use
 * @return int|false The new count or false on failure
 */
function incrementGlobalReferralCount($referrer, $pdo = null) {
    // If no PDO connection is provided, explicitly use the attestation database
    if (!$pdo) {
        $pdo = getAttestationDbConnection();
        
        if (!$pdo) {
            error_log("Attestation database connection failed in incrementGlobalReferralCount");
            return false;
        }
    }
    
    try {
        // Start a transaction
        $pdo->beginTransaction();
        
        // Get current count
        $stmt = $pdo->prepare("SELECT referral_count FROM global_referral_counts WHERE referrer_address = ? FOR UPDATE");
        $stmt->execute([$referrer]);
        $result = $stmt->fetch();
        
        if ($result) {
            // Increment existing count
            $newCount = $result['referral_count'] + 1;
            $stmt = $pdo->prepare("
                UPDATE global_referral_counts 
                SET referral_count = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE referrer_address = ?
            ");
            $stmt->execute([$newCount, $referrer]);
        } else {
            // Create new record with count 1
            $newCount = 1;
            $stmt = $pdo->prepare("
                INSERT INTO global_referral_counts (referrer_address, referral_count) 
                VALUES (?, ?)
            ");
            $stmt->execute([$referrer, $newCount]);
        }
        
        // Commit the transaction
        $pdo->commit();
        
        return $newCount;
    } catch(PDOException $e) {
        // Rollback on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        error_log("Database error in incrementGlobalReferralCount: " . $e->getMessage());
        return false;
    }
}

/**
 * Record a successful referral purchase
 * 
 * @param string $referrer The referrer address
 * @param string $buyer The buyer address
 * @param string $chainId The chain ID where the purchase occurred
 * @param string $txHash The transaction hash
 * @param float $usdAmount The USD amount of the purchase
 * @param PDO $pdo Optional PDO connection to use
 * @return bool Success status
 */
function recordReferralPurchase($referrer, $buyer, $chainId, $txHash, $usdAmount, $pdo = null) {
    // If no PDO connection is provided, explicitly use the attestation database
    if (!$pdo) {
        $pdo = getAttestationDbConnection();
        
        if (!$pdo) {
            error_log("Attestation database connection failed in recordReferralPurchase");
            return false;
        }
    }
    
    try {
        // Start a transaction
        $pdo->beginTransaction();
        
        // Record the purchase
        $stmt = $pdo->prepare("
            INSERT INTO referral_purchases (
                referrer_address, 
                buyer_address, 
                chain_id, 
                tx_hash, 
                usd_amount
            ) VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$referrer, $buyer, $chainId, $txHash, $usdAmount]);
        
        // Increment the global count
        $newCount = incrementGlobalReferralCount($referrer);
        
        if ($newCount === false) {
            // Roll back if increment failed
            $pdo->rollBack();
            return false;
        }
        
        // Commit the transaction
        $pdo->commit();
        
        return true;
    } catch(PDOException $e) {
        // Rollback on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        error_log("Database error in recordReferralPurchase: " . $e->getMessage());
        return false;
    }
}

/**
 * Get the tier level based on referral count
 * 
 * @param int $count The referral count
 * @return int The tier level (1-8)
 */
function getTierLevel($count) {
    // Tier thresholds matching the contract
    $tiers = [930, 430, 180, 80, 40, 15, 5, 0];
    
    for ($i = 0; $i < count($tiers); $i++) {
        if ($count >= $tiers[$i]) {
            return count($tiers) - $i; // 8..1
        }
    }
    
    return 1; // Default to tier 1
}

/**
 * Get the bonus percentage based on referral count
 * 
 * @param int $count The referral count
 * @return int The bonus percentage
 */
function getBonusPercentage($count) {
    // Bonus percentages matching the contract
    $bonuses = [70, 50, 40, 30, 25, 20, 15, 10];
    $tiers = [930, 430, 180, 80, 40, 15, 5, 0];
    
    for ($i = 0; $i < count($tiers); $i++) {
        if ($count >= $tiers[$i]) {
            return $bonuses[$i];
        }
    }
    
    return 10; // Default to 10%
}
?>