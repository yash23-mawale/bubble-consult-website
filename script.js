/**
 * Bubble Consult - Core Interactive Functionalities
 * - Mobile Navigation Menu & Smooth Scrolling
 * - Testimonial Carousel (User Story #3: manual navigation, auto-rotation every 5s)
 * - Contact Form Validation & Confirmation (User Story #4)
 * - Newsletter Subscription Validation & Feedback (User Story #1)
 * - Header Scroll States & Active Link Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Mobile Menu & Navigation
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  const pagesDropdownBtn = document.getElementById('pages-dropdown-btn');
  const header = document.getElementById('header');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking regular navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          menuToggle.classList.remove('active');
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile dropdown toggle for PAGES
  if (pagesDropdownBtn) {
    pagesDropdownBtn.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentDropdown = pagesDropdownBtn.closest('.dropdown');
        if (parentDropdown) {
          parentDropdown.classList.toggle('active');
        }
      }
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     2. Active Link Highlighting on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id], header[id]');
  const allNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ==========================================================================
     3. Testimonials Carousel (User Story #3)
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dots = document.querySelectorAll('.carousel-indicators .dot-btn');
  const carouselCard = document.getElementById('testimonial-carousel');

  let currentIndex = 0;
  const totalSlides = slides.length;
  const ROTATION_INTERVAL_MS = 5000; // Rotates every 5 seconds per acceptance criteria
  let autoPlayTimer = null;

  function updateCarousel(index) {
    if (totalSlides === 0 || !track) return;

    // Normalizing index
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    // Slide position
    const offset = -(currentIndex * 100);
    track.style.transform = `translateX(${offset}%)`;

    // Active state classes for slides
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Active state for pagination dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, ROTATION_INTERVAL_MS);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Next and Previous button click events
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      startAutoPlay(); // Reset timer on manual action
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      startAutoPlay(); // Reset timer on manual action
    });
  }

  // Indicator dots click events
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
      startAutoPlay();
    });
  });

  // Pause on hover so the user can read the testimonial comfortably
  if (carouselCard) {
    carouselCard.addEventListener('mouseenter', stopAutoPlay);
    carouselCard.addEventListener('mouseleave', startAutoPlay);
    carouselCard.addEventListener('focusin', stopAutoPlay);
    carouselCard.addEventListener('focusout', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carouselCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    carouselCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        // Swiped Left -> Next
        updateCarousel(currentIndex + 1);
      } else if (touchEndX - touchStartX > 50) {
        // Swiped Right -> Prev
        updateCarousel(currentIndex - 1);
      }
      startAutoPlay();
    }, { passive: true });
  }

  // Initialize carousel on load
  if (totalSlides > 0) {
    updateCarousel(0);
    startAutoPlay();
  }

  /* ==========================================================================
     4. Contact Form Validation & Submission (User Story #4)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const phoneInput = document.getElementById('contact-phone');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const phoneContainer = document.getElementById('phone-container');
  const emailContainer = document.getElementById('email-container');
  const messageContainer = document.getElementById('message-container');

  const phoneError = document.getElementById('phone-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const formAlert = document.getElementById('form-alert');
  const alertText = document.getElementById('alert-message-text');
  const dismissAlertBtn = document.getElementById('dismiss-alert-btn');
  const submitBtn = document.getElementById('contact-submit-btn');

  // Email format validator
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  }

  // Phone number validator (at least 7 digits, digits/hyphens/spaces/parens)
  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleaned.length >= 7 && /^\+?[0-9]+$/.test(cleaned);
  }

  // Field validation helper
  function validateField(input, container, errorEl, validatorFn, emptyMsg, invalidMsg) {
    const value = input.value.trim();
    if (!value) {
      container.classList.add('has-error');
      errorEl.textContent = emptyMsg;
      return false;
    }
    if (validatorFn && !validatorFn(value)) {
      container.classList.add('has-error');
      errorEl.textContent = invalidMsg;
      return false;
    }
    container.classList.remove('has-error');
    errorEl.textContent = '';
    return true;
  }

  // Live validation on input events
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.trim()) {
        validateField(
          phoneInput, 
          phoneContainer, 
          phoneError, 
          isValidPhone, 
          'Phone number is required.', 
          'Please enter a valid phone number (e.g. 555-0123).'
        );
      } else {
        phoneContainer.classList.remove('has-error');
        phoneError.textContent = '';
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim()) {
        validateField(
          emailInput, 
          emailContainer, 
          emailError, 
          isValidEmail, 
          'Email address is required.', 
          'Please provide a valid email format (e.g. name@domain.com).'
        );
      } else {
        emailContainer.classList.remove('has-error');
        emailError.textContent = '';
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim()) {
        if (messageInput.value.trim().length < 8) {
          messageContainer.classList.add('has-error');
          messageError.textContent = 'Message should be at least 8 characters long.';
        } else {
          messageContainer.classList.remove('has-error');
          messageError.textContent = '';
        }
      } else {
        messageContainer.classList.remove('has-error');
        messageError.textContent = '';
      }
    });
  }

  // Form submission handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isPhoneValid = validateField(
        phoneInput, 
        phoneContainer, 
        phoneError, 
        isValidPhone, 
        'Phone number is required.', 
        'Please enter a valid phone number (e.g. 555-0123).'
      );

      const isEmailValid = validateField(
        emailInput, 
        emailContainer, 
        emailError, 
        isValidEmail, 
        'Email address is required.', 
        'Please provide a valid email format (e.g. name@domain.com).'
      );

      let isMessageValid = true;
      if (!messageInput.value.trim()) {
        messageContainer.classList.add('has-error');
        messageError.textContent = 'Please write a brief message.';
        isMessageValid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageContainer.classList.add('has-error');
        messageError.textContent = 'Message should be at least 8 characters long.';
        isMessageValid = false;
      } else {
        messageContainer.classList.remove('has-error');
        messageError.textContent = '';
      }

      // If all valid, process submission
      if (isPhoneValid && isEmailValid && isMessageValid) {
        const enteredEmail = emailInput.value.trim();
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Simulate sending state
        submitBtn.disabled = true;
        if (btnText && btnLoader) {
          btnText.style.display = 'none';
          btnLoader.style.display = 'inline';
        }

        setTimeout(() => {
          // Reset button
          submitBtn.disabled = false;
          if (btnText && btnLoader) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
          }

          // Show confirmation message
          if (alertText) {
            alertText.textContent = `Thank you! Your message has been received. Our strategy team will reach out to ${enteredEmail} within 24 hours.`;
          }

          if (formAlert) {
            formAlert.style.display = 'flex';
            formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          // Reset inputs
          contactForm.reset();
          [phoneContainer, emailContainer, messageContainer].forEach(el => el.classList.remove('has-error'));
        }, 600);
      } else {
        // Focus the first invalid field
        if (!isPhoneValid) phoneInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isMessageValid) messageInput.focus();
      }
    });
  }

  // Dismiss confirmation alert
  if (dismissAlertBtn && formAlert) {
    dismissAlertBtn.addEventListener('click', () => {
      formAlert.style.display = 'none';
      phoneInput.focus();
    });
  }

  /* ==========================================================================
     5. Newsletter Form Validation & Handling (User Story #1)
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm && newsletterInput && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterInput.value.trim();

      if (!email) {
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterFeedback.textContent = 'Please enter your email address.';
        newsletterInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterInput.focus();
        return;
      }

      // Success
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterFeedback.textContent = '✓ Successfully subscribed to Bubble Consult releases!';
      newsletterInput.value = '';

      setTimeout(() => {
        newsletterFeedback.textContent = '';
      }, 5000);
    });

    newsletterInput.addEventListener('input', () => {
      if (newsletterFeedback.textContent) {
        newsletterFeedback.textContent = '';
      }
    });
  }
});
