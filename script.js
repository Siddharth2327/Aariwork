/* ============================================================
   NITHYASHREE AARI WORK — script.js
   Premium interactions, animations, particles
   ============================================================ */

'use strict';

/* ---- Utility ---- */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const loader = qs('#loader');
  if (!loader) return;

  // Simulate asset loading then hide
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startRevealAnimations();
      startHeroCounters();
    }, 1800);
  });

  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.add('cursor-moved');
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx = lerp(fx, mx, 0.1);
    fy = lerp(fy, my, 0.1);
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = 'a, button, .service-card, .collection-card, .gf-btn, .masonry-item, .pricing-card, .faq-q';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.style.transform   = 'translate(-50%, -50%) scale(1.8)';
      follower.style.width     = '60px';
      follower.style.height    = '60px';
      follower.style.opacity   = '0.3';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
      follower.style.width     = '36px';
      follower.style.height    = '36px';
      follower.style.opacity   = '0.5';
    }
  });
})();

/* ============================================================
   3. MOUSE GLOW
   ============================================================ */
(function initMouseGlow() {
  const glow = qs('#mouse-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function animate() {
    gx = lerp(gx, mx, 0.05);
    gy = lerp(gy, my, 0.05);
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   4. PARTICLES CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = qs('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vy = -(0.3 + Math.random() * 0.5);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.size = 0.5 + Math.random() * 1.5;
      this.opacity = 0;
      this.maxOpacity = 0.3 + Math.random() * 0.5;
      this.life = 0;
      this.maxLife = 180 + Math.random() * 240;
      this.color = Math.random() > 0.5 ? '216,181,106' : '139,90,101';
    }
    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      const progress = this.life / this.maxLife;
      if (progress < 0.2)      this.opacity = lerp(0, this.maxOpacity, progress / 0.2);
      else if (progress > 0.8) this.opacity = lerp(this.maxOpacity, 0, (progress - 0.8) / 0.2);
      else                     this.opacity = this.maxOpacity;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife); // stagger start
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   5. NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar = qs('#navbar');
  const toggle = qs('#navToggle');
  const links  = qs('#navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else                       navbar.classList.remove('scrolled');
  }, { passive: true });

  function closeMenu() {
    links.classList.remove('open');
    links.style.top = '';
    navbar.classList.remove('menu-open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  function openMenu() {
    // Measure the navbar's actual rendered height at this moment
    // (differs when scrolled because padding shrinks)
    const navH = navbar.getBoundingClientRect().height;
    links.style.top = navH + 'px';
    links.classList.add('open');
    navbar.classList.add('menu-open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (links.classList.contains('open')) closeMenu();
      else openMenu();
    });
  }

  // Close on link click
  qsa('.nav-links a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });

  // Active section highlight
  const sections = qsa('section[id]');
  const navAs = qsa('.nav-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => a.classList.remove('active'));
        const active = qsa(`.nav-links a[href="#${entry.target.id}"]`);
        active.forEach(a => a.classList.add('active'));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
function startRevealAnimations() {
  const reveals = qsa('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
        // Trigger counter if applicable
        const nums = entry.target.querySelectorAll('.stat-num[data-count]');
        nums.forEach(animateCounter);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================================
   7. HERO COUNTER BADGES (on page load)
   ============================================================ */
function startHeroCounters() {
  const badges = qsa('.badge-num[data-count]');
  badges.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    animateCounter(el, target);
  });
}

function animateCounter(el, overrideTarget) {
  const target   = overrideTarget !== undefined ? overrideTarget : parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const start    = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.floor(easeOut(progress) * target);
    // Format with commas if large
    el.textContent = value >= 1000 ? value.toLocaleString('en-IN') : value;
    if (progress < 1) requestAnimationFrame(step);
    else {
      el.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target;
      if (suffix) el.textContent += suffix;
    }
  }
  requestAnimationFrame(step);
}

/* ============================================================
   8. STAT COUNTERS (stats section)
   ============================================================ */
(function initStatCounters() {
  const statNums = qsa('.stat-num[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2200;
        const start = performance.now();
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const value    = Math.floor(easeOut(progress) * target);
          el.textContent = (value >= 1000 ? value.toLocaleString('en-IN') : value) + (progress === 1 ? suffix : '');
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
})();

/* ============================================================
   9. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  const items = qsa('.faq-item');
  items.forEach(item => {
    const btn = qs('.faq-q', item);
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ============================================================
   10. GALLERY FILTERS
   ============================================================ */
(function initGallery() {
  const buttons = qsa('.gf-btn');
  const items   = qsa('.masonry-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'opacity 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Lightbox
  const lightbox = qs('#lightbox');
  const lbContent = qs('.lightbox-content');
  const lbClose   = qs('.lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gp-label');
      lbContent.innerHTML = `
        <div style="text-align:center; padding:40px;">
          <div style="font-size:5rem; color:var(--gold); opacity:0.6; margin-bottom:20px;">${item.querySelector('.gp-art')?.textContent || '◈'}</div>
          <p style="font-style:italic; color:var(--gold); font-size:1.1rem;">${label?.textContent || 'Gallery Image'}</p>
          <p style="color:var(--text-muted); margin-top:12px; font-size:0.85rem;">Image placeholder — replace with actual photography</p>
        </div>
      `;
      lightbox.classList.add('active');
    });
  });

  if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  qs('.lightbox-bg')?.addEventListener('click', () => lightbox.classList.remove('active'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
})();

/* ============================================================
   11. PROCESS LINE ANIMATION (SVG draw)
   ============================================================ */
(function initProcessLine() {
  const line = qs('#process-svg-line');
  if (!line) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s';
        line.style.strokeDashoffset = '0';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(line.closest('.process-track') || line);
})();

/* ============================================================
   12. CTA CANVAS — Golden thread lines
   ============================================================ */
(function initCTACanvas() {
  const canvas = qs('#cta-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const lines = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class ThreadLine {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * W;
      this.y      = H + 20;
      this.angle  = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      this.speed  = 0.4 + Math.random() * 0.6;
      this.len    = 60 + Math.random() * 120;
      this.width  = 0.5 + Math.random() * 1;
      this.opacity = 0.15 + Math.random() * 0.35;
      this.life   = 0;
      this.maxLife = H / this.speed + 100;
      this.wave   = (Math.random() - 0.5) * 0.01;
    }
    update() {
      this.x += Math.cos(this.angle + Math.sin(this.life * 0.02) * 0.3) * this.speed;
      this.y -= this.speed;
      this.life++;
      if (this.y < -this.len) this.reset();
    }
    draw() {
      const alpha = this.opacity * Math.min(1, (H - this.y) / 100);
      ctx.save();
      ctx.strokeStyle = `rgba(216,181,106,${alpha})`;
      ctx.lineWidth   = this.width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(this.angle) * this.len,
        this.y + Math.sin(this.angle) * this.len
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < 30; i++) {
    const l = new ThreadLine();
    l.y = Math.random() * H; // stagger
    lines.push(l);
  }

  let running = false;
  const observer = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
    if (running) loop();
  });
  observer.observe(canvas);

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    lines.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(loop);
  }
})();

/* ============================================================
   13. CONTACT FORM SUBMIT (demo)
   ============================================================ */
(function initForm() {
  const btn = qs('#submitBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name    = qs('#name')?.value.trim();
    const phone   = qs('#phone')?.value.trim();
    const service = qs('#service')?.value;

    if (!name || !phone) {
      btn.textContent = 'Please fill name & phone';
      btn.style.background = 'var(--rose)';
      setTimeout(() => {
        btn.textContent = 'Send Enquiry';
        btn.style.background = '';
      }, 2000);
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Enquiry Sent!';
      btn.style.background = '#25D366';
      setTimeout(() => {
        btn.textContent = 'Send Enquiry';
        btn.style.background = '';
        btn.disabled = false;
        // Clear form
        ['name','phone','message'].forEach(id => {
          const el = qs('#'+id);
          if (el) el.value = '';
        });
        if (qs('#service')) qs('#service').value = '';
      }, 3000);
    }, 1200);
  });
})();

/* ============================================================
   14. SMOOTH SCROLL OFFSET (for fixed nav)
   ============================================================ */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   15. PARALLAX (hero pattern subtle shift)
   ============================================================ */
(function initParallax() {
  const pattern = qs('.hero-pattern');
  const heroIll = qs('.hero-illustration');
  if (!pattern) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (pattern) pattern.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (heroIll) heroIll.style.transform  = `translateY(${scrollY * 0.08}px)`;
  }, { passive: true });
})();

/* ============================================================
   16. HERO HEADLINE LETTER ANIMATION
   ============================================================ */
(function initHeroType() {
  // Wait for loader to hide, then animate headline lines
  const lines = qsa('.hero-headline-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(30px)';
    line.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${1.8 + i * 0.15}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${1.8 + i * 0.15}s`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 50);
  });

  // Hero text elements
  const heroEls = qsa('.hero-eyebrow, .hero-sub, .hero-cta, .hero-badges');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${2.2 + i * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${2.2 + i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
})();

/* ============================================================
   17. BENTO GRID — stagger hover shimmer
   ============================================================ */
(function initBentoShimmer() {
  const cards = qsa('.bento-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });
})();

/* ============================================================
   18. TIMELINE — animate items on scroll
   ============================================================ */
(function initTimeline() {
  const items = qsa('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    observer.observe(item);
  });
})();

/* ============================================================
   19. SCROLL TO TOP on logo click
   ============================================================ */
(function () {
  const logos = qsa('.nav-logo');
  logos.forEach(l => {
    l.addEventListener('click', (e) => {
      if (l.getAttribute('href') === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   20. PROCESS STEPS — cascade reveal
   ============================================================ */
(function initProcessSteps() {
  const steps = qsa('.process-step');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      steps.forEach((step, i) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(24px)';
        step.style.transition = `opacity 0.7s ease ${i * 0.1 + 0.3}s, transform 0.7s ease ${i * 0.1 + 0.3}s`;
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, i * 100 + 400);
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  const track = qs('.process-track');
  if (track) observer.observe(track);
})();

/* ============================================================
   INIT: ensure reveal fires even if loader already done
   ============================================================ */
if (document.readyState === 'complete') {
  setTimeout(() => { startRevealAnimations(); startHeroCounters(); }, 100);
}

/* ============================================================
   21. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   22. HERO SCROLL INDICATOR — fade on scroll
   ============================================================ */
(function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
})();

/* ============================================================
   23. BENTO CARDS — individual stagger via IntersectionObserver
   ============================================================ */
(function initBentoReveal() {
  const grid  = document.querySelector('.bento-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.bento-card')];

  // Start hidden (CSS sets opacity 0 already)
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.transitionDelay = `${i * 0.07}s`;
          card.classList.add('revealed');
        }, i * 0);           // delay handled by setTimeout
      });
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(grid);
})();

/* ============================================================
   24. COLLECTIONS GRID — hover tilt micro-interaction
   ============================================================ */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.collection-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   25. MASONRY GALLERY — lazy-load placeholder colour cycle
   ============================================================ */
(function initGalleryHints() {
  // Add a subtle shimmering loading state to each gallery item
  const items = document.querySelectorAll('.gallery-placeholder');
  items.forEach((item, i) => {
    item.style.animation = `none`;
    // Once intersecting, trigger a short shine sweep
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.6s ease';
          entry.target.style.opacity    = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    item.style.opacity = '0.6';
    observer.observe(item);
  });
})();

/* ============================================================
   26. MARQUEE — pause / resume on reduced-motion preference
   ============================================================ */
(function initMarqueePref() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const track = document.querySelector('.marquee-track');
    if (track) track.style.animation = 'none';
  }
})();

/* ============================================================
   27. SERVICE CARDS — sequential entrance on section scroll
   ============================================================ */
(function initServiceReveal() {
  const section = document.querySelector('.services');
  if (!section) return;
  const cards   = [...section.querySelectorAll('.service-card')];

  // Reset so data-reveal doesn't double-fire
  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(28px)';
  });

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.transition = `opacity 0.65s var(--ease-luxury), transform 0.65s var(--ease-luxury)`;
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, i * 80);
      });
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(section);
})();

/* ============================================================
   28. COLLECTION CARDS — entrance animation
   ============================================================ */
(function initCollectionReveal() {
  const cards = document.querySelectorAll('.collection-card');
  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(32px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = [...cards].indexOf(card);
        setTimeout(() => {
          card.style.transition = `opacity 0.75s var(--ease-luxury), transform 0.75s var(--ease-luxury)`;
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, index * 100);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
})();

/* ============================================================
   29. PRICING CARDS — entrance
   ============================================================ */
(function initPricingReveal() {
  const cards = document.querySelectorAll('.pricing-card');
  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(28px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = [...cards].indexOf(card);
        setTimeout(() => {
          card.style.transition = `opacity 0.7s var(--ease-luxury) ${index * 0.1}s, transform 0.7s var(--ease-luxury) ${index * 0.1}s`;
          card.style.opacity    = '1';
          card.style.transform  = card.classList.contains('featured-pc') ? 'scale(1.02) translateY(0)' : 'translateY(0)';
        }, index * 80);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
})();

/* ============================================================
   30. HERO SVG — add extra floating micro-dots
   ============================================================ */
(function initHeroMicroDots() {
  const svg = document.querySelector('#hero-svg');
  if (!svg || window.matchMedia('(pointer: coarse)').matches) return;

  // Already in SVG; animate all float-particle dots
  const dots = svg.querySelectorAll('.float-particle');
  dots.forEach((dot, i) => {
    dot.style.animationName     = 'floatParticle';
    dot.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    dot.style.animationTimingFunction = 'ease-in-out';
    dot.style.animationIterationCount = 'infinite';
    dot.style.animationDirection      = 'alternate';
    dot.style.animationDelay         = `${i * 0.3}s`;
  });
})();

/* ============================================================
   31. KEYBOARD ACCESSIBILITY — FAQ
   ============================================================ */
(function initFAQA11y() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', (!expanded).toString());
    });
  });
})();

/* ============================================================
   32. PRINT STYLES — basic contact info only
   ============================================================ */
(function injectPrintStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      #loader, #cursor, #cursor-follower, #mouse-glow, #particles-canvas,
      #scroll-progress, .hero-illustration, .marquee-wrap, .gallery,
      .testimonials, .cta-section, .nav-toggle, .btn-enquire { display: none !important; }
      body { background: #fff; color: #000; }
      .hero { min-height: auto; background: none; padding: 20px 0; }
      .hero-headline { color: #000; }
      .section-title { color: #000; }
      .contact-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   33. HEADER scroll-spy — smooth highlight transition
   ============================================================ */
(function initScrollSpy() {
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (!sections.length || !navLinks.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollMid = window.scrollY + window.innerHeight * 0.4;
        let active = sections[0];
        sections.forEach(sec => { if (sec.offsetTop <= scrollMid) active = sec; });
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   34. TESTIMONIAL ROWS — touch-scroll support (pause anim while touching)
   ============================================================ */
(function initTestimonialTouch() {
  document.querySelectorAll('.t-row').forEach(row => {
    row.addEventListener('touchstart', () => { row.style.animationPlayState = 'paused'; }, { passive: true });
    row.addEventListener('touchend',   () => { row.style.animationPlayState = 'running'; }, { passive: true });
  });
})();

/* ============================================================
   35. FINAL: ensure [data-reveal] elements above fold are shown
   ============================================================ */
(function revealAboveFold() {
  // Called after loader hides; make sure visible-on-load elements are revealed
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }, 2000);
})();