(function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================
     Theme toggle
     ======================================================== */

  var toggle = document.getElementById('theme-toggle');
  var root = document.documentElement;

  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }

  toggle.addEventListener('click', function () {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });


  /* ========================================================
     Cursor glow (desktop only, respects reduced motion)
     ======================================================== */

  var glow = document.getElementById('cursor-spotlight');

  if (glow && !prefersReducedMotion && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      if (!glow.classList.contains('visible')) glow.classList.add('visible');
    });

    document.addEventListener('mouseleave', function () {
      glow.classList.remove('visible');
    });
  }


  /* ========================================================
     Hero particles (subtle floating dots)
     ======================================================== */

  var canvas = document.getElementById('hero-particles');

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;

    function resizeCanvas() {
      var hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
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

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', function () { resizeCanvas(); initParticles(); });
  }


  /* ========================================================
     Hero blob parallax (moves blobs with the mouse)
     ======================================================== */

  var heroSection = document.getElementById('hero');
  var blobs = document.querySelectorAll('.ambient-orb');

  if (heroSection && blobs.length && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width - 0.5;
      var cy = (e.clientY - rect.top) / rect.height - 0.5;

      blobs[0].style.transform = 'translate(' + (cx * 30) + 'px, ' + (cy * 25) + 'px)';
      if (blobs[1]) {
        blobs[1].style.transform = 'translate(' + (cx * -20) + 'px, ' + (cy * -30) + 'px)';
      }
    });
  }


  /* ========================================================
     Typing effect for hero subtitle
     ======================================================== */

  var typingEl = document.getElementById('hero-typed');

  if (typingEl && !prefersReducedMotion) {
    var phrases = [
      'Full-Stack Developer',
      'IoT Systems Builder',
      'CS Student & Maker',
      'Clean Code Advocate',
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var TYPING_SPEED = 80;
    var DELETE_SPEED = 40;
    var PAUSE_END = 2200;
    var PAUSE_START = 400;

    function typeLoop() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, PAUSE_END);
          return;
        }
        setTimeout(typeLoop, TYPING_SPEED);
      } else {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, PAUSE_START);
          return;
        }
        setTimeout(typeLoop, DELETE_SPEED);
      }
    }

    setTimeout(typeLoop, 900);
  } else if (typingEl) {
    typingEl.textContent = 'Full-Stack Developer';
  }


  /* ========================================================
     Scroll reveal (IntersectionObserver)
     ======================================================== */

  var reveals = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }


  /* ========================================================
     Skill pill staggered entrance
     ======================================================== */

  var skillSections = document.querySelectorAll('[data-skill-group]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var pillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var pills = entry.target.querySelectorAll('.skill-tag-reveal');
        pills.forEach(function (pill, i) {
          setTimeout(function () {
            pill.classList.add('is-visible');
          }, i * 60);
        });
        pillObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    skillSections.forEach(function (el) { pillObserver.observe(el); });
  } else {
    document.querySelectorAll('.skill-tag-reveal').forEach(function (p) {
      p.classList.add('is-visible');
    });
  }

  /* ========================================================
     3D tilt effect on project cards
     ======================================================== */

  var tiltCards = document.querySelectorAll('.project-card');

  if (!prefersReducedMotion) {
    tiltCards.forEach(function (card) {
      var inner = card.querySelector('.project-card-body');
      var shine = card.querySelector('.card-glare');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotateX = ((y - cy) / cy) * -6;
        var rotateY = ((x - cx) / cx) * 6;

        if (inner) {
          inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        }
        if (shine) {
          shine.style.setProperty('--shine-x', ((x / rect.width) * 100) + '%');
          shine.style.setProperty('--shine-y', ((y / rect.height) * 100) + '%');
        }
      });

      card.addEventListener('mouseleave', function () {
        if (inner) inner.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }


  /* ========================================================
     Section dot navigation (active tracking)
     ======================================================== */

  var dotLinks   = document.querySelectorAll('.side-nav a');
  var floatLinks  = document.querySelectorAll('.floating-nav .nav-link');
  var sections = [];

  dotLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link: link });
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (match) {
          if (entry.isIntersecting) {
            dotLinks.forEach(function (d) { d.classList.remove('active'); });
            match.link.classList.add('active');

            // Keep floating nav in sync
            var href = match.link.getAttribute('href');
            floatLinks.forEach(function (fl) {
              fl.classList.toggle('active', fl.getAttribute('href') === href);
            });
          }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s.el); });
  }


  /* ========================================================
     (Contact form removed — icons only)
     ======================================================== */

})();
