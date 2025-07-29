// Map functionality for Raaha platform

class MapManager {
    constructor() {
        this.mapElement = null;
        this.markers = new Map();
        this.routeLine = null;
        this.driverLocation = null;
        this.userLocation = null;
        this.isTracking = false;
        this.simulatedDriverMovement = null;
        
        this.init();
    }
    
    init() {
        this.setupMapContainer();
        this.setupMapControls();
        this.initializeDefaultLocations();
        this.startLocationSimulation();
    }
    
    setupMapContainer() {
        this.mapElement = document.getElementById('mapView');
        if (!this.mapElement) return;
        
        // Add map interaction handlers
        this.mapElement.addEventListener('click', (e) => this.handleMapClick(e));
        this.mapElement.addEventListener('touchstart', (e) => this.handleMapTouch(e));
        
        // Setup drag functionality for markers
        this.setupMarkerDragging();
    }
    
    setupMapControls() {
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const myLocationBtn = document.querySelector('.my-location');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }
        
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', () => this.centerOnUserLocation());
        }
    }
    
    initializeDefaultLocations() {
        // Set default pickup and destination locations
        this.setPickupLocation({
            lat: 25.2048,
            lng: 55.2708,
            address: 'Dubai Mall, Dubai'
        });
        
        this.setDestinationLocation({
            lat: 25.1972,
            lng: 55.2744,
            address: 'Burj Khalifa, Dubai'
        });
        
        // Set initial driver location (near pickup)
        this.updateDriverLocation({
            lat: 25.2010,
            lng: 55.2650,
            bearing: 45
        });
    }
    
    setPickupLocation(location) {
        this.userLocation = location;
        this.updateLocationPin('pickup', location);
        this.updateRouteDisplay();
    }
    
    setDestinationLocation(location) {
        this.updateLocationPin('destination', location);
        this.updateRouteDisplay();
    }
    
    updateLocationPin(type, location) {
        const pinElement = document.querySelector(`.${type}-pin`);
        if (!pinElement) return;
        
        // Calculate position on map (mock calculation)
        const mapRect = this.mapElement.getBoundingClientRect();
        const x = this.lngToPixel(location.lng, mapRect.width);
        const y = this.latToPixel(location.lat, mapRect.height);
        
        pinElement.style.left = `${x}%`;
        pinElement.style.top = `${y}%`;
        
        // Update label if address is provided
        const label = pinElement.querySelector('.pin-label');
        if (label && location.address) {
            label.textContent = this.truncateAddress(location.address);
        }
        
        // Add bounce animation
        pinElement.style.animation = 'pinBounce 0.6s ease-out';
        setTimeout(() => {
            pinElement.style.animation = '';
        }, 600);
    }
    
    updateDriverLocation(location) {
        this.driverLocation = location;
        const driverCar = document.getElementById('driverCar');
        if (!driverCar) return;
        
        const mapRect = this.mapElement.getBoundingClientRect();
        const x = this.lngToPixel(location.lng, mapRect.width);
        const y = this.latToPixel(location.lat, mapRect.height);
        
        driverCar.style.left = `${x}%`;
        driverCar.style.top = `${y}%`;
        
        // Rotate car based on bearing
        if (location.bearing !== undefined) {
            driverCar.style.transform = `translate(-50%, -50%) rotate(${location.bearing}deg)`;
        }
        
        // Update ETA based on distance to pickup
        if (this.userLocation) {
            const distance = this.calculateDistance(location, this.userLocation);
            const eta = this.calculateETA(distance);
            this.updateETA(eta);
        }
    }
    
    updateRouteDisplay() {
        const routeLine = document.querySelector('.route-line');
        if (!routeLine || !this.userLocation) return;
        
        const pickupPin = document.querySelector('.pickup-pin');
        const destinationPin = document.querySelector('.destination-pin');
        
        if (pickupPin && destinationPin) {
            const pickupRect = pickupPin.getBoundingClientRect();
            const destinationRect = destinationPin.getBoundingClientRect();
            const mapRect = this.mapElement.getBoundingClientRect();
            
            const startX = ((pickupRect.left - mapRect.left) / mapRect.width) * 100;
            const startY = ((pickupRect.top - mapRect.top) / mapRect.height) * 100;
            const endX = ((destinationRect.left - mapRect.left) / mapRect.width) * 100;
            const endY = ((destinationRect.top - mapRect.top) / mapRect.height) * 100;
            
            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
            
            routeLine.style.left = `${startX}%`;
            routeLine.style.top = `${startY}%`;
            routeLine.style.width = `${length}%`;
            routeLine.style.transform = `rotate(${angle}deg)`;
            routeLine.style.transformOrigin = '0 50%';
        }
    }
    
    // Mock coordinate conversion functions
    lngToPixel(lng, mapWidth) {
        // Dubai area longitude range: approximately 54.8 to 55.8
        const minLng = 54.8;
        const maxLng = 55.8;
        return ((lng - minLng) / (maxLng - minLng)) * 100;
    }
    
    latToPixel(lat, mapHeight) {
        // Dubai area latitude range: approximately 24.8 to 25.4
        const minLat = 24.8;
        const maxLat = 25.4;
        return (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    }
    
    calculateDistance(location1, location2) {
        // Simplified distance calculation (in km)
        const latDiff = location2.lat - location1.lat;
        const lngDiff = location2.lng - location1.lng;
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough conversion to km
    }
    
    calculateETA(distance) {
        // Simple ETA calculation based on average speed in Dubai (30 km/h in traffic)
        const averageSpeed = 30;
        return Math.ceil((distance / averageSpeed) * 60); // Convert to minutes
    }
    
    updateETA(minutes) {
        const etaElements = document.querySelectorAll('.eta-time');
        etaElements.forEach(element => {
            element.textContent = `${minutes} min`;
        });
    }
    
    startLocationSimulation() {
        // Simulate driver movement towards pickup location
        if (this.simulatedDriverMovement) {
            clearInterval(this.simulatedDriverMovement);
        }
        
        this.simulatedDriverMovement = setInterval(() => {
            if (!this.isTracking || !this.driverLocation || !this.userLocation) return;
            
            // Move driver slightly towards pickup location
            const latDiff = this.userLocation.lat - this.driverLocation.lat;
            const lngDiff = this.userLocation.lng - this.driverLocation.lng;
            
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
            if (distance > 0.001) { // If not at pickup location
                const step = 0.0005; // Movement step
                const ratio = step / distance;
                
                this.driverLocation.lat += latDiff * ratio;
                this.driverLocation.lng += lngDiff * ratio;
                
                // Calculate bearing for car rotation
                this.driverLocation.bearing = Math.atan2(lngDiff, latDiff) * (180 / Math.PI);
                
                this.updateDriverLocation(this.driverLocation);
            }
        }, 3000); // Update every 3 seconds
    }
    
    startRideTracking() {
        this.isTracking = true;
        this.startLocationSimulation();
        
        // Show tracking UI
        const trackingSection = document.getElementById('trackingSection');
        if (trackingSection) {
            trackingSection.classList.add('active');
        }
    }
    
    stopRideTracking() {
        this.isTracking = false;
        
        if (this.simulatedDriverMovement) {
            clearInterval(this.simulatedDriverMovement);
            this.simulatedDriverMovement = null;
        }
        
        // Hide tracking UI
        const trackingSection = document.getElementById('trackingSection');
        if (trackingSection) {
            trackingSection.classList.remove('active');
        }
    }
    
    zoomIn() {
        const mapBg = document.querySelector('.map-bg');
        if (mapBg) {
            const currentScale = this.getCurrentScale(mapBg);
            const newScale = Math.min(currentScale * 1.2, 3);
            mapBg.style.transform = `scale(${newScale})`;
            
            this.showNotification('Zoomed in', 'info');
        }
    }
    
    zoomOut() {
        const mapBg = document.querySelector('.map-bg');
        if (mapBg) {
            const currentScale = this.getCurrentScale(mapBg);
            const newScale = Math.max(currentScale / 1.2, 0.5);
            mapBg.style.transform = `scale(${newScale})`;
            
            this.showNotification('Zoomed out', 'info');
        }
    }
    
    getCurrentScale(element) {
        const transform = window.getComputedStyle(element).transform;
        if (transform === 'none') return 1;
        
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(',').map(parseFloat);
            return values[0]; // Scale X
        }
        return 1;
    }
    
    centerOnUserLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: 'Current Location'
                    };
                    
                    this.setPickupLocation(location);
                    this.showNotification('Centered on your location', 'success');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showNotification('Unable to get your location', 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            this.showNotification('Geolocation not supported', 'error');
        }
    }
    
    handleMapClick(event) {
        const rect = this.mapElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        
        // Convert pixel coordinates back to lat/lng (mock conversion)
        const lng = 54.8 + (x / 100) * (55.8 - 54.8);
        const lat = 25.4 - (y / 100) * (25.4 - 24.8);
        
        console.log('Map clicked at:', { lat, lng, x: x + '%', y: y + '%' });
        
        // You could implement click-to-set-location functionality here
    }
    
    handleMapTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.handleMapClick(touch);
    }
    
    setupMarkerDragging() {
        const markers = document.querySelectorAll('.location-pin');
        
        markers.forEach(marker => {
            let isDragging = false;
            let startX, startY;
            
            marker.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX - marker.offsetLeft;
                startY = e.clientY - marker.offsetTop;
                marker.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const rect = this.mapElement.getBoundingClientRect();
                const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                
                marker.style.left = x + '%';
                marker.style.top = y + '%';
                
                this.updateRouteDisplay();
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    marker.style.cursor = 'grab';
                }
            });
        });
    }
    
    truncateAddress(address, maxLength = 20) {
        if (address.length <= maxLength) return address;
        return address.substring(0, maxLength - 3) + '...';
    }
    
    // Geocoding simulation for UAE locations
    async geocodeAddress(address) {
        // This is a mock geocoding function
        // In a real app, you'd use Google Maps Geocoding API or similar
        
        const uaeLocations = {
            'dubai mall': { lat: 25.1972, lng: 55.2796 },
            'burj khalifa': { lat: 25.1972, lng: 55.2744 },
            'palm jumeirah': { lat: 25.1124, lng: 55.1390 },
            'dubai marina': { lat: 25.0800, lng: 55.1400 },
            'dubai airport': { lat: 25.2532, lng: 55.3657 },
            'abu dhabi mall': { lat: 24.4539, lng: 54.3773 },
            'sheikh zayed mosque': { lat: 24.4129, lng: 54.4753 },
            'yas island': { lat: 24.4845, lng: 54.6037 }
        };
        
        const searchKey = address.toLowerCase();
        for (const [key, location] of Object.entries(uaeLocations)) {
            if (searchKey.includes(key)) {
                return { ...location, address };
            }
        }
        
        // Return default Dubai location if not found
        return { lat: 25.2048, lng: 55.2708, address };
    }
    
    showNotification(message, type) {
        // Use the global notification system
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Cleanup method
    destroy() {
        if (this.simulatedDriverMovement) {
            clearInterval(this.simulatedDriverMovement);
        }
    }
}

// Initialize map manager
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager();
});

// Add custom CSS for map animations
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    @keyframes pinBounce {
        0% { transform: translate(-50%, -100%) scale(0.8); }
        50% { transform: translate(-50%, -100%) scale(1.2); }
        100% { transform: translate(-50%, -100%) scale(1); }
    }
    
    .location-pin {
        cursor: grab;
        transition: transform 0.2s ease;
    }
    
    .location-pin:hover {
        transform: translate(-50%, -100%) scale(1.1);
    }
    
    .location-pin:active {
        cursor: grabbing;
    }
    
    .map-bg {
        transition: transform 0.3s ease;
    }
    
    .driver-car {
        transition: all 0.5s ease;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    
    .route-line {
        transition: all 0.3s ease;
        background: linear-gradient(90deg, 
            var(--primary-green) 0%, 
            var(--accent-gold) 50%, 
            var(--primary-red) 100%);
        opacity: 0.8;
    }
`;

document.head.appendChild(mapStyles);