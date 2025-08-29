<?php
// CORS Headers - Test file
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

// Return a simple response
echo json_encode([
    'success' => true,
    'message' => 'CORS test successful',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'Unknown',
        'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
        'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'Not provided',
        'referer' => $_SERVER['HTTP_REFERER'] ?? 'Not provided'
    ]
]);
?>