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
// ═══════════════════════════════════════════════════
// QGS ENHANCED ANIMATIONS — Mint Background Effects
// ═══════════════════════════════════════════════════

(function() {
  // ── 1. Inject floating orb layer into body ──
  const orbLayer = document.createElement('div');
  orbLayer.className = 'qgs-orb-layer';
  orbLayer.innerHTML = `
    <div class="qgs-orb qgs-orb-1"></div>
    <div class="qgs-orb qgs-orb-2"></div>
    <div class="qgs-orb qgs-orb-3"></div>
    <div class="qgs-orb qgs-orb-4"></div>
  `;
  document.body.prepend(orbLayer);

  // ── 2. Inject shimmer lines into hero sections ──
  document.querySelectorAll('.hero, .hero-split, .page-hero').forEach(hero => {
    const shimmerWrap = document.createElement('div');
    shimmerWrap.className = 'qgs-shimmer-lines';
    shimmerWrap.innerHTML = `
      <div class="qgs-shimmer-line"></div>
      <div class="qgs-shimmer-line"></div>
      <div class="qgs-shimmer-line"></div>
      <div class="qgs-shimmer-line"></div>
    `;
    hero.style.position = 'relative';
    hero.prepend(shimmerWrap);
  });

  // ── 3. Canvas-based floating particle network ──
  const canvas = document.createElement('canvas');
  canvas.id = 'qgs-bg-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    initParticles();
  });

  const PARTICLE_COUNT = 55;
  const BRAND_COLOR = '24,226,153';
  const BRAND_DEEP  = '15,167,110';
  let particles = [];
  let mouse = { x: W / 2, y: H / 2 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });

  function Particle() {
    this.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 2.4 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? BRAND_COLOR : BRAND_DEEP;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.018 + Math.random() * 0.018;
    };
    this.reset();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  const CONNECTION_DIST = 140;
  const MOUSE_REPEL = 90;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const r = p.r + Math.sin(p.pulse) * 0.6;
      const a = p.alpha + Math.sin(p.pulse * 0.7) * 0.12;

      // Slight mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL * 3) {
        p.vx += dx * 0.00008;
        p.vy += dy * 0.00008;
      }

      // Damping
      p.vx *= 0.996;
      p.vy *= 0.996;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw glowing dot
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      grd.addColorStop(0,   `rgba(${p.color},${a})`);
      grd.addColorStop(0.5, `rgba(${p.color},${a * 0.4})`);
      grd.addColorStop(1,   `rgba(${p.color},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Solid center
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${Math.min(a * 1.6, 0.85)})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          const opacity = (1 - d / CONNECTION_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${BRAND_COLOR},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

  // ── 4. Spawn floating mini particles from hero ──
  function spawnParticle(container) {
    const el = document.createElement('div');
    el.className = 'qgs-particle';
    const x = Math.random() * 100;
    el.style.cssText = `
      left: ${x}%;
      bottom: ${10 + Math.random() * 30}%;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      animation-duration: ${3 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: 0;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  document.querySelectorAll('.hero-split, .hero').forEach(hero => {
    setInterval(() => spawnParticle(hero), 600);
  });

  // ── 5. Section glow on scroll ──
  const sections = document.querySelectorAll('.section, .section-sm');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--section-glow', '1');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => sectionObserver.observe(s));

})();
