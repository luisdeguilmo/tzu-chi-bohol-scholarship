<?php
// require_once __DIR__ . "/../../config/Database.php";

namespace App\Models;

// Add these lines at the top of your PHP file (applications.php)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

use Config\Database;

class ApplicationsModel {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getApplicationData($studentId) {
        if (!$studentId) {
            return ["error" => "Student ID is required"];
        }

        $data = [
            "applicationInfo" => null,
            "personalInfo" => null,
            "educationalBackground" => null,
            "familyInfo" => [
                "parents" => null,
                "contact" => null,
                "siblings" => null,
                "tzuChiSiblings" => null
            ],
            "otherAssistance" => null
        ];

        // Fetch application info
        $data["applicationInfo"] = $this->fetchSingle("SELECT * FROM application_info WHERE application_id = ?", [$studentId]);

        // Fetch personal information
        $data["personalInfo"] = $this->fetchSingle("SELECT * FROM personal_information WHERE application_id = ?", [$studentId]);

        // Fetch educational background
        $data["educationalBackground"] = $this->fetchSingle("SELECT * FROM educational_background WHERE application_id = ?", [$studentId]);

        // Fetch family information - parents/guardian
        $data["familyInfo"]["parents"] = $this->fetchSingle("SELECT * FROM parents_guardian WHERE application_id = ?", [$studentId]);

        $data["familyInfo"]["contact"] = $this->fetchSingle("SELECT * FROM contact_person WHERE application_id = ?", [$studentId]);

        // Fetch family information - siblings
        $data["familyInfo"]["siblings"] = $this->fetchMultiple("SELECT * FROM family_members WHERE application_id = ?", [$studentId]);

        // Fetch tzu chi siblings
        $data["familyInfo"]["tzuChiSiblings"] = $this->fetchMultiple("SELECT * FROM tzu_chi_siblings WHERE application_id = ?", [$studentId]);

        // Fetch other assistance
        $data["otherAssistance"] = $this->fetchMultiple("SELECT * FROM other_assistance WHERE application_id = ?", [$studentId]);

        $data["characterReference"] = $this->fetchMultiple("SELECT * FROM character_reference WHERE application_id = ?", [$studentId]);

        $data["requirements"] = $this->fetchMultiple("SELECT * FROM application_requirements WHERE application_id = ?", [$studentId]);

        if (!empty($data["requirements"])) {
            foreach ($data["requirements"] as &$requirement) {
                if (isset($requirement['file_path'])) {
                    $filePath = __DIR__ . "/../../public" . $requirement['file_path'];
                    if (file_exists($filePath)) {
                        $imageData = file_get_contents($filePath);
                        $requirement['base64Data'] = 'data:' . $requirement['file_type'] . ';base64,' . base64_encode($imageData);
                    }
                }
            }
        }
    
        return $data;
    }

    private function fetchSingle($query, $params) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    private function fetchMultiple($query, $params) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function markAsInitialInterview($studentId, $data) {
        $updateQuery = "UPDATE application_info SET application_status = :application_status, initial_interview = :initial_interview WHERE application_id = :application_id";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        $updateStmt->bindParam(':application_status', $data['application_status']);
        $updateStmt->bindParam(':initial_interview', $data['initial_interview']);
        
        if (!$updateStmt->execute()) {
            return false;
        }
        
        return true;
    }

    public function updateApplicationStatus($studentId, $status, $approved, $batch, $today) {
        $query = "UPDATE application_info SET application_status = :application_status, application_approved = :application_approved, entrance_examination = :entrance_examination, batch = :batch, approved_at = :approved_at WHERE application_id = :application_id";
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
