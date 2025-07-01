<?php
$thresholdDays = 30; // Betrachtungszeitraum

// Call backend API for analysis data
$apiUrl = "http://localhost:3000/article-transaction/with-sold?days=$thresholdDays";
$rows = [];
$errorMsg = null;

$response = @file_get_contents($apiUrl);
if ($response === false) {
    $errorMsg = 'Keine Verbindung zum Backend-Server. Bitte versuchen Sie es später erneut.';
} else {
    $apiData = json_decode($response, true);
    if (is_array($apiData) && count($apiData) > 0) {
        foreach ($apiData as $r) {
            $avg        = $r['sold'] / $thresholdDays;          // Ø Verkäufe / Tag
            $r['avg']   = $avg;
            $r['days']  = $avg ? round($r['menge'] / $avg, 1) : null;
            $rows[]     = $r;
        }
        /* nach Tage-Vorrat aufsteigend sortieren */
        usort($rows, fn($a,$b) => ($a['days']??PHP_INT_MAX) <=> ($b['days']??PHP_INT_MAX));
    } else {
        $errorMsg = 'Keine Analysedaten verfügbar.';
    }
}
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Nutzwertanalyse · Nventory</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="CSS/layout.css">
    <link rel="stylesheet" href="CSS/analysis.css">
</head>

<body>
    <header class="topbar">
        <a href="index.php"><img src="pictures/logoTest_transparent.png" alt="Home"></a>
    </header>

    <div class="wrapper">
        <?php
      $current = 'analysis'; //aktive Seite 
      include 'includes/sidebar.php';
    ?>

        <main class="content">
            <h1>Nutzwertanalyse</h1>
            <?php if ($errorMsg): ?>
            <section class="card full"
                style="background:var(--bg-1); color:var(--accent); padding:1.5rem; border-radius:8px; margin-bottom:1.5rem; text-align:center; font-size:1.1rem;">
                <span class="muted"><?= htmlspecialchars($errorMsg) ?></span>
            </section>
            <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Artikel</th>
                        <th>Ø&nbsp;Verk./Tag</th>
                        <th>Bestand</th>
                        <th>Tage&nbsp;Vorrat</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($rows as $r): ?>
                    <tr>
                        <td>#<?= $r['artikelnummer'] ?> – <?= htmlspecialchars($r['produktname']) ?></td>
                        <td><?= $r['avg'] ? number_format($r['avg'],2,',','.') : '–' ?></td>
                        <td><?= $r['menge'] ?></td>
                        <td><?= $r['days'] !== null ? $r['days'] : '∞' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </main>
    </div>
</body>

</html>