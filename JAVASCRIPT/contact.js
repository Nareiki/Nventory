// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Formular-Element auswählen
    const form = document.getElementById('contact-form');

    // Event-Listener für das Absenden des Formulars
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

        // Formular-Daten sammeln
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            privacy: document.getElementById('privacy').checked
        };

        // Hier würde normalerweise der Code zum Senden der Daten an einen Server stehen
        // Beispiel: fetchAPI oder XMLHttpRequest

        // Zu Demonstrationszwecken zeigen wir nur eine Erfolgsmeldung in der Konsole
        console.log('Formular wurde abgesendet:', formData);

        // Bestätigungsmeldung für den Benutzer
        alert('Vielen Dank für deine Nachricht! Wir werden uns bald bei dir melden.');

        // Formular zurücksetzen
        form.reset();
    });

    // Optionale Funktion: Validierung während der Eingabe
    const inputs = form.querySelectorAll('input, textarea');

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
});