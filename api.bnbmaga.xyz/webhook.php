<?php
// api/webhook.php - Webhook for receiving transaction events
// This endpoint receives transaction events from both chains and updates the global referral counts

// Start session for CSRF protection
session_start();

// Set secure headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src \'self\'');

// Include security and database helpers
require_once 'security.php';
require_once 'database.php';
require_once 'referral_tiers.php';

// Handle CORS with restricted origins
handleCORS();

// Apply rate limiting
checkRateLimit();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    logApiAccess('webhook_method_not_allowed', false, "Method: {$_SERVER['REQUEST_METHOD']}");
    exit;
}

// Validate webhook secret
$headers = getallheaders();
$webhookSecret = $headers['X-Webhook-Secret'] ?? '';

if (!validateWebhookSecret($webhookSecret)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized'
    ]);
    logApiAccess('webhook_unauthorized', false, 'Invalid webhook secret');
    exit;
}

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON input'
    ]);
    logApiAccess('webhook_invalid_input', false, 'Invalid JSON format');
    exit;
}

// Validate required parameters
$eventType = $input['eventType'] ?? '';
$chainId = $input['chainId'] ?? '';
$txHash = $input['txHash'] ?? '';
$blockNumber = $input['blockNumber'] ?? '';
$eventData = $input['eventData'] ?? [];

if (!$eventType || !$chainId || !$txHash || !$blockNumber || empty($eventData)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing or invalid parameters'
    ]);
    logApiAccess('webhook_invalid_params', false, 'Missing or invalid parameters');
    exit;
}

try {
    // Process different event types
    switch ($eventType) {
        case 'ReferralPurchase':
            // Extract event data
            $referrer = $eventData['referrer'] ?? '';
            $buyer = $eventData['buyer'] ?? '';
            $usdAmount = $eventData['usdAmount'] ?? '0';
            $nativeCurrencyPaid = $eventData['nativeCurrencyPaid'] ?? '0';
            $cashbackAmount = $eventData['cashbackAmount'] ?? '0';
            $bonusPercent = $eventData['bonusPercent'] ?? '0';
            $newReferralCount = $eventData['newReferralCount'] ?? '0';
            
            // Validate required fields
            if (!$referrer || !$buyer) {
                throw new Exception("Missing required fields in ReferralPurchase event");
            }
            
            // Explicitly connect to the attestation database
            $pdo = getAttestationDbConnection();
            
            if (!$pdo) {
                throw new Exception("Failed to connect to attestation database");
            }
            
            // Record the purchase and update global count
            $success = recordReferralPurchase($referrer, $buyer, $chainId, $txHash, $usdAmount, $pdo);
            
            if (!$success) {
                throw new Exception("Failed to record referral purchase");
            }
            
            // Return success response
            echo json_encode([
                'success' => true,
                'message' => 'ReferralPurchase event processed successfully',
                'referrer' => $referrer,
                'buyer' => $buyer,
                'chainId' => $chainId,
                'txHash' => $txHash
            ]);
            
            logApiAccess('webhook_referral_purchase', true, "Referrer: $referrer, Buyer: $buyer, Chain: $chainId");
            break;
            
        case 'TierCrossed':
            // Extract event data
            $referrer = $eventData['referrer'] ?? '';
            $fromTier = $eventData['fromTier'] ?? '';
            $toTier = $eventData['toTier'] ?? '';
            $syncFee = $eventData['syncFee'] ?? '0';
            $attestedGlobalCount = $eventData['attestedGlobalCount'] ?? '0';
            
            // Validate required fields
            if (!$referrer || !$fromTier || !$toTier || !$attestedGlobalCount) {
                throw new Exception("Missing required fields in TierCrossed event");
            }
            
            // Update the global count to match the attested count
            $success = updateGlobalReferralCount($referrer, $attestedGlobalCount);
            
            if (!$success) {
                throw new Exception("Failed to update global referral count");
            }
            
            // Return success response
            echo json_encode([
                'success' => true,
                'message' => 'TierCrossed event processed successfully',
                'referrer' => $referrer,
                'fromTier' => $fromTier,
                'toTier' => $toTier,
                'attestedGlobalCount' => $attestedGlobalCount,
                'chainId' => $chainId,
                'txHash' => $txHash
            ]);
            
            logApiAccess('webhook_tier_crossed', true, "Referrer: $referrer, From: $fromTier, To: $toTier, Count: $attestedGlobalCount");
            break;
            
        default:
            // Unsupported event type
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Unsupported event type: ' . $eventType
            ]);
            logApiAccess('webhook_unsupported_event', false, "Unsupported event type: $eventType");
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Webhook processing failed',
        'message' => $e->getMessage()
    ]);
    logApiAccess('webhook_error', false, $e->getMessage());
}

/**
 * Validate the webhook secret
 * 
 * @param string $secret The webhook secret from the request header
 * @return bool Whether the secret is valid
 */
function validateWebhookSecret($secret) {
    global $security_config;
    
    // Get the webhook secret from config
    $expectedSecret = $security_config['webhook_secret'] ?? '';
    
    if (empty($expectedSecret)) {
        error_log("Webhook secret not configured");
        return false;
    }
    
    // Compare in constant time to prevent timing attacks
    return hash_equals($expectedSecret, $secret);
}
?>