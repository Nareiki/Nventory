checkIfAuthenticated();

async function checkIfAuthenticated() {
    try {
        const response = await fetch('./api/auth.php');
        const data = await response.json();

        if (data.authenticated) {
            window.location.href = './personalDashboard.php';
        }
    } catch (error) {
        console.error('Fehler bei der Authentifizierungsprüfung:', error);
    }
}

// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function () {
    // Formular-Element auswählen
    const form = document.getElementById('login-form');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', function (event) {
        // Verhindert, dass der Button das Formular absendet oder den Fokus verschiebt
        event.preventDefault();

        // Speichert den aktuellen Fokuszustand des Passwortfelds
        const wasFocused = document.activeElement === passwordInput;

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }

        // Setzt Fokus zurück, falls das Feld vorher fokussiert war
        if (wasFocused) {
            passwordInput.focus();
        }
    });

    // Event-Listener für das Absenden des Formulars
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

        // Formular-Daten sammeln
        const formData = new FormData();
        formData.append('username', document.getElementById('username').value);
        formData.append('password', document.getElementById('password').value);
        formData.append('remember', document.getElementById('remember').checked ? '1' : '0');

        // Hier würde normalerweise der Code zum Senden der Daten an einen Server stehen
        // und die Authentifizierungslogik

        // Zu Demonstrationszwecken zeigen wir nur eine Erfolgsmeldung in der Konsole
        console.log('Login-Versuch:', formData.username);

        // Simulierte Anmeldung (in einer echten Anwendung würde hier eine API-Anfrage erfolgen)
        login(formData);
    });

    // Optionale Funktion: Validierung während der Eingabe
    const inputs = form.querySelectorAll('input[type="email"], input[type="password"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });

        input.addEventListener('focus', function () {
            this.style.borderColor = '#3182ce';
        });
    });

    async function login(formData) {

        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'Wird angemeldet...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('./api/login.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert('Login erfolgreich! Du wirst weitergeleitet...');
                window.location.href = './personalDashboard.php';
            } else {
                alert(data.message || 'Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
                submitBtn.textContent = 'Anmelden';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Fehler beim Login:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            submitBtn.textContent = 'Anmelden';
            submitBtn.disabled = false;
        }
    }

    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const payload = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        let output = document.querySelector(".error-output");
        if (!output) {
            output = document.createElement('div');
            output.className = 'error-output';
            this.appendChild(output);
        }
        output.innerHTML = '';
        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            let data;
            try {
                data = await response.json();
            } catch (jsonErr) {
                console.error("JSON parse error", jsonErr);
                output.innerHTML = '<p style="color:red;">Server returned invalid JSON.</p>';
                return;
            }
            console.log("Response data:", data);
            if (data.token) {
                document.cookie = `username=${encodeURIComponent(data.user?.username || '')}; path=/; max-age=604800`;
                document.cookie = `email=${encodeURIComponent(data.user?.email || '')}; path=/; max-age=604800`;
                document.cookie = `loggedIn=true; path=/; max-age=604800`;

                window.location.href = "./personalDashboard.php";
            } else if (data.errors) {
                output.innerHTML = data.errors.map(error =>
                    `<p style="color:red;">${error}</p>`
                ).join('');
            } else {
                output.innerHTML = `<p style="color:red;">${data.message || 'Unbekannter Fehler.'}</p>`;
            }
        } catch (err) {
            console.error("Fetch error", err);
            output.innerHTML = '<p style="color:red;">Verbindungsfehler oder Server nicht erreichbar.</p>';
        }
    });
});