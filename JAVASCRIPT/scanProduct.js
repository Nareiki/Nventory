function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function getData(decodeText) {
    let articleNumber = decodeText;

    fetch('/getProductData.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'wert=' + encodeURIComponent(articleNumber)
    })
        .then(response => response.text())
        .then(data => {
            // Daten direkt in ein Div schreiben
            document.getElementById('articleInfo').innerHTML = data;
        })
        .catch(error => console.error('Fehler beim Laden:', error));
}

domReady(function () {

    // If found you qr code
    function onScanSuccess(decodeText, decodeResult) {
         getData(decodeText);
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
