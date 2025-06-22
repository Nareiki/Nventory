document.addEventListener("DOMContentLoaded", async () => {
    // Artikelnummer aus URL lesen, z. B. produktStatistik.html?artikelnummer=23
    const params = new URLSearchParams(window.location.search);
    const artikelnummer = params.get("artikelnummer");

    if (!artikelnummer) {
        document.getElementById("produkt-info").textContent = "Keine Artikelnummer übergeben.";
        return;
    }

    document.getElementById("produkt-info").textContent = `Statistik für Artikelnummer: ${artikelnummer}`;

    try {
        const response = await fetch(`./api/getProductStats.php?artikelnummer=${artikelnummer}`);
        const json = await response.json();

        if (!json.success) throw new Error(json.error || "Fehler beim Abruf.");

        document.getElementById("name").textContent = json.data.Produktname;
        document.getElementById("kaufpreis").textContent = json.data.Kaufpreis;
        document.getElementById("bestand").textContent = json.data.Bestand ?? "0";
        document.getElementById("durchschnittlicherVKP").textContent = `${Number(json.data.DurchschnittlicherVerkaufspreis || 0).toFixed(2)} €`;
        document.getElementById("verkaeufe").textContent = json.data.Verkaeufe ?? "0";
        document.getElementById("umsatz").textContent = `${Number(json.data.Gesamtumsatz || 0).toFixed(2)} €`;

    } catch (err) {
        console.error("Fehler:", err);
        document.getElementById("produkt-info").textContent = "Fehler beim Laden der Statistik.";
    }
});


