<?php
namespace App\Services;

if (!class_exists('\Dotenv\Dotenv')) {
    $autoload = __DIR__ . '/../../vendor/autoload.php';
    if (file_exists($autoload)) {
        require_once $autoload;
    }
}

if (class_exists('\Dotenv\Dotenv')) {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');

    if (file_exists(__DIR__ . '/../.env')) {
        $dotenv->load();
    }
}

class B2StorageService
{
    // B2's native API, v2 (simple top-level auth response, well-supported).
    private $authApiBase = 'https://api.backblazeb2.com/b2api/v2';

    private $keyId;
    private $applicationKey;
    private $bucketId;
    private $bucketName;

    // Populated by authorize()
    private $apiUrl;
    private $downloadUrl;
    private $authorizationToken;

    // Cached per-instance so repeated calls (e.g. upload then getPublicUrl)
    // don't re-authenticate or re-fetch an upload URL unnecessarily.
    private $uploadUrl;
    private $uploadAuthToken;

    public function __construct()
    {
        $this->keyId = $_ENV['B2_KEY_ID'] ?? getenv('B2_KEY_ID');
        $this->applicationKey = $_ENV['B2_APPLICATION_KEY'] ?? getenv('B2_APPLICATION_KEY');
        $this->bucketId = $_ENV['B2_BUCKET_ID'] ?? getenv('B2_BUCKET_ID');
        $this->bucketName = $_ENV['B2_BUCKET_NAME'] ?? getenv('B2_BUCKET_NAME');

        if (
            empty($this->keyId) ||
            empty($this->applicationKey) ||
            empty($this->bucketId) ||
            empty($this->bucketName)
        ) {
            throw new \Exception(
                'Backblaze B2 credentials not configured. Check that B2_KEY_ID, B2_APPLICATION_KEY, ' .
                    'B2_BUCKET_ID and B2_BUCKET_NAME are set and your env loader is working.',
            );
        }

        $this->authorize();
    }

    public function getBucket()
    {
        return $this->bucketName;
    }

    /**
     * Authenticates against B2 and stores the apiUrl/downloadUrl/authorizationToken
     * needed for every subsequent call.
     */
    private function authorize()
    {
        $url = $this->authApiBase . '/b2_authorize_account';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Basic ' . base64_encode($this->keyId . ':' . $this->applicationKey),
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log(
            '[B2StorageService::authorize] Status: ' .
                $status .
                ' | CurlErrNo: ' .
                $curlErrNo .
                ' | CurlError: ' .
                $curlError,
        );

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 authorization connection failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("B2 authorization failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        if (!isset($data['apiUrl'], $data['downloadUrl'], $data['authorizationToken'])) {
            throw new \Exception('Unexpected response from B2 authorize endpoint: ' . $response);
        }

        $this->apiUrl = rtrim($data['apiUrl'], '/');
        $this->downloadUrl = rtrim($data['downloadUrl'], '/');
        $this->authorizationToken = $data['authorizationToken'];
    }

    /**
     * B2 requires a fresh (or reused, until it stops working) upload URL + token
     * per bucket, obtained via b2_get_upload_url.
     */
    private function getUploadUrl()
    {
        if ($this->uploadUrl && $this->uploadAuthToken) {
            return [
                'uploadUrl' => $this->uploadUrl,
                'authorizationToken' => $this->uploadAuthToken,
            ];
        }

        $url = $this->apiUrl . '/b2api/v2/b2_get_upload_url';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['bucketId' => $this->bucketId]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authorizationToken,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 get_upload_url connection failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("B2 get_upload_url failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        if (!isset($data['uploadUrl'], $data['authorizationToken'])) {
            throw new \Exception(
                'Unexpected response from B2 get_upload_url endpoint: ' . $response,
            );
        }

        $this->uploadUrl = $data['uploadUrl'];
        $this->uploadAuthToken = $data['authorizationToken'];

        return ['uploadUrl' => $this->uploadUrl, 'authorizationToken' => $this->uploadAuthToken];
    }

    /**
     * B2 file names are percent-encoded UTF-8, but forward slashes are kept
     * unescaped so "folders" render correctly in the B2 console / listings.
     */
    private function encodePath($path)
    {
        return implode('/', array_map('rawurlencode', explode('/', trim($path, '/'))));
    }

    public function upload($tmpFile, $folder, $filename)
    {
        if (!is_readable($tmpFile)) {
            throw new \Exception("Cannot read source file: $tmpFile");
        }

        $folder = trim($folder, '/');
        $filename = trim($filename, '/');

        $path = $folder . '/' . $filename;
        $encodedPath = $this->encodePath($path);

        $file = file_get_contents($tmpFile);
        if ($file === false) {
            throw new \Exception("Failed to read file contents from: $tmpFile");
        }

        $mimeType = function_exists('mime_content_type')
            ? (mime_content_type($tmpFile) ?:
            'application/octet-stream')
            : 'application/octet-stream';

        $sha1 = sha1($file);

        $upload = $this->getUploadUrl();

        error_log('[B2StorageService] Uploading to path: [' . $path . '] length=' . strlen($file));

        $ch = curl_init($upload['uploadUrl']);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $file,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $upload['authorizationToken'],
                'X-Bz-File-Name: ' . $encodedPath,
                'Content-Type: ' . $mimeType,
                'X-Bz-Content-Sha1: ' . $sha1,
                'Content-Length: ' . strlen($file),
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log(
            sprintf(
                '[B2StorageService::upload] Path: %s | Status: %s | CurlErrNo: %s | CurlError: %s | Response: %s',
                $path,
                $status,
                $curlErrNo,
                $curlError,
                is_string($response) ? substr($response, 0, 500) : '(non-string response)',
            ),
        );

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 upload connection failed: ' . $curlError);
        }

        // An expired/invalid upload URL comes back as 401; drop the cached one
        // so the next call fetches a fresh one instead of failing forever.
        if ($status === 401) {
            $this->uploadUrl = null;
            $this->uploadAuthToken = null;
        }

        if ($status >= 300) {
            throw new \Exception("B2 upload failed (HTTP $status): " . $response);
        }

        return ['path' => $path];
    }

    public function getPublicUrl($path)
    {
        $encodedPath = $this->encodePath($path);
        return $this->downloadUrl . '/file/' . $this->bucketName . '/' . $encodedPath;
    }

    public function getSignedUrl($path, $expiresInSeconds = 3600)
    {
        $path = trim($path, '/');
        $encodedPath = $this->encodePath($path);
        $url = $this->apiUrl . '/b2api/v2/b2_get_download_authorization';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'bucketId' => $this->bucketId,
                'fileNamePrefix' => $path,
                'validDurationInSeconds' => $expiresInSeconds,
            ]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authorizationToken,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 get_download_authorization request failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception(
                "B2 get_download_authorization failed (HTTP $status): " . $response,
            );
        }

        $data = json_decode($response, true);
        if (!isset($data['authorizationToken'])) {
            throw new \Exception(
                'Unexpected response from B2 get_download_authorization endpoint: ' . $response,
            );
        }

        return $this->downloadUrl .
            '/file/' .
            $this->bucketName .
            '/' .
            $encodedPath .
            '?Authorization=' .
            $data['authorizationToken'];
    }

    public function listObjects($prefix = '')
    {
        $url = $this->apiUrl . '/b2api/v2/b2_list_file_names';

        $prefix = trim($prefix, '/');
        $normalizedPrefix = $prefix !== '' ? $prefix . '/' : '';

        $body = json_encode([
            'bucketId' => $this->bucketId,
            'prefix' => $normalizedPrefix,
            'delimiter' => '/',
            'maxFileCount' => 1000,
        ]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authorizationToken,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 list failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("B2 list failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        // Normalize to a flat array of file/folder entries, mirroring the
        // shape callers used to get from Backblaze's list endpoint.
        return is_array($data) && isset($data['files']) ? $data['files'] : [];
    }

    public function findFileInSubfolders($rootPrefix, $fileName, $subPathSegments = [])
    {
        $rootPrefix = trim($rootPrefix, '/');
        $entries = $this->listObjects($rootPrefix);

        foreach ($entries as $entry) {
            // With delimiter='/', B2 marks pseudo-folders with action "folder"
            // (no real fileId) — that's our analogue of Backblaze's folder rows.
            if (($entry['action'] ?? null) !== 'folder') {
                continue;
            }

            $folderPath = rtrim($entry['fileName'] ?? '', '/');
            if (!$folderPath) {
                continue;
            }

            $candidatePrefix = $folderPath;
            if (!empty($subPathSegments)) {
                $candidatePrefix .= '/' . implode('/', $subPathSegments);
            }

            $files = $this->listObjects($candidatePrefix);

            foreach ($files as $file) {
                $name = $file['fileName'] ?? '';
                if (basename($name) === $fileName) {
                    return $candidatePrefix . '/' . $fileName;
                }
            }
        }

        return null;
    }

    /**
     * B2 identifies a file by (fileName, fileId), not by path alone, so
     * deleting requires looking up the current version's fileId first via
     * b2_list_file_versions. Returns null if no file exists at this path.
     */
    private function getFileId($path)
    {
        $path = trim($path, '/');
        $url = $this->apiUrl . '/b2api/v2/b2_list_file_versions';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'bucketId' => $this->bucketId,
                'startFileName' => $path,
                'maxFileCount' => 1,
            ]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authorizationToken,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 list_file_versions connection failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("B2 list_file_versions failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        $files = $data['files'] ?? [];

        // startFileName is a lower bound for the listing, not an exact
        // filter — B2 can return the next file alphabetically after $path
        // if $path itself doesn't exist. Confirm an exact name match
        // before trusting the result, or we'd delete the wrong file.
        if (!empty($files) && ($files[0]['fileName'] ?? null) === $path) {
            return $files[0]['fileId'] ?? null;
        }

        return null;
    }

    /**
     * Deletes every stored version of the file at $path. This is what
     * ApplicationController::cleanupUploadedFiles() calls to roll back an
     * upload when the surrounding DB transaction fails, so a partial
     * submission doesn't leave an orphaned file sitting in the bucket
     * forever with nothing in the database pointing at it.
     *
     * Returns true if the file was deleted (or never existed — that's
     * still the desired end state). Throws on an actual B2/network error
     * so the caller's catch block can log it; cleanupUploadedFiles()
     * already wraps each call individually, so one failed delete won't
     * stop the rest from being attempted.
     */
    public function delete($path)
    {
        $path = trim($path, '/');

        $fileId = $this->getFileId($path);

        if ($fileId === null) {
            return true;
        }

        $url = $this->apiUrl . '/b2api/v2/b2_delete_file_version';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'fileName' => $path,
                'fileId' => $fileId,
            ]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authorizationToken,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log(
            sprintf(
                '[B2StorageService::delete] Path: %s | FileId: %s | Status: %s | CurlErrNo: %s | CurlError: %s',
                $path,
                $fileId,
                $status,
                $curlErrNo,
                $curlError,
            ),
        );

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 delete_file_version connection failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("B2 delete_file_version failed (HTTP $status): " . $response);
        }

        return true;
    }

    public function download($path)
    {
        $path = trim($path, '/');
        $encodedPath = $this->encodePath($path);
        $url = $this->downloadUrl . '/file/' . $this->bucketName . '/' . $encodedPath;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Authorization: ' . $this->authorizationToken],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('B2 download connection failed: ' . $curlError);
        }

        if ($status === 404) {
            return null;
        }

        if ($status >= 300) {
            throw new \Exception("B2 download failed (HTTP $status): " . $response);
        }

        return [
            'content' => $response,
            'content_type' => $contentType ?: 'application/octet-stream',
        ];
    }
}