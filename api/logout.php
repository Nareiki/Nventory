<?php
session_start();
session_unset();
session_destroy();

setcookie("rememberedUsername", "", time() - 3600, "/"); // Cookie löschen

header("Location: loginPage.html");