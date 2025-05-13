<?php
$pageTitle  = 'Neuprodukt anlegen';
$pageStyles = ['/CSS/newProduct.css'];
ob_start();
?>

<div class = "newProductBody">
<div class = "outerContainer">
<div class="container">
    <div class="section">
        <div id="my-qr-reader"></div>
    </div>
</div>

<script src="https://unpkg.com/html5-qrcode"></script>
<script src="/JAVASCRIPT/newProduct.js"></script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';