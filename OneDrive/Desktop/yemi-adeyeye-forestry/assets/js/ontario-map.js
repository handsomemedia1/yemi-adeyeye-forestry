/**
 * Ontario Map Initialization using Leaflet
 * Creates an interactive map showing Ontario location
 */

// Wait for both DOM and Leaflet to be ready
function initOntarioMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet not loaded yet, retrying...');
        setTimeout(initOntarioMap, 100);
        return;
    }

    const mapContainer = document.getElementById('ontarioMapContainer');

    if (!mapContainer) {
        console.error('Ontario map container not found');
        return;
    }

    // Check if map already initialized
    if (mapContainer._leaflet_id) {
        return;
    }

    // Ensure container has height
    mapContainer.style.height = '400px';
    mapContainer.style.width = '100%';

    try {
        // Initialize Leaflet map centered on Ontario
        const map = L.map('ontarioMapContainer', {
            center: [50.0, -85.0], // Center of Ontario
            zoom: 6,
            minZoom: 5,
            maxZoom: 10,
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            touchZoom: true
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add marker for Ontario location
        const ontarioMarker = L.marker([42.3149, -83.0364], {
            title: 'Ontario, Canada'
        }).addTo(map);

        // Add popup to marker
        ontarioMarker.bindPopup(`
            <div style="text-align: center;">
                <strong>Ontario, Canada</strong><br>
                <small>Based in Ontario • Working Globally</small>
            </div>
        `).openPopup();

        // Add a circle to highlight the region
        L.circle([42.3149, -83.0364], {
            color: '#1B4332',
            fillColor: '#1B4332',
            fillOpacity: 0.1,
            radius: 50000 // 50km radius
        }).addTo(map);

    } catch (error) {
        console.error('Error initializing Ontario map:', error);
    }
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all scripts are loaded
    setTimeout(initOntarioMap, 500);
});

// Also try to initialize on window load as fallback
window.addEventListener('load', function() {
    setTimeout(initOntarioMap, 100);
});