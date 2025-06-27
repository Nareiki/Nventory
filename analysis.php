<?php
require_once 'connection.php';
ini_set('display_errors',1);
error_reporting(E_ALL);

$conn = getDBConnection();

/* Nutzwertanalyse: Ø Verkauf, Bestand, Tage, Reichweite*/
$sql = "SELECT A.Artikelnummer, A.Produktname, A.Menge,
               IFNULL(SUM(CASE WHEN S.delta<0 THEN -S.delta END),0) AS sold30
        FROM Artikel A
        LEFT JOIN StockTransactions S
               ON S.artikelnummer=A.Artikelnummer
              AND S.delta<0
              AND S.created_at>=DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY A.Artikelnummer";
$rows = [];
$res  = $conn->query($sql);
while($r = $res->fetch_assoc()){
  $avg = $r['sold30']/30;
  $r['avg'] = $avg;
  $r['days'] = $avg ? round($r['Menge']/$avg,1) : null;
  $rows[] = $r;
}
usort($rows, fn($a,$b) => ($a['days']??PHP_INT_MAX) <=> ($b['days']??PHP_INT_MAX));
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nutzwertanalyse · Nventory</title>

  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet">
    <link rel="stylesheet" href="CSS/layout.css">   
    <link rel="stylesheet" href="CSS/analysis.css">
</head>

<body>
<header class="topbar">
  <a href="index.php">
    <img src="pictures/logoTest_transparent.png" alt="Home">
  </a>
</header>
 
<div class="wrapper">
    <?php 
      $current = 'analysis'; // Aktuelle Seite
      include 'includes/sidebar.php'; 
    ?>   
  </nav>

  <main class="content">
    <h1>Nutzwertanalyse</h1>
    <table>
      <thead><tr>
        <th>Artikel</th><th>Ø Verk./Tag</th><th>Bestand</th><th>Tage Vorrat</th>
      </tr></thead>
      <tbody>
      <?php foreach($rows as $r): ?>
        <tr>
          <td>#<?= $r['Artikelnummer'] ?> – <?= htmlspecialchars($r['Produktname']) ?></td>
          <td><?= $r['avg']?number_format($r['avg'],2,',','.'):'–' ?></td>
          <td><?= $r['Menge'] ?></td>
          <td><?= $r['days']!==null?$r['days']:'∞' ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </main>
  <!-- <script src="JAVASCRIPT/authentificationCheck.js"></script> -->
</body>
</html>
