/**
 * Linkora Forest — Volumetric God Rays + Fog
 * The Last of Us style atmospheric depth
 */
(function() {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  const canvas = document.createElement('canvas');
  canvas.id = 'webgl-godrays';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;width:100%;height:100%;mix-blend-mode:screen;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.remove(); return; }

  let W, H, scrollY = 0, startTime = Date.now();
  let mx = 0.5, my = 0.8, tmx = 0.5, tmy = 0.8;

  function resize() {
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  if (!isMobile) {
    document.addEventListener('mousemove', e => {
      tmx = e.clientX / W;
      tmy = 1.0 - e.clientY / H;
    });
  }
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  const vsSource = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const fsSource = `
    precision mediump float;
    uniform vec2  u_res;
    uniform vec2  u_mouse;
    uniform float u_time;
    uniform float u_scroll;

    float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

    float noise(vec2 p) {
      vec2 i=floor(p), f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }

    float fbm(vec2 p) {
      float v=0.0,a=0.5;
      for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
      return v;
    }

    /* ── GOD RAYS ── */
    float godRay(vec2 uv, vec2 source, float angle, float width, float t) {
      vec2 dir = uv - source;
      float dist = length(dir);
      float rayAngle = atan(dir.y, dir.x);
      float angleDiff = mod(abs(rayAngle - angle) + 3.14159, 6.28318) - 3.14159;
      float ray = smoothstep(width, 0.0, abs(angleDiff));
      // Flicker
      float flicker = 0.85 + 0.15 * sin(t * 1.3 + angle * 7.0);
      // Fade with distance
      float fade = 1.0 - smoothstep(0.0, 1.8, dist);
      return ray * fade * flicker;
    }

    /* ── VOLUMETRIC SCATTER ── */
    float volumetricScatter(vec2 uv, vec2 lightPos, float t) {
      float scatter = 0.0;
      vec2 dir = uv - lightPos;
      float steps = 12.0;
      for(float i=0.0; i<12.0; i++) {
        float s = i / steps;
        vec2 samplePos = lightPos + dir * s;
        float density = fbm(samplePos * 2.5 + t * 0.03);
        scatter += density * (1.0 - s) * (1.0/steps);
      }
      return scatter;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float t = u_time;
      float scroll = u_scroll * 0.0004;

      // Aspect correct
      vec2 uvA = vec2(uv.x * u_res.x/u_res.y, uv.y);

      // Light source — slightly above, follows mouse subtly
      vec2 lightPos = vec2(0.3 + u_mouse.x * 0.4, 1.3 + u_mouse.y * 0.15);
      vec2 lightPosA = vec2(lightPos.x * u_res.x/u_res.y, lightPos.y);

      /* ── GOD RAYS ── */
      vec3 rayColor = vec3(0.0);
      float totalRay = 0.0;

      // Multiple rays from light source
      float rayAngles[5];
      rayAngles[0] = -1.4;
      rayAngles[1] = -1.2;
      rayAngles[2] = -1.55;
      rayAngles[3] = -1.0;
      rayAngles[4] = -1.7;

      float rayWidths[5];
      rayWidths[0] = 0.04;
      rayWidths[1] = 0.025;
      rayWidths[2] = 0.035;
      rayWidths[3] = 0.02;
      rayWidths[4] = 0.015;

      for(int i=0; i<5; i++) {
        float angle = rayAngles[i] + sin(t*0.2+float(i))*0.03;
        float w = rayWidths[i] * (0.9 + sin(t*0.5+float(i)*1.3)*0.1);
        float ray = godRay(uvA, lightPosA, angle, w, t);
        totalRay += ray * (i==0 ? 1.0 : i==1 ? 0.8 : i==2 ? 0.7 : 0.5);
      }

      // Ray color — warm greenish light through canopy
      vec3 warmRay = mix(
        vec3(0.08, 0.22, 0.08),   // deep green
        vec3(0.15, 0.38, 0.12),   // bright canopy green
        totalRay
      );
      rayColor = warmRay * totalRay * 0.7;

      /* ── VOLUMETRIC FOG LAYERS ── */
      // Layer 1: Ground mist (bottom 40%)
      float groundFog = 0.0;
      if(uv.y < 0.45) {
        vec2 fogUV = vec2(uv.x + t*0.012, uv.y + scroll);
        float fog1 = fbm(fogUV * vec2(2.5, 4.0));
        float fog2 = fbm(fogUV * vec2(4.0, 3.0) + 1.7);
        groundFog = mix(fog1, fog2, 0.4);
        groundFog *= smoothstep(0.45, 0.0, uv.y) * 1.4;
        groundFog = clamp(groundFog, 0.0, 1.0);
      }

      // Layer 2: Mid-air wisps
      vec2 wispUV = vec2(uv.x + t*0.007, uv.y*1.5 + scroll*0.5);
      float wisp = fbm(wispUV * 3.0) * fbm(wispUV * 1.5 + 2.3);
      float wispMask = smoothstep(0.7, 0.3, uv.y) * smoothstep(0.0, 0.2, uv.y);
      wisp *= wispMask * 0.6;

      // Layer 3: Top canopy haze
      float topHaze = 0.0;
      if(uv.y > 0.6) {
        vec2 hazeUV = vec2(uv.x - t*0.008, uv.y + scroll*0.3);
        topHaze = fbm(hazeUV * 2.0) * smoothstep(0.6, 1.0, uv.y) * 0.5;
      }

      /* ── VOLUMETRIC SCATTER ALONG RAYS ── */
      float scatter = 0.0;
      if(totalRay > 0.01) {
        scatter = volumetricScatter(uvA, lightPosA, t) * totalRay * 0.4;
      }

      /* ── COMBINE ── */
      // Fog colors
      vec3 groundFogColor = mix(
        vec3(0.01, 0.04, 0.015),
        vec3(0.04, 0.14, 0.05),
        groundFog
      );
      vec3 wispColor = vec3(0.03, 0.10, 0.04);
      vec3 hazeColor = vec3(0.02, 0.07, 0.025);
      vec3 scatterColor = vec3(0.08, 0.28, 0.10);

      vec3 col = groundFogColor * groundFog * 1.2
               + wispColor * wisp
               + hazeColor * topHaze
               + rayColor
               + scatterColor * scatter;

      /* ── ALPHA ── */
      float alpha = groundFog * 0.65
                  + wisp * 0.35
                  + topHaze * 0.3
                  + totalRay * 0.45
                  + scatter * 0.3;

      alpha = clamp(alpha, 0.0, 0.72);

      // Reduce alpha in center so content stays readable
      float centerMask = 1.0 - smoothstep(0.1, 0.5, length((uv - vec2(0.5,0.5)) * vec2(0.6, 1.0)));
      alpha *= (0.35 + centerMask * 0.65);

      gl_FragColor = vec4(col, alpha);
    }
  `;

  function makeShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = makeShader(gl.VERTEX_SHADER, vsSource);
  const fs = makeShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) { canvas.remove(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes    = gl.getUniformLocation(prog, 'u_res');
  const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
  const uTime   = gl.getUniformLocation(prog, 'u_time');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function render() {
    requestAnimationFrame(render);
    mx += (tmx - mx) * 0.03;
    my += (tmy - my) * 0.03;

    const t = (Date.now() - startTime) * 0.001;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uScroll, scrollY);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  render();
  console.log('🌫️ Linkora God Rays loaded');
})();
