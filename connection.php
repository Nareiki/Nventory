<?php
$host = 'localhost';
$dbname = 'productsDB';
$username = 'root';
$password = ''; //cyfcaj-mepHyh-mitpe9

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Optional: echo "Verbindung erfolgreich!";
} catch (PDOException $e) {
    die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
}


function getDBConnection() {
    // Datenbankparameter
    $host = "localhost";      // Hostname des Datenbankservers
    $username = "root";  // Datenbankbenutzername
    $password = "";      // Datenbankpasswort
    $dbname = "productsDB";      // Name der Datenbank

    // Neue Verbindung erstellen
    $conn = new mysqli($host, $username, $password, $dbname);

    // Verbindung prüfen
    if ($conn->connect_error) {
        die("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }

    // Zeichensatz auf UTF-8 setzen
    $conn->set_charset("utf8");

    return $conn;
}


?>
