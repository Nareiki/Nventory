<?php
require_once("../includes/UserRegistration.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $registration = new UserRegistration;
    $result = $registration->register($_POST);
    echo json_encode($result);
}


