document.addEventListener("DOMContentLoaded", () => {
  // ─── Interactive Physics Simulation Rollout ────────
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
      ctx.fillText(`w_max = ${(3.42 + Math.sin(t) * 0.5).toFixed(2)} rad/s`, 12, 20);
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
});
