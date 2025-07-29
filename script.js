// Main JavaScript functionality for Raaha Cab Booking Platform

class RaahaApp {
    constructor() {
        this.currentLanguage = 'en';
        this.selectedVehicle = 'economy';
        this.pickupLocation = '';
        this.destinationLocation = '';
        this.isBookingInProgress = false;
        this.isRideActive = false;
        
        // Sample UAE locations for autocomplete
        this.uaeLocations = [
            'Dubai Mall, Dubai',
            'Burj Khalifa, Dubai',
            'Dubai International Airport (DXB)',
            'Palm Jumeirah, Dubai',
            'Dubai Marina',
            'Downtown Dubai',
            'Business Bay, Dubai',
            'Dubai Creek',
            'Dubai Festival City',
            'Ibn Battuta Mall, Dubai',
            'Abu Dhabi Mall',
            'Sheikh Zayed Grand Mosque, Abu Dhabi',
            'Abu Dhabi International Airport (AUH)',
            'Yas Island, Abu Dhabi',
            'Corniche, Abu Dhabi',
            'Al Wahda Mall, Abu Dhabi',
            'Sharjah City Centre',
            'Sharjah International Airport (SHJ)',
            'Al Qasba, Sharjah',
            'Ajman City Centre',
            'RAK Mall, Ras Al Khaimah',
            'Fujairah Mall',
            'City Centre Ajman'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupVehicleSelection();
        this.setupLocationInputs();
        this.updatePricing();
        this.animateOnLoad();
    }
    
    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Mobile menu
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                }
            });
        }
        
        // Book now button
        const bookNowBtn = document.getElementById('bookNowBtn');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => this.handleBooking());
        }
        
        // Swap locations button
        const swapBtn = document.getElementById('swapBtn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapLocations());
        }
        
        // Quick action buttons
        this.setupQuickActions();
        
        // Map controls
        this.setupMapControls();
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            const suggestions = document.querySelectorAll('.location-suggestions');
            suggestions.forEach(suggestion => {
                if (!suggestion.parentElement.contains(e.target)) {
                    suggestion.classList.remove('show');
                }
            });
        });
    }
    
    setupVehicleSelection() {
        const vehicleOptions = document.querySelectorAll('.vehicle-option');
        vehicleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                vehicleOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to selected option
                option.classList.add('active');
                this.selectedVehicle = option.dataset.type;
                this.updatePricing();
            });
        });
    }
    
    setupLocationInputs() {
        const pickupInput = document.getElementById('pickupLocation');
        const destinationInput = document.getElementById('destinationLocation');
        
        if (pickupInput) {
            pickupInput.addEventListener('input', (e) => {
                this.pickupLocation = e.target.value;
                this.showLocationSuggestions(e.target, 'pickup');
                this.updatePricing();
            });
        }
        
        if (destinationInput) {
            destinationInput.addEventListener('input', (e) => {
                this.destinationLocation = e.target.value;
                this.showLocationSuggestions(e.target, 'destination');
                this.updatePricing();
            });
        }
    }
    
    showLocationSuggestions(input, type) {
        const query = input.value.toLowerCase();
        const suggestionsId = type === 'pickup' ? 'pickupSuggestions' : 'destinationSuggestions';
        let suggestions = document.getElementById(suggestionsId);
        
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = suggestionsId;
            suggestions.className = 'location-suggestions';
            input.parentElement.appendChild(suggestions);
        }
        
        if (query.length < 2) {
            suggestions.classList.remove('show');
            return;
        }
        
        const filteredLocations = this.uaeLocations.filter(location =>
            location.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (filteredLocations.length > 0) {
            suggestions.innerHTML = filteredLocations.map(location =>
                `<div class="suggestion-item" onclick="app.selectLocation('${location}', '${type}')">${location}</div>`
            ).join('');
            suggestions.classList.add('show');
        } else {
            suggestions.classList.remove('show');
        }
    }
    
    selectLocation(location, type) {
        const inputId = type === 'pickup' ? 'pickupLocation' : 'destinationLocation';
        const input = document.getElementById(inputId);
        if (input) {
            input.value = location;
            if (type === 'pickup') {
                this.pickupLocation = location;
            } else {
                this.destinationLocation = location;
            }
        }
        
        // Hide suggestions
        const suggestionsId = type === 'pickup' ? 'pickupSuggestions' : 'destinationSuggestions';
        const suggestions = document.getElementById(suggestionsId);
        if (suggestions) {
            suggestions.classList.remove('show');
        }
        
        this.updatePricing();
    }
    
    swapLocations() {
        const pickupInput = document.getElementById('pickupLocation');
        const destinationInput = document.getElementById('destinationLocation');
        
        if (pickupInput && destinationInput) {
            const temp = pickupInput.value;
            pickupInput.value = destinationInput.value;
            destinationInput.value = temp;
            
            const tempLocation = this.pickupLocation;
            this.pickupLocation = this.destinationLocation;
            this.destinationLocation = tempLocation;
            
            this.updatePricing();
            
            // Add animation
            const swapBtn = document.getElementById('swapBtn');
            if (swapBtn) {
                swapBtn.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    swapBtn.style.transform = 'rotate(0deg)';
                }, 300);
            }
        }
    }
    
    updatePricing() {
        if (!this.pickupLocation || !this.destinationLocation) {
            return;
        }
        
        // Calculate mock pricing based on vehicle type and distance
        const baseRates = {
            economy: 2.5,
            family: 3.0,
            business: 4.0
        };
        
        const baseFares = {
            economy: 10,
            family: 15,
            business: 20
        };
        
        // Mock distance calculation (in real app, use Google Maps API)
        const mockDistance = Math.random() * 15 + 5; // 5-20 km
        const mockETA = Math.ceil(mockDistance * 2 + Math.random() * 10); // Approximate ETA
        
        const baseFare = baseFares[this.selectedVehicle];
        const distanceFare = mockDistance * baseRates[this.selectedVehicle];
        const salikFare = mockDistance > 10 ? 4 : 0; // Toll charges for longer distances
        const subtotal = baseFare + distanceFare + salikFare;
        const vatAmount = subtotal * 0.05; // 5% VAT
        const total = subtotal + vatAmount;
        
        // Update DOM elements
        this.updateElement('baseFare', baseFare.toFixed(2));
        this.updateElement('tripDistance', mockDistance.toFixed(1));
        this.updateElement('tripETA', mockETA);
        this.updateElement('salikFare', salikFare.toFixed(2));
        this.updateElement('vatAmount', vatAmount.toFixed(2));
        this.updateElement('totalFare', total.toFixed(2));
        
        // Update vehicle prices in selection
        const vehicleOptions = document.querySelectorAll('.vehicle-option');
        vehicleOptions.forEach(option => {
            const type = option.dataset.type;
            const price = baseFares[type] + (mockDistance * baseRates[type]);
            const priceElement = option.querySelector('.price-value');
            if (priceElement) {
                priceElement.textContent = Math.round(price);
            }
        });
        
        // Show/hide salik item based on whether there are toll charges
        const salikItem = document.querySelector('.salik-item');
        if (salikItem) {
            salikItem.style.display = salikFare > 0 ? 'flex' : 'none';
        }
        
        // Update map if available
        if (window.enhancedMapManager) {
            window.enhancedMapManager.updateRouteFromLocations(this.pickupLocation, this.destinationLocation);
        }
    }
    
    // New method to update pricing from actual distance
    updatePricingFromDistance(actualDistance) {
        const baseRates = {
            economy: 2.5,
            family: 3.0,
            business: 4.0
        };
        
        const baseFares = {
            economy: 10,
            family: 15,
            business: 20
        };
        
        const baseFare = baseFares[this.selectedVehicle];
        const distanceFare = actualDistance * baseRates[this.selectedVehicle];
        const salikFare = actualDistance > 10 ? 4 : 0;
        const subtotal = baseFare + distanceFare + salikFare;
        const vatAmount = subtotal * 0.05;
        const total = subtotal + vatAmount;
        
        // Update DOM elements
        this.updateElement('baseFare', baseFare.toFixed(2));
        this.updateElement('tripDistance', actualDistance.toFixed(1));
        this.updateElement('salikFare', salikFare.toFixed(2));
        this.updateElement('vatAmount', vatAmount.toFixed(2));
        this.updateElement('totalFare', total.toFixed(2));
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    async handleBooking() {
        if (this.isBookingInProgress) return;
        
        if (!this.pickupLocation || !this.destinationLocation) {
            this.showNotification('Please enter pickup and destination locations', 'error');
            return;
        }
        
        this.isBookingInProgress = true;
        const bookBtn = document.getElementById('bookNowBtn');
        
        try {
            // Start loading animation
            bookBtn.classList.add('loading');
            
            // Simulate API call
            await this.delay(2000);
            
            // Start car animation
            bookBtn.classList.remove('loading');
            bookBtn.classList.add('animating');
            
            // Trigger car flying animation
            await this.animateCarToMap();
            
            // Dispatch ride booked event
            const rideBookedEvent = new CustomEvent('rideBooked', {
                detail: {
                    rideId: 'RIDE_' + Date.now(),
                    driverId: 'DRIVER_001',
                    pickup: this.pickupLocation,
                    destination: this.destinationLocation,
                    vehicle: this.selectedVehicle
                }
            });
            document.dispatchEvent(rideBookedEvent);
            
            // Switch to tracking view
            this.showTrackingView();
            
        } catch (error) {
            console.error('Booking failed:', error);
            this.showNotification('Booking failed. Please try again.', 'error');
        } finally {
            this.isBookingInProgress = false;
            bookBtn.classList.remove('loading', 'animating');
        }
    }
    
    async animateCarToMap() {
        // Use the enhanced animation system if available
        if (window.mapAnimationController) {
            return window.mapAnimationController.animateBookingSequence(window.enhancedMapManager);
        } else {
            // Fallback animation
            const car3D = document.getElementById('car3D');
            const mapContainer = document.querySelector('.map-container');
            
            if (car3D && mapContainer) {
                const carRect = car3D.getBoundingClientRect();
                const mapRect = mapContainer.getBoundingClientRect();
                
                const deltaX = mapRect.left + mapRect.width / 2 - carRect.left;
                const deltaY = mapRect.top + mapRect.height / 2 - carRect.top;
                
                car3D.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
                car3D.style.transition = '1.5s ease-out';
                
                await this.delay(1500);
                car3D.style.opacity = '0';
            }
        }
    }
    
    showTrackingView() {
        const heroSection = document.getElementById('home');
        const trackingSection = document.getElementById('trackingSection');
        
        if (heroSection && trackingSection) {
            heroSection.style.display = 'none';
            trackingSection.classList.add('active');
            this.isRideActive = true;
            
            // Start progress animation
            this.animateRideProgress();
        }
    }
    
    animateRideProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const steps = document.querySelectorAll('.step');
        
        if (progressFill && steps.length > 0) {
            let currentStep = 2; // Start at step 2 (on the way)
            const stepWidth = 100 / (steps.length - 1);
            
            const updateProgress = () => {
                if (currentStep < steps.length) {
                    // Update progress bar
                    progressFill.style.width = `${currentStep * stepWidth}%`;
                    
                    // Activate current step
                    steps[currentStep].classList.add('active');
                    
                    currentStep++;
                    
                    // Continue animation
                    setTimeout(updateProgress, 5000); // 5 seconds between steps
                }
            };
            
            updateProgress();
        }
    }
    
    setupQuickActions() {
        const scheduleBtn = document.querySelector('.schedule-btn');
        const favoritesBtn = document.querySelector('.favorites-btn');
        
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => {
                this.showNotification('Schedule ride feature coming soon!', 'info');
            });
        }
        
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                this.showNotification('Favorites feature coming soon!', 'info');
            });
        }
    }
    
    setupMapControls() {
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const myLocationBtn = document.querySelector('.my-location');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.showNotification('Zooming in...', 'info');
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.showNotification('Zooming out...', 'info');
            });
        }
        
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
        }
    }
    
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Current location:', latitude, longitude);
                    this.showNotification('Location found!', 'success');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showNotification('Unable to get your location', 'error');
                }
            );
        } else {
            this.showNotification('Geolocation not supported', 'error');
        }
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        const html = document.documentElement;
        const langToggle = document.getElementById('langToggle');
        
        if (this.currentLanguage === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            langToggle.querySelector('.lang-text').textContent = 'English';
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            langToggle.querySelector('.lang-text').textContent = 'العربية';
        }
        
        // Update all text elements
        this.updateLanguageText();
        
        // Update input placeholders
        this.updatePlaceholders();
    }
    
    updateLanguageText() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const text = this.currentLanguage === 'en' ? element.dataset.en : element.dataset.ar;
            element.textContent = text;
        });
    }
    
    updatePlaceholders() {
        const inputs = document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]');
        inputs.forEach(input => {
            const placeholder = this.currentLanguage === 'en' ? 
                input.dataset.placeholderEn : input.dataset.placeholderAr;
            input.setAttribute('placeholder', placeholder);
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    animateOnLoad() {
        // Animate elements on page load
        const animatedElements = document.querySelectorAll('.booking-panel, .map-container, .feature-card');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RaahaApp();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.feature-card, .pricing-card');
    elementsToAnimate.forEach(el => observer.observe(el));
});