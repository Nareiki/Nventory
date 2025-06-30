<?php
require_once 'connection.php';
header('Content-Type: application/json');

$artNr            = isset($_POST['artikelnummer'])       ? (int)$_POST['artikelnummer']       : 0;
$transactionAmount = isset($_POST['transactionAmount'])  ? (int)$_POST['transactionAmount']   : 0;
$transactionPrice = isset($_POST['transactionPrice'])  ? (int)$_POST['transactionPrice']   : 0;
$transactionType   = isset($_POST['transactionType'])    ? $_POST['transactionType']          : '';

if ($artNr <= 0 || $transactionAmount <= 0 || !in_array($transactionType, ['in', 'out'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'msg'=>'Ungültige Parameter']);
    exit;
}

try {
    $db = getDBConnection();
    $db->begin_transaction();

    // aktuellen Bestand holen
    $stmt = $db->prepare(
        "SELECT Menge
           FROM Artikel
          WHERE Artikelnummer = ?");
    $stmt->bind_param("i", $artNr);
    $stmt->execute();
    $stmt->bind_result($mengeAlt);
    if (!$stmt->fetch()) {
        throw new Exception('Artikel nicht gefunden');
    }
    $stmt->close();

    // neuen Bestand berechnen
    if ($transactionType === 'in') {
        $mengeNeu = $mengeAlt + $transactionAmount;
    } else {
        $mengeNeu = $mengeAlt - $transactionAmount;
        if ($mengeNeu < 0) {
            throw new Exception("Ausbuchung größer als Bestand ($mengeAlt)");
        }
    }

    // Artikel-Tabelle aktualisieren
    $stmt = $db->prepare(
        "UPDATE Artikel
            SET Menge = ?
          WHERE Artikelnummer = ?");
    $stmt->bind_param("ii", $mengeNeu, $artNr);
    $stmt->execute();
    $stmt->close();

    //Eintrag in articleTransactions
    $now = date('Y-m-d H:i:s');
    $log = $db->prepare(
        "INSERT INTO ArticleTransactions
                (articleID, transactionPrice, transactionAmount, transactionTimestamp, transactionType)
         VALUES (?,        ?,                ?,                 ?,                   ?)");
    $log->bind_param("idiss",                  
                     $artNr,
                     $transactionPrice,
                     $transactionAmount,
                     $now,
                     $transactionType);
    $log->execute();
    $log->close();

    $db->commit();

    echo json_encode(['success'=>true, 'mengeNeu'=>$mengeNeu]);

} catch (Exception $e) {
    if ($db->in_transaction) $db->rollback();
    http_response_code(500);
    echo json_encode(['success'=>false, 'msg'=>$e->getMessage()]);
}
