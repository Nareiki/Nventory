<?php

$apiUrl = 'http://localhost:3000/article'; 
$apiResponse = @file_get_contents($apiUrl);
$rowCount = ["anzahl" => 0];
$articleSum = ["menge" => 0];
$apiError = null; // error variable added
if ($apiResponse !== false) {
    $artikelListe = json_decode($apiResponse, true);
    if (is_array($artikelListe)) {
        $rowCount["anzahl"] = count($artikelListe);
        $sum = 0;
        foreach ($artikelListe as $row) {
            $sum += isset($row["articleAmount"]) ? (int)$row["articleAmount"] : 0;
        }
        $articleSum["menge"] = $sum;
    } else {
        $rowCount["anzahl"] = "keine Artikel vorhanden";
        $articleSum["menge"] = 0;
        $apiError = 'Fehler beim Verarbeiten der API-Antwort.';
    }
} else {
    $rowCount["anzahl"] = "keine Artikel vorhanden";
    $articleSum["menge"] = 0;
    $apiError = 'API nicht erreichbar oder ausgeschaltet.';
}

$pageTitle  = 'Persönliches Dashboard';
$pageStyles = ['/CSS/personalDashboard.css'];
ob_start();
?>

<div class="dashboardHeaderContainer">
    <div class="dashboardHeaderItem"><a href="index.php"><img src="/pictures/Nventory_Logo.png" height=" 40px"></a>
    </div>
</div>
<div class=dashboardOuterContainer>
    <div class="sideBarOuterContainer">
        <div class="sideBarItemContainer">
            <div class="sidebarItem" data-hover="BESTAND">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="NEUPRODUKT">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="STATISTIK">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="EINSTELLUNGEN">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
        </div>
    </div>

    <div class="dashboardItemOuterContainer">
        <div class="dashboardHeadlineContainer">
            <div style="margin-left: 30px;"><img src="pictures/icons/calendar-regular.svg" height=" 20px"></div>
            <div class="dashboardHeadlineItem">Dashboard</div>
        </div>
        <div class="dashboardItemInnerContainerTop">
            <div class="dashboardItem">Produkte: <?php echo $rowCount["anzahl"] ?></div>
            <div class="dashboardItem">Summe der Stückzahlen: <?php echo $articleSum["menge"] ?></div>
            <div class="dashboardItem">
                <?php if ($apiError) echo '<span style="color:red">' . htmlspecialchars($apiError) . '</span>'; ?>
            </div>
        </div>
        <div class="dashboardItemInnerContainerBottom">
            <div class="dashboardHeadlineContainer">
                <div style="margin-left: 30px;"><img src="pictures/icons/chart-bar-regular.svg" height=" 20px"></div>
                <div class="dashboardHeadlineItem">Recent Activity</div>
            </div>
            <div>
                TABELLE HIER EINFÜGEN
            </div>
        </div>
    </div>
</div>

<script src="/JAVASCRIPT/personalDashboard.js">
</script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';