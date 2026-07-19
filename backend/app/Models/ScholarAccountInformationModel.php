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

    public function getBasicInformation($scholarId)
    {
        $query =
            "SELECT ai.school_year, ai.type, pi.first_name, pi.middle_name, pi.last_name, pi.email, pi.suffix, pi.contact_number, pi.age, pi.gender, pi.home_address, pi.facebook FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE (ai.application_id = :scholar_id OR ai.scholar_id = :scholar_id) AND status != 'pending' ORDER BY ai.school_year DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        // $stmt->bindParam(':current_school_year', $currentSchoolYear);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAcademicInfo($scholarId)
    {
        $query =
            "SELECT eb.present_school, eb.present_course1, eb.year_level FROM educational_background eb JOIN application_info ai ON eb.application_id = ai.application_id WHERE (ai.application_id = :scholar_id OR ai.scholar_id = :scholar_id) AND status != 'pending' ORDER BY ai.school_year DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        // $stmt->bindParam(':current_school_year', $currentSchoolYear);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAcademicYear($scholarId)
    {
        $query = 'SELECT status FROM users WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

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

    public function getTransportDetails($scholarId)
    {
        $query = 'SELECT stay_type, address, daily_transport_cost, route_explanation FROM scholar_transport_info WHERE scholar_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
