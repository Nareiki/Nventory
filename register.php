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
            <h1>Registrieren</h1>
            <p class="subtitle">Erstelle einen neuen Account</p>

            <form id="login-form" action="#" method="POST">
                <div class="form-group">
                    <label for="firstName">Vorname</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Max" required>
                </div>

                <div class="form-group">
                    <label for="lastName">Nachname</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Mustermann" required>
                </div>

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

                <button type="submit" class="submit-btn">Account erstellen</button>
            </form>

            <div class="signup-link">
                <p>Bereits ein Konto? <a href="login.php">Jetzt anmelden</a></p>
            </div>
        </div>
    </div>

    <script src="JAVASCRIPT/login.js"></script>
    </body>
    </html>


<?php include("HTML/footer.html") ?>