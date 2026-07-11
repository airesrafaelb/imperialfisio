document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     sticky header
     ========================================================================== */
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check state on load

  /* ==========================================================================
     menu mobile
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ==========================================================================
     active navigation links on scroll (intersection observer)
     ========================================================================== */
  const sections = document.querySelectorAll('section, footer');
  const navLinkMap = {};
  
  navLinks.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    navLinkMap[targetId] = link;
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the upper-middle region
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to visible section link
        if (navLinkMap[id]) {
          navLinkMap[id].classList.add('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  /* ==========================================================================
     carrossel de depoimentos (testimonials slider)
     ========================================================================== */
  const slider = document.getElementById('testimonials-container');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const cards = slider.querySelectorAll('.testimonial-card');
  
  let currentIndex = 0;
  let itemsPerPage = 3;
  let totalPages = 0;

  const calculatePages = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      itemsPerPage = 1;
    } else if (width <= 992) {
      itemsPerPage = 2;
    } else {
      itemsPerPage = 3;
    }
    totalPages = Math.max(1, cards.length - itemsPerPage + 1);
    
    // Adjust index if out of bounds
    if (currentIndex >= totalPages) {
      currentIndex = totalPages - 1;
    }
    
    updateSlider();
    buildDots();
  };

  const buildDots = () => {
    dotsContainer.innerHTML = '';
    
    // We only need dots equal to the total number of index transitions possible
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      
      dotsContainer.appendChild(dot);
    }
  };

  const updateSlider = () => {
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
    
    // Gap size matches the grid gap
    const slideOffset = currentIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${slideOffset}px)`;
    
    // Update active dot
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Disable buttons if bounds are reached
    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = currentIndex === totalPages - 1 ? '0.5' : '1';
      nextBtn.style.pointerEvents = currentIndex === totalPages - 1 ? 'none' : 'auto';
    }
  };

  if (prevBtn && nextBtn && slider) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalPages - 1) {
        currentIndex++;
        updateSlider();
      }
    });

    // Touch Support for Mobile Swiping
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      // Swipe Left (next)
      if (diffX > 50 && currentIndex < totalPages - 1) {
        currentIndex++;
        updateSlider();
      }
      // Swipe Right (prev)
      if (diffX < -50 && currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }, { passive: true });

    window.addEventListener('resize', calculatePages);
    calculatePages();
  }

  /* ==========================================================================
     whatsapp floating button / panel
     ========================================================================== */
  const waTrigger = document.getElementById('wa-main-trigger');
  const waPanel = document.getElementById('wa-panel');
  const waClose = document.getElementById('wa-close-panel');
  const waContainer = document.getElementById('wa-floating-container');

  const toggleWaPanel = (e) => {
    e.stopPropagation();
    waPanel.classList.toggle('show');
    waTrigger.classList.toggle('active');
  };

  const closeWaPanel = () => {
    waPanel.classList.remove('show');
    waTrigger.classList.remove('active');
  };

  waTrigger.addEventListener('click', toggleWaPanel);
  waClose.addEventListener('click', closeWaPanel);

  // Close panel when clicking outside the panel
  document.addEventListener('click', (e) => {
    if (!waContainer.contains(e.target)) {
      closeWaPanel();
    }
  });

  // Prevent clicks inside the panel from propagation
  waPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
});
