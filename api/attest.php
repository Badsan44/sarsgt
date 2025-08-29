<?php
// api/attest.php - Referral Attestation Service
// This service signs attestations for the global referral tier system

/**
 * --------------- CORS (MUST be first, before any output) ---------------
 * Allows bnbmaga.xyz to call api.bnbmaga.xyz and short-circuits preflight.
 */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
  'https://bnbmaga.xyz',
  'https://www.bnbmaga.xyz',
  // add localhost only while testing locally
  'http://localhost:3000',
  'http://localhost:5173',
];

if ($origin && in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
} else {
  // If you don't use cookies/sessions for this API, * is OK
  header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Api-Key, X-Signature, X-Timestamp');
header('Access-Control-Max-Age: 86400'); // cache preflight for 24h
header('Content-Type: application/json');

// Preflight must exit early with 204 (or 200)
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}
/** ------------------------- end CORS block --------------------------- */

/**
 * Secure headers (safe to send after CORS/preflight)
 */
session_start();
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
// NOTE: CSP on the API response is fine, but it does NOT control cross-origin fetches from the PAGE.
// Cross-origin fetch is controlled by the PAGE's CSP (connect-src) and by CORS here.
header("Content-Security-Policy: default-src 'self'");

require_once __DIR__ . '/security.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/referral_tiers.php'; // for tier tracking

// (Optional) rate limiting AFTER preflight
checkRateLimit();

// We only allow POST for real work; GET is allowed for health checks.
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
  if ($action === 'health') {
    echo json_encode(['ok' => true, 'time' => gmdate('c')]);
    logApiAccess('attest_health', true);
    exit;
  }
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  logApiAccess('attest_method_not_allowed', false, "Method: $method");
  exit;
}

// From here down we expect POST and we require API key
if ($method !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  logApiAccess('attest_method_not_allowed', false, "Method: $method");
  exit;
}

// Validate API key (must read X-API-Key header; make sure security.php is robust)
validateApiKey();

// Read and validate JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
  logApiAccess('attest_invalid_input', false, 'Invalid JSON format');
  exit;
}

// Validate required parameters
$referrer = validateInput($input['referrer'] ?? '', 'eth_address');
$buyerPlannedValueWei = validateInput($input['buyerPlannedValueWei'] ?? '', 'uint256');
$chainId = validateInput($input['chainId'] ?? '', 'uint256');

if (!$referrer || !$buyerPlannedValueWei || !$chainId) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'error' => 'Missing or invalid parameters. Required: referrer, buyerPlannedValueWei, chainId'
  ]);
  logApiAccess('attest_invalid_params', false, 'Missing or invalid parameters');
  exit;
}

try {
  // Explicitly connect to the attestation database
  $pdo = getAttestationDbConnection();
  if (!$pdo) {
    throw new Exception("Failed to connect to attestation database");
  }

  // Get the global referral count for this referrer using attestation DB
  $globalCount = getGlobalReferralCount($referrer, $pdo);

  // Set deadline (15 minutes from now)
  $deadline = time() + (15 * 60);

  // Calculate sync fee (0.5%)
  $syncFee = calculateSyncFee($buyerPlannedValueWei);

  // Generate signature
  $signature = generateAttestation($referrer, $globalCount, $deadline, $syncFee);
  if (!$signature) {
    throw new Exception("Failed to generate attestation signature");
  }

  echo json_encode([
    'success' => true,
    'referrer' => $referrer,
    'attestedGlobalCount' => $globalCount,
    'deadline' => $deadline,
    'syncFee' => $syncFee,
    'sig' => $signature
  ]);
  logApiAccess('attest_success', true, "Referrer: $referrer, Count: $globalCount");
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Attestation failed',
    'message' => $e->getMessage()
  ]);
  logApiAccess('attest_error', false, $e->getMessage());
}

/**
 * Calculate a reasonable sync fee based on transaction value
 * @param string $valueWei The transaction value in wei
 * @return string The sync fee in wei
 */
function calculateSyncFee($valueWei) {
  $value = gmp_init($valueWei);
  $feePercent = 50; // 0.5% = 50 bps
  $fee = gmp_div(gmp_mul($value, $feePercent), 10000);

  // minimum 0.0001 ETH/BNB
  $minFee = gmp_init('100000000000000'); // 1e14 wei
  if (gmp_cmp($fee, $minFee) < 0) $fee = $minFee;

  return gmp_strval($fee);
}

/**
 * Generate attestation signature using the private key
 */
function generateAttestation($referrer, $attestedGlobalCount, $deadline, $syncFee) {
  global $attestation_config;

  $privateKey = $attestation_config['signer_private_key'];
  if (empty($privateKey)) {
    error_log("Attestation error: Missing signer private key");
    return false;
  }

  require_once __DIR__ . '/vendor/autoload.php';

  try {
    // keccak256(abi.encode(keccak256("BNBRF-REFERRAL-v1"), referrer, attestedGlobalCount, deadline, syncFee))
    $projectId = Web3\Utils::sha3('BNBRF-REFERRAL-v1');
    $encoder = new Web3\Contracts\Ethabi();
    $types = ['bytes32', 'address', 'uint256', 'uint256', 'uint256'];
    $values = [$projectId, $referrer, $attestedGlobalCount, $deadline, $syncFee];

    $encodedData = $encoder->encodeParameters($types, $values);
    $messageHash = Web3\Utils::sha3($encodedData);

    // personal_sign style
    $personalMessage = "\x19Ethereum Signed Message:\n32" . $messageHash;
    $personalMessageHash = Web3\Utils::sha3($personalMessage);

    $signature = Web3\Account::sign($personalMessageHash, $privateKey);
    return $signature;
  } catch (Exception $e) {
    error_log("Attestation signing error: " . $e->getMessage());
    return false;
  }
}
