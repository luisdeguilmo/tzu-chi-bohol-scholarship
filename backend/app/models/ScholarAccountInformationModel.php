<?php
namespace App\Models;

use Config\Database;

class ScholarAccountInformationModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getBasicInformation($scholarId, $currentSchoolYear)
    {
        $query =
            'SELECT ai.type, pi.first_name, pi.last_name, pi.email, pi.suffix, pi.contact_number, pi.age, pi.gender, pi.home_address FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE (ai.application_id = :scholar_id OR ai.scholar_id = :scholar_id) AND ai.school_year = :current_school_year';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':current_school_year', $currentSchoolYear);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // public function checkScholarType($scholarId, $currentSchoolYear)
    // {
    //     $query =
    //         'SELECT type FROM application_info WHERE (application_id = :scholar_id OR scholar_id = :scholar_id) AND school_year = :current_school_year';
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':scholar_id', $scholarId);
    //     $stmt->bindParam(':current_school_year', $currentSchoolYear);
    //     $stmt->execute();
    //     return $stmt->fetch(\PDO::FETCH_ASSOC);
    // }

    // public function getBasicInformationForNewScholar($scholarId, $currentSchoolYear)
    // {
    //     $query =
    //         'SELECT ai.type ,pi.first_name, pi.last_name, pi.suffix, pi.contact_number, pi.age, pi.gender, pi.home_address FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_info WHERE ai.application_id = :scholar_id AND ai.school_year = :current_school_year';
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':scholar_id', $scholarId);
    //     $stmt->bindParam(':current_school_year', $currentSchoolYear);
    //     $stmt->execute();
    //     return $stmt->fetch(\PDO::FETCH_ASSOC);
    // }

    // public function getBasicInformationForOldScholar($scholarId, $currentSchoolYear)
    // {
    //     $query =
    //         'SELECT pi.first_name, pi.last_name, pi.suffix, pi.contact_number, pi.age, pi.gender, pi.home_address FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.sch WHERE ai.application_id = :scholar_id AND ai.school_year = :current_school_year';
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':scholar_id', $scholarId);
    //     $stmt->bindParam(':current_school_year', $currentSchoolYear);
    //     $stmt->execute();
    //     return $stmt->fetch(\PDO::FETCH_ASSOC);
    // }

    public function getScholarStatus($scholarId)
    {
        $query = 'SELECT status FROM users WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    public function getRenderedHours($scholarId)
    {
        $query = 'SELECT rendered_hours FROM scholars WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchColumn();
    }
}

?>
