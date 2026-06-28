<?php
$allowedMethods = ['GET', 'POST', 'PUT', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . "/../Controllers/BatchExaminationController.php";

?>