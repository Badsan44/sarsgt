<?php
// api/attest.php — Attestation service with "lazy sync" fee
//
// - Queries the chain for lastGlobalCount(referrer) and referralCounts(referrer)
// - Decides if a tier-up will occur; only then returns a non-zero syncFee
// - Signs the exact tuple (referrer, attestedGlobalCount, deadline, syncFee)

declare(strict_types=1);

/* ---------------- CORS (must be before ANY output) ---------------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
  'https://bnbmaga.xyz',
  'https://www.bnbmaga.xyz',
  // local dev only, remove in production:
  'http://localhost:3000', 'http://localhost:5173',
];
if ($origin && in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-API-Key, X-Api-Key, X-Signature, X-Timestamp, Cache-Control');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
/* ---------------- end CORS ---------------- */

/* ---------------- Security headers ---------------- */
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
//header("Content-Security-Policy: default-src 'self'");

/* ---------------- Fatal/Exception JSON handler (debug-friendly) ---------------- */
require_once __DIR__ . '/security.php'; // we need $security_config here already

$__DEBUG = $security_config['debug_mode'] ?? false;
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_exception_handler(function(Throwable $e) use ($__DEBUG) {
  if (!headers_sent()) {
    http_response_code(500);
    header('Content-Type: application/json');
  }
  echo json_encode([
    'success' => false,
    'error'   => 'Server exception',
    'message' => $__DEBUG ? ($e->getMessage().' @ '.$e->getFile().':'.$e->getLine()) : 'Internal error',
  ]);
  exit;
});

set_error_handler(function($errno, $errstr, $errfile, $errline) use ($__DEBUG) {
  if (!(error_reporting() & $errno)) { return; }
  if (!headers_sent()) {
    http_response_code(500);
    header('Content-Type: application/json');
  }
  echo json_encode([
    'success' => false,
    'error'   => 'Server error',
    'message' => $__DEBUG ? ($errstr.' @ '.$errfile.':'.$errline) : 'Internal error',
  ]);
  exit;
});

register_shutdown_function(function() use ($__DEBUG) {
  $err = error_get_last();
  if ($err && in_array($err['type'], [E_ERROR,E_PARSE,E_CORE_ERROR,E_COMPILE_ERROR,E_USER_ERROR], true)) {
    if (!headers_sent()) {
      http_response_code(500);
      header('Content-Type: application/json');
    }
    echo json_encode([
      'success' => false,
      'error'   => 'Server fatal',
      'message' => $__DEBUG ? ($err['message'].' @ '.$err['file'].':'.$err['line']) : 'Internal error',
    ]);
  }
});
/* ---------------- end fatal/exception handler ---------------- */


/* ---------------- Includes ---------------- */
require_once __DIR__ . '/security.php';   // includes config.php
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/referral_tiers.php'; // if you use DB global counts

// Composer autoload (elliptic, keccak, web3 utils)
$autoload = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoload)) {
  http_response_code(500);
  echo json_encode(['success'=>false,'error'=>'Attestation failed','message'=>'Missing vendor/autoload.php']);
  exit;
}
require_once $autoload;

use Elliptic\EC;
use kornrunner\Keccak;

/* ---------------- Utility: JSON output + exit ---------------- */
function json_exit(int $status, array $payload): void {
  http_response_code($status);
  echo json_encode($payload);
  exit;
}

/* ---------------- Tier helpers (must match Solidity) ---------------- */
function tierLevelFromCount(int $count, array $thresholdsDesc /* e.g. [930,430,...,0] */): int {
  $n = count($thresholdsDesc);
  for ($i = 0; $i < $n; $i++) {
    if ($count >= $thresholdsDesc[$i]) {
      return $n - $i; // 8..1 for your list
    }
  }
  return 1;
}

/* ---------------- Big-int helpers (decimal strings) ---------------- */
// floor( a * n / d ), with a decimal string, small ints n,d
function bigMulDiv(string $a, int $n, int $d): string {
  $carry = 0; $res = '';
  for ($i = strlen($a)-1; $i >= 0; $i--) {
    $prod = ((int)$a[$i]) * $n + $carry;
    $res .= (string)($prod % 10);
    $carry = intdiv($prod, 10);
  }
  while ($carry > 0) { $res .= (string)($carry % 10); $carry = intdiv($carry, 10); }
  $res = strrev($res);
  $res = ltrim($res, '0'); if ($res === '') $res = '0';

  // divide by d
  $q = ''; $r = 0;
  for ($i = 0, $L = strlen($res); $i < $L; $i++) {
    $r = $r * 10 + (int)$res[$i];
    $digit = intdiv($r, $d);
    if (!($q === '' && $digit === 0)) $q .= (string)$digit;
    $r = $r % $d;
  }
  return $q === '' ? '0' : $q;
}
function bigCmp(string $a, string $b): int {
  $a = ltrim($a, '0'); $b = ltrim($b, '0');
  if ($a === '') $a = '0'; if ($b === '') $b = '0';
  if (strlen($a) !== strlen($b)) return strlen($a) < strlen($b) ? -1 : 1;
  return $a <=> $b;
}

/* ---------------- Fee policy ---------------- */
function calculateSyncFee(string $purchaseWei, int $feeBps): string {
  $purchaseWei = preg_replace('/\D/', '', (string)$purchaseWei) ?: '0';
  if ($feeBps <= 0) return '0';
  $fee = bigMulDiv($purchaseWei, $feeBps, 10000); // no underscore
  if ($fee === '0' && $purchaseWei !== '0') $fee = '1';
  return $fee;
}


/* ---------------- Keccak & ABI helpers for signing ---------------- */
function strip_0x(string $hex): string { return preg_replace('/^0x/i', '', $hex); }
function word_bytes32(string $hex): string {
  $h = strtolower(strip_0x($hex)); if (strlen($h) > 64) $h = substr($h, 0, 64);
  return str_pad($h, 64, '0', STR_PAD_LEFT);
}
function word_address(string $addr): string {
  $a = strtolower(strip_0x($addr));
  if (strlen($a) !== 40 || !preg_match('/^[0-9a-f]{40}$/', $a)) throw new Exception('Bad address');
  return str_pad($a, 64, '0', STR_PAD_LEFT);
}
function decToHex(string $dec): string {
  $dec = ltrim($dec, '0'); if ($dec === '') return '0';
  $hex = '';
  $num = $dec;
  while (bigCmp($num, '0') > 0) {
    // divide by 16
    $q = ''; $r = 0;
    for ($i = 0, $L = strlen($num); $i < $L; $i++) {
      $r = $r * 10 + (int)$num[$i];
      $digit = intdiv($r, 16);
      if (!($q === '' && $digit === 0)) $q .= (string)$digit;
      $r = $r % 16;
    }
    $hex = dechex($r) . $hex;
    $num = $q === '' ? '0' : $q;
  }
  return $hex;
}
function word_uint256(string $dec): string {
  $hex = decToHex($dec);
  if (strlen($hex) > 64) throw new Exception('uint256 too large');
  return str_pad($hex, 64, '0', STR_PAD_LEFT);
}
function keccak256_bin(string $bin): string { return hex2bin(Keccak::hash($bin, 256)); }
function keccak256_hex_of_hexwords(string $hexwords): string {
  $bin = hex2bin($hexwords);
  return Keccak::hash($bin, 256);
}
function sign_personal_hash_hex(string $hashHex, string $privHex): string {
  $ec = new EC('secp256k1');
  $key = $ec->keyFromPrivate(strip_0x($privHex), 'hex');
  $sig = $key->sign(strip_0x($hashHex), ['canonical' => true]);
  $r = str_pad($sig->r->toString(16), 64, '0', STR_PAD_LEFT);
  $s = str_pad($sig->s->toString(16), 64, '0', STR_PAD_LEFT);
  $v = 27 + $sig->recoveryParam; // 27/28
  return '0x' . $r . $s . sprintf('%02x', $v);
}

/* ---------------- JSON-RPC helpers ---------------- */
function rpc_call(string $rpc, array $payload): array {
  $ch = curl_init($rpc);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 8,
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  curl_close($ch);
  if ($resp === false) throw new Exception("RPC error: $err");
  $j = json_decode($resp, true);
  if (!is_array($j)) throw new Exception("Bad RPC JSON");
  return $j;
}
function selector4(string $sig): string {
  $h = Keccak::hash($sig, 256);
  return '0x' . substr($h, 0, 8);
}
function eth_call_uint256(string $rpc, string $to, string $data): string {
  $payload = [
    'jsonrpc' => '2.0',
    'method' => 'eth_call',
    'params' => [[ 'to' => $to, 'data' => $data ], 'latest'],
    'id' => 1
  ];
  $j = rpc_call($rpc, $payload);
  if (!empty($j['error'])) throw new Exception('eth_call error: '.$j['error']['message']);
  $res = $j['result'] ?? null;
  if (!is_string($res) || !preg_match('/^0x[0-9a-fA-F]*$/', $res)) throw new Exception('eth_call bad result');
  // result is 32-byte hex; counts fit in PHP int safely for your use
  $hex = strip_0x($res);
  $hex = ltrim($hex, '0'); if ($hex === '') return '0';
  $val = hexdec(strlen($hex) > 15 ? substr($hex, -15) : $hex); // safe for small values
  // If ever you expect > PHP_INT_MAX, replace with a full hex->dec string
  return (string)$val;
}
function get_lastGlobalCount(string $rpc, string $contract, string $referrer): int {
  $sel = selector4('lastGlobalCount(address)');
  $data = $sel . word_address($referrer);
  return (int) eth_call_uint256($rpc, $contract, $data);
}
function get_referralCounts(string $rpc, string $contract, string $referrer): int {
  $sel = selector4('referralCounts(address)');
  $data = $sel . word_address($referrer);
  return (int) eth_call_uint256($rpc, $contract, $data);
}

function get_contract_maxSyncFeeBps(string $rpc, string $contract): ?int {
  try {
    $sel = selector4('maxSyncFeeBps()');
    $bps = (int) eth_call_uint256($rpc, $contract, $sel);
    return $bps > 0 ? $bps : null;
  } catch (\Throwable $e) { return null; }
}

/* ---------------- Rate limit AFTER preflight ---------------- */
checkRateLimit();

/* ---------------- Method routing ---------------- */
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
if ($method === 'GET') {
  if ($action === 'health') {
    echo json_encode(['ok'=>true,'time'=>gmdate('c')]);
    logApiAccess('attest_health', true);
    exit;
  }
  json_exit(405, ['success'=>false,'error'=>'Method not allowed']);
}
if ($method !== 'POST') json_exit(405, ['success'=>false,'error'=>'Method not allowed']);

/* ---------------- API key (accept header or ?key= via .htaccess rewrite) ---------------- */
validateApiKey();

/* ---------------- Read + validate input (JSON or form) ---------------- */
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

// Fallback to form-encoded (application/x-www-form-urlencoded)
if (!is_array($input)) {
  $form = [];
  // Try parsing $raw first (works even without $_POST populated)
  parse_str($raw ?? '', $form);
  if (!$form) { $form = $_POST; }

  $input = [
    'referrer'            => $form['referrer']            ?? null,
    'buyerPlannedValueWei'=> $form['buyerPlannedValueWei']?? null,
    'chainId'             => $form['chainId']             ?? null,
  ];
}

// Now validate
$referrer = validateInput($input['referrer'] ?? '', 'eth_address');
$buyerPlannedValueWei = validateInput($input['buyerPlannedValueWei'] ?? '', 'uint256');
$chainIdStr = validateInput((string)($input['chainId'] ?? ''), 'uint256');


if (!$referrer || !$buyerPlannedValueWei || !$chainIdStr) {
  json_exit(400, ['success'=>false,'error'=>'Missing or invalid parameters. Required: referrer, buyerPlannedValueWei, chainId']);
}
$chainId = (int)$chainIdStr;

/* ---------------- Load config ---------------- */
global $attestation_config;
$chains = $attestation_config['chains'] ?? [];
if (!isset($chains[$chainId])) {
  json_exit(400, ['success'=>false,'error'=>"Unsupported chainId $chainId"]);
}
$rpc = $chains[$chainId]['rpc'];
$contract = $chains[$chainId]['contract'];
$tierThresholds = $attestation_config['tier_thresholds_desc'] ?? [930,430,180,80,40,15,5,0];
$feeBps = (int)($attestation_config['default_sync_fee_bps'] ?? 50);
$serverMaxBps = (int)($attestation_config['max_sync_fee_bps'] ?? 300);

/* ---------------- DB global count (your cross-chain store) ---------------- */
try {
  $pdo = getAttestationDbConnection();
} catch (\Throwable $e) { $pdo = null; }
$dbGlobal = 0;
try {
  if ($pdo) $dbGlobal = (int) getGlobalReferralCount($referrer, $pdo);
} catch (\Throwable $e) { /* ignore, keep 0 */ }

/* ---------------- On-chain state (this chain) ---------------- */
$prevGlobal = 0;
$localBefore = 0;
$contractMaxBps = null;

try { $prevGlobal = get_lastGlobalCount($rpc, $contract, $referrer); } catch (\Throwable $e) { $prevGlobal = 0; }
try { $localBefore = get_referralCounts($rpc, $contract, $referrer); } catch (\Throwable $e) { $localBefore = 0; }
try { $contractMaxBps = get_contract_maxSyncFeeBps($rpc, $contract); } catch (\Throwable $e) { $contractMaxBps = null; }

$localAfter = $localBefore + 1;

/* ---------------- Choose attestedGlobalCount (monotonic & usable) ---------------- */
/* ---------------- Compute global local count = sum over all configured chains ---------------- */
$sumLocal = 0;
try {
  $allChains = $attestation_config['chains'] ?? [];
  foreach ($allChains as $cid => $info) {
    // only sum chains that have both rpc and contract configured
    if (empty($info['rpc']) || empty($info['contract'])) continue;
    // read referralCounts(referrer) on that chain
    try {
      $cLocal = get_referralCounts($info['rpc'], $info['contract'], $referrer);
      $sumLocal += (int)$cLocal;
    } catch (\Throwable $e) {
      // ignore a single failing chain; keep summing
    }
  }
} catch (\Throwable $e) {
  // leave $sumLocal = 0 if something very wrong happens
}

// Anticipate this very purchase: global AFTER this tx = prior global sum + 1
$sumLocalAfter = $sumLocal + 1;

// We allow immediate use by ensuring >= localAfter; also monotonic vs prevGlobal and DB
$attestedGlobalCount = max($dbGlobal, $prevGlobal, $localAfter, $sumLocalAfter);

/* ---------------- Decide if tier-up will happen ---------------- */
$fromTier = tierLevelFromCount($prevGlobal, $tierThresholds);
$toTier   = tierLevelFromCount($attestedGlobalCount, $tierThresholds);

/* If attested < localAfter (shouldn’t happen with max(..,localAfter)), or no tier-up → fee=0 */
$syncFee = '0';

if ($attestedGlobalCount >= $localAfter && $toTier > $fromTier) {
  // Compute raw fee
  $raw = calculateSyncFee($buyerPlannedValueWei, $feeBps);

  // Apply caps: server cap and (if readable) contract cap
  $effectiveCapBps = $serverMaxBps;
  if (is_int($contractMaxBps) && $contractMaxBps > 0) {
    $effectiveCapBps = min($effectiveCapBps, $contractMaxBps);
  }
  $maxAllowed = bigMulDiv($buyerPlannedValueWei, $effectiveCapBps, 10000);

  if (bigCmp($raw, $maxAllowed) > 0) $raw = $maxAllowed;
  if ($raw === '0') $raw = '1'; // must be > 0 for tier-up branch

  $syncFee = $raw;
}

/* ---------------- Build signature ---------------- */
try {
  $deadline = time() + 15 * 60;

  // inner = keccak256(abi.encode(REFERRAL_PROJECT_ID, referrer, attestedGlobalCount, deadline, syncFee))
  $projectIdHex = Keccak::hash('BNBRF-REFERRAL-v1', 256); // bytes32 project id (hex, no 0x)
  $encodedWords =
      word_bytes32($projectIdHex)
    . word_address($referrer)
    . word_uint256((string)$attestedGlobalCount)
    . word_uint256((string)$deadline)
    . word_uint256((string)$syncFee);

  $innerHashHex = keccak256_hex_of_hexwords($encodedWords);

  // EIP-191 personal-sign of 32-byte inner hash
  $personalPayload = "\x19Ethereum Signed Message:\n32" . hex2bin($innerHashHex);
  $personalHashHex = Keccak::hash($personalPayload, 256);

  $priv = $attestation_config['signer_private_key'] ?? '';
  if ($priv === '') throw new Exception('Missing signer private key');
  $sig = sign_personal_hash_hex($personalHashHex, $priv);

  echo json_encode([
    'success' => true,
    'referrer' => $referrer,
    'attestedGlobalCount' => $attestedGlobalCount,
    'deadline' => $deadline,
    'syncFee' => $syncFee,              // "0" unless a tier-up will occur
    'sig' => $sig
  ]);
  logApiAccess('attest_success', true, "Referrer=$referrer, fromTier=$fromTier, toTier=$toTier, syncFee=$syncFee");
} catch (\Throwable $e) {
  logApiAccess('attest_error', false, $e->getMessage());
  json_exit(500, ['success'=>false,'error'=>'Attestation failed','message'=>$e->getMessage()]);
}
