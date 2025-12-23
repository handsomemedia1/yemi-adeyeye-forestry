// =====================================================
// VIDEO HERO JAVASCRIPT - video-hero.js
// =====================================================

class VideoHero {
    constructor() {
        this.video = document.getElementById('heroVideo');
        this.heroSection = document.querySelector('.hero-section');
        this.videoContainer = document.querySelector('.hero-video-container');
        
        this.sources = {
            desktop: '/assets/videos/forest-hero.mp4',
            mobile: '/assets/videos/forest-hero-mobile.mp4',
            poster: '/assets/images/forest-hero-poster.jpg'
        };
        
        this.isVideoLoaded = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (!this.video || !this.heroSection) return;
        
        // Check for reduced motion preference
        if (this.prefersReducedMotion) {
            this.setupStaticBackground();
            return;
        }
        
        // Setup video
        this.setupVideo();
        
        // Handle video loading
        this.handleVideoLoading();
        
        // Parallax effect on scroll
        this.setupParallax();
        
        // Ambient audio toggle (optional)
        this.setupAudioToggle();
        
        // Video quality adaptation
        this.setupQualityAdaptation();
    }
    
    setupVideo() {
        // Set appropriate source based on device
        const source = this.isMobile() ? this.sources.mobile : this.sources.desktop;
        
        // Create source element
        const sourceElement = document.createElement('source');
        sourceElement.src = source;
        sourceElement.type = 'video/mp4';
        
        // Add poster for loading state
        this.video.poster = this.sources.poster;
        
        // Video attributes
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('webkit-playsinline', '');
        this.video.muted = true;
        this.video.loop = true;
        
        // Add source to video
        this.video.appendChild(sourceElement);
        
        // Attempt to play
        this.playVideo();
    }
    
    playVideo() {
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isVideoLoaded = true;
                    this.videoContainer.classList.add('loaded');
                })
                .catch(error => {
                    console.warn('Video autoplay failed:', error);
                    this.setupStaticBackground();
                });
        }
    }
    
    setupStaticBackground() {
        // Fallback to static image
        this.videoContainer.style.backgroundImage = `url(${this.sources.poster})`;
        this.videoContainer.style.backgroundSize = 'cover';
        this.videoContainer.style.backgroundPosition = 'center';
        
        // Hide video element
        if (this.video) {
            this.video.style.display = 'none';
        }
        
        // Add subtle animation to static background
        this.animateStaticBackground();
    }
    
    animateStaticBackground() {
        let position = 50;
        
        setInterval(() => {
            position += 0.01;
            if (position > 51) position = 50;
            
            this.videoContainer.style.backgroundPosition = `center ${position}%`;
        }, 50);
    }
    
    handleVideoLoading() {
        // Show loading state
        const loadingIndicator = this.createLoadingIndicator();
        this.videoContainer.appendChild(loadingIndicator);
        
        // Video events
        this.video.addEventListener('loadstart', () => {
            loadingIndicator.classList.add('active');
        });
        
        this.video.addEventListener('canplay', () => {
            loadingIndicator.classList.remove('active');
            setTimeout(() => loadingIndicator.remove(), 300);
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            this.setupStaticBackground();
            loadingIndicator.remove();
        });
    }
    
    createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'video-loader';
        loader.innerHTML = `
            <div class="tree-ring-loader">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#84A98C" stroke-width="2" opacity="0.2"/>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#52796F" stroke-width="2" 
                            stroke-dasharray="283" stroke-dashoffset="283" class="loader-ring"/>
                </svg>
            </div>
        `;
        
        return loader;
    }
    
    setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const speed = 0.5;
            
            if (this.video && this.isVideoLoaded) {
                this.video.style.transform = `translateY(${scrolled * speed}px)`;
            }
            
            // Also parallax the overlay
            const overlay = this.videoContainer.querySelector('.video-overlay');
            if (overlay) {
                overlay.style.transform = `translateY(${scrolled * speed * 0.8}px)`;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    setupAudioToggle() {
        // Create audio toggle button
        const audioToggle = document.createElement('button');
        audioToggle.className = 'audio-toggle';
        audioToggle.innerHTML = `
            <span class="audio-icon muted">
                <i class="fas fa-volume-mute"></i>
            </span>
            <span class="audio-icon unmuted" style="display: none;">
                <i class="fas fa-volume-up"></i>
            </span>
            <span class="audio-text">Toggle Sound</span>
        `;
        audioToggle.setAttribute('aria-label', 'Toggle video sound');
        
        this.heroSection.appendChild(audioToggle);
        
        // Toggle functionality
        audioToggle.addEventListener('click', () => {
            this.toggleAudio(audioToggle);
        });
    }
    
    toggleAudio(button) {
        const isMuted = this.video.muted;
        this.video.muted = !isMuted;
        
        const mutedIcon = button.querySelector('.muted');
        const unmutedIcon = button.querySelector('.unmuted');
        
        if (isMuted) {
            mutedIcon.style.display = 'none';
            unmutedIcon.style.display = 'block';
            button.classList.add('active');
            
            // Add ambient forest sounds
            this.playAmbientAudio();
        } else {
            mutedIcon.style.display = 'block';
            unmutedIcon.style.display = 'none';
            button.classList.remove('active');
            
            // Stop ambient audio
            this.stopAmbientAudio();
        }
    }
    
    playAmbientAudio() {
        if (!this.ambientAudio) {
            this.ambientAudio = new Audio('/assets/audio/forest-ambient.mp3');
            this.ambientAudio.loop = true;
            this.ambientAudio.volume = 0.3;
        }
        
        this.ambientAudio.play().catch(e => {
            console.warn('Ambient audio play failed:', e);
        });
    }
    
    stopAmbientAudio() {
        if (this.ambientAudio) {
            this.ambientAudio.pause();
        }
    }
    
    setupQualityAdaptation() {
        // Monitor connection speed
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                this.adaptVideoQuality();
            });
            
            // Initial check
            this.adaptVideoQuality();
        }
    }
    
    adaptVideoQuality() {
        if (!('connection' in navigator)) return;
        
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        // Adjust video based on connection
        if (effectiveType === '4g') {
            this.video.playbackRate = 1;
        } else if (effectiveType === '3g') {
            this.video.playbackRate = 0.75;
        } else {
            // For slower connections, switch to static
            this.setupStaticBackground();
        }
    }
    
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

// Season-based video effects
class SeasonalVideoEffects {
    constructor(video) {
        this.video = video;
        this.season = this.getCurrentSeason();
        this.filters = {
            spring: 'hue-rotate(0deg) saturate(1.2) brightness(1.1)',
            summer: 'hue-rotate(-10deg) saturate(1.3) brightness(1.2)',
            autumn: 'hue-rotate(30deg) saturate(1.5) contrast(1.1)',
            winter: 'hue-rotate(180deg) saturate(0.8) brightness(1.1) contrast(1.2)'
        };
        
        this.applySeasonalFilter();
    }
    
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
    
    applySeasonalFilter() {
        if (this.video && this.filters[this.season]) {
            this.video.style.filter = this.filters[this.season];
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const videoHero = new VideoHero();
    
    // Apply seasonal effects after video loads
    const video = document.getElementById('heroVideo');
    if (video) {
        video.addEventListener('canplay', () => {
            new SeasonalVideoEffects(video);
        });
    }
});

// Video hero styles
const videoStyles = document.createElement('style');
videoStyles.textContent = `
    /* Video Loader */
    .video-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .video-loader.active {
        opacity: 1;
    }
    
    .tree-ring-loader {
        width: 60px;
        height: 60px;
    }
    
    .loader-ring {
        animation: loadRing 2s ease infinite;
    }
    
    @keyframes loadRing {
        to {
            stroke-dashoffset: 0;
        }
    }
    
    /* Audio Toggle */
    .audio-toggle {
        position: absolute;
        bottom: 30px;
        right: 30px;
        background: rgba(27, 67, 50, 0.8);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 10;
    }
    
    .audio-toggle:hover {
        background: rgba(27, 67, 50, 0.9);
        transform: scale(1.05);
    }
    
    .audio-toggle.active {
        background: rgba(132, 169, 140, 0.9);
    }
    
    .audio-text {
        font-size: 0;
        width: 0;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .audio-toggle:hover .audio-text {
        font-size: 14px;
        width: auto;
        margin-left: 5px;
    }
    
    /* Video Container States */
    .hero-video-container {
        opacity: 0;
        transition: opacity 1s ease;
    }
    
    .hero-video-container.loaded {
        opacity: 1;
    }
    
    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        .hero-video,
        .video-overlay {
            animation: none !important;
            transition: none !important;
        }
    }
    
    /* Mobile Optimizations */
    @media (max-width: 768px) {
        .audio-toggle {
            bottom: 20px;
            right: 20px;
            padding: 10px;
        }
        
        .audio-toggle .audio-text {
            display: none;
        }
    }
`;
document.head.appendChild(videoStyles);