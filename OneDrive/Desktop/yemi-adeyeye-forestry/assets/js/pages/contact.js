/**
 * contact.js - Contact form functionality for Dr. Yemi Adeyeye's website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize contact form
  initContactForm();
  
  // Initialize FAQ accordion
  initFaqAccordion();
  
  // Check for URL parameters
  checkUrlParams();
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const messageField = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  
  if (!contactForm) return;
  
  // Character count for message field
  if (messageField && charCount) {
    messageField.addEventListener('input', function() {
      const count = this.value.length;
      charCount.textContent = count;
      
      if (count > 950) {
        charCount.classList.add('warning');
      } else {
        charCount.classList.remove('warning');
      }
    });
  }
  
  // Form submission handler
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    const inquiryType = contactForm.querySelector('#inquiry-type').value;
    
    if (!name || !email || !subject || !message || !inquiryType) {
      showFormError('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    if (!isValidEmail(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission (in a real app, this would be an AJAX request)
    setTimeout(() => {
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      
      // Show success message
      showFormSuccess();
      
      // Reset form
      contactForm.reset();
      charCount.textContent = '0';
    }, 1500);
  });
  
  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Show form error message
  function showFormError(message) {
    const formStatus = document.querySelector('.form-status');
    const errorStatus = document.querySelector('.status-error');
    
    if (formStatus && errorStatus) {
      errorStatus.querySelector('span').textContent = message;
      formStatus.style.display = 'block';
      errorStatus.style.display = 'block';
      
      // Hide success message if visible
      const successStatus = document.querySelector('.status-success');
      if (successStatus) {
        successStatus.style.display = 'none';
      }
      
      // Hide message after 5 seconds
      setTimeout(function() {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }
  
  // Show form success message
  function showFormSuccess() {
    const formStatus = document.querySelector('.form-status');
    const successStatus = document.querySelector('.status-success');
    
    if (formStatus && successStatus) {
      formStatus.style.display = 'block';
      successStatus.style.display = 'block';
      
      // Hide error message if visible
      const errorStatus = document.querySelector('.status-error');
      if (errorStatus) {
        errorStatus.style.display = 'none';
      }
      
      // Hide message after 5 seconds
      setTimeout(function() {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const parent = this.parentElement;
      const isOpen = parent.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        
        // Get answer element
        const answer = faq.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = '0';
        }
      });
      
      // Toggle clicked item
      if (!isOpen) {
        parent.classList.add('active');
        
        // Get answer element
        const answer = parent.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });
  
  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    firstItem.classList.add('active');
    
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }
}

/**
 * Check URL parameters to auto-select inquiry type
 */
function checkUrlParams() {
  const inquiryTypeSelect = document.getElementById('inquiry-type');
  
  if (!inquiryTypeSelect) return;
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const inquiryParam = urlParams.get('inquiry');
  
  if (inquiryParam) {
    // Check if option exists
    const optionExists = Array.from(inquiryTypeSelect.options).some(option => {
      return option.value === inquiryParam;
    });
    
    if (optionExists) {
      inquiryTypeSelect.value = inquiryParam;
    }
    
    // Scroll to form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      setTimeout(() => {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }
}

/**
 * Smooth scroll to anchors
 */
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return; // Skip links with just "#"
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = document.getElementById('mainNav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});