<?php
// require_once 'connection.php';
// ini_set('display_errors',1);
// error_reporting(E_ALL);

$threshold = 5;
$errorMsg = null;

// 1. Kennzahlen
$statsUrl = 'http://localhost:3000/article-transaction/dashboard-stats?threshold=' . $threshold;
$statsResponse = @file_get_contents($statsUrl);
$stats = $statsResponse ? json_decode($statsResponse, true) : null;
if (!$stats || !is_array($stats)) {
    $errorMsg = 'Keine Verbindung zum Backend-Server oder keine Dashboarddaten verfügbar.';
    $totalProducts = $totalQuantity = $inventoryValue = $lowCnt = 0;
    $lowItems = $topItems = $labels = $values = [];
} else {
    $totalProducts = $stats['totalProducts'] ?? 0;
    $totalQuantity = $stats['totalQuantity'] ?? 0;
    $inventoryValue = $stats['inventoryValue'] ?? 0;
    $lowItems = $stats['lowItems'] ?? [];
    $lowCnt = count($lowItems);
    $topItems = $stats['topItems'] ?? [];
    $labels = $stats['salesLabels'] ?? [];
    $values = $stats['salesValues'] ?? [];
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
    include 'includes/sidebar.php'; ?>
        <!--Sidebar-->
        <main class="content">
            <h1>Dashboard</h1>
            <?php if ($errorMsg): ?>
            <section class="card full"
                style="background:var(--bg-1); color:var(--accent); padding:1.5rem; border-radius:8px; margin-bottom:1.5rem; text-align:center; font-size:1.1rem;">
                <span class="muted"><?= htmlspecialchars($errorMsg) ?></span>
            </section>
            <?php endif; ?>
            <section class="cards">
                <div class="card">
                    <h2>Produkte gesamt</h2>
                    <p><?= $totalProducts ?></p>
                </div>
                <div class="card">
                    <h2>Summe Stückzahlen</h2>
                    <p><?= $totalQuantity ?></p>
                </div>
                <div class="card">
                    <h2>Low‑Stock Artikel</h2>
                    <p><?= $lowCnt ?></p>
                </div>
                <div class="card">
                    <h2>Inventarwert (€)</h2>
                    <p><?= number_format($inventoryValue,2,',','.') ?></p>
                </div>
            </section>
            <section class="card full">
                <h2>Artikel mit geringem Bestand (≤ <?= $threshold ?>)</h2>
                <?php if(!$lowCnt): ?><p class="muted">Keine kritischen Bestände.</p><?php else: ?><div class="list">
                    <?php foreach($lowItems as $it): ?>
                    <div class="list-item"><span>#<?= $it['Artikelnummer'] ?? $it['a_articleID'] ?> –
                            <?= htmlspecialchars($it['Produktname'] ?? $it['a_articleName']) ?></span><strong><?= $it['Menge'] ?? $it['articleAmount'] ?></strong>
                    </div>
                    <?php endforeach; ?>
                </div><?php endif; ?>
            </section>
            <section class="card full">
                <h2>Top 5 Bestseller (30 Tage)</h2>
                <?php if(!$topItems): ?><p class="muted">Noch keine Verkäufe.</p><?php else: ?><div class="list">
                    <?php foreach($topItems as $t): ?>
                    <div class="list-item"><span>#<?= $t['Artikelnummer'] ?? $t['articleID'] ?> –
                            <?= htmlspecialchars($t['Produktname'] ?? $t['articleName']) ?></span><strong><?= $t['sold'] ?></strong>
                    </div>
                    <?php endforeach; ?>
                </div><?php endif; ?>
            </section>
            <section class="card full">
                <h2>Verkäufe letzte 7 Tage</h2><canvas id="salesChart"></canvas>
            </section>
        </main>
    </div>
    <script src="JAVASCRIPT/authentificationCheck.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        // Debug output for chart data
        console.log('Chart labels:', <?=json_encode($labels)?>);
        console.log('Chart values:', <?=json_encode($values)?>);
        new Chart(document.getElementById('salesChart'), {
            type: 'bar',
            data: {
                labels: <?=json_encode($labels)?>,
                datasets: [{
                    data: <?=json_encode($values)?>
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#333'
                        },
                        ticks: {
                            color: '#ccc'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#ccc'
                        }
                    }
                }
            }
        });
    });
    </script>
</body>

</html>