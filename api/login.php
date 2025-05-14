<?php
require_once("../includes/UserLogin.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    session_start();

    $login = new UserLogin();
    $result = $login->authenticate($_POST);

    if ($result["success"]) {
        $_SESSION["username"] = $result["data"]["username"];
        $_SESSION["email"] = $result["data"]["email"];
        $_SESSION["loggedIn"] = true;
    }

    echo json_encode($result);
}