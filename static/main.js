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
    spans[0].style.transform = mobileNav.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = mobileNav.classList.contains('open') ? '0' : '';
    spans[2].style.transform = mobileNav.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
}

// ── Intersection observer for fade-up
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Animated counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
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

// ── Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) });
      const data = await res.json();
      if (data.status === 'success') {
        contactForm.reset();
        const msg = document.getElementById('formSuccess');
        if (msg) { msg.style.display = 'block'; msg.textContent = data.message; }
      }
    } catch (err) {
      console.error(err);
    } finally {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }
  });
}

// ── Active nav link highlight
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.style.color = 'var(--white)';
  }
});
