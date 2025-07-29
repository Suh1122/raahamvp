// Enhanced Google Maps Integration for Raaha Platform

class EnhancedMapManager {
    constructor() {
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.pickupMarker = null;
        this.destinationMarker = null;
        this.driverMarker = null;
        this.trafficLayer = null;
        
        // Route and tracking data
        this.currentRoute = null;
        this.driverPosition = null;
        this.routeProgress = 0;
        this.isTrackingActive = false;
        
        // Animation properties
        this.animationFrame = null;
        this.lastUpdateTime = 0;
        this.smoothingFactor = 0.1;
        
        // Default locations (Dubai area)
        this.defaultPickup = { lat: 25.2048, lng: 55.2708 }; // Dubai Mall
        this.defaultDestination = { lat: 25.1972, lng: 55.2744 }; // Burj Khalifa
        this.currentDriverLocation = { lat: 25.2010, lng: 55.2650 }; // Near pickup
        
        this.init();
    }
    
    init() {
        // Wait for Google Maps API to load
        if (typeof google === 'undefined') {
            console.log('Waiting for Google Maps API...');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.initializeMap();
        this.setupEventListeners();
        this.hideLoadingOverlay();
    }
    
    initializeMap() {
        const mapOptions = {
            zoom: 13,
            center: this.defaultPickup,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.getMapStyles(),
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            clickableIcons: false
        };
        
        this.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        
        // Initialize services
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#2D5016',
                strokeWeight: 4,
                strokeOpacity: 0.8
            }
        });
        this.directionsRenderer.setMap(this.map);
        
        // Initialize traffic layer
        this.trafficLayer = new google.maps.TrafficLayer();
        
        // Create custom markers
        this.createCustomMarkers();
        
        // Calculate and display initial route
        this.calculateRoute();
        
        // Start real-time tracking simulation
        this.startRealTimeTracking();
    }
    
    getMapStyles() {
        return [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#E8F5E8' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#F8F9FA' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#FFFFFF' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#FFFFFF' }]
            }
        ];
    }
    
    createCustomMarkers() {
        // Pickup marker
        this.pickupMarker = new google.maps.Marker({
            position: this.defaultPickup,
            map: this.map,
            icon: {
                url: this.createMarkerIcon('pickup'),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            },
            title: 'Pickup Location',
            animation: google.maps.Animation.DROP
        });
        
        // Destination marker
        this.destinationMarker = new google.maps.Marker({
            position: this.defaultDestination,
            map: this.map,
            icon: {
                url: this.createMarkerIcon('destination'),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            },
            title: 'Destination',
            animation: google.maps.Animation.DROP
        });
        
        // Driver marker (3D car)
        this.driverMarker = new google.maps.Marker({
            position: this.currentDriverLocation,
            map: this.map,
            icon: {
                url: this.createCarIcon(),
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15)
            },
            title: 'Your Driver',
            zIndex: 1000
        });
    }
    
    createMarkerIcon(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        // Draw marker background
        ctx.fillStyle = type === 'pickup' ? '#2D5016' : '#8B0000';
        ctx.beginPath();
        ctx.arc(20, 15, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw marker point
        ctx.beginPath();
        ctx.moveTo(20, 27);
        ctx.lineTo(15, 40);
        ctx.lineTo(25, 40);
        ctx.closePath();
        ctx.fill();
        
        // Draw icon
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(type === 'pickup' ? '📍' : '🎯', 20, 20);
        
        return canvas.toDataURL();
    }
    
    createCarIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        
        // Draw car shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(2, 17, 26, 8);
        
        // Draw car body
        ctx.fillStyle = '#2D5016';
        ctx.fillRect(5, 8, 20, 12);
        ctx.fillRect(8, 5, 14, 8);
        
        // Draw windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(9, 6, 5, 6);
        ctx.fillRect(16, 6, 5, 6);
        
        // Draw wheels
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(10, 20, 3, 0, 2 * Math.PI);
        ctx.arc(20, 20, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        return canvas.toDataURL();
    }
    
    calculateRoute() {
        const request = {
            origin: this.defaultPickup,
            destination: this.defaultDestination,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false,
            optimizeWaypoints: true
        };
        
        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.currentRoute = result;
                this.directionsRenderer.setDirections(result);
                this.updateRouteInfo(result);
                this.fitMapToRoute();
            } else {
                console.error('Directions request failed:', status);
                this.showError('Unable to calculate route. Please try again.');
            }
        });
    }
    
    updateRouteInfo(route) {
        const leg = route.routes[0].legs[0];
        const distance = leg.distance.text;
        const duration = leg.duration.text;
        
        // Update UI elements
        this.updateElement('routeDistance', distance);
        this.updateElement('routeDuration', duration);
        this.updateElement('etaDisplay', duration.split(' ')[0]);
        
        // Update fare breakdown if available
        if (window.app) {
            const distanceValue = parseFloat(leg.distance.text);
            window.app.updatePricingFromDistance(distanceValue);
        }
    }
    
    fitMapToRoute() {
        if (this.currentRoute) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(this.defaultPickup);
            bounds.extend(this.defaultDestination);
            bounds.extend(this.currentDriverLocation);
            
            this.map.fitBounds(bounds, { padding: 50 });
        }
    }
    
    startRealTimeTracking() {
        this.isTrackingActive = true;
        this.simulateDriverMovement();
    }
    
    simulateDriverMovement() {
        if (!this.isTrackingActive || !this.currentRoute) return;
        
        const route = this.currentRoute.routes[0];
        const path = route.overview_path;
        
        if (this.routeProgress >= path.length - 1) {
            this.routeProgress = 0; // Reset for demo
        }
        
        // Calculate smooth movement
        const currentPoint = path[Math.floor(this.routeProgress)];
        const nextPoint = path[Math.floor(this.routeProgress) + 1];
        
        if (currentPoint && nextPoint) {
            const progress = this.routeProgress - Math.floor(this.routeProgress);
            const lat = currentPoint.lat() + (nextPoint.lat() - currentPoint.lat()) * progress;
            const lng = currentPoint.lng() + (nextPoint.lng() - currentPoint.lng()) * progress;
            
            const newPosition = { lat, lng };
            this.updateDriverPosition(newPosition);
            
            // Calculate bearing for car rotation
            const bearing = this.calculateBearing(currentPoint, nextPoint);
            this.rotateDriverMarker(bearing);
            
            // Update progress
            this.routeProgress += 0.02; // Adjust speed as needed
            this.updateProgressUI();
        }
        
        // Continue animation
        setTimeout(() => this.simulateDriverMovement(), 100);
    }
    
    updateDriverPosition(position) {
        this.currentDriverLocation = position;
        
        if (this.driverMarker) {
            // Smooth animation
            this.animateMarkerTo(this.driverMarker, position);
        }
        
        // Update ETA based on remaining distance
        this.updateETA();
    }
    
    animateMarkerTo(marker, newPosition) {
        const startPosition = marker.getPosition();
        const startLat = startPosition.lat();
        const startLng = startPosition.lng();
        const endLat = newPosition.lat;
        const endLng = newPosition.lng;
        
        let progress = 0;
        const duration = 500; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            const lat = startLat + (endLat - startLat) * this.easeInOutCubic(progress);
            const lng = startLng + (endLng - startLng) * this.easeInOutCubic(progress);
            
            marker.setPosition({ lat, lng });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    calculateBearing(start, end) {
        const startLat = start.lat() * Math.PI / 180;
        const startLng = start.lng() * Math.PI / 180;
        const endLat = end.lat() * Math.PI / 180;
        const endLng = end.lng() * Math.PI / 180;
        
        const dLng = endLng - startLng;
        const y = Math.sin(dLng) * Math.cos(endLat);
        const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
        
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    
    rotateDriverMarker(bearing) {
        if (this.driverMarker) {
            const icon = this.driverMarker.getIcon();
            // Note: Google Maps doesn't support marker rotation directly
            // In a real implementation, you'd use a custom overlay or SVG marker
            console.log('Car bearing:', bearing);
        }
    }
    
    updateETA() {
        if (!this.currentRoute) return;
        
        const totalDistance = this.currentRoute.routes[0].legs[0].distance.value;
        const remainingProgress = 1 - (this.routeProgress / (this.currentRoute.routes[0].overview_path.length - 1));
        const remainingDistance = totalDistance * remainingProgress;
        
        // Calculate ETA (assuming average speed of 30 km/h in traffic)
        const averageSpeed = 30; // km/h
        const remainingTimeMinutes = Math.ceil((remainingDistance / 1000) / averageSpeed * 60);
        
        this.updateElement('etaDisplay', remainingTimeMinutes);
        this.updateElement('distanceRemaining', `${(remainingDistance / 1000).toFixed(1)} km remaining`);
    }
    
    updateProgressUI() {
        const progressPercentage = (this.routeProgress / (this.currentRoute?.routes[0]?.overview_path.length - 1 || 1)) * 100;
        const progressFill = document.getElementById('progressFillMini');
        if (progressFill) {
            progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        }
    }
    
    setupEventListeners() {
        // Zoom controls
        document.getElementById('zoomInBtn')?.addEventListener('click', () => {
            this.map.setZoom(this.map.getZoom() + 1);
        });
        
        document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
            this.map.setZoom(this.map.getZoom() - 1);
        });
        
        // Center map on route
        document.getElementById('centerMapBtn')?.addEventListener('click', () => {
            this.fitMapToRoute();
        });
        
        // Toggle traffic layer
        document.getElementById('trafficToggleBtn')?.addEventListener('click', () => {
            this.toggleTrafficLayer();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            google.maps.event.trigger(this.map, 'resize');
            this.fitMapToRoute();
        });
    }
    
    toggleTrafficLayer() {
        if (this.trafficLayer.getMap()) {
            this.trafficLayer.setMap(null);
            document.getElementById('trafficToggleBtn').classList.remove('active');
        } else {
            this.trafficLayer.setMap(this.map);
            document.getElementById('trafficToggleBtn').classList.add('active');
        }
    }
    
    // Public methods for external control
    setPickupLocation(location) {
        this.defaultPickup = location;
        if (this.pickupMarker) {
            this.pickupMarker.setPosition(location);
        }
        this.calculateRoute();
    }
    
    setDestinationLocation(location) {
        this.defaultDestination = location;
        if (this.destinationMarker) {
            this.destinationMarker.setPosition(location);
        }
        this.calculateRoute();
    }
    
    startRideTracking() {
        this.isTrackingActive = true;
        document.getElementById('rideInfoCard')?.classList.add('active');
        this.startRealTimeTracking();
    }
    
    stopRideTracking() {
        this.isTrackingActive = false;
        document.getElementById('rideInfoCard')?.classList.remove('active');
    }
    
    hideLoadingOverlay() {
        const overlay = document.getElementById('mapLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
    
    showError(message) {
        console.error('Map Error:', message);
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, 'error');
        }
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Cleanup
    destroy() {
        this.isTrackingActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Global callback for Google Maps API
function initMap() {
    window.enhancedMapManager = new EnhancedMapManager();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // If Google Maps is already loaded
    if (typeof google !== 'undefined') {
        initMap();
    }
});