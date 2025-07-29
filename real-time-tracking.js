// Real-time Tracking System for Raaha Platform

class RealTimeTracker {
    constructor() {
        this.isActive = false;
        this.trackingInterval = null;
        this.websocket = null;
        this.lastKnownPosition = null;
        this.trackingData = {
            rideId: null,
            driverId: null,
            estimatedArrival: null,
            currentSpeed: 0,
            distanceRemaining: 0
        };
        
        // Simulation data for demo
        this.simulationData = {
            waypoints: [],
            currentWaypointIndex: 0,
            speed: 30, // km/h
            lastUpdate: Date.now()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeWebSocket();
    }
    
    // WebSocket connection for real-time updates
    initializeWebSocket() {
        // In a real implementation, this would connect to your backend
        // For demo purposes, we'll simulate the connection
        console.log('Initializing WebSocket connection...');
        
        // Simulate WebSocket connection
        setTimeout(() => {
            this.simulateWebSocketConnection();
        }, 1000);
    }
    
    simulateWebSocketConnection() {
        console.log('WebSocket connected (simulated)');
        
        // Simulate receiving real-time updates
        this.trackingInterval = setInterval(() => {
            if (this.isActive) {
                this.simulateLocationUpdate();
            }
        }, 2000); // Update every 2 seconds
    }
    
    startTracking(rideData) {
        this.isActive = true;
        this.trackingData = { ...this.trackingData, ...rideData };
        
        console.log('Starting real-time tracking for ride:', this.trackingData.rideId);
        
        // Initialize tracking UI
        this.showTrackingInterface();
        
        // Start location updates
        this.requestLocationUpdates();
        
        // Notify map manager
        if (window.enhancedMapManager) {
            window.enhancedMapManager.startRideTracking();
        }
    }
    
    stopTracking() {
        this.isActive = false;
        
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
        
        console.log('Stopped real-time tracking');
        
        // Hide tracking UI
        this.hideTrackingInterface();
        
        // Notify map manager
        if (window.enhancedMapManager) {
            window.enhancedMapManager.stopRideTracking();
        }
    }
    
    requestLocationUpdates() {
        // In a real app, this would request location from the driver's device
        // For demo, we'll simulate movement along a route
        
        if (window.enhancedMapManager && window.enhancedMapManager.currentRoute) {
            const route = window.enhancedMapManager.currentRoute.routes[0];
            this.simulationData.waypoints = route.overview_path;
            this.simulationData.currentWaypointIndex = 0;
        }
    }
    
    simulateLocationUpdate() {
        if (!this.simulationData.waypoints.length) return;
        
        const waypoints = this.simulationData.waypoints;
        const currentIndex = this.simulationData.currentWaypointIndex;
        
        if (currentIndex >= waypoints.length - 1) {
            // Ride completed
            this.handleRideCompletion();
            return;
        }
        
        const currentWaypoint = waypoints[currentIndex];
        const nextWaypoint = waypoints[currentIndex + 1];
        
        // Calculate new position
        const newPosition = {
            lat: currentWaypoint.lat(),
            lng: currentWaypoint.lng(),
            timestamp: Date.now(),
            speed: this.simulationData.speed + (Math.random() - 0.5) * 10, // Add some variation
            bearing: this.calculateBearing(currentWaypoint, nextWaypoint)
        };
        
        // Update position
        this.updateDriverLocation(newPosition);
        
        // Move to next waypoint
        this.simulationData.currentWaypointIndex += 0.1; // Smooth movement
        
        // Update tracking data
        this.updateTrackingMetrics(newPosition);
    }
    
    updateDriverLocation(locationData) {
        this.lastKnownPosition = locationData;
        
        // Update map
        if (window.enhancedMapManager) {
            window.enhancedMapManager.updateDriverPosition({
                lat: locationData.lat,
                lng: locationData.lng
            });
        }
        
        // Update UI
        this.updateTrackingUI(locationData);
        
        // Broadcast update to other components
        this.broadcastLocationUpdate(locationData);
    }
    
    updateTrackingMetrics(locationData) {
        // Calculate distance remaining
        const remainingWaypoints = this.simulationData.waypoints.length - this.simulationData.currentWaypointIndex;
        const avgDistanceBetweenWaypoints = 0.1; // km (approximate)
        this.trackingData.distanceRemaining = remainingWaypoints * avgDistanceBetweenWaypoints;
        
        // Calculate ETA
        const timeRemaining = (this.trackingData.distanceRemaining / locationData.speed) * 60; // minutes
        this.trackingData.estimatedArrival = new Date(Date.now() + timeRemaining * 60000);
        
        // Update current speed
        this.trackingData.currentSpeed = locationData.speed;
    }
    
    updateTrackingUI(locationData) {
        // Update ETA display
        const etaMinutes = Math.ceil((this.trackingData.estimatedArrival - Date.now()) / 60000);
        this.updateElement('etaDisplay', `${Math.max(etaMinutes, 1)} min`);
        
        // Update distance remaining
        this.updateElement('distanceRemaining', 
            `${this.trackingData.distanceRemaining.toFixed(1)} km remaining`);
        
        // Update speed indicator (if exists)
        this.updateElement('currentSpeed', `${Math.round(locationData.speed)} km/h`);
        
        // Update driver status
        this.updateDriverStatus('en_route');
        
        // Animate progress indicators
        this.animateProgressUpdate();
    }
    
    updateDriverStatus(status) {
        const statusElement = document.querySelector('.driver-status');
        if (statusElement) {
            statusElement.className = `driver-status ${status}`;
            
            // Update status text based on current state
            const statusText = this.getStatusText(status);
            const statusTextElement = document.querySelector('.status-text');
            if (statusTextElement) {
                statusTextElement.textContent = statusText;
            }
        }
    }
    
    getStatusText(status) {
        const statusTexts = {
            'online': 'Online',
            'en_route': 'On the way',
            'arrived': 'Arrived',
            'in_trip': 'In trip',
            'completed': 'Trip completed'
        };
        
        return statusTexts[status] || 'Unknown';
    }
    
    animateProgressUpdate() {
        // Animate the progress bar
        const progressBar = document.getElementById('progressFillMini');
        if (progressBar) {
            const progress = (1 - (this.simulationData.currentWaypointIndex / this.simulationData.waypoints.length)) * 100;
            progressBar.style.width = `${Math.max(progress, 5)}%`;
        }
        
        // Add pulse animation to ETA display
        const etaDisplay = document.getElementById('etaDisplay');
        if (etaDisplay) {
            etaDisplay.classList.add('pulse-update');
            setTimeout(() => {
                etaDisplay.classList.remove('pulse-update');
            }, 500);
        }
    }
    
    showTrackingInterface() {
        const rideInfoCard = document.getElementById('rideInfoCard');
        if (rideInfoCard) {
            rideInfoCard.classList.add('active');
            rideInfoCard.style.animation = 'slideInFromTop 0.5s ease-out';
        }
        
        const routeSummary = document.getElementById('routeSummary');
        if (routeSummary) {
            routeSummary.classList.add('active');
        }
    }
    
    hideTrackingInterface() {
        const rideInfoCard = document.getElementById('rideInfoCard');
        if (rideInfoCard) {
            rideInfoCard.classList.remove('active');
        }
        
        const routeSummary = document.getElementById('routeSummary');
        if (routeSummary) {
            routeSummary.classList.remove('active');
        }
    }
    
    handleRideCompletion() {
        console.log('Ride completed!');
        
        // Update UI to show completion
        this.updateDriverStatus('completed');
        this.updateElement('etaDisplay', 'Arrived');
        this.updateElement('distanceRemaining', 'Destination reached');
        
        // Show completion notification
        if (window.app && window.app.showNotification) {
            window.app.showNotification('You have arrived at your destination!', 'success');
        }
        
        // Stop tracking after a delay
        setTimeout(() => {
            this.stopTracking();
        }, 3000);
    }
    
    broadcastLocationUpdate(locationData) {
        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('driverLocationUpdate', {
            detail: {
                location: locationData,
                trackingData: this.trackingData
            }
        });
        
        document.dispatchEvent(event);
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
    
    setupEventListeners() {
        // Listen for ride booking events
        document.addEventListener('rideBooked', (event) => {
            const rideData = event.detail;
            this.startTracking(rideData);
        });
        
        // Listen for ride cancellation
        document.addEventListener('rideCancelled', () => {
            this.stopTracking();
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Reduce update frequency when page is hidden
                if (this.trackingInterval) {
                    clearInterval(this.trackingInterval);
                    this.trackingInterval = setInterval(() => {
                        if (this.isActive) {
                            this.simulateLocationUpdate();
                        }
                    }, 5000); // Update every 5 seconds when hidden
                }
            } else {
                // Resume normal update frequency
                if (this.trackingInterval) {
                    clearInterval(this.trackingInterval);
                    this.trackingInterval = setInterval(() => {
                        if (this.isActive) {
                            this.simulateLocationUpdate();
                        }
                    }, 2000); // Back to 2 seconds
                }
            }
        });
    }
    
    // Utility methods
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Public API methods
    getCurrentLocation() {
        return this.lastKnownPosition;
    }
    
    getTrackingData() {
        return this.trackingData;
    }
    
    isTrackingActive() {
        return this.isActive;
    }
    
    // Cleanup
    destroy() {
        this.stopTracking();
        
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

// Initialize real-time tracker
document.addEventListener('DOMContentLoaded', () => {
    window.realTimeTracker = new RealTimeTracker();
});