/* ═══════════════════════════════════════════════════════
   SimForge — main.js
   Canvas particle field · Scroll reveals · Stat counters
   Sticky nav · Waitlist form
═══════════════════════════════════════════════════════ */

'use strict';

// ─── Sticky Nav ───────────────────────────────────────
const nav = document.getElementById('nav');

const updateNav = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── Scroll-driven Reveal ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ─── Stat Counter Animation ───────────────────────────
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = value >= 1000
      ? value.toLocaleString()
      : value;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target
          .querySelectorAll('[data-count]')
          .forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.getElementById('hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Hero Canvas — Particle Field ────────────────────
const canvas = document.getElementById('heroCanvas');

if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrameId;

  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 130;
  const MOUSE_RADIUS = 160;

  const mouse = { x: -9999, y: -9999 };

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.6;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    if (!particles) {
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,142,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(loop);
  }

  // Init
  resize();
  loop();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pause when off-screen
  const heroSection = document.getElementById('hero');
  const visObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!animFrameId) loop();
    } else {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  });
  visObserver.observe(heroSection);
}

// ─── Waitlist Form ────────────────────────────────────
const form    = document.getElementById('waitlist-form');
const success = document.getElementById('waitlist-success');
const submit  = document.getElementById('waitlist-submit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('waitlist-email').value.trim();
    const vertical = document.getElementById('waitlist-vertical').value;

    if (!email) {
      document.getElementById('waitlist-email').focus();
      return;
    }

    // Button loading state
    submit.textContent = 'Sending…';
    submit.disabled = true;

    // Simulated async (replace with your real API endpoint)
    await new Promise((r) => setTimeout(r, 1000));

    // Show success
    form.querySelector('.waitlist__fields').hidden = true;
    form.querySelector('.waitlist__form-note').hidden = true;
    success.hidden = false;

    // Log for now (wire up to your API / Mailchimp / ConvertKit)
    console.log('Waitlist signup:', { email, vertical });
  });
}

// ─── Smooth scroll for anchor links ──────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Domain tag interaction ───────────────────────────
document.querySelectorAll('.domain-tag').forEach((tag) => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('domain-tag--highlight');
  });
});
