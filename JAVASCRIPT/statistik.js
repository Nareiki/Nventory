async function ladeStatistiken() {
    try {
        const res = await fetch("./api/getStats.php");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Unbekannter Fehler");

        const daten = json.data.map(p => ({
            ...p,
            Gesamtmenge: Number(p.Gesamtmenge) || 0,
            Deckungsbeitrag: Number(p.Deckungsbeitrag),
            GesamtUmsatz: isFinite(Number(p.Gesamtumsatz)) ? Number(p.Gesamtumsatz) : 0
        }));

        //HTML Tabellenelemente holen
        const statistikTabelle = document.getElementById("statistikTabelle");
        const tabelleMenge = document.getElementById("tabelleMenge");
        const tabelleDB = document.getElementById("tabelleDB");

        if (!statistikTabelle || !tabelleMenge || !tabelleDB) {
            console.error("Ein oder mehrere Tabellenelemente fehlen.");
            return;
        }

        //Statistiken holen
        const meistverkauft = daten.reduce((a, b) => a.Gesamtmenge > b.Gesamtmenge ? a : b);
        const amWenigstenVerkauft = daten.reduce((a, b) => a.Gesamtmenge < b.Gesamtmenge ? a : b);
        const hoechsterDB = daten.reduce((a, b) => a.Deckungsbeitrag > b.Deckungsbeitrag ? a : b);
        const niedrigsterDB = daten.reduce((a, b) => a.Deckungsbeitrag < b.Deckungsbeitrag ? a : b);
        const groessterUmsatz = daten.reduce((a, b) => a.GesamtUmsatz > b.GesamtUmsatz ? a : b);
        const kleinsterUmsatz = daten.reduce((a, b) => a.GesamtUmsatz < b.GesamtUmsatz ? a : b);

        //Einsetzen
        const zeilen = [
            ["Meistverkauft", meistverkauft.Produktname, meistverkauft.Gesamtmenge + " Stück"],
            ["Am wenigsten verkauft", amWenigstenVerkauft.Produktname, amWenigstenVerkauft.Gesamtmenge + " Stück"],
            ["Höchster DB", hoechsterDB.Produktname, hoechsterDB.Deckungsbeitrag.toFixed(2) + " €"],
            ["Niedrigster DB", niedrigsterDB.Produktname, niedrigsterDB.Deckungsbeitrag.toFixed(2) + " €"],
            ["Größter Umsatz", groessterUmsatz.Produktname, groessterUmsatz.GesamtUmsatz.toFixed(2) + " €"],
            ["Kleinster Umsatz", kleinsterUmsatz.Produktname, kleinsterUmsatz.GesamtUmsatz.toFixed(2) + " €"]
        ];

        zeilen.forEach(([kategorie, name, wert]) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${kategorie}</td><td>${name}</td><td>${wert}</td>`;
            statistikTabelle.appendChild(tr);
        });

        daten
            .sort((a, b) => b.Gesamtmenge - a.Gesamtmenge)
            .forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${p.Produktname}</td><td>${p.Gesamtmenge}</td>`;
                tabelleMenge.appendChild(tr);
            });

        daten
            .sort((a, b) => b.Deckungsbeitrag - a.Deckungsbeitrag)
            .forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${p.Produktname}</td><td>${p.Deckungsbeitrag.toFixed(2)} €</td>`;
                tabelleDB.appendChild(tr);
            });

    } catch (error) {
        console.error("Fehler beim Laden der Statistikdaten:", error);
    }
}

document.addEventListener("DOMContentLoaded", ladeStatistiken);
