<?php
// security.php - Security functions for API protection

// Include configuration
require_once 'config.php';

// Function to get client IP address
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',') !== false) ? 
            trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]) : 
            $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

// Function to check rate limiting
function checkRateLimit() {
    global $security_config;
    
    $ip = getClientIP();
    $cacheFile = sys_get_temp_dir() . '/rate_limit_' . md5($ip) . '.json';
    
    // Default rate limit data
    $rateData = [
        'count' => 0,
        'timestamp' => time()
    ];
    
    // Check if rate limit file exists and is readable
    if (file_exists($cacheFile) && is_readable($cacheFile)) {
        $fileContent = file_get_contents($cacheFile);
        if ($fileContent) {
            $rateData = json_decode($fileContent, true) ?: $rateData;
        }
    }
    
    // Reset count if more than a minute has passed
    if (time() - $rateData['timestamp'] > 60) {
        $rateData = [
            'count' => 0,
            'timestamp' => time()
        ];
    }
    
    // Increment request count
    $rateData['count']++;
    
    // Write updated data
    file_put_contents($cacheFile, json_encode($rateData));
    
    // Check if rate limit exceeded
    if ($rateData['count'] > $security_config['rate_limit']) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests, please try again later'
        ]);
        exit;
    }
    
    return true;
}

// Function to validate API key
function validateApiKey() {
    global $security_config;
    
    // Get API key from header (case-insensitive, accept common variants)
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $headersLower = [];
    foreach ($headers as $k => $v) { $headersLower[strtolower($k)] = $v; }
    $apiKey = $headersLower['x-api-key'] ?? '';

    // Check if API key is valid
    if ($apiKey === '' || $apiKey !== $security_config['api_key']) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized',
            'message' => 'Invalid or missing API key'
        ]);
        exit;
    }
    
    return true;
}

// Function to handle CORS
function handleCORS() {
    global $security_config;
    
    // Allow requests from any origin during development/testing
    // For production, you should restrict this to specific domains
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Key");
    header("Access-Control-Max-Age: 86400"); // 24 hours cache
    
    /* 
    // Production CORS handling with specific origins
    // Uncomment this section and comment out the "*" header above when ready for production
    
    // Get origin
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Check if origin is allowed
    if (in_array($origin, $security_config['allowed_origins'])) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // If no specific origin matches, use the first allowed origin as default
        // In production, you might want to reject the request instead
        header("Access-Control-Allow-Origin: {$security_config['allowed_origins'][0]}");
    }
    */
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// Function to sanitize output data
function sanitizeOutput($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeOutput($value);
        }
        return $data;
    } else {
        return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }
}

// Function to log API access
function logApiAccess($action, $success, $message = '') {
    $ip = getClientIP();
    $timestamp = date('Y-m-d H:i:s');
    $method = $_SERVER['REQUEST_METHOD'];
    $endpoint = $_SERVER['REQUEST_URI'];
    
    $logEntry = "[$timestamp] IP: $ip | Method: $method | Endpoint: $endpoint | Action: $action | Success: " . 
                ($success ? 'true' : 'false') . ($message ? " | Message: $message" : '') . PHP_EOL;
    
    // Log to file
    file_put_contents(
        dirname(__FILE__) . '/api_access.log', 
        $logEntry, 
        FILE_APPEND
    );
}

// Function to validate and sanitize input
function validateInput($input, $type) {
    $input = trim($input);
    
    switch ($type) {
        case 'referral_code':
            // Validate referral code format
            if (!preg_match('/^[A-Z0-9]{6,20}$/', $input)) {
                return false;
            }
            return strtoupper($input);
            
        case 'eth_address':
            // Validate Ethereum address
            if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $input)) {
                return false;
            }
            return strtolower($input);
            
        case 'action':
            // Validate action parameter
            $validActions = ['add_referral', 'get_referrer', 'get_code_by_address', 'health'];
            return in_array($input, $validActions) ? $input : false;
            
        default:
            // For other types, just return the trimmed input
            return $input;
    }
}

// Add CSRF protection
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    if (empty($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'CSRF validation failed',
            'message' => 'Invalid security token'
        ]);
        exit;
    }
    return true;
}
?>