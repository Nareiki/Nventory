<?php
require_once "../connection.php";
header('Content-Type: application/json');

$conn = getDBConnection();

$artikelnummer = $_GET['artikelnummer'] ?? null;

if (!$artikelnummer) {
    echo json_encode([
        "success" => false,
        "error" => "Keine Artikelnummer übergeben."
    ]);
    exit;
}

$sql = "
    SELECT 
        t.Produktname,
        a.Kaufpreis,
        a.Menge - IFNULL(SUM(t.Menge), 0) AS Bestand,
        AVG(t.Verkaufspreis) AS DurchschnittlicherVerkaufspreis,
        SUM(t.Menge * t.Verkaufspreis) AS Gesamtumsatz,
        SUM(t.Menge) AS Verkaeufe
    FROM Artikel a
    LEFT JOIN transaktions t ON a.Artikelnummer = t.Artikelnummer
    WHERE a.Artikelnummer = ?
    -- AND Verkaufsdatum >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    GROUP BY t.Artikelnummer, t.Produktname, a.Menge, a.Kaufpreis;
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $artikelnummer);
$stmt->execute();
$result = $stmt->get_result();

$data = $result->fetch_assoc();

if (!$data) {
    echo json_encode([
        "success" => false,
        "error" => "Kein Produkt mit dieser Artikelnummer gefunden oder keine Daten vorhanden."
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
