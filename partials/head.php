<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>

    <!-- globale Styles -->
    <link rel="stylesheet" href="/CSS/header.css">
    <link rel="stylesheet" href="/CSS/navBar.css">
    <link rel="stylesheet" href="/CSS/footer.css">

    <!-- seiten­spezifische Styles -->
    <?php foreach ($pageStyles ?? [] as $css): ?>
        <link rel="stylesheet" href="<?= htmlspecialchars($css) ?>">
    <?php endforeach; ?>
</head>
<body>
