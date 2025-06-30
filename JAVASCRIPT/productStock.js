// Suchfunktion
document.getElementById('searchInput').addEventListener('input', function () {
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
document.getElementById('clearSearch').addEventListener('click', function () {
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
const form = document.getElementById('editProductForm');

// Edit-Button-Event für alle Produkte
editButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const row = this.closest('tr');
        // Defensive: check if dataset properties exist and log for debugging
        const artikelnummer = row.dataset.artikelnr || row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
        const produktname = row.dataset.name || row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
        const information = row.dataset.info || row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        const menge = row.dataset.menge || row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
        let preis = row.dataset.preis || row.querySelector('td.price')?.textContent.trim() || '';
        if (preis) {
            preis = preis.replace('€', '').replace(',', '.').trim();
        }
        document.getElementById('artikelnummer').value = artikelnummer;
        document.getElementById('produktname').value = produktname;
        document.getElementById('information').value = information;
        if (document.getElementById('menge')) {
            document.getElementById('menge').value = menge;
        }
        document.getElementById('preis').value = preis;
        // Modal öffnen
        modal.style.display = 'block';
    });
});

// Modal schließen bei Klick auf X
closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Modal schließen bei Klick auf Abbrechen
cancelBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Modal schließen bei Klick außerhalb des Modals
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Formulardaten senden
form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Hier den AJAX-Code einfügen, um die Daten zu aktualisieren
    const formData = new FormData(this);
    // Als Beispiel: Ausgabe der Daten in der Konsole
    console.log('Daten speichern:', Object.fromEntries(formData));
    console.log('Artikelnummer:', formData.get('artikelnummer'));
    // Prepare data for PUT request
    const payload = {
        articleName: formData.get('produktname'),
        articleInformation: formData.get('information'),
        articleAmount: formData.get('menge') ? parseInt(formData.get('menge'), 10) : undefined,
        articlePrice: formData.get('preis') ? parseFloat(formData.get('preis').replace(',', '.')) : undefined
    };
    // Remove undefined fields
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    fetch('http://localhost:3000/article/' + encodeURIComponent(formData.get('artikelnummer')), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Speichern!');
            console.log('Daten erfolgreich gespeichert');
            return response.json();
        })
        .then(data => {
            // Seite neu laden oder Zeile aktualisieren
            location.reload();
        })
        .catch(err => {
            alert(err.message);
        });
    // Modal schließen
    modal.style.display = 'none';
});

// Produkt löschen
deleteBtn.addEventListener('click', function () {
    const artikelnummer = document.getElementById('artikelnummer').value;

    if (confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
        fetch('http://localhost:3000/article/' + encodeURIComponent(artikelnummer), {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Fehler beim Löschen!');
                // Seite neu laden nach erfolgreichem Löschen
                location.reload();
            })
            .catch(err => {
                alert(err.message);
            });

        // Modal schließen
        modal.style.display = 'none';
    }
});

