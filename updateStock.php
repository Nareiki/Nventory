<?php
require_once 'connection.php';
header('Content-Type: application/json');

$artNr = isset($_POST['artikelnummer']) ? (int)$_POST['artikelnummer'] : 0;
$delta = isset($_POST['delta'])        ? (int)$_POST['delta']        : 0; // Plus/minus Stück

if ($artNr <= 0 || $delta === 0) {
    http_response_code(400);
    echo json_encode(['success'=>false,'msg'=>'Ungültige Parameter']);
    exit;
}

try {
    $db = getDBConnection();
    $db->begin_transaction();

    /* aktuellen Bestand und Preis holen */
    $stmt = $db->prepare(
        "SELECT Menge, Kaufpreis
           FROM Artikel
          WHERE Artikelnummer = ?");
    $stmt->bind_param("i", $artNr);
    $stmt->execute();
    $stmt->bind_result($mengeAlt, $stkPreis);
    if (!$stmt->fetch()) {
        throw new Exception('Artikel nicht gefunden');
    }
    $stmt->close();

    /* neuen Bestand errechnen und Plausibilität */
    $mengeNeu = $mengeAlt + $delta;
    if ($mengeNeu < 0) {
        throw new Exception("Ausbuchung größer als Bestand ($mengeAlt)");
    }

    /* Artikel-Tabelle aktualisieren */
    $stmt = $db->prepare(
        "UPDATE Artikel
            SET Menge = ?
          WHERE Artikelnummer = ?");
    $stmt->bind_param("ii", $mengeNeu, $artNr);
    $stmt->execute();
    $stmt->close();

    /* Bewegungs-Log in ArticleTransactions */
    $amount       = abs($delta);  // immer positiv
    $type         = $delta > 0 ? 'in' : 'out'; 
    $pricePerUnit = $stkPreis; // Kaufpreis aus Artikel-Tabelle

    $log = $db->prepare(
        "INSERT INTO ArticleTransactions
                (articleID, transactionPrice, transactionAmount, transactionType)
         VALUES (?,        ?,                ?,                 ?)");
    $log->bind_param("idis",                 
                     $artNr,
                     $pricePerUnit,
                     $amount,
                     $type);
    $log->execute();
    $log->close();

    $db->commit();

    echo json_encode(['success'=>true,'mengeNeu'=>$mengeNeu]);

} catch (Exception $e) {
    if ($db->in_transaction) $db->rollback();
    http_response_code(500);
    echo json_encode(['success'=>false,'msg'=>$e->getMessage()]);
}
