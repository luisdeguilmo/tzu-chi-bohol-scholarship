<?php
namespace App\Controllers;

require_once __DIR__ . '/../../config/Database.php';

use Config\Database;

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');

if (file_exists(__DIR__ . '/../../.env')) {
    $dotenv->load();
}

class ProfileController
{
    private $pdo;
    private $supabaseUrl;
    private $serviceKey;
    private $bucket = 'scholarship-files';

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();

        $this->supabaseUrl = $_ENV['SUPABASE_URL'] ?? getenv('SUPABASE_URL');
        $this->serviceKey = $_ENV['SUPABASE_SERVICE_KEY'] ?? getenv('SUPABASE_SERVICE_KEY');
    }

    public function view()
    {
        $fileId = $_GET['id'] ?? '';
        $type = $_GET['type'] ?? '';

        error_log("[ProfileController::view] Request received | id=\"$fileId\" | type=\"$type\"");

        if (!$fileId || !$type) {
            error_log('[ProfileController::view] Missing id or type');
            http_response_code(400);
            exit('File ID and type are required');
        }

        $allowedTypes = ['applications', 'users'];

        if (!in_array($type, $allowedTypes, true)) {
            error_log("[ProfileController::view] Invalid type requested: \"$type\"");
            http_response_code(400);
            exit('Invalid type');
        }

        $file = $this->getFileRecord($type, $fileId);

        if (!$file) {
            echo
                "[ProfileController::view] No DB record found for type=\"$type\" id=\"$fileId\"";
            http_response_code(404);
            exit('Not found');
        }

        // Strip the bucket prefix from the stored path if present
        // e.g. "scholarship-files/applications/123/profile/image.jpg" -> "applications/123/profile/image.jpg"
        $storedPath = $file['file_path'];
        $bucketPrefix = $this->bucket . '/';
        if (str_starts_with($storedPath, $bucketPrefix)) {
            $storedPath = substr($storedPath, strlen($bucketPrefix));
        }

        error_log("[ProfileController::view] DB record found | resolved_path=\"$storedPath\"");

        $downloadStart = microtime(true);

        try {
            $downloaded = $this->download($storedPath);
        } catch (\Exception $e) {
            error_log(
                "[ProfileController::view] Download EXCEPTION for path=\"$storedPath\": " .
                    $e->getMessage(),
            );
            error_log('[ProfileController::view] Stack trace: ' . $e->getTraceAsString());
            http_response_code(500);
            exit('Server error: ' . $e->getMessage());
        }

        $downloadMs = round((microtime(true) - $downloadStart) * 1000, 2);

        if (!$downloaded) {
            echo "[ProfileController::view] File missing in storage | path=\"$storedPath\" after {$downloadMs}ms";
            http_response_code(404);
            exit('Not found');
        }

        error_log(
            "[ProfileController::view] Download succeeded in {$downloadMs}ms | path=\"$storedPath\" | content_type=\"{$downloaded['content_type']}\" | size=" .
                strlen($downloaded['content']) .
                ' bytes',
        );

        if (ob_get_length()) {
            ob_end_clean();
        }

        $disposition = isset($_GET['download']) ? 'attachment' : 'inline';
        $fileName = basename($storedPath);

        header('Content-Type: ' . $downloaded['content_type']);
        header('Content-Disposition: ' . $disposition . '; filename="' . $fileName . '"');
        header('Content-Length: ' . strlen($downloaded['content']));
        header('Cache-Control: private, max-age=0, must-revalidate');
        header('X-Content-Type-Options: nosniff');

        echo $downloaded['content'];
        exit();
    }

    private function download($path)
    {
        $path = trim($path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $url = $this->supabaseUrl . '/storage/v1/object/' . $this->bucket . '/' . $encodedPath;

        error_log("[ProfileController::download] Fetching URL=\"$url\"");

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->serviceKey,
                'apikey: ' . $this->serviceKey,
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log(
            "[ProfileController::download] HTTP=$status | content_type=\"$contentType\" | curlErrNo=$curlErrNo",
        );

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('Supabase download connection failed: ' . $curlError);
        }

        if ($status === 404) {
            return null;
        }

        if ($status >= 300) {
            throw new \Exception("Supabase download failed (HTTP $status): " . $response);
        }

        return [
            'content' => $response,
            'content_type' => $contentType ?: 'application/octet-stream',
        ];
    }

    private function getFileRecord($type, $fileId)
    {
        $stmt = $this->pdo->prepare(
            'SELECT file_path FROM profile_pictures WHERE application_id = :id LIMIT 1',
        );
        $stmt->bindParam(':id', $fileId);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        error_log(
            '[ProfileController::getFileRecord] ' .
                ($row ? 'Record found' : 'No record found') .
                " | id=\"$fileId\"",
        );

        return $row ?: null;
    }
}
