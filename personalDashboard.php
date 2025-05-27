<?php require_once 'connection.php';

// Verbindung zur Datenbank herstellen
$conn = getDBConnection();

// SQL-Abfrage, um alle Artikel zu holen
$sql = "SELECT COUNT(*) AS anzahl FROM Artikel";
$result = $conn->query($sql);

if ($result) {
    $rowCount = $result->fetch_assoc();
    $sql = "SELECT SUM(Menge) AS menge FROM Artikel";
    $result = $conn->query($sql);
    $articleSum = $result->fetch_assoc();
} else {
    $rowCount["anzahl"] = "keine Artikel vorhanden";
}


?>




    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Nventory</title>
        <link rel="stylesheet" href="CSS/personalDashboard.css">
    </head>
    <body>
    <div class = "dashboardHeaderContainer">
        <div class = "dashboardHeaderItem"><a href="index.php"><img src="pictures/Nventory_Logo.png" height=" 40px" ></a></div>
    </div>
    <div class = dashboardOuterContainer>
        <div class = "sideBarOuterContainer">
            <div class = "sideBarItemContainer">
            <div class="sidebarItem" data-hover="BESTAND">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="NEUPRODUKT">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="STATISTIK">
                <a href="./stats.php"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            <div class="sidebarItem" data-hover="EINSTELLUNGEN">
                <a href="#"><img src="pictures/icons/chart-simple-solid.svg" height="30px"></a>
            </div>
            </div>
            </div>

        <div class = "dashboardItemOuterContainer">
            <div class = "dashboardHeadlineContainer">
                <div style="margin-left: 30px;"><img src="pictures/icons/calendar-regular.svg" height=" 20px" ></div>
                <div class = "dashboardHeadlineItem">Dashboard</div>
            </div>
            <div class = "dashboardItemInnerContainerTop">
                <div class = "dashboardItem">Produkte: <?php echo $rowCount["anzahl"] ?></div>
                <div class = "dashboardItem">Summe der Stückzahlen: <?php echo $articleSum["menge"] ?></div>
                <div class = "dashboardItem">???????</div>
            </div>
            <div class = "dashboardItemInnerContainerBottom">
                <div class = "dashboardHeadlineContainer">
                    <div style="margin-left: 30px;"><img src="pictures/icons/chart-bar-regular.svg" height=" 20px" ></div>
                    <div class = "dashboardHeadlineItem">Recent Activity</div>
                </div>
                <div>
                    TABELLE HIER EINFÜGEN
                </div>
            </div>
        </div>
    </div>
    </body>
    </html>

    <script
        src="JAVASCRIPT/personalDashboard.js">
    </script>

<?php include("HTML/footer.html") ?>

