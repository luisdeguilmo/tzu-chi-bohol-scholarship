<?php
// index.php

// require_once __DIR__ . '/vendor/autoload.php';
// require_once __DIR__ . '/app/views/response.php';
// require_once __DIR__ . '/app/views/activities.php';
// require_once __DIR__ . '/app/views/applicants.php';
// require_once __DIR__ . '/app/views/applications.php';
// require_once __DIR__ . '/app/views/certificate-of-appearance.php';

// index.php

require_once __DIR__ . '/vendor/autoload.php';

$page = $_GET['page'] ?? 'home';

switch ($page) {
    case 'activities':
        require_once __DIR__ . '/app/views/activities.php';
        break;
    case 'application_files':
        require_once __DIR__ . '/app/views/application_files.php';
        break;
    case 'applicants':
        require_once __DIR__ . '/app/views/applicants.php';
        break;
    case 'applications':
        require_once __DIR__ . '/app/views/applications.php';
        break;
    case 'coa':
        require_once __DIR__ . '/app/views/certificate-of-appearance.php';
        break;
    default:
        require_once __DIR__ . '/app/views/response.php'; // home or 404
}

echo 'PHP is working!';
?>
