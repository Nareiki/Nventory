document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    console.log("FormData:", Array.from(formData.entries()));
    let output = document.querySelector(".error-output");
    if (!output) {
        output = document.createElement('div');
        output.className = 'error-output';
        this.appendChild(output);
    }
    output.innerHTML = '';
    try {
        const response = await fetch("api/register.php", {
            method: "POST",
            body: formData
        });
        let data;
        try {
            data = await response.json();
        } catch (jsonErr) {
            console.error("JSON parse error", jsonErr);
            output.innerHTML = '<p style="color:red;">Server returned invalid JSON.</p>';
            return;
        }
        console.log("Response data:", data);
        if (data.success) {
            window.location.href = "./loginPage.php";
        } else if (data.errors) {
            output.innerHTML = data.errors.map(error =>
                `<p style="color:red;">${error}</p>`
            ).join('');
        } else {
            output.innerHTML = '<p style="color:red;">Unbekannter Fehler.</p>';
        }
    } catch (err) {
        console.error("Fetch error", err);
        output.innerHTML = '<p style="color:red;">Verbindungsfehler oder Server nicht erreichbar.</p>';
    }
});