<?php 

namespace App\Models;

use Config\Database;

class EducationModel {
    private $table_name = "educational_background";

    public $id;
    public $application_id;
    public $last_school_attended;
    public $last_school_location;
    public $honor_award;
    public $gwa;
    public $course_taken;
    public $incoming_grade_year_level;
    public $school;
    public $new_school_location;
    public $first_course;
    public $second_course;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      previous_school = :previous_school,
                      previous_location = :previous_location,
                      previous_honor = :previous_honor,
                      previous_gwa = :previous_gwa,
                      previous_course = :previous_course,
                      incoming_grade = :incoming_grade,
                      present_school = :present_school,
                      present_location = :present_location,
                      present_course1 = :present_course1,
                      present_course2 = :present_course2";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->last_school_attended = htmlspecialchars(strip_tags($data['previous_school']));
        $this->last_school_location = htmlspecialchars(strip_tags($data['previous_location']));
        $this->honor_award = htmlspecialchars(strip_tags($data['previous_honor'] ?? ''));
        $this->gwa = htmlspecialchars(strip_tags($data['previous_gwa']));
        $this->course_taken = htmlspecialchars(strip_tags($data['previous_course'] ?? ''));
        $this->incoming_grade_year_level = htmlspecialchars(strip_tags($data['incoming_grade']));
        $this->school = htmlspecialchars(strip_tags($data['present_school']));
        $this->new_school_location = htmlspecialchars(strip_tags($data['present_location']));
        $this->first_course = htmlspecialchars(strip_tags($data['present_course1'] ?? ''));
        $this->second_course = htmlspecialchars(strip_tags($data['present_course2'] ?? ''));

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":previous_school", $this->last_school_attended);
        $stmt->bindParam(":previous_location", $this->last_school_location);
        $stmt->bindParam(":previous_honor", $this->honor_award);
        $stmt->bindParam(":previous_gwa", $this->gwa);
        $stmt->bindParam(":previous_course", $this->course_taken);
        $stmt->bindParam(":incoming_grade", $this->incoming_grade_year_level);
        $stmt->bindParam(":present_school", $this->school);
        $stmt->bindParam(":present_location", $this->new_school_location);
        $stmt->bindParam(":present_course1", $this->first_course);
        $stmt->bindParam(":present_course2", $this->second_course);

        return $stmt->execute();
    }
}

?>