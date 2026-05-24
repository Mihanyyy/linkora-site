/**
 * Linkora Forest — Cinematic v4
 * Branches everywhere, vines on cards, no mushrooms
 */
(function() {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const PERF = isMobile ? 0.25 : 1;

  /* ── CANVASES ── */
  const bgCanvas = document.createElement('canvas');
  bgCanvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;';
  document.body.insertBefore(bgCanvas, document.body.firstChild);
  const bgCtx = bgCanvas.getContext('2d');

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:50;pointer-events:none;width:100%;height:100%;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  /* ── CURSOR ── */
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = 'position:fixed;z-index:9998;pointer-events:none;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,136,0.04) 0%,rgba(82,183,136,0.015) 40%,transparent 70%);transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width 0.4s,height 0.4s;';
  document.body.appendChild(cursorGlow);

  let W, H, cx = -500, cy = -500, scrollY = 0, time = 0;

  function resize() {
    W = canvas.width = bgCanvas.width = window.innerWidth;
    H = canvas.height = bgCanvas.height = window.innerHeight;
    }
  W = canvas.width = bgCanvas.width = window.innerWidth;
  H = canvas.height = bgCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => { resize(); });

  if (!isMobile) {
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      targetX = e.clientX; targetY = e.clientY;
    });
    // Gemini inertia: smooth cursor lag (water/air effect)
    setInterval(() => {
      cx += (targetX - cx) * 0.08;
      cy += (targetY - cy) * 0.08;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
    }, 16);
  }
  window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  // Parallax on hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0001})`;
  }
  // Nav fade in
  const nav = document.getElementById('nav');
  if (nav) {
    if (scrollY > 80) {
      nav.style.background = 'rgba(2,8,4,0.88)';
      nav.style.backdropFilter = 'blur(24px) saturate(1.3)';
    } else {
      nav.style.background = 'rgba(5,13,7,0)';
      nav.style.backdropFilter = 'none';
    }
  }
});

  /* ══════════════════════
     CARD VINE OVERLAYS (DOM SVG)
  ══════════════════════ */
  function injectCardVines() {
    if (isMobile) return;
    document.querySelectorAll('.feat-card, .step-card, .price-card').forEach(el => {
      if (el.querySelector('.card-vine-svg')) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('card-vine-svg');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:10;opacity:0.55;';
      svg.setAttribute('preserveAspectRatio', 'none');

      const r = el.getBoundingClientRect();
      const w = r.width || 300, h = r.height || 200;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      // Top-left corner branch
      const tl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      tl.innerHTML = `
        <path d="M-10,-10 C20,10 40,5 60,25 C80,45 70,65 90,75" stroke="#2d6a4f" stroke-width="1.5" fill="none" opacity="0.7"/>
        <path d="M20,0 C30,15 25,30 40,38" stroke="#2d6a4f" stroke-width="1" fill="none" opacity="0.5"/>
        <ellipse cx="60" cy="25" rx="9" ry="5" fill="#3a8a5f" opacity="0.6" transform="rotate(-30 60 25)"/>
        <ellipse cx="40" cy="38" rx="7" ry="4" fill="#52b788" opacity="0.5" transform="rotate(20 40 38)"/>
        <ellipse cx="90" cy="75" rx="8" ry="4.5" fill="#3a8a5f" opacity="0.55" transform="rotate(-45 90 75)"/>
        <ellipse cx="28" cy="10" rx="5" ry="3" fill="#52b788" opacity="0.4" transform="rotate(-60 28 10)"/>
      `;
      svg.appendChild(tl);

      // Top-right corner branch
      const tr = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      tr.innerHTML = `
        <path d="M${w+10},-10 C${w-20},10 ${w-40},8 ${w-55},28 C${w-70},48 ${w-60},68 ${w-85},78" stroke="#2d6a4f" stroke-width="1.5" fill="none" opacity="0.7"/>
        <path d="M${w-22},2 C${w-32},18 ${w-28},32 ${w-42},40" stroke="#2d6a4f" stroke-width="1" fill="none" opacity="0.5"/>
        <ellipse cx="${w-55}" cy="28" rx="9" ry="5" fill="#3a8a5f" opacity="0.6" transform="rotate(30 ${w-55} 28)"/>
        <ellipse cx="${w-42}" cy="40" rx="7" ry="4" fill="#52b788" opacity="0.5" transform="rotate(-20 ${w-42} 40)"/>
        <ellipse cx="${w-85}" cy="78" rx="8" ry="4.5" fill="#3a8a5f" opacity="0.55" transform="rotate(45 ${w-85} 78)"/>
      `;
      svg.appendChild(tr);

      // Bottom vine
      const bot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      bot.innerHTML = `
        <path d="M${w*0.2},${h+5} C${w*0.35},${h-15} ${w*0.5},${h-10} ${w*0.65},${h-20} C${w*0.8},${h-30} ${w*0.85},${h+5} ${w*0.95},${h+8}" stroke="#2d6a4f" stroke-width="1.2" fill="none" opacity="0.5"/>
        <ellipse cx="${w*0.35}" cy="${h-12}" rx="7" ry="4" fill="#52b788" opacity="0.45" transform="rotate(-15 ${w*0.35} ${h-12})"/>
        <ellipse cx="${w*0.65}" cy="${h-18}" rx="8" ry="4.5" fill="#3a8a5f" opacity="0.5" transform="rotate(25 ${w*0.65} ${h-18})"/>
      `;
      svg.appendChild(bot);

      el.style.position = 'relative';
      el.style.overflow = 'visible';
      el.appendChild(svg);

      // Animate sway
      animateCardVine(svg);
    });
  }

  

  /* ══════════════════════
     BACKGROUND
  ══════════════════════ */
  function drawBg() {
    bgCtx.clearRect(0, 0, W, H);
    // Ambient glow spots
    [[0.15, 0.25], [0.85, 0.45], [0.5, 0.75]].forEach(([sx, sy], i) => {
      const px = W * sx + Math.sin(time * 0.0003 + i) * 50;
      const py = H * sy + Math.cos(time * 0.0004 + i) * 30;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.004 + i * 2);
      const a = (0.035 + pulse * 0.025) * PERF;
      const g = bgCtx.createRadialGradient(px, py, 0, px, py, W * 0.35);
      g.addColorStop(0, `rgba(45,106,79,${a})`);
      g.addColorStop(1, 'transparent');
      bgCtx.fillStyle = g;
      bgCtx.fillRect(0, 0, W, H);
    });
    // Light rays
    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        const rx = W * (0.1 + i * 0.27) + Math.sin(time * 0.001 + i * 1.5) * 50;
        const rw = 35 + Math.sin(time * 0.002 + i) * 12;
        const a = (0.012 + Math.sin(time * 0.003 + i) * 0.006) * PERF;
        bgCtx.save();
        bgCtx.translate(rx, 0);
        bgCtx.rotate(Math.sin(time * 0.0008 + i) * 0.035);
        const g = bgCtx.createLinearGradient(0, 0, 0, H * 0.75);
        g.addColorStop(0, `rgba(116,198,157,${a})`);
        g.addColorStop(0.5, `rgba(82,183,136,${a * 0.5})`);
        g.addColorStop(1, 'transparent');
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.moveTo(-rw, 0); bgCtx.lineTo(rw, 0);
        bgCtx.lineTo(rw * 3, H * 0.75); bgCtx.lineTo(-rw * 3, H * 0.75);
        bgCtx.closePath(); bgCtx.fill();
        bgCtx.restore();
      }
    }
    // Fog
    if (!isMobile) {
      for (let i = 0; i < 3; i++) {
        const fy = H * (0.25 + i * 0.25) + Math.sin(time * 0.002 + i) * 20;
        const fx = W * 0.5 + Math.sin(time * 0.001 + i) * W * 0.08;
        const a = (0.012 + Math.sin(time * 0.003 + i) * 0.006) * PERF;
        const g = bgCtx.createRadialGradient(fx, fy, 0, fx, fy, W * 0.55);
        g.addColorStop(0, `rgba(10,26,12,${a})`);
        g.addColorStop(1, 'transparent');
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.ellipse(fx, fy, W * 0.55, 55 + i * 15, 0, 0, Math.PI * 2);
        bgCtx.fill();
      }
    }
  }

  /* ══════════════════════
     CORNER BRANCHES (canvas)
  ══════════════════════ */
  function drawCornerBranches() {
    if (isMobile) return;
    // Top-left
    drawCorner(ctx, 0, 0, 1, time);
    // Top-right
    ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1);
    drawCorner(ctx, 0, 0, 1, time + 80);
    ctx.restore();
  }

  function drawCorner(c, ox, oy, scale, t) {
    const s = scale;
    const sw = Math.sin(t * 0.0007);
    const branches = [
      { pts: [[0,0],[80*s,30*s],[170*s,70*s],[270*s,85*s],[370*s,65*s]], w: 2.5, leaves: [1,2,3,4] },
      { pts: [[0,0],[40*s,80*s],[80*s,150*s],[100*s,230*s]], w: 1.8, leaves: [1,2,3] },
      { pts: [[80*s,30*s],[110*s,70*s],[130*s,120*s]], w: 1.2, leaves: [1,2] },
      { pts: [[170*s,70*s],[200*s,110*s],[210*s,160*s]], w: 1, leaves: [1,2] },
      { pts: [[270*s,85*s],[300*s,120*s],[310*s,165*s]], w: 0.8, leaves: [1] },
      { pts: [[40*s,80*s],[80*s,100*s],[130*s,95*s]], w: 0.8, leaves: [1,2] },
    ];

    branches.forEach((br, bi) => {
      if (br.pts.length < 2) return;
      c.save();
      const branchSway = sw * (3 + bi) * 0.5;
      c.translate(branchSway * 0.2, branchSway * 0.4);

      // Branch stroke
      c.beginPath();
      c.moveTo(br.pts[0][0], br.pts[0][1]);
      for (let i = 1; i < br.pts.length; i++) {
        const [px, py] = br.pts[i];
        const [ppx, ppy] = br.pts[i-1];
        c.quadraticCurveTo((ppx+px)/2, (ppy+py)/2, px, py);
      }
      const alpha = (0.45 + Math.sin(t * 0.001 + bi) * 0.05) * PERF;
      c.strokeStyle = `rgba(20,45,25,${alpha})`;
      c.lineWidth = br.w;
      c.lineCap = 'round';
      c.stroke();

      // Leaves
      br.leaves.forEach(li => {
        if (li >= br.pts.length) return;
        const [lx, ly] = br.pts[li];
        const leafSway = Math.sin(t * 0.001 + bi * 2 + li) * 0.4;

        // Left leaf
        c.save();
        c.translate(lx, ly);
        c.rotate(-0.6 + leafSway);
        const ls = (8 + bi * 2) * s;
        const la = (0.35 + Math.sin(bi + li) * 0.1) * PERF;
        c.globalAlpha = la;
        c.fillStyle = `hsl(${125+bi*8},55%,${30+li*5}%)`;
        c.beginPath();
        c.ellipse(0, -ls/2, ls*0.38, ls*0.65, 0, 0, Math.PI*2);
        c.fill();
        c.strokeStyle = `rgba(15,40,20,0.4)`;
        c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(0,0); c.lineTo(0,-ls); c.stroke();
        c.restore();

        // Right leaf
        c.save();
        c.translate(lx, ly);
        c.rotate(0.6 - leafSway);
        c.globalAlpha = la * 0.85;
        c.fillStyle = `hsl(${120+bi*6},50%,${28+li*4}%)`;
        c.beginPath();
        c.ellipse(0, -ls/2, ls*0.35, ls*0.6, 0, 0, Math.PI*2);
        c.fill();
        c.restore();
      });

      c.restore();
    });
  }

  /* ══════════════════════
     EDGE VINES
  ══════════════════════ */
  function drawEdgeVines() {
    if (isMobile) return;
    [0, W].forEach((ex, si) => {
      ctx.save();
      if (si === 1) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.strokeStyle = `rgba(35,75,40,${0.18 * PERF})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      let py = 0;
      ctx.moveTo(18, 0);
      for (let i = 0; i < 22; i++) {
        const x = 14 + Math.sin(time * 0.0007 + i * 0.9) * 18 + i * 1.5;
        const y = py + H / 22;
        ctx.quadraticCurveTo(x + Math.sin(i * 1.3) * 12, py + H / 44, x, y);
        py = y;
        if (i % 3 === 0 && PERF > 0.5) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.sin(time * 0.001 + i) * 0.5 + (i%2===0 ? 0.9 : -0.9));
          ctx.fillStyle = `rgba(72,163,108,${0.2 * PERF})`;
          ctx.beginPath();
          ctx.ellipse(7, 0, 9, 4.5, 0, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.stroke();
      ctx.restore();
    });
  }

  /* ══════════════════════
     FIREFLIES
  ══════════════════════ */
  class Firefly {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H * 0.4 + Math.random() * H * 0.6;
      this.vx = (Math.random()-0.5)*0.5; this.vy = (Math.random()-0.5)*0.4;
      this.life = 0; this.maxLife = 280 + Math.random()*350;
      this.size = Math.random()*2+0.8; this.hue = 120+Math.random()*45;
      this.phase = Math.random()*Math.PI*2;
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(time*0.008+this.phase)*0.4;
      this.y += this.vy + Math.cos(time*0.006+this.phase)*0.3;
      if (this.life > this.maxLife || this.x<-20 || this.x>W+20) this.reset();
    }
    draw() {
      const fade = Math.sin(this.life/this.maxLife*Math.PI);
      const pulse = 0.5+0.5*Math.sin(time*0.06+this.phase);
      const a = fade*pulse*0.65*PERF;
      if (a < 0.01) return;
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*9);
      g.addColorStop(0, `hsla(${this.hue},85%,75%,${a})`);
      g.addColorStop(0.4, `hsla(${this.hue},70%,55%,${a*0.4})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*9,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = `hsla(${this.hue},95%,90%,${a})`;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*0.5,0,Math.PI*2); ctx.fill();
    }
  }

  /* ══════════════════════
     FALLING LEAVES
  ══════════════════════ */
  class FallingLeaf {
    constructor(init) {
      this.x = Math.random()*W; this.y = init ? Math.random()*H : -20;
      this.vx = (Math.random()-0.5)*1.4; this.vy = Math.random()*0.6+0.2;
      this.rot = Math.random()*Math.PI*2; this.rotSpeed = (Math.random()-0.5)*0.04;
      this.size = Math.random()*9+4; this.alpha = (Math.random()*0.18+0.04)*PERF;
      this.wobble = Math.random()*Math.PI*2; this.wobbleSpeed = Math.random()*0.025+0.008;
      this.hue = 115+Math.random()*45;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble)*0.5; this.y += this.vy;
      this.rot += this.rotSpeed;
      if (!isMobile) {
        const dx=this.x-cx, dy=this.y-cy, d=Math.sqrt(dx*dx+dy*dy);
        if (d<90) { this.vx+=dx/d*0.12; this.vy+=dy/d*0.08; }
      }
      this.vx *= 0.99; this.vy = Math.max(0.2, Math.min(1.4, this.vy*0.999));
      if (this.y>H+30) { this.x=Math.random()*W; this.y=-20; this.vx=(Math.random()-0.5)*1.4; this.vy=Math.random()*0.6+0.2; }
    }
    draw() {
      ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(${this.hue},45%,40%)`;
      ctx.beginPath(); ctx.ellipse(0,0,this.size,this.size*0.45,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = `hsl(${this.hue},30%,28%)`; ctx.lineWidth=0.5;
      ctx.beginPath(); ctx.moveTo(-this.size,0); ctx.lineTo(this.size,0); ctx.stroke();
      ctx.restore();
    }
  }

  /* ══════════════════════
     CURSOR TRAIL
  ══════════════════════ */
  class Trail {
    constructor(x,y) {
      this.x=x+(Math.random()-0.5)*6; this.y=y+(Math.random()-0.5)*6;
      this.vx=(Math.random()-0.5)*0.7; this.vy=-Math.random()*1-0.3;
      this.life=1; this.decay=Math.random()*0.045+0.025;
      this.size=Math.random()*2+0.5; this.hue=125+Math.random()*20;
    }
    update() { this.life-=this.decay; this.x+=this.vx; this.y+=this.vy; this.vy+=0.015; }
    draw() {
      if (this.life<=0) return;
      ctx.globalAlpha=this.life*0.12;
      ctx.fillStyle=`hsl(${this.hue},60%,58%)`;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2); ctx.fill();
    }
  }

  /* ══════════════════════
     INIT
  ══════════════════════ */
  const fireflies = Array.from({length:Math.floor(18*PERF)},()=>new Firefly());
  const leaves = Array.from({length:Math.floor(10*PERF)},()=>new FallingLeaf(true));
  const trail = [];
  let ltx=-200, lty=-200;

  /* ══════════════════════
     MAIN LOOP
  ══════════════════════ */
  function animate() {
    requestAnimationFrame(animate);
    time++;
    drawBg();
    ctx.clearRect(0,0,W,H);
    drawCornerBranches();
    drawEdgeVines();
    ctx.save(); fireflies.forEach(f=>{f.update();f.draw();}); ctx.restore();
    ctx.save(); leaves.forEach(l=>{l.update();l.draw();}); ctx.restore();
    if (!isMobile) {
      const dx=cx-ltx, dy=cy-lty;
      if (Math.sqrt(dx*dx+dy*dy)>10 && time%2===0) { trail.push(new Trail(cx,cy)); ltx=cx; lty=cy; }
      ctx.save();
      for (let i=trail.length-1;i>=0;i--) { trail[i].update(); trail[i].draw(); if(trail[i].life<=0) trail.splice(i,1); }
      if (trail.length>20) trail.splice(0,trail.length-20);
      ctx.restore();
      if (cx>0) {
        const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,100);
        cg.addColorStop(0,'rgba(116,198,157,0.02)'); cg.addColorStop(1,'transparent');
        ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,100,0,Math.PI*2); ctx.fill();
      }
    }
    ctx.globalAlpha=1;
  }

  animate();

  /* ══════════════════════
     SVG BRANCH SWAY
  ══════════════════════ */
  const svgBranches = document.querySelectorAll('.branch');
  function swaySVG() {
    svgBranches.forEach((b,i) => {
      const s = Math.sin(Date.now()*0.0007+i*1.5)*4;
      const off = scrollY*0.12;
      const flip = b.classList.contains('branch-tr') ? ' scaleX(-1)' : '';
      b.style.transform = `translateY(${off+s}px)${flip}`;
    });
    requestAnimationFrame(swaySVG);
  }
  swaySVG();

  /* ══════════════════════
     HERO GLOW BREATH
  ══════════════════════ */
  const em = document.querySelector('.hero-title em');
  if (em) {
    let gv=0,gd=1;
    setInterval(()=>{
      gv+=gd*0.012; if(gv>=1)gd=-1; if(gv<=0)gd=1;
      const i=0.22+gv*0.3;
      em.style.textShadow=`0 0 ${22+gv*22}px rgba(82,183,136,${i}),0 0 ${44+gv*28}px rgba(82,183,136,${i*0.35})`;
    },50);
  }

  /* ══════════════════════
     CARD HOVER DEPTH
  ══════════════════════ */
  document.querySelectorAll('.feat-card,.step-card,.price-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      el.style.transition='box-shadow 0.4s,transform 0.4s,border-color 0.4s';
      el.style.boxShadow='0 0 35px rgba(82,183,136,0.1),0 20px 50px rgba(5,13,7,0.5)';
    });
    el.addEventListener('mouseleave',()=>{ el.style.boxShadow=''; });
  });

  // Inject vines after DOM ready

  console.log('🌿 Linkora Forest v4');
})();
