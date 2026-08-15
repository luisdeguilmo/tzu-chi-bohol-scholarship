<?php
namespace App\Controllers;

require_once __DIR__ . "/../../config/Database.php";
require_once __DIR__ . "/../Services/B2StorageService.php";

use Config\Database;
use App\Services\B2StorageService;

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');

if (file_exists(__DIR__ . '/../../.env')) {
    $dotenv->load();
}

class FileController
{
    private $pdo;
    private $storage;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();

        $this->storage = new B2StorageService();
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
            $downloaded = $this->storage->download($file['file_path']);
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

    private function getFileRecord($type, $fileId)
    {
        $tableMap = [
            'coe_grades' => 'coe_and_grade_files',
            'activities' => 'certificate_of_appearance',
            'applications' => 'application_files',
        ];

        $table = $tableMap[$type];

        error_log("[FileController::getFileRecord] Querying table=\"$table\" for id=\"$fileId\"");

        $stmt = $this->pdo->prepare("SELECT file_path FROM $table WHERE id = :id LIMIT 1");
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