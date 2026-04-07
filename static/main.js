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
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Animated counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
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

// ── Subtle card tilt on hover
document.querySelectorAll('.card, .metric-card, .svc-img-card, .ind-img-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-cy * 3}deg) rotateY(${cx * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Gold shimmer cursor glow
(function() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:280px;height:280px;border-radius:50%;pointer-events:none;
    z-index:9998;transform:translate(-50%,-50%);opacity:0;
    background:radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 65%);
    transition:left 0.5s ease,top 0.5s ease,opacity 0.3s;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();

// ── Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) });
      const data = await res.json();
      if (data.status === 'success') {
        contactForm.reset();
        const msg = document.getElementById('formSuccess');
        if (msg) { msg.style.display = 'block'; msg.textContent = data.message; }
      }
    } catch (err) { console.error(err); }
    finally { btn.textContent = original; btn.disabled = false; }
  });
}

// ── Active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.style.color = 'var(--gold-dim)';
});
