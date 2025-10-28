<?php
namespace App\Models;

use Config\Database;

class ScholarAccountModel
{
    private $table_name = 'application_info';
    private $scholar_table = 'scholars';

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

    public function createScholar($data, $today)
    {
        $query =
            'INSERT INTO scholars (account_id, first_name, last_name, created_at) VALUES (:account_id, :first_name, :last_name, :created_at)';

        $stmt = $this->pdo->prepare($query);

        $account_id = htmlspecialchars(strip_tags($data['application_id']));
        $first_name = htmlspecialchars(strip_tags($data['first_name']));
        $last_name = htmlspecialchars(strip_tags($data['last_name']));
        $created_at = htmlspecialchars(strip_tags($today));

        $stmt->bindParam(':account_id', $account_id);
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':created_at', $created_at);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function createAccount($application_id, $today)
    {
        // Get scholar data first
        $scholarData = $this->getPendingScholarById($application_id);
        if (!$scholarData) {
            throw new \Exception('Scholar application not found');
        }

        $isSuccess = $this->createScholar($scholarData, $today);
        if (!$isSuccess) {
            throw new \Exception('Failed to create scholar');
        }

        $query = "INSERT INTO users (email, password, created_at, account_id, type) 
                 VALUES (:email, :password, :created_at, :application_id, 'scholar')";
        $stmt = $this->pdo->prepare($query);

        // Use email from the query result
        $email = $scholarData['email'];

        // Create a secure password hash - using application_id as initial password
        $hashedPassword = password_hash($scholarData['application_id'], PASSWORD_DEFAULT);

        // Sanitize application_id
        $sanitized_application_id = htmlspecialchars(strip_tags($application_id));
        $sanitized_created_at = htmlspecialchars(strip_tags($today));

        // Bind values
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':created_at', $sanitized_created_at);
        $stmt->bindParam(':application_id', $sanitized_application_id);
        // $stmt->bindParam(":type", 'Scholar');

        return $stmt->execute();
    }

    public function getCreatedAccounts()
    {
        $query =
            'SELECT * FROM ' .
            $this->scholar_table .
            ' s JOIN users u ON s.account_id = u.account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPendingScholars()
    {
        try {
            $query =
                'SELECT ai.*, pi.* FROM ' .
                $this->table_name .
                " ai 
                     JOIN personal_information pi ON ai.application_id = pi.application_id WHERE ai.is_application_approved = '1' AND ai.is_examination_passed = '1' AND ai.is_initial_interview_passed = '1'
                     AND ai.is_home_visitation_qualified = '1' AND ai.is_final_interview_passed = '1' AND ai.is_attended_orientation = '1' AND ai.is_attended_awarding = '1' AND ai.status = 'is_attended_awarding'";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getPendingScholarById($application_id)
    {
        $query =
            "SELECT pi.first_name, pi.last_name, pi.email, ai.application_id 
                  FROM " .
            $this->table_name .
            " ai 
                  JOIN personal_information pi ON ai.application_id = pi.application_id WHERE ai.application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $application_id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // public function updateApplicationStatusToScholar($application_id) {
    //     $query = "UPDATE users SET status = :status
    //              WHERE application_id = :application_id";
    //     $stmt = $this->pdo->prepare($query);
    //     $status = 'scholar';
    //     $stmt->bindParam(':application_status', $status);
    //     $stmt->bindParam(':application_id', $application_id);
    //     return $stmt->execute();
    // }

    public function updateAccountStatus($scholar_id, $status)
    {
        $query = 'UPDATE users SET status = :status WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':scholar_id', $scholar_id);
        return $stmt->execute();
    }

    public function updateApplicationStatus($scholar_id, $status)
    {
        $query = 'UPDATE application_info SET status = :status WHERE application_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':scholar_id', $scholar_id);
        return $stmt->execute();
    }
}

?>
