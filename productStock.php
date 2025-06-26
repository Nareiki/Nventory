<?php
include("HTML/header.html");
require_once 'connection.php';

// Verbindung zur Datenbank herstellen
$conn = getDBConnection();

// SortierLink - auf- bzw. absteigend
$allowedSort = ['artikelnummer','menge', 'kaufpreis', 'produktname'];

//Standardsortierung auf artikelnummer
$sort = isset($_GET['sort']) && in_array($_GET['sort'], $allowedSort)
    ? $_GET['sort']
    : 'artikelnummer';

//Standardsort ist DESC, kann aber hier aussuchen
$dir = (isset($_GET['dir']) && strtolower($_GET['dir'])==='asc')
    ? 'ASC'
    : 'DESC';

//wenn gerade ASC, dann beim nächsten Klick desc
$toggleDir = $dir==='ASC' ? 'desc' : 'asc';

if ($sort==='menge') {
    $orderBy = "Menge $dir";
} elseif ($sort==='kaufpreis') {
    $orderBy = "Kaufpreis $dir";
} elseif ($sort==='produktname') {
    $orderBy = "produktname $dir";
} else {
    $orderBy = "Artikelnummer $dir";
}

$sql = "SELECT * FROM Artikel ORDER BY $orderBy";
$result = $conn->query($sql);
?>

    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Produktübersicht</title>
        <link rel="stylesheet" href="CSS/productStock.css">
    </head>
    <body>
    <div class="container">
        <div class="header">
            <a href="addProduct.php" class="btn-add">
                <span>+</span> Produkt hinzufügen
            </a>
            <div class="search-container">
                <button type="button" class="filter-btn" id="clearFilter">Filter zurücksetzen</button>
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Suchen...">
                    <button id="clearSearch">×</button>
                </div>
            </div>
        </div>

        <table>
            <thead>
            <tr>
                <th>QR</th>
                <th class="sortable">
                    <a href="?sort=artikelnummer&dir=<?= htmlspecialchars($toggleDir) ?>" title="Nach Artikelnummer sortieren">
                        Artikelnummer
                        <?php if($sort==='artikelnummer'): ?>
                            <?= $dir==='ASC' ? '▲' : '▼' ?>
                        <?php endif ?>
                    </a>
                </th>
                <th class="sortable">
                    <a href="?sort=produktname&dir=<?= htmlspecialchars($toggleDir) ?>" title="Nach Produktnamen sortieren">
                        Produktname
                        <?php if($sort==='produktname'): ?>
                            <?= $dir==='ASC' ? '▲' : '▼' ?> 
                        <?php endif ?>
                    </a>
                </th>
                <th>Information</th>
                <th class="sortable">
                    <a href="?sort=menge&dir=<?= htmlspecialchars($toggleDir) ?>" title="Nach Menge sortieren">
                        Menge
                        <?php if($sort==='menge'): ?>
                            <?= $dir==='ASC' ? '▲' : '▼' ?> <!-- die Pfeile zum Sortieren, starten mit aufsteigend-->
                        <?php endif ?>
                    </a>
                </th>
                <th class="sortable">
                     <a href="?sort=kaufpreis&dir=<?= htmlspecialchars($toggleDir) ?>"
                        title="Nach Preis sortieren">
                    Preis
                    <?php if($sort==='kaufpreis'): ?>
                        <span class="sort-icon"><?= $dir==='ASC' ? '▲' : '▼' ?></span>
                    <?php endif ?>
                    </a>
                </th>
                <th>Produkt Bearbeiten</th>
            </tr>
            </thead>
            <tbody>
            <?php
            // Überprüfen, ob Ergebnisse vorhanden sind
            if ($result && $result->num_rows > 0) {
                // Daten ausgeben
                while($row = $result->fetch_assoc()) {
                    // QR-Code für die Artikelnummer generieren
                    $artikelnummer = $row["Artikelnummer"];
                    $qrCodeFileName = "qrcodes/qrcode-$artikelnummer.png";

                    // Überprüfen, ob der QR-Code bereits existiert, wenn nicht, erstellen
                    if (!file_exists($qrCodeFileName)) {
                        // Hinweis: Stelle sicher, dass der Ordner "qrcodes" existiert und schreibbar ist
                        // Alternativ kannst du hier auch Code für QR-Code-Generierung mit PHP hinzufügen
                    }

                    echo "<tr data-artikelnr='" . htmlspecialchars($artikelnummer) . "' 
                         data-name='" . htmlspecialchars($row["Produktname"]) . "' 
                         data-info='" . htmlspecialchars($row["Information"]) . "' 
                         data-menge='" . htmlspecialchars($row["Menge"]) . "' 
                         data-preis='" . htmlspecialchars($row["Kaufpreis"]) . "'>";

                    // QR-Code oder Platzhalter anzeigen
                    echo "<td class='qr-code-cell'>";
                    if (file_exists($qrCodeFileName)) {
                        echo "<img src='" . htmlspecialchars($qrCodeFileName) . "' alt='QR-Code'>";
                    } else {
                        echo "/";
                    }
                    echo "</td>";

                    echo "<td>" . htmlspecialchars($row["Artikelnummer"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Produktname"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Information"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Menge"]) . "</td>";
                    echo "<td class='price'>" . number_format($row["Kaufpreis"], 2, ',', '.') . " €</td>";
                    echo "<td><a href='#' class='edit-product'>&#128221;</a></td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='7' class='no-data'>Keine Artikel gefunden</td></tr>";
            }

            // Verbindung schließen
            $conn->close();
            ?>
            </tbody>
        </table>
    </div>

    <!-- Modal für die Produktbearbeitung -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Produkt bearbeiten</h2>
            <form id="editProductForm">
                <input type="hidden" id="artikelnummer" name="artikelnummer">

                <div class="form-group">
                    <label for="produktname">Produktname:</label>
                    <input type="text" id="produktname" name="produktname">
                </div>

                <div class="form-group">
                    <label for="information">Information:</label>
                    <textarea id="information" name="information" rows="3"></textarea>
                </div>

                <div class="form-group">
                    <label for="menge">Menge:</label>
                    <div class="quantity-control">
                        <button type="button" id="decrease">-</button>
                        <input type="number" id="menge" name="menge" min="0">
                        <button type="button" id="increase">+</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="preis">Preis (€):</label>
                    <input type="text" id="preis" name="preis">
                </div>

                <div class="modal-buttons">
                    <button type="button" class="delete-btn" id="deleteProduct">Löschen</button>
                    <div>
                        <button type="button" class="cancel-btn" id="cancelEdit">Abbrechen</button>
                        <button type="submit" class="save-btn">Speichern</button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    </body>
    </html>

<?php
include("HTML/footer.html");
?>

    <!--<script src="JAVASCRIPT/authentificationCheck.js"></script> -->
    <script src="JAVASCRIPT/productStock.js"></script>
