<?php
// require_once 'connection.php';
// ini_set('display_errors',1);
// error_reporting(E_ALL);

$rows = [];
$errorMsg = null;

$apiUrl = 'http://localhost:3000/article-transaction/transactions';
$response = @file_get_contents($apiUrl);
if ($response === false) {
    $errorMsg = 'Keine Verbindung zum Backend-Server. Bitte versuchen Sie es später erneut.';
} else {
    $apiData = json_decode($response, true);
    if (is_array($apiData) && count($apiData) > 0) {
        $rows = $apiData;
    } else {
        $errorMsg = 'Keine Transaktionsdaten verfügbar.';
    }
}
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Transaktionen · Nventory</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <!-- zentrales Layout + Seiten-Spezifisches CSS -->
    <link rel="stylesheet" href="CSS/layout.css">
    <link rel="stylesheet" href="CSS/transactions.css">
</head>

<body>
    <!-- ---------------------------------------------------------------- TOPBAR -->
    <header class="topbar">
        <a href="index.php"><img src="pictures/logoTest_transparent.png" alt="Home"></a>
    </header>

    <div class="wrapper">
        <!-- ----------------------------------------------------------- SIDEBAR -->
        <?php
      $current = 'transactions';               // aktive Seite (für Markierung)
      include 'includes/sidebar.php';
    ?>

        <!-- ---------------------------------------------------------- CONTENT -->
        <main class="content">
            <h1>Transaktionen (Ein- und Ausbuchungen)</h1>
            <?php if ($errorMsg): ?>
            <section class="card full"
                style="background:var(--bg-1); color:var(--accent); padding:1.5rem; border-radius:8px; margin-bottom:1.5rem; text-align:center; font-size:1.1rem;">
                <span class="muted"><?= htmlspecialchars($errorMsg) ?></span>
            </section>
            <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Datum / Zeit</th>
                        <th>Typ</th>
                        <th>Artikel</th>
                        <th>Stück</th>
                        <th>Wert&nbsp;in&nbsp;€</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($rows as $r): ?>
                    <?php
            $isOut      = strtolower($r['transactionType']) === 'out';
            $qty        = (int)$r['transactionAmount'];
            $signedQty  = $isOut ? -$qty :  $qty;           // mit Vorzeichen
            $lineValue  = $qty * (float)$r['transactionPrice'];
          ?>
                    <tr>
                        <td><?= date('d.m.Y H:i', strtotime($r['transactionTimestamp'])) ?></td>
                        <td class="<?= $isOut ? 'out' : 'in' ?>"><?= strtoupper($r['transactionType']) ?></td>
                        <td>#<?= $r['artikelnummer'] ?? $r['a_articleID'] ?? '?' ?> –
                            <?= htmlspecialchars($r['produktname'] ?? $r['a_articleName'] ?? '') ?></td>
                        <td><?= ($signedQty > 0 ? '+' : '') . $signedQty ?></td>
                        <td><?= number_format($lineValue, 2, ',', '.') ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </main>
    </div>
</body>

</html>