<?php
require_once 'connection.php';


// Content-Type für Text/HTML
header('Content-Type: text/html');

// Artikelnummer aus POST
$wert = isset($_POST['wert']) ? intval($_POST['wert']) : 0;
$conn = getDBConnection();
$stmt = $conn->prepare("SELECT * FROM Artikel WHERE Artikelnummer = ?");
$stmt->bind_param("i", $wert);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo "<div class='articleBox'>";
    echo "<h3>" . htmlspecialchars($row['Produktname']) . "</h3>";
    echo "<p>Artikelnummer: " . htmlspecialchars($row['Artikelnummer']) . "</p>";
    echo "<p>Information: " . htmlspecialchars($row['Information']) . "</p>";
    echo "<p>Bestand: " . htmlspecialchars($row['Menge']) . "</p>";
    echo "<p>Kaufpreis: " . htmlspecialchars($row['Kaufpreis']) . " €</p>";
    echo "</div>";
} else {
    echo "<p>Kein Artikel gefunden.</p>";
}

$stmt->close();
$conn->close();
?>

