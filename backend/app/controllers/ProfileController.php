<?php

class ProfileController
{
    public function view()
    {
        $fileName = basename($_GET['file'] ?? '');

        if (!$fileName) {
            http_response_code(400);
            exit('File required');
        }

        $baseDir = realpath(__DIR__ . '/../../public/upload/applications');

        if (!$baseDir) {
            http_response_code(500);
            exit('Server error');
        }

        // Search recursively in all applications/*/files/
        $pattern = $baseDir . '/*/profile/' . $fileName;
        $matches = glob($pattern);

        if (!$matches || !isset($matches[0])) {
            http_response_code(404);
            exit('Not found');
        }

        $fullPath = realpath($matches[0]);

        if (!$fullPath || strpos($fullPath, $baseDir) !== 0) {
            http_response_code(403);
            exit('Invalid file');
        }

        if (ob_get_length()) {
            ob_end_clean();
        }

        $allowedMethods = ['GET', 'POST', 'OPTIONS'];
        $allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

        require_once __DIR__ . '/../../config/bootstrap.php';

        // header('Content-Type: application/pdf');
        // header('Content-Disposition: inline; filename="' . basename($fullPath) . '"');
        // header('Content-Length: ' . filesize($fullPath));
        // header('Cache-Control: public, max-age=0');

        // readfile($fullPath);
        // exit();

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