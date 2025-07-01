<?php

class UserLogin {
    // Login via backend API
    public static function authenticate(array $data): array {
        $username = trim($data["username"] ?? '');
        $password = trim($data["password"] ?? '');

        if (empty($username) || empty($password)) {
            return ["success" => false, "message" => "Benutzername und Passwort erforderlich."];
        }

        $apiUrl = 'http://localhost:3000/user/login';
        $payload = json_encode([
            'username' => $username,
            'password' => $password
        ]);
        $options = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content' => $payload,
                'ignore_errors' => true
            ]
        ];
        $context  = stream_context_create($options);
        $response = @file_get_contents($apiUrl, false, $context);
        if ($response === false) {
            return ["success" => false, "message" => "Keine Verbindung zum Backend-Server."];
        }
        $result = json_decode($response, true);
        if (!$result || !isset($result['token'])) {
            return ["success" => false, "message" => $result['message'] ?? "Ungültige Antwort vom Backend."];
        }
        // Return token and user info for session management
        return ["success" => true, "token" => $result['token'], "user" => $result['user'] ?? null];
    }

    // Registration via backend API
    public static function register(array $data): array {
        $username = trim($data["username"] ?? '');
        $password = trim($data["password"] ?? '');
        $email    = trim($data["email"] ?? '');

        if (empty($username) || empty($password) || empty($email)) {
            return ["success" => false, "message" => "Alle Felder sind erforderlich."];
        }

        $apiUrl = 'http://localhost:3000/user/register';
        $payload = json_encode([
            'username' => $username,
            'password' => $password,
            'email'    => $email
        ]);
        $options = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content' => $payload,
                'ignore_errors' => true
            ]
        ];
        $context  = stream_context_create($options);
        $response = @file_get_contents($apiUrl, false, $context);
        if ($response === false) {
            return ["success" => false, "message" => "Keine Verbindung zum Backend-Server."];
        }
        $result = json_decode($response, true);
        if (!$result || !isset($result['success'])) {
            return ["success" => false, "message" => $result['message'] ?? "Ungültige Antwort vom Backend."];
        }
        return $result;
    }
}