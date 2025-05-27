<?php
require_once("../includes/UserLogin.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $login = new UserLogin();
    $result = $login->authenticate($_POST);

    if ($result["success"]) {
        session_start();
        $_SESSION["username"] = $result["data"]["username"];
        $_SESSION["email"] = $result["data"]["email"];
        $_SESSION["loggedIn"] = true;
    }
    else {
    // Session sofort zerstören
        session_destroy();
    }

    echo json_encode($result);
}