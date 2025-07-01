<?php
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

// Daten vom Backend holen
$apiUrl = 'http://localhost:3000/article/' . urlencode($artikelnummer);
$apiResponse = @file_get_contents($apiUrl);
if (!$apiResponse) {
    echo '<p style="color:red">Keine Verbindung zum Backend-Server.</p>';
    exit;
}
$article = json_decode($apiResponse, true);
if (!$article || !is_array($article)) {
    echo '<p style="color:orange">Kein Artikel gefunden.</p>';
    exit;
}
?>
<div class="articleBox">
    <h3>Artikel #<?= htmlspecialchars($article['Artikelnummer'] ?? $article['articleID']) ?></h3>
    <ul>
        <li><strong>Name:</strong> <?= htmlspecialchars($article['Produktname'] ?? $article['articleName']) ?></li>
        <li><strong>Info:</strong> <?= htmlspecialchars($article['Information'] ?? $article['articleInfo'] ?? '-') ?>
        </li>
        <li><strong>Menge:</strong> <?= (int)($article['Menge'] ?? $article['articleAmount']) ?></li>
        <li><strong>Preis:</strong>
            <?= number_format($article['Kaufpreis'] ?? $article['purchasePrice'] ?? 0, 2, ',', '.') ?> €</li>
    </ul>
</div>