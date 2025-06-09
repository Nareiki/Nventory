<?php
// getProductData.php
require_once 'connection.php';
header('Content-Type: text/html; charset=utf-8');

// Prüfen Eingabe des Users im Scanner
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['wert'])) {
    http_response_code(400);
    echo '<p style="color:red">Keine Artikelnummer übergeben.</p>';
    exit;
}

$artikelnummer = intval($_POST['wert']);
if ($artikelnummer <= 0) {
    http_response_code(400);
    echo '<p style="color:red">Ungültige Artikelnummer.</p>';
    exit;
}

// Fragen Datenbank ab
try {
    $db = getDBConnection();

    $stmt = $db->prepare("
        SELECT Artikelnummer, Produktname, Information, Menge, Kaufpreis
        FROM Artikel
        WHERE Artikelnummer = ?
    ");
    $stmt->bind_param('i', $artikelnummer);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {

    
        // Liefern danach Kurzinfo über die Aktualisierung und des Artikels als HTML Snippet zurück
        ?>
        <div class="articleBox">
            <h3>Artikel #<?= htmlspecialchars($row['Artikelnummer']) ?></h3>
            <ul>
                <li><strong>Name:</strong> <?= htmlspecialchars($row['Produktname']) ?></li>
                <li><strong>Info:</strong> <?= htmlspecialchars($row['Information'] ?: '-') ?></li>
                <li><strong>Menge:</strong> <?= (int)$row['Menge'] ?></li>
                <li><strong>Preis:</strong> <?= number_format($row['Kaufpreis'], 2, ',', '.') ?> €</li>
            </ul>
        </div>
        <?php
    } else {
        echo '<p style="color:orange">Kein Artikel gefunden.</p>';
    }

    $stmt->close();
    $db->close();

} catch (Exception $e) {
    http_response_code(500);
    echo '<p style="color:red">Serverfehler: ' . htmlspecialchars($e->getMessage()) . '</p>';
}
