<?php
// security.php - Security functions for API protection

require_once __DIR__ . '/config.php';

/* ------------------- Helpers ------------------- */

function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',') !== false)
            ? trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0])
            : $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Normalize incoming headers to lowercase and include HTTP_AUTHORIZATION if present.
 * Works even when getallheaders() is unavailable.
 */
function get_request_headers_lower(): array {
    $headers = [];

    // Start with getallheaders() if available
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            $headers[strtolower($k)] = $v;
        }
    }

    // Merge any HTTP_* items from $_SERVER that might be missing
    foreach ($_SERVER as $k => $v) {
        if (strpos($k, 'HTTP_') === 0) {
            $name = strtolower(str_replace('_', '-', substr($k, 5)));
            if (!isset($headers[$name])) {
                $headers[$name] = $v;
            }
        }
    }

    // Ensure Authorization is present if set as HTTP_AUTHORIZATION
    if (isset($_SERVER['HTTP_AUTHORIZATION']) && !isset($headers['authorization'])) {
        $headers['authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
    }

    return $headers;
}

/* ------------------- Rate limiting ------------------- */

function checkRateLimit() {
    global $security_config;

    $ip = getClientIP();
    $cacheFile = sys_get_temp_dir() . '/rate_limit_' . md5($ip) . '.json';

    $rateData = ['count' => 0, 'timestamp' => time()];

    if (file_exists($cacheFile) && is_readable($cacheFile)) {
        $fileContent = file_get_contents($cacheFile);
        if ($fileContent) $rateData = json_decode($fileContent, true) ?: $rateData;
    }

    if (time() - $rateData['timestamp'] > 60) {
        $rateData = ['count' => 0, 'timestamp' => time()];
    }

    $rateData['count']++;
    file_put_contents($cacheFile, json_encode($rateData));

    $limit = (int)($security_config['rate_limit'] ?? 60);
    if ($rateData['count'] > $limit) {
        http_response_code(429);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error'   => 'Rate limit exceeded',
            'message' => 'Too many requests, please try again later'
        ]);
        exit;
    }

    return true;
}

/* ------------------- API key validation ------------------- */

function validateApiKey(): void {
  global $security_config;

  $expected = $security_config['api_key'] ?? '';
  if ($expected === '') {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'API key not configured']);
    exit;
  }

  $provided = null;

  // 1) Query string ?key=... (what the frontend is using)
  if (isset($_GET['key']) && is_string($_GET['key'])) {
    $provided = $_GET['key'];
  }

  // 2) X-API-Key header (optional)
  if (!$provided) {
    $hdrs = getallheaders();
    if (!empty($hdrs['X-API-Key'])) {
      $provided = $hdrs['X-API-Key'];
    }
  }

  // 3) Authorization: Bearer ... (optional)
  if (!$provided) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (stripos($auth, 'Bearer ') === 0) {
      $provided = trim(substr($auth, 7));
    }
  }

  if (!hash_equals($expected, (string)$provided)) {
    http_response_code(401);
    echo json_encode(['success'=>false,'error'=>'Unauthorized']);
    exit;
  }
}


/* ------------------- (Optional) CORS helper ------------------- */
/* You already set CORS in each endpoint; keep this only if needed elsewhere. */
function handleCORS() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Api-Key, X-Signature, X-Timestamp");
    header("Access-Control-Max-Age: 86400");

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/* ------------------- Output & logging ------------------- */

function sanitizeOutput($data) {
    if (is_array($data)) {
        foreach ($data as $k => $v) $data[$k] = sanitizeOutput($v);
        return $data;
    }
    return htmlspecialchars((string)$data, ENT_QUOTES, 'UTF-8');
}

function logApiAccess($action, $success, $message = '') {
    $ip       = getClientIP();
    $ts       = date('Y-m-d H:i:s');
    $method   = $_SERVER['REQUEST_METHOD'] ?? '';
    $endpoint = $_SERVER['REQUEST_URI']    ?? '';
    $line = "[$ts] IP: $ip | Method: $method | Endpoint: $endpoint | Action: $action | Success: "
          . ($success ? 'true' : 'false')
          . ($message ? " | Message: $message" : '') . PHP_EOL;
    @file_put_contents(__DIR__ . '/api_access.log', $line, FILE_APPEND);
}

/* ------------------- Input validation ------------------- */

function validateInput($input, $type) {
    $input = trim((string)$input);

    switch ($type) {
        case 'referral_code':
            if (!preg_match('/^[A-Z0-9]{6,20}$/', $input)) return false;
            return strtoupper($input);

        case 'eth_address':
            if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $input)) return false;
            return strtolower($input);

        case 'action':
            $valid = ['add_referral', 'get_referrer', 'get_code_by_address', 'health'];
            return in_array($input, $valid, true) ? $input : false;

        case 'uint256':
            if (!preg_match('/^[0-9]+$/', $input)) return false;
            $norm = ltrim($input, '0');
            return $norm === '' ? '0' : $norm;

        default:
            return $input;
    }
}

/* ------------------- CSRF (if you use it on POSTs) ------------------- */

function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], (string)$token)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error'   => 'CSRF validation failed',
            'message' => 'Invalid security token'
        ]);
        exit;
    }
    return true;
}
