/**
 * World Map Initialization using Leaflet
 * Creates an interactive world map showing global impact
 */

// Wait for both DOM and Leaflet to be ready
function initWorldMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet not loaded yet, retrying...');
        setTimeout(initWorldMap, 100);
        return;
    }
    
    const mapContainer = document.getElementById('worldMapContainer');
    
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    // Check if map already initialized
    if (mapContainer._leaflet_id) {
        return;
    }
    
    // Ensure container has height
    mapContainer.style.height = '500px';
    mapContainer.style.width = '100%';
    
    try {
        // Initialize Leaflet map
        const map = L.map('worldMapContainer', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 5,
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            touchZoom: true
        });

        // Add OpenStreetMap tile layer with custom styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 5,
            tileSize: 256,
            zoomOffset: 0
        }).addTo(map);

        // Comprehensive location data with categories
        const allLocations = [
            // CURRENT LOCATION
            { lat: 42.3149, lng: -83.0364, name: 'Windsor, Ontario, Canada', category: 'current', description: 'Current Location - City Forester & Manager' },
            
            // EDUCATION LOCATIONS
            { lat: 49.2606, lng: -123.2460, name: 'University of British Columbia, Canada', category: 'education', description: 'PhD in International Forestry (2015-2019)' },
            { lat: 55.6761, lng: 12.5683, name: 'University of Copenhagen, Denmark', category: 'education', description: 'MSc Agricultural Development (2013-2014)' },
            { lat: 53.2274, lng: -4.1293, name: 'Bangor University, North West Wales', category: 'education', description: 'MSc Environmental Forestry (2011-2012)' },
            { lat: 7.4951, lng: 4.5249, name: 'Federal University of Technology, Akure', category: 'education', description: 'B.Tech Agricultural Technology (2006-2010)' },
            { lat: 51.2538, lng: -0.3273, name: 'University of Windsor, Canada', category: 'education', description: 'Art of Supervision Certificate (2024)' },
            { lat: 51.9691, lng: 5.6669, name: 'Wageningen University, Netherlands', category: 'education', description: 'Landscape Governance Certificate (2021)' },
            
            // PROJECT LOCATIONS
            { lat: -17.8146, lng: -63.1561, name: 'Santa Cruz, Bolivia', category: 'project', description: 'Fundación Natura - Community Engagement Research' },
            { lat: 5.6037, lng: -0.1870, name: 'Accra, Ghana', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: -13.9626, lng: 33.7741, name: 'Lilongwe, Malawi', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 6.5244, lng: 3.3792, name: 'Lagos, Nigeria', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 4.0511, lng: 9.7679, name: 'Douala, Cameroon', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 12.3714, lng: -1.5197, name: 'Ouagadougou, Burkina Faso', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 6.4969, lng: 2.6289, name: 'Cotonou, Benin', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 13.4549, lng: -16.5790, name: 'Banjul, Gambia', category: 'project', description: 'GLFx Landscape Restoration Project' },
            { lat: 27.7172, lng: 85.3240, name: 'Kathmandu, Nepal', category: 'project', description: 'Community Forestry Research' },
            { lat: 0.3476, lng: 32.5825, name: 'Kampala, Uganda', category: 'project', description: 'Ongo Community Forest Research' },
            
            // CONFERENCE & SPEAKING LOCATIONS
            { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy', category: 'conference', description: 'FAO - World Forest Week 2014, Committee of Forestry' },
            { lat: -29.8587, lng: 31.0218, name: 'Durban, South Africa', category: 'conference', description: 'XIV World Forestry Congress 2015 - Keynote' },
            { lat: 50.7374, lng: 7.0982, name: 'Bonn, Germany', category: 'conference', description: 'GLF Bonn 2020 - Opening Plenary Keynote' },
            { lat: 60.1699, lng: 24.9384, name: 'Rovaniemi, Finland', category: 'conference', description: 'ECE Committee on Forests, European Forest Week 2013' },
            { lat: 40.7608, lng: -111.8910, name: 'Salt Lake City, Utah, USA', category: 'conference', description: 'XXIV IUFRO World Congress - Technical Session' },
            { lat: 52.2297, lng: 21.0122, name: 'Warsaw, Poland', category: 'conference', description: '1st IUFRO Task Force Education Learning Initiative 2012' },
            { lat: 41.1828, lng: 41.8183, name: 'Artvin, Turkey', category: 'conference', description: '2nd IUFRO Task Force Education Learning Initiative 2013' },
            
            // ORGANIZATION HEADQUARTERS / WORK LOCATIONS
            { lat: 50.0755, lng: 14.4378, name: 'Prague, Czech Republic', category: 'organization', description: 'YPARD Regional Office - Europe' },
            { lat: 5.6037, lng: -0.1870, name: 'Accra, Ghana', category: 'organization', description: 'YPARD Regional Office - Africa' },
            { lat: 39.9042, lng: 116.4074, name: 'Beijing, China', category: 'organization', description: 'YPARD Regional Office - Asia-Pacific' },
            { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany', category: 'organization', description: 'CIFOR-ICRAF / Global Landscapes Forum' },
            
            // MEDIA & INTERVIEW LOCATIONS
            { lat: 41.3851, lng: 2.1734, name: 'Barcelona, Spain', category: 'media', description: 'Barcelona School of Management - Climate Justice Interview' },
            { lat: 49.2827, lng: -123.1207, name: 'Vancouver, Canada', category: 'media', description: 'UBC - Forestry as a Space for Black People Webinar' },
        ];

        // Color scheme for different categories
        const categoryColors = {
            'current': { color: '#EF4444', icon: 'fa-home', label: 'Current Location' },
            'education': { color: '#3B82F6', icon: 'fa-graduation-cap', label: 'Education' },
            'project': { color: '#10b981', icon: 'fa-tree', label: 'Projects' },
            'conference': { color: '#F59E0B', icon: 'fa-microphone', label: 'Conferences & Speaking' },
            'organization': { color: '#8B5CF6', icon: 'fa-building', label: 'Organization Offices' },
            'media': { color: '#EC4899', icon: 'fa-video', label: 'Media & Interviews' }
        };

        // Create custom icons for each category
        const createCustomIcon = (category) => {
            const config = categoryColors[category] || categoryColors['project'];
            return L.divIcon({
                className: `custom-map-marker marker-${category}`,
                html: `<div style="
                    width: 20px;
                    height: 20px;
                    background: ${config.color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse-marker 2s infinite;
                "><i class="fas ${config.icon}" style="font-size: 10px; color: white;"></i></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
        };

        // Group locations by category for legend
        const locationsByCategory = {};
        Object.keys(categoryColors).forEach(cat => {
            locationsByCategory[cat] = allLocations.filter(loc => loc.category === cat);
        });

        // Store markers by category for filtering
        const markersByCategory = {};
        Object.keys(categoryColors).forEach(cat => {
            markersByCategory[cat] = [];
        });

        // Add markers for each location
        allLocations.forEach(location => {
            const config = categoryColors[location.category];
            const marker = L.marker([location.lat, location.lng], {
                icon: createCustomIcon(location.category)
            }).addTo(map);

            marker.bindPopup(`
                <div style="text-align: left; padding: 8px; min-width: 200px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas ${config.icon}" style="color: ${config.color}; font-size: 16px;"></i>
                        <strong style="color: #1B4332; font-size: 1rem;">${location.name}</strong>
                    </div>
                    <div style="color: #52796F; font-size: 0.85rem; padding-top: 5px; border-top: 1px solid #E8F3ED;">
                        ${location.description}
                    </div>
                </div>
            `);
            
            // Store marker reference by category
            markersByCategory[location.category].push(marker);
        });

        // Add CSS animation for pulsing markers
        if (!document.getElementById('map-marker-styles')) {
            const style = document.createElement('style');
            style.id = 'map-marker-styles';
            style.textContent = `
                @keyframes pulse-marker {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.8;
                    }
                }
                .custom-map-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .marker-current {
                    z-index: 1000;
                }
            `;
            document.head.appendChild(style);
        }

        // Fit map to show all markers
        if (allLocations.length > 0) {
            const group = new L.featureGroup(allLocations.map(loc => L.marker([loc.lat, loc.lng])));
            map.fitBounds(group.getBounds().pad(0.15));
        }
        
        // Initialize legend filtering
        initLegendFiltering(map, markersByCategory);
        
        // Force map to invalidate size after a short delay to ensure proper rendering
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        // Show fallback message
        mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #B7E4C7; font-size: 1.1rem;">Map loading...</div>';
    }
}

// Initialize filtering for static legend items
function initLegendFiltering(map, markersByCategory) {
    const legendItems = document.querySelectorAll('.legend-item');
    
    legendItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'opacity 0.2s';
        
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Hide markers for this category
                this.classList.remove('active');
                this.style.opacity = '0.5';
                markersByCategory[category].forEach(marker => {
                    map.removeLayer(marker);
                });
            } else {
                // Show markers for this category
                this.classList.add('active');
                this.style.opacity = '1';
                markersByCategory[category].forEach(marker => {
                    marker.addTo(map);
                });
            }
        });
        
        // Hover effects
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.opacity = '0.7';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.opacity = '0.5';
            } else {
                this.style.opacity = '1';
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorldMap);
} else {
    // DOM is already ready
    initWorldMap();
}

