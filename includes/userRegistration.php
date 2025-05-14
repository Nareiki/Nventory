<?php
require_once("../connection.php");

class UserRegistration {
    private $con;
    private $errors = [];
    
    public function __construct() {
        $this->con = getDBConnection();
    }

    public function register(array $data): array {
        $firstname = $data["firstname"] ?? '';
        $lastname = $data["lastname"] ?? '';
        $company = $data["company"] ?? '';
        $username = trim($data["username"] ?? '');
        $password = trim($data["password"] ?? '');
        $email = filter_var(trim($data["email"] ?? ''), FILTER_SANITIZE_EMAIL);


        $this->validate($username, $password, $firstname, $lastname, $email);

        if (!empty($this->errors)) {
            return ["success" => false, "errors" => $this->errors];
        }

        if ($this->userExists($username, $email)) {
            return ["success" => false, "errors" => ["Benutzername oder Email ist bereits vergeben."]];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $this->con->prepare("INSERT INTO user (firstname, lastname, userName, email, userPassword, company)
        VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $firstname, $lastname, $username, $email, $hashedPassword, $company);

        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["success" => false, "errors" => ["Fehler bei der Registrierung."]];
        }
    }

    private function validate($username, $password, $firstname, $lastname, $email) {
        if (empty($username)) {
            $this->errors[] = "Benutzername erforderlich!";
        } elseif (!preg_match("/^[a-zA-Z0-9_]+$/", $username)) {
            $this->errors[] = "Benutzername kann nur Buchstaben, Zahlen und Unterstriche enthalten.";
        }

        if (empty($password)) {
            $this->errors[] = "Passwort erforderlich!";
        } else {
            if (!preg_match("/[A-Z]/", $password)) $this->errors[] = "Passwort muss einen Großbuchstaben enthalten.";
            if (!preg_match("/[a-z]/", $password)) $this->errors[] = "Passwort muss einen Kleinbuchstaben enthalten.";
            if (!preg_match("/[0-9]/", $password)) $this->errors[] = "Passwort muss eine Zahl enthalten.";
        }

        if (empty($lastname)) {
            $this->errors[] = "Nachname erforderlich!";
        }

        if (empty($firstname)) {
            $this->errors[] = "Vorname erforderlich!";
        }

        if (empty($email)) {
            $this->errors[] = "E-Mail erforderlich!";
        }
    }

    private function userExists($username, $email): bool {
        $stmt = $this->con->prepare("SELECT 1 FROM user WHERE userName = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $stmt->store_result(); 
        return $stmt->num_rows > 0;
    }
    }
?>
