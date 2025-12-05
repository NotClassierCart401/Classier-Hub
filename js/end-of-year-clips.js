let fileArray = [];
let fileInput = document.getElementById("uploadvideo");
let files_uploaded = 0

fileInput.addEventListener("change", () => {
    var newfiles = Array.from(fileInput.files);
    newfiles.forEach((file) => {
      fileArray.push(file)
    });
    files_uploaded = 0
    preview();
});

let prev = document.getElementById("prev")

function preview() {
    prev.innerHTML = ""

    fileArray.forEach((file, index) => {
        const reader = new FileReader()
        files_uploaded++;
        let row = document.createElement("div")
        row.style.display = "flex"
        row.style.flexDirection = "row"
        row.style.alignItems = "center"
        row.style.minHeight = "40px"
        if (index % 2 === 0) {
            row.style.background = "linear-gradient(to bottom, hsl(45, 80%, 90%, 0.6), hsl(45, 80%, 90%, 0.8))"
        }
        else {
            row.style.background = "linear-gradient(to bottom, hsl(45, 80%, 80%, 0.6), hsl(45, 80%, 80%, 0.8))"
        }

        let name = document.createElement("span")
        name.innerText = file.name
        name.className = "vidname"
        name.title = "Preview"
        name.addEventListener("click", () => {
          var b = document.getElementById("vidprev")
          b.style.display = "inline-block"
          let m = document.getElementsByClassName("mainv")[0]
          let p = document.createElement("p")
          p.innerText = `Previewing ${file.name}`
          let v = document.createElement("video")
          v.controls = true
          v.style.maxHeight = "500px"
          v.style.maxWidth = "1000px"
          v.src = URL.createObjectURL(file)
          let closeBtn = document.createElement("button")
          closeBtn.innerText = "X"
          closeBtn.className = "deleteBtn"
          closeBtn.title = "Close"
          closeBtn.style.display = "block"
          closeBtn.style.height = "50px"
          closeBtn.style.width = "50px"
          closeBtn.style.margin = "20px"
          closeBtn.addEventListener("click", () => {
              b.style.display = "none"
              closeBtn.remove()
              p.remove()
              v.remove()
          });
          b.appendChild(m)
          m.appendChild(closeBtn)
          m.appendChild(p)
          m.appendChild(v)
        });

        let deleteBtn = document.createElement("button")
        deleteBtn.innerText = "X"
        deleteBtn.classList = "deleteBtn"
        deleteBtn.title = "Delete"
        deleteBtn.addEventListener("click", () => {
            fileArray.splice(index, 1)
            preview()
        });

        row.appendChild(deleteBtn)
        row.appendChild(name)
        prev.appendChild(row)
        
    });
   console.log("Files Uploaded: ", files_uploaded)
};

function overlayOn() {
  let b = document.getElementById("submittedoverlay")
  b.style.display = "inline-block"
};

function overlayOff() {
  let b = document.getElementById("submittedoverlay")
  b.style.display = "none"
};

document.addEventListener("DOMContentLoaded", function () {
  const fbform = document.getElementById("eoyc-sub");

  fbform.addEventListener("submit", async function (event) {
    event.preventDefault();

    let sendername = document.getElementById("name").value;

    for (const file of fileArray) {
        const reader = new FileReader();
        reader.onload = async function () {
          const base64 = reader.result.split(",")[1];
          console.log("Folder name being sent:", sendername.value);
          try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbw9vgE9nmKWXhaa03O2at4sZCZeNRYdfMtQoyP3wi9wOnMpxbDPVlDKVETAydrAyQcS/exec", {
              method: "POST",
              body: JSON.stringify({
                name: sendername,
                vidname: file.name,
                video: base64,
                mimeType: file.type
              })
            });
            

            const responseText = await response.text();
            console.log("Response:", responseText);
          } catch (err) {
            console.error("Submission failed:", err);
          }
        };
        reader.readAsDataURL(file);
    }
    overlayOn()
    fbform.reset();
    fileArray = []
    preview()
  });
});
