document.addEventListener("DOMContentLoaded", async () => {
    // Artikelnummer aus URL lesen, z. B. produktStatistik.html?articleID=23
    const params = new URLSearchParams(window.location.search);
    // Accept both 'articleID' and 'Artikelnummer' for compatibility
    const articleID = params.get("articleID") || params.get("artikelnummer");

    console.log("[productSatistik] articleID from URL:", articleID);

    if (!articleID) {
        document.getElementById("produkt-info").textContent = "Keine Artikelnummer übergeben.";
        return;
    }

    document.getElementById("produkt-info").textContent = `Statistik für Artikelnummer: ${articleID}`;

    try {
        // Call backend API endpoint directly (adjust URL as needed)
        const apiUrl = `http://localhost:3000/article/stats/${encodeURIComponent(articleID)}`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        console.log("[productSatistik] API request URL:", apiUrl);
        console.log("[productSatistik] API response:", json);

        if (!json.success) throw new Error(json.error || "Fehler beim Abruf.");

        document.getElementById("name").textContent = json.data.Produktname;
        document.getElementById("kaufpreis").textContent = `${Number(json.data.DurchschnittlicherKaufpreis || 0).toFixed(2)} €`;
        document.getElementById("bestand").textContent = json.data.Bestand ?? "0";
        document.getElementById("durchschnittlicherVKP").textContent = `${Number(json.data.DurchschnittlicherVerkaufspreis || 0).toFixed(2)} €`;
        document.getElementById("verkaeufe").textContent = json.data.Verkaufsmenge ?? "0";
        document.getElementById("umsatz").textContent = `${Number(json.data.Gesamtumsatz || 0).toFixed(2)} €`;

    } catch (err) {
        console.error("Fehler:", err);
        document.getElementById("produkt-info").textContent = "Fehler beim Laden der Statistik.";
    }
});


