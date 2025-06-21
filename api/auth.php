<?php
session_start();

$response = ["authenticated" => false];

if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] === true) {
    $response["authenticated"] = true;
} elseif (isset($_COOKIE['rememberedUsername'])) {
    $_SESSION['username'] = $_COOKIE['rememberedUsername'];
    $_SESSION['loggedIn'] = true;
    $response["authenticated"] = true;
}

header('Content-Type: application/json');
echo json_encode($response);