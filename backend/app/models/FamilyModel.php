<?php

namespace App\Models;

use Config\Database;

class FamilyModel {
    private $table_name = "parents_guardian";

    public $id;
    public $application_id;
    public $father_name;
    public $father_age;
    public $father_edu_attainment;
    public $father_occupation;
    public $father_monthly_income;
    public $father_contact_number;
    public $mother_name;
    public $mother_age;
    public $mother_edu_attainment;
    public $mother_occupation;
    public $mother_monthly_income;
    public $mother_contact_number;
    public $guardian_name;
    public $guardian_age;
    public $guardian_edu_attainment;
    public $guardian_occupation;
    public $guardian_monthly_income;
    public $guardian_contact_number;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      father_name = :father_name,
                      father_age = :father_age,
                      father_education = :father_education,
                      father_occupation = :father_occupation,
                      father_income = :father_income,
                      father_contact = :father_contact,
                      mother_name = :mother_name,
                      mother_age = :mother_age,
                      mother_education = :mother_education,
                      mother_occupation = :mother_occupation,
                      mother_income = :mother_income,
                      mother_contact = :mother_contact,
                      guardian_name = :guardian_name, 
                      guardian_age = :guardian_age,
                      guardian_education = :guardian_education,
                      guardian_occupation = :guardian_occupation,
                      guardian_income = :guardian_income,
                      guardian_contact = :guardian_contact";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->father_name = htmlspecialchars(strip_tags($data['father_name']));
        $this->father_age = htmlspecialchars(strip_tags($data['father_age']));
        $this->father_edu_attainment = htmlspecialchars(strip_tags($data['father_education']));
        $this->father_occupation = htmlspecialchars(strip_tags($data['father_occupation']));
        $this->father_monthly_income = htmlspecialchars(strip_tags($data['father_income']));
        $this->father_contact_number = htmlspecialchars(strip_tags($data['father_contact']));
        $this->mother_name = htmlspecialchars(strip_tags($data['mother_name']));
        $this->mother_age = htmlspecialchars(strip_tags($data['mother_age']));
        $this->mother_edu_attainment = htmlspecialchars(strip_tags($data['mother_education']));
        $this->mother_occupation = htmlspecialchars(strip_tags($data['mother_occupation']));
        $this->mother_monthly_income = htmlspecialchars(strip_tags($data['mother_income']));
        $this->mother_contact_number = htmlspecialchars(strip_tags($data['mother_contact']));
        $this->guardian_name = htmlspecialchars(strip_tags($data['guardian_name'] ?? ''));
        $this->guardian_age = htmlspecialchars(strip_tags($data['guardian_age'] ?? ''));
        $this->guardian_edu_attainment = htmlspecialchars(strip_tags($data['guardian_education'] ?? ''));
        $this->guardian_occupation = htmlspecialchars(strip_tags($data['guardian_occupation'] ?? ''));
        $this->guardian_monthly_income = htmlspecialchars(strip_tags($data['guardian_income'] ?? ''));
        $this->guardian_contact_number = htmlspecialchars(strip_tags($data['guardian_contact'] ?? ''));
        
        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":father_name", $this->father_name);
        $stmt->bindParam(":father_age", $this->father_age);
        $stmt->bindParam(":father_education", $this->father_edu_attainment);
        $stmt->bindParam(":father_occupation", $this->father_occupation);
        $stmt->bindParam(":father_income", $this->father_monthly_income);
        $stmt->bindParam(":father_contact", $this->father_contact_number);
        $stmt->bindParam(":mother_name", $this->mother_name);
        $stmt->bindParam(":mother_age", $this->mother_age);
        $stmt->bindParam(":mother_education", $this->mother_edu_attainment);
        $stmt->bindParam(":mother_occupation", $this->mother_occupation);
        $stmt->bindParam(":mother_income", $this->mother_monthly_income);
        $stmt->bindParam(":mother_contact", $this->mother_contact_number);
        $stmt->bindParam(":guardian_name", $this->guardian_name);
        $stmt->bindParam(":guardian_age", $this->guardian_age);
        $stmt->bindParam(":guardian_education", $this->guardian_edu_attainment);
        $stmt->bindParam(":guardian_occupation", $this->guardian_occupation);
        $stmt->bindParam(":guardian_income", $this->guardian_monthly_income);
        $stmt->bindParam(":guardian_contact", $this->guardian_contact_number);

        return $stmt->execute();
    }
}

?>