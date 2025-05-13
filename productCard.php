<?php
$pageTitle  = 'Produktkarten';
$pageStyles = ['/CSS/productCard.css'];
ob_start();
?>

<div id="card-container" class = "outerContainer">
  <!-- Template für die Karte -->
  <template id="card-template">
    <div class="card">
      <div class="img-bx">
        <img src="/pictures/test123.png" alt="img" />
      </div>
      <div class="content">
        <div class="detail">
          <h2>PRODUKT-NAME<br /><span>INFO</span></h2>
          <ul class="sci">
            <li>
              <a href="#"><i class="">+</i></a>
            </li>
            <li>
              <a href="#"><i class="">.</i></a>
            </li>
            <li>
              <a href="#"><i class="">!</i></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
</div>

<script>
  // JavaScript-Code, um die Karten zu duplizieren
  const cardContainer = document.getElementById('card-container');
  const cardTemplate = document.getElementById('card-template');

  for (let i = 0; i < 20; i++) {
    const cardClone = document.importNode(cardTemplate.content, true);
    cardContainer.appendChild(cardClone);
  }
</script>

<script src="/JAVASCRIPT/productCard.js"></script>

<?php
$content = ob_get_clean();
include __DIR__.'/layout.php';
