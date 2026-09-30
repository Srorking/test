// 3D background scene for the farewell page.
// Built with: npm run build  ->  js/scene.js (IIFE exposing window.FarewellScene)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color, ColorManagement,
  LinearSRGBColorSpace, IcosahedronGeometry, ShaderMaterial, Mesh, EdgesGeometry,
  LineSegments, LineBasicMaterial, TorusGeometry, SphereGeometry, MeshBasicMaterial,
  BufferGeometry, Float32BufferAttribute, Points, AdditiveBlending, CanvasTexture,
  Sprite, SpriteMaterial, RingGeometry, Vector3,
} from 'three';

// We author colours as plain sRGB numbers inside custom shaders, so skip the
// linear-workflow conversion. What you write in the palette is what you see.
ColorManagement.enabled = false;

// One keyframe per page section (data-scene="..."). x is mirrored in RTL.
// p: blob position, s: scale, c: [base, base2, rim] colours, vis: opacity factor.
const STATES = {
  hero:    { p: [2.4, 0.05, 0.0],  s: 1.05, c: ['#34d399', '#22d3ee', '#fbbf24'], vis: 1 },
  journey: { p: [3.1, 0.0, -1.2],  s: 0.95, c: ['#22d3ee', '#6366f1', '#34d399'], vis: 1 },
  thanks:  { p: [0.0, -0.8, -3.8], s: 1.4,  c: ['#a78bfa', '#ec4899', '#fbbf24'], vis: 0.65 },
  wall:    { p: [0.0, 0.1, -6.2],  s: 1.05, c: ['#22d3ee', '#a78bfa', '#f0abfc'], vis: 0.5 },
  ai:      { p: [0.0, 0.0, -8.5],  s: 1.3,  c: ['#00ffa3', '#0ea5e9', '#a3e635'], vis: 0.3 },
  message: { p: [-3.1, 0.0, -1.2], s: 0.95, c: ['#f472b6', '#8b5cf6', '#fbbf24'], vis: 1 },
  finale:  { p: [0.0, 0.4, -4.2],  s: 1.3,  c: ['#fbbf24', '#34d399', '#22d3ee'], vis: 0.6 },
};

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const BLOB_VERT = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uAmp;
uniform float uPulse;
varying vec3 vN;
varying vec3 vV;
varying float vD;

float disp(vec3 d){
  return (snoise(d*1.25+vec3(0.0,uTime*0.24,uTime*0.13))*0.24
        + snoise(d*2.9-vec3(uTime*0.3,0.0,0.0))*0.07)*uAmp;
}
void main(){
  float R=length(position);
  vec3 d=normalize(position);
  float dd=disp(d);
  vec3 p0=d*(R+dd);

  // Re-derive the normal from two displaced neighbours so lighting follows the wobble.
  vec3 up=abs(d.y)>0.99?vec3(1.0,0.0,0.0):vec3(0.0,1.0,0.0);
  vec3 tA=normalize(cross(d,up));
  vec3 tB=normalize(cross(d,tA));
  float e=0.02;
  vec3 dA=normalize(d+tA*e);
  vec3 dB=normalize(d+tB*e);
  vec3 p1=dA*(R+disp(dA));
  vec3 p2=dB*(R+disp(dB));
  vec3 n=normalize(cross(p1-p0,p2-p0));
  if(dot(n,d)<0.0)n=-n;

  vec4 mv=modelViewMatrix*vec4(p0*(1.0+uPulse*0.05),1.0);
  vN=normalize(normalMatrix*n);
  vV=-mv.xyz;
  vD=dd;
  gl_Position=projectionMatrix*mv;
}`;

const BLOB_FRAG = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uTime;
uniform float uAlpha;
varying vec3 vN;
varying vec3 vV;
varying float vD;
void main(){
  vec3 N=normalize(vN);
  vec3 V=normalize(vV);
  float ndv=clamp(dot(N,V),0.0,1.0);
  float fres=pow(1.0-ndv,2.2);

  vec3 base=mix(uA,uB,smoothstep(-0.28,0.3,vD));
  vec3 L=normalize(vec3(-0.5,0.8,0.9));
  float diff=max(dot(N,L),0.0);
  vec3 H=normalize(L+V);
  float spec=pow(max(dot(N,H),0.0),56.0);

  vec3 irid=0.5+0.5*cos(6.28318*(vec3(0.0,0.33,0.67)+fres*1.1+vD*1.6+uTime*0.04));
  vec3 col=base*(0.22+0.9*diff);
  col=mix(col,irid,fres*0.5);
  col+=uC*fres*0.95+vec3(spec)*0.85;
  gl_FragColor=vec4(col,uAlpha);
}`;

const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
attribute float aPhase;
uniform float uTime;
uniform float uPx;
varying vec3 vCol;
varying float vA;
void main(){
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=min(aSize*uPx*(30.0/-mv.z),48.0*uPx);
  float tw=0.65+0.35*sin(uTime*1.4+aPhase);
  vA=tw*(aSize>3.0?0.22:1.0);
  vCol=aColor;
}`;

const STAR_FRAG = /* glsl */ `
varying vec3 vCol;
varying float vA;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=smoothstep(0.5,0.0,d);
  gl_FragColor=vec4(vCol,a*a*vA);
}`;

const RINGS = [
  { r: 2.25, tilt: [1.15, 0.2, 0.0],  speed: 0.2,   n: 9,  tube: 0.005 },
  { r: 2.85, tilt: [0.55, 0.0, 0.7],  speed: -0.13, n: 12, tube: 0.005 },
  { r: 3.5,  tilt: [1.45, 0.3, -0.4], speed: 0.085, n: 14, tube: 0.004 },
];

let renderer, scene, camera, world, blobGroup, blob, blobMat, wire, wireMat, halo, haloMat;
let stars, starMat, shock, shockMat;
const rings = [];
const pointer = { x: 0, y: 0, kick: 0 };
const cur = { pos: new Vector3(2.4, 0, 0), scale: 1, a: new Color(), b: new Color(), c: new Color(), vis: 1 };
const tgt = { pos: new Vector3(), scale: 1, a: new Color(), b: new Color(), c: new Color(), vis: 1 };
let stateName = 'hero';
let mirror = 1;
let narrow = false;
let vw = 0, vh = 0, dprCap = null;
let t = 0, lastNow = 0, lastSy = 0, energy = 0, pulseV = 0, timeScale = 1, reduced = false;
let raf = 0, frames = 0, fpsAcc = 0, fpsDone = false;

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,0.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

function makeStars(count) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const palette = ['#ffffff', '#a5f3fc', '#fde68a', '#a7f3d0'].map((h) => new Color(h));
  for (let i = 0; i < count; i++) {
    const r = 14 + Math.random() * 46;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
    const c = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    size[i] = Math.random() < 0.06 ? 5 + Math.random() * 7 : 0.8 + Math.random() * 1.8;
    phase[i] = Math.random() * 6.283;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new Float32BufferAttribute(col, 3));
  geo.setAttribute('aSize', new Float32BufferAttribute(size, 1));
  geo.setAttribute('aPhase', new Float32BufferAttribute(phase, 1));
  starMat = new ShaderMaterial({
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  return new Points(geo, starMat);
}

function retarget() {
  const s = STATES[stateName] || STATES.hero;
  tgt.pos.set(s.p[0] * mirror, s.p[1], s.p[2]);
  tgt.scale = s.s;
  tgt.vis = s.vis;
  if (narrow) {
    // Phones: park the blob above the title in the hero, dim it behind text elsewhere.
    const hero = stateName === 'hero';
    tgt.pos.x *= 0.12;
    tgt.pos.y += hero ? 1.45 : 0;
    tgt.pos.z -= hero ? 0.5 : 1.5;
    tgt.scale *= hero ? 0.72 : 0.9;
    tgt.vis = hero ? 1 : Math.min(tgt.vis, 0.4);
  }
  tgt.a.set(s.c[0]); tgt.b.set(s.c[1]); tgt.c.set(s.c[2]);
}

function resize(force) {
  const w = window.innerWidth, h = window.innerHeight;
  // Mobile URL bars change innerHeight while scrolling; don't rebuild buffers for that.
  if (!force && w === vw && Math.abs(h - vh) < 150) return;
  vw = w; vh = h;
  narrow = w < 820;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap || (narrow ? 1.5 : 2)));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  starMat.uniforms.uPx.value = renderer.getPixelRatio();
  retarget();
}

function tick(now) {
  raf = requestAnimationFrame(tick);
  const dt = Math.min((now - lastNow) / 1000 || 0.016, 0.05);
  lastNow = now;
  t += dt * timeScale;
  frames++;

  // If the device struggles, quietly drop to 1x pixel ratio once.
  if (!fpsDone && frames > 30) {
    fpsAcc += dt;
    if (frames === 120) {
      fpsDone = true;
      if (fpsAcc / 90 > 1 / 26 && (dprCap || 2) > 1) { dprCap = 1; resize(true); }
    }
  }

  // "Energy" rises with scroll speed and pointer movement, then relaxes.
  const sy = window.scrollY;
  const sv = Math.abs(sy - lastSy) / Math.max(dt, 0.001);
  lastSy = sy;
  const eTarget = reduced ? 0 : Math.min(1, sv / 2200 + pointer.kick);
  pointer.kick *= Math.exp(-4 * dt);
  energy += (eTarget - energy) * (1 - Math.exp(-(eTarget > energy ? 10 : 2.2) * dt));

  const k = 1 - Math.exp(-2.4 * dt);
  cur.pos.lerp(tgt.pos, k);
  cur.scale += (tgt.scale - cur.scale) * k;
  cur.vis += (tgt.vis - cur.vis) * k;
  cur.a.lerp(tgt.a, k); cur.b.lerp(tgt.b, k); cur.c.lerp(tgt.c, k);

  pulseV = Math.max(0, pulseV - dt * 1.3);
  const kick = pulseV * pulseV;

  blobGroup.position.copy(cur.pos);
  blobGroup.scale.setScalar(cur.scale * (1 + kick * 0.06));
  blob.rotation.y = t * 0.12;
  blob.rotation.x = Math.sin(t * 0.1) * 0.2;
  wire.rotation.y = -t * 0.09;
  wire.rotation.x = t * 0.05;

  const u = blobMat.uniforms;
  u.uTime.value = t;
  u.uAmp.value = 0.85 + energy * 0.9 + kick * 0.5;
  u.uPulse.value = kick;
  u.uAlpha.value = Math.min(1, cur.vis);
  u.uA.value.copy(cur.a); u.uB.value.copy(cur.b); u.uC.value.copy(cur.c);

  haloMat.color.copy(cur.c);
  haloMat.opacity = (0.34 + energy * 0.16) * cur.vis;
  halo.scale.setScalar(6.4 + energy * 1.6);
  wireMat.color.copy(cur.c);
  wireMat.opacity = 0.22 * cur.vis;

  const palette = [cur.a, cur.b, cur.c];
  rings.forEach((ring, i) => {
    const col = palette[i % 3];
    ring.spinner.rotation.y += ring.speed * dt * timeScale * (1 + energy * 3);
    ring.line.material.color.copy(col);
    ring.line.material.opacity = 0.32 * cur.vis;
    ring.nodes.forEach((n, j) => {
      n.glow.material.color.copy(col);
      n.glow.material.opacity = 0.85 * cur.vis;
      n.glow.scale.setScalar(0.42 + 0.1 * Math.sin(t * 2 + j * 1.7 + i));
      n.core.material.opacity = cur.vis;
    });
  });

  if (pulseV > 0) {
    const e = 1 - pulseV;
    shock.visible = true;
    shock.scale.setScalar(1.4 + e * 7);
    shockMat.opacity = pulseV * 0.8 * cur.vis;
    shockMat.color.copy(cur.c);
  } else {
    shock.visible = false;
  }

  const rm = reduced ? 0 : 1;
  world.rotation.y += (pointer.x * 0.25 * rm - world.rotation.y) * k * 0.6;
  world.rotation.x += (pointer.y * 0.14 * rm - world.rotation.x) * k * 0.6;
  camera.position.z += ((8 - energy * 0.8) - camera.position.z) * k;

  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const sp = sy / max;
  stars.rotation.y = t * 0.012 + sp * 1.1;
  stars.rotation.x = sp * 0.35;
  starMat.uniforms.uTime.value = t;

  renderer.render(scene, camera);
}

export function init(canvas, opts = {}) {
  try {
    reduced = !!opts.reduced;
    timeScale = reduced ? 0.25 : 1;
    const mobile = window.matchMedia('(max-width: 820px)').matches;

    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    scene = new Scene();
    camera = new PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 8);
    world = new Group();
    scene.add(world);

    stars = makeStars(mobile ? 1400 : 2800);
    world.add(stars);

    blobGroup = new Group();
    world.add(blobGroup);

    blobMat = new ShaderMaterial({
      vertexShader: BLOB_VERT,
      fragmentShader: BLOB_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 }, uAmp: { value: 1 }, uPulse: { value: 0 }, uAlpha: { value: 1 },
        uA: { value: new Color() }, uB: { value: new Color() }, uC: { value: new Color() },
      },
    });
    blob = new Mesh(new IcosahedronGeometry(1.5, mobile ? 14 : 20), blobMat);
    blobGroup.add(blob);

    wireMat = new LineBasicMaterial({ transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false });
    wire = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(2.0, 2)), wireMat);
    blobGroup.add(wire);

    haloMat = new SpriteMaterial({ map: glowTexture(), transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.35 });
    halo = new Sprite(haloMat);
    halo.scale.setScalar(6.4);
    halo.position.z = -0.6;
    blobGroup.add(halo);

    // Orbiting rings of glowing nodes: the people around me.
    const nodeGeo = new SphereGeometry(0.05, 12, 12);
    const glowMap = haloMat.map;
    RINGS.forEach((def, ri) => {
      const tilt = new Group();
      tilt.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2]);
      const spinner = new Group();
      tilt.add(spinner);
      const line = new Mesh(
        new TorusGeometry(def.r, def.tube, 8, 220),
        new MeshBasicMaterial({ transparent: true, opacity: 0.32, blending: AdditiveBlending, depthWrite: false }),
      );
      line.rotation.x = Math.PI / 2;
      spinner.add(line);
      const nodes = [];
      for (let i = 0; i < def.n; i++) {
        const a = (i / def.n) * Math.PI * 2 + ri * 0.7;
        const g = new Group();
        g.position.set(Math.cos(a) * def.r, 0, Math.sin(a) * def.r);
        const core = new Mesh(nodeGeo, new MeshBasicMaterial({ color: 0xffffff, transparent: true }));
        core.scale.setScalar(0.5 + Math.random() * 0.7);
        const glow = new Sprite(new SpriteMaterial({ map: glowMap, transparent: true, blending: AdditiveBlending, depthWrite: false }));
        g.add(core, glow);
        spinner.add(g);
        nodes.push({ core, glow });
      }
      blobGroup.add(tilt);
      rings.push({ spinner, line, nodes, speed: def.speed });
    });

    shockMat = new MeshBasicMaterial({ transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: 2 });
    shock = new Mesh(new RingGeometry(0.97, 1, 96), shockMat);
    shock.visible = false;
    blobGroup.add(shock);

    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / (vw || 1) - 0.5) * 2;
      const ny = (e.clientY / (vh || 1) - 0.5) * 2;
      pointer.kick = Math.min(0.6, pointer.kick + Math.hypot(nx - pointer.x, ny - pointer.y) * 0.5);
      pointer.x = nx;
      pointer.y = ny;
    }, { passive: true });
    let rz = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(rz);
      rz = requestAnimationFrame(() => resize(false));
    });

    resize(true);
    cur.pos.copy(tgt.pos); cur.scale = tgt.scale; cur.vis = tgt.vis;
    cur.a.copy(tgt.a); cur.b.copy(tgt.b); cur.c.copy(tgt.c);
    lastSy = window.scrollY;
    raf = requestAnimationFrame(tick);
    return true;
  } catch (err) {
    console.warn('[farewell] WebGL scene disabled:', err);
    return false;
  }
}

export function setState(name) {
  if (!STATES[name] || name === stateName) return;
  stateName = name;
  retarget();
}

export function setMirror(rtl) {
  mirror = rtl ? -1 : 1;
  if (renderer) retarget();
}

export function pulse() {
  pulseV = 1;
}
