<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include_once "../includes/UserRegistration.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    error_log("[UserRegistration] DB connection established");
    $registration = new UserRegistration;
    $result = $registration->register($_POST);
    echo json_encode($result);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "errors" => ["Ungültige Anfrage."]]);
}