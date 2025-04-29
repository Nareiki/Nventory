// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Formular-Element auswählen
    const form = document.getElementById('login-form');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', function(event) {
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
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

        // Formular-Daten sammeln
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            remember: document.getElementById('remember').checked
        };

        // Hier würde normalerweise der Code zum Senden der Daten an einen Server stehen
        // und die Authentifizierungslogik

        // Zu Demonstrationszwecken zeigen wir nur eine Erfolgsmeldung in der Konsole
        console.log('Login-Versuch:', formData.email);

        // Simulierte Anmeldung (in einer echten Anwendung würde hier eine API-Anfrage erfolgen)
        simulateLogin(formData.email);
    });

    // Optionale Funktion: Validierung während der Eingabe
    const inputs = form.querySelectorAll('input[type="email"], input[type="password"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#3182ce';
        });
    });

    // Simulation einer Login-Anfrage (nur für Demo-Zwecke)
    function simulateLogin(email) {
        // Simuliere einen Ladevorgang
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'Wird angemeldet...';
        submitBtn.disabled = true;

        // Timeout simuliert eine Netzwerkanfrage
        setTimeout(() => {
            // In einer echten Anwendung würde hier die Antwort vom Server verarbeitet
            if (email.includes('@')) {
                // Erfolgreicher Login
                alert('Login erfolgreich! Du wirst weitergeleitet...');
                // Hier würde normalerweise eine Weiterleitung erfolgen
                // window.location.href = 'dashboard.html';
            } else {
                // Fehlgeschlagener Login
                alert('Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
                submitBtn.textContent = 'Anmelden';
                submitBtn.disabled = false;
            }
        }, 1500);
    }
});