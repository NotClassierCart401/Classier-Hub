document.addEventListener("DOMContentLoaded", function() {
    const fbform = document.getElementById("feedback-form");
    fbform.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(fbform);

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwIv9e9lL_hIgtwutCNspxRphm6VvAdTBlxPRbC-gK1eOV_Qr1Re9UPFhtVfx2rbLr4/exec", {
                method: "POST",
                body: formData
            });
            console.log("Script loaded");
            console.log("Form element:", fbform);
            let sent = `Name: ${formData.get("name")}, Feedback: ${formData.get("feedback")}`;
            let responseText = await response.text();
            console.log("Sent:", sent);
            console.log("Response:", responseText);
            fbform.reset();
            alert("Feedback sent!");
        } catch (err) {
            console.error("Submission failed:", err);
        }
    });
});