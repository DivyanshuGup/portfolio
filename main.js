/* ── Custom cursor (ring only, no dot) ── */
const cursor = document.getElementById('cursor');
if (window.matchMedia('(hover:hover)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.style.opacity = '1';
  });
  cursor.style.opacity = '0';
  // Expand ring when over interactive elements / boxes
  document.querySelectorAll('a,button,.proj-block,.cert-card,.sk-block,.edu-row,.exp-card,.resume-wrap,.btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
}

/* ── Resume modal ── */
const RESUME_URL = './Resume.pdf'; // Replace with your PDF link
function openResume() {
  const modal = document.getElementById('resume-modal');
  const iframe = document.getElementById('resume-iframe');
  iframe.src = RESUME_URL;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeResume() {
  const modal = document.getElementById('resume-modal');
  const iframe = document.getElementById('resume-iframe');
  modal.style.display = 'none';
  iframe.src = '';
  document.body.style.overflow = '';
}
document.getElementById('resume-modal').addEventListener('click', function(e) {
  if (e.target === this) closeResume();
});

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile nav — slim dropdown ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobNav');
ham.addEventListener('click', e => {
  e.stopPropagation();
  ham.classList.toggle('active');
  mob.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!mob.contains(e.target) && !ham.contains(e.target)) {
    ham.classList.remove('active');
    mob.classList.remove('open');
  }
});
function closeNav() {
  ham.classList.remove('active');
  mob.classList.remove('open');
}

/* ── Scroll reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = e.target.parentElement.querySelectorAll('.sr,.sr-left,.sr-right');
      const idx = [...siblings].indexOf(e.target);
      setTimeout(() => e.target.classList.add('vis'), idx * 110);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.sr,.sr-left,.sr-right').forEach(el => io.observe(el));

/* ── Canvas: hero speed streaks ── */
(function() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, lines = [];
  const isMobile = window.innerWidth < 768;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function createLine() {
    const angle = (Math.random() * 20 - 10) * Math.PI / 180;
    return {
      x: Math.random() * W * 1.2 - W * 0.1,
      y: H * 0.5 + (Math.random() - 0.5) * H * 0.6,
      len: 80 + Math.random() * 180,
      speed: 4 + Math.random() * 6,
      opacity: 0, angle,
      life: 0, maxLife: 60 + Math.random() * 40,
      color: Math.random() > 0.5 ? '0,180,255' : '100,220,255',
    };
  }
  const COUNT = isMobile ? 8 : 16;
  for (let i = 0; i < COUNT; i++) { const l = createLine(); l.life = Math.random() * l.maxLife; lines.push(l); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    lines.forEach((l, i) => {
      l.life++;
      const progress = l.life / l.maxLife;
      l.opacity = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
      l.x += Math.cos(l.angle) * l.speed;
      l.y += Math.sin(l.angle) * l.speed;
      const ex = l.x + Math.cos(l.angle) * l.len;
      const ey = l.y + Math.sin(l.angle) * l.len;
      const grad = ctx.createLinearGradient(l.x, l.y, ex, ey);
      grad.addColorStop(0, `rgba(${l.color},0)`);
      grad.addColorStop(0.4, `rgba(${l.color},${l.opacity * 0.7})`);
      grad.addColorStop(0.5, `rgba(255,255,255,${l.opacity})`);
      grad.addColorStop(0.6, `rgba(${l.color},${l.opacity * 0.7})`);
      grad.addColorStop(1, `rgba(${l.color},0)`);
      ctx.strokeStyle = grad; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,240,255,${l.opacity * 0.9})`; ctx.fill();
      if (l.life >= l.maxLife || l.x > W*1.3 || l.x < -W*0.3 || l.y > H*1.3) lines[i] = createLine();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Speed streaks in gradient-wipe section ── */
(function() {
  const container = document.getElementById('streaks-container');
  if (!container) return;
  const count = window.innerWidth < 600 ? 10 : 22;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'streak';
    const top = 10 + Math.random() * 80, width = 120 + Math.random() * 300;
    const angle = -3 + Math.random() * 8, dur = 2.5 + Math.random() * 3, delay = Math.random() * 4;
    el.style.cssText = `top:${top}%;left:-30%;width:${width}px;--dur:${dur}s;--delay:${delay}s;--angle:${angle}deg;`;
    container.appendChild(el);
  }
})();

/* ── Scroll-driven cube: expanding dot ring + scroll rotation + text from center ── */
(function() {
  const section  = document.getElementById('cube-scroll-section');
  const canvas   = document.getElementById('cube-ring-canvas');
  const cubeEl   = document.getElementById('scroll-cube');
  const tLeft    = document.getElementById('cube-text-left');
  const tRight   = document.getElementById('cube-text-right');
  const tMob     = document.getElementById('cube-text-mobile');
  if (!section || !canvas || !cubeEl) return;

  const ctx = canvas.getContext('2d');
  const DOT_COUNT = 48;
  const isMob = window.innerWidth < 700;
  if (isMob) { tMob.style.display = 'block'; tLeft.style.display = 'none'; tRight.style.display = 'none'; }

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Stable random per dot
  const dotSz = [], dotAlpha = [];
  for (let i = 0; i < DOT_COUNT; i++) { dotSz.push(1.2 + Math.random() * 2.8); dotAlpha.push(0.25 + Math.random() * 0.65); }

  let scrollProgress = 0;

  function drawRing(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    // Ring: starts at cube edge (~120px), expands to near screen edge
    const minR = isMob ? 75 : 100;
    const maxR = Math.min(canvas.width, canvas.height) * (isMob ? 0.46 : 0.44);
    const r = minR + (maxR - minR) * p;
    const gAlpha = Math.min(1, p * 2.5);

    for (let i = 0; i < DOT_COUNT; i++) {
      const a = (i / DOT_COUNT) * Math.PI * 2;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      const isAcc = i % 7 === 0;
      const alpha = dotAlpha[i] * gAlpha;
      ctx.beginPath();
      ctx.arc(x, y, dotSz[i], 0, Math.PI * 2);
      ctx.fillStyle = isAcc ? `rgba(200,255,0,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.shadowColor = isAcc ? 'rgba(200,255,0,0.5)' : 'rgba(60,120,255,0.5)';
      ctx.shadowBlur = isAcc ? 7 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  (function loop() { drawRing(scrollProgress); requestAnimationFrame(loop); })();

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, -rect.top / total));
    scrollProgress = p;

    // Cube: JS drives rotation from initial angle + scroll
    const scrollY = p * 360;
    cubeEl.style.animation = 'none';
    cubeEl.style.transform = `rotateX(-30deg) rotateY(${30 + scrollY}deg)`;

    // Text: slides OUT from cube center (starts at center, moves to sides)
    // p=0.25 start → p=0.6 full
    const tp = Math.max(0, Math.min(1, (p - 0.22) / 0.35));
    const slideLeft = (1 - tp) * 180; // px from center
    const slideRight = (1 - tp) * 180;

    if (!isMob) {
      // Left text starts at center-right, moves to natural left position
      tLeft.style.opacity = tp;
      tLeft.style.transform = `translateY(-50%) translateX(${-slideLeft}px)`;

      // Right text starts at center-left, moves to natural right position
      tRight.style.opacity = tp;
      tRight.style.transform = `translateY(-50%) translateX(${slideRight}px)`;
    } else {
      tMob.style.opacity = tp;
      tMob.style.transform = `translateY(${20 * (1 - tp)}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Parallax watermarks ── */
(function() {
  const els = document.querySelectorAll('.wm');
  function onScroll() {
    els.forEach(el => {
      const rect = el.closest('section,div').getBoundingClientRect();
      el.style.transform = `translateY(${rect.top * 0.3}px)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
