<?php include("HTML/header.html");?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statistiken</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="CSS/stats.css">
</head>
<body>
<div class="container">
    <div class="header">
        <h2>Verkaufsstatistiken</h2>
    </div>

    <div class="container">
        <table class="table table-dark">
            <thead>
            <tr>
                <th scope="col">Kategorie</th>
                <th scope="col">Produktname</th>
                <th scope="col">Wert</th>
            </tr>
            </thead>
            <tbody id="statistikTabelle">
            <!-- JS wird hier die Top-Daten einfügen -->
            </tbody>
        </table>
    </div>

    <div class="container">
        <h3>Artikel nach Verkaufsmenge</h3>
        <table class="table table-dark">
            <thead>
            <tr>
                <th scope="col">Produktname</th>
                <th scope="col">Verkaufte Menge</th>
            </tr>
            </thead>
            <tbody id="tabelleMenge"></tbody>
        </table>
    </div>

    <div class="container">
        <h3>Artikel nach durchschnittlichem DB</h3>
        <table  class="table table-dark">
            <thead>
            <tr>
                <th scope="col">Produktname</th>
                <th scope="col">Durchschnittlicher DB (€)</th>
            </tr>
            </thead>
            <tbody id="tabelleDB"></tbody>
        </table>
    </div>
</div>

<script src="JAVASCRIPT/authentificationCheck.js"></script>
<script src="JAVASCRIPT/statistik.js"></script>
</body>
</html>
<?php include("HTML/footer.html"); ?>
