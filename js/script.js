let originalImage;

function allowDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        // If files are dropped, use the first one as the selected image
        originalImage = files[0];
        handleImageUpload();
    }
}

function handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const imageDisplay = document.getElementById('imageDisplay');

    if (originalImage || (imageInput.files.length > 0)) {
        // Use the originalImage if it exists; otherwise, use the file input
        originalImage = originalImage || imageInput.files[0];

        // Update UI to show the uploaded image name
        imageDisplay.innerHTML = `<p>Image uploaded: ${originalImage.name}</p>`;
    } else {
        imageDisplay.innerHTML = `<p>No image uploaded</p>`;
    }
}

async function compressImage() {
    if (!originalImage) {
        alert('Please upload an image first.');
        return;
    }

    try {
        const compressedBuffer = await imageOptim(originalImage.buffer, { quality: 0.7 });
        const compressedImage = new Blob([compressedBuffer], { type: 'image/jpeg' });

        displayCompressedImage(compressedImage);
        enableDownloadLink(compressedImage);
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try again.');
    }
}

function displayCompressedImage(compressedImage) {
    const imageDisplay = document.getElementById('imageDisplay');
    imageDisplay.innerHTML = `<p>Original Image:</p><img src="${URL.createObjectURL(originalImage)}" alt="Original Image">
                              <p>Compressed Image:</p><img src="${URL.createObjectURL(compressedImage)}" alt="Compressed Image">`;
}

function enableDownloadLink(compressedImage) {
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = URL.createObjectURL(compressedImage);
    downloadLink.style.display = 'block';
}
