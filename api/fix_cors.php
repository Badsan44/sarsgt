<?php
// This script fixes CORS issues by modifying the security.php file

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

// Replace the handleCORS function with a more permissive version
$pattern = '/function handleCORS\(\) \{.*?\}/s'; // Match the entire function
$replacement = 'function handleCORS() {
    // Allow requests from any origin during development/testing
    // For production, you should restrict this to specific domains
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Key");
    header("Access-Control-Max-Age: 86400"); // 24 hours cache
    
    // Handle preflight OPTIONS request
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit(0);
    }
}';

// Perform the replacement
$newContent = preg_replace($pattern, $replacement, $content);

// Check if replacement was successful
if ($newContent === null) {
    die("Error: Failed to modify the handleCORS function. Pattern not found.");
}

// Write the modified content back to the file
if (file_put_contents($securityFile, $newContent) === false) {
    die("Error: Failed to write to security.php file.");
}

echo "<h1>CORS Fix Applied</h1>";
echo "<p>The handleCORS function has been updated to allow cross-origin requests from any domain.</p>";
echo "<p>This is suitable for development and testing. For production, you should restrict the allowed origins.</p>";

echo "<h2>Next Steps</h2>";
echo "<ol>";
echo "<li>Upload the modified security.php file to your server</li>";
echo "<li>Test your API from your frontend application</li>";
echo "<li>If you're still having issues, check your server's configuration (Apache/Nginx) for additional CORS settings</li>";
echo "</ol>";

echo "<h2>For Production Use</h2>";
echo "<p>Before deploying to production, you should modify the config.php file to include your actual domains:</p>";
echo "<pre>";
echo htmlspecialchars('// In config.php
$security_config = [
    // List of allowed origins for CORS
    \'allowed_origins\' => [
        \'https://yourdomain.com\', 
        \'https://app.yourdomain.com\'
    ],
    // ... other settings
];');
echo "</pre>";

echo "<p>Then modify the handleCORS function to use these domains instead of '*'.</p>";
?>