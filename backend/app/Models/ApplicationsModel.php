<?php
namespace App\Models;

use Config\Database;

class ApplicationsModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getApplicationData($studentId)
    {
        if (!$studentId) {
            return ['error' => 'Student ID is required'];
        }

        $data = [
            'applicationInfo' => null,
            'personalInfo' => null,
            'educationalBackground' => null,
            'familyInfo' => [
                'parents' => null,
                'contact' => null,
                'siblings' => null,
                'tzuChiSiblings' => null,
            ],
            'otherAssistance' => null,
        ];

        // Fetch application info
        $data['applicationInfo'] = $this->fetchSingle(
            'SELECT type, expectation, school_year FROM application_info WHERE application_id = ?',
            [$studentId],
        );

        // Fetch personal information
        $data['personalInfo'] = $this->fetchSingle(
            'SELECT last_name, middle_name, first_name, suffix, gender, age, birthdate, home_address, subdivision, barangay, city, zip_code, contact_number, secondary_contact, religion, civil_status, facebook, email, birthplace FROM personal_information WHERE application_id = ?',
            [$studentId],
        );

        // Fetch educational background
        $data['educationalBackground'] = $this->fetchSingle(
            'SELECT previous_school, incoming_grade, year_level, previous_location, present_school, previous_honor, present_location, previous_gwa, present_course1, previous_course, present_course2 FROM educational_background WHERE application_id = ?',
            [$studentId],
        );

        // Fetch family information - parents/guardian
        $data['familyInfo']['parents'] = $this->fetchSingle(
            'SELECT father_name, mother_name, mother_age, guardian_name, guardian_age, father_education, mother_education, guardian_education, father_occupation, mother_occupation, guardian_occupation, father_income, mother_income, guardian_income, father_contact, mother_contact, guardian_contact FROM parents_guardian WHERE application_id = ?',
            [$studentId],
        );

        $data['familyInfo']['contact'] = $this->fetchSingle(
            'SELECT emergency_contact_name, emergency_contact_relationship, emergency_contact_address, emergency_contact_number FROM contact_person WHERE application_id = ?',
            [$studentId],
        );

        // Fetch family information - siblings
        $data['familyInfo']['siblings'] = $this->fetchMultiple(
            'SELECT name, relationship, age, gender, civil_status, living_with_family, education_occupation, monthly_income FROM family_members WHERE application_id = ?',
            [$studentId],
        );

        // Fetch tzu chi siblings
        $data['familyInfo']['tzuChiSiblings'] = $this->fetchMultiple(
            'SELECT name, year_level, school, course, school_year FROM tzu_chi_siblings WHERE application_id = ?',
            [$studentId],
        );

        // Fetch other assistance
        $data['otherAssistance'] = $this->fetchMultiple(
            'SELECT organization_name, support_type, amount FROM other_assistance WHERE application_id = ?',
            [$studentId],
        );

        $data['characterReference'] = $this->fetchMultiple(
            'SELECT name, address, company, position, contact_number FROM character_reference WHERE application_id = ?',
            [$studentId],
        );

        $data['requirements'] = $this->fetchMultiple(
            'SELECT file_path, file_type FROM application_requirements WHERE application_id = ?',
            [$studentId],
        );

        if (!empty($data['requirements'])) {
            foreach ($data['requirements'] as &$requirement) {
                if (isset($requirement['file_path'])) {
                    $filePath = __DIR__ . '/../../public' . $requirement['file_path'];
                    if (file_exists($filePath)) {
                        $imageData = file_get_contents($filePath);
                        $requirement['base64Data'] =
                            'data:' .
                            $requirement['file_type'] .
                            ';base64,' .
                            base64_encode($imageData);
                    }
                }
            }
        }

        return $data;
    }

    private function fetchSingle($query, $params)
    {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    private function fetchMultiple($query, $params)
    {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function markAsInitialInterview($studentId, $data)
    {
        $updateQuery =
            'UPDATE application_info SET application_status = :application_status, initial_interview = :initial_interview WHERE application_id = :application_id';
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        $updateStmt->bindParam(':application_status', $data['application_status']);
        $updateStmt->bindParam(':initial_interview', $data['initial_interview']);

        if (!$updateStmt->execute()) {
            return false;
        }

        return true;
    }

    public function updateApplicationStatus($studentId, $status, $approved, $batch, $today)
    {
        $query =
            'UPDATE application_info SET application_status = :application_status, application_approved = :application_approved, entrance_examination = :entrance_examination, batch = :batch, approved_at = :approved_at WHERE application_id = :application_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $studentId);
        $stmt->bindParam(':application_status', $status);
        $stmt->bindParam(':application_approved', $approved);
        $stmt->bindParam(':entrance_examination', $approved);
        $stmt->bindParam(':batch', $batch);
        $stmt->bindParam(':approved_at', $today);
        $stmt->execute();
    }
}
?>
