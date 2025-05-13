<?php
$pageTitle  = 'Produkt scannen';
$pageStyles = ['/CSS/scanProduct.css'];
ob_start();
?>

<div class = "articleOuterContainer">
    <div id="articleInfo" style="color: white"></div>
</div>

<div class = "newProductBody">
<div class = "outerContainer">
<div class="container">
    <div class="section">
        <div id="my-qr-reader"></div>
        </div>
    </div>
</div>

<script src="/JAVASCRIPT/scanProduct.js"></script>
<script src="https://unpkg.com/html5-qrcode"></script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';