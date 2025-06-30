<?php include "HTML/header.html" ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="CSS/scanProduct.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <title>QR CODE EINLESEN</title>
</head>

<body class = "newProductBody">
    <div class="articleOuterContainer">
        <!-- hier kommt unsere getProductData.php rein -->
        <div id="articleInfo" style="display:none;"></div>
    </div>
    
<div class = "outerContainer">
    <div class="container">
        <div class="section">
            <!-- Buttons fürs Ein- und Ausbuchen im Scanner-->
            <div id="stockActions" class="articleActions" style="display:none;">
                <label for="stockQty">Menge:</label>
                <input type="number" id="stockQty" value="1" min="1"><br>
                <button id="btnIn"  class="stockBtn">Einbuchen</button>
                <button id="btnOut" class="stockBtn">Ausbuchen</button><br>
                <span id="stockMsg" class="stockMsg"></span>
            </div><br>

            <div id="my-qr-reader"></div> <!-- QR-Scanner -->
        </div>
    </div>
</div>
<script src="JAVASCRIPT/authentificationCheck.js"></script>
<script src="https://unpkg.com/html5-qrcode"></script>
<script src="JAVASCRIPT/scanProduct.js"></script>

</body>
</html>

<?php include "HTML/footer.html" ?>