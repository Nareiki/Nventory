<?php
header('Content-Type: application/json');

$artNr            = isset($_POST['artikelnummer'])       ? (int)$_POST['artikelnummer']       : 0;
$transactionAmount = isset($_POST['transactionAmount'])  ? (int)$_POST['transactionAmount']   : 0;
$transactionPrice = isset($_POST['transactionPrice'])  ? (float)$_POST['transactionPrice']   : 0;
$transactionType   = isset($_POST['transactionType'])    ? $_POST['transactionType']          : '';

if ($artNr <= 0 || $transactionAmount <= 0 || !in_array($transactionType, ['in', 'out'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'msg'=>'Ungültige Parameter']);
    exit;
}

// API-Request an das Backend
$apiUrl = 'http://localhost:3000/article/' . urlencode($artNr);
$payload = json_encode([
    'transactionAmount' => $transactionAmount,
    'transactionPrice' => $transactionPrice,
    'transactionType' => $transactionType
]);

$options = [
    'http' => [
        'method'  => 'PUT',
        'header'  => "Content-Type: application/json\r\nAccept: application/json\r\n",
        'content' => $payload,
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$response = @file_get_contents($apiUrl, false, $context);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'msg'=>'Keine Verbindung zum Backend-Server.']);
    exit;
}

// Backend-Antwort direkt weitergeben
http_response_code(isset($http_response_header) && preg_grep('/^HTTP\/.*\s(\d{3})/', $http_response_header) ? (int)preg_replace('/\D/', '', $http_response_header[0]) : 200);
echo $response;