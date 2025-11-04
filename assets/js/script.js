(function () {
  // Get elements
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const siteHeader = document.querySelector('.site-header');
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
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

  // Enhanced submenu toggle with hover support - handle all submenus
  if (submenuToggles.length > 0) {
    const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
    const hoverTimeouts = new Map();

    // Function to open submenu
    function openSubmenu(submenuToggle, submenu) {
      submenuToggle.setAttribute('aria-expanded', 'true');
      submenu.classList.add('open');
      
      // Force reflow for smooth animation
      submenu.offsetHeight;
      
      // Use CSS classes for styling, let CSS handle the animation
      if (!isMobile()) {
        // Desktop: center the submenu
        submenu.style.display = 'block';
        submenu.style.visibility = 'visible';
      } else {
        // Mobile: static positioning
        submenu.style.display = 'block';
        submenu.style.visibility = 'visible';
      }
      
      const caret = submenuToggle.querySelector('.caret');
      if (caret) {
        caret.style.transform = 'rotate(180deg)';
      }
    }

    // Function to close submenu
    function closeSubmenu(submenuToggle, submenu) {
      submenuToggle.setAttribute('aria-expanded', 'false');
      submenu.classList.remove('open');
      
      // Wait for animation to complete before hiding (CSS handles the animation)
      setTimeout(() => {
        if (!submenu.classList.contains('open')) {
          submenu.style.display = 'none';
          submenu.style.visibility = 'hidden';
        }
      }, 300);
      
      const caret = submenuToggle.querySelector('.caret');
      if (caret) {
        caret.style.transform = 'rotate(0deg)';
      }
    }

    // Close all submenus except the one specified
    function closeOtherSubmenus(currentSubmenu) {
      submenuToggles.forEach(toggle => {
        const parent = toggle.closest('.has-submenu');
        if (parent) {
          const submenu = parent.querySelector('.submenu');
          if (submenu && submenu !== currentSubmenu) {
            closeSubmenu(toggle, submenu);
          }
        }
      });
    }

    // Setup handlers for each submenu
    submenuToggles.forEach(submenuToggle => {
      const parent = submenuToggle.closest('.has-submenu');
      if (!parent) return;
      
      const submenu = parent.querySelector('.submenu');
      if (!submenu) return;

      const timeoutKey = submenuToggle;

      // Click handler
      submenuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          closeSubmenu(submenuToggle, submenu);
        } else {
          // Close other submenus first
          closeOtherSubmenus(submenu);
          openSubmenu(submenuToggle, submenu);
        }
      });

      // Hover handlers for desktop
      submenuToggle.addEventListener('mouseenter', function() {
        if (hoverTimeouts.has(timeoutKey)) {
          clearTimeout(hoverTimeouts.get(timeoutKey));
        }
        
        if (!isMobile()) {
          hoverTimeouts.set(timeoutKey, setTimeout(() => {
            if (!submenu.classList.contains('open')) {
              closeOtherSubmenus(submenu);
              openSubmenu(submenuToggle, submenu);
            }
          }, 150));
        }
      });

      submenuToggle.addEventListener('mouseleave', function() {
        if (hoverTimeouts.has(timeoutKey)) {
          clearTimeout(hoverTimeouts.get(timeoutKey));
        }
        
        if (!isMobile()) {
          hoverTimeouts.set(timeoutKey, setTimeout(() => {
            if (submenu.classList.contains('open')) {
              closeSubmenu(submenuToggle, submenu);
            }
          }, 200));
        }
      });

      // Keep submenu open when hovering over it
      submenu.addEventListener('mouseenter', function() {
        if (hoverTimeouts.has(timeoutKey)) {
          clearTimeout(hoverTimeouts.get(timeoutKey));
        }
      });

      submenu.addEventListener('mouseleave', function() {
        if (!isMobile()) {
          hoverTimeouts.set(timeoutKey, setTimeout(() => {
            if (submenu.classList.contains('open')) {
              closeSubmenu(submenuToggle, submenu);
            }
          }, 200));
        }
      });

      // Close submenu when clicking on a link inside (especially for mobile)
      const submenuLinks = submenu.querySelectorAll('a');
      submenuLinks.forEach(link => {
        link.addEventListener('click', function() {
          // On mobile, close the menu after clicking a link
          if (isMobile()) {
            setTimeout(() => {
              closeSubmenu(submenuToggle, submenu);
              // Also close mobile menu if open
              if (mainNav && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                if (navToggle) {
                  navToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
              }
            }, 100);
          }
        });
      });
    });

    // Close submenu when clicking outside
    document.addEventListener('click', function(e) {
      let clickedInside = false;
      
      submenuToggles.forEach(submenuToggle => {
        const parent = submenuToggle.closest('.has-submenu');
        if (parent) {
          const submenu = parent.querySelector('.submenu');
          if (submenu && (submenuToggle.contains(e.target) || submenu.contains(e.target))) {
            clickedInside = true;
          }
        }
      });
      
      if (!clickedInside) {
        submenuToggles.forEach(submenuToggle => {
          const parent = submenuToggle.closest('.has-submenu');
          if (parent) {
            const submenu = parent.querySelector('.submenu');
            if (submenu && submenu.classList.contains('open')) {
              closeSubmenu(submenuToggle, submenu);
            }
          }
        });
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
