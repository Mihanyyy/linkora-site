/**
 * Linkora Forest — WebGL 3D Trees + Moss Surface
 * Procedural trees growing from bottom + living moss background
 */
(function() {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  const canvas = document.createElement('canvas');
  canvas.id = 'webgl-forest';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;width:100%;height:100%;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.remove(); return; }

  let W, H, scrollY = 0, startTime = Date.now();
  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
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

  /* ── VERTEX SHADER ── */
  const vsSource = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  /* ── FRAGMENT SHADER ── */
  const fsSource = `
    precision highp float;
    uniform vec2  u_res;
    uniform vec2  u_mouse;
    uniform float u_time;
    uniform float u_scroll;

    #define PI 3.14159265

    /* ── MATH UTILS ── */
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float hash1(float n) { return fract(sin(n) * 43758.5453); }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }

    float fbm(vec2 p) {
      float v=0.0, a=0.5;
      for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
      return v;
    }

    /* ── SDF UTILS ── */
    float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
      vec3 pa=p-a, ba=b-a;
      float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
      return length(pa-ba*h)-r;
    }

    mat2 rot2(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

    /* ── FRACTAL TREE SDF ── */
    float treeSDF(vec3 p, float seed, float t) {
      float d = 1e9;
      float wind = sin(t*0.6+seed)*0.04 + sin(t*1.1+seed*2.0)*0.02;

      // Trunk
      vec3 tp = p;
      d = min(d, sdCapsule(tp, vec3(0,-1.0,0), vec3(wind*0.3,0.4,0), 0.06));

      // Branch level 1
      for(int i=0;i<3;i++){
        float fi = float(i);
        float ang = fi * PI*2.0/3.0 + seed;
        vec3 bStart = vec3(sin(ang)*0.05, 0.2+fi*0.08, cos(ang)*0.05);
        float bWind = sin(t*0.8+seed+fi)*0.06;
        vec3 bEnd = bStart + vec3(sin(ang+bWind)*0.35, 0.3, cos(ang+bWind)*0.35);
        d = min(d, sdCapsule(p, bStart, bEnd, 0.025));

        // Branch level 2
        for(int j=0;j<2;j++){
          float fj=float(j);
          float ang2=ang+fj*PI*0.6-PI*0.3;
          float bWind2=sin(t*1.2+seed+fi+fj)*0.08;
          vec3 b2End = bEnd + vec3(sin(ang2+bWind2)*0.2, 0.18, cos(ang2+bWind2)*0.2);
          d = min(d, sdCapsule(p, bEnd, b2End, 0.012));

          // Tips — bioluminescent
          for(int k=0;k<2;k++){
            float fk=float(k);
            float ang3=ang2+fk*PI*0.5-PI*0.25;
            float bWind3=sin(t*1.8+seed+fi+fj+fk)*0.1;
            vec3 b3End=b2End+vec3(sin(ang3+bWind3)*0.1,0.1,cos(ang3+bWind3)*0.1);
            d=min(d,sdCapsule(p,b2End,b3End,0.006));
          }
        }
      }
      return d;
    }

    /* ── MOSS SURFACE SDF ── */
    float mossSurface(vec3 p, float t) {
      float base = p.y + 0.85; // ground plane
      // Organic bumps
      float bumps = fbm(p.xz*3.0 + t*0.05) * 0.12;
      bumps += noise(p.xz*7.0 + t*0.08) * 0.04;
      // Roots protruding
      float rootA = sdCapsule(p, vec3(-0.3,-0.9,0.1), vec3(0.2,-0.7,0.3), 0.04);
      float rootB = sdCapsule(p, vec3(0.4,-0.9,-0.1), vec3(-0.1,-0.75,-0.4), 0.035);
      float roots = min(rootA, rootB);
      return min(base - bumps, roots);
    }

    /* ── SCENE SDF ── */
    vec2 sceneSDF(vec3 p, float t, float scroll) {
      // Multiple trees at different positions
      float d = 1e9;
      float mat = 0.0;

      // Moss ground
      float mossD = mossSurface(p, t);
      if(mossD < d){ d = mossD; mat = 2.0; }

      // Tree 1 — left
      vec3 p1 = p - vec3(-0.8, -0.85 + scroll*0.0003, 0.3);
      float t1 = treeSDF(p1, 0.0, t);
      if(t1 < d){ d=t1; mat=1.0; }

      // Tree 2 — right
      vec3 p2 = p - vec3(0.9, -0.85 + scroll*0.0003, 0.5);
      float t2 = treeSDF(p2, 2.1, t);
      if(t2 < d){ d=t2; mat=1.0; }

      // Tree 3 — center-back (smaller, further)
      vec3 p3 = p - vec3(0.05, -1.1 + scroll*0.0002, 1.2);
      p3 *= vec3(1.3, 1.3, 1.3);
      float t3 = treeSDF(p3, 4.3, t) / 1.3;
      if(t3 < d){ d=t3; mat=1.5; }

      return vec2(d, mat);
    }

    /* ── NORMAL ESTIMATION ── */
    vec3 getNormal(vec3 p, float t, float scroll) {
      float e = 0.002;
      return normalize(vec3(
        sceneSDF(p+vec3(e,0,0),t,scroll).x - sceneSDF(p-vec3(e,0,0),t,scroll).x,
        sceneSDF(p+vec3(0,e,0),t,scroll).x - sceneSDF(p-vec3(0,e,0),t,scroll).x,
        sceneSDF(p+vec3(0,0,e),t,scroll).x - sceneSDF(p-vec3(0,0,e),t,scroll).x
      ));
    }

    /* ── MAIN ── */
    void main() {
      vec2 uv = (gl_FragCoord.xy - u_res*0.5) / u_res.y;
      float t = u_time;
      float scroll = u_scroll;

      // Camera — slightly above ground, looking at scene
      vec3 ro = vec3(u_mouse.x*0.15, 0.2 + u_mouse.y*0.1, 2.2);
      vec3 target = vec3(0.0, -0.2, 0.0);
      vec3 fwd = normalize(target - ro);
      vec3 right = normalize(cross(vec3(0,1,0), fwd));
      vec3 up = cross(fwd, right);
      vec3 rd = normalize(fwd + uv.x*right + uv.y*up);

      // Raymarching
      float dO = 0.0;
      float matID = 0.0;
      bool hit = false;

      for(int i=0; i<80; i++) {
        vec3 p = ro + rd*dO;
        vec2 res = sceneSDF(p, t, scroll);
        if(res.x < 0.001){ hit=true; matID=res.y; break; }
        dO += res.x * 0.8;
        if(dO > 6.0) break;
      }

      vec3 col = vec3(0.0);

      if(hit) {
        vec3 p = ro + rd*dO;
        vec3 n = getNormal(p, t, scroll);

        // Light from top-front (god ray direction)
        vec3 light = normalize(vec3(0.3, 1.0, 0.5));
        float diff = max(dot(n, light), 0.0);
        float ao = 1.0 - dO * 0.08;

        if(matID < 1.3) {
          // Tree bark — dark with biolum tips
          vec3 barkColor = vec3(0.04, 0.12, 0.06);
          float tipGlow = smoothstep(0.4, 1.0, p.y + 0.5);
          vec3 tipColor = vec3(0.1, 0.9, 0.4) * tipGlow * 1.5;
          col = (barkColor * (diff*0.7+0.3) + tipColor) * ao;
          // Edge bioluminescent glow
          float edge = 1.0 - max(dot(n, -rd), 0.0);
          col += vec3(0.05, 0.4, 0.15) * pow(edge, 3.0) * 0.6;
        } else if(matID < 1.8) {
          // Far tree — dimmer
          vec3 barkColor = vec3(0.02, 0.08, 0.04);
          float tipGlow = smoothstep(0.3, 0.9, p.y + 0.8);
          col = (barkColor * (diff*0.5+0.2) + vec3(0.05, 0.5, 0.2)*tipGlow) * ao * 0.6;
        } else {
          // Moss surface
          float mossNoise = fbm(p.xz*4.0 + t*0.03);
          vec3 mossColor = mix(vec3(0.02, 0.08, 0.03), vec3(0.04, 0.16, 0.06), mossNoise);
          float wetness = noise(p.xz*6.0) * 0.3;
          float biolumMoss = noise(p.xz*8.0 + t*0.1) * 0.15;
          mossColor += vec3(0.02, 0.12, 0.05) * biolumMoss;
          col = mossColor * (diff*0.6 + 0.4) * ao;
          // Wet sheen
          float spec = pow(max(dot(reflect(-light,n), -rd), 0.0), 12.0) * wetness;
          col += vec3(0.05, 0.2, 0.08) * spec;
        }

        // Fog
        float fog = 1.0 - exp(-dO * 0.25);
        vec3 fogColor = vec3(0.01, 0.04, 0.02);
        col = mix(col, fogColor, fog);
      }

      // Background: deep forest atmosphere
      if(!hit) {
        float bgFbm = fbm(uv*2.0 + t*0.02);
        col = vec3(0.007, 0.025, 0.012) * (0.5 + bgFbm*0.5);
        // God ray hints
        float rays = max(0.0, sin(uv.x*8.0 + t*0.1)) * 0.01;
        col += vec3(0.02, 0.08, 0.03) * rays;
      }

      // Vignette
      float vig = 1.0 - smoothstep(0.4, 1.2, length(uv*vec2(0.8,1.0)));
      col *= vig * 0.85;

      // Bioluminescent bloom
      float bloom = smoothstep(0.05, 0.15, col.g - col.r*2.0);
      col += vec3(0.01, 0.06, 0.02) * bloom;

      // Final alpha — only show near bottom and sides
      float showArea = smoothstep(0.55, 0.25, uv.y + 0.3);
      showArea += smoothstep(0.3, 0.6, abs(uv.x) - 0.2) * 0.5;
      showArea = clamp(showArea, 0.0, 0.9);

      float alpha = hit ? showArea * 0.88 : showArea * 0.3;

      gl_FragColor = vec4(col, alpha);
    }
  `;

  /* ── COMPILE ── */
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
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
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

    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;

    const t = (Date.now() - startTime) * 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mx*2.0-1.0, my*2.0-1.0);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uScroll, scrollY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  render();
  console.log('🌲 Linkora WebGL Trees + Moss loaded');
})();
