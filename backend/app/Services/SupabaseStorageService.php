<?php
namespace App\Services;

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv->load();
}

class SupabaseStorageService
{
    private $supabaseUrl;
    private $serviceKey;
    private $bucket = 'scholarship-files';

    public function __construct()
    {
        $this->supabaseUrl = $_ENV['SUPABASE_URL'] ?? getenv('SUPABASE_URL');
        $this->serviceKey = $_ENV['SUPABASE_SERVICE_KEY'] ?? getenv('SUPABASE_SERVICE_KEY');

        if (empty($this->supabaseUrl) || empty($this->serviceKey)) {
            throw new \Exception(
                'Supabase credentials not configured. Check that SUPABASE_URL and SUPABASE_SERVICE_KEY are set and your env loader is working.',
            );
        }

        $this->supabaseUrl = rtrim($this->supabaseUrl, '/');
    }

    public function getBucket()
    {
        return $this->bucket;
    }

    public function upload($tmpFile, $folder, $filename)
    {
        if (!is_readable($tmpFile)) {
            throw new \Exception("Cannot read source file: $tmpFile");
        }

        $folder = trim($folder, '/');
        $filename = trim($filename, '/');

        $path = $folder . '/' . $filename;
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $url = $this->supabaseUrl . '/storage/v1/object/' . $this->bucket . '/' . $encodedPath;

        error_log(
            '[SupabaseStorageService] Constructed URL: [' . $url . '] length=' . strlen($url),
        );

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            throw new \Exception('Constructed upload URL is invalid: "' . $url . '"');
        }

        $file = file_get_contents($tmpFile);
        if ($file === false) {
            throw new \Exception("Failed to read file contents from: $tmpFile");
        }

        $mimeType = function_exists('mime_content_type')
            ? (mime_content_type($tmpFile) ?:
            'application/octet-stream')
            : 'application/octet-stream';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $file,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->serviceKey,
                'apikey: ' . $this->serviceKey,
                'Content-Type: ' . $mimeType,
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log(
            sprintf(
                '[SupabaseStorageService::upload] URL: %s | Status: %s | CurlErrNo: %s | CurlError: %s | Response: %s',
                $url,
                $status,
                $curlErrNo,
                $curlError,
                is_string($response) ? substr($response, 0, 500) : '(non-string response)',
            ),
        );

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('Supabase upload connection failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("Supabase upload failed (HTTP $status): " . $response);
        }

        return ['path' => $path];
    }

    public function getPublicUrl($path)
    {
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', trim($path, '/'))));
        return $this->supabaseUrl .
            '/storage/v1/object/public/' .
            $this->bucket .
            '/' .
            $encodedPath;
    }

    public function getSignedUrl($path, $expiresInSeconds = 3600)
    {
        $path = trim($path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $url = $this->supabaseUrl . '/storage/v1/object/sign/' . $this->bucket . '/' . $encodedPath;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['expiresIn' => $expiresInSeconds]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->serviceKey,
                'apikey: ' . $this->serviceKey,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('Supabase sign request failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("Supabase sign request failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        if (!isset($data['signedURL'])) {
            throw new \Exception('Unexpected response from Supabase sign endpoint: ' . $response);
        }

        return $this->supabaseUrl . '/storage/v1' . $data['signedURL'];
    }

    public function listObjects($prefix = '')
    {
        $url = $this->supabaseUrl . '/storage/v1/object/list/' . $this->bucket;

        $body = json_encode([
            'prefix' => trim($prefix, '/') . ($prefix !== '' ? '/' : ''),
            'limit' => 1000,
            'offset' => 0,
            'sortBy' => ['column' => 'name', 'order' => 'asc'],
        ]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->serviceKey,
                'apikey: ' . $this->serviceKey,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErrNo !== 0) {
            throw new \Exception('Supabase list failed: ' . $curlError);
        }

        if ($status >= 300) {
            throw new \Exception("Supabase list failed (HTTP $status): " . $response);
        }

        $data = json_decode($response, true);
        return is_array($data) ? $data : [];
    }

    public function findFileInSubfolders($rootPrefix, $fileName, $subPathSegments = [])
    {
        $rootPrefix = trim($rootPrefix, '/');
        $entries = $this->listObjects($rootPrefix);

        foreach ($entries as $entry) {
            if (!empty($entry['id'])) {
                continue;
            }

            $folderName = $entry['name'] ?? null;
            if (!$folderName) {
                continue;
            }

            $candidatePrefix = $rootPrefix . '/' . $folderName;
            if (!empty($subPathSegments)) {
                $candidatePrefix .= '/' . implode('/', $subPathSegments);
            }

            $files = $this->listObjects($candidatePrefix);

            foreach ($files as $file) {
                if (($file['name'] ?? null) === $fileName) {
                    return $candidatePrefix . '/' . $fileName;
                }
            }
        }

        return null;
    }

    public function download($path)
    {
        $path = trim($path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $url = $this->supabaseUrl . '/storage/v1/object/' . $this->bucket . '/' . $encodedPath;

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
}
