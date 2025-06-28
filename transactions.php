<?php
require_once 'connection.php';
ini_set('display_errors',1);
error_reporting(E_ALL);

$conn = getDBConnection();

$sql = "
    SELECT  T.transactionID,
            T.transactionTimestamp,
            T.transactionType,
            T.transactionAmount,
            T.transactionPrice,
            A.Artikelnummer,
            A.Produktname
    FROM    ArticleTransaction  T
    JOIN    Artikel             A  ON A.Artikelnummer = T.articleID
    ORDER BY T.transactionTimestamp DESC
    LIMIT 1000";
$rows = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
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
            <td>#<?= $r['Artikelnummer'] ?> – <?= htmlspecialchars($r['Produktname']) ?></td>
            <td><?= ($signedQty > 0 ? '+' : '') . $signedQty ?></td>
            <td><?= number_format($lineValue, 2, ',', '.') ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </main>
  </div>
</body>
</html>
