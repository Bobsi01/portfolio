/* ================================================================
   Portfolio Script — clean, deduped, with working project modal
   ================================================================ */

(function () {

  /* ── Reduced motion preference ──────────────────────────────── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle ───────────────────────────────────────────── */
  var toggle = document.getElementById('theme-toggle');
  var root   = document.documentElement;

  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* ── Cursor glow (desktop only) ─────────────────────────────── */
  var glow = document.getElementById('cursor-spotlight');
  if (glow && !prefersReducedMotion && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
      if (!glow.classList.contains('visible')) glow.classList.add('visible');
    });
    document.addEventListener('mouseleave', function () {
      glow.classList.remove('visible');
    });
  }

  /* ── Hero particles ─────────────────────────────────────────── */
  var canvas = document.getElementById('hero-particles');
  if (canvas && !prefersReducedMotion) {
    var ctx       = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;

    function resizeCanvas() {
      var hero = canvas.parentElement;
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      };
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height)  p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', function () { resizeCanvas(); initParticles(); });
  }

  /* ── Hero blob parallax ─────────────────────────────────────── */
  var heroSection = document.getElementById('hero');
  var blobs = document.querySelectorAll('.ambient-orb');
  if (heroSection && blobs.length && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width  - 0.5;
      var cy = (e.clientY - rect.top)  / rect.height - 0.5;
      blobs[0].style.transform = 'translate(' + (cx * 30) + 'px,' + (cy * 25) + 'px)';
      if (blobs[1]) blobs[1].style.transform = 'translate(' + (cx * -20) + 'px,' + (cy * -30) + 'px)';
    });
  }

  /* ── Typing effect ──────────────────────────────────────────── */
  var typingEl = document.getElementById('hero-typed');
  if (typingEl && !prefersReducedMotion) {
    var phrases     = ['Full-Stack Developer','IoT Systems Builder','CS Student & Maker','Clean Code Advocate'];
    var phraseIndex = 0;
    var charIndex   = 0;
    var deleting    = false;

    function typeLoop() {
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

  /* ── Scroll reveal ──────────────────────────────────────────── */
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

  /* ── Skill pill staggered entrance ─────────────────────────── */
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

  /* ── 3-D card tilt ──────────────────────────────────────────── */
  var tiltCards = document.querySelectorAll('.project-card');
  if (!prefersReducedMotion) {
    tiltCards.forEach(function (card) {
      var inner = card.querySelector('.project-card-body');
      var shine = card.querySelector('.card-glare');
      card.addEventListener('mousemove', function (e) {
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

  /* ── Section dot + floating nav (active tracking) ───────────── */
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

})(); /* ── end IIFE ── */


/* ================================================================
   PROJECT MODAL
   ================================================================ */

var projectsData = {
  hrms: {
    title:    'HRIS — HR Management System',
    type:     'Enterprise Platform',
    desc:     'A production-grade modular HR platform with 19 fully functional modules. Built to handle real organizational workflows — payroll computation, attendance tracking, recruitment pipelines, inventory management — all with position-based access control.',
    tags:     ['PHP', 'PostgreSQL', 'Tailwind CSS', 'Chart.js', 'FPDF', 'Heroku'],
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
    desc:     'A full-stack smart agriculture platform across 3 repos. ESP32 firmware reads a 7-in-1 soil sensor via RS485 Modbus, synced to a FastAPI backend and a React Native app with BLE pairing, AI growth prediction, and gamification.',
    tags:     ['React Native', 'FastAPI', 'ESP32 / C++', 'PostgreSQL', 'BLE', 'Firebase', 'HuggingFace'],
    features: [
      'BLE device pairing for ESP32 soil sensor',
      'Real-time NPK, pH, moisture & temperature readings',
      'AI growth prediction via HuggingFace inference',
      'Plant health scoring & gamification system',
      'FastAPI backend with 20+ API routers on Heroku',
      'Firebase push notifications & authentication',
    ],
    liveLink: 'https://www.agrisos.app/',
    github:   'https://github.com/Bobsi01',
    image:    'images/agrisos-live.png',
    images:   ['images/agrisos-live.png', 'images/agrisos-2.png', 'images/agrisos-3.png'],
  },
  records: {
    title:    'Student Record Management',
    type:     'Web Application',
    desc:     'Laravel 11 university records system (Ourchive) with application-based registration, proof verification by Admin/Officer, and encrypted file storage. SPA navigation via Hotwire Turbo with rigorous access-control layers.',
    tags:     ['Laravel 11', 'Blade', 'Alpine.js', 'PostgreSQL', 'Tailwind CSS', 'Sanctum'],
    features: [
      'Application-based registration with document verification',
      'Collections & submissions workflow engine',
      'Alumni tracking & record retrieval portal',
      'OTP password reset via Brevo SMTP',
      'Encrypted file storage using PostgreSQL BYTEA',
      'Hotwire Turbo SPA navigation & activity log',
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
    desc:     'A scalable, containerized full-stack management platform built with Laravel 13 and React 19 via Inertia.js. Handles employee management, logistics, and warehouse operations. Features real-time WebSocket updates (Laravel Reverb), role-based access (Spatie), barcode/QR scanning, S3 file storage, PDF/Excel exports, and is Dockerized for consistent deployments on DigitalOcean.',
    tags:     ['Laravel 13', 'React 19', 'Inertia.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS S3', 'Reverb', 'DOMpdf'],
    features: [
      'Real-time updates via Laravel Reverb WebSockets',
      'Dockerized with multi-stage builds for DigitalOcean deployment',
      'Role & permission system with Spatie Laravel Permission',
      'Barcode & QR code generation and scanning',
      'PDF/Excel export engine (DOMpdf + Maatwebsite Excel)',
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

/* ── Tech-icon lookup (devicon class or simpleicons img URL) ── */
var techIcons = {
  'PHP':            { t: 'i',   v: 'devicon-php-plain colored' },
  'PostgreSQL':     { t: 'i',   v: 'devicon-postgresql-plain colored' },
  'Tailwind CSS':   { t: 'i',   v: 'devicon-tailwindcss-plain colored' },
  'Chart.js':       { t: 'img', v: 'https://cdn.simpleicons.org/chartdotjs/FF6384' },
  'FPDF':           { t: 'i',   v: 'devicon-php-plain colored' },
  'Heroku':         { t: 'i',   v: 'devicon-heroku-original colored' },
  'React Native':   { t: 'i',   v: 'devicon-react-original colored' },
  'FastAPI':        { t: 'i',   v: 'devicon-fastapi-plain colored' },
  'ESP32 / C++':    { t: 'i',   v: 'devicon-cplusplus-plain colored' },
  'BLE':            { t: 'img', v: 'https://cdn.simpleicons.org/bluetooth/0082FC' },
  'Firebase':       { t: 'i',   v: 'devicon-firebase-plain colored' },
  'HuggingFace':    { t: 'img', v: 'https://cdn.simpleicons.org/huggingface/FFD21E' },
  'Docker':         { t: 'i',   v: 'devicon-docker-plain colored' },
  'Laravel 11':     { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Laravel 13':     { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Blade':          { t: 'i',   v: 'devicon-laravel-plain colored' },
  'Alpine.js':      { t: 'img', v: 'https://cdn.simpleicons.org/alpinedotjs/8BC0D0' },
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
  'JavaScript':     { t: 'i',   v: 'devicon-javascript-plain colored' },
  'p5.js':          { t: 'img', v: 'https://cdn.simpleicons.org/p5dotjs/ED225D' },
  'Canvas API':     { t: 'i',   v: 'devicon-html5-plain colored' },
  'OOP':            { t: 'i',   v: 'devicon-javascript-plain colored' },
  'Game Design':    { t: 'img', v: 'https://cdn.simpleicons.org/unity/222222' },
  'Physics Engine': { t: 'img', v: 'https://cdn.simpleicons.org/nvidia/76B900' },
  'Sanctum':        { t: 'i',   v: 'devicon-laravel-plain colored' },
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

function openProjectModal(id) {
  var data  = projectsData[id];
  if (!data) return;

  /* ── LEFT pane ── */
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

  /* Right pane */
  document.getElementById('modal-desc').textContent = data.desc;

  /* tech-stack tags */
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

  /* key features */
  var featEl = document.getElementById('modal-features');
  featEl.innerHTML = '';
  (data.features || []).forEach(function (feat) {
    var d = document.createElement('div');
    d.className   = 'modal-feature-item';
    d.innerHTML   = '<div class="modal-feature-dot"></div><span>' + feat + '</span>';
    featEl.appendChild(d);
  });

  /* CTAs */
  var liveLink = document.getElementById('modal-live-link');
  if (liveLink) liveLink.href = data.liveLink;

  /* ── show ── */
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
}

function closeProjectModal() {
  var modal = document.getElementById('project-modal');
  var card  = document.getElementById('modal-inner');
  if (!modal || !card) return;

  modal.classList.remove('is-visible');
  if (modalCloseTimer) clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(function () {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    modalCloseTimer = null;
  }, 360);
}

/* close on backdrop click */
var modalEl = document.getElementById('project-modal');
if (modalEl) {
  modalEl.addEventListener('click', function (e) {
    if (e.target === modalEl) closeProjectModal();
  });
}

/* close on Escape */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeProjectModal();
});

/* expose to onclick attributes */
window.openProjectModal  = openProjectModal;
window.closeProjectModal = closeProjectModal;
