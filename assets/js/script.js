(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const submenuToggle = document.querySelector('.submenu-toggle');
  const submenu = document.querySelector('.submenu');
  const year = document.getElementById('year');
  const crest = document.querySelector('.badge-crest');
  const logoBadge = document.querySelector('.logo-badge');
  
  // Global animation flag
  let isAnimating = false;
  
  // Simple toggle function for submenu
  function toggleSubmenu(forceOpen = null) {
    console.log('🔄 toggleSubmenu called with forceOpen:', forceOpen);
    console.log('   submenuToggle:', submenuToggle);
    console.log('   submenu:', submenu);
    
    if (isAnimating) {
      console.log('⏳ Animation in progress, ignoring');
      return;
    }
    
    const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
    const next = forceOpen !== null ? forceOpen : !isExpanded;
    
    console.log('🔄 Toggling submenu:', { isExpanded, next, forceOpen });
    console.log('   Before - submenu.classList:', submenu.classList.toString());
    console.log('   Before - submenu.style.display:', submenu.style.display);
    console.log('   Before - submenu.style.visibility:', submenu.style.visibility);
    
    isAnimating = true;
    
    // Update aria-expanded attribute
    submenuToggle.setAttribute('aria-expanded', String(next));
    
    // Update caret rotation
    const caret = submenuToggle.querySelector('.caret');
    if (caret) {
      caret.style.transform = next ? 'rotate(180deg)' : 'rotate(0deg)';
      caret.style.transition = 'transform 0.3s ease';
    }
    
    // Toggle submenu visibility
    if (next) {
      submenu.classList.add('open');
      submenu.style.display = 'block';
      submenu.style.visibility = 'visible';
      submenu.style.pointerEvents = 'auto';
      submenu.style.transform = '';
      console.log('✅ Submenu OPENED');
      console.log('   After - submenu.classList:', submenu.classList.toString());
      console.log('   After - submenu.style.display:', submenu.style.display);
      console.log('   After - submenu.style.visibility:', submenu.style.visibility);
    } else {
      submenu.classList.remove('open');
      console.log('❌ Submenu CLOSED');
      console.log('   After - submenu.classList:', submenu.classList.toString());
    }
    
    // Reset animation flag
    setTimeout(() => {
      if (!next) {
        submenu.style.display = 'none';
        submenu.style.visibility = 'hidden';
        submenu.style.pointerEvents = 'none';
      }
      isAnimating = false;
      console.log('🔄 Animation completed, isAnimating:', isAnimating);
    }, 300);
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      
      // Prevent body scroll when menu is open
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        
        // Close submenu when main menu is closed on mobile
        const isMobile = window.matchMedia('(max-width: 720px)').matches;
        if (isMobile && submenu && submenu.classList.contains('open')) {
          toggleSubmenu(false);
        }
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
        
        // Also close submenu on mobile when navigating
        const isMobile = window.matchMedia('(max-width: 720px)').matches;
        if (isMobile && submenu && submenu.classList.contains('open')) {
          toggleSubmenu(false);
        }
      });
    });
    
    // Close submenu when clicking outside (all devices)
    document.addEventListener('click', function(e) {
      const hasSubmenu = document.querySelector('.has-submenu');
      const isMobile = window.matchMedia('(max-width: 720px)').matches;
      
      // Don't close during animation
      if (isAnimating) {
        return;
      }
      
      if (hasSubmenu && !hasSubmenu.contains(e.target)) {
        // Only close submenu if it's open
        if (submenu.classList.contains('open')) {
          toggleSubmenu(false);
          console.log('🔄 Submenu closed by clicking outside');
        }
      }
    });
  }

  // Submenu toggle for both desktop and mobile
  if (submenuToggle && submenu) {
    const hasSubmenu = document.querySelector('.has-submenu');
    
    // Click handler for all devices
    submenuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🔍 Submenu toggle clicked');
      console.log('   submenuToggle:', submenuToggle);
      console.log('   submenu:', submenu);
      console.log('   submenu.classList:', submenu.classList.toString());
      
      // Check if we're on mobile (screen width <= 720px)
      const isMobile = window.matchMedia('(max-width: 720px)').matches;
      console.log('   isMobile:', isMobile);
      console.log('   window.innerWidth:', window.innerWidth);
      
      if (isMobile) {
        // On mobile: Always toggle submenu
        console.log('📱 Mobile submenu toggle clicked');
        toggleSubmenu();
      } else {
        // On desktop: Check current page
        const currentPage = window.location.pathname;
        const isMeetPage = currentPage.includes('meet-pier-giorgio.html');
        
        if (isMeetPage) {
          // If already on meet-pier-giorgio page, just toggle submenu
          console.log('🖥️ Desktop - Already on meet page, toggling submenu');
          toggleSubmenu();
        } else {
          // Navigate to meet-pier-giorgio page
          console.log('🖥️ Desktop - Navigating to meet-pier-giorgio page');
          window.location.href = 'meet-pier-giorgio.html';
        }
      }
    });
    
    // Hover behavior for desktop only - show submenu on hover
    if (hasSubmenu) {
      hasSubmenu.addEventListener('mouseenter', function() {
        // Only on desktop and not during animation
        if (window.matchMedia('(min-width: 721px)').matches && !isAnimating) {
          submenu.classList.add('show');
          submenu.style.display = 'block';
          submenu.style.visibility = 'visible';
          submenu.style.pointerEvents = 'auto';
          submenu.style.transform = '';
          submenuToggle.setAttribute('aria-expanded', 'true');
          const caret = submenuToggle.querySelector('.caret');
          if (caret) {
            caret.style.transform = 'rotate(180deg)';
          }
          console.log('🖱️ Desktop hover - submenu opened');
        }
      });
      
      hasSubmenu.addEventListener('mouseleave', function(e) {
        if (window.matchMedia('(min-width: 721px)').matches) {
          // Check if mouse is moving to submenu
          const relatedTarget = e.relatedTarget;
          if (relatedTarget && submenu.contains(relatedTarget)) {
            return; // Don't close if moving to submenu
          }
          
          submenu.classList.remove('show');
          submenu.style.display = 'none';
          submenu.style.visibility = 'hidden';
          submenu.style.pointerEvents = 'none';
          submenuToggle.setAttribute('aria-expanded', 'false');
          const caret = submenuToggle.querySelector('.caret');
          if (caret) {
            caret.style.transform = 'rotate(0deg)';
          }
          console.log('🖱️ Desktop hover - submenu closed');
        }
      });
      
      // Keep submenu open when hovering over it
      submenu.addEventListener('mouseenter', function() {
        if (window.matchMedia('(min-width: 721px)').matches) {
          submenu.classList.add('show');
          submenu.style.display = 'block';
          submenu.style.visibility = 'visible';
          submenu.style.pointerEvents = 'auto';
          submenuToggle.setAttribute('aria-expanded', 'true');
          const caret = submenuToggle.querySelector('.caret');
          if (caret) {
            caret.style.transform = 'rotate(180deg)';
          }
          console.log('🖱️ Submenu hover - keeping open');
        }
      });
      
      submenu.addEventListener('mouseleave', function() {
        if (window.matchMedia('(min-width: 721px)').matches) {
          submenu.classList.remove('show');
          submenu.style.display = 'none';
          submenu.style.visibility = 'hidden';
          submenu.style.pointerEvents = 'none';
          submenuToggle.setAttribute('aria-expanded', 'false');
          const caret = submenuToggle.querySelector('.caret');
          if (caret) {
            caret.style.transform = 'rotate(0deg)';
          }
          console.log('🖱️ Submenu leave - closing');
        }
      });
    }
  }

  // Load crest image from data attribute
  if (crest) {
    const url = crest.getAttribute('data-image');
    if (url) {
      const encoded = encodeURI(url);
      crest.style.backgroundImage = `url("${encoded}")`;
    }
  }

  // Logo click handler - check if on index page or other page
  if (logoBadge) {
    logoBadge.addEventListener('click', function(e) {
      const currentPage = window.location.pathname;
      const isIndexPage = currentPage.endsWith('index.html') || currentPage.endsWith('/') || currentPage === '';
      
      if (isIndexPage) {
        // On index page - scroll to top and reset page
        e.preventDefault();
        e.stopPropagation();
        
        // Reset page to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
        
        // Reset any form states or other page states if needed
        // Force a page refresh to ensure complete reset
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
        console.log('Logo clicked - resetting page');
      } else {
        // On other pages - let the link work normally (go to index.html)
        console.log('Logo clicked - navigating to index page');
      }
    });
  }
})();


