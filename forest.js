/**
 * Linkora Forest — Cinematic Atmosphere Layer v3
 * Deep Forest with mushrooms, vines, multi-layer depth
 */
(function() {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const PERF = isMobile ? 0.3 : 1;

  /* ── MAIN OVERLAY CANVAS ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'forest-overlay';
  canvas.style.cssText = `position:fixed;inset:0;z-index:50;pointer-events:none;width:100%;height:100%;`;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  /* ── BACKGROUND DEPTH CANVAS (behind content) ── */
  const bgCanvas = document.createElement('canvas');
  bgCanvas.style.cssText = `position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;`;
  document.body.insertBefore(bgCanvas, document.body.firstChild);
  const bgCtx = bgCanvas.getContext('2d');

  /* ── CURSOR ── */
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `position:fixed;z-index:9998;pointer-events:none;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(82,183,136,0.03) 0%,transparent 70%);transform:translate(-50%,-50%);mix-blend-mode:screen;transition:opacity 0.3s;`;
  document.body.appendChild(cursorGlow);

  let W, H, cx = -500, cy = -500, scrollY = 0, time = 0;

  function resize() {
    W = canvas.width = bgCanvas.width = window.innerWidth;
    H = canvas.height = bgCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  if (!isMobile) {
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
    });
  }
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ══════════════════════════════════════════
     BACKGROUND LAYER — Deep Forest Depth
  ══════════════════════════════════════════ */

  function drawForestBackground() {
    bgCtx.clearRect(0, 0, W, H);

    // Layer 1: Deep background glow spots (slow moving)
    const spots = [
      { x: 0.15, y: 0.3, r: 0.35, speed: 0.0003 },
      { x: 0.85, y: 0.5, r: 0.3, speed: 0.0004 },
      { x: 0.5, y: 0.8, r: 0.4, speed: 0.0002 },
    ];
    spots.forEach((s, i) => {
      const px = W * (s.x + Math.sin(time * s.speed + i) * 0.05);
      const py = H * (s.y + Math.cos(time * s.speed * 0.7 + i) * 0.03);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.004 + i * 2);
      const alpha = (0.04 + pulse * 0.03) * PERF;
      const g = bgCtx.createRadialGradient(px, py, 0, px, py, W * s.r);
      g.addColorStop(0, `rgba(45,106,79,${alpha})`);
      g.addColorStop(0.5, `rgba(26,51,32,${alpha * 0.5})`);
      g.addColorStop(1, 'transparent');
      bgCtx.fillStyle = g;
      bgCtx.fillRect(0, 0, W, H);
    });

    // Layer 2: Volumetric light shafts from top
    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        const rx = W * (0.1 + i * 0.27) + Math.sin(time * 0.001 + i * 1.5) * 60;
        const rw = 40 + Math.sin(time * 0.002 + i) * 15;
        const alpha = (0.015 + Math.sin(time * 0.003 + i) * 0.008) * PERF;
        bgCtx.save();
        bgCtx.translate(rx, 0);
        bgCtx.rotate(Math.sin(time * 0.0008 + i) * 0.04);
        const g = bgCtx.createLinearGradient(0, 0, 0, H * 0.8);
        g.addColorStop(0, `rgba(116,198,157,${alpha})`);
        g.addColorStop(0.4, `rgba(82,183,136,${alpha * 0.6})`);
        g.addColorStop(1, 'transparent');
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.moveTo(-rw, 0);
        bgCtx.lineTo(rw, 0);
        bgCtx.lineTo(rw * 3, H * 0.8);
        bgCtx.lineTo(-rw * 3, H * 0.8);
        bgCtx.closePath();
        bgCtx.fill();
        bgCtx.restore();
      }
    }

    // Layer 3: Moving fog bands
    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        const fy = H * (0.2 + i * 0.22) + Math.sin(time * 0.002 + i * 1.3) * 20;
        const fw = W * 0.8;
        const fx = W * 0.5 + Math.sin(time * 0.001 + i * 0.7) * W * 0.1;
        const alpha = (0.015 + Math.sin(time * 0.003 + i) * 0.008) * PERF;
        const g = bgCtx.createRadialGradient(fx, fy, 0, fx, fy, fw);
        g.addColorStop(0, `rgba(10,26,12,${alpha})`);
        g.addColorStop(0.6, `rgba(5,13,7,${alpha * 0.5})`);
        g.addColorStop(1, 'transparent');
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.ellipse(fx, fy, fw, 50 + i * 20, 0, 0, Math.PI * 2);
        bgCtx.fill();
      }
    }

    // Layer 4: Ground glow (bottom)
    const groundG = bgCtx.createLinearGradient(0, H * 0.85, 0, H);
    groundG.addColorStop(0, 'transparent');
    groundG.addColorStop(1, `rgba(26,51,32,${0.06 * PERF})`);
    bgCtx.fillStyle = groundG;
    bgCtx.fillRect(0, H * 0.85, W, H * 0.15);
  }

  /* ══════════════════════════════════════════
     SVG BRANCH PATHS — Organic corners
  ══════════════════════════════════════════ */

  function drawBranches() {
    if (isMobile) return;

    // Top-left branch cluster
    drawBranchCluster(ctx, 0, 0, 1, 1, time);
    // Top-right branch cluster
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    drawBranchCluster(ctx, 0, 0, 1, 1, time + 100);
    ctx.restore();
  }

  function drawBranchCluster(c, ox, oy, sx, sy, t) {
    c.save();
    c.translate(ox, oy);

    // Main branch
    const branches = [
      { path: [[0,-30],[80,40],[160,90],[240,120],[320,110]], w: 3, sway: 0.0006 },
      { path: [[60,20],[120,60],[180,100]], w: 1.5, sway: 0.001 },
      { path: [[120,50],[160,100],[200,140],[220,180]], w: 1.2, sway: 0.0008 },
      { path: [[200,100],[260,80],[330,60],[400,40]], w: 1, sway: 0.0012 },
    ];

    branches.forEach((br, bi) => {
      if (br.path.length < 2) return;
      c.save();
      const swayAmt = Math.sin(t * br.sway + bi) * 5;
      c.translate(swayAmt * 0.3, swayAmt * 0.5);

      // Draw branch
      c.beginPath();
      c.moveTo(br.path[0][0], br.path[0][1]);
      for (let i = 1; i < br.path.length; i++) {
        const px = br.path[i][0], py = br.path[i][1];
        const cpx = (br.path[i-1][0] + px) / 2;
        const cpy = (br.path[i-1][1] + py) / 2;
        c.quadraticCurveTo(cpx, cpy, px, py);
      }
      c.strokeStyle = `rgba(26,51,32,${0.5 * PERF})`;
      c.lineWidth = br.w;
      c.lineCap = 'round';
      c.stroke();

      // Add leaves along branch
      if (PERF > 0.5) {
        br.path.forEach((pt, pi) => {
          if (pi % 2 === 0 && pi > 0) {
            drawLeafOnBranch(c, pt[0], pt[1], t + pi * 50, bi);
          }
        });
      }
      c.restore();
    });
    c.restore();
  }

  function drawLeafOnBranch(c, x, y, t, seed) {
    const sway = Math.sin(t * 0.001 + seed) * 0.3;
    const size = 8 + Math.sin(seed * 7.3) * 4;
    const alpha = 0.25 + Math.sin(seed * 3.7) * 0.1;
    c.save();
    c.translate(x, y);
    c.rotate(-0.5 + seed * 0.8 + sway);
    c.globalAlpha = alpha * PERF;
    c.fillStyle = `hsl(${125 + seed * 15}, 55%, ${35 + seed * 10}%)`;
    c.beginPath();
    c.ellipse(0, -size/2, size * 0.4, size * 0.7, 0, 0, Math.PI * 2);
    c.fill();
    // Vein
    c.strokeStyle = `rgba(20,50,25,0.4)`;
    c.lineWidth = 0.6;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -size);
    c.stroke();
    c.restore();
  }

  /* ══════════════════════════════════════════
     MUSHROOMS — Bottom corners
  ══════════════════════════════════════════ */

  function drawMushrooms() {
    if (isMobile) return;
    const mushroomData = [
      { x: 40, scale: 1, delay: 0 },
      { x: 90, scale: 0.7, delay: 0.5 },
      { x: 130, scale: 0.5, delay: 1 },
      { x: W - 50, scale: 1, delay: 0.3, flip: true },
      { x: W - 100, scale: 0.6, delay: 0.8, flip: true },
      { x: W - 140, scale: 0.4, delay: 1.2, flip: true },
    ];

    mushroomData.forEach(m => {
      drawMushroom(ctx, m.x, H, m.scale, time + m.delay * 100, m.flip);
    });
  }

  function drawMushroom(c, x, y, scale, t, flip) {
    const s = scale * 45;
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.005);
    const glowAlpha = (0.3 + pulse * 0.3) * PERF;
    const bobY = Math.sin(t * 0.003) * 2;

    c.save();
    c.translate(x, y + bobY);
    if (flip) c.scale(-1, 1);

    // Glow aura
    const ga = c.createRadialGradient(0, -s * 0.8, 0, 0, -s * 0.8, s * 1.5);
    ga.addColorStop(0, `rgba(82,183,136,${glowAlpha * 0.4})`);
    ga.addColorStop(0.5, `rgba(45,106,79,${glowAlpha * 0.15})`);
    ga.addColorStop(1, 'transparent');
    c.fillStyle = ga;
    c.fillRect(-s * 1.5, -s * 2.5, s * 3, s * 2.5);

    // Stem
    c.fillStyle = `rgba(180,220,180,${0.6 * PERF})`;
    c.beginPath();
    c.ellipse(0, -s * 0.3, s * 0.18, s * 0.4, 0, 0, Math.PI * 2);
    c.fill();

    // Cap
    const capG = c.createRadialGradient(-s * 0.2, -s * 0.9, 0, 0, -s * 0.8, s * 0.8);
    capG.addColorStop(0, `rgba(200,240,200,${0.8 * PERF})`);
    capG.addColorStop(0.4, `rgba(116,198,157,${0.7 * PERF})`);
    capG.addColorStop(1, `rgba(45,106,79,${0.5 * PERF})`);
    c.fillStyle = capG;
    c.beginPath();
    c.ellipse(0, -s * 0.8, s * 0.7, s * 0.5, 0, 0, Math.PI * 2);
    c.fill();

    // Cap highlight
    c.fillStyle = `rgba(230,255,230,${0.4 * PERF})`;
    c.beginPath();
    c.ellipse(-s * 0.15, -s * 0.95, s * 0.25, s * 0.12, -0.3, 0, Math.PI * 2);
    c.fill();

    // Spots
    c.fillStyle = `rgba(255,255,255,${0.3 * PERF})`;
    [[0.1, -0.7], [-0.25, -0.85], [0.3, -0.9]].forEach(([dx, dy]) => {
      c.beginPath();
      c.arc(dx * s, dy * s, s * 0.06, 0, Math.PI * 2);
      c.fill();
    });

    c.restore();
  }

  /* ══════════════════════════════════════════
     VINES — Around sections
  ══════════════════════════════════════════ */

  function drawVines() {
    if (isMobile) return;
    // Left edge vine
    drawEdgeVine(ctx, 0, W, time);
    // Right edge vine
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    drawEdgeVine(ctx, 0, W, time + 200);
    ctx.restore();
  }

  function drawEdgeVine(c, ox, W, t) {
    c.save();
    const alpha = 0.2 * PERF;
    c.strokeStyle = `rgba(45,106,79,${alpha})`;
    c.lineWidth = 1.2;
    c.lineCap = 'round';

    // Vine path down left edge
    c.beginPath();
    let py = 0;
    c.moveTo(20 + Math.sin(t * 0.001) * 10, 0);
    for (let i = 0; i < 20; i++) {
      const x = 15 + Math.sin(t * 0.0008 + i * 0.8) * 20 + i * 2;
      const y = py + H / 20;
      c.quadraticCurveTo(x + Math.sin(i) * 15, py + H / 40, x, y);
      py = y;

      // Small leaves
      if (i % 3 === 0 && PERF > 0.5) {
        c.save();
        c.translate(x, y);
        c.rotate(Math.sin(t * 0.001 + i) * 0.5 + (i % 2 === 0 ? 0.8 : -0.8));
        c.fillStyle = `rgba(82,183,136,${alpha * 1.5})`;
        c.beginPath();
        c.ellipse(6, 0, 8, 4, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }
    c.stroke();
    c.restore();
  }

  /* ══════════════════════════════════════════
     FIREFLIES — Bioluminescent
  ══════════════════════════════════════════ */

  class Firefly {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H * 0.3 + Math.random() * H * 0.7;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 400;
      this.size = Math.random() * 2 + 0.8;
      this.hue = 120 + Math.random() * 50;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(time * 0.008 + this.phase) * 0.4;
      this.y += this.vy + Math.cos(time * 0.006 + this.phase) * 0.3;
      if (this.life > this.maxLife || this.x < -20 || this.x > W + 20) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade = Math.sin(progress * Math.PI);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.06 + this.phase);
      const alpha = fade * pulse * 0.7 * PERF;
      if (alpha < 0.01) return;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 10);
      g.addColorStop(0, `hsla(${this.hue},85%,75%,${alpha})`);
      g.addColorStop(0.3, `hsla(${this.hue},70%,55%,${alpha * 0.5})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsla(${this.hue},95%,90%,${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ══════════════════════════════════════════
     FALLING LEAVES
  ══════════════════════════════════════════ */

  class FallingLeaf {
    constructor(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = Math.random() * 0.6 + 0.2;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.size = Math.random() * 10 + 5;
      this.alpha = (Math.random() * 0.2 + 0.05) * PERF;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.025 + 0.008;
      this.hue = 115 + Math.random() * 45;
      this.saturation = 40 + Math.random() * 30;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.6;
      this.y += this.vy;
      this.rot += this.rotSpeed;
      if (!isMobile) {
        const dx = this.x - cx, dy = this.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { this.vx += dx / dist * 0.15; this.vy += dy / dist * 0.1; }
      }
      this.vx *= 0.99;
      this.vy = Math.max(0.2, Math.min(1.5, this.vy * 0.998));
      if (this.y > H + 30) { this.x = Math.random() * W; this.y = -20; this.vx = (Math.random() - 0.5) * 1.5; this.vy = Math.random() * 0.6 + 0.2; }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(${this.hue},${this.saturation}%,45%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `hsl(${this.hue},30%,30%)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.lineTo(this.size, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ══════════════════════════════════════════
     CURSOR TRAIL
  ══════════════════════════════════════════ */

  class TrailParticle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 8;
      this.y = y + (Math.random() - 0.5) * 8;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = -Math.random() * 1.2 - 0.3;
      this.life = 1;
      this.decay = Math.random() * 0.04 + 0.025;
      this.size = Math.random() * 2.5 + 0.8;
      this.hue = 125 + Math.random() * 25;
    }
    update() { this.life -= this.decay; this.x += this.vx; this.y += this.vy; this.vy += 0.015; }
    draw() {
      if (this.life <= 0) return;
      ctx.globalAlpha = this.life * 0.15;
      ctx.fillStyle = `hsl(${this.hue},65%,60%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */

  const fireflies = Array.from({ length: Math.floor(20 * PERF) }, () => new Firefly());
  const fallingLeaves = Array.from({ length: Math.floor(12 * PERF) }, () => new FallingLeaf(true));
  const trail = [];
  let lastTX = -200, lastTY = -200;

  /* ══════════════════════════════════════════
     MAIN ANIMATION LOOP
  ══════════════════════════════════════════ */

  function animate() {
    requestAnimationFrame(animate);
    time++;

    // BG Layer
    drawForestBackground();

    // FG Canvas
    ctx.clearRect(0, 0, W, H);

    // Branches (top corners)
    drawBranches();

    // Edge vines
    drawVines();

    // Mushrooms (bottom)
    drawMushrooms();

    // Fireflies
    ctx.save();
    fireflies.forEach(f => { f.update(); f.draw(); });
    ctx.restore();

    // Falling leaves
    ctx.save();
    fallingLeaves.forEach(l => { l.update(); l.draw(); });
    ctx.restore();

    // Cursor trail + glow
    if (!isMobile) {
      const dx = cx - lastTX, dy = cy - lastTY;
      if (Math.sqrt(dx*dx + dy*dy) > 10 && time % 2 === 0) {
        trail.push(new TrailParticle(cx, cy));
        lastTX = cx; lastTY = cy;
      }
      ctx.save();
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].update(); trail[i].draw();
        if (trail[i].life <= 0) trail.splice(i, 1);
      }
      if (trail.length > 25) trail.splice(0, trail.length - 25);
      ctx.restore();

      // Cursor canvas glow
      if (cx > 0) {
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
        cg.addColorStop(0, 'rgba(116,198,157,0.025)');
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  animate();

  /* ══════════════════════════════════════════
     BRANCH SWAY
  ══════════════════════════════════════════ */

  const svgBranches = document.querySelectorAll('.branch');
  function swayBranches() {
    svgBranches.forEach((b, i) => {
      const sway = Math.sin(Date.now() * 0.0007 + i * 1.5) * 4;
      const scrollOff = scrollY * 0.12;
      const isFlipped = b.classList.contains('branch-tr');
      const isBL = b.classList.contains('branch-bl') || b.classList.contains('branch-br');
      b.style.transform = `translateY(${scrollOff + sway}px)${isFlipped ? ' scaleX(-1)' : ''}${isBL ? ' scaleY(-1)' : ''}`;
    });
    requestAnimationFrame(swayBranches);
  }
  swayBranches();

  /* ══════════════════════════════════════════
     HERO BREATHING GLOW
  ══════════════════════════════════════════ */

  const heroEm = document.querySelector('.hero-title em');
  if (heroEm) {
    let gv = 0, gd = 1;
    setInterval(() => {
      gv += gd * 0.015; if (gv >= 1) gd = -1; if (gv <= 0) gd = 1;
      const i = 0.25 + gv * 0.35;
      heroEm.style.textShadow = `0 0 ${25 + gv*25}px rgba(82,183,136,${i}), 0 0 ${50+gv*30}px rgba(82,183,136,${i*0.4})`;
    }, 50);
  }

  /* ══════════════════════════════════════════
     CARD HOVER GLOW
  ══════════════════════════════════════════ */

  document.querySelectorAll('.feat-card, .step-card, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease';
      el.style.boxShadow = '0 0 40px rgba(82,183,136,0.12), 0 20px 60px rgba(5,13,7,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '';
    });
  });

  console.log('🌿 Linkora Forest v3 loaded');
})();
