<?php

namespace App\Controllers;

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../app/models/ApplicationModel.php';
require_once __DIR__ . '/../../app/models/PersonalModel.php';
require_once __DIR__ . '/../../app/models/EducationModel.php';
require_once __DIR__ . '/../../app/models/FamilyModel.php';
require_once __DIR__ . '/../../app/models/ContactPersonModel.php';
require_once __DIR__ . '/../../app/models/FamilyMemberModel.php';
require_once __DIR__ . '/../../app/models/ScholarModel.php';
require_once __DIR__ . '/../../app/models/AssistanceModel.php';
require_once __DIR__ . '/../../app/models/CharacterReferenceModel.php';

header('Content-Type: application/json');

use Config\Database;
use App\Models\ApplicationModel;
use App\Models\PersonalModel;
use App\Models\EducationModel;
use App\Models\FamilyModel;
use App\Models\ContactPersonModel;
use App\Models\FamilyMemberModel;
use App\Models\ScholarModel;
use App\Models\AssistanceModel;
use App\Models\CharacterReferenceModel;

class RenewalController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function createApplication()
    {
        $this->pdo->beginTransaction();

        try {
            // Handle data from FormData or JSON
            if (isset($_POST['applicationData'])) {
                $data = json_decode($_POST['applicationData'], true);
            } else {
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $application = new ApplicationModel();
            $application_id = $application->renew(
                $data['application_info'],
                $data['other_information'],
            );

            if (!$application_id) {
                throw new \Exception('Failed to create application');
            }

            // Process other data (personal, education, family, etc.)
            $this->processApplicationData(
                $data,
                $application_id,
                $data['application_info']['scholar_id'],
            );

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Application created successfully',
                'application_id' => $application_id,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function updateApplication()
    {
        $this->pdo->beginTransaction();

        try {
            // Handle data from FormData or JSON
            if (isset($_POST['applicationData'])) {
                $data = json_decode($_POST['applicationData'], true);
            } else {
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $application = new ApplicationModel();
            $application_id = $application->update(
                $data['application_info'],
                $data['other_information'],
            );

            if (!$application_id) {
                throw new \Exception('Failed to create application');
            }

            // Process other data (personal, education, family, etc.)
            $this->updateApplicationData(
                $data,
                $application_id,
                $data['application_info']['scholar_id'],
            );

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Application created successfully',
                'application_id' => $application_id,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function processApplicationData($data, $application_id, $scholar_id)
    {
        // Process personal information
        $personal = new PersonalModel($this->pdo);
        if (!$personal->renew($data['personal_information'], $application_id, $scholar_id, $scholar_id)) {
            throw new \Exception('Failed to save personal information');
        }

        // Process education information
        $education = new EducationModel($this->pdo);
        if (!$education->renew($data['educational_background'], $application_id, $scholar_id)) {
            throw new \Exception('Failed to save education information');
        }

        // // Process family information
        $family = new FamilyModel($this->pdo);
        if (!$family->renew($data['parents_guardian'], $application_id, $scholar_id)) {
            throw new \Exception('Failed to save family information');
        }

        // // Process contact person
        $contactPerson = new ContactPersonModel($this->pdo);
        if (isset($data['contact_person']) && !empty($data['contact_person'])) {
            if (!$contactPerson->renew($data['contact_person'], $application_id, $scholar_id)) {
                throw new \Exception('Failed to save contact person');
            }
        }

        // // Process family members
        if (isset($data['family_members']) && is_array($data['family_members'])) {
            $familyMember = new FamilyMemberModel($this->pdo);
            foreach ($data['family_members'] as $member) {
                if (!$familyMember->renew($member, $application_id, $scholar_id)) {
                    throw new \Exception('Failed to save family member');
                }
            }
        }

        // // Process tzu chi scholars
        if (isset($data['tzu_chi_siblings']) && is_array($data['tzu_chi_siblings'])) {
            $scholar = new ScholarModel($this->pdo);
            foreach ($data['tzu_chi_siblings'] as $scholarData) {
                if (!$scholar->renew($scholarData, $application_id, $scholar_id)) {
                    throw new \Exception('Failed to save scholar');
                }
            }
        }

        // // Process assistance list
        if (isset($data['other_assistance']) && is_array($data['other_assistance'])) {
            $assistance = new AssistanceModel($this->pdo);
            foreach ($data['other_assistance'] as $assistanceData) {
                if (!$assistance->renew($assistanceData, $application_id, $scholar_id)) {
                    throw new \Exception('Failed to save assistance');
                }
            }
        }

        if (isset($data['character_reference']) && is_array($data['character_reference'])) {
            $character = new CharacterReferenceModel($this->pdo);
            foreach ($data['character_reference'] as $characterData) {
                if (!$character->renew($characterData, $application_id, $scholar_id)) {
                    throw new \Exception('Failed to save character');
                }
            }
        }
    }

    private function updateApplicationData($data, $applicationId, $scholar_id)
    {
        // Process personal information
        $personal = new PersonalModel($this->pdo);
        if (!$personal->update($data['personal_information'], $applicationId)) {
            throw new \Exception('Failed to save personal information');
        }

        // Process education information
        $education = new EducationModel($this->pdo);
        if (!$education->update($data['educational_background'], $applicationId)) {
            throw new \Exception('Failed to save education information');
        }

        $family = new FamilyModel($this->pdo);
        if (!$family->update($data['parents_guardian'], $applicationId)) {
            throw new \Exception('Failed to save family information');
        }

        // Process contact person
        $contactPerson = new ContactPersonModel($this->pdo);
        if (isset($data['contact_person']) && !empty($data['contact_person'])) {
            if (!$contactPerson->update($data['contact_person'], $applicationId)) {
                throw new \Exception('Failed to save contact person');
            }
        }

        // // // Process family members
        if (isset($data['family_members']) && is_array($data['family_members'])) {
            $familyMember = new FamilyMemberModel($this->pdo);
            if (!$familyMember->deleteByApplicationId($applicationId)) {
                throw new \Exception('Failed to delete existing family members');
            }

            foreach ($data['family_members'] as $member) {
                if (!$familyMember->create($member, $applicationId, $scholar_id)) {
                    throw new \Exception('Failed to save family member');
                }
            }
        }

        // // // Process tzu chi scholars
        if (isset($data['tzu_chi_siblings']) && is_array($data['tzu_chi_siblings'])) {
            $scholar = new ScholarModel($this->pdo);
            if (!$scholar->deleteByApplicationId($applicationId)) {
                throw new \Exception('Failed to delete existing scholars');
            }

            foreach ($data['tzu_chi_siblings'] as $scholarData) {
                if (!$scholar->create($scholarData, $applicationId, $scholar_id)) {
                    throw new \Exception('Failed to save scholar');
                }
            }
        }

        // // // Process assistance list
        if (isset($data['other_assistance']) && is_array($data['other_assistance'])) {
            $assistance = new AssistanceModel($this->pdo);
            if (!$assistance->deleteByApplicationId($applicationId)) {
                throw new \Exception('Failed to delete existing assistance records');
            }

            foreach ($data['other_assistance'] as $assistanceData) {
                if (!$assistance->create($assistanceData, $applicationId, $scholar_id)) {
                    throw new \Exception('Failed to save assistance');
                }
            }
        }

        if (isset($data['character_reference']) && is_array($data['character_reference'])) {
            $character = new CharacterReferenceModel($this->pdo);
            if (!$character->deleteByApplicationId($applicationId)) {
                throw new \Exception('Failed to delete existing character references');
            }

            foreach ($data['character_reference'] as $characterData) {
                if (!$character->create($characterData, $applicationId, $scholar_id)) {
                    throw new \Exception('Failed to save character');
                }
            }
        }
    }
}
?>
