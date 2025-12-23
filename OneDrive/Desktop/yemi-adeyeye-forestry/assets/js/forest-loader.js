// =====================================================
// FOREST LOADER JAVASCRIPT - forest-loader.js
// =====================================================

class ForestLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.ringProgress = document.querySelector('.ring-progress');
        this.loaderBrand = document.querySelector('.loader-brand');
        this.loaderTagline = document.querySelector('.loader-tagline');
        this.particles = document.querySelectorAll('.particle');

        this.loadingMessages = [
            'Nurturing the forest...',
            'Growing roots deep...',
            'Spreading branches wide...',
            'Breathing life into nature...',
            'Welcome to the forest!'
        ];

        this.currentMessage = 0;
        this.progress = 0;
        this.assets = [];
        this.assetsLoaded = 0;
        this.minLoadTime = 5000; // Minimum 5 seconds to show the beautiful loader
        this.startTime = Date.now();

        this.init();
    }
    
    init() {
        // Track all assets that need to load
        this.trackAssets();
        
        // Start the loading animation
        this.startLoadingAnimation();
        
        // Listen for window load
        window.addEventListener('load', () => {
            this.completeLoading();
        });
    }
    
    trackAssets() {
        // Track images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                this.assets.push(img);
                img.addEventListener('load', () => this.assetLoaded());
                img.addEventListener('error', () => this.assetLoaded());
            }
        });
        
        // Track videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            this.assets.push(video);
            video.addEventListener('loadeddata', () => this.assetLoaded());
            video.addEventListener('error', () => this.assetLoaded());
        });
        
        // Track fonts
        if (document.fonts) {
            document.fonts.ready.then(() => {
                this.assetLoaded();
            });
            this.assets.push('fonts');
        }
    }
    
    assetLoaded() {
        this.assetsLoaded++;
        const assetProgress = this.assets.length > 0 
            ? (this.assetsLoaded / this.assets.length) * 100 
            : 100;
        
        // Update progress based on actual asset loading
        this.updateProgress(Math.max(this.progress, assetProgress));
    }
    
    startLoadingAnimation() {
        // Animate particles
        this.animateParticles();

        // Update loading message periodically
        this.messageInterval = setInterval(() => {
            this.updateLoadingMessage();
        }, 1200);

        // Smooth progress animation
        this.progressInterval = setInterval(() => {
            this.incrementProgress();
        }, 30);
    }

    animateParticles() {
        // Particles are already animated via CSS
        // Add extra sparkle effect
        this.particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.opacity = '1';
            }, index * 100);
        });
    }
    
    incrementProgress() {
        // Natural loading progression
        if (this.progress < 90) {
            this.progress += Math.random() * 2;
        } else if (this.progress < 99 && this.assetsLoaded === this.assets.length) {
            this.progress += 0.5;
        }
        
        this.updateProgress(Math.min(this.progress, 99));
    }
    
    updateProgress(value) {
        this.progress = value;

        // Update ring progress
        if (this.ringProgress) {
            const circumference = 2 * Math.PI * 120; // radius = 120
            const offset = circumference - (circumference * this.progress / 100);
            this.ringProgress.style.strokeDashoffset = offset;
        }

        // Update message based on progress
        const newMessage = Math.floor((this.progress / 100) * this.loadingMessages.length);
        if (newMessage !== this.currentMessage && newMessage < this.loadingMessages.length) {
            this.currentMessage = newMessage;
            this.updateLoadingMessage();
        }
    }

    updateLoadingMessage() {
        if (this.loaderTagline && this.loadingMessages[this.currentMessage]) {
            // Fade out
            this.loaderTagline.style.opacity = '0';

            setTimeout(() => {
                this.loaderTagline.textContent = this.loadingMessages[this.currentMessage];
                // Fade in
                this.loaderTagline.style.opacity = '0.9';
            }, 300);
        }
    }
    
    completeLoading() {
        // Ensure minimum load time for smooth UX
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadTime - elapsedTime);

        setTimeout(() => {
            // Clear intervals
            clearInterval(this.messageInterval);
            clearInterval(this.progressInterval);

            // Set progress to 100%
            this.updateProgress(100);

            if (this.loaderTagline) {
                this.loaderTagline.textContent = this.loadingMessages[this.loadingMessages.length - 1];
            }

            // Wait a moment then hide loader
            setTimeout(() => {
                this.hideLoader();
            }, 800);
        }, remainingTime);
    }
    
    hideLoader() {
        // Add forest bloom effect before hiding
        this.createBloomEffect();

        // Fade out loader
        this.loader.classList.add('loaded');

        setTimeout(() => {
            this.loader.style.display = 'none';

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('loaderComplete'));

            // Start main site animations
            this.initializeMainSite();
        }, 800);
    }
    
    createBloomEffect() {
        const bloomContainer = document.createElement('div');
        bloomContainer.className = 'bloom-effect';
        this.loader.appendChild(bloomContainer);
        
        // Create multiple bloom circles
        for (let i = 0; i < 5; i++) {
            const bloom = document.createElement('div');
            bloom.className = 'bloom-circle';
            bloom.style.left = Math.random() * 100 + '%';
            bloom.style.top = Math.random() * 100 + '%';
            bloom.style.animationDelay = i * 0.1 + 's';
            bloomContainer.appendChild(bloom);
        }
    }
    
    initializeMainSite() {
        // Trigger main site animations
        document.body.classList.add('loaded');
        
        // Animate hero section
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-cta');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 200);
        });
        
        // Start particle system
        if (window.ForestParticles) {
            new ForestParticles();
        }
    }
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ForestLoader();
});

// Add styles for loader animations
const style = document.createElement('style');
style.textContent = `
    .loader-tagline {
        transition: opacity 0.3s ease;
    }

    .bloom-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 20;
    }

    .bloom-circle {
        position: absolute;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(183, 228, 199, 0.6), transparent);
        border-radius: 50%;
        transform: scale(0);
        animation: bloom 1.2s ease forwards;
    }

    @keyframes bloom {
        to {
            transform: scale(8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);