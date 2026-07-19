<?php
namespace App\Models;

use Config\Database;

class AdminAccountInformationModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getBasicInformation($id)
    {
        $query = 'SELECT name, email FROM admin WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function updateAdmin($data, $id)
    {
        $query = 'UPDATE admin SET name = :name, email = :email WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        return $stmt->execute();
    }

    public function updateUser($data, $id)
    {
        $query = 'UPDATE users SET email = :email WHERE account_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':email', $data['email']);
        return $stmt->execute();
    }
}

?>
