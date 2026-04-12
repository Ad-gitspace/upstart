// Temple Detail Page Logic

const DATA_PATH = './data_source/myList.json';
const IMAGE_INDEX_PATH = './data_source/image_index.json';
const DEFAULT_IMAGE = './data_source/indian_temples_img/default_template.png';

let currentTemple = null;
let imageIndex = {};
let galleryImages = [];
let currentGalleryIndex = 0;

async function init() {
    const templeId = sessionStorage.getItem('selectedTempleId');

    if (!templeId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        await loadImageIndex();
        const temples = await loadTempleData();
        currentTemple = temples.find(t => t.id === templeId);

        if (currentTemple) {
            renderTempleDetails(currentTemple);
        } else {
            showError('Temple not found');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load temple details');
    }
}

async function loadImageIndex() {
    try {
        const response = await fetch(IMAGE_INDEX_PATH);
        imageIndex = await response.json();
    } catch (error) {
        console.error('Error loading image index:', error);
    }
}

async function loadTempleData() {
    const response = await fetch(DATA_PATH);
    const data = await response.json();
    // Parse refs just in case
    return data.map(temple => {
        if (temple.coordinates) {
            temple.coordinates.lat = parseFloat(temple.coordinates.lat);
            temple.coordinates.lng = parseFloat(temple.coordinates.lng);
        }
        return temple;
    });
}

function renderTempleDetails(temple) {
    const container = document.getElementById('templeDetail');

    // Determine gallery images
    galleryImages = getGalleryImages(temple.name);
    currentGalleryIndex = 0;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${temple.coordinates.lat},${temple.coordinates.lng}`;

    // Create Layout
    // If we have multiple images, show gallery structure, otherwise static image
    let imageSection = '';

    if (galleryImages.length > 1) {
        imageSection = `
            <div class="detail-gallery">
                <button class="gallery-nav-btn prev-btn" onclick="prevImage()">❮</button>
                <img id="mainDetailImage" src="${galleryImages[0]}" alt="${temple.name}" class="detail-image">
                <button class="gallery-nav-btn next-btn" onclick="nextImage()">❯</button>
                <div class="gallery-dots" id="galleryDots">
                    ${galleryImages.map((_, i) => `<span class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="setGalleryImage(${i})"></span>`).join('')}
                </div>
            </div>
        `;
        // Enable keyboard navigation
        setupGalleryKeys();
    } else {
        const singleImage = galleryImages.length > 0 ? galleryImages[0] : DEFAULT_IMAGE;
        imageSection = `
            <img src="${singleImage}" alt="${temple.name}" class="detail-image" onerror="this.src='${DEFAULT_IMAGE}'">
        `;
    }

    container.innerHTML = `
        <div class="detail-card">
            ${imageSection}
            
            <div class="detail-content">
                <h1 class="detail-title">${temple.name}</h1>
                
                <div class="detail-location">
                    <span>📍</span>
                    <span>${temple.location.city}, ${temple.location.district}, ${temple.location.state}</span>
                </div>
                
                <div class="detail-badges">
                    <span class="detail-badge" style="background: rgba(255, 153, 51, 0.15); color: #E68A2E; border: 1px solid #FF9933;">
                        🙏 ${temple.details.Deity}
                    </span>
                    <span class="detail-badge" style="background: rgba(19, 136, 8, 0.15); color: #0F6906; border: 1px solid #138808;">
                        🏛️ ${temple.details.Architecture_Style}
                    </span>
                </div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Built In</div>
                        <div class="detail-value">${temple.details.Build_Date || temple.details.Established_Year}</div>
                    </div>
                     <div class="detail-item">
                        <div class="detail-label">Festivals</div>
                        <div class="detail-value">${temple.details.Festivals_Celebrated}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Rituals</div>
                        <div class="detail-value">${temple.details.Rituals_and_Pujas}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Managing Authority</div>
                        <div class="detail-value">${temple.details.Managing_Authority}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Transport</div>
                        <div class="detail-value">${temple.details.Transport_Info}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Historical Significance</div>
                        <div class="detail-value" style="font-size: 0.95rem; line-height: 1.5;">${temple.details.Historical_Significance}</div>
                    </div>
                </div>
                
                <div class="map-link-section">
                    <a href="${googleMapsUrl}" target="_blank" class="btn-map">
                        <span>🗺️</span> Get Directions via Google Maps
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Gallery Logic
window.prevImage = function () { // Make global accessible
    if (galleryImages.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGallery();
};

window.nextImage = function () {
    if (galleryImages.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateGallery();
};

window.setGalleryImage = function (index) {
    if (galleryImages.length <= 1) return;
    currentGalleryIndex = index;
    updateGallery();
};

function updateGallery() {
    const imgElement = document.getElementById('mainDetailImage');
    const dots = document.querySelectorAll('.gallery-dot');

    if (imgElement) {
        imgElement.style.opacity = '0.5';
        setTimeout(() => {
            imgElement.src = galleryImages[currentGalleryIndex];
            imgElement.style.opacity = '1';
        }, 150);
    }

    dots.forEach((dot, idx) => {
        if (idx === currentGalleryIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function setupGalleryKeys() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') window.prevImage();
        if (e.key === 'ArrowRight') window.nextImage();
    });
}

// Get images for gallery
function getGalleryImages(templeName) {
    // Check index
    for (const key of Object.keys(imageIndex)) {
        if (templeName.includes(key) || key.includes(templeName)) {
            const images = imageIndex[key];
            if (images && images.length > 0) {
                return images;
            }
        }
    }

    // Check old hardcoded map fallback if needed
    const imageMap = {
        'Golden Temple': 'Golden Temple',
        // ... abbreviated
    };

    for (const [key, folder] of Object.entries(imageMap)) {
        if (templeName.includes(key)) {
            return [`./data_source/indian_temples_img/${folder}/main.jpg`];
        }
    }

    return [DEFAULT_IMAGE];
}

function showError(message) {
    const container = document.getElementById('templeDetail');
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: #8B7355;"><h2>❌ ${message}</h2></div>`;
}

// Initialize
init();
