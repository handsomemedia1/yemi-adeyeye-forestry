// ========================================
// Main JavaScript File - Dr. Yemi Adeyeye Portfolio
// ========================================

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initLoader();
  initSmoothScroll();
  initAnimations();
  initCounters();
  initParallax();
  initLazyLoading();
  initScrollToTop();
  initVideoBackground();
});

// Loader
function initLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
      // Hide loader immediately - don't wait for all resources
      setTimeout(function() {
          loader.classList.add('fade-out');
          setTimeout(function() {
              loader.style.display = 'none';
          }, 500);
      }, 300); // Reduced from 800ms to 300ms for faster content visibility
  }
}

// Smooth Scroll
function initSmoothScroll() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
              const navHeight = document.querySelector('.main-nav').offsetHeight;
              const targetPosition = targetSection.offsetTop - navHeight - 20;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
}

// Animation on Scroll
function initAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              
              // For timeline items, add staggered animation
              if (entry.target.classList.contains('timeline-item')) {
                  const items = document.querySelectorAll('.timeline-item');
                  items.forEach((item, index) => {
                      if (item === entry.target) {
                          setTimeout(() => {
                              item.classList.add('visible');
                          }, index * 100);
                      }
                  });
              }
          }
      });
  }, observerOptions);
  
  // Observe elements
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .timeline-item, .stat-item');
  animatedElements.forEach(el => observer.observe(el));
}

// Number Counters
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const speed = 200; // Animation speed
  
  const countUp = (counter) => {
      const target = parseInt(counter.getAttribute('data-count'));
      const count = parseInt(counter.innerText);
      const increment = target / speed;
      
      if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(() => countUp(counter), 10);
      } else {
          counter.innerText = target.toLocaleString();
      }
  };
  
  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
              entry.target.classList.add('counted');
              countUp(entry.target);
          }
      });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
      counter.innerText = '0';
      counterObserver.observe(counter);
  });
}

// Parallax Effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  if (parallaxElements.length > 0) {
      window.addEventListener('scroll', () => {
          const scrolled = window.pageYOffset;
          
          parallaxElements.forEach(element => {
              const speed = element.dataset.speed || 0.5;
              const yPos = -(scrolled * speed);
              element.style.transform = `translateY(${yPos}px)`;
          });
      });
  }
}

// Lazy Loading Images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                  imageObserver.unobserve(img);
                  
                  // Add loaded class for fade-in effect
                  img.addEventListener('load', () => {
                      img.classList.add('loaded');
                  });
              }
          });
      }, { rootMargin: '50px 0px' });
      
      lazyImages.forEach(img => imageObserver.observe(img));
  } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
      });
  }
}

// Scroll to Top Button
function initScrollToTop() {
  // Create scroll to top button if it doesn't exist
  let scrollTopBtn = document.getElementById('scrollToTop');
  
  if (!scrollTopBtn) {
      scrollTopBtn = document.createElement('button');
      scrollTopBtn.id = 'scrollToTop';
      scrollTopBtn.className = 'fab';
      scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      scrollTopBtn.style.display = 'none';
      document.body.appendChild(scrollTopBtn);
  }
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
          scrollTopBtn.style.display = 'flex';
          scrollTopBtn.classList.add('visible');
      } else {
          scrollTopBtn.classList.remove('visible');
          setTimeout(() => {
              if (!scrollTopBtn.classList.contains('visible')) {
                  scrollTopBtn.style.display = 'none';
              }
          }, 300);
      }
  });
  
  // Scroll to top on click
  scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
}

// Video Background
function initVideoBackground() {
  const heroVideo = document.getElementById('heroVideo');
  
  if (heroVideo) {
      // Lazy load video sources
      const sources = heroVideo.querySelectorAll('source');
      sources.forEach(source => {
          if (source.dataset.src) {
              source.src = source.dataset.src;
          }
      });
      
      // Load the video
      heroVideo.load();
      
      // Ensure video plays on mobile
      heroVideo.play().catch(e => {
          console.log('Video autoplay failed:', e);
      });
      
      // Pause video when not in viewport to save resources
      const videoObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  heroVideo.play();
              } else {
                  heroVideo.pause();
              }
          });
      }, { threshold: 0.25 });
      
      videoObserver.observe(heroVideo);
  }
}

// Utility Functions
const utils = {
  // Debounce function
  debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  },
  
  // Throttle function
  throttle: function(func, limit) {
      let inThrottle;
      return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      };
  },
  
  // Get cookie value
  getCookie: function(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  },
  
  // Set cookie
  setCookie: function(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
  },
  
  // Format number with commas
  formatNumber: function(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // Check if element is in viewport
  isInViewport: function(element) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }
};

// Export for use in other modules
window.DrYemiUtils = utils;

// Performance optimization
window.addEventListener('load', () => {
  // Remove loading classes
  document.body.classList.add('loaded');
  
  // Preload critical images
  const criticalImages = document.querySelectorAll('.hero-image, .profile-image');
  criticalImages.forEach(img => {
      if (img.dataset.src) {
          const imageLoader = new Image();
          imageLoader.src = img.dataset.src;
          imageLoader.onload = () => {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
          };
      }
  });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
      // Pause animations when page is not visible
      document.querySelectorAll('video').forEach(video => video.pause());
  } else {
      // Resume animations when page becomes visible
      document.querySelectorAll('video').forEach(video => {
          if (video.classList.contains('hero-video')) {
              video.play();
          }
      });
  }
});

// Scroll progress indicator
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'nav-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
  });
}

// Initialize scroll progress
initScrollProgress();

// Error handling for images
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
      e.target.src = '/assets/images/placeholder.jpg';
      e.target.classList.add('image-error');
  }
}, true);

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
  // Add keyboard navigation for interactive elements
  if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Custom cursor (optional enhancement)
function initCustomCursor() {
  if (window.innerWidth > 1024) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
      
      document.addEventListener('mousemove', (e) => {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
      });
      
      document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
      document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
  }
}

// Console message
console.log('%c👋 Welcome to Dr. Yemi Adeyeye\'s Portfolio', 
  'color: #1B4332; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c🌳 Exploring the intersection of forests, communities, and sustainable futures', 
  'color: #52796F; font-size: 14px; padding: 5px;');