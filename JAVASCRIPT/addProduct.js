

function redirect() {
    let urlRedirect = document.getElementById("number").value;
    window.location.href = urlRedirect;
}

function checkInputs() {
    if(document.getElementById("productName").value === '') {
        alert("Bitte alle Pflichtfelder ausfüllen!");
        return;
    }
    if(document.getElementById("amount").value === '') {
        alert("Bitte alle Pflichtfelder ausfüllen!");
        return;
    }
    if(document.getElementById("price").value === '') {
        alert("Bitte alle Pflichtfelder ausfüllen!");
        return;
    }
    if(document.getElementById("number").value === '') {
        alert("Bitte alle Pflichtfelder ausfüllen!");
        return;
    }
    return true;
}

function generateQRCode() {
    if(!checkInputs()) {
        return; // Abbrechen, wenn Pflichtfelder nicht ausgefüllt sind
    }

    let userInput = document.getElementById("number").value;
    let qrContainer = document.getElementById("qrcode");

    // Falls bereits ein QR-Code existiert, lösche ihn vorher
    qrContainer.innerHTML = "";

    // QR-Code generieren
    if (userInput.trim() !== "") {
        new QRCode(qrContainer, userInput);
    } else {
        alert("Bitte gib eine URL oder einen Text ein.");
    }

    document.getElementById('downloadBtn').style.display = 'flex';
}


function downloadQRCode() {
    // QR-Code als Canvas-Element abrufen
    const canvas = document.querySelector('#qrcode canvas');

    if (canvas) {
        // Canvas in Daten-URL umwandeln
        const dataURL = canvas.toDataURL('image/png');

        // Download-Link erstellen
        const downloadLink = document.createElement('a');

        // Produktname oder Artikelnummer als Dateiname verwenden
        const productName = document.getElementById('productName').value || 'Artikel';
        const articleNumber = document.getElementById('number').value;
        const fileName = (productName + '_' + articleNumber).replace(/\s+/g, '_') + '.png';

        downloadLink.href = dataURL;
        downloadLink.download = fileName;

        // Download auslösen
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert('Bitte zuerst einen QR-Code generieren.');
    }
}
