<?php
// validate-email.php

error_reporting(E_ALL);
ini_set('display_errors', 0);

$allowedMethods = ['POST', 'OPTIONS'];
$allowedHeaders = ['Content-Type'];

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';

header('Content-Type: application/json');

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'deliverable' => false,
            'validFormat' => false,
            'message' => 'Invalid email format',
        ]);
        exit();
    }

    $result = validateEmail($email);

    if ($result === false) {
        throw new Exception('Failed to validate email');
    }

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
    ]);
}

function validateEmail($email)
{
    // Try cURL first
    $result = validateWithCurl($email);
    if ($result !== false) {
        return $result;
    }

    // Fallback to file_get_contents
    $result = validateWithFileGetContents($email);
    if ($result !== false) {
        return $result;
    }

    return false;
}

function validateWithCurl($email)
{
    if (!function_exists('curl_init')) {
        return false;
    }

    $apiKey = $_ENV['ZERO_BOUNCE_API_KEY'] ?? null;
    $url = "https://api.zerobounce.net/v2/validate?api_key={$apiKey}&email=" . urlencode($email);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    // For local development - disable SSL (remove in production)
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // ENABLE SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); // ENABLE host verification

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error || empty($response)) {
        error_log("cURL error for $email: $error");
        return false;
    }

    return parseResponse($response);
}

function validateWithFileGetContents($email)
{
    $apiKey = $_ENV['ZERO_BOUNCE_API_KEY'] ?? null;
    $url = "https://api.zerobounce.net/v2/validate?api_key={$apiKey}&email=" . urlencode($email);

    // Create context with SSL disabled for local testing
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
        'http' => [
            'timeout' => 30,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        error_log("file_get_contents failed for $email");
        return false;
    }

    return parseResponse($response);
}

function parseResponse($response)
{
    $data = json_decode($response, true);

    if (!$data) {
        error_log('Invalid JSON response: ' . substr($response, 0, 200));
        return false;
    }

    // Parse ZeroBounce response
    $status = strtolower($data['status'] ?? '');
    $deliverable = in_array($status, ['valid', 'catch-all']);
    $hostExists =
        isset($data['mx_found']) && ($data['mx_found'] === 'true' || $data['mx_found'] === true);

    // Check disposable email
    $isDisposable = false;
    if (isset($data['sub_status'])) {
        $subStatus = strtolower($data['sub_status']);
        $isDisposable =
            strpos($subStatus, 'disposable') !== false || strpos($subStatus, 'temporary') !== false;
    }

    return [
        'deliverable' => $deliverable,
        'validFormat' => !in_array($status, ['invalid', 'unknown']),
        'hostExists' => $hostExists,
        'message' => $deliverable
            ? 'Email is valid and deliverable'
            : 'Email may not exist or is not deliverable',
        'status' => $status,
        'is_disposable' => $isDisposable,
        'free_email' => $data['free_email'] ?? null,
        'domain' => $data['domain'] ?? null,
        'raw_data' => $data,
    ];
}
?>
