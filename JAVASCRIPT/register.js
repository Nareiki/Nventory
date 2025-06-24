document.getElementById("register-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    console.log(FormData);
    const response = await fetch("api/register.php", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log(response.json);
    const output = document.querySelector(".error-output");

    if (data.success) {
        window.location.href = "./loginPage.php";
    } else {
        // alle Fehlermeldungen anzeigen
        output.innerHTML = data.errors.map(error => 
            `<p style="color:red;">${error}</p>`
        ).join('');
    }
});