<?php
require_once "../connection.php";
header('Content-Type: application/json');

$conn = getDBConnection();

$sql = "
    SELECT 
        t.Artikelnummer,
        t.Produktname,
        SUM(t.Menge) AS Gesamtmenge,
        a.Kaufpreis,
        AVG(t.Verkaufspreis) AS DurchschnittlicherVerkaufspreis,
        SUM(t.Menge * t.Verkaufspreis) AS Gesamtumsatz,
        AVG(t.Verkaufspreis - a.Kaufpreis) AS DurchschnittlicherDeckungsbeitrag,
        SUM(t.Menge * (t.Verkaufspreis - a.Kaufpreis)) AS GesamtDeckungsbeitrag
    FROM transaktions t
    JOIN Artikel a ON t.Artikelnummer = a.Artikelnummer
    GROUP BY t.Artikelnummer, t.Produktname, a.Kaufpreis
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit;
}

$produkte = [];

while ($row = $result->fetch_assoc()) {
    $produkte[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $produkte
]);

