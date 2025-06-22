<?php 
    include("HTML/header.html");
?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Nventory</title>
        <link rel="stylesheet" href="CSS/login.css">
    </head>
    <body>
    <div class="container">
        <div class="form-container">
            <h1>Registrieren</h1>
            <p class="subtitle">Erstelle einen neuen Account</p>
            <div class="error-output"></div>

            <form id="register-form" action="#" method="POST">
                <div class="form-group">
                    <label for="firstname">Vorname</label>
                    <input type="text" id="firstname" name="firstname" placeholder="Max" required>
                </div>

                <div class="form-group">
                    <label for="lastname">Nachname</label>
                    <input type="text" id="lastname" name="lastname" placeholder="Mustermann" required>
                </div>

                
                <div class="form-group">
                    <label for="company">Unternehmen</label>
                    <input type="text" id="company" name="company" placeholder="Mustermann GmbH">
                </div>

                <div class="form-group">
                    <label for="username">Benutzername:</label>
                    <input type="text" id="username" name="username" pattern="[a-zA-Z0-9_]+" placeholder="max_mustermann" required><br>
                    <p style="font-size: small;"> Benutzername kann nur Klein- und Großbuchstaben, Zahlen und Underscores beinhalten.</p>
                </div>

                <div class="form-group">
                    <label for="email">E-Mail</label>
                    <input type="email" id="email" name="email" placeholder="deine@email.com" required>
                </div>

                <div class="form-group password-group">
                    <label for="password">Passwort</label>
                    <div class="password-input-container">
                        <input type="password" id="password" name="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$" placeholder="Dein Passwort" required>
                        <p style="font-size: small;"> Das Passwort muss mindestens einen Klein- und Großbuchstaben, sowie eine Zahl enthalten!</p>
                        <button type="button" id="toggle-password" class="toggle-password">
                            <span class="eye-icon"><img src="pictures/icons/eye-regular.svg" height=" 15px" >️</span>
                        </button>
                    </div>
                </div>

                <button type="submit" class="submit-btn">Account erstellen</button>
            </form>

            <div class="signup-link">
                <p>Bereits ein Konto? <a href="loginPage.php">Jetzt anmelden</a></p>
            </div>
        </div>
    </div>

    <script src="JAVASCRIPT/register.js"></script>
    </body>
    </html>


<?php include("HTML/footer.html"); ?>