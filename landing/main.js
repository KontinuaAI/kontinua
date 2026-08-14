/* ═══════════════════════════════════════════════════════
   Kontinua — main.js
   Interactive Physics Engine · Code Tabs · ROI Calculator
   Rollout Playground · Particle Field · Sticky Nav
═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. Sticky Nav ────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const updateNav = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // ─── 2. Scroll-driven Reveal ──────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ─── 3. Stat Counter Animation ────────────────────────
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value >= 1000 ? value.toLocaleString() : value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const heroStats = document.getElementById('hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ─── 4. 1-Click Copy Install Command ─────────────────
  const copyInstallBtn = document.getElementById('copy-install-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const installCmd = document.getElementById('install-cmd');

  if (copyInstallBtn && installCmd) {
    copyInstallBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(installCmd.textContent.trim());
        if (copyTooltip) {
          copyTooltip.classList.add('show');
          setTimeout(() => copyTooltip.classList.remove('show'), 2000);
        }
      } catch (err) {
        console.error('Clipboard copy failed', err);
      }
    });
  }

  // ─── 5. Code Tabs Switching & Active Snippet Copy ─────
  const codeTabs = document.querySelectorAll('.code-tab');
  const codePanels = document.querySelectorAll('.code-panel');
  const copyActiveCodeBtn = document.getElementById('copy-active-code');

  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.dataset.tab;

      codeTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      codePanels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  if (copyActiveCodeBtn) {
    copyActiveCodeBtn.addEventListener('click', async () => {
      const activePanel = document.querySelector('.code-panel.active code');
      if (activePanel) {
        try {
          await navigator.clipboard.writeText(activePanel.textContent);
          const origText = copyActiveCodeBtn.querySelector('span').textContent;
          copyActiveCodeBtn.querySelector('span').textContent = 'Copied!';
          setTimeout(() => {
            copyActiveCodeBtn.querySelector('span').textContent = origText;
          }, 1800);
        } catch (err) {
          console.error('Copy failed', err);
        }
      }
    });
  }

  // ─── 6. Interactive Physics Simulation Rollout ────────
  const canvasHPC = document.getElementById('canvasHPC');
  const canvasAI = document.getElementById('canvasAI');
  const simScrubber = document.getElementById('sim-scrubber');
  const simStepVal = document.getElementById('sim-step-val');
  const simPlayToggle = document.getElementById('sim-play-toggle');
  const simPlayText = document.getElementById('sim-play-text');
  const simResetBtn = document.getElementById('sim-reset-btn');

  if (canvasHPC && canvasAI) {
    const ctxHPC = canvasHPC.getContext('2d');
    const ctxAI = canvasAI.getContext('2d');
    let currentStep = 42;
    let isPlaying = true;
    let animId = null;

    // Simulation particle vortex field generator
    function drawVorticityField(ctx, width, height, step, isAI) {
      ctx.fillStyle = '#020409';
      ctx.fillRect(0, 0, width, height);

      const numVortices = 6;
      const t = step * 0.05;

      // Draw fluid streamlines and turbulent vortices
      for (let i = 0; i < numVortices; i++) {
        const angle = (i / numVortices) * Math.PI * 2 + t * 0.4;
        const radius = 50 + Math.sin(t + i) * 25;
        const cx = width / 2 + Math.cos(angle) * radius * 1.5;
        const cy = height / 2 + Math.sin(angle) * radius * 0.9;

        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 70 + Math.sin(t * 2) * 15);
        if (isAI) {
          // AI: Vibrant high-resolution turquoise/indigo vorticity
          grad.addColorStop(0, 'rgba(0, 212, 170, 0.85)');
          grad.addColorStop(0.35, 'rgba(79, 142, 255, 0.55)');
          grad.addColorStop(0.7, 'rgba(123, 95, 255, 0.25)');
          grad.addColorStop(1, 'rgba(5, 8, 17, 0)');
        } else {
          // HPC: Navier-Stokes reference heatmap (Orange/Ruby)
          grad.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
          grad.addColorStop(0.4, 'rgba(255, 159, 67, 0.5)');
          grad.addColorStop(0.75, 'rgba(238, 82, 83, 0.2)');
          grad.addColorStop(1, 'rgba(5, 8, 17, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw grid overlay lines
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Contour text annotation
      ctx.fillStyle = isAI ? 'rgba(0, 212, 170, 0.9)' : 'rgba(255, 107, 107, 0.9)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`ω_max = ${(3.42 + Math.sin(t) * 0.5).toFixed(2)} rad/s`, 12, 20);
      ctx.fillText(`Re = 10,000`, 12, 34);
    }

    function renderSimulation() {
      drawVorticityField(ctxHPC, canvasHPC.width, canvasHPC.height, currentStep, false);
      drawVorticityField(ctxAI, canvasAI.width, canvasAI.height, currentStep, true);

      if (simScrubber) simScrubber.value = currentStep;
      if (simStepVal) simStepVal.textContent = `Step t=${currentStep} / 100`;

      if (isPlaying) {
        currentStep = (currentStep + 1) % 101;
      }
      animId = setTimeout(() => requestAnimationFrame(renderSimulation), 50);
    }

    renderSimulation();

    if (simScrubber) {
      simScrubber.addEventListener('input', (e) => {
        currentStep = parseInt(e.target.value, 10);
        if (simStepVal) simStepVal.textContent = `Step t=${currentStep} / 100`;
        drawVorticityField(ctxHPC, canvasHPC.width, canvasHPC.height, currentStep, false);
        drawVorticityField(ctxAI, canvasAI.width, canvasAI.height, currentStep, true);
      });
    }

    if (simPlayToggle) {
      simPlayToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (simPlayText) simPlayText.textContent = isPlaying ? 'Pause Rollout' : 'Play Rollout';
      });
    }

    if (simResetBtn) {
      simResetBtn.addEventListener('click', () => {
        currentStep = 0;
        if (simScrubber) simScrubber.value = 0;
        if (simStepVal) simStepVal.textContent = `Step t=0 / 100`;
      });
    }
  }

  // ─── 7. HPC ROI & Compute Savings Calculator ──────────
  const calcSims = document.getElementById('calc-sims');
  const calcHours = document.getElementById('calc-hours');
  const calcEngineers = document.getElementById('calc-engineers');

  const calcSimsVal = document.getElementById('calc-sims-val');
  const calcHoursVal = document.getElementById('calc-hours-val');
  const calcEngineersVal = document.getElementById('calc-engineers-val');

  const resOldCost = document.getElementById('res-old-cost');
  const resNewCost = document.getElementById('res-new-cost');
  const resSavings = document.getElementById('res-savings');
  const resTimeSaved = document.getElementById('res-time-saved');

  function updateCalculator() {
    if (!calcSims || !calcHours || !calcEngineers) return;

    const monthlyRuns = parseInt(calcSims.value, 10);
    const avgHours = parseInt(calcHours.value, 10);
    const engineers = parseInt(calcEngineers.value, 10);

    if (calcSimsVal) calcSimsVal.textContent = `${monthlyRuns} runs`;
    if (calcHoursVal) calcHoursVal.textContent = `${avgHours} hours`;
    if (calcEngineersVal) calcEngineersVal.textContent = `${engineers} engineers`;

    // Calculation Constants
    // Traditional HPC: $36/hr average cluster compute + queue overhead
    const traditionalMonthlyCompute = monthlyRuns * avgHours * 36;
    const traditionalAnnualCompute = traditionalMonthlyCompute * 12;

    // Kontinua Cloud: Pro ($149) or Team ($499) + $0.01 per additional API call
    let kontinuaMonthlyBase = monthlyRuns > 5000 ? 499 : 149;
    let includedPredictions = monthlyRuns > 5000 ? 50000 : 5000;
    let overage = Math.max(0, monthlyRuns - includedPredictions) * 0.01;
    const kontinuaAnnual = (kontinuaMonthlyBase + overage) * 12;

    const annualSavings = Math.max(0, traditionalAnnualCompute - kontinuaAnnual);
    const savingsPercent = ((annualSavings / traditionalAnnualCompute) * 100).toFixed(1);
    const monthlyHoursSaved = Math.round(monthlyRuns * (avgHours - 0.001));

    if (resOldCost) resOldCost.textContent = `$${traditionalAnnualCompute.toLocaleString()}`;
    if (resNewCost) resNewCost.textContent = `$${Math.round(kontinuaAnnual).toLocaleString()}`;
    if (resSavings) resSavings.textContent = `$${Math.round(annualSavings).toLocaleString()} / year (${savingsPercent}%)`;
    if (resTimeSaved) resTimeSaved.textContent = `${monthlyHoursSaved.toLocaleString()} Hours / month`;
  }

  [calcSims, calcHours, calcEngineers].forEach((slider) => {
    if (slider) slider.addEventListener('input', updateCalculator);
  });
  updateCalculator();

  // ─── 8. Hero Canvas Background Particle Waves ─────────
  const canvas = document.getElementById('heroCanvas');

  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const PARTICLE_COUNT = 85;
    const CONNECTION_DIST = 135;
    const mouse = { x: -9999, y: -9999 };

    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.8 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (1 - dist / 150) * 0.02;
          this.vx -= dx * force;
          this.vy -= dy * force;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${this.alpha})`;
        ctx.fill();
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.16;
            ctx.strokeStyle = `rgba(79, 142, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(loop);
    };

    loop();
  }

  // ─── 9. Cloud Access Waitlist Form ────────────────────
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistSuccess = document.getElementById('waitlist-success');

  if (waitlistForm && waitlistSuccess) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('waitlist-email');
      const verticalSelect = document.getElementById('waitlist-vertical');

      if (!emailInput || !emailInput.value.includes('@')) {
        emailInput.focus();
        return;
      }

      // Simulate API submission
      const submitBtn = document.getElementById('waitlist-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      setTimeout(() => {
        waitlistForm.querySelectorAll('.waitlist__fields, .waitlist__form-note').forEach((el) => {
          el.style.display = 'none';
        });
        waitlistSuccess.hidden = false;
      }, 700);
    });
  }
});
