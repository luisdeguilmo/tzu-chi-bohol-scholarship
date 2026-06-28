<?php

use App\Services\SupabaseStorageService;

class FileController
{
    public function view()
    {
        require_once __DIR__ . '/../../config/bootstrap.php';

        $fileName = basename($_GET['file'] ?? '');
        $type = $_GET['type'] ?? ''; // activities | applications | coe_grades

        error_log("[FileController::view] Request received | file=\"$fileName\" | type=\"$type\"");

        if (!$fileName || !$type) {
            error_log('[FileController::view] Missing file or type');
            http_response_code(400);
            exit('File and type are required');
        }

        $allowedTypes = ['activities', 'applications', 'coe_grades'];

        if (!in_array($type, $allowedTypes, true)) {
            error_log("[FileController::view] Invalid type requested: \"$type\"");
            http_response_code(400);
            exit('Invalid type');
        }

        // --- AUTH ---
        $currentScholarId = $_SESSION['scholar_id'] ?? null;
        $isAdmin = ($_SESSION['role'] ?? null) === 'admin';

        if (!$currentScholarId && !$isAdmin) {
            error_log(
                "[FileController::view] Unauthenticated request | type=\"$type\" | file=\"$fileName\"",
            );
            http_response_code(401);
            exit('Authentication required');
        }

        // --- LOOK UP FILE RECORD ---
        $file = $this->getFileRecord($type, $fileName, $currentScholarId, $isAdmin);

        if (!$file) {
            error_log(
                "[FileController::view] No DB record found for type=\"$type\" file=\"$fileName\"",
            );
            http_response_code(404);
            exit('Not found');
        }

        // Ownership already enforced inside the query itself for non-admins
        // (see getFileRecord), so no separate post-check needed here.

        // --- AUDIT LOG ---
        error_log(
            sprintf(
                '[FileController::view] ACCESS | scholar_id=%s | type=%s | file=%s | ip=%s | time=%s',
                $currentScholarId ?? 'admin',
                $type,
                $fileName,
                $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                date('Y-m-d H:i:s'),
            ),
        );

        // --- FETCH FROM SUPABASE ---
        $downloadStart = microtime(true);

        try {
            $storage = new SupabaseStorageService();
            $downloaded = $storage->download($file['file_path']);
        } catch (\Exception $e) {
            error_log(
                "[FileController::view] Download EXCEPTION for path=\"{$file['file_path']}\": " .
                    $e->getMessage(),
            );
            http_response_code(500);
            exit('Server error');
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

        header('Content-Type: ' . $downloaded['content_type']);
        header('Content-Disposition: ' . $disposition . '; filename="' . $fileName . '"');
        header('Content-Length: ' . strlen($downloaded['content']));
        header('Cache-Control: private, max-age=0, must-revalidate');
        header('X-Content-Type-Options: nosniff');

        error_log(
            "[FileController::view] Streaming response to client | type=\"$type\" | file=\"$fileName\"",
        );

        echo $downloaded['content'];
        exit();
    }

    /**
     * Looks up a file record scoped to the requesting scholar (unless admin).
     *
     * - 'coe_grades': scholar_id lives directly on the file row.
     * - 'activities' / 'applications': file rows store application_id, which
     *   is joined against the `applications` table to find scholar_id.
     *
     * TODO CONFIRM: table names `activity_files` / `application_files`, and
     * that `applications.scholar_id` is the correct owner column. Adjust the
     * three case blocks below if any of these differ from your real schema.
     */
    private function getFileRecord($type, $fileName, $currentScholarId, $isAdmin)
    {
        global $pdo; // ASSUMPTION: adjust if your bootstrap exposes this differently.

        switch ($type) {
            case 'coe_grades':
                if ($isAdmin) {
                    $query =
                        'SELECT * FROM coe_and_grade_files WHERE file_name = :file_name LIMIT 1';
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                } else {
                    $query = "SELECT * FROM coe_and_grade_files
                              WHERE file_name = :file_name AND scholar_id = :owner_id LIMIT 1";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                    $stmt->bindParam(':owner_id', $currentScholarId);
                }
                break;

            case 'activities':
                if ($isAdmin) {
                    $query = "SELECT af.*, a.scholar_id
                              FROM activity_files af
                              JOIN applications a ON a.id = af.application_id
                              WHERE af.file_name = :file_name LIMIT 1";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                } else {
                    $query = "SELECT af.*, a.scholar_id
                              FROM activity_files af
                              JOIN applications a ON a.id = af.application_id
                              WHERE af.file_name = :file_name AND a.scholar_id = :owner_id LIMIT 1";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                    $stmt->bindParam(':owner_id', $currentScholarId);
                }
                break;

            case 'applications':
                if ($isAdmin) {
                    $query = "SELECT apf.*, a.scholar_id
                              FROM application_files apf
                              JOIN applications a ON a.id = apf.application_id
                              WHERE apf.file_name = :file_name LIMIT 1";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                } else {
                    $query = "SELECT apf.*, a.scholar_id
                              FROM application_files apf
                              JOIN applications a ON a.id = apf.application_id
                              WHERE apf.file_name = :file_name AND a.scholar_id = :owner_id LIMIT 1";
                    $stmt = $pdo->prepare($query);
                    $stmt->bindParam(':file_name', $fileName);
                    $stmt->bindParam(':owner_id', $currentScholarId);
                }
                break;

            default:
                return null;
        }

        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}
