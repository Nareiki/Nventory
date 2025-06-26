<?php
$current = $current ?? '';             
function navLink($href,$label,$slug,$current){
  $cls = $slug===$current ? 'nav-item active' : 'nav-item';
  echo "<a class=\"$cls\" href=\"$href\">$label</a>";
}
?>
<nav class="sidebar">
  <?php
    navLink('personalDashboard.php','Dashboard',      'dashboard',   $current);
    navLink('transactions.php',    'Transaktionen',   'transactions',$current);
    navLink('analysis.php',        'Nutzwertanalyse', 'analysis',    $current);
    navLink('addProduct.php',      'Neu-Produkt',     'addProduct',  $current);
  ?>
</nav>
