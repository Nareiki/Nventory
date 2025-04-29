<?php include("HTML/header.html") ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Nventory</title>
    <link rel="stylesheet" href="/CSS/login.css">
</head>
<body>
<div class="container">
    <div class="form-container">
        <h1>Anmelden</h1>
        <p class="subtitle">Melde dich mit deinen Zugangsdaten an</p>

        <form id="login-form" action="#" method="POST">
            <div class="form-group">
                <label for="email">E-Mail</label>
                <input type="email" id="email" name="email" placeholder="deine@email.com" required>
            </div>

            <div class="form-group password-group">
                <label for="password">Passwort</label>
                <div class="password-input-container">
                    <input type="password" id="password" name="password" placeholder="Dein Passwort" required>
                    <button type="button" id="toggle-password" class="toggle-password">
                        <span class="eye-icon"><img src="pictures/icons/eye-regular.svg" height=" 15px" >️</span>
                    </button>
                </div>
            </div>

            <div class="form-options">
                <div class="checkbox-container">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Angemeldet bleiben</label>
                </div>
                <a href="#" class="forgot-password">Passwort vergessen?</a>
            </div>

            <button type="submit" class="submit-btn">Anmelden</button>
        </form>

        <div class="signup-link">
            <p>Noch kein Konto? <a href="register.php">Jetzt registrieren</a></p>
        </div>
    </div>
</div>

<script src="JAVASCRIPT/login.js"></script>
</body>
</html>


<?php include("HTML/footer.html") ?>