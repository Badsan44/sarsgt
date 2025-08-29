<?php
// api/referral.php - Referral Code Management API

// CORS Headers - More robust implementation
// Send CORS headers first, before any output
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Allow from any origin
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    
    // Just exit with 200 OK for preflight
    exit(0);
}

// Set content type after handling OPTIONS
header('Content-Type: application/json');

// Database configuration - UPDATE THESE WITH YOUR HOSTINGER DATABASE DETAILS
$host = 'localhost';
$dbname = 'u599161029_ReferralDB';  // Replace with your actual database name
$username = 'u599161029_RefDB';  // Replace with your actual database username
$password = 'Don3otoiash';  // Replace with your actual database password

// Function to validate Ethereum address
function isValidAddress($address) {
    return preg_match('/^0x[a-fA-F0-9]{40}$/', $address);
}

// Function to validate referral code
function isValidReferralCode($code) {
    return preg_match('/^[A-Z0-9]{6,20}$/', $code);
}

// Database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'message' => 'Unable to connect to database'
    ]);
    exit;
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON input'
        ]);
        exit;
    }
    
    $action = $input['action'] ?? '';
    
    switch ($action) {
        case 'add_referral':
            $code = strtoupper(trim($input['code'] ?? ''));
            $address = strtolower(trim($input['address'] ?? ''));
            
            // Validation
            if (empty($code) || empty($address)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Code and address are required'
                ]);
                exit;
            }
            
            if (!isValidReferralCode($code)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid referral code format'
                ]);
                exit;
            }
            
            if (!isValidAddress($address)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid Ethereum address'
                ]);
                exit;
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
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Referral code added successfully',
                    'code' => $code,
                    'address' => $address
                ]);
                
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Database error',
                    'message' => 'Failed to add referral code'
                ]);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }
}

// Handle GET requests
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'get_referrer':
            $code = strtoupper(trim($_GET['code'] ?? ''));
            
            if (empty($code)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Referral code is required'
                ]);
                exit;
            }
            
            if (!isValidReferralCode($code)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid referral code format'
                ]);
                exit;
            }
            
            try {
                $stmt = $pdo->prepare("SELECT address, created_at FROM referral_codes WHERE code = ?");
                $stmt->execute([$code]);
                $result = $stmt->fetch();
                
                if ($result) {
                    echo json_encode([
                        'success' => true,
                        'address' => $result['address'],
                        'created_at' => $result['created_at']
                    ]);
                } else {
                    echo json_encode([
                        'success' => true,
                        'address' => null,
                        'message' => 'Referral code not found'
                    ]);
                }
                
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Database error',
                    'message' => 'Failed to retrieve referral code'
                ]);
            }
            break;
            
        case 'get_code_by_address':
            $address = strtolower(trim($_GET['address'] ?? ''));
            
            if (empty($address)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Address is required'
                ]);
                exit;
            }
            
            if (!isValidAddress($address)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid Ethereum address'
                ]);
                exit;
            }
            
            try {
                $stmt = $pdo->prepare("SELECT code, created_at FROM referral_codes WHERE address = ? ORDER BY created_at DESC LIMIT 1");
                $stmt->execute([$address]);
                $result = $stmt->fetch();
                
                if ($result) {
                    echo json_encode([
                        'success' => true,
                        'code' => $result['code'],
                        'created_at' => $result['created_at']
                    ]);
                } else {
                    echo json_encode([
                        'success' => true,
                        'code' => null,
                        'message' => 'No referral code found for this address'
                    ]);
                }
                
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Database error',
                    'message' => 'Failed to retrieve referral code'
                ]);
            }
            break;
            
        case 'health':
            echo json_encode([
                'success' => true,
                'message' => 'API is working',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }
}

// Handle unsupported methods
else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>