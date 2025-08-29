<?php
// api/referral.php - Referral Code Management API
// Secured version with improved security measures

// CORS is handled globally via .htaccess to support credentials and exact Origin.
// Avoid emitting CORS headers here to prevent duplicates.

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

// Apply rate limiting
checkRateLimit();

// Handle preflight OPTIONS request (handled at the top of the file)

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate API key for all POST requests
    validateApiKey();
    
    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON input'
        ]);
        logApiAccess('invalid_input', false, 'Invalid JSON format');
        exit;
    }
    
    // Validate CSRF token for POST requests
    if (empty($input['csrf_token']) || !validateCSRFToken($input['csrf_token'])) {
        // CSRF validation is handled in the validateCSRFToken function
        logApiAccess('csrf_failure', false);
        exit;
    }
    
    // Validate and sanitize action
    $action = validateInput($input['action'] ?? '', 'action');
    
    if (!$action) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid or missing action parameter'
        ]);
        logApiAccess('invalid_action', false);
        exit;
    }
    
    switch ($action) {
        case 'add_referral':
            // Validate and sanitize inputs
            $code = validateInput($input['code'] ?? '', 'referral_code');
            $address = validateInput($input['address'] ?? '', 'eth_address');
            
            // Validation
            if (!$code || !$address) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid code or address format'
                ]);
                logApiAccess('add_referral', false, 'Invalid input format');
                exit;
            }
            
            // Add referral code using the database helper
            $result = addReferralCode($code, $address);
            
            // Set appropriate status code
            http_response_code($result['success'] ? 200 : 500);
            
            // Log the action
            logApiAccess('add_referral', $result['success'], $result['success'] ? 'Success' : $result['error']);
            
            // Return sanitized result
            echo json_encode(sanitizeOutput($result));
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
            logApiAccess('invalid_action', false, "Unknown action: $action");
    }
}

// Handle GET requests
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate API key for sensitive GET requests
    if (in_array($_GET['action'] ?? '', ['get_referrer', 'get_code_by_address'])) {
        validateApiKey();
    }
    
    // Validate and sanitize action
    $action = validateInput($_GET['action'] ?? '', 'action');
    
    if (!$action) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid or missing action parameter'
        ]);
        logApiAccess('invalid_action', false);
        exit;
    }
    
    switch ($action) {
        case 'get_referrer':
            // Validate and sanitize code
            $code = validateInput($_GET['code'] ?? '', 'referral_code');
            
            if (!$code) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid referral code format'
                ]);
                logApiAccess('get_referrer', false, 'Invalid code format');
                exit;
            }
            
            // Get referrer using the database helper
            $result = getReferrerByCode($code);
            
            // Set appropriate status code
            http_response_code($result['success'] ? 200 : 500);
            
            // Log the action
            logApiAccess('get_referrer', $result['success'], $result['success'] ? 'Success' : $result['error']);
            
            // Return sanitized result
            echo json_encode(sanitizeOutput($result));
            break;
            
        case 'get_code_by_address':
            // Validate and sanitize address
            $address = validateInput($_GET['address'] ?? '', 'eth_address');
            
            if (!$address) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid Ethereum address'
                ]);
                logApiAccess('get_code_by_address', false, 'Invalid address format');
                exit;
            }
            
            // Get code using the database helper
            $result = getCodeByAddress($address);
            
            // Set appropriate status code
            http_response_code($result['success'] ? 200 : 500);
            
            // Log the action
            logApiAccess('get_code_by_address', $result['success'], $result['success'] ? 'Success' : $result['error']);
            
            // Return sanitized result
            echo json_encode(sanitizeOutput($result));
            break;
            
        case 'health':
            // Health check doesn't need API key validation
            $result = [
                'success' => true,
                'message' => 'API is working',
                'timestamp' => date('Y-m-d H:i:s'),
                'csrf_token' => generateCSRFToken() // Generate a new CSRF token for the client
            ];
            
            logApiAccess('health', true);
            echo json_encode($result);
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
            logApiAccess('invalid_action', false, "Unknown action: $action");
    }
}

// Handle unsupported methods
else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    logApiAccess('method_not_allowed', false, "Method: {$_SERVER['REQUEST_METHOD']}");
}
?>