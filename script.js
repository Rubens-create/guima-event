// ══════════════════════════════════════════════
// Guimarães Eventos — Landing Page Script
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── ENVELOPE ANIMATION ──────────────────────
  const overlay = document.getElementById('envelope-overlay');
  const envelope = document.getElementById('envelope');
  const flap = document.getElementById('envelope-flap');
  const seal = document.getElementById('envelope-seal');
  const letter = document.getElementById('envelope-letter');
  const cta = document.getElementById('envelope-cta');
  const landingPage = document.getElementById('landing-page');

  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Step 1: Break the seal
    seal.classList.add('breaking');

    setTimeout(() => {
      // Step 2: Open the flap
      flap.classList.add('opened');
      cta.classList.add('fade-out');

      setTimeout(() => {
        // Step 3: Slide letter up
        letter.classList.add('rising');

        setTimeout(() => {
          // Step 4: Zoom everything and fade out
          overlay.classList.add('revealing');

          setTimeout(() => {
            // Step 5: Show landing page
            overlay.style.display = 'none';
            landingPage.classList.remove('hidden');
            landingPage.classList.add('visible');
            document.body.style.overflow = 'auto';

            // Trigger hero animations
            requestAnimationFrame(() => {
              animateHero();
              initScrollAnimations();
            });
          }, 1000);
        }, 800);
      }, 600);
    }, 400);
  }

  // Click handler
  overlay.addEventListener('click', openEnvelope);

  // Keyboard accessibility
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
  overlay.setAttribute('tabindex', '0');
  overlay.focus();

  // Prevent scroll when envelope is visible
  document.body.style.overflow = 'hidden';


  // ─── HERO ANIMATIONS ────────────────────────
  function animateHero() {
    const badge = document.querySelector('.hero-badge');
    const titleLine1 = document.querySelector('.title-line-1');
    const titleLine2 = document.querySelector('.title-line-2');
    const subtitle = document.querySelector('.hero-subtitle');
    const actions = document.querySelector('.hero-actions');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    const elements = [badge, titleLine1, titleLine2, subtitle, actions, scrollIndicator];
    elements.forEach((el, i) => {
      if (el) {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, 200 + i * 200);
      }
    });
  }


  // ─── SCROLL REVEAL ANIMATIONS ───────────────
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
      '.section-header, .about-text, .about-image-wrapper, .service-card, .exp-card, .quote-wrapper, .contact-info, .contact-form-wrapper'
    );

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      el.classList.add('reveal-element');
      revealObserver.observe(el);
    });
  }


  // ─── NAVIGATION ─────────────────────────────
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll effect for nav
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY || window.pageYOffset;

    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Só oculta a barra de navegação ao rolar para baixo se o menu mobile não estiver aberto
    if (currentScroll > lastScroll && currentScroll > 400 && !navLinks.classList.contains('active')) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Se o menu está abrindo, forçar a nav a reaparecer e travar o scroll
    if (navLinks.classList.contains('active')) {
      nav.classList.remove('nav-hidden');
      nav.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });


  // ─── SMOOTH SCROLL ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const targetRect = target.getBoundingClientRect().top;
        const targetPosition = targetRect - bodyRect - offset;
        
        const startPosition = window.pageYOffset || window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 750; // Duração de 750ms para um scroll fluido, ágil e elegante
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          // Easing: Cubic Out (desaceleração premium)
          const easing = 1 - Math.pow(1 - percentage, 3);
          
          window.scrollTo(0, startPosition + distance * easing);
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        window.requestAnimationFrame(step);
      }
    });
  });


  // ─── PARALLAX FOR HERO ──────────────────────
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    if (scrolled <= heroHeight) {
      hero.style.setProperty('--scroll-offset', `${scrolled * 0.4}px`);
    }
  });


  // ─── FORM HANDLING ──────────────────────────
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('input-name').value;
    const eventType = document.getElementById('input-event').value;
    const date = document.getElementById('input-date').value;
    const guests = document.getElementById('input-guests').value;
    const message = document.getElementById('input-message').value;

    if (!name || !eventType) {
      showNotification('Por favor, preencha pelo menos seu nome e tipo de evento.', 'warning');
      return;
    }

    // Build WhatsApp message
    let whatsappMsg = `Olá! Meu nome é *${name}*.\n`;
    whatsappMsg += `Tenho interesse em: *${getEventLabel(eventType)}*\n`;
    if (date) whatsappMsg += `Data prevista: *${formatDate(date)}*\n`;
    if (guests) whatsappMsg += `Número de convidados: *${guests}*\n`;
    if (message) whatsappMsg += `\n${message}`;

    // Redirect to WhatsApp
    const phoneNumber = "556291982373";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank');

    // Show success message in the UI
    submitBtn.innerHTML = '<span>Mensagem Enviada!</span> ✓';
    submitBtn.classList.add('success');
    showNotification('Obrigado pelo interesse! Redirecionando para o WhatsApp... 💛', 'success');

    setTimeout(() => {
      submitBtn.innerHTML = '<span>Enviar Mensagem</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
      submitBtn.classList.remove('success');
      form.reset();
    }, 3000);
  });

  function getEventLabel(type) {
    const labels = {
      casamento: 'Casamento',
      recepcao: 'Recepção',
      '15anos': 'Festa de 15 Anos',
      locacao: 'Locação do Espaço',
      outro: 'Outro'
    };
    return labels[type] || type;
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.innerHTML = `<p>${message}</p>`;
    document.body.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('show'));

    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 400);
    }, 4000);
  }


  // ─── SERVICE CARDS HOVER TILT ───────────────
  // Animação 3D removida a pedido. O hover continua no CSS (zoom e brilho).

});
