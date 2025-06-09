<?php
// require_once __DIR__ . '/connection.php';

// Verarbeitung des Formulars
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Daten aus dem Formular holen
    $produktname = trim($_POST['productName']);
    $information = trim($_POST['information']);
    $menge = intval($_POST['amount']);
    $kaufpreis = floatval(str_replace(',', '.', $_POST['price']));

    // Validierung
    $errors = [];

    if (empty($produktname)) {
        $errors[] = "Produktname ist erforderlich";
    } elseif (strlen($produktname) > 50) {
        $errors[] = "Produktname darf maximal 50 Zeichen lang sein";
    }

    if (strlen($information) > 250) {
        $errors[] = "Information darf maximal 250 Zeichen lang sein";
    }

    if (empty($information)) {
        $information = '-';
    }

    if ($menge < 0) {
        $errors[] = "Menge darf nicht unter 0 sein";
    }

    if ($kaufpreis < 0) {
        $errors[] = "Kaufpreis darf nicht unter 0 sein";
    }

    // Wenn keine Fehler, in Datenbank speichern
    if (empty($errors)) {
         // Prepare data for API
        $apiData = [
            'articleName' => $produktname,
            'articleInformation' => $information,
            'articleAmount' => $menge,
            'articlePrice' => $kaufpreis,
            'shelf' => [
                'shelfID' => 1, // Main shelf ID, adjust with more functionality if needed
                'warehouse' => [
                    'warehouseID' => 1 // Standard warehouse ID, adjust with more functionality if needed
                ]
            ]
        ];

        $ch = curl_init('http://localhost:3000/article'); // Adjust URL if needed
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));

        $apiResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($apiResponse === false) {
            $errors[] = "API Fehler: " . curl_error($ch);
        } elseif ($httpCode >= 200 && $httpCode < 300) {
            $success = "Produkt erfolgreich angelegt!";
            $responseData = json_decode($apiResponse, true);
            $lastId = $responseData['articleID'] ?? null;
            $showQRCode = true;
        } else {
            $errors[] = "API Fehler: " . $apiResponse;
        }

        curl_close($ch);
        // try {
        //     $conn = getDBConnection();

        //     $stmt = $conn->prepare("INSERT INTO Artikel (Produktname, Information, Menge, Kaufpreis) VALUES (?, ?, ?, ?)");
        //     $stmt->bind_param("ssid", $produktname, $information, $menge, $kaufpreis);

        //     if ($stmt->execute()) {
        //         $success = "Produkt erfolgreich angelegt!";
        //         // Artikelnummer für QR-Code abrufen, aber nicht anzeigen
        //         $lastId = $conn->insert_id;

        //         // QR-Code-Generierung auslösen
        //         $showQRCode = true;
        //     } else {
        //         $errors[] = "Fehler beim Speichern: " . $stmt->error;
        //     }

        //     $stmt->close();
        //     $conn->close();
        // } catch (Exception $e) {
        //     $errors[] = "Datenbankfehler: " . $e->getMessage();
        // }
    }
}

// 2) Template-Steuerung
$pageTitle = 'Produkt hinzufügen';
$pageStyles = ['/CSS/addProduct.css'];

ob_start();
?>

<!-- Reines HTML -->
<div class="container">
    <div class="form-container">
        <h1>Neuprodukt anlegen</h1>
        <p class="subtitle">bitte alle Pflichtfelder ausfüllen</p>

        <?php if (isset($errors) && !empty($errors)): ?>
        <div class="error-message">
            <?php foreach ($errors as $error): ?>
            <p><?php echo htmlspecialchars($error); ?></p>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <?php if (isset($success)): ?>
        <div class="success-message">
            <p><?php echo htmlspecialchars($success); ?></p>
        </div>
        <?php endif; ?>

        <?php if (isset($showQRCode) && $showQRCode): ?>
        <!-- Erfolgsanzeige mit QR-Code -->
        <div class="qr-code-container">
            <div id="qrcode" class="qr-code"></div>
            <button id="downloadBtn" class="download-btn" onclick="downloadQRCode()">
                <img src="pictures/icons/download.svg" height="30px" alt="Download">
            </button>
        </div>

        <div class="form-actions">
            <button type="button" onclick="location.href='<?php echo $_SERVER['PHP_SELF']; ?>'" class="submit-btn">Neues
                Produkt anlegen</button>
        </div>

        <script>
        // QR-Code automatisch generieren
        window.onload = function() {
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: "<?php echo $lastId; ?>",
                width: 128,
                height: 128
            });
            document.getElementById("downloadBtn").style.display = "block";
        };

        function downloadQRCode() {
            var canvas = document.querySelector("#qrcode canvas");
            if (canvas) {
                var link = document.createElement('a');
                link.download = 'QRCode-<?php echo $lastId; ?>.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }
        </script>
        <?php else: ?>
        <!-- Formular zur Produkterstellung -->
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="form-group">
                <label for="productName">Produktname</label>
                <input type="text" id="productName" name="productName" placeholder="" required
                    value="<?php echo isset($produktname) ? htmlspecialchars($produktname) : ''; ?>">
            </div>
            <div class="form-group">
                <label for="information">Information (optional)</label>
                <input type="text" id="information" name="information" placeholder=""
                    value="<?php echo isset($information) ? htmlspecialchars($information) : ''; ?>">
            </div>
            <div class="form-group">
                <label for="amount">Menge</label>
                <input type="number" id="amount" name="amount" min="0" placeholder="" required
                    value="<?php echo isset($menge) ? $menge : ''; ?>">
            </div>
            <div class="form-group">
                <label for="price">Kaufpreis</label>
                <input type="number" id="price" name="price" min="0" step="0.01" placeholder="" required
                    value="<?php echo isset($kaufpreis) ? $kaufpreis : ''; ?>">
            </div>

            <button type="submit" class="submit-btn">Neuprodukt anlegen</button>
        </form>
        <?php endif; ?>

        <div class="changeStock">
            <p>Bereits angelegt? <a href="#"> Bestand anpassen</a></p>
        </div>
    </div>
</div>

<!-- Scripts am Ende -->
<script src="/JAVASCRIPT/addProduct.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';