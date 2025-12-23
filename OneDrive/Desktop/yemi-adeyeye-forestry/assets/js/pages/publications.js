/**
 * publications.js - Publications page functionality for Dr. Yemi Adeyeye's website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize publication filters
  initPublicationFilters();
  
  // Initialize search functionality
  initSearch();
  
  // Initialize sort functionality
  initSort();
  
  // Initialize load more functionality
  initLoadMore();
});

/**
 * Initialize publication type filtering
 */
function initPublicationFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const publicationItems = document.querySelectorAll('.publication-item');
  
  if (!filterButtons.length || !publicationItems.length) return;
  
  // Set up click handlers for filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Get selected filter
      const filter = this.getAttribute('data-filter');
      
      // Filter publications
      publicationItems.forEach(item => {
        if (filter === 'all') {
          item.style.display = 'block';
          
          // Use setTimeout to ensure display: block is applied before animating
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          const pubType = item.getAttribute('data-type');
          
          if (pubType === filter) {
            item.style.display = 'block';
            
            // Use setTimeout to ensure display: block is applied before animating
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Hide element after transition
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
}

/**
 * Initialize publication search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('pubSearch');
  const publicationItems = document.querySelectorAll('.publication-item');
  
  if (!searchInput || !publicationItems.length) return;
  
  // Add input event listener
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      // Show all publications if search is empty
      publicationItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
      return;
    }
    
    // Filter publications based on search term
    publicationItems.forEach(item => {
      const title = item.querySelector('.pub-title').textContent.toLowerCase();
      const authors = item.querySelector('.pub-authors').textContent.toLowerCase();
      const journal = item.querySelector('.pub-journal').textContent.toLowerCase();
      const abstract = item.querySelector('.pub-abstract')?.textContent.toLowerCase() || '';
      const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      
      // Check if publication contains search term
      const hasMatch = title.includes(searchTerm) || 
                       authors.includes(searchTerm) || 
                       journal.includes(searchTerm) || 
                       abstract.includes(searchTerm) || 
                       tags.includes(searchTerm);
      
      if (hasMatch) {
        item.style.display = 'block';
        
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  });
  
  // Add search button click event
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      // Trigger input event to perform search
      const event = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(event);
    });
  }
}

/**
 * Initialize publication sorting functionality
 */
function initSort() {
  const sortSelect = document.getElementById('sortSelect');
  const publicationsList = document.querySelector('.publications-list');
  
  if (!sortSelect || !publicationsList) return;
  
  sortSelect.addEventListener('change', function() {
    const sortValue = this.value;
    const publications = Array.from(publicationsList.querySelectorAll('.publication-item'));
    
    // Sort publications based on selected option
    publications.sort((a, b) => {
      if (sortValue === 'date-desc') {
        // Sort by year (newest first)
        const yearA = parseInt(a.querySelector('.pub-year-badge').textContent, 10);
        const yearB = parseInt(b.querySelector('.pub-year-badge').textContent, 10);
        return yearB - yearA;
      } else if (sortValue === 'date-asc') {
        // Sort by year (oldest first)
        const yearA = parseInt(a.querySelector('.pub-year-badge').textContent, 10);
        const yearB = parseInt(b.querySelector('.pub-year-badge').textContent, 10);
        return yearA - yearB;
      } else if (sortValue === 'citations') {
        // Sort by citations (highest first)
        const citationsA = parseInt(a.querySelector('.pub-metrics .metric:first-child')?.textContent.match(/\d+/) || 0, 10);
        const citationsB = parseInt(b.querySelector('.pub-metrics .metric:first-child')?.textContent.match(/\d+/) || 0, 10);
        return citationsB - citationsA;
      } else if (sortValue === 'title') {
        // Sort by title (A-Z)
        const titleA = a.querySelector('.pub-title').textContent.toLowerCase();
        const titleB = b.querySelector('.pub-title').textContent.toLowerCase();
        return titleA.localeCompare(titleB);
      }
      
      return 0;
    });
    
    // Reappend sorted publications
    publications.forEach(pub => {
      publicationsList.appendChild(pub);
      
      // Add a small delay for visual distinction
      setTimeout(() => {
        pub.classList.add('sorted');
        
        // Remove class after animation completes
        setTimeout(() => {
          pub.classList.remove('sorted');
        }, 500);
      }, 10);
    });
  });
}

/**
 * Initialize load more functionality
 */
function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMorePubs');
  const publicationsList = document.querySelector('.publications-list');
  const loadingIndicator = document.querySelector('.loading-indicator');
  
  if (!loadMoreBtn || !publicationsList) return;
  
  // Set initial state
  let page = 1;
  const perPage = 5;
  let isLoading = false;
  
  loadMoreBtn.addEventListener('click', function() {
    if (isLoading) return;
    
    // Show loading indicator
    isLoading = true;
    loadMoreBtn.style.display = 'none';
    loadingIndicator.style.display = 'block';
    
    // Simulate loading delay (in real implementation, this would be an AJAX request)
    setTimeout(() => {
      // For demo purposes, we'll just hide the button after "loading" more content
      isLoading = false;
      loadingIndicator.style.display = 'none';
      loadMoreBtn.style.display = 'none';
      
      // Show a message that all content is loaded
      const allLoadedMessage = document.createElement('p');
      allLoadedMessage.className = 'all-loaded-message';
      allLoadedMessage.textContent = 'All publications have been loaded';
      publicationsList.parentNode.appendChild(allLoadedMessage);
    }, 1500);
  });
}

/**
 * Initialize citation chart
 */
document.addEventListener('DOMContentLoaded', function() {
  const citationChartElem = document.getElementById('citationChart');
  
  if (!citationChartElem || !window.Chart) return;
  
  const ctx = citationChartElem.getContext('2d');
  
  const citationChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [{
        label: 'Citations per Year',
        data: [5, 12, 24, 35, 48, 62, 89, 120, 150],
        backgroundColor: 'rgba(132, 169, 140, 0.2)',
        borderColor: '#1B4332',
        borderWidth: 2,
        pointBackgroundColor: '#52796F',
        pointBorderColor: '#ffffff',
        pointRadius: 5,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(27, 67, 50, 0.8)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 14
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 14
          },
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif"
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif"
            }
          }
        }
      }
    }
  });
});

/**
 * Initialize research areas interaction
 */
document.addEventListener('DOMContentLoaded', function() {
  const researchAreas = document.querySelectorAll('.research-area');
  
  researchAreas.forEach(area => {
    area.addEventListener('mouseenter', function() {
      this.classList.add('active');
    });
    
    area.addEventListener('mouseleave', function() {
      this.classList.remove('active');
    });
  });
});