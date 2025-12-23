/**
 * projects.js - Project page functionality for Dr. Yemi Adeyeye's website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize project filters
  initProjectFilters();
  
  // Initialize expand/collapse functionality
  initExpandButtons();
  
  // Smooth scroll to project details
  initProjectDetailScroll();
});

/**
 * Initialize project category filtering
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!filterButtons.length || !projectCards.length) return;
  
  // Set up click handlers for filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Get selected filter
      const filter = this.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
          
          // Use setTimeout to ensure display: block is applied before animating
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          const cardFilters = card.getAttribute('data-filter');
          
          if (cardFilters && cardFilters.includes(filter)) {
            card.style.display = 'block';
            
            // Use setTimeout to ensure display: block is applied before animating
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Hide element after transition
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
}

/**
 * Initialize expand/collapse buttons for project details
 */
function initExpandButtons() {
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  if (!expandButtons.length) return;
  
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const projectCard = this.closest('.project-card');
      const projectDetails = projectCard.querySelector('.project-details');
      
      if (projectCard.classList.contains('expanded')) {
        // Collapse
        projectCard.classList.remove('expanded');
        this.innerHTML = '<span>Read Full Case Study</span><i class="fas fa-external-link-alt"></i>';
        
        // Animate collapse
        projectDetails.style.maxHeight = '0';
      } else {
        // Expand
        projectCard.classList.add('expanded');
        this.innerHTML = '<span>Collapse</span><i class="fas fa-chevron-up"></i>';
        
        // Animate expansion
        projectDetails.style.maxHeight = projectDetails.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Initialize smooth scrolling to project details
 */
function initProjectDetailScroll() {
  // Get featured project button
  const featureButton = document.querySelector('.featured-details .btn');
  
  if (featureButton) {
    featureButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get target element
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate position
        const navbarHeight = document.getElementById('mainNav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Highlight target element
        targetElement.classList.add('highlight');
        
        // Remove highlight class after animation
        setTimeout(() => {
          targetElement.classList.remove('highlight');
        }, 2000);
      }
    });
  }
}

/**
 * Initialize project timeline animations
 */
document.addEventListener('DOMContentLoaded', function() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineItems.length) return;
  
  // Set up intersection observer for timeline items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
  });
  
  // Observe each timeline item
  timelineItems.forEach(item => {
    observer.observe(item);
  });
});

/**
 * Handle project sorting
 */
document.addEventListener('DOMContentLoaded', function() {
  const projectGrid = document.querySelector('.projects-grid');
  const sortSelect = document.getElementById('projectSort');
  
  if (!projectGrid || !sortSelect) return;
  
  sortSelect?.addEventListener('change', function() {
    const projects = Array.from(projectGrid.querySelectorAll('.project-card'));
    const sortValue = this.value;
    
    // Sort projects
    projects.sort((a, b) => {
      if (sortValue === 'newest') {
        // Sort by year (newest first)
        const yearA = parseInt(a.querySelector('.project-year')?.textContent || '0', 10);
        const yearB = parseInt(b.querySelector('.project-year')?.textContent || '0', 10);
        return yearB - yearA;
      } else if (sortValue === 'oldest') {
        // Sort by year (oldest first)
        const yearA = parseInt(a.querySelector('.project-year')?.textContent || '0', 10);
        const yearB = parseInt(b.querySelector('.project-year')?.textContent || '0', 10);
        return yearA - yearB;
      } else if (sortValue === 'title') {
        // Sort by title
        const titleA = a.querySelector('h3')?.textContent || '';
        const titleB = b.querySelector('h3')?.textContent || '';
        return titleA.localeCompare(titleB);
      }
      
      return 0;
    });
    
    // Reappend sorted items
    projects.forEach(project => {
      projectGrid.appendChild(project);
    });
  });
});

/**
 * Project impact counter animation
 */
document.addEventListener('DOMContentLoaded', function() {
  const statNumbers = document.querySelectorAll('.impact-stat .stat-number');
  
  if (!statNumbers.length) return;
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const countTarget = statNumber.getAttribute('data-count');
        
        if (countTarget) {
          const targetValue = parseInt(countTarget, 10);
          animateCounter(statNumber, targetValue);
        }
        
        observer.unobserve(statNumber);
      }
    });
  }, options);
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
  
  function animateCounter(element, target) {
    let start = 0;
    const duration = 2000; // ms
    const increment = target / 100;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current count
      const currentCount = Math.floor(easedProgress * target);
      
      // Update display with appropriate formatting
      if (target >= 1000) {
        element.textContent = currentCount.toLocaleString();
      } else {
        element.textContent = currentCount;
      }
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final number is exactly the target
        if (target >= 1000) {
          element.textContent = parseInt(target).toLocaleString();
        } else {
          element.textContent = target;
        }
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
});