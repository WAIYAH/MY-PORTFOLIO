/* ============================================================
   LUCKY NAKOLA PORTFOLIO — Interaction Engine
   Vanilla ES6+ | Zero Dependencies | Production-Ready
   ============================================================ */

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    scrollThreshold: 50,
    revealThreshold: 0.12,
    counterDuration: 2000,
    typingSpeed: 80,
    typingDeleteSpeed: 50,
    typingPause: 2000,
  };

  // --- Utilities ---
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // --- Page Loader ---
  function initLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 300);
    });

    // Fallback: force-hide after 3s
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 3000);
  }

  // --- Navbar Scroll Behavior ---
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const update = () => {
      if (window.scrollY > CONFIG.scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // --- Active Page Detection ---
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link[data-page]');

    links.forEach(link => {
      const page = link.getAttribute('data-page');
      const isHome = (page === 'home' && (currentPage === 'index.html' || currentPage === ''));

      if (isHome || currentPage.startsWith(page)) {
        link.classList.add('active');
      }
    });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const hamburger = btn.querySelector('.hamburger');

    function toggle() {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open');
      hamburger?.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
      btn.setAttribute('aria-expanded', !isOpen);
    }

    btn.addEventListener('click', toggle);

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        toggle();
      }
    });
  }

  // --- Scroll Reveal ---
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
        .forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: CONFIG.revealThreshold, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
      .forEach(el => observer.observe(el));
  }

  // --- Skill Progress Bars ---
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach(bar => observer.observe(bar));
  }

  // --- Counter Animation ---
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion()) {
      counters.forEach(el => {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = CONFIG.counterDuration;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Typing Effect ---
  function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    if (prefersReducedMotion()) {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      el.textContent = words[0] || '';
      return;
    }

    const words = JSON.parse(el.getAttribute('data-words') || '[]');
    if (!words.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = currentWord.substring(0, charIndex);
      }

      let delay = isDeleting ? CONFIG.typingDeleteSpeed : CONFIG.typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = CONFIG.typingPause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = CONFIG.typingSpeed;
      }

      setTimeout(type, delay);
    }

    type();
  }

  // --- Scroll-to-Top ---
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;

    const toggle = () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- Project Filter ---
  function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-item');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // --- Form Validation ---
  function initForms() {
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        let isValid = true;
        form.querySelectorAll('[required]').forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
          } else {
            input.classList.remove('border-red-500');
          }
        });

        if (!isValid) return;

        // Simulate send
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = 'Sent ✓';
          btn.classList.add('btn-sent');
          form.reset();

          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('btn-sent');
          }, 2500);
        }, 1200);
      });
    });
  }

  // --- Lazy Image Load ---
  function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      }
    });
  }

  // --- Parallax (Hero only) ---
  function initParallax() {
    if (prefersReducedMotion()) return;

    const hero = document.querySelector('.hero-gradient');
    if (!hero) return;

    const orbs = hero.querySelectorAll('.orb');
    if (!orbs.length) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled > window.innerHeight) return; // Skip when out of view

      orbs.forEach((orb, i) => {
        const speed = 0.15 + i * 0.08;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  // --- Initialize Everything ---
  function init() {
    initLoader();
    initNavbar();
    initActiveNav();
    initMobileMenu();
    initScrollReveal();
    initSkillBars();
    initCounters();
    initTyping();
    initScrollTop();
    initSmoothScroll();
    initProjectFilter();
    initForms();
    initLazyImages();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
