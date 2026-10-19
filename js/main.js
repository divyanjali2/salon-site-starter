/**
 * LUMIÈRE SALON & SPA - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('site-header');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const bookingModal = document.getElementById('booking-modal-overlay');
  const closeBookingModalBtn = document.getElementById('close-booking-modal');
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccessMsg = document.getElementById('booking-success-message');
  const successDoneBtn = document.getElementById('success-done-btn');
  const bookServiceSelect = document.getElementById('book-service');
  const bookDateInput = document.getElementById('book-date');
  const newsletterForm = document.getElementById('newsletter-form');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const counters = document.querySelectorAll('.counter');
  const currentYearSpan = document.getElementById('current-year');

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Set min date for appointment booking to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
  }

  // Header scroll class
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');

  // Mobile Drawer Toggle
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
      mobileDrawer.classList.remove('active');
      if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.mobile-drawer-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Toast notification helper
  let toastTimeout;
  const showToast = (message) => {
    if (!toastNotice || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  };

  // Booking Modal Handlers
  const openModal = (preselectedService = null) => {
    if (!bookingModal) return;
    if (preselectedService && bookServiceSelect) {
      // Find matching option
      for (let i = 0; i < bookServiceSelect.options.length; i++) {
        if (bookServiceSelect.options[i].value === preselectedService) {
          bookServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    // Reset view states
    if (bookingForm && bookingSuccessMsg) {
      bookingForm.style.display = 'flex';
      bookingSuccessMsg.classList.remove('active');
    }
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile drawer is open, close it
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('active');
      }
      openModal();
    });
  });

  // Clicking service cards opens modal with that service selected
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const service = card.dataset.service;
      openModal(service);
    });
  });

  if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value;
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;

      const confirmedName = document.getElementById('confirmed-client-name');
      const confirmedSlot = document.getElementById('confirmed-slot');

      if (confirmedName) confirmedName.textContent = name;
      if (confirmedSlot) {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        confirmedSlot.textContent = `${formattedDate} at ${time}`;
      }

      bookingForm.style.display = 'none';
      if (bookingSuccessMsg) {
        bookingSuccessMsg.classList.add('active');
      }
      bookingForm.reset();
    });
  }

  if (successDoneBtn) {
    successDoneBtn.addEventListener('click', closeModal);
  }

  // Newsletter Form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const email = input.value.trim();
      if (email) {
        showToast(`Thank you! ${email} has been subscribed to Lumière VIP offers.`);
        newsletterForm.reset();
      }
    });
  }

  // Animated Numbers Counter on Scroll
  let animated = false;
  const startCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.why-us-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          startCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // Smooth Active Nav Highlighting on Scroll
  const sections = document.querySelectorAll('main > section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
