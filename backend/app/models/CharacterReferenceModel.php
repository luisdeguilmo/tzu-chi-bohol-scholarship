<?php

namespace App\Models;

use Config\Database;

class CharacterReferenceModel {
    private $table_name = "character_reference";

    public $id;
    public $application_id;
    public $name;
    public $address;
    public $company;
    public $position;
    public $contact_number;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($scholar, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      name = :name,
                      address = :address,
                      company = :company,
                      position = :position,
                      contact_number = :contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = htmlspecialchars(strip_tags($scholar['name']));
        $this->address = htmlspecialchars(strip_tags($scholar['address']));
        $this->company = htmlspecialchars(strip_tags($scholar['company']));
        $this->position = htmlspecialchars(strip_tags($scholar['position']));
        $this->contact_number = htmlspecialchars(strip_tags($scholar['contact_number']));

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":company", $this->company);
        $stmt->bindParam(":position", $this->position);
        $stmt->bindParam(":contact_number", $this->contact_number);

        return $stmt->execute();
    }
}

?>