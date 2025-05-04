<?php

namespace App\Models;

use Config\Database;

class FamilyMemberModel {
    private $table_name = "family_members";

    public $id;
    public $application_id;
    public $name;
    public $relationship;
    public $age;
    public $gender;
    public $civil_status;
    public $living_with_family;
    public $education_or_occupation;
    public $monthly_income;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($member, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      name = :name,
                      relationship = :relationship,
                      age = :age,
                      gender = :gender,
                      civil_status = :civil_status,
                      living_with_family = :living_with_family,
                      education_occupation = :education_occupation,
                      monthly_income = :monthly_income";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = htmlspecialchars(strip_tags($member['name']));
        $this->relationship = htmlspecialchars(strip_tags($member['relationship']));
        $this->age = htmlspecialchars(strip_tags($member['age']));
        $this->gender = htmlspecialchars(strip_tags($member['gender']));
        $this->civil_status = htmlspecialchars(strip_tags($member['civil_status']));
        $this->living_with_family = htmlspecialchars(strip_tags($member['living_with_family']));
        $this->education_or_occupation = htmlspecialchars(strip_tags($member['education_occupation']));
        $this->monthly_income = htmlspecialchars(strip_tags($member['monthly_income'] ?? '0'));

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":relationship", $this->relationship);
        $stmt->bindParam(":age", $this->age);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":civil_status", $this->civil_status);
        $stmt->bindParam(":living_with_family", $this->living_with_family);
        $stmt->bindParam(":education_occupation", $this->education_or_occupation);
        $stmt->bindParam(":monthly_income", $this->monthly_income);

        return $stmt->execute();
    }
}

?>