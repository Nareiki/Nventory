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

//Holt Artikel data per POST und füllt articleInfo
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
  let currentArticleNr = null;
  const actionsDiv = document.getElementById('stockActions');
  const qtyInput   = document.getElementById('stockQty');
  const msgSpan    = document.getElementById('stockMsg');
  const btnIn      = document.getElementById('btnIn');
  const btnOut     = document.getElementById('btnOut');

// If found you qr code 
function onScanSuccess(decodeText) {
    currentArticleNr = decodeText;
    getData(decodeText);
    //graue Artikel Info Box einblenden:
    const infoBox = document.getElementById('articleInfo');
    infoBox.style.display = 'block';
    
    // Buttons anzeigen
    const actionsDiv = document.getElementById('stockActions');
    actionsDiv.style.display = 'block';
    
    msgSpan.textContent = '';
    }

const htmlscanner = new Html5QrcodeScanner(
    "my-qr-reader",
    { fps: 10, qrbox: 250 }
);
htmlscanner.render(onScanSuccess);

  // Beestand wird upgedated mit Eingabe(delta) von User, sendet Ein-/Ausbuchungs-Delta an den Server
    function updateStock(delta){
        fetch('/updateStock.php', {
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:`artikelnummer=${encodeURIComponent(currentArticleNr)}&delta=${delta}`
        })
        .then(r => r.json())
        .then(json => {
            if (json.success) {
          msgSpan.textContent = `Neuer Bestand: ${json.mengeNeu}`;
          getData(currentArticleNr);
        } else {
          alert(json.msg || 'Unbekannter Fehler');
        }
      })
      .catch(err => alert('Serverfehler: ' + err));
  }

  // Button-Handler
  btnIn.addEventListener('click', () => {
    const n = parseInt(qtyInput.value, 10) || 1;
    updateStock(+Math.abs(n));
  });
  btnOut.addEventListener('click', () => {
    const n = parseInt(qtyInput.value, 10) || 1;
    updateStock(-Math.abs(n));
  });
});
