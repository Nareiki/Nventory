<?php
// Titel setzen
$pageTitle = 'Nventory Startseite';

// Seiten-CSS registrieren
$pageStyles = [
  '/CSS/index.css',
  '/CSS/landingPage_Text.css',
  '/CSS/section0.css',
  '/CSS/whatWeDo.css',
  '/CSS/startNowItem.css',
  '/CSS/faq.css',
  '/CSS/contact.css',
];

// Output-Buffer starten
ob_start();

// Content-Partials einbinden
include __DIR__ . '/partials/navbar.php';
include __DIR__ . '/partials/landingPage_Text.php';
include __DIR__ . '/partials/section0.php';
include __DIR__ . '/partials/whatWeDo.php';
include __DIR__ . '/partials/startNowItem.php';
include __DIR__ . '/partials/faq.php';
include __DIR__ . '/partials/contact.php';

// Buffer auslesen
$content = ob_get_clean();

// zentrales Layout laden (head, header, $content, footer)
include __DIR__ . '/layout.php';
