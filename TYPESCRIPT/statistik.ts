interface StatistikProdukt {
    Produktname: string;
    Gesamtmenge: number;
    DurchschnittlicherDeckungsbeitrag: number;
    GesamtDeckungsbeitrag: number;
}

interface ApiResponse {
    success: boolean;
    data: StatistikProdukt[];
    error?: string;
}

async function ladeStatistiken(): Promise<void> {
    try {
        const res = await fetch("./api/getStats.php");
        const json: ApiResponse = await res.json();
        if (!json.success) throw new Error(json.error || "Unbekannter Fehler");

        const daten: StatistikProdukt[] = json.data.map((p) => ({
            ...p,
            Gesamtmenge: Number(p.Gesamtmenge),
            DurchschnittlicherDeckungsbeitrag: Number(p.DurchschnittlicherDeckungsbeitrag),
            GesamtDeckungsbeitrag: Number(p.GesamtDeckungsbeitrag),
        }));

        const statistikTabelle = document.getElementById("statistikTabelle");
        const tabelleMenge = document.getElementById("tabelleMenge");
        const tabelleDB = document.getElementById("tabelleDB");

        if (!statistikTabelle || !tabelleMenge || !tabelleDB) {
            console.error("Mindestens ein Tabellenelement wurde nicht gefunden.");
            return;
        }

        const meistverkauft = daten.reduce((a, b) => a.Gesamtmenge > b.Gesamtmenge ? a : b);
        const amWenigstenVerkauft = daten.reduce((a, b) => a.Gesamtmenge < b.Gesamtmenge ? a : b);
        const hoechsterDB = daten.reduce((a, b) => a.DurchschnittlicherDeckungsbeitrag > b.DurchschnittlicherDeckungsbeitrag ? a : b);
        const niedrigsterDB = daten.reduce((a, b) => a.DurchschnittlicherDeckungsbeitrag < b.DurchschnittlicherDeckungsbeitrag ? a : b);
        const groessterUmsatz = daten.reduce((a, b) => a.GesamtDeckungsbeitrag > b.GesamtDeckungsbeitrag ? a : b);
        const kleinsterUmsatz = daten.reduce((a, b) => a.GesamtDeckungsbeitrag < b.GesamtDeckungsbeitrag ? a : b);

        const zeilen: [string, string, string][] = [
            [" Meistverkauft", meistverkauft.Produktname, `${meistverkauft.Gesamtmenge} Stück`],
            [" Am wenigsten verkauft", amWenigstenVerkauft.Produktname, `${amWenigstenVerkauft.Gesamtmenge} Stück`],
            [" Höchster DB", hoechsterDB.Produktname, `${hoechsterDB.DurchschnittlicherDeckungsbeitrag.toFixed(2)} €`],
            [" Niedrigster DB", niedrigsterDB.Produktname, `${niedrigsterDB.DurchschnittlicherDeckungsbeitrag.toFixed(2)} €`],
            [" Größter Umsatz", groessterUmsatz.Produktname, `${groessterUmsatz.GesamtDeckungsbeitrag.toFixed(2)} €`],
            [" Kleinster Umsatz", kleinsterUmsatz.Produktname, `${kleinsterUmsatz.GesamtDeckungsbeitrag.toFixed(2)} €`],
        ];

        zeilen.forEach(([kat, name, wert]) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${kat}</td><td>${name}</td><td>${wert}</td>`;
            statistikTabelle.appendChild(tr);
        });

        daten.sort((a, b) => b.Gesamtmenge - a.Gesamtmenge).forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${p.Produktname}</td><td>${p.Gesamtmenge}</td>`;
            tabelleMenge.appendChild(tr);
        });

        daten.sort((a, b) => b.DurchschnittlicherDeckungsbeitrag - a.DurchschnittlicherDeckungsbeitrag).forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${p.Produktname}</td><td>${p.DurchschnittlicherDeckungsbeitrag.toFixed(2)} €</td>`;
            tabelleDB.appendChild(tr);
        });

    } catch (error) {
        console.error("Fehler beim Laden der Statistikdaten:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    ladeStatistiken();
});
