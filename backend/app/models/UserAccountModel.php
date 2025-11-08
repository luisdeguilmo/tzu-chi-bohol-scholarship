<?php
namespace App\Models;

use Config\Database;

class UserAccountModel
{
    public $id;
    public $email;
    public $password;
    public $application_id;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function updateAccountStatus($userId, $status)
    {
        $query = 'UPDATE users SET status = :status WHERE account_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $userId, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}

?>
