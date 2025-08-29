<?php
// test_connections.php - Test script to verify both database connections
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'database.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
    </style>
</head>
<body>
    <h1>Database Connection Test</h1>";

// Test referral database connection
echo "<h2>Testing Referral Database Connection</h2>";
$referralDb = getReferralDbConnection();
if ($referralDb) {
    echo "<p class='success'>✓ Referral database connection successful!</p>";
    
    // Test a simple query
    try {
        $stmt = $referralDb->query("SHOW TABLES");
        echo "<p>Tables in referral database:</p>";
        echo "<ul>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tableKey = array_keys($row)[0]; // Get the first column name (which contains table names)
            echo "<li>" . htmlspecialchars($row[$tableKey]) . "</li>";
        }
        echo "</ul>";
    } catch (PDOException $e) {
        echo "<p class='error'>Error querying tables: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
} else {
    echo "<p class='error'>✗ Referral database connection failed!</p>";
    echo "<p>Please check your database configuration in config.php</p>";
    echo "<pre>" . htmlspecialchars(print_r($GLOBALS['referral_db_config'], true)) . "</pre>";
}

// Test attestation database connection
echo "<h2>Testing Attestation Database Connection</h2>";
$attestationDb = getAttestationDbConnection();
if ($attestationDb) {
    echo "<p class='success'>✓ Attestation database connection successful!</p>";
    
    // Test a simple query
    try {
        $stmt = $attestationDb->query("SHOW TABLES");
        echo "<p>Tables in attestation database:</p>";
        echo "<ul>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tableKey = array_keys($row)[0]; // Get the first column name (which contains table names)
            echo "<li>" . htmlspecialchars($row[$tableKey]) . "</li>";
        }
        echo "</ul>";
    } catch (PDOException $e) {
        echo "<p class='error'>Error querying tables: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
} else {
    echo "<p class='error'>✗ Attestation database connection failed!</p>";
    echo "<p>Please check your database configuration in config.php</p>";
    echo "<pre>" . htmlspecialchars(print_r($GLOBALS['attestation_db_config'], true)) . "</pre>";
}

// Test the automatic connection selection
echo "<h2>Testing Automatic Connection Selection</h2>";
echo "<p>The getDbConnection() function automatically selects the appropriate database based on the calling file.</p>";
echo "<p>Current file: " . basename(__FILE__) . "</p>";
$autoDb = getDbConnection();
if ($autoDb) {
    echo "<p class='success'>✓ Automatic database connection successful!</p>";
    echo "<p>Since this is not an attestation-related file, it should connect to the referral database.</p>";
} else {
    echo "<p class='error'>✗ Automatic database connection failed!</p>";
}

echo "</body>
</html>";
?>