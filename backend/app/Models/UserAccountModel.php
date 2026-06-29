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

    public function getProfileById($id)
    {
        $query = "SELECT *
                FROM profile_pictures 
                WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getAccountProfile($type, $accountId, $accountModel)
    {
        $files = $accountModel->getProfileById($accountId);

        $profile = null;

        // foreach ($files as $file) {
        //     $profile =
        //         $_ENV['APP_URL'] .
        //         "/index.php?type={$type}&route=profile&file=" .
        //         urlencode(basename($file['file_path']));
        // }

        foreach ($files as $file) {
            $profile =
                $_ENV['APP_URL'] .
                "/index.php?type={$type}&route=profile&file=" .
                urlencode($file['file_name']) .
                '&id=' .
                urlencode($file['application_id']);
        }

        return $profile;
    }

    public function getAccountStatus($id)
    {
        $query = 'SELECT status FROM users WHERE account_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['status'];
        }

        return null;
    }
}

?>
