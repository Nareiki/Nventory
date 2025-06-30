<?php
require_once "../connection.php";

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
        at.articleID,
        a.Produktname,
        
        -- Durchschnittlicher Kaufpreis (Einkaufspreis)
        ROUND(AVG(CASE WHEN at.transactionType = 'in' THEN at.transactionPrice ELSE NULL END), 2) AS DurchschnittlicherKaufpreis,
        
        -- Bestand aus der artikel Tabelle
        a.Menge AS Bestand,
        
        -- Durchschnittlicher Verkaufspreis
        ROUND(AVG(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice ELSE NULL END), 2) AS DurchschnittlicherVerkaufspreis,
        
        -- Gesamtumsatz letzter Monat
        SUM(CASE 
            WHEN at.transactionType = 'out' 
            AND at.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            THEN at.transactionPrice * at.transactionAmount 
            ELSE 0 
        END) AS Gesamtumsatz,
        
        -- Verkaufsmenge letzter Monat
        SUM(CASE 
            WHEN at.transactionType = 'out' 
            AND at.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            THEN at.transactionAmount 
            ELSE 0 
        END) AS Verkaufsmenge
        
    FROM articletransactions as at
    LEFT JOIN artikel a ON at.articleID = a.Artikelnummer
    WHERE at.articleID = ?
    GROUP BY at.articleID, a.Produktname
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
