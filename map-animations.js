// Advanced Map Animations for Raaha Platform

class MapAnimationController {
    constructor() {
        this.activeAnimations = new Map();
        this.animationQueue = [];
        this.isProcessingQueue = false;
        
        // Animation configurations
        this.animationConfigs = {
            markerDrop: {
                duration: 800,
                easing: 'easeOutBounce'
            },
            routeDrawing: {
                duration: 2000,
                easing: 'easeInOutCubic'
            },
            carMovement: {
                duration: 1000,
                easing: 'easeInOutQuad'
            },
            zoomTransition: {
                duration: 1500,
                easing: 'easeInOutCubic'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupAnimationStyles();
        this.bindEventListeners();
    }
    
    setupAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes markerBounce {
                0% { transform: translateY(-100px) scale(0); opacity: 0; }
                60% { transform: translateY(0) scale(1.2); opacity: 1; }
                80% { transform: translateY(-10px) scale(0.9); }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            
            @keyframes routePulse {
                0%, 100% { stroke-width: 4; opacity: 0.8; }
                50% { stroke-width: 6; opacity: 1; }
            }
            
            @keyframes carGlow {
                0%, 100% { filter: drop-shadow(0 0 5px rgba(45, 80, 22, 0.5)); }
                50% { filter: drop-shadow(0 0 15px rgba(45, 80, 22, 0.8)); }
            }
            
            @keyframes slideInFromTop {
                0% { transform: translateY(-100%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes slideInFromBottom {
                0% { transform: translateY(100%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes fadeInScale {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes pulseUpdate {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); background-color: rgba(45, 80, 22, 0.1); }
                100% { transform: scale(1); }
            }
            
            .marker-animate-drop {
                animation: markerBounce 0.8s ease-out;
            }
            
            .route-animate-pulse {
                animation: routePulse 2s infinite;
            }
            
            .car-animate-glow {
                animation: carGlow 3s infinite;
            }
            
            .slide-in-top {
                animation: slideInFromTop 0.5s ease-out;
            }
            
            .slide-in-bottom {
                animation: slideInFromBottom 0.5s ease-out;
            }
            
            .fade-in-scale {
                animation: fadeInScale 0.4s ease-out;
            }
            
            .pulse-update {
                animation: pulseUpdate 0.5s ease-out;
            }
            
            .map-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                transition: opacity 0.3s ease;
            }
            
            .map-loading-spinner {
                text-align: center;
            }
            
            .spinner-ring {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #2D5016;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                color: #2D5016;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animate marker drop with bounce effect
    animateMarkerDrop(marker, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (marker && marker.setAnimation) {
                    marker.setAnimation(google.maps.Animation.DROP);
                    
                    // Add custom bounce animation to marker element
                    const markerElement = this.getMarkerElement(marker);
                    if (markerElement) {
                        markerElement.classList.add('marker-animate-drop');
                        
                        setTimeout(() => {
                            markerElement.classList.remove('marker-animate-drop');
                            resolve();
                        }, this.animationConfigs.markerDrop.duration);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            }, delay);
        });
    }
    
    // Animate route drawing with progressive reveal
    animateRouteDrawing(directionsRenderer, route) {
        return new Promise((resolve) => {
            if (!route || !route.routes || !route.routes[0]) {
                resolve();
                return;
            }
            
            const path = route.routes[0].overview_path;
            const totalPoints = path.length;
            let currentPoint = 0;
            
            const drawSegment = () => {
                if (currentPoint >= totalPoints) {
                    // Animation complete
                    directionsRenderer.setDirections(route);
                    this.addRoutePulseEffect();
                    resolve();
                    return;
                }
                
                // Draw partial route
                const partialPath = path.slice(0, currentPoint + 1);
                const partialRoute = {
                    ...route,
                    routes: [{
                        ...route.routes[0],
                        overview_path: partialPath
                    }]
                };
                
                // Update renderer with partial route
                directionsRenderer.setDirections(partialRoute);
                
                currentPoint += Math.max(1, Math.floor(totalPoints / 50)); // Smooth progression
                
                setTimeout(drawSegment, 40); // 40ms between updates for smooth animation
            };
            
            drawSegment();
        });
    }
    
    // Add pulsing effect to route
    addRoutePulseEffect() {
        // This would require custom polyline styling in a real implementation
        console.log('Adding route pulse effect');
    }
    
    // Animate car movement along route
    animateCarMovement(marker, fromPosition, toPosition, bearing = 0) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const duration = this.animationConfigs.carMovement.duration;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply easing
                const easedProgress = this.easeInOutQuad(progress);
                
                // Calculate intermediate position
                const lat = fromPosition.lat + (toPosition.lat - fromPosition.lat) * easedProgress;
                const lng = fromPosition.lng + (toPosition.lng - fromPosition.lng) * easedProgress;
                
                // Update marker position
                marker.setPosition({ lat, lng });
                
                // Rotate marker based on bearing (if supported)
                this.rotateMarker(marker, bearing);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    // Animate map zoom with smooth transition
    animateMapZoom(map, targetZoom, targetCenter = null) {
        return new Promise((resolve) => {
            const startZoom = map.getZoom();
            const startCenter = map.getCenter();
            const startTime = Date.now();
            const duration = this.animationConfigs.zoomTransition.duration;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply easing
                const easedProgress = this.easeInOutCubic(progress);
                
                // Calculate intermediate zoom
                const currentZoom = startZoom + (targetZoom - startZoom) * easedProgress;
                map.setZoom(currentZoom);
                
                // Calculate intermediate center if target center is provided
                if (targetCenter) {
                    const currentLat = startCenter.lat() + (targetCenter.lat - startCenter.lat()) * easedProgress;
                    const currentLng = startCenter.lng() + (targetCenter.lng - startCenter.lng()) * easedProgress;
                    map.setCenter({ lat: currentLat, lng: currentLng });
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    // Animate UI element entrance
    animateElementEntrance(element, animationType = 'fadeInScale', delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (element) {
                    element.classList.add(animationType);
                    
                    // Remove animation class after completion
                    const animationDuration = this.getAnimationDuration(animationType);
                    setTimeout(() => {
                        element.classList.remove(animationType);
                        resolve();
                    }, animationDuration);
                } else {
                    resolve();
                }
            }, delay);
        });
    }
    
    // Animate multiple elements in sequence
    animateSequence(animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => {
                return this.executeAnimation(animation);
            });
        }, Promise.resolve());
    }
    
    // Animate multiple elements in parallel
    animateParallel(animations) {
        const promises = animations.map(animation => this.executeAnimation(animation));
        return Promise.all(promises);
    }
    
    // Execute individual animation
    executeAnimation(animation) {
        const { type, target, options = {} } = animation;
        
        switch (type) {
            case 'markerDrop':
                return this.animateMarkerDrop(target, options.delay);
            case 'routeDrawing':
                return this.animateRouteDrawing(target, options.route);
            case 'carMovement':
                return this.animateCarMovement(target, options.from, options.to, options.bearing);
            case 'mapZoom':
                return this.animateMapZoom(target, options.zoom, options.center);
            case 'elementEntrance':
                return this.animateElementEntrance(target, options.animationType, options.delay);
            default:
                return Promise.resolve();
        }
    }
    
    // Booking animation sequence
    animateBookingSequence(mapManager) {
        const animations = [
            {
                type: 'elementEntrance',
                target: document.getElementById('rideInfoCard'),
                options: { animationType: 'slide-in-top', delay: 0 }
            },
            {
                type: 'markerDrop',
                target: mapManager.pickupMarker,
                options: { delay: 200 }
            },
            {
                type: 'markerDrop',
                target: mapManager.destinationMarker,
                options: { delay: 400 }
            },
            {
                type: 'routeDrawing',
                target: mapManager.directionsRenderer,
                options: { route: mapManager.currentRoute, delay: 600 }
            },
            {
                type: 'markerDrop',
                target: mapManager.driverMarker,
                options: { delay: 1000 }
            }
        ];
        
        return this.animateSequence(animations);
    }
    
    // Ride completion animation
    animateRideCompletion() {
        const completionElements = [
            document.getElementById('etaDisplay'),
            document.getElementById('distanceRemaining'),
            document.querySelector('.driver-status')
        ];
        
        const animations = completionElements.map((element, index) => ({
            type: 'elementEntrance',
            target: element,
            options: { animationType: 'pulse-update', delay: index * 200 }
        }));
        
        return this.animateParallel(animations);
    }
    
    // Utility methods
    getMarkerElement(marker) {
        // In a real implementation, you'd need to access the DOM element of the marker
        // This is a simplified version
        return null;
    }
    
    rotateMarker(marker, bearing) {
        // Google Maps doesn't support marker rotation directly
        // In a real implementation, you'd use custom overlays or SVG markers
        console.log(`Rotating marker to bearing: ${bearing}`);
    }
    
    getAnimationDuration(animationType) {
        const durations = {
            'fadeInScale': 400,
            'slide-in-top': 500,
            'slide-in-bottom': 500,
            'pulse-update': 500,
            'marker-animate-drop': 800
        };
        
        return durations[animationType] || 500;
    }
    
    // Easing functions
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
    
    // Event listeners
    bindEventListeners() {
        // Listen for ride booking events
        document.addEventListener('rideBooked', (event) => {
            if (window.enhancedMapManager) {
                this.animateBookingSequence(window.enhancedMapManager);
            }
        });
        
        // Listen for ride completion events
        document.addEventListener('rideCompleted', () => {
            this.animateRideCompletion();
        });
        
        // Listen for driver location updates
        document.addEventListener('driverLocationUpdate', (event) => {
            const { location } = event.detail;
            if (window.enhancedMapManager && window.enhancedMapManager.driverMarker) {
                // Animate car movement to new position
                const currentPosition = window.enhancedMapManager.driverMarker.getPosition();
                if (currentPosition) {
                    this.animateCarMovement(
                        window.enhancedMapManager.driverMarker,
                        { lat: currentPosition.lat(), lng: currentPosition.lng() },
                        { lat: location.lat, lng: location.lng },
                        location.bearing || 0
                    );
                }
            }
        });
    }
    
    // Public API
    startLoadingAnimation() {
        const overlay = document.getElementById('mapLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }
    
    stopLoadingAnimation() {
        const overlay = document.getElementById('mapLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
    
    // Cleanup
    destroy() {
        this.activeAnimations.clear();
        this.animationQueue = [];
    }
}

// Initialize animation controller
document.addEventListener('DOMContentLoaded', () => {
    window.mapAnimationController = new MapAnimationController();
});