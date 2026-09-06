(function () {

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReducedMotion = motionQuery.matches;
  var pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  motionQuery.addEventListener('change', function () { prefersReducedMotion = motionQuery.matches; });

  var toggle = document.getElementById('theme-toggle');
  var root   = document.documentElement;

  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }

  var mobileToggle = document.getElementById('mobile-theme-toggle');
  function syncTheme() {
    [toggle, mobileToggle].forEach(function (button) {
      if (button) button.setAttribute('aria-pressed', String(root.classList.contains('dark')));
    });
  }
  [toggle, mobileToggle].forEach(function (button) {
    if (button) button.addEventListener('click', function () {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
      syncTheme();
    });
  });
  syncTheme();
  var header = document.getElementById('floating-header');
  var menuButton = document.getElementById('mobile-menu-button');
  function closeMenu() {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  header.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
  document.addEventListener('click', function (event) { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', function () {
    if (header.contains(document.activeElement)) menuButton.blur();
    closeMenu();
  });

  var heroSection = document.getElementById('hero');
  var canvas = document.getElementById('hero-particles');
  var ctx = canvas.getContext('2d');
  var icons = Array.from(heroSection.querySelectorAll('.tech-icons > .tech-icon'));
  var blobs = heroSection.querySelectorAll('.ambient-orb');
  var particles = [], frame = null, pointerFrame = null, resizeTimer;
  var heroVisible = true, active = false, canvasWidth = 0, canvasHeight = 0;
  var previousTime = 0, pointer = null;
  function effectsAllowed() {
    return heroVisible && !document.hidden && !motionQuery.matches && !document.body.classList.contains('modal-open');
  }
  function drawParticles(time) {
    frame = null;
    if (!active || !ctx) return;
    var step = previousTime ? Math.min((time - previousTime) / 16.67, 2) : 1;
    previousTime = time;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    particles.forEach(function (p) {
      p.x += p.dx * step; p.y += p.dy * step;
      if (p.x < 0 || p.x > canvasWidth) p.dx *= -1;
      if (p.y < 0 || p.y > canvasHeight) p.dy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')'; ctx.fill();
    });
    frame = requestAnimationFrame(drawParticles);
  }
  function syncEffects() {
    active = effectsAllowed();
    heroSection.classList.toggle('hero-effects-paused', !active);
    canvas.hidden = motionQuery.matches;
    if (!active) {
      if (frame !== null) cancelAnimationFrame(frame);
      if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
      frame = pointerFrame = null; previousTime = 0;
    } else if (frame === null && ctx) frame = requestAnimationFrame(drawParticles);
  }
  function placeIcons() {
    var heroRect = heroSection.getBoundingClientRect();
    var mobile = innerWidth < 768;
    var obstacles = [heroSection.querySelector('.hero-content'), heroSection.querySelector('.hero-scroll-button'), header]
      .map(function (el) {
        var r = el.getBoundingClientRect();
        return el === header ? { left: r.left, right: r.right, top: r.top + heroRect.top, bottom: r.bottom + heroRect.top } : r;
      });
    var candidates = [];
    [0.04, 0.9, 0.13, 0.81, 0.22, 0.72, 0.31, 0.63, 0.4, 0.54].forEach(function (y) {
      [0.06, 0.23, 0.4, 0.57, 0.74, 0.87].forEach(function (x, index) { candidates.push([x, y + (index % 3 - 1) * .014]); });
    });
    var used = [];
    icons.forEach(function (icon, index) {
      var size = mobile ? Math.min(26, Math.max(18, innerWidth * .06)) : parseFloat(icon.style.getPropertyValue('--size'));
      var margin = mobile ? 9 : 20;
      var position = candidates.find(function (point, i) {
        if (used.includes(i)) return false;
        var left = heroRect.left + point[0] * heroRect.width;
        var top = heroRect.top + point[1] * heroRect.height;
        return left + size + margin <= heroRect.right && top + size + margin <= heroRect.bottom &&
          !obstacles.some(function (r) { return left - margin < r.right && left + size + margin > r.left && top - margin < r.bottom && top + size + margin > r.top; });
      });
      icon.toggleAttribute('data-obscured', !position);
      if (position) {
        used.push(candidates.indexOf(position));
        icon.style.left = (position[0] * 100) + '%'; icon.style.top = (position[1] * 100) + '%';
      }
      icon.style.setProperty('--delay', (-index * 1.3) + 's');
      icon.style.setProperty('--float-y', Math.max(-16, Math.min(-8, parseFloat(icon.style.getPropertyValue('--float-y')) || -12)) + 'px');
    });
  }
  function resizeEffects() {
    canvasWidth = heroSection.clientWidth; canvasHeight = heroSection.clientHeight;
    var density = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasWidth * density); canvas.height = Math.round(canvasHeight * density);
    if (ctx) ctx.setTransform(density, 0, 0, density, 0, 0);
    particles = Array.from({ length: innerWidth < 768 ? 16 : 40 }, function () {
      return { x: Math.random() * canvasWidth, y: Math.random() * canvasHeight, r: Math.random() * 1.8 + .6,
        dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .3, opacity: Math.random() * .4 + .1 };
    });
    placeIcons(); syncEffects();
  }
  new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; if (heroVisible) placeIcons(); syncEffects(); }).observe(heroSection);
  new MutationObserver(syncEffects).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', syncEffects);
  motionQuery.addEventListener('change', syncEffects);
  new ResizeObserver(function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeEffects, 120); }).observe(heroSection);
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeEffects, 120); });
  document.fonts.ready.then(placeIcons);
  heroSection.addEventListener('pointermove', function (event) {
    if (!active || !pointerQuery.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (pointerFrame !== null) return;
    pointerFrame = requestAnimationFrame(function () {
      pointerFrame = null;
      var rect = heroSection.getBoundingClientRect();
      var x = (pointer.x - rect.left) / rect.width - .5, y = (pointer.y - rect.top) / rect.height - .5;
      blobs.forEach(function (blob, index) { var distance = index ? -16 : 20; blob.style.transform = 'translate(' + x * distance + 'px,' + y * distance + 'px)'; });
    });
  });
  heroSection.addEventListener('pointerleave', function () { blobs.forEach(function (blob) { blob.style.transform = ''; }); });
  resizeEffects();

  var typingEl = document.getElementById('hero-typed');
  if (typingEl && !prefersReducedMotion) {
    var phrases     = ['Full-Stack Developer','IoT Systems Builder','CS Student & Maker','Clean Code Advocate'];
    var phraseIndex = 0;
    var charIndex   = 0;
    var deleting    = false;

    function typeLoop() {
      if (motionQuery.matches) { typingEl.textContent = 'Full-Stack Developer'; setTimeout(typeLoop, 1000); return; }
      var current = phrases[phraseIndex];
      if (!deleting) {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
        setTimeout(typeLoop, 80);
      } else {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 40);
      }
    }
    setTimeout(typeLoop, 900);
  } else if (typingEl) {
    typingEl.textContent = 'Full-Stack Developer';
  }

  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  var skillSections = document.querySelectorAll('[data-skill-group]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var pillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var pills = entry.target.querySelectorAll('.skill-tag-reveal');
        pills.forEach(function (pill, i) { setTimeout(function () { pill.classList.add('is-visible'); }, i * 60); });
        pillObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    skillSections.forEach(function (el) { pillObserver.observe(el); });
  } else {
    document.querySelectorAll('.skill-tag-reveal').forEach(function (p) { p.classList.add('is-visible'); });
  }

  var tiltCards = document.querySelectorAll('.project-card');
  if (!prefersReducedMotion) {
    tiltCards.forEach(function (card) {
      var inner = card.querySelector('.project-card-body');
      var shine = card.querySelector('.card-glare');
      card.addEventListener('mousemove', function (e) {
        if (!pointerQuery.matches || motionQuery.matches) return;
        var rect    = card.getBoundingClientRect();
        var x       = e.clientX - rect.left;
        var y       = e.clientY - rect.top;
        var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
        var rotateY = ((x - rect.width  / 2) / (rect.width  / 2)) *  6;
        if (inner) inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        if (shine) {
          shine.style.setProperty('--shine-x', ((x / rect.width)  * 100) + '%');
          shine.style.setProperty('--shine-y', ((y / rect.height) * 100) + '%');
        }
      });
      card.addEventListener('mouseleave', function () {
        if (inner) inner.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }

  var dotLinks  = document.querySelectorAll('.side-nav a');
  var floatLinks = document.querySelectorAll('.floating-nav .nav-link');
  var sectionsList = [];
  dotLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sectionsList.push({ el: target, link: link });
  });
  if (sectionsList.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sectionsList.find(function (s) { return s.el === entry.target; });
        if (match && entry.isIntersecting) {
          dotLinks.forEach(function (d) { d.classList.remove('active'); });
          match.link.classList.add('active');
          var href = match.link.getAttribute('href');
          floatLinks.forEach(function (fl) { fl.classList.toggle('active', fl.getAttribute('href') === href); });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sectionsList.forEach(function (s) { sectionObserver.observe(s.el); });
  }

})();

var projectsData = {
  hrms: {
    title:    'HRIS — HR Management System',
    type:     'Enterprise Platform',
    desc:     'A modular HRMS built with plain PHP, PDO, PostgreSQL, and Tailwind. It handles payroll, attendance, recruitment, inventory/POS, reporting, backups, audit logs, secure sessions, and role-based access.',
    tags:     ['PHP', 'PDO', 'PostgreSQL', 'Tailwind CSS', 'Chart.js', 'FPDF', 'Heroku'],
    features: [
      '5,000+ line payroll engine with deductions & bonuses',
      'Automated DTR & leave management system',
      'Recruitment pipeline with applicant tracking',
      'PDF export for payslips, reports & contracts',
      'Full audit trail & activity logging',
      'SPA-style navigation with role-based access',
    ],
    liveLink: 'https://hrms.bobs-thedev.tech',
    github:   'https://github.com/Bobsi01',
    image:    'images/hrms-login.png',
    images:   ['images/hrms-login.png', 'images/hrms-dashboard.png', 'images/hrms-password-reset.png'],
    imageLabels: ['Login', 'Dashboard', 'Password reset'],
  },
  agrisos: {
    title:    'AgriSOS',
    type:     'IoT + Mobile + Backend',
    desc:     'A smart agriculture platform with React Native mobile, React web, FastAPI/Python backend, PostgreSQL, Firebase, Google authentication, Brevo SMTP, Heroku hosting, and Arduino IDE/CLI firmware tooling.',
    tags:     ['React Native', 'React Web', 'NativeWind', 'FastAPI', 'Python', 'PostgreSQL', 'Firebase', 'Google Auth', 'Brevo SMTP', 'Heroku', 'Arduino IDE', 'Arduino CLI'],
    features: [
      'BLE device pairing for Arduino/ESP32 soil sensor',
      'Real-time NPK, pH, moisture & temperature readings',
      'FastAPI/Python backend for algorithms and API routing',
      'Plant health scoring & gamification system',
      'React Native mobile UI with NativeWind styling',
      'React web dashboard with Tailwind CSS',
      'Firebase and Google authentication',
      'Brevo SMTP email delivery on Heroku',
    ],
    liveLink: 'https://www.agrisos.app/',
    github:   'https://github.com/Bobsi01',
    image:    'images/agrisos-live.png',
    images:   ['images/agrisos-live.png', 'images/agrisos-2.png', 'images/agrisos-3.png'],
  },
  records: {
    title:    'Student Record Management',
    type:     'Web Application',
    desc:     'A Laravel 11 student records system with Blade, Tailwind, Alpine, Turbo navigation, Sanctum session auth, PostgreSQL production storage, document verification, OTP reset, notifications, and audit logging.',
    tags:     ['Laravel 11', 'PHP 8.2', 'Blade', 'Alpine.js', 'Turbo', 'PostgreSQL', 'Tailwind CSS', 'Sanctum'],
    features: [
      'Application-based registration with document verification',
      'Collections & submissions workflow engine',
      'Alumni tracking & record retrieval portal',
      'OTP password reset via Brevo SMTP',
      'Encrypted file storage using PostgreSQL BYTEA',
      'Hotwire Turbo navigation & activity log',
    ],
    liveLink: 'https://records.bobs-thedev.tech',
    github:   'https://github.com/Bobsi01',
    image:    'images/records-landing.png',
    images:   ['images/records-landing.png', 'images/records-login.png', 'images/records-dashboard.png'],
    imageLabels: ['Landing page', 'Login page', 'Dashboard'],
  },
  cml: {
    title:    'CML Management System',
    type:     'Enterprise Web App',
    desc:     'A Laravel 13 and React 19 management system using Inertia.js, Tailwind 4, PostgreSQL, Reverb WebSockets, Sanctum, Spatie permissions, S3 storage, barcode/QR tools, DOMpdf, Maatwebsite Excel, and DigitalOcean deployment.',
    tags:     ['Laravel 13', 'PHP 8.4', 'React 19', 'Inertia.js', 'Tailwind 4', 'PostgreSQL', 'Reverb', 'Sanctum', 'Spatie', 'AWS S3', 'DOMpdf', 'Excel'],
    features: [
      'Real-time updates via Laravel Reverb WebSockets',
      'DigitalOcean deployment with Docker build support',
      'Role & permission system with Spatie Laravel Permission',
      'Barcode & QR code generation and scanning',
      'PDF/Excel export engine with DOMpdf and Maatwebsite Excel',
      'S3-backed file storage with league/flysystem',
      'Full audit trail via Spatie Activity Log',
      'Redis-powered queues, cache & sessions',
    ],
    liveLink: 'https://www.cml.systems/',
    github:   'https://github.com/Bobsi01',
    image:    'images/cml-1.png',
    images:   ['images/cml-1.png', 'images/cml-2.png', 'images/cml-3.png'],
  },
};

var techIcons = {
  'PHP':            { t: 'i',   v: 'devicon-php-plain colored' },
  'PHP 8.2':        { t: 'i',   v: 'devicon-php-plain colored' },
  'PHP 8.4':        { t: 'i',   v: 'devicon-php-plain colored' },
  'PDO':            { t: 'i',   v: 'devicon-php-plain colored' },
  'Python':         { t: 'i',   v: 'devicon-python-plain colored' },
  'PostgreSQL':     { t: 'i',   v: 'devicon-postgresql-plain colored' },
  'Tailwind CSS':   { t: 'i',   v: 'devicon-tailwindcss-plain colored' },
  'Tailwind 4':     { t: 'i',   v: 'devicon-tailwindcss-plain colored' },
  'Chart.js':       { t: 'img', v: 'https://cdn.simpleicons.org/chartdotjs/FF6384' },
  'FPDF':           { t: 'i',   v: 'devicon-php-plain colored' },
  'Heroku':         { t: 'i',   v: 'devicon-heroku-original colored' },
  'React Native':   { t: 'i',   v: 'devicon-react-original colored' },
  'React Web':      { t: 'i',   v: 'devicon-react-original colored' },
  'NativeWind':     { t: 'i',   v: 'devicon-tailwindcss-plain colored' },
  'FastAPI':        { t: 'i',   v: 'devicon-fastapi-plain colored' },
  'ESP32 / C++':    { t: 'i',   v: 'devicon-cplusplus-plain colored' },
  'BLE':            { t: 'img', v: 'https://cdn.simpleicons.org/bluetooth/0082FC' },
  'Firebase':       { t: 'i',   v: 'devicon-firebase-plain colored' },
  'Google Auth':    { t: 'img', v: 'https://cdn.simpleicons.org/google/4285F4' },
  'Brevo SMTP':     { t: 'img', v: 'https://cdn.simpleicons.org/maildotru/005FF9' },
  'Arduino IDE':    { t: 'i',   v: 'devicon-arduino-plain colored' },
  'Arduino CLI':    { t: 'i',   v: 'devicon-arduino-plain colored' },
  'HuggingFace':    { t: 'img', v: 'https://cdn.simpleicons.org/huggingface/FFD21E' },
  'Docker':         { t: 'i',   v: 'devicon-docker-plain colored' },
  'Laravel 11':     { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Laravel 13':     { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Blade':          { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Alpine.js':      { t: 'img', v: 'https://cdn.simpleicons.org/alpinedotjs/8BC0D0' },
  'Turbo':          { t: 'img', v: 'https://cdn.simpleicons.org/turbo/5CD8E5' },
  'Sanctum':        { t: 'i',   v: 'devicon-laravel-plain colored' },
  'React 19':       { t: 'i',   v: 'devicon-react-original colored' },
  'Inertia.js':     { t: 'img', v: 'https://cdn.simpleicons.org/inertia/9553E9' },
  'Redis':          { t: 'i',   v: 'devicon-redis-plain colored' },
  'Vite':           { t: 'i',   v: 'devicon-vitejs-plain colored' },
  'Framer Motion':  { t: 'img', v: 'https://cdn.simpleicons.org/framer/0055FF' },
  'Recharts':       { t: 'i',   v: 'devicon-react-original colored' },
  'AWS S3':         { t: 'i',   v: 'devicon-amazonwebservices-plain colored' },
  'WebSockets':     { t: 'img', v: 'https://cdn.simpleicons.org/socketdotio/010101' },
  'Reverb':         { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Spatie':         { t: 'i',   v: 'devicon-laravel-plain colored' },
  'DOMpdf':         { t: 'i',   v: 'devicon-php-plain colored' },
  'Excel':          { t: 'img', v: 'https://cdn.simpleicons.org/googlesheets/34A853' },
  'JavaScript':     { t: 'i',   v: 'devicon-javascript-plain colored' },
  'p5.js':          { t: 'img', v: 'https://cdn.simpleicons.org/p5dotjs/ED225D' },
  'Canvas API':     { t: 'i',   v: 'devicon-html5-plain colored' },
  'OOP':            { t: 'i',   v: 'devicon-javascript-plain colored' },
  'Game Design':    { t: 'img', v: 'https://cdn.simpleicons.org/unity/222222' },
  'Physics Engine': { t: 'img', v: 'https://cdn.simpleicons.org/nvidia/76B900' },
};

var ICON_SIZE = '14px';
var ICON_STYLE = 'width:' + ICON_SIZE + ';height:' + ICON_SIZE + ';font-size:' + ICON_SIZE + ';' +
                 'line-height:1;flex-shrink:0;display:inline-block;vertical-align:middle;object-fit:contain;';

function makeTechIcon(tag) {
  var ic = techIcons[tag];
  if (!ic) return null;
  if (ic.t === 'i') {
    var el = document.createElement('i');
    el.className = ic.v;
    el.setAttribute('style', ICON_STYLE);
    return el;
  }
  if (ic.t === 'img') {
    var el = document.createElement('img');
    el.src = ic.v;
    el.alt = tag;
    el.className = 'tech-icon';
    el.setAttribute('style', ICON_STYLE);
    el.width = 14;
    el.height = 14;
    return el;
  }
  return null;
}

var modalCloseTimer = null;
var modalTrigger = null;
var modalBackground = [];
var modalScrollY = 0;

function openProjectModal(id, trigger) {
  var data  = projectsData[id];
  if (!data) return;

  if (!document.body.classList.contains('modal-open')) {
    modalTrigger = trigger ? (trigger.matches('button') ? trigger : trigger.querySelector('button')) : document.activeElement;
    modalScrollY = window.scrollY;
  }
  var previewStack = document.getElementById('modal-preview-stack');
  if (previewStack) {
    previewStack.innerHTML = '';
    var shots = (data.images && data.images.length) ? data.images.slice(0, 3) : [data.image];
    while (shots.length < 3) shots.push(shots[shots.length - 1]);

    shots.forEach(function (src, index) {
      var frame = document.createElement('div');
      frame.className = 'modal-preview-shot';

      var img = document.createElement('img');
      img.src = src;
      img.alt = data.title + ' screenshot ' + (index + 1);
      img.loading = 'eager';
      img.decoding = 'async';

      frame.appendChild(img);

      if (data.imageLabels && data.imageLabels[index]) {
        var label = document.createElement('span');
        label.className = 'modal-preview-label';
        label.textContent = data.imageLabels[index];
        frame.appendChild(label);
      }

      previewStack.appendChild(frame);
    });
  }
  document.getElementById('modal-title').textContent = data.title;

  document.getElementById('modal-desc').textContent = data.desc;

  var tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = '';
  data.tags.forEach(function (tag) {
    var s = document.createElement('span');
    s.className = 'modal-tag';
    var icon = makeTechIcon(tag);
    if (icon) s.appendChild(icon);
    s.appendChild(document.createTextNode(tag));
    tagsEl.appendChild(s);
  });

  var featEl = document.getElementById('modal-features');
  featEl.innerHTML = '';
  (data.features || []).forEach(function (feat) {
    var d = document.createElement('div');
    d.className   = 'modal-feature-item';
    d.innerHTML   = '<div class="modal-feature-dot"></div><span>' + feat + '</span>';
    featEl.appendChild(d);
  });

  var liveLink = document.getElementById('modal-live-link');
  if (liveLink) liveLink.href = data.liveLink;

  var modal = document.getElementById('project-modal');
  var card  = document.getElementById('modal-inner');
  if (!modal || !card) return;

  if (modalCloseTimer) {
    clearTimeout(modalCloseTimer);
    modalCloseTimer = null;
  }

  modal.classList.add('is-open');
  modal.offsetWidth;
  modal.classList.add('is-visible');

  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  document.body.style.position = 'fixed';
  document.body.style.top = -modalScrollY + 'px';
  document.body.style.width = '100%';
  if (!modalBackground.length) {
    modalBackground = Array.from(document.body.children).filter(function (el) { return el !== modal && el.tagName !== 'SCRIPT'; })
      .map(function (el) { var state = { el: el, inert: el.inert }; el.inert = true; return state; });
  }
  modal.querySelector('.modal-right-pane').scrollTop = 0;
  modal.querySelector('.modal-close-btn').focus({ preventScroll: true });
}

function closeProjectModal() {
  var modal = document.getElementById('project-modal');
  var card  = document.getElementById('modal-inner');
  if (!modal || !card) return;

  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-visible');
  if (modalCloseTimer) clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(function () {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    modalBackground.forEach(function (state) { state.el.inert = state.inert; }); modalBackground = [];
    window.scrollTo({ top: modalScrollY, behavior: 'instant' });
    if (modalTrigger && modalTrigger.isConnected) modalTrigger.focus({ preventScroll: true });
    modalCloseTimer = null;
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
}

var modalEl = document.getElementById('project-modal');
if (modalEl) {
  modalEl.addEventListener('click', function (e) {
    if (e.target === modalEl) closeProjectModal();
  });
}

document.addEventListener('keydown', function (e) {
  if (!modalEl.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeProjectModal();
  if (e.key === 'Tab') {
    var items = Array.from(modalEl.querySelectorAll('button, a[href]')).filter(function (el) { return el.getClientRects().length && !el.disabled; });
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

window.openProjectModal  = openProjectModal;
window.closeProjectModal = closeProjectModal;
