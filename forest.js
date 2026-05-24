/**
 * Linkora Forest — Cinematic Atmosphere Layer v2
 * Overlay canvas with living forest effects
 */
(function() {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const PERF = isMobile ? 0.3 : 1; // performance multiplier

  /* ── SETUP CANVAS ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'forest-overlay';
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 50;
    pointer-events: none; width: 100%; height: 100%;
    opacity: 1;
  `;
  document.body.appendChild(canvas);

  /* ── CURSOR GLOW ── */
  const cursorEl = document.createElement('div');
  cursorEl.style.cssText = `
    position: fixed; z-index: 9998; pointer-events: none;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.5s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursorEl);

  const ctx = canvas.getContext('2d');
  let W, H, cx = -200, cy = -200, scrollY = 0, time = 0;
  let animFrame;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── CURSOR TRACKING ── */
  if (!isMobile) {
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorEl.style.left = cx + 'px';
      cursorEl.style.top = cy + 'px';
    });
  }

  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── FIREFLIES ── */
  class Firefly {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
      this.size = Math.random() * 2.5 + 1;
      this.hue = 130 + Math.random() * 40;
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(time * 0.01 + this.y * 0.01) * 0.3;
      this.y += this.vy + Math.cos(time * 0.008 + this.x * 0.01) * 0.2;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade = Math.sin(progress * Math.PI);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.05 + this.x);
      const alpha = fade * pulse * 0.7;
      if (alpha < 0.01) return;

      // Glow
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 8);
      g.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${alpha})`);
      g.addColorStop(0.4, `hsla(${this.hue}, 70%, 50%, ${alpha * 0.4})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 8, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `hsla(${this.hue}, 90%, 85%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── FALLING LEAVES ── */
  class Leaf {
    constructor(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = Math.random() * 0.8 + 0.3;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.size = Math.random() * 8 + 4;
      this.alpha = Math.random() * 0.3 + 0.05;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      this.hue = 120 + Math.random() * 40;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.5;
      this.y += this.vy;
      this.rot += this.rotSpeed;
      // Mouse repulsion
      if (!isMobile) {
        const dx = this.x - cx, dy = this.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.vx += dx / dist * 0.3;
          this.vy += dy / dist * 0.2;
        }
      }
      this.vx *= 0.99;
      this.vy = Math.max(0.3, this.vy * 0.995);
      if (this.y > H + 30) {
        this.x = Math.random() * W;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = Math.random() * 0.8 + 0.3;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(${this.hue}, 60%, 55%)`;
      // Leaf shape
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Vein
      ctx.strokeStyle = `hsl(${this.hue}, 40%, 35%)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.lineTo(this.size, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ── CURSOR TRAIL PARTICLES ── */
  class TrailParticle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 10;
      this.y = y + (Math.random() - 0.5) * 10;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = -Math.random() * 1.5 - 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.04 + 0.02;
      this.size = Math.random() * 3 + 1;
      this.hue = 130 + Math.random() * 30;
    }
    update() {
      this.life -= this.decay;
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.globalAlpha = this.life * 0.4;
      ctx.fillStyle = `hsl(${this.hue}, 70%, 65%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── LIGHT RAYS ── */
  function drawLightRays() {
    const rayCount = isMobile ? 0 : 3;
    for (let i = 0; i < rayCount; i++) {
      const rx = W * (0.2 + i * 0.3) + Math.sin(time * 0.002 + i) * 80;
      const ry = 0;
      const rw = 60 + Math.sin(time * 0.003 + i * 2) * 20;
      const rh = H * 0.7;
      const alpha = 0.015 + Math.sin(time * 0.004 + i) * 0.005;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(Math.sin(time * 0.001 + i) * 0.05);
      const g = ctx.createLinearGradient(0, 0, 0, rh);
      g.addColorStop(0, `rgba(116,198,157,${alpha})`);
      g.addColorStop(0.6, `rgba(82,183,136,${alpha * 0.5})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-rw / 2, 0);
      ctx.lineTo(rw / 2, 0);
      ctx.lineTo(rw, rh);
      ctx.lineTo(-rw, rh);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── MOVING FOG ── */
  function drawFog() {
    if (isMobile) return;
    for (let i = 0; i < 3; i++) {
      const fx = (time * (0.1 + i * 0.05) + i * 400) % (W + 400) - 200;
      const fy = H * (0.3 + i * 0.2) + Math.sin(time * 0.003 + i) * 30;
      const fw = 400 + i * 200;
      const fh = 80 + i * 40;
      const alpha = 0.02 + Math.sin(time * 0.002 + i) * 0.01;

      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fw * 0.5);
      g.addColorStop(0, `rgba(10,26,12,${alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(fx, fy, fw, fh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── AMBIENT GLOW SPOTS ── */
  function drawAmbientGlow() {
    const spots = [
      { x: W * 0.2, y: H * 0.1, r: 300 },
      { x: W * 0.8, y: H * 0.4, r: 250 },
      { x: W * 0.5, y: H * 0.7, r: 350 },
    ];
    spots.forEach((s, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.005 + i * 2);
      const alpha = 0.02 + pulse * 0.02;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, `rgba(82,183,136,${alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
  }

  /* ── CURSOR GLOW ON CANVAS ── */
  function drawCursorGlow() {
    if (isMobile || cx < 0) return;
    const r = 150;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(116,198,157,0.06)');
    g.addColorStop(0.5, 'rgba(82,183,136,0.02)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ── INIT OBJECTS ── */
  const fireflies = Array.from({ length: Math.floor(25 * PERF) }, () => new Firefly());
  const leaves = Array.from({ length: Math.floor(15 * PERF) }, () => new Leaf(true));
  const trail = [];
  let lastTrailX = -100, lastTrailY = -100;

  /* ── MAIN LOOP ── */
  function draw() {
    animFrame = requestAnimationFrame(draw);
    time++;

    ctx.clearRect(0, 0, W, H);

    // Ambient glow
    drawAmbientGlow();

    // Light rays
    drawLightRays();

    // Fog
    drawFog();

    // Fireflies
    ctx.save();
    fireflies.forEach(f => { f.update(); f.draw(); });
    ctx.restore();

    // Leaves
    ctx.save();
    leaves.forEach(l => { l.update(); l.draw(); });
    ctx.restore();

    // Cursor trail
    if (!isMobile) {
      const dx = cx - lastTrailX, dy = cy - lastTrailY;
      const moved = Math.sqrt(dx * dx + dy * dy);
      if (moved > 8 && time % 2 === 0) {
        trail.push(new TrailParticle(cx, cy));
        lastTrailX = cx; lastTrailY = cy;
      }
      ctx.save();
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].update();
        trail[i].draw();
        if (trail[i].life <= 0) trail.splice(i, 1);
      }
      if (trail.length > 30) trail.splice(0, trail.length - 30);
      ctx.restore();
    }

    // Cursor glow
    drawCursorGlow();

    ctx.globalAlpha = 1;
  }

  // Start
  draw();

  /* ── BRANCH SWAY ── */
  // Add gentle sway to existing SVG branches
  const branches = document.querySelectorAll('.branch');
  function swayBranches() {
    branches.forEach((b, i) => {
      const sway = Math.sin(Date.now() * 0.0008 + i) * 3;
      const scrollOff = scrollY * 0.15;
      const isFlipped = b.classList.contains('branch-tr');
      b.style.transform = `translateY(${scrollOff + sway}px) ${isFlipped ? 'scaleX(-1)' : ''}`;
    });
    requestAnimationFrame(swayBranches);
  }
  swayBranches();

  /* ── BREATHING GLOW ── */
  // Subtle pulse on hero title
  const heroTitle = document.querySelector('.hero-title em');
  if (heroTitle) {
    let glowDir = 1, glowVal = 0;
    setInterval(() => {
      glowVal += glowDir * 0.02;
      if (glowVal >= 1) glowDir = -1;
      if (glowVal <= 0) glowDir = 1;
      const intensity = 0.3 + glowVal * 0.4;
      heroTitle.style.textShadow = `0 0 ${30 + glowVal * 30}px rgba(82,183,136,${intensity}), 0 0 ${60 + glowVal * 40}px rgba(82,183,136,${intensity * 0.4})`;
    }, 50);
  }

  /* ── SECTION BORDER GLOW ON SCROLL ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'box-shadow 1s ease';
        entry.target.style.boxShadow = '0 0 60px rgba(82,183,136,0.04)';
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.feat-card, .step-card, .price-card').forEach(el => observer.observe(el));

  /* ── MOBILE: disable heavy effects ── */
  if (isMobile) {
    canvas.style.opacity = '0.5';
  }

  console.log('🌿 Linkora Forest atmosphere loaded');
})();
