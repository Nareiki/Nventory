document.addEventListener('DOMContentLoaded', () => {
    fetch('./api/auth.php')
        .then(response => response.json())
        .then(data => {
            const authContainer = document.getElementById('authButtonContainer');
            if (!authContainer) return;

            const button = document.createElement('a');
            button.id = 'authButton';

            if (data.authenticated) {
                // Eingeloggt → Logout anzeigen
                button.href = './api/logout.php';
                button.textContent = 'Logout';
            } else {
                // Nicht eingeloggt → Login anzeigen
                button.href = './loginPage.php';
                button.textContent = 'Login';
            }

            authContainer.appendChild(button);
        })
        .catch(error => {
            console.error('Fehler beim Authentifizieren:', error);
        });
});

