(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;

  /* ---------- text effects ---------- */
  const GLYPHS = '01#$%&<>/\\*+=?@ABCDEFGHJKLMNPQRSTUVWXYZ';
  function decode(el, delay = 0) {
    const final = el.dataset.final || '';
    if (reduce) { el.textContent = final; return; }
    setTimeout(() => {
      const dur = 1000 + final.length * 70, t0 = performance.now();
      (function step(now) {
        const p = clamp((now - t0) / dur, 0, 1), n = Math.floor(p * final.length);
        let out = '';
        for (let i = 0; i < final.length; i++) {
          const c = final[i];
          out += c === ' ' ? ' ' : (i < n ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]);
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(step); else el.textContent = final;
      })(t0);
    }, delay);
  }

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    words.forEach((w, i) => {
      const o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
      const n = document.createElement('span'); n.className = 'wi';
      n.textContent = w; n.style.setProperty('--d', (i * 70) + 'ms');
      o.appendChild(n); el.appendChild(o);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  $$('[data-split]').forEach(splitWords);

  $$('.scr-block .line').forEach((l, i) => {
    l.innerHTML = '<span style="--d:' + (i * 140) + 'ms">' + l.textContent + '</span>';
  });

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in-view');
    if (e.target.id === 'fbig') decode($('.scr', e.target));
    io.unobserve(e.target);
  }), { threshold: .25 });
  $$('[data-split], .scr-block, #fbig').forEach(el => io.observe(el));

  /* manifesto words */
  const mani = $('#mani');
  const mWords = mani.textContent.trim().split(/\s+/);
  mani.textContent = '';
  mWords.forEach((w, i) => {
    const s = document.createElement('span'); s.className = 'mw'; s.textContent = w;
    mani.appendChild(s);
    if (i < mWords.length - 1) mani.appendChild(document.createTextNode(' '));
  });
  const mw = $$('.mw');

  /* ---------- typing role ---------- */
  const typeEl = $('#typing-text');
  const roles = ['Software developer in the making', 'Ethical hacker', 'Programmer'];
  let ri = 0, ci = 0, del = false;
  function typeRole() {
    const w = roles[ri];
    ci += del ? -1 : 1;
    typeEl.textContent = w.substring(0, ci);
    let wait = del ? 45 : 90;
    if (!del && ci === w.length) { del = true; wait = 1800; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 450; }
    setTimeout(typeRole, wait);
  }

  /* ---------- hero terminal ---------- */
  const termEl = $('#termBody');
  const termScript = [
    { p: 1, t: 'whoami' },
    { t: 'abdul_vajid_k', c: 'g' },
    { p: 1, t: 'cat role.txt' },
    { t: 'software developer in the making\nethical hacker' },
    { p: 1, t: 'ls skills/' },
    { t: 'web/  python/  pentest/  linux/' },
    { p: 1, t: 'status' },
    { t: 'available for projects', c: 'g' }
  ];
  function runTerm() {
    if (reduce) {
      termEl.innerHTML = termScript.map(l => l.p ? '<span class="p">$ </span>' + l.t : (l.c ? '<span class="' + l.c + '">' + l.t + '</span>' : l.t)).join('\n');
      return;
    }
    let i = 0;
    function next() {
      if (i >= termScript.length) { termEl.insertAdjacentHTML('beforeend', '<span class="p">$ </span><span class="caret">|</span>'); return; }
      const l = termScript[i++];
      const line = document.createElement('span');
      if (l.p) {
        line.innerHTML = '<span class="p">$ </span>';
        const txt = document.createElement('span'); line.appendChild(txt);
        termEl.appendChild(line);
        let k = 0;
        (function t() { txt.textContent = l.t.slice(0, ++k); if (k < l.t.length) setTimeout(t, 55); else { termEl.append('\n'); setTimeout(next, 260); } })();
      } else {
        line.textContent = l.t; if (l.c) line.className = l.c;
        termEl.appendChild(line); termEl.append('\n');
        setTimeout(next, 320);
      }
    }
    next();
  }

  /* ---------- boot screen ---------- */
  const pre = $('#pre'), bootLines = $('#bootLines');
  const bootScript = [
    [4, '> booting vajid.sys'],
    [28, '> loading modules ........ <span class="ok">[ok]</span>'],
    [58, '> securing connection .... <span class="ok">[ok]</span>'],
    [86, '> access granted. welcome.']
  ];
  let started = false;
  function ready() {
    if (started) return; started = true;
    document.body.classList.add('ready');
    const names = $$('#hl .scr');
    names.forEach((n, i) => decode(n, i * 250));
    setTimeout(typeRole, 1800);
    setTimeout(runTerm, 1500);
  }
  if (reduce) { pre.remove(); ready(); }
  else {
    root.style.overflow = 'hidden';
    const num = $('#preNum'), pbar = $('#preBar'), t0 = performance.now(), dur = 2300;
    let shown = 0;
    (function tick(now) {
      const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3), pct = Math.round(e * 100);
      num.textContent = pct;
      pbar.style.transform = 'scaleX(' + e + ')';
      while (shown < bootScript.length && pct >= bootScript[shown][0]) {
        bootLines.insertAdjacentHTML('beforeend', bootScript[shown][1] + '\n');
        shown++;
      }
      if (p < 1) requestAnimationFrame(tick);
      else {
        pre.classList.add('done');
        root.style.overflow = '';
        setTimeout(ready, 450);
        setTimeout(() => pre.remove(), 1500);
      }
    })(t0);
  }

  /* ---------- cursor, magnetic, tilt ---------- */
  if (fine && !reduce) {
    root.classList.add('has-cursor');
    const dot = $('#cur'), ring = $('#ring'), lab = $('#ringLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() { rx = lerp(rx, mx, .16); ry = lerp(ry, my, .16); ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      const l = e.target.closest('[data-cursor]');
      const h = e.target.closest('a,button,input,textarea,label');
      lab.textContent = l ? l.dataset.cursor : '';
      ring.classList.toggle('label', !!l);
      ring.classList.toggle('big', !!h && !l);
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateY(${(px - .5) * 10}deg) rotateX(${(.5 - py) * 10}deg) scale(1.02)`;
        c.style.setProperty('--gx', px * 100 + '%'); c.style.setProperty('--gy', py * 100 + '%');
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }

  /* ---------- code rain (hero) ---------- */
  const rain = $('#rain'), rx2 = rain.getContext('2d'), hero = $('#hero');
  const RC = '01{}[]<>/\\;=+#$%&*';
  let RW = 0, RH = 0, FS = 16, cols = 0, drops = [], heroVisible = true, rm = { x: -999, y: -999 }, DPR = Math.min(devicePixelRatio || 1, 2), tick2 = 0;
  function sizeRain() {
    const r = hero.getBoundingClientRect();
    RW = r.width; RH = r.height;
    rain.width = RW * DPR; rain.height = RH * DPR;
    rx2.setTransform(DPR, 0, 0, DPR, 0, 0);
    rx2.font = '500 ' + FS + 'px "JetBrains Mono", monospace';
    cols = Math.floor(RW / FS);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }
  function drawRain() {
    rx2.globalCompositeOperation = 'destination-out';
    rx2.fillStyle = 'rgba(0,0,0,.12)';
    rx2.fillRect(0, 0, RW, RH);
    rx2.globalCompositeOperation = 'source-over';
    for (let i = 0; i < cols; i++) {
      const x = i * FS, y = drops[i] * FS;
      const near = Math.hypot(x - rm.x, y - rm.y) < 120;
      rx2.fillStyle = near ? '#FFFFFF' : '#FFB400';
      rx2.fillText(RC[(Math.random() * RC.length) | 0], x, y);
      if (y > RH && Math.random() > .975) drops[i] = 0;
      drops[i] += near ? 1.8 : .7;
    }
  }
  sizeRain();
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); rm.x = e.clientX - r.left; rm.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { rm.x = rm.y = -999; });
  new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe(hero);
  if (!reduce) (function rainLoop() { if (heroVisible && (tick2++ & 1) === 0) drawRain(); requestAnimationFrame(rainLoop); })();

  /* ---------- services accordion ---------- */
  const svcs = $$('.svc');
  svcs.forEach(s => {
    const b = $('button', s);
    b.addEventListener('click', () => {
      const open = !s.classList.contains('open');
      svcs.forEach(o => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      if (open) { s.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- mobile menu ---------- */
  const nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }));

  /* ---------- scroll loop ---------- */
  const bar = $('#bar'), heroIn = $('#heroIn'), bands = $$('[data-skew]');
  const cards = $$('.pcard');
  cards.forEach((c, i) => c.style.setProperty('--i', i));
  let lastY = scrollY, skew = 0, navHidden = false;
  function frame() {
    const y = scrollY, vh = innerHeight, max = root.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    const dy = y - lastY;
    if (y > 240 && dy > 5 && !navHidden && !nav.classList.contains('open')) { nav.classList.add('hide'); navHidden = true; }
    else if ((dy < -5 || y < 240) && navHidden) { nav.classList.remove('hide'); navHidden = false; }
    lastY = y;

    if (!reduce) {
      skew = lerp(skew, clamp(dy * .22, -7, 7), .12);
      bands.forEach((b, i) => { b.style.transform = `rotate(${i ? 1.2 : -1.6}deg) skewX(${skew * (i ? -1 : 1)}deg)`; });
      if (y < vh * 1.3) {
        heroIn.style.transform = `translateY(${y * .16}px)`;
        heroIn.style.opacity = clamp(1 - y / (vh * .95), 0, 1);
      }
    }

    const mr = mani.getBoundingClientRect();
    const mp = clamp((vh * .78 - mr.top) / (mr.height * .85 + vh * .15), 0, 1);
    const lit = reduce ? mw.length : Math.round(mp * mw.length);
    for (let i = 0; i < mw.length; i++) mw[i].classList.toggle('on', i < lit);

    const stacked = innerWidth > 900 && !reduce;
    cards.forEach((c, i) => {
      if (!stacked || i === cards.length - 1) { c.style.transform = ''; c.style.filter = ''; return; }
      const cr = c.getBoundingClientRect(), nr = cards[i + 1].getBoundingClientRect();
      const p = clamp(1 - (nr.top - cr.top - 22) / (cr.height * .9), 0, 1);
      c.style.transform = `scale(${1 - p * .05})`;
      c.style.filter = `brightness(${1 - p * .45})`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  addEventListener('resize', sizeRain);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeRain);

  /* ---------- confetti ---------- */
  const cf = $('#confetti'), cfx = cf.getContext('2d');
  function burst(ox, oy) {
    cf.width = innerWidth; cf.height = innerHeight;
    const colors = ['#FFB400', '#FFFFFF', '#FF6A00', '#4DFFA8'];
    const ps = Array.from({ length: 130 }, () => {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 11;
      return { x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[(Math.random() * colors.length) | 0], life: 1 };
    });
    (function step() {
      cfx.clearRect(0, 0, cf.width, cf.height);
      let alive = false;
      ps.forEach(p => {
        p.vy += .28; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .006;
        if (p.life > 0 && p.y < cf.height + 40) {
          alive = true;
          cfx.save(); cfx.globalAlpha = clamp(p.life * 1.4, 0, 1); cfx.translate(p.x, p.y); cfx.rotate(p.r);
          cfx.fillStyle = p.c; cfx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cfx.restore();
        }
      });
      if (alive) requestAnimationFrame(step); else cfx.clearRect(0, 0, cf.width, cf.height);
    })();
  }

  /* ---------- contact form (Google Forms) ---------- */
  const form = $('#contact-form'), overlay = $('#popup-overlay');
  const FORM_URL = form.getAttribute('action');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#sendBtn'), label = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;
    try {
      await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: new FormData(form) });
      const r = btn.getBoundingClientRect();
      overlay.classList.add('active');
      form.reset();
      if (!reduce) burst(innerWidth / 2, innerHeight / 2);
    } catch (err) {
      console.error('Form error:', err);
      alert('Something went wrong. Please try again, or email me directly.');
    } finally {
      btn.textContent = label; btn.disabled = false;
    }
  });
  const closePop = () => overlay.classList.remove('active');
  $('#popup-close').addEventListener('click', closePop);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePop(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closePop(); closeChatBox(); } });

  /* ---------- AI widget + chat ---------- */
  const widget = $('#ai-widget'), popup = $('#chat-popup'), body = $('#chat-body');
  const input = $('#popup-input'), sendBtn = $('#popup-send'), voiceBtn = $('#voice-btn'), hint = $('#aiHint'), suggest = $('#suggest');
  let chatOpened = false, busy = false;

  function openChat() { popup.style.display = 'flex'; chatOpened = true; hint.classList.remove('show'); input.focus({ preventScroll: true }); }
  function closeChatBox() { popup.style.display = 'none'; }
  function toggleChat() { popup.style.display === 'none' ? openChat() : closeChatBox(); }

  function addMsg(text, user) {
    const m = document.createElement('div'); m.className = 'message ' + (user ? 'user' : 'bot');
    const c = document.createElement('div'); c.className = 'message-content'; c.textContent = text;
    m.appendChild(c); body.appendChild(m); body.scrollTop = body.scrollHeight;
  }
  const fallbacks = [
    "I can't reach my brain right now. Please try again in a moment.",
    "Connection hiccup on my side. Try again, or email Abdul directly.",
  ];
  async function send(text) {
    const message = (text ?? input.value).trim();
    if (!message || busy) return;
    busy = true; sendBtn.disabled = true;
    addMsg(message, true); input.value = '';
    if (suggest) suggest.remove();
    const typing = document.createElement('div'); typing.className = 'message bot typing'; typing.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(typing); body.scrollTop = body.scrollHeight;
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
      const data = await res.json();
      typing.remove();
      addMsg(data.reply || fallbacks[0], false);
    } catch (err) {
      typing.remove();
      addMsg(fallbacks[(Math.random() * fallbacks.length) | 0], false);
    } finally { busy = false; sendBtn.disabled = false; }
  }
  sendBtn.addEventListener('click', () => send());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  if (suggest) $$('button', suggest).forEach(b => b.addEventListener('click', () => send(b.dataset.q)));
  $('#close-chat').addEventListener('click', closeChatBox);

  /* voice input (no auto-speaking) */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const rec = new SR(); rec.continuous = false; rec.lang = 'en-US';
    voiceBtn.addEventListener('click', () => { voiceBtn.classList.add('listening'); try { rec.start(); } catch (e) {} });
    rec.onresult = e => { input.value = e.results[0][0].transcript; voiceBtn.classList.remove('listening'); send(); };
    rec.onerror = rec.onend = () => voiceBtn.classList.remove('listening');
  } else voiceBtn.style.display = 'none';

  /* draggable widget; click toggles chat */
  let dragging = false, moved = false, sx, sy, ix, iy;
  const down = e => {
    dragging = true; moved = false;
    const p = e.touches ? e.touches[0] : e; sx = p.clientX; sy = p.clientY;
    const r = widget.getBoundingClientRect(); ix = r.left; iy = r.top;
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false }); document.addEventListener('touchend', up);
  };
  const move = e => {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e, dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
    if (!moved) return;
    if (e.cancelable) e.preventDefault();
    widget.style.right = 'auto'; widget.style.bottom = 'auto';
    widget.style.left = clamp(ix + dx, 0, innerWidth - widget.offsetWidth) + 'px';
    widget.style.top = clamp(iy + dy, 0, innerHeight - widget.offsetHeight) + 'px';
  };
  const up = () => {
    dragging = false;
    document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
    document.removeEventListener('touchmove', move); document.removeEventListener('touchend', up);
  };
  widget.addEventListener('mousedown', down);
  widget.addEventListener('touchstart', down, { passive: true });
  widget.addEventListener('click', () => { if (!moved) toggleChat(); });
  widget.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleChat(); } });

  /* friendly nudge instead of auto-opening the chat */
  setTimeout(() => { if (!chatOpened) { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 6000); } }, reduce ? 3000 : 6500);
})();
