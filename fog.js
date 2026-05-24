/**
 * Linkora Forest — WebGL Fog Shader
 * Volumetric forest atmosphere via Raymarching
 */
(function() {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'webgl-fog';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;width:100%;height:100%;opacity:0.85;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.warn('WebGL not supported, skipping fog shader');
    canvas.remove();
    return;
  }

  let W, H, mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }, scrollY = 0, startTime = Date.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    document.addEventListener('mousemove', e => {
      mouse.tx = e.clientX / W;
      mouse.ty = 1.0 - e.clientY / H;
    });
  }
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── VERTEX SHADER ── */
  const vsSource = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  /* ── FRAGMENT SHADER — Forest Fog ── */
  const fsSource = `
    precision highp float;
    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_scroll;

    // Hash function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Smooth noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
        u.y
      );
    }

    // Fractal noise (fog density)
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 aspect = vec2(u_res.x / u_res.y, 1.0);

      // Slow drift
      float t = u_time * 0.04;
      float scroll = u_scroll * 0.0003;

      // Mouse influence (very subtle)
      vec2 mouseInfluence = (u_mouse - 0.5) * 0.08;

      // Layer 1: Deep background fog
      vec2 p1 = uv * aspect * 1.8 + vec2(t * 0.3, -t * 0.15 + scroll) + mouseInfluence * 0.3;
      float fog1 = fbm(p1);

      // Layer 2: Mid fog
      vec2 p2 = uv * aspect * 2.4 + vec2(-t * 0.2, t * 0.1 + scroll * 1.2) + mouseInfluence * 0.5;
      float fog2 = fbm(p2 + fbm(p2) * 0.8);

      // Layer 3: Fine mist
      vec2 p3 = uv * aspect * 3.5 + vec2(t * 0.15, -t * 0.08 + scroll * 0.8);
      float fog3 = fbm(p3);

      // Combine layers
      float fogDensity = fog1 * 0.5 + fog2 * 0.35 + fog3 * 0.15;

      // Vertical gradient — more fog at bottom and top edges
      float vignette = 1.0 - smoothstep(0.0, 0.45, abs(uv.y - 0.5));
      float topFog = smoothstep(0.7, 1.0, uv.y) * 0.6;
      float bottomFog = smoothstep(0.0, 0.25, uv.y) * 0.8;
      fogDensity = fogDensity * (0.3 + vignette * 0.7) + topFog + bottomFog;

      // Center clearing (where content is)
      float centerClear = 1.0 - smoothstep(0.1, 0.55, length((uv - vec2(0.5, 0.5)) * vec2(0.8, 1.2)));
      fogDensity *= (0.4 + centerClear * 0.6);

      // Color: deep forest greens
      vec3 fogColorDeep  = vec3(0.01, 0.05, 0.02);
      vec3 fogColorMid   = vec3(0.02, 0.09, 0.04);
      vec3 fogColorLight = vec3(0.05, 0.16, 0.07);

      vec3 fogColor = mix(fogColorDeep, fogColorMid, fog1);
      fogColor = mix(fogColor, fogColorLight, fog2 * 0.4);

      // Subtle bioluminescent tint in fog peaks
      float biolum = smoothstep(0.65, 0.85, fogDensity);
      fogColor += vec3(0.02, 0.12, 0.06) * biolum;

      // Final alpha
      float alpha = clamp(fogDensity * 0.55, 0.0, 0.42);

      gl_FragColor = vec4(fogColor, alpha);
    }
  `;

  /* ── COMPILE SHADERS ── */
  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) { canvas.remove(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(prog));
    canvas.remove(); return;
  }

  /* ── BUFFER ── */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uTime  = gl.getUniformLocation(prog, 'u_time');
  const uScroll= gl.getUniformLocation(prog, 'u_scroll');

  /* ── RENDER LOOP ── */
  function render() {
    requestAnimationFrame(render);

    // Smooth mouse
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    const t = (Date.now() - startTime) * 0.001;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uScroll, scrollY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  render();

  console.log('🌫️ Linkora WebGL fog loaded');
})();
