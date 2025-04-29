<?php
include("HTML/header.html");
require_once 'connection.php';

// Verbindung zur Datenbank herstellen
$conn = getDBConnection();

// SQL-Abfrage, um alle Artikel zu holen
$sql = "SELECT * FROM Artikel ORDER BY Artikelnummer DESC";
$result = $conn->query($sql);
?>

    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Produktübersicht</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            body {
                background-color: #121212;
                color: #fff;
                padding: 20px;
            }

            .container {
                max-width: 100%;
                overflow-x: auto;
                margin-bottom: 30px;
            }

            .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                align-items: center;
            }

            .btn-add {
                background-color: #1f1f1f;
                color: white;
                border: 1px solid #383838;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                text-decoration: none;
            }

            .btn-add:hover {
                background-color: #2a2a2a;
            }

            .search-container {
                display: flex;
                gap: 10px;
            }

            .filter-btn {
                background-color: #1f1f1f;
                color: white;
                border: 1px solid #383838;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }

            .filter-btn:hover {
                background-color: #2a2a2a;
            }

            .search-box {
                background-color: #1f1f1f;
                border: 1px solid #383838;
                border-radius: 4px;
                padding: 8px 15px;
                color: white;
                width: 300px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .search-box input {
                background: none;
                border: none;
                color: white;
                width: 100%;
                outline: none;
            }

            .search-box button {
                background: none;
                border: none;
                color: #777;
                cursor: pointer;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                background-color: #1a1a1a;
            }

            th {
                background-color: #1a1a1a;
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #333;
                font-weight: normal;
                color: #fff;
                position: relative;
                white-space: nowrap;
            }

            th:after {
                content: '';
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 4px solid #777;
            }

            tr {
                border-bottom: 1px solid #2c2c2c;
            }

            tr:nth-child(even) {
                background-color: #1d1d1d;
            }

            td {
                padding: 10px 15px;
                color: #eee;
            }

            td img {
                width: 50px;
                height: 50px;
                object-fit: contain;
                background-color: #fff;
                border-radius: 4px;
            }

            .price {
                font-weight: bold;
            }

            .no-data {
                text-align: center;
                padding: 30px;
                color: #777;
            }

            .qr-code-cell {
                text-align: center;
            }
        </style>
    </head>
    <body>
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
                <th>Foto</th>
                <th>Artikelnummer</th>
                <th>Produktname</th>
                <th>Information</th>
                <th>Menge</th>
                <th>Preis</th>
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

                    echo "<tr>";
                    // QR-Code oder Platzhalter anzeigen
                    echo "<td class='qr-code-cell'>";
                    if (file_exists($qrCodeFileName)) {
                        echo "<img src='" . htmlspecialchars($qrCodeFileName) . "' alt='QR-Code'>";
                    } else {
                        echo "<img src='pictures/placeholder.png' alt='Kein Foto verfügbar'>";
                    }
                    echo "</td>";

                    echo "<td>" . htmlspecialchars($row["Artikelnummer"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Produktname"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Information"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Menge"]) . "</td>";
                    echo "<td class='price'>" . number_format($row["Kaufpreis"], 2, ',', '.') . " €</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='6' class='no-data'>Keine Artikel gefunden</td></tr>";
            }

            // Verbindung schließen
            $conn->close();
            ?>
            </tbody>
        </table>
    </div>

    <script>
        // Suchfunktion
        document.getElementById('searchInput').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            let visibleRows = 0;

            rows.forEach(row => {
                if (row.classList.contains('no-data')) return;

                const text = row.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                row.style.display = isVisible ? '' : 'none';

                if (isVisible) visibleRows++;
            });

            // "Keine Ergebnisse" Zeile anzeigen, wenn keine Treffer
            const noDataRow = document.querySelector('.no-data');
            if (visibleRows === 0 && !noDataRow) {
                const tbody = document.querySelector('tbody');
                const tr = document.createElement('tr');
                tr.className = 'no-data-search';
                const td = document.createElement('td');
                td.colSpan = 6;
                td.className = 'no-data';
                td.textContent = 'Keine passenden Artikel gefunden';
                tr.appendChild(td);
                tbody.appendChild(tr);
            } else if (visibleRows > 0) {
                const noDataSearchRow = document.querySelector('.no-data-search');
                if (noDataSearchRow) noDataSearchRow.remove();
            }
        });

        // Suchfeld zurücksetzen
        document.getElementById('clearSearch').addEventListener('click', function() {
            document.getElementById('searchInput').value = '';
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                if (!row.classList.contains('no-data-search')) {
                    row.style.display = '';
                }
            });

            const noDataSearchRow = document.querySelector('.no-data-search');
            if (noDataSearchRow) noDataSearchRow.remove();
        });

        // Filter zurücksetzen
        document.getElementById('clearFilter').addEventListener('click', function() {
            document.getElementById('searchInput').value = '';
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                if (!row.classList.contains('no-data-search')) {
                    row.style.display = '';
                }
            });

            const noDataSearchRow = document.querySelector('.no-data-search');
            if (noDataSearchRow) noDataSearchRow.remove();
        });
    </script>
    </body>
    </html>

<?php
include("HTML/footer.html");
?>