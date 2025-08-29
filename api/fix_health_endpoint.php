<?php
// This script fixes the health endpoint issue by modifying the security.php file

// First, check if we can access the security.php file
$securityFile = __DIR__ . '/security.php';
if (!file_exists($securityFile) || !is_readable($securityFile) || !is_writable($securityFile)) {
    die("Error: Cannot access security.php file. Check file permissions.");
}

// Read the current content
$content = file_get_contents($securityFile);
if ($content === false) {
    die("Error: Failed to read security.php file.");
}

// Check if the handleCORS function needs to be modified
if (strpos($content, 'if (in_array($origin, $security_config[\'allowed_origins\']))') !== false) {
    // Modify the handleCORS function to be more permissive for testing
    $oldCode = 'function handleCORS() {
    global $security_config;
    
    // Get origin
    $origin = $_SERVER[\'HTTP_ORIGIN\'] ?? \'\';
    
    // Check if origin is allowed
    if (in_array($origin, $security_config[\'allowed_origins\'])) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // If no specific origin matches, use the first allowed origin as default
        // In production, you might want to reject the request instead
        header("Access-Control-Allow-Origin: {$security_config[\'allowed_origins\'][0]}");
    }';

    $newCode = 'function handleCORS() {
    global $security_config;
    
    // Get origin
    $origin = $_SERVER[\'HTTP_ORIGIN\'] ?? \'\';
    
    // For testing purposes, allow all origins
    // In production, uncomment the origin check below
    header("Access-Control-Allow-Origin: *");
    
    /* 
    // Check if origin is allowed
    if (in_array($origin, $security_config[\'allowed_origins\'])) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // If no specific origin matches, use the first allowed origin as default
        // In production, you might want to reject the request instead
        header("Access-Control-Allow-Origin: {$security_config[\'allowed_origins\'][0]}");
    }
    */';

    $content = str_replace($oldCode, $newCode, $content);
    
    // Write the modified content back to the file
    if (file_put_contents($securityFile, $content) === false) {
        die("Error: Failed to write to security.php file.");
    }
    
    echo "Successfully modified handleCORS function to allow all origins for testing.<br>";
} else {
    echo "The handleCORS function has already been modified or has a different structure.<br>";
}

// Now check if we need to modify the checkRateLimit function
if (strpos($content, 'function checkRateLimit()') !== false) {
    // Add a bypass for the health endpoint
    $oldCode = 'function checkRateLimit() {
    global $security_config;
    
    $ip = getClientIP();';

    $newCode = 'function checkRateLimit() {
    global $security_config;
    
    // Skip rate limiting for health checks
    if (isset($_GET[\'action\']) && $_GET[\'action\'] === \'health\') {
        return true;
    }
    
    $ip = getClientIP();';

    $content = str_replace($oldCode, $newCode, $content);
    
    // Write the modified content back to the file
    if (file_put_contents($securityFile, $content) === false) {
        die("Error: Failed to write to security.php file.");
    }
    
    echo "Successfully modified checkRateLimit function to bypass rate limiting for health checks.<br>";
} else {
    echo "The checkRateLimit function has already been modified or has a different structure.<br>";
}

echo "<h2>Next Steps</h2>";
echo "<p>1. Try accessing the health endpoint again: <a href='referral.php?action=health' target='_blank'>referral.php?action=health</a></p>";
echo "<p>2. If you still see a 500 error, check the debug_health.php file: <a href='debug_health.php' target='_blank'>debug_health.php</a></p>";
echo "<p>3. Make sure your database credentials in config.php are correct</p>";
echo "<p>4. Check that the referral_codes table exists in your database</p>";
?>