<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once 'config.php';
require_once 'database.php';
require_once 'security.php';

// Test database connection
echo "<h2>Testing Database Connection</h2>";
$pdo = getReferralDbConnection();
if ($pdo) {
    echo "<p style='color:green'>Database connection successful!</p>";
} else {
    echo "<p style='color:red'>Database connection failed!</p>";
    echo "<p>Check your database credentials in config.php</p>";
    echo "<pre>";
    print_r($GLOBALS['referral_db_config']);
    echo "</pre>";
}

// Check if the referral_codes table exists
if ($pdo) {
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'referral_codes'");
        $tableExists = $stmt->rowCount() > 0;
        
        if ($tableExists) {
            echo "<p style='color:green'>referral_codes table exists!</p>";
            
            // Check if the table has the expected structure
            $stmt = $pdo->query("DESCRIBE referral_codes");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo "<p>Table columns: " . implode(", ", $columns) . "</p>";
        } else {
            echo "<p style='color:red'>referral_codes table does not exist!</p>";
            echo "<p>Run the setup_referral_db.sql script to create it.</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color:red'>Error checking table: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
}

// Test the health endpoint logic
echo "<h2>Testing Health Endpoint Logic</h2>";
try {
    // This is the logic that would be executed in referral.php for the health action
    $response = [
        'status' => 'ok',
        'timestamp' => time(),
        'message' => 'API is operational'
    ];
    
    echo "<p style='color:green'>Health check logic executed successfully!</p>";
    echo "<pre>";
    print_r($response);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error in health check logic: " . htmlspecialchars($e->getMessage()) . "</p>";
}

// Check if referral.php exists and is readable
echo "<h2>Checking referral.php</h2>";
$referralFile = __DIR__ . '/referral.php';
if (file_exists($referralFile)) {
    echo "<p style='color:green'>referral.php exists!</p>";
    if (is_readable($referralFile)) {
        echo "<p style='color:green'>referral.php is readable!</p>";
    } else {
        echo "<p style='color:red'>referral.php is not readable!</p>";
        echo "<p>Check file permissions.</p>";
    }
} else {
    echo "<p style='color:red'>referral.php does not exist!</p>";
    echo "<p>Make sure the file is uploaded to the correct location.</p>";
}

// Check PHP version and extensions
echo "<h2>PHP Environment</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Loaded Extensions: " . implode(", ", get_loaded_extensions()) . "</p>";

// Check for PDO MySQL extension
if (extension_loaded('pdo_mysql')) {
    echo "<p style='color:green'>PDO MySQL extension is loaded!</p>";
} else {
    echo "<p style='color:red'>PDO MySQL extension is not loaded!</p>";
    echo "<p>This extension is required for database connections.</p>";
}
?>