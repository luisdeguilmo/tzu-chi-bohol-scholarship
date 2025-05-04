<?php

namespace App\Models;

use Config\Database;

class AssistanceModel {
    private $table_name = "other_assistance";

    public $id;
    public $application_id;
    public $organization;
    public $type;
    public $amount;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($assistance, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      organization_name = :organization_name,
                      support_type = :support_type,
                      amount = :amount";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->organization = htmlspecialchars(strip_tags($assistance['organization_name']));
        $this->type = htmlspecialchars(strip_tags($assistance['support_type']));
        $this->amount = htmlspecialchars(strip_tags($assistance['amount'] ?? '0'));

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":organization_name", $this->organization);
        $stmt->bindParam(":support_type", $this->type);
        $stmt->bindParam(":amount", $this->amount);

        return $stmt->execute();
    }
}

?>