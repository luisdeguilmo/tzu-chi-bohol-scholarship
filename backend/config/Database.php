<?php

namespace Config;

use PDO;

class Database
{
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    private $ca_cert;
    private $conn;

    public function __construct()
    {
        $this->host = getenv('DB_HOST');
        $this->port = getenv('DB_PORT');
        $this->db_name = getenv('DB_NAME');
        $this->username = getenv('DB_USERNAME');
        $this->password = getenv('DB_PASSWORD');
        $this->ca_cert = getenv('DB_CA_CERT');
    }

    public function getConnection()
    {
        $this->conn = null;

        try {

            $this->conn = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};sslmode=verify-ca",
                $this->username,
                $this->password,
                [
                    PDO::MYSQL_ATTR_SSL_CA => $this->ca_cert,
                ]
            );

            $this->conn->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );

        } catch (\PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
