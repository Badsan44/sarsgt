<?php
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>
<html>
<head>
    <title>Web3 PHP Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
        .section { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Web3 PHP Library Test</h1>";

// Check if composer is installed
echo "<div class='section'>
    <h2>1. Composer Check</h2>";

try {
    $composerPath = __DIR__ . '/../composer.phar';
    $composerExists = file_exists($composerPath);
    
    if ($composerExists) {
        echo "<p class='success'>✓ Composer found at: " . htmlspecialchars($composerPath) . "</p>";
    } else {
        echo "<p class='error'>✗ Composer not found at: " . htmlspecialchars($composerPath) . "</p>";
        echo "<p>You may need to install Composer. Run the following commands:</p>";
        echo "<pre>cd " . htmlspecialchars(__DIR__) . "
curl -sS https://getcomposer.org/installer | php
mv composer.phar ../composer.phar
chmod +x ../composer.phar</pre>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Composer check failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Check if composer.json exists
echo "<div class='section'>
    <h2>2. Composer.json Check</h2>";

try {
    $composerJsonPath = __DIR__ . '/composer.json';
    $composerJsonExists = file_exists($composerJsonPath);
    
    if ($composerJsonExists) {
        echo "<p class='success'>✓ composer.json found at: " . htmlspecialchars($composerJsonPath) . "</p>";
        
        // Display the contents
        $composerJson = file_get_contents($composerJsonPath);
        echo "<p>Contents of composer.json:</p>";
        echo "<pre>" . htmlspecialchars($composerJson) . "</pre>";
    } else {
        echo "<p class='error'>✗ composer.json not found at: " . htmlspecialchars($composerJsonPath) . "</p>";
        echo "<p>You need to create a composer.json file. Create it with the following content:</p>";
        echo "<pre>{
    \"require\": {
        \"web3p/web3.php\": \"^0.1.6\"
    }
}</pre>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ composer.json check failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Check if vendor directory exists
echo "<div class='section'>
    <h2>3. Vendor Directory Check</h2>";

try {
    $vendorPath = __DIR__ . '/vendor';
    $vendorExists = is_dir($vendorPath);
    
    if ($vendorExists) {
        echo "<p class='success'>✓ Vendor directory found at: " . htmlspecialchars($vendorPath) . "</p>";
        
        // Check if autoload.php exists
        $autoloadPath = $vendorPath . '/autoload.php';
        $autoloadExists = file_exists($autoloadPath);
        
        if ($autoloadExists) {
            echo "<p class='success'>✓ autoload.php found at: " . htmlspecialchars($autoloadPath) . "</p>";
        } else {
            echo "<p class='error'>✗ autoload.php not found at: " . htmlspecialchars($autoloadPath) . "</p>";
        }
        
        // Check if web3p directory exists
        $web3pPath = $vendorPath . '/web3p';
        $web3pExists = is_dir($web3pPath);
        
        if ($web3pExists) {
            echo "<p class='success'>✓ web3p directory found at: " . htmlspecialchars($web3pPath) . "</p>";
            
            // List the contents of the web3p directory
            $web3pContents = scandir($web3pPath);
            echo "<p>Contents of web3p directory:</p>";
            echo "<ul>";
            foreach ($web3pContents as $item) {
                if ($item != '.' && $item != '..') {
                    echo "<li>" . htmlspecialchars($item) . "</li>";
                }
            }
            echo "</ul>";
        } else {
            echo "<p class='error'>✗ web3p directory not found at: " . htmlspecialchars($web3pPath) . "</p>";
        }
    } else {
        echo "<p class='error'>✗ Vendor directory not found at: " . htmlspecialchars($vendorPath) . "</p>";
        echo "<p>You need to install the dependencies. Run the following command:</p>";
        echo "<pre>cd " . htmlspecialchars(__DIR__) . "
php ../composer.phar install</pre>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Vendor directory check failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Try to load the Web3 PHP library
echo "<div class='section'>
    <h2>4. Web3 PHP Library Load Test</h2>";

try {
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        require_once __DIR__ . '/vendor/autoload.php';
        
        if (class_exists('Web3\Web3')) {
            echo "<p class='success'>✓ Web3 PHP library loaded successfully</p>";
            
            // Create a Web3 instance
            $web3 = new Web3\Web3();
            echo "<p class='success'>✓ Web3 instance created successfully</p>";
            
            // Test a simple function
            $utils = new Web3\Utils();
            $hash = Web3\Utils::sha3('test');
            echo "<p class='success'>✓ Web3 Utils function test successful</p>";
            echo "<p>SHA3 hash of 'test': <code>" . htmlspecialchars($hash) . "</code></p>";
        } else {
            echo "<p class='error'>✗ Web3 class not found</p>";
        }
    } else {
        echo "<p class='error'>✗ Cannot load autoload.php</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Web3 PHP library load test failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

// Check if the environment variable is set
echo "<div class='section'>
    <h2>5. Environment Variable Check</h2>";

try {
    $privateKey = getenv('AGGREGATOR_SIGNER_PK');
    
    if ($privateKey) {
        echo "<p class='success'>✓ AGGREGATOR_SIGNER_PK environment variable is set</p>";
        // Don't display the actual private key for security reasons
        echo "<p>Private key is set (value hidden for security)</p>";
    } else {
        echo "<p class='error'>✗ AGGREGATOR_SIGNER_PK environment variable is not set</p>";
        echo "<p>You need to set the environment variable in your .htaccess file:</p>";
        echo "<pre>&lt;IfModule mod_env.c&gt;
    SetEnv AGGREGATOR_SIGNER_PK your_private_key_here
&lt;/IfModule&gt;</pre>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Environment variable check failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

echo "</body>
</html>";
?>