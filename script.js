// ============================================
// RONY RISVALDO — Portofolio Dark Fantasy Pixel Art
// ============================================

const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Musik latar + layar pembuka ----------
(function musicAndIntro() {
  const bgm = document.getElementById('bgm');
  const toggle = document.getElementById('musicToggle');
  const intro = document.getElementById('intro');

  const setMusic = on => {
    if (!bgm) return;
    if (on) { bgm.volume = 0.45; bgm.play().catch(() => {}); }
    else bgm.pause();
    if (toggle) toggle.classList.toggle('on', on);
  };
  if (toggle && bgm) toggle.addEventListener('click', () => setMusic(bgm.paused));

  if (!intro) return;
  // tampilkan layar pembuka sekali per sesi
  if (sessionStorage.getItem('introDone')) { intro.remove(); return; }
  document.documentElement.classList.add('no-scroll');
  const close = () => {
    sessionStorage.setItem('introDone', '1');
    document.documentElement.classList.remove('no-scroll');
    intro.classList.add('closing');
    setTimeout(() => intro.remove(), 550);
  };
  document.getElementById('pressStart').addEventListener('click', () => { setMusic(true); close(); });
  document.getElementById('startMuted').addEventListener('click', close);
})();

// ---------- Lebar tile langit (agar animasi pan mulus tanpa "loncat") ----------
(function skyTile() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const SKY_W = 384, SKY_H = 288; // ukuran asli sky.png
  const set = () => {
    const tile = Math.round(hero.clientHeight / SKY_H * SKY_W);
    hero.style.setProperty('--skyW', tile + 'px');
  };
  set();
  addEventListener('resize', set);
})();

// ---------- Partikel bara api (tsParticles) ----------
(function embers() {
  if (REDUCED_MOTION || typeof tsParticles === 'undefined') return;
  tsParticles.load({
    id: 'embers',
    options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 40, density: { enable: true } },
        color: { value: ['#ffb84d', '#e8c170', '#ff9b3d'] },
        shape: { type: 'square' },
        opacity: {
          value: { min: 0.1, max: 0.85 },
          animation: { enable: true, speed: 0.6, sync: false }
        },
        size: { value: { min: 1.5, max: 3.5 } },
        move: {
          enable: true,
          direction: 'top',
          speed: { min: 0.4, max: 1.4 },
          random: true,
          straight: false,
          outModes: { default: 'out' }
        }
      }
    }
  });
})();

// ---------- Efek mengetik di hero ----------
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const ROLES = [
    'Full-Stack Web Developer',
    'Laravel Artisan',
    'Flutter Adventurer',
    'Mahasiswa IT'
  ];
  let role = 0, chars = 0, deleting = false;

  (function tick() {
    const word = ROLES[role];
    chars += deleting ? -1 : 1;
    el.textContent = word.slice(0, chars);
    let delay = deleting ? 45 : 95;
    if (!deleting && chars === word.length) { delay = 2000; deleting = true; }
    else if (deleting && chars === 0) { deleting = false; role = (role + 1) % ROLES.length; delay = 400; }
    setTimeout(tick, delay);
  })();
})();

// ---------- Menu mobile ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ---------- Scrollspy: tandai menu yang aktif ----------
(function scrollspy() {
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (!sections.length || !links.length) return;
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
})();

// ---------- Reveal saat scroll + skill bar + angka berjalan ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('revealed');

    if (el.classList.contains('skill')) {
      el.style.setProperty('--w', (el.dataset.level || 0) + '%');
    }

    el.querySelectorAll('.mini-num[data-count]').forEach(num => {
      const target = parseInt(num.dataset.count, 10);
      const dur = 1200;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        num.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });

    observer.unobserve(el);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- Easter egg: latih tanding si biksu ----------
(function monkTraining() {
  const monk = document.querySelector('.sprite-monk');
  if (!monk) return;
  monk.title = 'Klik untuk latihan!';
  monk.addEventListener('click', () => {
    if (monk.classList.contains('punch') || monk.classList.contains('kick')) return;
    const move = Math.random() < 0.5 ? 'punch' : 'kick';
    monk.classList.add(move);
    setTimeout(() => monk.classList.remove('punch', 'kick'), move === 'punch' ? 740 : 620);
  });
})();

// ---------- Easter egg: kalahkan si ghoul ----------
(function ghoulBattle() {
  const ghoul = document.querySelector('.sprite-ghoul');
  if (!ghoul) return;
  ghoul.title = 'Serang!';
  ghoul.addEventListener('click', () => {
    if (ghoul.classList.contains('dying')) return;

    // bekukan posisi & arah hadap saat ini sebelum animasi patroli dilepas
    const track = ghoul.parentElement.getBoundingClientRect();
    const rect = ghoul.getBoundingClientRect();
    const matrix = new DOMMatrixReadOnly(getComputedStyle(ghoul).transform);
    ghoul.style.left = (rect.left - track.left) + 'px';
    if (matrix.a < 0) ghoul.style.transform = 'scaleX(-1)';
    ghoul.classList.add('dying');

    // respawn setelah beberapa detik
    setTimeout(() => {
      ghoul.classList.remove('dying');
      ghoul.style.left = '';
      ghoul.style.transform = '';
    }, 6000);
  });
})();

// ---------- Form kontak (terkirim ke email lewat FormSubmit) ----------
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    note.textContent = '» Gagak sedang terbang membawa pesanmu... «';
    try {
      const res = await fetch('https://formsubmit.co/ajax/ronyrisvaldo313@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
          _subject: 'Pesan baru dari website portofolio',
          _template: 'table'
        })
      });
      if (!res.ok) throw new Error('gagal');
      note.textContent = '» Gagak telah sampai! Pesanmu terkirim. «';
      form.reset();
    } catch {
      note.textContent = '» Gagak tersesat... coba lagi, atau email langsung ke ronyrisvaldo313@gmail.com «';
    }
    btn.disabled = false;
  });
}

// ---------- Tahun footer ----------
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
