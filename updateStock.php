<?php
require_once 'connection.php';
header('Content-Type: application/json');

//prüfen Eingabe
$artNr   = isset($_POST['artikelnummer']) ? intval($_POST['artikelnummer']) : 0;
$delta   = isset($_POST['delta']) ? intval($_POST['delta']) : 0;  // delta kann + / – sein, ist die Anzahl der Veränderungen des Bestandes in Stück, also +1 oder -1 aber auch +n oder -n

if ($artNr <= 0 || $delta === 0) {
    http_response_code(400);
    echo json_encode(['success'=>false,'msg'=>'Ungültige Parameter']);
    exit;
}

try {
    $db = getDBConnection();

    // Transaktion der Infos
    $db->begin_transaction();

    // holen zuerst aktuellen Bestand 
    $stmt = $db->prepare("SELECT Menge FROM Artikel WHERE Artikelnummer = ?");
    $stmt->bind_param("i", $artNr);
    $stmt->execute();
    $stmt->bind_result($mengeAlt);
    if (!$stmt->fetch()) {
        throw new Exception('Artikel nicht gefunden');
    }
    $stmt->close();

    $mengeNeu = $mengeAlt + $delta;
    if ($mengeNeu < 0) {
        throw new Exception("Ausbuchung größer als Bestand ($mengeAlt)");
    }

    // Updaten dann mit Eingaben des Users
    $stmt = $db->prepare("UPDATE Artikel SET Menge = ? WHERE Artikelnummer = ?");
    $stmt->bind_param("ii", $mengeNeu, $artNr);
    $stmt->execute();
    $stmt->close();

    $db->commit(); //neue Menge wird endgültig übernommen
    echo json_encode(['success'=>true,'mengeNeu'=>$mengeNeu]);

} catch (Exception $e) {
    if ($db->in_transaction) $db->rollback(); //rollback, damit wir den Bestand nicht ändern, falls während der Transaktion etwas schief geht
    http_response_code(500);
    echo json_encode(['success'=>false,'msg'=>$e->getMessage()]);
}
