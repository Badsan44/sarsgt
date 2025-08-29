cat > composer_check.php <<'PHP'
<?php
require __DIR__ . '/vendor/autoload.php';
echo json_encode([
  'autoload' => file_exists(__DIR__ . '/vendor/autoload.php'),
  'elliptic' => class_exists(\Elliptic\EC::class),
  'keccak'   => class_exists(\kornrunner\Keccak::class),
]);