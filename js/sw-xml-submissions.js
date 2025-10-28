document.addEventListener("DOMContentLoaded", function () {
  const fbform = document.getElementById("sw-xml-form");

  fbform.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = fbform.querySelector('[name="name"]').value;
    const fileInput = fbform.querySelector('[name="file"]');
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = async function () {
      const base64 = reader.result.split(",")[1];

      const formBody = new URLSearchParams();
      formBody.append("name", name);
      formBody.append("xml", base64);

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzlq5u8zk573gcHjyTOZ_MuEyw5bVZPmT4_vuGov0cNhTijbjppFjJcrlLPsCKxUE5QYg/exec", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString()
        });

        const responseText = await response.text();
        console.log("Response:", responseText);
        alert("File sent!");
        fbform.reset();
      } catch (err) {
        console.error("Submission failed:", err);
      }
    };

    reader.readAsDataURL(file);
  });
});
