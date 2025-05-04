<?php

namespace App\Models;

use Config\Database;

class ContactPersonModel {
    private $table_name = "contact_person";

    public $id;
    public $application_id;
    public $emergency_contact_name;
    public $emergency_contact_relationship;
    public $emergency_contact_address;
    public $emergency_contact_number;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      emergency_contact_name = :emergency_contact_name,
                      emergency_contact_relationship = :emergency_contact_relationship,
                      emergency_contact_address = :emergency_contact_address,
                      emergency_contact_number = :emergency_contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->emergency_contact_name = htmlspecialchars(strip_tags($data['emergency_contact_name'] ?? ''));
        $this->emergency_contact_relationship = htmlspecialchars(strip_tags($data['emergency_contact_relationship'] ?? ''));
        $this->emergency_contact_address = htmlspecialchars(strip_tags($data['emergency_contact_address'] ?? ''));
        $this->emergency_contact_number = htmlspecialchars(strip_tags($data['emergency_contact_number'] ?? ''));


        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":emergency_contact_name", $this->emergency_contact_name);
        $stmt->bindParam(":emergency_contact_relationship", $this->emergency_contact_relationship);
        $stmt->bindParam(":emergency_contact_address", $this->emergency_contact_address);
        $stmt->bindParam(":emergency_contact_number", $this->emergency_contact_number);

        return $stmt->execute();
    }
}

?>