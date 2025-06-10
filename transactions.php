<?php
require_once 'connection.php';
ini_set('display_errors',1);
error_reporting(E_ALL);

$conn = getDBConnection();

$sql = "SELECT S.id,
               S.created_at,
               S.delta,
               S.transaction_type,
               A.Artikelnummer,
               A.Produktname,
               A.Kaufpreis
        FROM StockTransactions S
        JOIN Artikel A ON A.Artikelnummer = S.artikelnummer
        ORDER BY S.created_at DESC
        LIMIT 1000";
$rows = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Transaktionen · Nventory</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="CSS/transactions.css">
</head>
<body>
<header class="topbar">
  <a href="index.php">
    <img src="pictures/Nventory_Logo.png" alt="Home">
  </a>
</header>
  <nav class="sidebar">
    <a class="nav-item" href="personalDashboard.php">Dashboard</a>
    <a class="nav-item active" href="transactions.php">Transaktionen</a>
    <a class="nav-item" href="analysis.php">Nutzwertanalyse</a>
    <a class="nav-item" href="addProduct.php">Neu-Produkt</a>
  </nav>
  <main class="content">
    <h1>Transaktionen (Ein- und Ausbuchungen)</h1>

    <table>
      <thead>
        <tr>
          <th>Datum / Zeit</th>
          <th>Typ</th>
          <th>Artikel</th>
          <th>Stück</th>
          <th>Wert in €</th>
        </tr>
      </thead>
      <tbody>
      <?php foreach($rows as $r): ?>
        <?php
          $isOut   = $r['delta'] < 0;
          $absQty  = abs($r['delta']);
          $lineVal = $absQty * $r['Kaufpreis'];
        ?>
        <tr>
          <td><?= date('d.m.Y H:i', strtotime($r['created_at'])) ?></td>
          <td class="<?= $isOut ? 'out' : 'in' ?>"><?= $isOut ? 'OUT' : 'IN' ?></td>
          <td>#<?= $r['Artikelnummer'] ?> – <?= htmlspecialchars($r['Produktname']) ?></td>
          <td><?= $isOut ? "-$absQty" : "+$absQty" ?></td>
          <td><?= number_format($lineVal,2,',','.') ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </main>
</body>
</html>
