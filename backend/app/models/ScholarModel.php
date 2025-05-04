<?php

namespace App\Models;

use Config\Database;

class ScholarModel {
    private $table_name = "tzu_chi_siblings";

    public $id;
    public $application_id;
    public $name;
    public $year_level;
    public $school;
    public $course;
    public $school_year;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($scholar, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      name = :name,
                      year_level = :year_level,
                      school = :school,
                      course = :course,
                      school_year = :school_year";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = htmlspecialchars(strip_tags($scholar['name']));
        $this->year_level = htmlspecialchars(strip_tags($scholar['year_level']));
        $this->school = htmlspecialchars(strip_tags($scholar['school']));
        $this->course = htmlspecialchars(strip_tags($scholar['course']));
        $this->school_year = htmlspecialchars(strip_tags($scholar['school_year']));

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":year_level", $this->year_level);
        $stmt->bindParam(":school", $this->school);
        $stmt->bindParam(":course", $this->course);
        $stmt->bindParam(":school_year", $this->school_year);

        return $stmt->execute();
    }
}

?>