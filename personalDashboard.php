<?php
require_once 'connection.php';
ini_set('display_errors',1);
error_reporting(E_ALL);

$conn = getDBConnection();
$threshold = 5;

//Kennzahlen
$totalProducts  = $conn->query("SELECT COUNT(*) FROM Artikel")->fetch_row()[0];
$totalQuantity  = $conn->query("SELECT IFNULL(SUM(Menge),0) FROM Artikel")->fetch_row()[0];
$inventoryValue = $conn->query("SELECT IFNULL(SUM(Menge*Kaufpreis),0) FROM Artikel")->fetch_row()[0];

//Low Stock Artikel
$lowStmt = $conn->prepare("SELECT Artikelnummer, Produktname, Menge FROM Artikel WHERE Menge<=? ORDER BY Menge ASC, Produktname");
$lowStmt->bind_param('i',$threshold);
$lowStmt->execute();
$lowItems = $lowStmt->get_result()->fetch_all(MYSQLI_ASSOC);
$lowStmt->close();
$lowCnt = count($lowItems);

//Top‑5 Bestseller 30 Tage
$topQ = "
  SELECT A.Artikelnummer,
         A.Produktname,
         SUM(T.transactionAmount)          AS sold
  FROM   ArticleTransactions T
  JOIN   Artikel A ON A.Artikelnummer = T.articleID
  WHERE  T.transactionType = 'out'                                 -- nur Verkäufe
    AND  T.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  GROUP  BY T.articleID
  ORDER  BY sold DESC
  LIMIT  5";
$topItems = $conn->query($topQ)->fetch_all(MYSQLI_ASSOC);

// Verkäufe letzte 7 Tage
$salesSql = "
  SELECT DATE(T.transactionTimestamp) AS d,
         SUM(T.transactionAmount) AS s
  FROM   ArticleTransactions T
  WHERE  T.transactionType = 'out'
    AND  T.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
  GROUP  BY d";
$raw = $conn->query($salesSql);

$tmp = [];
while ($r = $raw->fetch_assoc()) {
    $tmp[$r['d']] = $r['s'];   // am jeweiligen Tag verkaufte Stückzahl
}
$labels = $values = [];
for ($i = 6; $i >= 0; $i--) {
    $d          = date('Y-m-d', strtotime("-$i day"));
    $labels[]   = date('d.m', strtotime($d));
    $values[]   = $tmp[$d] ?? 0;
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Nventory · Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="CSS/layout.css">   
  <link rel="stylesheet" href="CSS/dashboard.css">
</head>
<body>
<!-- Header mit Logo, führt zur Startseite -->
<header class="topbar"><a href="index.php"><img src="pictures/logoTest_transparent.png" alt="Home"></a></header>

<div class="wrapper">
  <?php 
    $current = 'dashboard'; // Aktuelle Seite
    include 'includes/sidebar.php'; ?>   <!--Sidebar-->
  <main class="content">
    <h1>Dashboard</h1>
    <section class="cards">
      <div class="card"><h2>Produkte gesamt</h2><p><?= $totalProducts ?></p></div>
      <div class="card"><h2>Summe Stückzahlen</h2><p><?= $totalQuantity ?></p></div>
      <div class="card"><h2>Low‑Stock Artikel</h2><p><?= $lowCnt ?></p></div>
      <div class="card"><h2>Inventarwert (€)</h2><p><?= number_format($inventoryValue,2,',','.') ?></p></div>
    </section>
    <section class="card full">
      <h2>Artikel mit geringem Bestand (≤ <?= $threshold ?>)</h2>
      <?php if(!$lowCnt): ?><p class="muted">Keine kritischen Bestände.</p><?php else: ?><div class="list">
        <?php foreach($lowItems as $it): ?>
          <div class="list-item"><span>#<?= $it['Artikelnummer'] ?> – <?= htmlspecialchars($it['Produktname']) ?></span><strong><?= $it['Menge'] ?></strong></div>
        <?php endforeach; ?></div><?php endif; ?>
    </section>
    <section class="card full">
      <h2>Top 5 Bestseller (30 Tage)</h2>
      <?php if(!$topItems): ?><p class="muted">Noch keine Verkäufe.</p><?php else: ?><div class="list">
        <?php foreach($topItems as $t): ?>
          <div class="list-item"><span>#<?= $t['Artikelnummer'] ?> – <?= htmlspecialchars($t['Produktname']) ?></span><strong><?= $t['sold'] ?></strong></div>
        <?php endforeach; ?></div><?php endif; ?>
    </section>
    <section class="card full">
      <h2>Verkäufe letzte 7 Tage</h2><canvas id="salesChart"></canvas>
    </section>
  </main>
</div>
<!-- <script src="JAVASCRIPT/authentificationCheck.js"> -->
  <script>
  document.addEventListener('DOMContentLoaded',()=>{
    new Chart(document.getElementById('salesChart'),{
      type:'bar',
      data:{labels:<?=json_encode($labels)?>,datasets:[{data:<?=json_encode($values)?>}]},
      options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'#333'},ticks:{color:'#ccc'}},x:{grid:{display:false},ticks:{color:'#ccc'}}}}
    });
  });
</script>
</body>
</html>
