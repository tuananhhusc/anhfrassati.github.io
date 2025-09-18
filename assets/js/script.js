(function () {
  // Get elements
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const siteHeader = document.querySelector('.site-header');
  const submenuToggle = document.querySelector('.submenu-toggle');
  const submenu = document.querySelector('.submenu');
  const year = document.getElementById('year');
  const crest = document.querySelector('.badge-crest');
  const logoBadge = document.querySelector('.logo-badge');

  // Set current year
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Mobile menu toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on backdrop
    mainNav.addEventListener('click', function(e) {
      if (e.target === mainNav) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on menu links
    const menuLinks = mainNav.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Sticky header shadow on scroll
  if (siteHeader) {
    const setHeaderScrolledState = () => {
      const scrolled = window.scrollY > 6;
      siteHeader.classList.toggle('scrolled', scrolled);
    };
    setHeaderScrolledState();
    window.addEventListener('scroll', setHeaderScrolledState, { passive: true });
  }

  // Enhanced submenu toggle with hover support
  if (submenuToggle && submenu) {
    console.log('🔍 Submenu elements found:', {
      submenuToggle: submenuToggle,
      submenu: submenu,
      submenuChildren: submenu.children.length
    });

    let hoverTimeout = null;
    const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

    // Function to open submenu
    function openSubmenu() {
      submenuToggle.setAttribute('aria-expanded', 'true');
      submenu.classList.add('open');
      
      // Force reflow for smooth animation
      submenu.offsetHeight;
      
      submenu.style.display = 'block';
      submenu.style.visibility = 'visible';
      submenu.style.opacity = '1';
      submenu.style.transform = isMobile() ? 'translateY(0)' : 'translateX(-50%) translateY(0)';
      submenu.style.maxHeight = '500px';
      submenu.style.overflow = 'visible';
      
      const caret = submenuToggle.querySelector('.caret');
      if (caret) {
        caret.style.transform = 'rotate(180deg)';
      }
      
      console.log('✅ Submenu opened');
    }

    // Function to close submenu
    function closeSubmenu() {
      submenuToggle.setAttribute('aria-expanded', 'false');
      
      submenu.style.maxHeight = '0';
      submenu.style.overflow = 'hidden';
      submenu.style.opacity = '0';
      submenu.style.transform = isMobile() ? 'translateY(-10px)' : 'translateX(-50%) translateY(-10px)';
      
      // Wait for animation to complete before hiding
      setTimeout(() => {
        if (!submenu.classList.contains('open')) {
          submenu.style.display = 'none';
          submenu.style.visibility = 'hidden';
        }
      }, 300);
      
      submenu.classList.remove('open');
      
      const caret = submenuToggle.querySelector('.caret');
      if (caret) {
        caret.style.transform = 'rotate(0deg)';
      }
      
      console.log('❌ Submenu closed');
    }

    // Click handler
    submenuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🔄 Submenu toggle clicked');
      
      const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        closeSubmenu();
      } else {
        openSubmenu();
      }
    });

    // Hover handlers for better mobile experience
    submenuToggle.addEventListener('mouseenter', function() {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Small delay to prevent accidental triggers
      hoverTimeout = setTimeout(() => {
        if (!submenu.classList.contains('open')) {
          console.log('🔄 Submenu hover enter');
          openSubmenu();
        }
      }, 150);
    });

    submenuToggle.addEventListener('mouseleave', function() {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Delay before closing to allow moving to submenu
      hoverTimeout = setTimeout(() => {
        if (submenu.classList.contains('open')) {
          console.log('🔄 Submenu hover leave');
          closeSubmenu();
        }
      }, 200);
    });

    // Keep submenu open when hovering over it
    submenu.addEventListener('mouseenter', function() {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });

    submenu.addEventListener('mouseleave', function() {
      hoverTimeout = setTimeout(() => {
        if (submenu.classList.contains('open')) {
          console.log('🔄 Submenu content hover leave');
          closeSubmenu();
        }
      }, 200);
    });

    // Close submenu when clicking outside
    document.addEventListener('click', function(e) {
      // Don't close if clicking on submenu toggle or submenu itself
      if (!submenuToggle.contains(e.target) && !submenu.contains(e.target)) {
        if (submenu.classList.contains('open')) {
          closeSubmenu();
          console.log('🔄 Submenu closed by clicking outside');
        }
      }
    });
  }

  // Load crest image
  if (crest) {
    const url = crest.getAttribute('data-image');
    if (url) {
      const encoded = encodeURI(url);
      crest.style.backgroundImage = `url("${encoded}")`;
    }
  }

  // Logo click handler
  if (logoBadge) {
    logoBadge.addEventListener('click', function(e) {
      const currentPage = window.location.pathname;
      const isIndexPage = currentPage.endsWith('index.html') || currentPage.endsWith('/') || currentPage === '';
      
      if (isIndexPage) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  }

  // Highlight active top-level link automatically
  if (mainNav) {
    const links = mainNav.querySelectorAll('.menu > li > a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === current) {
        link.classList.add('is-active');
      }
    });
  }
})();
