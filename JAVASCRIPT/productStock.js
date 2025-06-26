    // Suchfunktion
    document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    let visibleRows = 0;

    rows.forEach(row => {
    if (row.classList.contains('no-data')) return;

    const text = row.textContent.toLowerCase();
    const isVisible = text.includes(searchTerm);
    row.style.display = isVisible ? '' : 'none';

    if (isVisible) visibleRows++;
    });

    // "Keine Ergebnisse" Zeile anzeigen, wenn keine Treffer
    const noDataRow = document.querySelector('.no-data');
    if (visibleRows === 0 && !noDataRow) {
    const tbody = document.querySelector('tbody');
    const tr = document.createElement('tr');
    tr.className = 'no-data-search';
    const td = document.createElement('td');
    td.colSpan = 7;
    td.className = 'no-data';
    td.textContent = 'Keine passenden Artikel gefunden';
    tr.appendChild(td);
    tbody.appendChild(tr);
    } else if (visibleRows > 0) {
    const noDataSearchRow = document.querySelector('.no-data-search');
    if (noDataSearchRow) noDataSearchRow.remove();
}
});

    // Suchfeld zurücksetzen
    document.getElementById('clearSearch').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
    if (!row.classList.contains('no-data-search')) {
    row.style.display = '';
}
});

    const noDataSearchRow = document.querySelector('.no-data-search');
    if (noDataSearchRow) noDataSearchRow.remove();
});

    // Filter zurücksetzen
    document.getElementById('clearFilter').addEventListener('click', () => {
    window.location.href = window.location.pathname;   
});

    

    // Modal-Funktionalität
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelEdit');
    const editButtons = document.querySelectorAll('.edit-product');
    const deleteBtn = document.getElementById('deleteProduct');
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');
    const mengeInput = document.getElementById('menge');
    const form = document.getElementById('editProductForm');

    // Edit-Button-Event für alle Produkte
    editButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const row = this.closest('tr');

        // Daten aus der Zeile abrufen
        document.getElementById('artikelnummer').value = row.dataset.artikelnr;
        document.getElementById('produktname').value = row.dataset.name;
        document.getElementById('information').value = row.dataset.info;
        document.getElementById('menge').value = row.dataset.menge;
        document.getElementById('preis').value = row.dataset.preis.replace(',', '.');

        // Modal öffnen
        modal.style.display = 'block';
    });
});

    // Modal schließen bei Klick auf X
    closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

    // Modal schließen bei Klick auf Abbrechen
    cancelBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

    // Modal schließen bei Klick außerhalb des Modals
    window.addEventListener('click', function(event) {
    if (event.target === modal) {
    modal.style.display = 'none';
}
});

    // Menge erhöhen
    increaseBtn.addEventListener('click', function() {
    mengeInput.value = parseInt(mengeInput.value) + 1;
});

    // Menge verringern
    decreaseBtn.addEventListener('click', function() {
    const currentValue = parseInt(mengeInput.value);
    if (currentValue > 0) {
    mengeInput.value = currentValue - 1;
}
});

    // Formulardaten senden
    form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Hier den AJAX-Code einfügen, um die Daten zu aktualisieren
    const formData = new FormData(this);

    // Als Beispiel: Ausgabe der Daten in der Konsole
    console.log('Daten speichern:', Object.fromEntries(formData));

    // Hier würde normalerweise ein AJAX-Request erfolgen
    // fetch('update_product.php', {
    //     method: 'POST',
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         // Seite neu laden oder Zeile aktualisieren
    //         location.reload();
    //     } else {
    //         alert('Fehler beim Speichern!');
    //     }
    // });

    // Modal schließen
    modal.style.display = 'none';

    // Für Testzwecke: Seite neu laden
    // location.reload();
});

    // Produkt löschen
    deleteBtn.addEventListener('click', function() {
    const artikelnummer = document.getElementById('artikelnummer').value;

    if (confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
    // Hier den AJAX-Code einfügen, um das Produkt zu löschen
    console.log('Produkt löschen:', artikelnummer);

    // Hier würde normalerweise ein AJAX-Request erfolgen
    // fetch('delete_product.php', {
    //     method: 'POST',
    //     body: JSON.stringify({ artikelnummer: artikelnummer }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         // Seite neu laden
    //         location.reload();
    //     } else {
    //         alert('Fehler beim Löschen!');
    //     }
    // });

    // Modal schließen
    modal.style.display = 'none';

    // Für Testzwecke: Seite neu laden
    // location.reload();
}
});

