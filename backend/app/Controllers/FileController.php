<?php
namespace App\Controllers;

require_once __DIR__ . "/../../config/Database.php";

use Config\Database;

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');

if (file_exists(__DIR__ . '/../../.env')) {
    $dotenv->load();
}

class FileController
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

        error_log("[FileController::view] Request received | id=\"$fileId\" | type=\"$type\"");

        if (!$fileId || !$type) {
            error_log('[FileController::view] Missing id or type');
            http_response_code(400);
            exit('File ID and type are required');
        }

        $allowedTypes = ['activities', 'applications', 'coe_grades'];

        if (!in_array($type, $allowedTypes, true)) {
            error_log("[FileController::view] Invalid type requested: \"$type\"");
            http_response_code(400);
            exit('Invalid type');
        }

        $file = $this->getFileRecord($type, $fileId);

        if (!$file) {
            error_log(
                "[FileController::view] No DB record found for type=\"$type\" id=\"$fileId\"",
            );
            http_response_code(404);
            exit('Not found');
        }

        error_log("[FileController::view] DB record found | path=\"{$file['file_path']}\"");

        $downloadStart = microtime(true);

        try {
            $downloaded = $this->download($file['file_path']);
        } catch (\Exception $e) {
            error_log(
                "[FileController::view] Download EXCEPTION for path=\"{$file['file_path']}\": " .
                    $e->getMessage(),
            );
            error_log('[FileController::view] Stack trace: ' . $e->getTraceAsString());
            http_response_code(500);
            exit('Server error: ' . $e->getMessage()); // <-- show the actual error
        }
        $downloadMs = round((microtime(true) - $downloadStart) * 1000, 2);

        if (!$downloaded) {
            error_log(
                "[FileController::view] File missing in storage | path=\"{$file['file_path']}\" after {$downloadMs}ms",
            );
            http_response_code(404);
            exit('Not found');
        }

        error_log(
            "[FileController::view] Download succeeded in {$downloadMs}ms | path=\"{$file['file_path']}\" | content_type=\"{$downloaded['content_type']}\" | size=" .
                strlen($downloaded['content']) .
                ' bytes',
        );

        if (ob_get_length()) {
            ob_end_clean();
        }

        $disposition = isset($_GET['download']) ? 'attachment' : 'inline';
        $fileName = basename($file['file_path']);

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

        error_log("[FileController::download] Fetching URL=\"$url\"");

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
            "[FileController::download] HTTP=$status | content_type=\"$contentType\" | curlErrNo=$curlErrNo",
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
        $tableMap = [
            'coe_grades' => 'coe_and_grade_files',
            'activities' => 'certificate_of_appearance',
            'applications' => 'application_files',
        ];

        $table = $tableMap[$type];

        error_log("[FileController::getFileRecord] Querying table=\"$table\" for id=\"$fileId\"");

        $stmt = $this->pdo->prepare("SELECT * FROM $table WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $fileId);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        error_log(
            '[FileController::getFileRecord] ' .
                ($row ? 'Record found' : 'No record found') .
                " | id=\"$fileId\"",
        );

        return $row ?: null;
    }
}
