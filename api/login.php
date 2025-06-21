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

    if (isset($_POST['remember']) && $_POST['remember'] === '1') {
        setcookie("rememberedUsername", $_POST["username"], time() + (86400 * 30), "/");
    }

    echo json_encode($result);
}
