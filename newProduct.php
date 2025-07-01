<?php include "header.html" ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="CSS/newProduct.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet">
    <title>QR CODE EINLESEN</title>
</head>

<body class="newProductBody">
    <div class="outerContainer">
        <div class="container">
            <div class="section">
                <div id="my-qr-reader">
                </div>
            </div>
        </div>
    </div>
    <script src="JAVASCRIPT/authentificationCheck.js"></script>
    <script src="https://unpkg.com/html5-qrcode">
    </script>
    <script src="newProduct.js"></script>
</body>

</html>