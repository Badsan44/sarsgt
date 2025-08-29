<?php
// Test script for attestation service
header('Content-Type: text/html; charset=utf-8');

// Function to make a test request
function testAttestation($referrer, $buyerPlannedValueWei, $chainId) {
    // Create request payload
    $payload = json_encode([
        'referrer' => $referrer,
        'buyerPlannedValueWei' => $buyerPlannedValueWei,
        'chainId' => $chainId
    ]);

    // Get the current host and protocol
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    
    // Build the full URL to the attestation service
    $url = "{$protocol}://{$host}/api/attest.php";
    
    // Debug information
    $debug = [
        'request_url' => $url,
        'payload' => json_decode($payload, true)
    ];

    // Set up cURL request to the attestation service
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);
    
    // Follow redirects (important for handling 301/302 responses)
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 5);

    // Execute the request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    // Add debug info
    $debug['curl_info'] = $info;
    $debug['http_code'] = $httpCode;
    $debug['curl_error'] = $error;

    return [
        'http_code' => $httpCode,
        'response' => $response ? json_decode($response, true) : null,
        'error' => $error,
        'debug' => $debug
    ];
}

// Test parameters
$referrer = "0x123456789abcdef123456789abcdef123456789a"; // Example address
$buyerPlannedValueWei = "1000000000000000000"; // 1 ETH in wei
$chainId = "1"; // Ethereum mainnet

// Run the test
$result = testAttestation($referrer, $buyerPlannedValueWei, $chainId);

// Display results
echo "<!DOCTYPE html>
<html>
<head>
    <title>Attestation Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
        .debug { background: #ffffd8; padding: 10px; border: 1px solid #e0e0a0; margin-top: 20px; }
        h3 { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Attestation Service Test</h1>
    
    <h2>Request</h2>
    <pre>" . htmlspecialchars(json_encode([
        'referrer' => $referrer,
        'buyerPlannedValueWei' => $buyerPlannedValueWei,
        'chainId' => $chainId
    ], JSON_PRETTY_PRINT)) . "</pre>
    
    <h2>Response</h2>
    <p>HTTP Status Code: <strong>" . $result['http_code'] . "</strong></p>";

if ($result['error']) {
    echo "<p class='error'>Error: " . htmlspecialchars($result['error']) . "</p>";
} elseif ($result['http_code'] == 200 && isset($result['response']['success']) && $result['response']['success']) {
    echo "<p class='success'>Success! Attestation generated correctly.</p>";
    echo "<pre>" . htmlspecialchars(json_encode($result['response'], JSON_PRETTY_PRINT)) . "</pre>";
    
    // Verify signature is present
    if (isset($result['response']['sig']) && !empty($result['response']['sig'])) {
        echo "<p class='success'>✓ Signature is present</p>";
    } else {
        echo "<p class='error'>✗ Signature is missing</p>";
    }
} else {
    echo "<p class='error'>Failed to generate attestation.</p>";
    echo "<pre>" . htmlspecialchars(json_encode($result['response'], JSON_PRETTY_PRINT)) . "</pre>";
}

// Debug information section
echo "<h3>Debug Information</h3>
<div class='debug'>
    <p><strong>Request URL:</strong> " . htmlspecialchars($result['debug']['request_url']) . "</p>
    <p><strong>Final URL:</strong> " . htmlspecialchars($result['debug']['curl_info']['url']) . "</p>
    <p><strong>Redirect Count:</strong> " . htmlspecialchars($result['debug']['curl_info']['redirect_count']) . "</p>
    <p><strong>Total Time:</strong> " . htmlspecialchars($result['debug']['curl_info']['total_time']) . " seconds</p>
    <p><strong>Primary IP:</strong> " . htmlspecialchars($result['debug']['curl_info']['primary_ip']) . "</p>
    <p><strong>Full cURL Info:</strong></p>
    <pre>" . htmlspecialchars(json_encode($result['debug']['curl_info'], JSON_PRETTY_PRINT)) . "</pre>
</div>";

echo "</body>
</html>";
?>