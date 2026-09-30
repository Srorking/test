/* Farewell site — behaviour: i18n, rendering, motion, 3D name sphere, neural canvas, confetti. */
(() => {
  'use strict';

  const C = window.FAREWELL;
  if (!C) return;

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const Scene = window.FarewellScene;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* ---------------------------------------------------------------- i18n */
  let lang = (() => {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
    const saved = store.get('farewell-lang');
    if (saved === 'ar' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  })();

  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const pick = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v.en) : v);
  const t = (path) => get(C.text[lang], path) ?? get(C.text.en, path) ?? '';
  const dateStr = () => {
    try {
      const loc = lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-GB';
      return new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(C.lastDay + 'T12:00:00'));
    } catch (e) { return C.lastDay; }
  };
  const fmt = (s) => String(s)
    .replace(/\{name\}/g, pick(C.name))
    .replace(/\{company\}/g, C.company)
    .replace(/\{date\}/g, dateStr());

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* Static, trusted SVG icon set (never built from config text). */
  const ICONS = {
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    spark: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
  };
  const icon = (name, size = 24) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ------------------------------------------------------------ renderers */
  function applyStatic() {
    doc.lang = lang;
    doc.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = fmt(lang === 'ar' ? 'شكراً لكم يا عائلة Prime Tech — {name}' : 'Thank you, {company} — {name}');
    $$('[data-t]').forEach((n) => { n.textContent = fmt(t(n.dataset.t)); });
    $('#heroEyebrow').textContent = fmt(t('hero.eyebrow'));
    $('#footerText').textContent = fmt(t('footer'));
  }

  function renderHeroTitle() {
    const h1 = $('#heroTitle');
    h1.setAttribute('aria-label', `${fmt(t('hero.title1'))} ${fmt(t('hero.title2'))}`);
    $$('[data-split]', h1).forEach((line) => {
      const text = fmt(t(line.dataset.split));
      line.textContent = '';
      line.setAttribute('aria-hidden', 'true');
      // Latin: animate letter by letter. Arabic: never split letters (it breaks joining).
      if (line.dataset.mode === 'chars' && lang !== 'ar') {
        let i = 0;
        text.split(' ').forEach((word, wi, all) => {
          const w = el('span', 'word');
          [...word].forEach((ch) => {
            const c = el('span', 'ch', ch);
            c.style.setProperty('--i', i++);
            w.appendChild(c);
          });
          line.appendChild(w);
          if (wi < all.length - 1) line.appendChild(document.createTextNode(' '));
        });
      } else {
        line.textContent = text;
      }
    });
  }

  function renderTimeline() {
    const ol = $('#timeline');
    ol.textContent = '';
    t('journey.items').forEach((it, i) => {
      const li = el('li', 'tl-item reveal');
      li.style.setProperty('--d', i % 2);
      const card = el('div', 'tl-card');
      card.append(el('span', 'tl-k', it.k), el('h3', null, it.t), el('p', null, it.d));
      li.append(el('span', 'tl-dot'), card);
      ol.appendChild(li);
    });
  }

  function makeCard(c, i, extraClass = '') {
    const wrap = el('div', 'card-wrap reveal');
    wrap.style.setProperty('--d', i);
    const card = el('article', `card tilt ${extraClass}`.trim());
    card.append(el('span', 'card-bg'), el('span', 'card-num', String(i + 1).padStart(2, '0')));
    const ic = el('span', 'card-icon');
    ic.innerHTML = icon(c.icon, 28);
    card.append(ic, el('h3', null, c.t), el('p', null, c.d));
    wrap.appendChild(card);
    return wrap;
  }

  function renderCards() {
    const host = $('#cards');
    host.textContent = '';
    t('thanks.cards').forEach((c, i) => host.appendChild(makeCard(c, i)));
  }

  function renderBand() {
    const track = $('#bandTrack');
    track.textContent = '';
    for (let copy = 0; copy < 2; copy++) {
      C.band.forEach((w) => track.appendChild(el('span', /[؀-ۿ]/.test(w) ? 'ar' : '', w)));
    }
  }

  function renderAI() {
    const host = $('#aiCards');
    host.textContent = '';
    t('ai.cards').forEach((c, i) => host.appendChild(makeCard(c, i)));
    const chips = $('#aiChips');
    chips.textContent = '';
    const members = (C.aiTeam || []).map(pick);
    $('#aiMembers').hidden = members.length === 0;
    members.forEach((m, i) => {
      const c = el('span', 'chip', m);
      c.style.setProperty('--i', i);
      chips.appendChild(c);
    });
  }

  function renderLetter() {
    const body = $('#letterBody');
    body.textContent = '';
    t('message.paras').forEach((p, i) => {
      const n = el('p', 'lp', fmt(p));
      n.style.setProperty('--i', i);
      body.appendChild(n);
    });
    const sign = el('p', 'sign grad', fmt(t('message.sign')));
    body.appendChild(sign);
  }

  function renderLinks() {
    const host = $('#links');
    host.textContent = '';
    const labels = t('finale.links');
    Object.entries(C.contacts || {}).forEach(([key, value]) => {
      if (!value) return;
      const href = key === 'email' && !/^mailto:/i.test(value) ? `mailto:${value}` : value;
      const a = el('a', 'link-btn');
      a.href = href;
      if (key !== 'email') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.innerHTML = icon(key, 20);
      a.append(el('span', null, labels[key] || key));
      host.appendChild(a);
    });
  }

  /* ----------------------------------------------------------- reveal IO */
  const revealIO = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' })
    : null;

  function observeReveals() {
    if (!revealIO) { doc.classList.add('no-io'); $$('.reveal').forEach((n) => n.classList.add('in')); return; }
    $$('.reveal:not(.in)').forEach((n) => revealIO.observe(n));
  }

  /* ------------------------------------------------- tilt / magnetic / spot */
  function bindPointerFx() {
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const card = e.target.closest && e.target.closest('.tilt');
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = parseFloat(card.dataset.tilt || '12');
        card.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-(py - 0.5) * max).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      }
      const mag = e.target.closest && e.target.closest('.magnetic');
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.setProperty('--tx', `${clamp((e.clientX - (r.left + r.width / 2)) * 0.22, -12, 12).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${clamp((e.clientY - (r.top + r.height / 2)) * 0.3, -10, 10).toFixed(1)}px`);
      }
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      const card = e.target.closest && e.target.closest('.tilt');
      if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
      const mag = e.target.closest && e.target.closest('.magnetic');
      if (mag && !mag.contains(e.relatedTarget)) { mag.style.setProperty('--tx', '0px'); mag.style.setProperty('--ty', '0px'); }
    });

    if (finePointer) {
      const spot = $('#spot');
      let sx = 0, sy = 0, queued = false;
      window.addEventListener('pointermove', (e) => {
        sx = e.clientX; sy = e.clientY;
        if (!queued) {
          queued = true;
          requestAnimationFrame(() => {
            spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
            spot.classList.add('on');
            queued = false;
          });
        }
      }, { passive: true });
    }
  }

  /* ------------------------------------------------------------ confetti */
  const confetti = (() => {
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    const colors = ['#fde68a', '#fbbf24', '#34d399', '#22d3ee', '#a78bfa', '#f472b6', '#ffffff'];
    let W = 0, H = 0, parts = [], raf = 0, last = 0;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    function burst(x, y, n = 150, spread = 1.15) {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * spread;
        const sp = 6 + Math.random() * 11;
        parts.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.28 + Math.random() * 0.1,
          w: 6 + Math.random() * 7, h: 4 + Math.random() * 6, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
          c: colors[i % colors.length], circle: Math.random() < 0.25, life: 0, max: 150 + Math.random() * 90,
        });
      }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    }

    function loop(now) {
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter((p) => p.life < p.max && p.y < H + 40);
      for (const p of parts) {
        p.life += dt;
        p.vx *= 0.992; p.vy = p.vy * 0.992 + p.g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p.max - p.life) / 40);
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.2, 0, 6.283); ctx.fill(); }
        else { ctx.scale(1, Math.abs(Math.cos(p.r * 1.3)) * 0.8 + 0.2); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(loop);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    }
    return { burst };
  })();

  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  function sendLove(from) {
    if (Scene) Scene.pulse();
    toast(fmt(t('finale.toast')));
    if (reduced) return;
    const r = from.getBoundingClientRect();
    confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 170);
    setTimeout(() => confetti.burst(window.innerWidth * 0.2, window.innerHeight * 0.95, 90, 0.7), 220);
    setTimeout(() => confetti.burst(window.innerWidth * 0.8, window.innerHeight * 0.95, 90, 0.7), 380);
  }

  /* --------------------------------------------------- 3D name sphere (DOM) */
  const sphere = (() => {
    const host = $('#sphere');
    let items = [], R = 220, rx = -0.25, ry = 0, vx = 0, vy = 0, dragging = false, lx = 0, ly = 0, raf = 0;
    const base = reduced ? 0.0008 : 0.0036;

    function build() {
      host.textContent = '';
      const names = (C.people || []).map(pick);
      const n = names.length;
      items = names.map((name, i) => {
        // Fibonacci sphere: evenly spread points on a globe.
        const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = Math.PI * (3 - Math.sqrt(5)) * i;
        const e = el('span', 'tag', name);
        e.setAttribute('role', 'listitem');
        host.appendChild(e);
        return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, e };
      });
      measure();
      draw();
    }

    function measure() {
      const b = host.getBoundingClientRect();
      R = Math.min(b.width, b.height) * (b.width < 520 ? 0.33 : 0.43);
    }

    function draw() {
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      for (const it of items) {
        const x1 = it.x * cy + it.z * sy;
        const z1 = -it.x * sy + it.z * cy;
        const y2 = it.y * cx - z1 * sx;
        const z2 = it.y * sx + z1 * cx;
        const d = (z2 + 1) / 2; // 0 = back, 1 = front
        it.e.style.transform = `translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.6 + d * 0.62).toFixed(3)})`;
        it.e.style.opacity = (0.2 + d * 0.8).toFixed(2);
        it.e.style.zIndex = String(Math.round(d * 100));
      }
    }

    function frame() {
      if (!dragging) {
        vy += (base - vy) * 0.04; // ease back to slow auto-rotation
        vx *= 0.94;
      }
      ry += vy;
      rx = clamp(rx + vx, -1.15, 1.15);
      draw();
      raf = requestAnimationFrame(frame);
    }

    host.addEventListener('pointerdown', (e) => {
      dragging = true; lx = e.clientX; ly = e.clientY;
      try { host.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    host.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      vy = dx * 0.006; vx = dy * 0.006;
    });
    const end = () => { dragging = false; };
    host.addEventListener('pointerup', end);
    host.addEventListener('pointercancel', end);
    window.addEventListener('resize', () => { measure(); draw(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        const on = entries[0].isIntersecting;
        if (on && !raf) raf = requestAnimationFrame(frame);
        if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: '100px' }).observe(host);
    } else { raf = requestAnimationFrame(frame); }

    return { build };
  })();

  /* ------------------------------------------------ neural network (Team AI) */
  const neural = (() => {
    const cv = $('#neural');
    const ctx = cv.getContext('2d');
    const section = $('#ai');
    let W = 0, H = 0, nodes = [], pulses = [], adj = [], raf = 0, mx = -999, my = -999, lastSpawn = 0;
    const LINK = 150;

    function resize() {
      const b = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = b.width; H = b.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.round((W * H) / 15000), 24, 84);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: 1.2 + Math.random() * 1.9,
      }));
      pulses = [];
      if (reduced) frame(performance.now());
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      adj = nodes.map(() => []);
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          const dx = mx - n.x, dy = my - n.y, d2 = dx * dx + dy * dy;
          if (d2 < 170 * 170) { const f = (1 - Math.sqrt(d2) / 170) * 0.022; n.x += dx * f; n.y += dy * f; }
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          adj[i].push(j); adj[j].push(i);
          const mxd = Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my);
          const alpha = (1 - d / LINK) * 0.3 + (mxd < 150 ? (1 - mxd / 150) * 0.5 : 0);
          ctx.strokeStyle = `rgba(0,255,163,${alpha.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        const near = Math.hypot(n.x - mx, n.y - my);
        const glow = near < 150 ? 1 - near / 150 : 0;
        ctx.fillStyle = `rgba(190,255,232,${(0.45 + glow * 0.55).toFixed(2)})`;
        ctx.shadowColor = '#00ffa3'; ctx.shadowBlur = 6 + glow * 16;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + glow * 2, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!reduced) {
        // Signals hop from node to node along the connections.
        if (now - lastSpawn > 420 && pulses.length < 10) {
          const a = (Math.random() * nodes.length) | 0;
          if (adj[a] && adj[a].length) { pulses.push({ a, b: adj[a][(Math.random() * adj[a].length) | 0], p: 0, s: 0.012 + Math.random() * 0.012 }); lastSpawn = now; }
        }
        pulses = pulses.filter((u) => {
          u.p += u.s;
          const A = nodes[u.a], B = nodes[u.b];
          if (!A || !B) return false;
          if (u.p >= 1) {
            const next = (adj[u.b] || []).filter((k) => k !== u.a);
            if (!next.length) return false;
            u.a = u.b; u.b = next[(Math.random() * next.length) | 0]; u.p = 0;
            return true;
          }
          const x = A.x + (B.x - A.x) * u.p, y = A.y + (B.y - A.y) * u.p;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.3, 'rgba(0,255,163,.6)'); g.addColorStop(1, 'rgba(0,255,163,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.283); ctx.fill();
          return true;
        });
        raf = requestAnimationFrame(frame);
      }
    }

    section.addEventListener('pointermove', (e) => {
      const b = cv.getBoundingClientRect();
      mx = e.clientX - b.left; my = e.clientY - b.top;
    }, { passive: true });
    section.addEventListener('pointerleave', () => { mx = my = -999; });
    window.addEventListener('resize', () => { if (raf || reduced) resize(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        const on = entries[0].isIntersecting;
        if (on && !raf && !reduced) { resize(); raf = requestAnimationFrame(frame); }
        if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
        if (on && reduced) resize();
      }, { rootMargin: '120px' }).observe(section);
    }
  })();

  /* ---------------------------------------------------- terminal (Team AI) */
  const term = (() => {
    const body = $('#termBody');
    const box = $('#terminal');
    let timers = [], state = 'pre'; // pre -> played
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));

    function build(mode) {
      timers.forEach(clearTimeout); timers = [];
      body.textContent = '';
      const cmd = el('div', 'tline cmd show');
      const cmdText = el('span');
      cmd.appendChild(cmdText);
      body.appendChild(cmd);
      const rows = t('ai.lines').map(([k, v]) => {
        const r = el('div', 'tline row');
        r.append(el('span', 'k', k), el('span', 'dots'), el('span', 'v', v));
        body.appendChild(r);
        return r;
      });
      const out = el('div', 'tline out');
      out.setAttribute('dir', 'auto');
      const outText = el('span');
      out.appendChild(outText);
      body.appendChild(out);

      // The terminal stays LTR/Latin, so always show the Latin spelling of the name here.
      const cmdStr = t('ai.cmd').replace(/\{name\}/g, (C.name && C.name.en) || pick(C.name));
      const outStr = t('ai.out');
      if (mode === 'final') {
        cmdText.textContent = cmdStr; outText.textContent = outStr;
        rows.forEach((r) => r.classList.add('show')); out.classList.add('show');
        return;
      }
      if (mode === 'anim') {
        let at = 200;
        for (let i = 1; i <= cmdStr.length; i++) later(at + i * 30, () => { cmdText.textContent = cmdStr.slice(0, i); });
        at += cmdStr.length * 30 + 350;
        rows.forEach((r) => { later(at, () => r.classList.add('show')); at += 380; });
        later(at, () => out.classList.add('show'));
        for (let i = 1; i <= outStr.length; i++) later(at + 120 + i * 22, () => { outText.textContent = outStr.slice(0, i); });
      }
    }

    function play() {
      if (state === 'played') return;
      state = 'played';
      build(reduced ? 'final' : 'anim');
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, io) => {
        if (entries[0].isIntersecting) { play(); io.disconnect(); }
      }, { threshold: 0.45 }).observe(box);
    } else { play(); }

    return { rebuild() { build(state === 'played' ? 'final' : 'pre'); } };
  })();

  /* ------------------------------------------------------ scroll-driven UI */
  const nav = $('#nav');
  const progress = $('#progress');
  const heroInner = $('#heroInner');
  const timeline = $('#timeline');
  const sceneSections = $$('[data-scene]');
  let activeScene = '';
  let ticking = false;
  let finaleFired = false;

  function update() {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const max = Math.max(1, doc.scrollHeight - vh);
    progress.style.transform = `scaleX(${clamp(y / max, 0, 1).toFixed(4)})`;
    nav.classList.toggle('scrolled', y > 24);

    if (!reduced) {
      const f = clamp(y / (vh * 0.7), 0, 1);
      heroInner.style.transform = `translate3d(0, ${(y * 0.14).toFixed(1)}px, 0)`;
      heroInner.style.opacity = String((1 - f * 0.92).toFixed(3));
    }

    let name = activeScene;
    for (const s of sceneSections) {
      const r = s.getBoundingClientRect();
      if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) { name = s.dataset.scene; break; }
    }
    if (name !== activeScene) {
      activeScene = name;
      if (Scene) Scene.setState(name);
      if (name === 'finale' && !finaleFired && !reduced) {
        finaleFired = true;
        const b = $('#finaleLove').getBoundingClientRect();
        setTimeout(() => confetti.burst(b.left + b.width / 2, b.top, 130), 500);
      }
    }

    const r = timeline.getBoundingClientRect();
    timeline.style.setProperty('--p', clamp((vh * 0.62 - r.top) / Math.max(1, r.height), 0, 1).toFixed(3));
    $$('.tl-item', timeline).forEach((li) => li.classList.toggle('on', li.getBoundingClientRect().top < vh * 0.66));
  }
  function requestUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  /* ------------------------------------------------------------------ boot */
  function renderAll() {
    applyStatic();
    renderHeroTitle();
    renderTimeline();
    renderCards();
    renderBand();
    renderAI();
    renderLetter();
    renderLinks();
    sphere.build();
    term.rebuild();
    if (Scene) Scene.setMirror(lang === 'ar');
    observeReveals();
    requestUpdate();
  }

  function setLang(next) {
    lang = next;
    store.set('farewell-lang', lang);
    renderAll();
  }

  function init() {
    $$('img[data-logo]').forEach((img) => { img.src = C.logo; });
    const fav = $('#favicon');
    if (fav && C.logo) { fav.href = C.logo; fav.type = /\.svg$/i.test(C.logo) ? 'image/svg+xml' : 'image/png'; }

    if (Scene) Scene.setMirror(lang === 'ar');
    const ok = Scene ? Scene.init($('#scene'), { reduced }) : false;
    if (!ok) doc.classList.add('no-webgl');

    renderAll();
    bindPointerFx();

    $('#langBtn').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));
    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-love]');
      if (b) sendLove(b);
    });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([Promise.all([fontsReady, sleep(1000)]), sleep(3500)]).then(() => {
      document.body.classList.add('ready');
      $('#loader').classList.add('hide');
      requestUpdate();
    });
  }

  init();
})();
