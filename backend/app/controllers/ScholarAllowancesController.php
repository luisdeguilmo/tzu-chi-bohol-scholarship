<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\CollegeUniversityManagementModel;
use App\Models\ScholarsModel;
use App\Models\SchoolYearModel;
use Config\Database;

class ScholarAllowancesController
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
            $model = new ScholarsModel();
            $school = new CollegeUniversityManagementModel();
            $schoolYear = new SchoolYearModel();

            $school_year = $schoolYear->getActiveSchoolYear();

            $collegesAndUniversities = $school->getAllCollegesAndUniversitiesAlphabetically();

            $result = [];

            foreach ($collegesAndUniversities as $school) {
                $scholarAllowances = $model->getAllScholarAllowances($school_year, $school['name']);

                $formattedScholars = array_map(function ($scholar) {
                    return [
                        'YR. Level' => $scholar['year_level'],
                        'Last Name' => $scholar['last_name'],
                        'First Name' => $scholar['first_name'],
                        'Allowance' => $scholar['allowance'],
                        'Internet Allowance' => $scholar['load_allowance'],
                        'Transportation Allowance' => $scholar['transport_allowance'],
                    ];
                }, $scholarAllowances);

                $result[] = ['School' => $school['name'], 'Type' => $school['type'], 'Scholar' => $formattedScholars];
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
}

// Create and execute controller
$controller = new ScholarAllowancesController();
$controller->processRequest();
?>
