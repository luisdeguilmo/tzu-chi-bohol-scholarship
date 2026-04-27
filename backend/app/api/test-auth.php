<?php
// test_auth.php - place in your root, access it directly
var_dump([
    'getallheaders' => getallheaders(),
    'HTTP_AUTHORIZATION' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET',
    'REDIRECT_HTTP_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'NOT SET',
    'all_server' => array_filter($_SERVER, fn($key) => str_contains(strtolower($key), 'auth'), ARRAY_FILTER_USE_KEY),
]);