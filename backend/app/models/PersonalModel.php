<?php

namespace App\Models;

use Config\Database;

class PersonalModel {
    private $table_name = "personal_information";

    public $id;
    public $application_id;
    public $last_name;
    public $first_name;
    public $middle_name;
    public $suffix;
    public $gender;
    public $age;
    public $birthdate;
    public $birthplace;
    public $home_address;
    public $subdivision_village;
    public $barangay;
    public $city_municipality;
    public $zipcode;
    public $personal_contact;
    public $secondary_contact;
    public $religion;
    public $civil_status;
    public $facebook;
    public $email_address;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id, 
                      last_name = :last_name, 
                      first_name = :first_name, 
                      middle_name = :middle_name, 
                      suffix = :suffix, 
                      gender = :gender, 
                      age = :age, 
                      birthdate = :birthdate, 
                      birthplace = :birthplace, 
                      home_address = :home_address, 
                      subdivision = :subdivision, 
                      barangay = :barangay, 
                      city = :city, 
                      zip_code = :zip_code, 
                      contact_number = :contact_number, 
                      secondary_contact = :secondary_contact, 
                      religion = :religion, 
                      civil_status = :civil_status, 
                      facebook = :facebook, 
                      email = :email";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $application_id = $application_id;
        $last_name = htmlspecialchars(strip_tags($data['last_name']));
        $first_name = htmlspecialchars(strip_tags($data['first_name']));
        $middle_name = htmlspecialchars(strip_tags($data['middle_name'] ?? ''));
        $suffix = htmlspecialchars(strip_tags($data['suffix'] ?? ''));
        $gender = htmlspecialchars(strip_tags($data['gender']));
        $age = htmlspecialchars(strip_tags($data['age']));
        $birthdate = htmlspecialchars(strip_tags($data['birthdate']));
        $birthplace = htmlspecialchars(strip_tags($data['birthplace']));
        $home_address = htmlspecialchars(strip_tags($data['home_address']));
        $subdivision_village = htmlspecialchars(strip_tags($data['subdivision'] ?? ''));
        $barangay = htmlspecialchars(strip_tags($data['barangay']));
        $city_municipality = htmlspecialchars(strip_tags($data['city']));
        $zipcode = htmlspecialchars(strip_tags($data['zip_code']));
        $personal_contact = htmlspecialchars(strip_tags($data['contact_number']));
        $secondary_contact = htmlspecialchars(strip_tags($data['secondary_contact'] ?? ''));
        $religion = htmlspecialchars(strip_tags($data['religion']));
        $civil_status = htmlspecialchars(strip_tags($data['civil_status']));
        $facebook = htmlspecialchars(strip_tags($data['facebook'] ?? ''));
        $email_address = htmlspecialchars(strip_tags($data['email']));

        // Bind values
        $stmt->bindParam(":application_id", $application_id);
        $stmt->bindParam(":last_name", $last_name);
        $stmt->bindParam(":first_name", $first_name);
        $stmt->bindParam(":middle_name", $middle_name);
        $stmt->bindParam(":suffix", $suffix);
        $stmt->bindParam(":gender", $gender);
        $stmt->bindParam(":age", $age);
        $stmt->bindParam(":birthdate", $birthdate);
        $stmt->bindParam(":birthplace", $birthplace);
        $stmt->bindParam(":home_address", $home_address);
        $stmt->bindParam(":subdivision", $subdivision_village);
        $stmt->bindParam(":barangay", $barangay);
        $stmt->bindParam(":city", $city_municipality);
        $stmt->bindParam(":zip_code", $zipcode);
        $stmt->bindParam(":contact_number", $personal_contact);
        $stmt->bindParam(":secondary_contact", $secondary_contact);
        $stmt->bindParam(":religion", $religion);
        $stmt->bindParam(":civil_status", $civil_status);
        $stmt->bindParam(":facebook", $facebook);
        $stmt->bindParam(":email", $email_address);

        return $stmt->execute();
    }
}

?>