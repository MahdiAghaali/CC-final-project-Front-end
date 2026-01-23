const API_URL = "https://t5r9xnky9a.execute-api.eu-west-1.amazonaws.com/default/mahdi-sp-lambda/extract-text";

const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", uploadImage);

function uploadImage() {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file");
        return;
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
        alert("File size must be less than 1MB");
        return;
    }

    output.textContent = "";
    loader.style.display = "block";
    uploadBtn.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const filename = file.name;

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: "1",
                filename: filename,
                file: base64Data
            })
        })
            .then(response => response.json())
            .then(data => {
                output.textContent = data.extracted_text || "No text detected.";
            })
            .catch(error => {
                console.error(error);
                alert("Error extracting text");
            })
            .finally(() => {
                loader.style.display = "none";
                uploadBtn.disabled = false;
            });
    };
}
