// =====================================================
// ABOUT PAGE JAVASCRIPT - about.js
// =====================================================

class AboutPage {
    constructor() {
        this.timeline = document.querySelector('.timeline-container');
        this.educationTree = document.querySelector('.knowledge-tree');
        this.expertiseItems = document.querySelectorAll('.expertise-item');
        this.valueTrees = document.querySelectorAll('.value-tree');
        
        this.init();
    }
    
    init() {
        // Initialize timeline animations
        this.setupTimeline();
        
        // Initialize education tree
        this.setupEducationTree();
        
        // Initialize expertise rings
        this.setupExpertiseRings();
        
        // Initialize value trees
        this.setupValueTrees();
        
        // Bio image interactions
        this.setupBioImage();
        
        // Parallax effects
        this.setupParallax();
    }
    
    setupTimeline() {
        if (!this.timeline) return;
        
        // Create trunk growth animation
        const trunk = this.timeline.querySelector('.timeline-trunk');
        if (trunk) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        trunk.classList.add('growing');
                        this.animateTimelineItems();
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(trunk);
        }
    }
    
    animateTimelineItems() {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                
                // Animate marker ring
                const ring = item.querySelector('.marker-ring');
                if (ring) {
                    ring.style.transform = 'scale(1)';
                }
                
                // Add leaves animation
                this.createTimelineLeaves(item);
            }, index * 300);
        });
    }
    
    createTimelineLeaves(item) {
        const leaves = item.querySelector('.timeline-leaves');
        if (!leaves) return;
        
        const leafCount = 5;
        for (let i = 0; i < leafCount; i++) {
            setTimeout(() => {
                const leaf = document.createElement('span');
                leaf.className = 'floating-leaf';
                leaf.textContent = ['🍃', '🌿', '🍂'][Math.floor(Math.random() * 3)];
                leaf.style.left = Math.random() * 100 + '%';
                leaf.style.animationDelay = Math.random() * 2 + 's';
                leaves.appendChild(leaf);
            }, i * 100);
        }
    }
    
    setupEducationTree() {
        if (!this.educationTree) return;
        
        const svg = this.educationTree.querySelector('.tree-svg');
        const cards = this.educationTree.querySelectorAll('.edu-card');
        
        // Animate SVG tree growth
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTreeGrowth(svg);
                    this.positionEducationCards(cards);
                }
            });
        }, { threshold: 0.5 });
        
        if (svg) observer.observe(svg);
    }
    
    animateTreeGrowth(svg) {
        const roots = svg.querySelector('.tree-roots');
        const trunk = svg.querySelector('.tree-trunk-svg');
        const branches = svg.querySelector('.tree-branches');
        const canopy = svg.querySelector('.tree-canopy-svg');
        
        // Animate in sequence
        const elements = [roots, trunk, branches, canopy];
        elements.forEach((el, index) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                }, index * 400);
            }
        });
    }
    
    positionEducationCards(cards) {
        // Position cards on tree branches
        const positions = [
            { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }, // PhD
            { top: '40%', left: '25%', transform: 'translate(-50%, -50%)' }, // MSc1
            { top: '40%', right: '25%', transform: 'translate(50%, -50%)' }, // MSc2
            { top: '70%', left: '35%', transform: 'translate(-50%, -50%)' }  // BTech
        ];
        
        cards.forEach((card, index) => {
            if (positions[index]) {
                Object.assign(card.style, positions[index]);
                card.style.position = 'absolute';
                
                // Add hover effect
                card.addEventListener('mouseenter', () => {
                    this.createEducationGlow(card);
                });
            }
        });
    }
    
    createEducationGlow(card) {
        const glow = document.createElement('div');
        glow.className = 'education-glow';
        card.appendChild(glow);
        
        setTimeout(() => glow.remove(), 1000);
    }
    
    setupExpertiseRings() {
        this.expertiseItems.forEach((item, index) => {
            const ring = item.querySelector('.expertise-ring');
            const ringFill = item.querySelector('.ring-fill');
            
            if (!ring || !ringFill) return;
            
            // Create animated ring growth on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            ringFill.style.transform = 'scale(1)';
                            this.animateExpertiseIcon(item);
                        }, index * 200);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    }
    
    animateExpertiseIcon(item) {
        const icon = item.querySelector('.expertise-icon');
        if (!icon) return;
        
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 300);
        
        // Add pulse effect
        const pulse = document.createElement('div');
        pulse.className = 'icon-pulse';
        icon.appendChild(pulse);
    }
    
    setupValueTrees() {
        this.valueTrees.forEach((tree, index) => {
            tree.addEventListener('mouseenter', () => {
                this.growValueTree(tree);
            });
            
            // Auto-grow on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.growValueTree(tree);
                        }, index * 300);
                    }
                });
            }, { threshold: 0.7 });
            
            observer.observe(tree);
        });
    }
    
    growValueTree(tree) {
        if (tree.classList.contains('grown')) return;
        
        tree.classList.add('grown');
        
        // Create growing branches
        const branchCount = 5;
        for (let i = 0; i < branchCount; i++) {
            const branch = document.createElement('div');
            branch.className = 'value-branch';
            branch.style.transform = `rotate(${(i - 2) * 30}deg)`;
            tree.appendChild(branch);
            
            setTimeout(() => {
                branch.style.height = '60px';
            }, i * 100);
        }
        
        // Add leaves
        setTimeout(() => {
            this.addValueLeaves(tree);
        }, 500);
    }
    
    addValueLeaves(tree) {
        const leafCount = 8;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('span');
            leaf.className = 'value-leaf';
            leaf.textContent = '🍃';
            leaf.style.top = Math.random() * 60 + 'px';
            leaf.style.left = Math.random() * 100 + '%';
            tree.appendChild(leaf);
            
            setTimeout(() => {
                leaf.style.opacity = '1';
                leaf.style.transform = 'scale(1)';
            }, i * 50);
        }
    }
    
    setupBioImage() {
        const bioImage = document.querySelector('.bio-image');
        if (!bioImage) return;
        
        const floaters = bioImage.querySelectorAll('.floater');
        
        // Animate floaters
        floaters.forEach((floater, index) => {
            floater.style.animationDelay = `${index * 2}s`;
        });
        
        // Interactive frame corners
        const corners = bioImage.querySelectorAll('.frame-corner');
        corners.forEach(corner => {
            corner.addEventListener('mouseenter', () => {
                this.sparkleEffect(corner);
            });
        });
    }
    
    sparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = '50%';
        sparkle.style.top = '50%';
        element.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-parallax') || 0.5;
                const offset = scrolled * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        });
    }
}

// Timeline Visualization
class TimelineVisualization {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rings = [];
        
        this.init();
    }
    
    init() {
        const container = document.querySelector('.timeline-trunk');
        if (!container) return;
        
        container.appendChild(this.canvas);
        this.resize();
        this.createRings();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = 60;
        this.canvas.height = 400;
    }
    
    createRings() {
        const years = [2015, 2018, 2021, 2024];
        const spacing = this.canvas.height / (years.length + 1);
        
        years.forEach((year, index) => {
            this.rings.push({
                y: spacing * (index + 1),
                radius: 0,
                targetRadius: 25,
                opacity: 0,
                year: year
            });
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw trunk
        this.ctx.fillStyle = '#6D4C41';
        this.ctx.fillRect(25, 0, 10, this.canvas.height);
        
        // Draw rings
        this.rings.forEach((ring, index) => {
            if (ring.radius < ring.targetRadius) {
                ring.radius += 0.5;
                ring.opacity = Math.min(ring.opacity + 0.02, 0.8);
            }
            
            this.ctx.strokeStyle = `rgba(62, 39, 35, ${ring.opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(30, ring.y, ring.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Draw year
            if (ring.opacity > 0.5) {
                this.ctx.fillStyle = `rgba(27, 67, 50, ${ring.opacity})`;
                this.ctx.font = '12px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(ring.year, 30, ring.y + 4);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
    new TimelineVisualization();
});

// Add page-specific styles
const aboutStyles = document.createElement('style');
aboutStyles.textContent = `
    /* Timeline Styles */
    .timeline-trunk {
        position: relative;
        width: 60px;
        margin: 0 auto;
        height: 400px;
    }
    
    .timeline-trunk.growing {
        animation: growTrunk 2s ease forwards;
    }
    
    .timeline-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .marker-ring {
        transform: scale(0);
        transition: transform 0.6s ease;
    }
    
    .floating-leaf {
        position: absolute;
        animation: floatAway 4s ease forwards;
    }
    
    @keyframes floatAway {
        to {
            transform: translate(50px, -100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    /* Education Tree */
    .tree-svg * {
        opacity: 0;
        transform: scale(0.8);
        transform-origin: center;
        transition: all 0.8s ease;
    }
    
    .edu-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .edu-card:hover {
        transform: translate(-50%, -50%) scale(1.1) !important;
        z-index: 10;
    }
    
    .education-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 150%;
        background: radial-gradient(circle, rgba(132, 169, 140, 0.4), transparent);
        border-radius: 50%;
        animation: glowPulse 1s ease;
    }
    
    @keyframes glowPulse {
        from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    
    /* Expertise Rings */
    .ring-fill {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, transparent 40%, rgba(132, 169, 140, 0.2));
        border-radius: 50%;
        transform: scale(0);
        transition: transform 0.8s ease;
    }
    
    .icon-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border: 2px solid #84A98C;
        border-radius: 50%;
        animation: pulse 1s ease;
    }
    
    /* Value Trees */
    .value-tree {
        position: relative;
        height: 200px;
        cursor: pointer;
    }
    
    .value-branch {
        position: absolute;
        bottom: 50px;
        left: 50%;
        width: 2px;
        height: 0;
        background: #6D4C41;
        transform-origin: bottom;
        transition: height 0.5s ease;
    }
    
    .value-leaf {
        position: absolute;
        font-size: 20px;
        opacity: 0;
        transform: scale(0);
        transition: all 0.5s ease;
    }
    
    /* Bio Image Effects */
    .sparkle {
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #fffacd, transparent);
        border-radius: 50%;
        animation: sparkle 1s ease;
    }
    
    @keyframes sparkle {
        from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
`;
document.head.appendChild(aboutStyles);