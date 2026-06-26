<?php
namespace App\Models;

use Config\Database;

class StaffAccountInformationModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getBasicInformation($staffId)
    {
        $query =
            'SELECT first_name, middle_name, last_name, suffix, contact_number, age, gender, address, facebook, email_address FROM staff WHERE account_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $staffId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
