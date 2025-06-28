<?php include("HTML/header.html"); ?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produktstatistik</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <div class="container mt-5">
        <div class="card shadow">
            <div class="card-header bg-dark text-white">
                <h1 class="h4 mb-0">Produktstatistik</h1>
            </div>
            <div class="card-body">
                <div id="produkt-info" class="mb-3"></div>

                <div class="mb-2"><strong>Name:</strong> <span id="name"></span></div>
                <div class="mb-2"><strong>Bestand:</strong> <span id="bestand"></span></div>
                <div class="mb-2"><strong>Durchschnittlicher Kaufpreis:</strong> <span id="kaufpreis"></span></div>
                <div class="mb-2"><strong>Durchschnittlicher Verkaufspreis:</strong> <span id="durchschnittlicherVKP"></span></div>
                <div class="mb-2"><strong>Verkäufe (letzter Monat):</strong> <span id="verkaeufe"></span></div>
                <div class="mb-2"><strong>Umsatz (letzter Monat):</strong> <span id="umsatz"></span></div>
            </div>
        </div>
    </div>
    <br><br><br>
    
    <script src="JAVASCRIPT/authentificationCheck.js"></script>
    <script src="JAVASCRIPT/productSatistik.js"></script>
</body>
</html>

<?php include("HTML/footer.html"); ?>

