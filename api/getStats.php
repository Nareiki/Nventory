<?php
require_once "../connection.php";

$conn = getDBConnection();

// Hauptabfrage: Kennzahlen pro Artikel
$sql = "
    SELECT 
        at.articleID,
        a.Produktname,
        
        -- Gesamtumsatz aus Verkäufen, 0 wenn keine Verkäufe
        CASE 
            WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN 0
            ELSE SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice * at.transactionAmount ELSE 0 END)
        END AS Gesamtumsatz,
        
        -- Gesamtmenge der Verkäufen, 0 wenn keine Verkäufe
        CASE 
            WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN 0
            ELSE SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionAmount ELSE 0 END)
        END AS Gesamtmenge,
        
        -- Deckungsbeitrag basierend nur auf Preisen, 0 wenn keine Verkäufe
        CASE 
            WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN NULL
            ELSE (SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice ELSE 0 END) -
                SUM(CASE WHEN at.transactionType = 'in' THEN at.transactionPrice ELSE 0 END))
        END AS Deckungsbeitrag
        
        FROM articletransactions as at
        LEFT JOIN artikel a ON at.articleID = a.Artikelnummer
        GROUP BY at.articleID, a.Produktname;
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
