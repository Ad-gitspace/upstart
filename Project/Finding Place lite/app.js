// Temple Finder - Main Application Logic

// Configuration
const TEMPLES_PER_PAGE = 20;
const DATA_PATH = './data_source/myList.json';
const IMAGE_INDEX_PATH = './data_source/image_index.json';
const DEFAULT_IMAGE = './data_source/indian_temples_img/default_template.png';

// State Management
let allTemples = [];
let filteredTemples = [];
let featuredTemples = [];
let imageIndex = {};
let currentPage = 1;
let userLocation = null;
let currentSort = 'name'; // 'name' or 'distance'

// Initialize the application
async function init() {
    showLoading();
    await loadImageIndex();
    await loadTempleData();
    await getUserLocation();
    renderFeaturedTemples(); // New featured section
    renderTemples();
    setupEventListeners();
}

// Load Image Index
async function loadImageIndex() {
    try {
        const response = await fetch(IMAGE_INDEX_PATH);
        imageIndex = await response.json();
        console.log('Image index loaded:', Object.keys(imageIndex).length, 'temples');
    } catch (error) {
        console.error('Error loading image index:', error);
    }
}

// Load temple data from JSON
async function loadTempleData() {
    try {
        const response = await fetch(DATA_PATH);
        allTemples = await response.json();

        // Clean up data: ensure coordinates are numbers
        allTemples = allTemples.map(temple => {
            if (temple.coordinates) {
                temple.coordinates.lat = parseFloat(temple.coordinates.lat);
                temple.coordinates.lng = parseFloat(temple.coordinates.lng);
            }
            return temple;
        });

        // Identify featured temples based on image index match
        featuredTemples = allTemples.filter(temple => {
            for (const key of Object.keys(imageIndex)) {
                if (temple.name.includes(key) || key.includes(temple.name)) {
                    temple.imageKey = key;
                    return true;
                }
            }
            return false;
        });

        filteredTemples = [...allTemples];
        console.log(`Loaded ${allTemples.length} temples. Featured: ${featuredTemples.length}`);

    } catch (error) {
        console.error('Error loading temple data:', error);
        showError('Failed to load temple data. Please refresh the page.');
    }
}

// Get user's current location
async function getUserLocation() {
    const locationDisplay = document.getElementById('locationDisplay');

    if ('geolocation' in navigator) {
        try {
            locationDisplay.innerHTML = `<span class="icon">📍</span> Locating...`;

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            calculateDistances();

            // Try specific location name
            try {
                const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLocation.lat}&longitude=${userLocation.lng}&localityLanguage=en`
                );
                const data = await response.json();
                const locationName = data.city || data.locality || data.principalSubdivision || 'Location Detected';
                locationDisplay.innerHTML = `<span class="icon">📍</span> ${locationName}`;
            } catch (err) {
                locationDisplay.innerHTML = `<span class="icon">📍</span> Location Detected`;
            }

            if (currentSort === 'distance') {
                sortTemples('distance');
                renderTemples();
            }

        } catch (error) {
            console.log('Location access denied:', error);
            locationDisplay.innerHTML = `<span class="icon">😢</span> Can't find U :(`;
        }
    } else {
        locationDisplay.innerHTML = `<span class="icon">😢</span> Can't find U :(`;
        renderTemples();
    }
}

// Calculate distances
function calculateDistances() {
    if (!userLocation) return;

    allTemples.forEach(temple => {
        if (temple.coordinates && !isNaN(temple.coordinates.lat) && !isNaN(temple.coordinates.lng)) {
            temple.distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                temple.coordinates.lat,
                temple.coordinates.lng
            );
        } else {
            temple.distance = Infinity;
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

// Search and filter
function searchTemples(query) {
    if (!query.trim()) {
        filteredTemples = [...allTemples];
        // Reset featured to show all available featured temples
        renderFeaturedTemples(featuredTemples);
        sortTemples(currentSort);
        return;
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    // Filter helper function
    const filterFn = (temple) => {
        const searchText = [
            temple.name,
            temple.location.state,
            temple.location.city,
            temple.location.district,
            temple.details.Deity,
            temple.details.Architecture_Style,
            temple.details.Nearest_City
        ].join(' ').toLowerCase();

        if (searchTerms.length === 1) {
            return searchText.includes(searchTerms[0]);
        }
        return searchTerms.every(term => searchText.includes(term));
    };

    // Filter Main List
    filteredTemples = allTemples.filter(filterFn);

    // Filter Featured List
    const filteredFeatured = featuredTemples.filter(filterFn);
    renderFeaturedTemples(filteredFeatured);

    // Relevance sort
    filteredTemples.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const queryLower = query.toLowerCase();

        if (aName === queryLower) return -1;
        if (bName === queryLower) return 1;
        if (aName.startsWith(queryLower)) return -1;
        if (bName.startsWith(queryLower)) return 1;
        return 0;
    });

    renderTemples();
}

// Sort
function sortTemples(sortBy) {
    currentSort = sortBy;
    if (sortBy === 'name') {
        filteredTemples.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'distance') {
        if (!userLocation) return;
        filteredTemples.sort((a, b) => {
            const distA = (a.distance !== undefined && a.distance !== null) ? a.distance : Infinity;
            const distB = (b.distance !== undefined && b.distance !== null) ? b.distance : Infinity;
            return distA - distB;
        });
    }
    renderTemples();
}

// Render Featured Temples Section
function renderFeaturedTemples(templesToRender = featuredTemples) {
    const section = document.getElementById('featuredSection');
    const container = document.getElementById('featuredGrid');

    if (!container || templesToRender.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (section) section.style.display = 'block';
    container.innerHTML = '';

    templesToRender.forEach(temple => {
        const card = createFeaturedCard(temple);
        container.appendChild(card);
    });
}

function createFeaturedCard(temple) {
    const card = document.createElement('div');
    card.className = 'temple-card featured-card';
    card.onclick = () => goToTempleDetail(temple.id);

    // Get all images for this temple
    const availableImages = imageIndex[temple.imageKey] || [];
    // Start with a random image so even initial load looks varied
    let currentImageIndex = Math.floor(Math.random() * availableImages.length);
    const initialImage = availableImages.length > 0 ? availableImages[currentImageIndex] : DEFAULT_IMAGE;

    // Create distance badge
    let distanceBadge = '';
    if (temple.distance !== undefined && temple.distance !== Infinity) {
        distanceBadge = `<div class="distance-badge">${temple.distance.toFixed(1)} km away</div>`;
    }

    // Unique ID based on temple ID + random string to avoid conflicts if re-rendered
    const imgId = `featured-img-${temple.id}-${Math.floor(Math.random() * 1000)}`;

    card.innerHTML = `
        <div class="temple-image-container">
            <img id="${imgId}" src="${initialImage}" alt="${temple.name}" class="temple-image" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="image-overlay"></div>
            <div class="featured-badge">✨ Featured</div>
            ${distanceBadge}
        </div>
        <div class="temple-info">
            <h3 class="temple-name">${temple.name}</h3>
            <div class="temple-location">
                <span>📍</span>
                <span>${temple.location.city}, ${temple.location.state}</span>
            </div>
            <div class="temple-badges">
                <span class="badge badge-deity">🙏 ${temple.details.Deity}</span>
            </div>
        </div>
    `;

    // Setup randomized auto-rotation
    if (availableImages.length > 1) {
        const scheduleNextUpdate = () => {
            // Random duration between 5000ms (5s) and 10000ms (10s)
            const randomDuration = Math.random() * (10000 - 5000) + 5000;

            setTimeout(() => {
                const imgElement = document.getElementById(imgId);
                // Check if element still exists in DOM (if we re-rendered/searched, it might be gone)
                if (imgElement && document.contains(imgElement)) {
                    currentImageIndex = (currentImageIndex + 1) % availableImages.length;

                    // Simple fade swap
                    imgElement.style.opacity = '0.7';
                    setTimeout(() => {
                        imgElement.src = availableImages[currentImageIndex];
                        imgElement.style.opacity = '1';
                    }, 200);

                    // Recursively schedule next
                    scheduleNextUpdate();
                }
            }, randomDuration);
        };

        // Start the loop
        scheduleNextUpdate();
    }

    return card;
}

// Render Standard Temples
function renderTemples() {
    const container = document.getElementById('templeGrid');
    const resultsInfo = document.getElementById('resultsInfo');

    if (!container) return;

    const startIndex = (currentPage - 1) * TEMPLES_PER_PAGE;
    const endIndex = startIndex + TEMPLES_PER_PAGE;
    const templesToShow = filteredTemples.slice(startIndex, endIndex);

    if (resultsInfo) {
        resultsInfo.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredTemples.length)} of ${filteredTemples.length} temples`;
        if (currentSort === 'distance' && !userLocation) {
            resultsInfo.textContent += ' (Location needed for distance sorting)';
        }
    }

    container.innerHTML = '';

    if (templesToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h2>🙏 No temples found</h2>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }

    templesToShow.forEach(temple => {
        const card = createTempleCard(temple);
        container.appendChild(card);
    });

    renderPagination();
}

function createTempleCard(temple) {
    const card = document.createElement('div');
    card.className = 'temple-card';
    card.onclick = () => goToTempleDetail(temple.id);

    const imagePath = getTempleImage(temple.name);

    let distanceBadge = '';
    if (temple.distance !== undefined && temple.distance !== Infinity) {
        distanceBadge = `<div class="distance-badge">${temple.distance.toFixed(1)} km away</div>`;
    }

    card.innerHTML = `
        <div class="temple-image-container">
            <img src="${imagePath}" alt="${temple.name}" class="temple-image" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="image-overlay"></div>
            ${distanceBadge}
        </div>
        <div class="temple-info">
            <h3 class="temple-name">${temple.name}</h3>
            <div class="temple-location">
                <span>📍</span>
                <span>${temple.location.city}, ${temple.location.state}</span>
            </div>
            <div class="temple-badges">
                <span class="badge badge-deity">🙏 ${temple.details.Deity}</span>
                <span class="badge badge-architecture">🏛️ ${temple.details.Architecture_Style}</span>
            </div>
            <button class="btn-primary">View Details →</button>
        </div>
    `;

    return card;
}

// Get temple image path (Fallback logic)
function getTempleImage(templeName) {
    // 1. Check if we have it in our generated index first
    for (const key of Object.keys(imageIndex)) {
        if (templeName.includes(key) || key.includes(templeName)) {
            const images = imageIndex[key];
            if (images && images.length > 0) {
                return images[0];
            }
        }
    }

    // 2. Fallback to old hardcoded map if needed
    // (Ideally this mapping should be redundant now if index is good)
    return DEFAULT_IMAGE;
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredTemples.length / TEMPLES_PER_PAGE);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            ← Prev
        </button>
    `;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next →
        </button>
    `;

    paginationHTML += `
        <div class="page-info">Page ${currentPage} of ${totalPages}</div>
    `;

    container.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredTemples.length / TEMPLES_PER_PAGE);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTemples();
    const resultsTop = document.getElementById('resultsInfo');
    if (resultsTop) {
        resultsTop.scrollIntoView({ behavior: 'smooth' });
    }
}

function goToTempleDetail(templeId) {
    sessionStorage.setItem('selectedTempleId', templeId);
    window.location.href = 'temple.html';
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTemples(e.target.value);
            // currentPage = 1; is handled in searchTemples -> renderTemples implicitly? 
            // Wait, searchTemples calls renderTemples but current page logic is inside renderTemples?
            // Actually I removed currentPage = 1 from searchTemples, I should add it back or ensure renderTemples handles it.
            // Let's add it back here to be safe.
            currentPage = 1;
            renderTemples();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortTemples(e.target.value);
            currentPage = 1;
            renderTemples();
        });
    }
}

function showLoading() {
    const container = document.getElementById('templeGrid');
    if (container) {
        container.innerHTML = '<div class="loading">🙏 Loading temples...</div>';
    }
}

function showError(message) {
    const container = document.getElementById('templeGrid');
    if (container) {
        container.innerHTML = `<div class="no-results"><h2>❌ Error</h2><p>${message}</p></div>`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
