const dropZone = document.querySelectorAll('.dropZone');
const picker = document.getElementById('inputFolder');
const gallery = document.getElementById('gallery');

// Initially hide the gallery
// gallery.style.display = 'none';

// Handle file selection
picker.addEventListener('change', handleFiles);

// Drag and drop event handlers
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone on drag over
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
    }, false);
});

// Handle drop
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}, false);





// Process and display files - File Handling
function handleFiles(e) {
    gallery.innerHTML = '';
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
        // Hide drop zone and show gallery
        // dropZone.style.display = 'none';
        // gallery.style.display = 'grid';
    }

    files.forEach(file => {
        if (/^(video|audio|image)\//.test(file.type)) {
            const url = URL.createObjectURL(file);
            let elem;

            if (file.type.startsWith('video/')) {
                elem = document.createElement('video');
                elem.controls = true;
            } else if (file.type.startsWith('audio/')) {
                elem = document.createElement('audio');
                elem.controls = true;
            } else {
                elem = document.createElement('img');
            }

            elem.src = url;
            gallery.appendChild(elem);
        }
    });
}
