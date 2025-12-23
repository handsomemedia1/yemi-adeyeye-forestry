// ========================================
// Media Page JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initMediaFilters();
  initAudioPlayer();
  initVideoPlayers();
  initLoadMore();
  initMediaGallery();
  initSpeakingTimeline();
});

// Media Filtering
function initMediaFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mediaCards = document.querySelectorAll('.media-card');
  
  if (filterButtons.length === 0 || mediaCards.length === 0) return;
  
  // Ensure all cards are visible on load
  filterMedia('all');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Update active state
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Get filter value
          const filterValue = this.getAttribute('data-filter');
          
          // Filter media cards
          filterMedia(filterValue);
          
          // Update URL without page reload
          const url = new URL(window.location);
          url.searchParams.set('filter', filterValue);
          window.history.pushState({}, '', url);
      });
  });
  
  // Check URL for filter on load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
      const filterButton = document.querySelector(`[data-filter="${filterParam}"]`);
      if (filterButton) {
          filterButton.click();
      }
  }
}

// Filter media cards with animation
function filterMedia(filter) {
  const mediaCards = document.querySelectorAll('.media-card');
  const visibleCards = [];
  
  mediaCards.forEach((card, index) => {
      const categories = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || (categories && categories.includes(filter));
      
      if (shouldShow) {
          visibleCards.push(card);
          // Ensure card is visible
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
      } else {
          // Hide card with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
              card.style.display = 'none';
          }, 300);
      }
  });
  
  // Update results count
  updateResultsCount(visibleCards.length);
}

// Update results count
function updateResultsCount(count) {
  let resultsElement = document.querySelector('.results-count');
  
  if (!resultsElement) {
      resultsElement = document.createElement('div');
      resultsElement.className = 'results-count';
      const filterContainer = document.querySelector('.filter-container');
      if (filterContainer) {
          filterContainer.parentNode.insertBefore(resultsElement, filterContainer.nextSibling);
      }
  }
  
  resultsElement.textContent = `Showing ${count} ${count === 1 ? 'item' : 'items'}`;
  resultsElement.style.opacity = '0';
  
  setTimeout(() => {
      resultsElement.style.opacity = '1';
  }, 100);
}

// Audio Player
function initAudioPlayer() {
  const playButtons = document.querySelectorAll('.play-btn[data-audio]');
  const audioPlayer = document.getElementById('audioPlayer');
  const audioElement = document.getElementById('audioElement');
  const closePlayer = document.querySelector('.close-player');
  
  if (!playButtons.length || !audioPlayer || !audioElement) return;
  
  playButtons.forEach(button => {
      button.addEventListener('click', function() {
          const audioSrc = this.getAttribute('data-audio');
          const mediaCard = this.closest('.media-card');
          
          if (mediaCard) {
              const title = mediaCard.querySelector('h3').textContent;
              const source = mediaCard.querySelector('.media-source span').textContent;
              
              // Update player info
              document.querySelector('.audio-title').textContent = title;
              document.querySelector('.audio-source').textContent = source;
              
              // Set audio source and play
              audioElement.src = audioSrc;
              audioPlayer.classList.add('active');
              
              // Play with promise handling
              const playPromise = audioElement.play();
              
              if (playPromise !== undefined) {
                  playPromise.then(() => {
                      // Audio started successfully
                      updateWaveformAnimation(true);
                  }).catch(error => {
                      console.error('Audio playback failed:', error);
                      showPlaybackError();
                  });
              }
          }
      });
  });
  
  // Close player
  if (closePlayer) {
      closePlayer.addEventListener('click', function() {
          audioPlayer.classList.remove('active');
          audioElement.pause();
          audioElement.currentTime = 0;
          updateWaveformAnimation(false);
      });
  }
  
  // Update waveform animation
  if (audioElement) {
      audioElement.addEventListener('play', () => updateWaveformAnimation(true));
      audioElement.addEventListener('pause', () => updateWaveformAnimation(false));
      audioElement.addEventListener('ended', () => {
          updateWaveformAnimation(false);
          // Auto-close after a delay
          setTimeout(() => {
              audioPlayer.classList.remove('active');
          }, 2000);
      });
  }
}

// Update waveform animation
function updateWaveformAnimation(playing) {
  const waveformBars = document.querySelectorAll('.waveform-bars .bar');
  
  waveformBars.forEach(bar => {
      if (playing) {
          bar.style.animationPlayState = 'running';
      } else {
          bar.style.animationPlayState = 'paused';
      }
  });
}

// Show playback error
function showPlaybackError() {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'playback-error';
  errorMessage.textContent = 'Unable to play audio. Please try again.';
  document.body.appendChild(errorMessage);
  
  setTimeout(() => {
      errorMessage.remove();
  }, 3000);
}

// Video Players
function initVideoPlayers() {
  const videoThumbnails = document.querySelectorAll('.media-image .play-overlay');
  
  videoThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
          const mediaCard = this.closest('.media-card');
          const videoUrl = mediaCard.getAttribute('data-video-url');
          
          if (videoUrl) {
              // Create modal for video
              createVideoModal(videoUrl);
          }
      });
  });
}

// Create video modal
function createVideoModal(videoUrl) {
  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'video-modal';
  modal.innerHTML = `
      <div class="video-modal-content">
          <button class="close-modal">&times;</button>
          <div class="video-container">
              <iframe src="${videoUrl}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
              </iframe>
          </div>
      </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Fade in
  setTimeout(() => {
      modal.classList.add('active');
  }, 10);
  
  // Close modal
  const closeModal = modal.querySelector('.close-modal');
  closeModal.addEventListener('click', () => {
      closeVideoModal(modal);
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          closeVideoModal(modal);
      }
  });
  
  // Close on escape
  document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
          closeVideoModal(modal);
          document.removeEventListener('keydown', escapeHandler);
      }
  });
}

// Close video modal
function closeVideoModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  setTimeout(() => {
      modal.remove();
  }, 300);
}

// Load More Media
function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreMedia');
  const mediaGrid = document.querySelector('.media-grid');
  
  if (!loadMoreBtn || !mediaGrid) return;
  
  let currentPage = 1;
  const itemsPerPage = 6;
  
  loadMoreBtn.addEventListener('click', function() {
      const button = this;
      const loadingIndicator = document.querySelector('.loading-indicator');
      
      // Show loading state
      button.disabled = true;
      button.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
      if (loadingIndicator) {
          loadingIndicator.classList.add('active');
      }
      
      // Simulate loading delay
      setTimeout(() => {
          // Load more items (in real implementation, this would be an API call)
          loadMoreItems(currentPage + 1, itemsPerPage);
          currentPage++;
          
          // Reset button state
          button.disabled = false;
          button.innerHTML = '<span>Load More Media</span> <i class="fas fa-chevron-down"></i>';
          if (loadingIndicator) {
              loadingIndicator.classList.remove('active');
          }
          
          // Hide button if no more items
          if (currentPage >= 3) { // Example: hide after 3 pages
              button.style.display = 'none';
          }
      }, 1000);
  });
}

// Load more items (mock implementation)
function loadMoreItems(page, perPage) {
  const mediaGrid = document.querySelector('.media-grid');
  
  // Example: Create dummy media cards
  for (let i = 0; i < perPage; i++) {
      const newCard = createMediaCard({
          type: 'news',
          title: `New Media Item ${(page - 1) * perPage + i + 1}`,
          source: 'Example Source',
          date: new Date().toLocaleDateString(),
          excerpt: 'This is a dynamically loaded media item.'
      });
      
      mediaGrid.appendChild(newCard);
      
      // Animate in
      setTimeout(() => {
          newCard.style.opacity = '1';
          newCard.style.transform = 'translateY(0)';
      }, i * 100);
  }
}

// Create media card element
function createMediaCard(data) {
  const card = document.createElement('article');
  card.className = 'media-card';
  card.setAttribute('data-category', data.type);
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  
  card.innerHTML = `
      <div class="media-image">
          <img src="/assets/images/media/placeholder.jpg" alt="${data.title}">
          <div class="media-type">
              <i class="fas fa-newspaper"></i> ${data.type}
          </div>
      </div>
      <div class="media-content">
          <h3>${data.title}</h3>
          <div class="media-source">
              <span>${data.source}</span>
          </div>
          <p class="media-date">${data.date}</p>
          <p class="media-excerpt">${data.excerpt}</p>
          <a href="#" class="read-more">
              Read More <i class="fas fa-arrow-right"></i>
          </a>
      </div>
  `;
  
  return card;
}

// Media Gallery Lightbox
function initMediaGallery() {
  const mediaImages = document.querySelectorAll('.media-image img');
  
  mediaImages.forEach(img => {
      img.addEventListener('click', function(e) {
          // Don't open lightbox if there's a play overlay
          if (this.parentElement.querySelector('.play-overlay')) return;
          
          createLightbox(this.src, this.alt);
      });
  });
}

// Create lightbox
function createLightbox(src, alt) {
  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.innerHTML = `
      <div class="lightbox-content">
          <img src="${src}" alt="${alt}">
          <button class="close-lightbox">&times;</button>
      </div>
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Fade in
  setTimeout(() => {
      lightbox.classList.add('active');
  }, 10);
  
  // Close events
  const closeBtn = lightbox.querySelector('.close-lightbox');
  closeBtn.addEventListener('click', () => closeLightbox(lightbox));
  
  lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
          closeLightbox(lightbox);
      }
  });
}

// Close lightbox
function closeLightbox(lightbox) {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  setTimeout(() => {
      lightbox.remove();
  }, 300);
}

// Speaking Timeline
function initSpeakingTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;
  
  // Animate timeline items on scroll
  const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
              setTimeout(() => {
                  entry.target.classList.add('visible');
              }, index * 100);
              timelineObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.2 });
  
  timelineItems.forEach(item => {
      timelineObserver.observe(item);
  });
  
  // Add interactive dates
  const eventDates = document.querySelectorAll('.event-date');
  eventDates.forEach(date => {
      date.addEventListener('click', function() {
          const timelineItem = this.closest('.timeline-item');
          timelineItem.classList.toggle('expanded');
      });
  });
}

// Initialize media page enhancements
function initMediaEnhancements() {
  // Add hover effects to media cards
  const mediaCards = document.querySelectorAll('.media-card');
  
  mediaCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
      });
  });
  
  // Podcast platform links
  const platformLinks = document.querySelectorAll('.platform-link');
  platformLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          // In a real implementation, this would link to actual podcast platforms
          alert('This would open the podcast on the selected platform.');
      });
  });
}

// Initialize enhancements
initMediaEnhancements();

// Export media functions
window.MediaPage = {
  filterMedia,
  createVideoModal,
  createLightbox
};