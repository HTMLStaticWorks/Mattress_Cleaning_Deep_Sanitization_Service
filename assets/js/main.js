/* ==========================================================================
   MATTRESS CLEANING & DEEP SANITIZATION SERVICE - MAIN JAVASCRIPT
   Handles: Theme Toggle, RTL, Mobile Drawer, Sliders, Calculators, Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. THEME TOGGLE (Light / Dark "Midnight Hygiene")
     ------------------------------------------------------------------------ */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('mc_theme') || 'light';
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mc_theme', theme);
    
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'fas fa-moon';
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });
  }

  setTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  /* ------------------------------------------------------------------------
     2. RTL SUPPORT TOGGLE
     ------------------------------------------------------------------------ */
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const rtlStylesheet = document.getElementById('rtl-stylesheet');
  const storedRtl = localStorage.getItem('mc_rtl') === 'true';

  function setRtl(isRtl) {
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      if (rtlStylesheet) rtlStylesheet.removeAttribute('disabled');
      rtlToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to LTR');
      });
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      if (rtlStylesheet) rtlStylesheet.setAttribute('disabled', 'true');
      rtlToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to RTL');
      });
    }
    localStorage.setItem('mc_rtl', isRtl);
  }

  setRtl(storedRtl);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyRtl = document.documentElement.getAttribute('dir') === 'rtl';
      setRtl(!isCurrentlyRtl);
    });
  });

  /* ------------------------------------------------------------------------
     3. STICKY HEADER SCROLL EFFECT
     ------------------------------------------------------------------------ */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. MOBILE NAVIGATION DRAWER (<=1024px)
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ------------------------------------------------------------------------
     5. TRUST STRIP ANIMATED COUNTERS
     ------------------------------------------------------------------------ */
  const counterElements = document.querySelectorAll('.counter-val');
  let animated = false;

  function animateCounters() {
    if (animated || counterElements.length === 0) return;
    const firstCounter = counterElements[0];
    const rect = firstCounter.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      animated = true;
      counterElements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target.toFixed(decimals) + suffix;
            clearInterval(timer);
          } else {
            el.textContent = start.toFixed(decimals) + suffix;
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // initial check

  /* ------------------------------------------------------------------------
     6. BEFORE & AFTER IMAGE COMPARISON SLIDERS
     ------------------------------------------------------------------------ */
  const baWrappers = document.querySelectorAll('.ba-comparison-wrapper');

  baWrappers.forEach(wrapper => {
    const afterImg = wrapper.querySelector('.ba-image-after');
    const handle = wrapper.querySelector('.ba-slider-handle');
    if (!afterImg || !handle) return;

    let isDragging = false;

    function updateSliderPosition(x) {
      const rect = wrapper.getBoundingClientRect();
      let pos = x - rect.left;
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;
      const percentage = (pos / rect.width) * 100;
      afterImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);

    wrapper.addEventListener('mousemove', (e) => {
      if (isDragging) updateSliderPosition(e.clientX);
    });

    // Touch support for mobile
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);

    wrapper.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    });

    // Click on container to jump
    wrapper.addEventListener('click', (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        updateSliderPosition(e.clientX);
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. MATTRESS CROSS-SECTION LAYER SWITCHER
     ------------------------------------------------------------------------ */
  const layerBtns = document.querySelectorAll('.layer-tab-btn');
  const layerImg = document.getElementById('cross-section-img');
  const layerTitle = document.getElementById('layer-title');
  const layerInfo = document.getElementById('layer-info');

  const layerData = {
    surface: {
      title: "Surface Fabric Layer",
      info: "Pulls organic oils, shed skin cells, and microscopic particles lying directly on top of mattress fibers.",
      img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80"
    },
    dust: {
      title: "Dust & Allergen Accumulation",
      info: "Deep high-efficiency HEPA extraction traps 99% of dust mites, pollen, and microscopic triggers trapped within the upper 2 inches.",
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    },
    fibers: {
      title: "Deep Memory Foam & Coil Fibers",
      info: "Saturated steam extraction and deep suction penetrate up to 6 inches into internal mattress core layers.",
      img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
    },
    moisture: {
      title: "Moisture & Deodorizing Treatment",
      info: "Controlled moisture extraction prevents mildew growth while enzyme neutralizers dissipate deep trapped odors.",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    },
    uv: {
      title: "UV Sanitization Finish",
      info: "Targeted ultraviolet light passes over the entire surface area, neutralizing lingering surface contaminants.",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    }
  };

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-layer');
      if (layerData[key]) {
        if (layerTitle) layerTitle.textContent = layerData[key].title;
        if (layerInfo) layerInfo.textContent = layerData[key].info;
        if (layerImg) {
          layerImg.style.opacity = '0.5';
          setTimeout(() => {
            layerImg.src = layerData[key].img;
            layerImg.style.opacity = '1';
          }, 150);
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. INTERACTIVE HOME CLEANING CALCULATOR
     ------------------------------------------------------------------------ */
  const calcItemBtns = document.querySelectorAll('[data-calc-group="item"]');
  const calcCondBtns = document.querySelectorAll('[data-calc-group="condition"]');
  const calcLocBtns = document.querySelectorAll('[data-calc-group="location"]');
  const calcPriceDisplay = document.getElementById('calc-total-price');

  let selectedItemPrice = 89;  // default Double Mattress
  let selectedCondMultiplier = 1.0;
  let selectedLocExtra = 0;

  function recalculatePrice() {
    if (!calcPriceDisplay) return;
    const total = Math.round((selectedItemPrice * selectedCondMultiplier) + selectedLocExtra);
    calcPriceDisplay.textContent = `$${total}`;
  }

  calcItemBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcItemBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedItemPrice = parseFloat(btn.getAttribute('data-price')) || 89;
      recalculatePrice();
    });
  });

  calcCondBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcCondBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCondMultiplier = parseFloat(btn.getAttribute('data-mult')) || 1.0;
      recalculatePrice();
    });
  });

  calcLocBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcLocBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedLocExtra = parseFloat(btn.getAttribute('data-extra')) || 0;
      recalculatePrice();
    });
  });

  /* ------------------------------------------------------------------------
     9. FAQ ACCORDION
     ------------------------------------------------------------------------ */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close other accordion items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     10. FORM VALIDATION & MODAL SUCCESS
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = bookingForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      // Email validation
      const emailInput = bookingForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.add('is-invalid');
          isValid = false;
        }
      }

      if (isValid) {
        if (successModal) successModal.classList.add('active');
        bookingForm.reset();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('active');
    });
  }

  /* ------------------------------------------------------------------------
     11. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     12. SERVICE COVERAGE IMAGE SWITCHER
     ------------------------------------------------------------------------ */
  const coveragePills = document.querySelectorAll('.coverage-pill');
  const coverageImage = document.getElementById('coverage-image');

  if (coveragePills.length > 0 && coverageImage) {
    coveragePills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Remove active class from all pills
        coveragePills.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked pill
        pill.classList.add('active');
        
        // Get image name from data attribute and update image source
        const imageName = pill.getAttribute('data-image');
        if (imageName) {
          coverageImage.style.opacity = '0.5';
          setTimeout(() => {
            coverageImage.src = `image/${imageName}.png`;
            coverageImage.style.opacity = '1';
          }, 150);
        }
      });
    });
    
    // Add transition style to image for smooth fading
    coverageImage.style.transition = 'opacity 0.3s ease';
  }

  /* ------------------------------------------------------------------------
     13. ACTIVE NAV LINK HIGHLIGHTING
     ------------------------------------------------------------------------ */
  let currentPath = window.location.pathname.split("/").pop();
  if (currentPath === '') currentPath = 'index.html';

  const allNavLinks = document.querySelectorAll('.nav-menu a');
  // First remove any hardcoded active classes
  document.querySelectorAll('.nav-menu a, .nav-link').forEach(el => el.classList.remove('active'));

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.split('#')[0] === currentPath)) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
         const parentLink = parentDropdown.querySelector('.nav-link');
         if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  const allDrawerLinks = document.querySelectorAll('.drawer-link');
  allDrawerLinks.forEach(el => el.classList.remove('active'));

  allDrawerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.split('#')[0] === currentPath)) {
      link.classList.add('active');
    }
  });

});
