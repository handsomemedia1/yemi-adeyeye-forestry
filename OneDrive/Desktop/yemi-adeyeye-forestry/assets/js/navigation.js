// ========================================
// Navigation JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  resetMenuStyles();
  initNavigation();
  initMobileMenu();
  initScrollBehavior();
  initActiveLinks();
  initNavProgress();
});

// Reset menu styles on page load
function resetMenuStyles() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  const menuItems = navMenu.querySelectorAll('.nav-link');
  menuItems.forEach(item => {
    item.style.opacity = '';
    item.style.transform = '';
    item.style.transition = '';
  });
}

// Main Navigation Initialization
function initNavigation() {
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!nav || !navToggle || !navMenu) return;
  
  // Create overlay for mobile menu
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);
  
  // Toggle mobile menu
  navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.contains('active');
      
      if (isOpen) {
          closeMobileMenu();
      } else {
          openMobileMenu();
      }
  });
  
  // Close menu when overlay is clicked
  overlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
              closeMobileMenu();
          }
      });
  });
  
  // Handle escape key
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMobileMenu();
      }
  });
}

// Mobile Menu Functions
function openMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.querySelector('.nav-overlay');
  
  navToggle.classList.add('active');
  navMenu.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Skip animation on mobile to prevent visibility issues
  // Menu items will appear immediately without animation
}

function closeMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.querySelector('.nav-overlay');

  navToggle.classList.remove('active');
  navMenu.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Reset all menu item inline styles
  const menuItems = navMenu.querySelectorAll('.nav-link');
  menuItems.forEach(item => {
    item.style.opacity = '';
    item.style.transform = '';
    item.style.transition = '';
  });
}

// Mobile Menu Handler
function initMobileMenu() {
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          if (window.innerWidth > 768) {
              closeMobileMenu();
          }
      }, 250);
  });
}

// Scroll Behavior
function initScrollBehavior() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  
  let lastScrollTop = 0;
  let scrollTimer;
  const scrollThreshold = 100;
  
  // Check if navigation should be dark on page load
  checkNavMode();
  
  window.addEventListener('scroll', DrYemiUtils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class
      if (scrollTop > 50) {
          nav.classList.add('scrolled');
      } else {
          nav.classList.remove('scrolled');
      }
      
      // Hide/show navigation on scroll
      if (scrollTop > scrollThreshold) {
          if (scrollTop > lastScrollTop && scrollTop > 300) {
              // Scrolling down
              nav.style.transform = 'translateY(-100%)';
          } else {
              // Scrolling up
              nav.style.transform = 'translateY(0)';
              nav.classList.add('sticky-show');
          }
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      
      // Check navigation mode
      checkNavMode();
      
  }, 100));
}

// Check if navigation should be in dark mode
function checkNavMode() {
  const nav = document.getElementById('mainNav');
  const heroSection = document.querySelector('.hero-section');
  const pageHeader = document.querySelector('.page-header');
  
  if (!nav) return;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Determine if we're over a dark section
  let isDarkSection = false;
  
  if (heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      isDarkSection = scrollTop < heroBottom - 100;
  }
  
  if (pageHeader && !heroSection) {
      const headerBottom = pageHeader.offsetTop + pageHeader.offsetHeight;
      isDarkSection = scrollTop < headerBottom - 100;
  }
  
  // Apply dark mode class
  if (isDarkSection && scrollTop < 50) {
      nav.classList.add('dark-mode');
  } else {
      nav.classList.remove('dark-mode');
  }
}

// Active Link Management
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  // Highlight current page in navigation
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath === '/index.html') ||
          (currentPath === '/index.html' && linkPath === '/')) {
          link.classList.add('active');
      }
  });
  
  // Scroll spy for single page sections
  const scrollSpy = () => {
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              navLinks.forEach(link => {
                  link.classList.remove('active');
                  if (link.getAttribute('href') === `#${sectionId}`) {
                      link.classList.add('active');
                  }
              });
          }
      });
  };
  
  // Only run scroll spy on pages with sections
  if (document.querySelector('.hero-section')) {
      window.addEventListener('scroll', DrYemiUtils.throttle(scrollSpy, 100));
  }
}

// Navigation Progress Indicator
function initNavProgress() {
  // Progress bar is created in main.js
  const progressBar = document.querySelector('.nav-progress');
  if (!progressBar) return;
  
  // Update progress bar color based on page
  const updateProgressColor = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent < 33) {
          progressBar.style.background = 'var(--primary-light)';
      } else if (scrollPercent < 66) {
          progressBar.style.background = 'var(--primary-medium)';
      } else {
          progressBar.style.background = 'var(--primary-dark)';
      }
  };
  
  window.addEventListener('scroll', DrYemiUtils.throttle(updateProgressColor, 100));
}

// Dropdown Menu Handler (if needed in future)
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (!toggle || !menu) return;
      
      // Mouse events for desktop
      dropdown.addEventListener('mouseenter', () => {
          if (window.innerWidth > 768) {
              showDropdown(menu);
          }
      });
      
      dropdown.addEventListener('mouseleave', () => {
          if (window.innerWidth > 768) {
              hideDropdown(menu);
          }
      });
      
      // Click event for mobile
      toggle.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
              e.preventDefault();
              menu.classList.toggle('active');
          }
      });
  });
}

// Dropdown helper functions
function showDropdown(menu) {
  menu.style.display = 'block';
  setTimeout(() => {
      menu.classList.add('active');
  }, 10);
}

function hideDropdown(menu) {
  menu.classList.remove('active');
  setTimeout(() => {
      menu.style.display = 'none';
  }, 300);
}

// Breadcrumb Navigation
function initBreadcrumbs() {
  const breadcrumbNav = document.querySelector('.breadcrumb-nav');
  if (!breadcrumbNav) return;
  
  // Generate breadcrumbs based on URL
  const path = window.location.pathname.split('/').filter(p => p);
  const breadcrumbList = breadcrumbNav.querySelector('.breadcrumb-list');
  
  if (!breadcrumbList) return;
  
  // Clear existing breadcrumbs
  breadcrumbList.innerHTML = '';
  
  // Add home
  const homeLi = document.createElement('li');
  homeLi.className = 'breadcrumb-item';
  homeLi.innerHTML = '<a href="/">Home</a>';
  breadcrumbList.appendChild(homeLi);
  
  // Add path segments
  let currentPath = '';
  path.forEach((segment, index) => {
      currentPath += '/' + segment;
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';
      
      // Format segment name
      const name = segment.replace('.html', '').replace(/-/g, ' ');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      
      if (index === path.length - 1) {
          // Last item (current page)
          li.textContent = formattedName;
      } else {
          // Link to parent pages
          li.innerHTML = `<a href="${currentPath}">${formattedName}</a>`;
      }
      
      breadcrumbList.appendChild(li);
  });
}

// Accessibility enhancements
function initAccessibility() {
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  
  if (!nav || !navToggle) return;
  
  // Add ARIA labels
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'navMenu');
  
  // Update ARIA on toggle
  const originalToggleClick = navToggle.onclick;
  navToggle.onclick = function(e) {
      if (originalToggleClick) originalToggleClick.call(this, e);
      
      const isExpanded = this.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
  };
  
  // Skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure main content has ID
  const mainContent = document.querySelector('main') || document.querySelector('.hero-section') || document.querySelector('.page-header');
  if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
  }
}

// Initialize accessibility features
initAccessibility();

// Sticky navigation polyfill for older browsers
if (!CSS.supports('position', 'sticky')) {
  const nav = document.getElementById('mainNav');
  if (nav) {
      let navTop = nav.offsetTop;
      
      window.addEventListener('scroll', () => {
          if (window.scrollY >= navTop) {
              nav.classList.add('sticky-polyfill');
              document.body.style.paddingTop = nav.offsetHeight + 'px';
          } else {
              nav.classList.remove('sticky-polyfill');
              document.body.style.paddingTop = '0';
          }
      });
  }
}

// Export navigation functions
window.Navigation = {
  openMobileMenu,
  closeMobileMenu,
  checkNavMode
};