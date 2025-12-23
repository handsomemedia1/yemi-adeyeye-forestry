// Global Forest Impact Animations
document.addEventListener('DOMContentLoaded', function() {

    // Animated Counter Function
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                // Format number with commas if over 1000
                const displayValue = current >= 1000
                    ? Math.floor(current).toLocaleString()
                    : Math.floor(current);
                element.textContent = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                // Final value with proper formatting
                element.textContent = target >= 1000
                    ? target.toLocaleString()
                    : target;
            }
        };

        updateCounter();
    }

    // Intersection Observer for triggering animations when in view
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                // Animate stat numbers
                if (entry.target.classList.contains('stats-container')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.parentElement.classList.add('stat-visible');
                            animateCounter(stat);
                        }, index * 150);
                    });
                }

                // Animate world map
                if (entry.target.classList.contains('world-map')) {
                    animateWorldMap();
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const statsContainer = document.querySelector('.stats-container');
    const worldMap = document.querySelector('.world-map');

    if (statsContainer) observer.observe(statsContainer);
    if (worldMap) observer.observe(worldMap);

    // World Map Animation
    function animateWorldMap() {
        const paths = document.querySelectorAll('.country-path');
        const circles = document.querySelectorAll('.country-path[cx]');
        const lines = document.querySelectorAll('#world-map-svg line');

        // Animate continents
        paths.forEach((path, index) => {
            setTimeout(() => {
                path.classList.add('path-visible');
            }, index * 100);
        });

        // Animate connection lines
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('line-visible');
            }, paths.length * 100 + index * 200);
        });

        // Add pulsing effect to circles
        setTimeout(() => {
            circles.forEach(circle => {
                circle.classList.add('pulse-animation');
            });
        }, (paths.length + lines.length) * 100);
    }

    // Interactive hover effects for map regions
    const countryPaths = document.querySelectorAll('.country-path');
    const impactTooltip = createTooltip();

    const regionData = {
        0: { name: 'North America', countries: 12, trees: 8500, youth: 2100 },
        1: { name: 'South America', countries: 15, trees: 6200, youth: 1800 },
        2: { name: 'Europe', countries: 18, trees: 4300, youth: 950 },
        3: { name: 'Africa', countries: 22, trees: 3800, youth: 850 },
        4: { name: 'Asia', countries: 28, trees: 9500, youth: 2400 },
        5: { name: 'Australia', countries: 5, trees: 1700, youth: 400 }
    };

    countryPaths.forEach((path, index) => {
        if (index < 6) { // Only continents, not circles
            path.addEventListener('mouseenter', (e) => {
                const data = regionData[index];
                if (data) {
                    showTooltip(e, data);
                    path.style.filter = 'brightness(1.3)';
                }
            });

            path.addEventListener('mousemove', (e) => {
                updateTooltipPosition(e);
            });

            path.addEventListener('mouseleave', () => {
                hideTooltip();
                path.style.filter = '';
            });
        }
    });

    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'impact-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(27, 67, 50, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(183, 228, 199, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    function showTooltip(e, data) {
        impactTooltip.innerHTML = `
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #B7E4C7;">
                ${data.name}
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <div>🌍 <strong>${data.countries}</strong> countries</div>
                <div>🌳 <strong>${data.trees.toLocaleString()}</strong> trees planted</div>
                <div>👥 <strong>${data.youth.toLocaleString()}</strong> youth engaged</div>
            </div>
        `;
        impactTooltip.style.opacity = '1';
        updateTooltipPosition(e);
    }

    function updateTooltipPosition(e) {
        const offset = 15;
        impactTooltip.style.left = (e.clientX + offset) + 'px';
        impactTooltip.style.top = (e.clientY + offset) + 'px';
    }

    function hideTooltip() {
        impactTooltip.style.opacity = '0';
    }

    // Continuous pulse animation for connection points
    setInterval(() => {
        const circles = document.querySelectorAll('.country-path[cx]');
        circles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.animation = 'none';
                setTimeout(() => {
                    circle.style.animation = '';
                }, 10);
            }, index * 100);
        });
    }, 5000);
});
