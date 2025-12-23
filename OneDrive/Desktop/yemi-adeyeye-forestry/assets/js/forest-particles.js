// =====================================================
// FOREST PARTICLES JAVASCRIPT - forest-particles.js
// =====================================================

class ForestParticles {
    constructor(containerId = 'forestParticles') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.particles = [];
        this.maxParticles = 30;
        this.particleTypes = [
            { emoji: '🍃', class: 'leaf-green', weight: 5 },
            { emoji: '🍂', class: 'leaf-autumn', weight: 3 },
            { emoji: '🌿', class: 'leaf-fern', weight: 2 },
            { emoji: '🌾', class: 'grass', weight: 1 },
            { emoji: '✨', class: 'sparkle', weight: 1 }
        ];
        
        this.windStrength = 0;
        this.windDirection = 1;
        this.season = this.getCurrentSeason();
        
        this.init();
    }
    
    init() {
        // Set up container styles
        this.setupContainer();
        
        // Create initial particles
        this.createInitialParticles();
        
        // Start animation loop
        this.animate();
        
        // Listen for mouse movement for wind effect
        this.setupWindEffect();
        
        // Periodically add new particles
        this.startParticleGeneration();
    }
    
    setupContainer() {
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.overflow = 'hidden';
    }
    
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
    
    createInitialParticles() {
        for (let i = 0; i < this.maxParticles / 2; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        // Select particle type based on weight and season
        const particleType = this.selectParticleType();
        
        const particle = {
            element: this.createParticleElement(particleType),
            x: Math.random() * window.innerWidth,
            y: -50,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random() * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.6 + Math.random() * 0.4,
            swayAmplitude: 20 + Math.random() * 30,
            swayFrequency: 0.01 + Math.random() * 0.02,
            time: 0,
            type: particleType.class
        };
        
        this.particles.push(particle);
        this.container.appendChild(particle.element);
        
        return particle;
    }
    
    selectParticleType() {
        // Adjust weights based on season
        let types = [...this.particleTypes];
        
        if (this.season === 'autumn') {
            types.find(t => t.class === 'leaf-autumn').weight = 8;
            types.find(t => t.class === 'leaf-green').weight = 2;
        } else if (this.season === 'winter') {
            types.find(t => t.class === 'sparkle').weight = 5;
        } else if (this.season === 'spring') {
            types.find(t => t.class === 'leaf-fern').weight = 5;
        }
        
        // Calculate total weight
        const totalWeight = types.reduce((sum, type) => sum + type.weight, 0);
        
        // Random selection based on weight
        let random = Math.random() * totalWeight;
        for (const type of types) {
            random -= type.weight;
            if (random <= 0) return type;
        }
        
        return types[0];
    }
    
    createParticleElement(particleType) {
        const element = document.createElement('div');
        element.className = `forest-particle ${particleType.class}`;
        element.innerHTML = particleType.emoji;
        element.style.position = 'absolute';
        element.style.fontSize = '20px';
        element.style.transition = 'none';
        element.style.willChange = 'transform';
        element.style.zIndex = Math.floor(Math.random() * 10);
        
        return element;
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            // Update time
            particle.time += 1;
            
            // Apply physics
            particle.vx += this.windStrength * this.windDirection * 0.1;
            particle.vx *= 0.98; // Damping
            
            // Sway motion
            const sway = Math.sin(particle.time * particle.swayFrequency) * particle.swayAmplitude;
            
            // Update position
            particle.x += particle.vx + sway * 0.02;
            particle.y += particle.vy;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Apply transforms
            particle.element.style.transform = `
                translate(${particle.x}px, ${particle.y}px)
                rotate(${particle.rotation}deg)
                scale(${particle.scale})
            `;
            particle.element.style.opacity = particle.opacity;
            
            // Remove particles that have fallen off screen
            if (particle.y > window.innerHeight + 50) {
                this.removeParticle(index);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    removeParticle(index) {
        const particle = this.particles[index];
        particle.element.remove();
        this.particles.splice(index, 1);
    }
    
    setupWindEffect() {
        let mouseX = 0;
        let lastMouseX = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            const deltaX = mouseX - lastMouseX;
            
            // Calculate wind based on mouse movement
            this.windStrength = Math.abs(deltaX) * 0.1;
            this.windDirection = deltaX > 0 ? 1 : -1;
            
            // Decay wind over time
            setTimeout(() => {
                this.windStrength *= 0.9;
            }, 100);
            
            lastMouseX = mouseX;
        });
    }
    
    startParticleGeneration() {
        setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 1000 + Math.random() * 2000);
    }
    
    // Public methods
    burst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = (Math.random() - 0.5) * 10;
            particle.vy = -5 - Math.random() * 5;
        }
    }
    
    changeSeasonTo(season) {
        this.season = season;
        
        // Update existing particles gradually
        this.particles.forEach(particle => {
            if (Math.random() > 0.7) {
                const index = this.particles.indexOf(particle);
                this.removeParticle(index);
            }
        });
    }
    
    setMaxParticles(max) {
        this.maxParticles = max;
        
        // Remove excess particles
        while (this.particles.length > max) {
            this.removeParticle(this.particles.length - 1);
        }
    }
}

// Firefly particle system for evening effect
class FireflySystem {
    constructor(container) {
        this.container = container;
        this.fireflies = [];
        this.maxFireflies = 20;
        
        this.init();
    }
    
    init() {
        // Check if it's evening/night time
        const hour = new Date().getHours();
        if (hour >= 18 || hour <= 6) {
            this.createFireflies();
            this.animate();
        }
    }
    
    createFireflies() {
        for (let i = 0; i < this.maxFireflies; i++) {
            const firefly = this.createFirefly();
            this.fireflies.push(firefly);
            this.container.appendChild(firefly.element);
        }
    }
    
    createFirefly() {
        const element = document.createElement('div');
        element.className = 'firefly';
        element.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fffacd;
            border-radius: 50%;
            box-shadow: 0 0 10px #fffacd;
            pointer-events: none;
        `;
        
        return {
            element,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            phase: Math.random() * Math.PI * 2,
            brightness: 0.5 + Math.random() * 0.5
        };
    }
    
    animate() {
        this.fireflies.forEach(firefly => {
            // Organic movement
            firefly.vx += (Math.random() - 0.5) * 0.1;
            firefly.vy += (Math.random() - 0.5) * 0.1;
            
            // Limit speed
            firefly.vx = Math.max(-1, Math.min(1, firefly.vx));
            firefly.vy = Math.max(-1, Math.min(1, firefly.vy));
            
            // Update position
            firefly.x += firefly.vx;
            firefly.y += firefly.vy;
            
            // Wrap around screen
            if (firefly.x < -10) firefly.x = window.innerWidth + 10;
            if (firefly.x > window.innerWidth + 10) firefly.x = -10;
            if (firefly.y < -10) firefly.y = window.innerHeight + 10;
            if (firefly.y > window.innerHeight + 10) firefly.y = -10;
            
            // Pulsing glow
            firefly.phase += 0.05;
            const glow = (Math.sin(firefly.phase) + 1) * 0.5 * firefly.brightness;
            
            // Apply styles
            firefly.element.style.transform = `translate(${firefly.x}px, ${firefly.y}px)`;
            firefly.element.style.opacity = glow;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Main particle system
    window.ForestParticles = ForestParticles;
    const mainParticles = new ForestParticles('forestParticles');
    
    // Firefly system for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const fireflyContainer = document.createElement('div');
        fireflyContainer.id = 'fireflies';
        fireflyContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
        `;
        heroSection.appendChild(fireflyContainer);
        new FireflySystem(fireflyContainer);
    }
    
    // Expose particle burst for interactive effects
    window.particleBurst = (e) => {
        if (mainParticles) {
            mainParticles.burst(e.clientX, e.clientY);
        }
    };
});