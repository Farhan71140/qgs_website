// ── NAV scroll effect
const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  siteNav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile burger
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    const isOpen = mobileNav.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
}

// ── Intersection observer for fade-up
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Animated counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Gold cursor glow trail
(function() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;width:320px;height:320px;border-radius:50%;
    background:radial-gradient(circle,rgba(24,226,153,0.07) 0%,transparent 65%);
    pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
    transition:left 0.6s ease,top 0.6s ease;opacity:0;
  `;
  document.body.appendChild(dot);
  let visible = false;
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    if (!visible) { dot.style.opacity = '1'; visible = true; }
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; visible = false; });
})();

// ── Liquid glass card parallax tilt (subtle)
document.querySelectorAll('.card, .metric-card, .svc-img-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-7px) rotateX(${-cy * 4}deg) rotateY(${cx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(contactForm)
      });
      const data = await res.json();
      if (data.status === 'success') {
        contactForm.reset();
        const msg = document.getElementById('formSuccess');
        if (msg) { msg.style.display = 'block'; msg.textContent = data.message; }
      }
    } catch (err) {
      console.error(err);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// ── Active nav link highlight
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.style.color = 'var(--gold-light)';
  }
});

// ── Gold shimmer on scroll for ticker
document.querySelectorAll('.ticker-item').forEach((item, i) => {
  item.style.animationDelay = (i * 0.1) + 's';
});