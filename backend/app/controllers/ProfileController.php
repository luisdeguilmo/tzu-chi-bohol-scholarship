<?php

class ProfileController
{
    public function view()
    {
        $fileName = basename($_GET['file'] ?? '');
        $type = $_GET['type'] ?? ''; // activities | applications

        if (!$fileName || !$type) {
            http_response_code(400);
            exit('File and type are required');
        }

        // Allowed upload roots
        $allowedTypes = ['applications', 'users'];

        if (!in_array($type, $allowedTypes, true)) {
            http_response_code(400);
            exit('Invalid type');
        }

        // Dynamically resolve base directory
        $baseDir = realpath(__DIR__ . "/../../public/upload/{$type}");

        if (!$baseDir) {
            http_response_code(500);
            exit('Server error');
        }

        $pattern = $baseDir . '/*/profile/' . $fileName;
        $matches = glob($pattern);

        if (!$matches || !isset($matches[0])) {
            http_response_code(404);
            exit('Not found');
        }

        $fullPath = realpath($matches[0]);

        // Security check
        if (!$fullPath || strpos($fullPath, $baseDir) !== 0) {
            http_response_code(403);
            exit('Invalid file');
        }

        if (ob_get_length()) {
            ob_end_clean();
        }

        require_once __DIR__ . '/../../config/bootstrap.php';

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $fullPath);
        finfo_close($finfo);

        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: inline; filename="' . basename($fullPath) . '"');
        header('Content-Length: ' . filesize($fullPath));
        header('Cache-Control: public, max-age=0');

        readfile($fullPath);
        exit();
    }
}
