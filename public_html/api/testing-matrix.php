<?php
/**
 * Simple API for persisting testing matrix state to JSON files.
 *
 * GET  ?tester=name  → returns saved state (or empty default)
 * POST ?tester=name  → saves state from request body
 * GET  ?list=1       → returns array of all tester names
 */

// Storage directory (outside web root)
$storageDir = dirname(__DIR__, 2) . '/storage/testing';

if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}

header('Content-Type: application/json');

// List all testers
if (isset($_GET['list'])) {
    $files = glob($storageDir . '/*.json');
    $testers = [];
    foreach ($files as $file) {
        $name = basename($file, '.json');
        $mtime = filemtime($file);
        $testers[] = [
            'name' => $name,
            'lastSaved' => date('c', $mtime),
        ];
    }
    usort($testers, fn($a, $b) => strcmp($a['name'], $b['name']));
    echo json_encode($testers);
    exit;
}

// Tester name is required for load/save
$tester = $_GET['tester'] ?? $_POST['tester'] ?? '';
$tester = preg_replace('/[^a-zA-Z0-9_-]/', '', $tester);

if ($tester === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid tester name']);
    exit;
}

$filePath = $storageDir . '/' . $tester . '.json';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input) || !isset($input['statuses'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payload']);
        exit;
    }

    $data = [
        'statuses' => !empty($input['statuses']) ? (object)$input['statuses'] : new \stdClass(),
        'notes' => !empty($input['notes']) ? (object)$input['notes'] : new \stdClass(),
        'lastSaved' => date('c'),
    ];

    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['ok' => true]);
    exit;
}

// GET — load state
if (file_exists($filePath)) {
    readfile($filePath);
} else {
    echo json_encode(['statuses' => new \stdClass(), 'notes' => new \stdClass()]);
}
