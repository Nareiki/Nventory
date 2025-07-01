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

  fetch(`http://localhost:3000/article/${encodeURIComponent(articleNumber)}`)
    .then(response => response.json())
    .then(article => {
      console.log('Fetched article:', article); // Debug output
      if (!article || typeof article !== 'object') {
        document.getElementById('articleInfo').innerHTML = '<p style="color:orange">Kein Artikel gefunden.</p>';
        return;
      }
      // Use DTO property names from backend
      document.getElementById('articleInfo').innerHTML = `
        <div class="articleBox">
          <h3>Artikel #${article.articleID}</h3>
          <ul>
            <li><strong>Name:</strong> ${article.articleName}</li>
            <li><strong>Info:</strong> ${article.articleInformation ?? '-'}</li>
            <li><strong>Menge:</strong> ${article.articleAmount}</li>
            <li><strong>Preis:</strong> ${(article.articlePrice ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</li>
          </ul>
        </div>
      `;
    })
    .catch(error => {
      document.getElementById('articleInfo').innerHTML = '<p style="color:red;">Keine Verbindung zum Backend-Server.</p>';
      console.error('Fehler beim Laden:', error);
    });
}

domReady(function () {
  let currentArticleNr = null;
  const price = document.getElementById('stockPrice');
  const qtyInput = document.getElementById('stockQty');
  const msgSpan = document.getElementById('stockMsg');
  const btnIn = document.getElementById('btnIn');
  const btnOut = document.getElementById('btnOut');

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
  function updateStock(transactionTyp) {
    const qtyVal = qtyInput.value;
    let priceVal = price.value;
    // If price is empty or not a number, use the current article price
    if (!priceVal || isNaN(parseFloat(priceVal))) {
      const articleBox = document.querySelector('#articleInfo .articleBox');
      if (articleBox) {
        const preisLi = articleBox.querySelector('li:nth-child(4)');
        if (preisLi) {
          const preisText = preisLi.textContent.match(/([\d,.]+) ?€/);
          if (preisText && preisText[1]) {
            priceVal = preisText[1].replace(',', '.');
          }
        }
      }
    }
    fetch('http://localhost:3000/article-transaction/transaction-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleID: parseInt(currentArticleNr, 10),
        transactionAmount: parseInt(qtyVal, 10),
        transactionPrice: parseFloat(priceVal),
        transactionType: transactionTyp
      })
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          msgSpan.textContent = `Neuer Bestand: ${json.mengeNeu ?? ''}`;
          getData(currentArticleNr);
          if (priceVal && !isNaN(parseFloat(priceVal))) {
            price.value = parseFloat(priceVal).toFixed(2);
          }
        } else {
          alert(json.msg || json.message || 'Unbekannter Fehler');
        }
      })
      .catch(err => alert('Serverfehler: ' + err));
  }

  // Button-Handler
  // ---------------------------------------------------------------------
  // Button-Handler  (diesen Teil ersetzen)
  // ---------------------------------------------------------------------
  btnIn.addEventListener('click', () => {
    const qtyVal = qtyInput.value;
    if (confirm(`Möchten Sie den Bestand um +${qtyVal} Stück erhöhen?`)) {
      updateStock('in');
    }
  });

  btnOut.addEventListener('click', () => {
    const qtyVal = qtyInput.value;
    if (confirm(`Möchten Sie den Bestand um -${qtyVal} Stück verringern?`)) {
      updateStock('out');
    }
  });
});
