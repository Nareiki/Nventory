<?php
require_once("../connection.php");

class UserLogin {
    private $con;

    public function __construct() {
        $this->con = getDBConnection();
    }

    public function authenticate(array $data): array {
        $username = trim($data["username"] ?? '');
        $password = trim($data["password"] ?? '');

        if (empty($username) || empty($password)) {
            return ["success" => false, "message" => "Benutzername und Passwort erforderlich."];
        }

        $stmt = $this->con->prepare("SELECT userPassword, status, email FROM user WHERE userName = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows !== 1) {
            return ["success" => false, "message" => "Benutzername existiert nicht."];
        }

        $user = $result->fetch_assoc();

        if ((int)$user["status"] === 0) {
            return ["success" => false, "message" => "Ihr Konto ist inaktiv. Bitte kontaktieren Sie den Administrator."];
        }

        if (!password_verify($password, $user["userPassword"])) {
            return ["success" => false, "message" => "Benutzername oder Passwort ist falsch."];
        }

        return [
            "success" => true,
            "data" => [
                "username" => $username,
                "email" => $user["email"]
            ]
        ];
    }
}

