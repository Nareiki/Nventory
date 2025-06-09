<?php
// Verbindung zur API herstellen und alle Artikel abrufen
$apiUrl = 'http://localhost:3000/article'; // Passe die URL ggf. an
$apiResponse = @file_get_contents($apiUrl); // changed: use @ to suppress warnings
$artikelListe = [];
$apiError = null; // changed: variable for error message
if ($apiResponse !== false) {
    $artikelListe = json_decode($apiResponse, true);
    if (!is_array($artikelListe)) {
        $artikelListe = [];
        $apiError = 'Fehler beim Verarbeiten der API-Antwort.'; // changed: error if response is not array
    }
} else {
    $artikelListe = [];
    $apiError = 'Fehler beim Abrufen der Artikeldaten von der API.'; // changed: error if API call fails
}

$pageTitle  = 'Bestandsübersicht';
$pageStyles = ['/CSS/productStock.css'];
ob_start();
?>

<!-- Reines HTML -->
<div class="container">
    <div class="header">
        <a href="addProduct.php" class="btn-add">
            <span>+</span> Produkt hinzufügen
        </a>
        <div class="search-container">
            <button class="filter-btn" id="clearFilter">Filter zurücksetzen</button>
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
                <th>Artikelnummer</th>
                <th>Produktname</th>
                <th>Information</th>
                <th>Menge</th>
                <th>Preis</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($apiError) {
                echo "<tr><td colspan='7' class='no-data'>" . htmlspecialchars($apiError) . "</td></tr>";
            } elseif (!empty($artikelListe)) {
                foreach ($artikelListe as $row) {
                    $artikelnummer = $row["articleID"];
                    $qrCodeFileName = "qrcodes/qrcode-$artikelnummer.png";
                    echo '<tr data-artikelnr="' . htmlspecialchars($artikelnummer) . '" '
                        . 'data-name="' . htmlspecialchars($row["articleName"]) . '" '
                        . 'data-info="' . htmlspecialchars($row["articleInformation"]) . '" '
                        . 'data-menge="' . htmlspecialchars($row["articleAmount"]) . '" '
                        . 'data-preis="' . htmlspecialchars($row["articlePrice"]) . '">';

                    echo '<td class="qr-code-cell">';
                    if (file_exists($qrCodeFileName)) {
                        echo '<img src="' . htmlspecialchars($qrCodeFileName) . '" alt="QR-Code">';
                    } else {
                        echo '/';
                    }
                    echo '</td>';

                    echo '<td>' . htmlspecialchars($row["articleID"]) . '</td>';
                    echo '<td>' . htmlspecialchars($row["articleName"]) . '</td>';
                    echo '<td>' . htmlspecialchars($row["articleInformation"]) . '</td>';
                    echo '<td>' . htmlspecialchars($row["articleAmount"]) . '</td>';
                    echo '<td class="price">' . number_format($row["articlePrice"], 2, ',', '.') . ' €</td>';
                    echo '<td><a href="#" class="edit-product">&#128221;</a></td>';
                    echo '</tr>';
                }
            } else {
                echo "<tr><td colspan='7' class='no-data'>Keine Artikel gefunden</td></tr>";
            }
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

<script src="/JAVASCRIPT/productStock.js"></script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';