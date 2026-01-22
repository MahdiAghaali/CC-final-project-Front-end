const API_URL = "https://t5r9xnky9a.execute-api.eu-west-1.amazonaws.com/default/mahdi-sp-lambda/extract-text"

function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file");
        return;
    }

    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file.size > maxSize) {
        alert("File size must be less than 1MB");
        return;
    }

    console.log("File selected:", file.name);


    const reader = new FileReader();

    reader.onload = function () {
        const base64Data = reader.result.split(",")[1];
        sendToApi(file.name, base64Data);
    };

    reader.readAsDataURL(file);

}

function sendToApi(filename, base64Data) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID:'1',
            filename: filename,
            file: base64Data
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").textContent = data.extracted_text;
        })
        .catch(error => {
            console.error(error);
            alert("Error extracting text");
        });
}
