// Animation utilities for Raaha platform

class AnimationManager {
    constructor() {
        this.isAnimating = false;
        this.animationQueue = [];
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.preloadAnimations();
    }
    
    // Car animation from button to map
    async animateCarBooking(buttonElement, mapElement, targetPosition) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        try {
            // Phase 1: Button loading state
            buttonElement.classList.add('loading');
            await this.delay(2000);
            
            // Phase 2: Transform button to car
            buttonElement.classList.remove('loading');
            buttonElement.classList.add('animating');
            
            const car3D = buttonElement.querySelector('.car-3d');
            if (car3D) {
                car3D.style.opacity = '1';
                car3D.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            
            await this.delay(500);
            
            // Phase 3: Car flies to map
            if (car3D && mapElement) {
                const buttonRect = buttonElement.getBoundingClientRect();
                const mapRect = mapElement.getBoundingClientRect();
                
                // Calculate trajectory
                const startX = buttonRect.left + buttonRect.width / 2;
                const startY = buttonRect.top + buttonRect.height / 2;
                const endX = mapRect.left + (targetPosition?.x || mapRect.width / 2);
                const endY = mapRect.top + (targetPosition?.y || mapRect.height / 2);
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                
                // Create flying car element
                const flyingCar = this.createFlyingCar(startX, startY);
                document.body.appendChild(flyingCar);
                
                // Hide original car
                car3D.style.opacity = '0';
                
                // Animate flying car
                await this.animateFlyingCar(flyingCar, deltaX, deltaY);
                
                // Remove flying car
                document.body.removeChild(flyingCar);
                
                // Show car on map
                this.showCarOnMap(mapElement, targetPosition);
            }
            
            // Phase 4: Reset button state
            buttonElement.classList.remove('animating');
            
        } catch (error) {
            console.error('Car animation failed:', error);
        } finally {
            this.isAnimating = false;
        }
    }
    
    createFlyingCar(x, y) {
        const flyingCar = document.createElement('div');
        flyingCar.className = 'flying-car';
        flyingCar.textContent = '🚗';
        
        Object.assign(flyingCar.style, {
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            fontSize: '2rem',
            zIndex: '10000',
            pointerEvents: 'none',
            transition: 'none',
            transform: 'translate(-50%, -50%)'
        });
        
        return flyingCar;
    }
    
    async animateFlyingCar(carElement, deltaX, deltaY) {
        return new Promise((resolve) => {
            const duration = 1500;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth flight
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                
                // Calculate arc path (parabolic trajectory)
                const x = deltaX * easeOutCubic;
                const y = deltaY * easeOutCubic - Math.sin(progress * Math.PI) * 100;
                
                // Apply rotation based on direction
                const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
                
                carElement.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
                carElement.style.opacity = 1 - (progress * 0.3);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    showCarOnMap(mapElement, position) {
        const mapCar = mapElement.querySelector('.driver-car');
        if (mapCar) {
            mapCar.style.animation = 'bounceIn 0.6s ease-out';
            mapCar.style.opacity = '1';
            
            // Add pulsing effect
            setTimeout(() => {
                mapCar.classList.add('pulse');
            }, 600);
        }
    }
    
    // Progress bar animation for ride tracking
    animateRideProgress(progressBar, steps, duration = 1000) {
        if (!progressBar || !steps.length) return;
        
        const totalSteps = steps.length;
        let currentStep = 0;
        
        const animateStep = () => {
            if (currentStep < totalSteps) {
                // Update progress bar
                const progress = (currentStep / (totalSteps - 1)) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Activate current step
                steps[currentStep].classList.add('active');
                
                // Add step animation
                const stepIcon = steps[currentStep].querySelector('.step-icon');
                if (stepIcon) {
                    stepIcon.style.animation = 'bounceIn 0.5s ease-out';
                }
                
                currentStep++;
                
                // Continue to next step
                setTimeout(animateStep, duration);
            }
        };
        
        animateStep();
    }
    
    // Smooth counter animation
    animateCounter(element, targetValue, duration = 1000, suffix = '') {
        if (!element) return;
        
        const startValue = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
            
            element.textContent = Math.round(currentValue) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Stagger animation for multiple elements
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }
    
    // Parallax effect for background elements
    setupParallaxEffect(elements, factor = 0.5) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            elements.forEach(element => {
                const translateY = scrollTop * factor;
                element.style.transform = `translateY(${translateY}px)`;
            });
        });
    }
    
    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fadeInUp';
                    
                    element.classList.add('animate', animationType);
                    observer.unobserve(element); // Only animate once
                }
            });
        }, observerOptions);
        
        // Observe elements with animation data attributes
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('[data-animation]');
            animatedElements.forEach(el => observer.observe(el));
        });
        
        this.observers.set('intersection', observer);
    }
    
    // Scroll-triggered animations
    setupScrollAnimations() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }
    
    updateScrollAnimations() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Navbar background animation
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const opacity = Math.min(scrollTop / 100, 0.98);
            navbar.style.background = `rgba(255, 255, 255, ${0.95 + opacity * 0.03})`;
        }
        
        // Floating elements animation
        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Loading animation utilities
    showLoadingSpinner(container, message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
            <p class="spinner-message">${message}</p>
        `;
        
        Object.assign(spinner.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: '1000'
        });
        
        container.appendChild(spinner);
        return spinner;
    }
    
    hideLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.style.opacity = '0';
            spinner.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                spinner.parentNode.removeChild(spinner);
            }, 300);
        }
    }
    
    // Pulse animation for notifications
    pulseElement(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    // Shake animation for errors
    shakeElement(element, duration = 500) {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    // Bounce animation for success states
    bounceElement(element, duration = 600) {
        element.style.animation = `bounceIn ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    // Morphing animation for button states
    morphElement(element, newContent, callback) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0.7';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (typeof newContent === 'string') {
                element.textContent = newContent;
            } else if (newContent instanceof HTMLElement) {
                element.innerHTML = '';
                element.appendChild(newContent);
            }
            
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
            
            if (callback) {
                setTimeout(callback, 300);
            }
        }, 150);
    }
    
    // Preload critical animations
    preloadAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            .animate {
                animation-duration: 0.6s;
                animation-fill-mode: both;
            }
            
            .fadeInUp { animation-name: fadeInUp; }
            .slideInRight { animation-name: slideInRight; }
            .slideInLeft { animation-name: slideInLeft; }
            
            .loading-spinner .spinner-circle {
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
        `;
        document.head.appendChild(style);
    }
    
    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});