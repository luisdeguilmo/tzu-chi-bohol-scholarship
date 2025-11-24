<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\CollegeUniversityManagementModel;
use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use Config\Database;

class ScholarInformationController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest()
    {
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'GET':
                $this->handleGet();
                break;

            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            $tab = $_GET['tab'] ?? null;
            $status = $_GET['status'] ?? null;
            $schoolFilter = $_GET['school'] ?? null;
            $course = $_GET['course'] ?? null;
            $current_school_year = $_GET['current_school_year'] ?? null;
            $year_level = $_GET['year_level'] ?? null;
            $school_year = $_GET['school_year'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $model = new ScholarsModel();
            $schoolModel = new CollegeUniversityManagementModel();
            $result = [];

            // Determine which schools to process
            if ($schoolFilter === 'all') {
                $schools = $schoolModel->getAllCollegesAndUniversitiesAlphabetically();
            } else {
                $schools[] = $schoolFilter;
            }

            if ($tab === 'active') {
                foreach ($schools as $schoolData) {
                    $schoolName = $schoolData['name'] ?? $schoolData;

                    $newScholars = $model->getNewActiveScholars(
                        $status,
                        $school_year,
                        $schoolName,
                        $year_level,
                        $course,
                        $current_school_year,
                    );

                    $oldScholars = $model->getOldActiveScholars(
                        $status,
                        $school_year,
                        $schoolName,
                        $year_level,
                        $course,
                        $current_school_year,
                    );

                    // Combine and map scholars
                    $allScholars = array_merge($newScholars, $oldScholars);

                    $scholarsArr = array_map(function ($scholar) {
                        return [
                            'YR. Level' => $scholar['year_level'],
                            'Last Name' => $scholar['last_name'],
                            'First Name' => $scholar['first_name'],
                            'Course' => $scholar['present_course1'],
                        ];
                    }, $allScholars);

                    // // Apply sorting if specified
                    if ($sort) {
                        $scholarsArr = $this->applySorting($scholarsArr, $sort);
                    }

                    $result[] = [
                        'School' => $schoolName,
                        'Scholars' => $scholarsArr,
                    ];
                }
            } elseif ($tab === 'graduated') {
                foreach ($schools as $schoolData) {
                    $schoolName = $schoolData['name'] ?? $schoolData;

                    $scholars = $model->getGraduatedScholars(
                        $status,
                        $school_year,
                        $schoolName,
                        $course,
                    );

                    $scholarsArr = array_map(function ($scholar) {
                        return [
                            'YR. Level' => $scholar['year_level'],
                            'Last Name' => $scholar['last_name'],
                            'First Name' => $scholar['first_name'],
                            'Course' => $scholar['present_course1'],
                        ];
                    }, $scholars);

                    // // Apply sorting if specified
                    if ($sort) {
                        $scholarsArr = $this->applySorting($scholarsArr, $sort);
                    }

                    $result[] = [
                        'School' => $schoolName,
                        'Scholars' => $scholarsArr,
                    ];
                }
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function applySorting(array $scholars, string $sort): array
    {
        $sortMap = [
            'lastname_asc' => function ($a, $b) {
                $lastNameCmp = strcasecmp($a['Last Name'], $b['Last Name']);
                if ($lastNameCmp !== 0) {
                    return $lastNameCmp;
                }
                return strcasecmp($a['First Name'], $b['First Name']);
            },
            'firstname_asc' => function ($a, $b) {
                $firstNameCmp = strcasecmp($a['First Name'], $b['First Name']);
                if ($firstNameCmp !== 0) {
                    return $firstNameCmp;
                }
                return strcasecmp($a['Last Name'], $b['Last Name']);
            },
        ];

        if (isset($sortMap[$sort])) {
            usort($scholars, $sortMap[$sort]);
        }

        return $scholars;
    }
}

// Create and execute controller
$controller = new ScholarInformationController();
$controller->processRequest();
?>
