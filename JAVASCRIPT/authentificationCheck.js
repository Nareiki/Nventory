document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

async function checkAuthentication() {
  try {
    const response = await fetch('./api/auth.php');
    const data = await response.json();

    if (!data.authenticated) {
      window.location.href = './loginPage.php';
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen der Authentifizierung:', error);
    window.location.href = './loginPage.php';
  }
}