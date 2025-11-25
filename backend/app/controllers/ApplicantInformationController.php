<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ApplicantModel;
use App\Models\AssistanceModel;
use App\Models\CharacterReferenceModel;
use App\Models\ContactPersonModel;
use App\Models\EducationModel;
use App\Models\FamilyMemberModel;
use App\Models\FamilyModel;
use App\Models\PersonalModel;
use App\Models\ScholarModel;
use Config\Database;

class ApplicantInformationController
{
    private $pdo;
    private $currentYear;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
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
            $applicantModel = new ApplicantModel();
            $personalModel = new PersonalModel();
            $educationalModel = new EducationModel();
            $familyModel = new FamilyModel();
            $contactPersonModel = new ContactPersonModel();
            $familyMemberModel = new FamilyMemberModel();
            $siblingsModel = new ScholarModel();
            $assistanceModel = new AssistanceModel();
            $charRefModel = new CharacterReferenceModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $schoolYear = $_GET['school_year'] ?? null;

            $applicantInfo = $applicantModel->getApplicantInfo($id, $schoolYear);
            $applicationId = $applicantInfo['application_id'] ?? null;
            $personalInfo = $personalModel->getPersonalInformation($applicationId);
            $educationalInfo = $educationalModel->getEducationalBackground($applicationId);
            $familyInfo = $familyModel->getFamilyInformation($applicationId);
            $contactPersonInfo = $contactPersonModel->getContactPerson($applicationId);
            $familyMembers = $familyMemberModel->getFamilyMembers($applicationId);
            $tzuChiSiblings = $siblingsModel->getTzuChiSiblings($applicationId);
            $assistanceInfo = $assistanceModel->getOtherAssistance($applicationId);
            $characterReference = $charRefModel->getCharacterReference($applicationId);

            $results = [
                'applicationInfo' => $applicantInfo,
                'personalInfo' => $personalInfo,
                'educationalInfo' => $educationalInfo,
                'familyInfo' => $familyInfo,
                'contactPersonInfo' => $contactPersonInfo,
                'familyMembers' => $familyMembers,
                'tzuChiSiblings' => $tzuChiSiblings,
                'assistanceInfo' => $assistanceInfo,
                'characterReference' => $characterReference,
            ];

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $results,
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
$controller = new ApplicantInformationController();
$controller->processRequest();
?>
