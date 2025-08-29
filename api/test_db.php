<?php
header('Content-Type: text/html; charset=utf-8');
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Database Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        code { background: #f7f7f7; padding: 2px 4px; }
    </style>
</head>
<body>
<h1>Database Connection Test</h1>";

try {
    // ***** IMPORTANT: connect to the ATTESTATION DB explicitly *****
    $pdo = getAttestationDbConnection();

    if (!$pdo) {
        throw new Exception('Could not obtain PDO for attestation DB.');
    }

    echo "<p class='success'>✓ Database connection successful!</p>";

    // Show which DB we THINK we're using from config
    echo "<p>Configured (attestation) DB: <strong>" . htmlspecialchars($attestation_db_config['dbname']) . "</strong></p>";

    // Show which DB the server actually selected
    $currentDb = $pdo->query("SELECT DATABASE()")->fetchColumn();
    echo "<p>Current DB (SELECT DATABASE()): <strong>" . htmlspecialchars((string)$currentDb) . "</strong></p>";

    // Attestation DB tables to check
    $tables = ['global_referral_counts', 'referral_purchases', 'attestation_logs'];

    echo "<h2>Table Status</h2>
    <table>
        <tr>
            <th>Table</th>
            <th>Status</th>
            <th>Record Count</th>
        </tr>";

    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM `{$table}`");
            $count = $stmt->fetchColumn();
            echo "<tr>
                <td><code>" . htmlspecialchars($table) . "</code></td>
                <td class='success'>Exists</td>
                <td>" . htmlspecialchars((string)$count) . "</td>
            </tr>";
        } catch (PDOException $e) {
            echo "<tr>
                <td><code>" . htmlspecialchars($table) . "</code></td>
                <td class='error'>Error: " . htmlspecialchars($e->getMessage()) . "</td>
                <td>N/A</td>
            </tr>";
        }
    }

    echo "</table>";
} catch (Throwable $e) {
    echo "<p class='error'>✗ Database connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Check <code>config.php</code> credentials for <strong>\$attestation_db_config</strong> and user permissions.</p>";
}

echo "</body></html>";
