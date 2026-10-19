/**
 * MARIO ALMONTE — V2 CINEMATIC WOWFACTOR ENGINE
 * Features: Lenis + GSAP ScrollTrigger Pinned Horizontal Scroller (R5)
 * Apple Reading Highlight (R2) + Hero Multi-Layer Depth Parallax (R4)
 * Living Golden Embers Canvas + Raycast Glow Borders + Magnetic Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Lenis Smooth Scroll & GSAP Sync
  initLenisAndGSAP();

  // 3. Living Golden Embers & Honeycomb Canvas
  initLivingCanvas();

  // 4. Custom Dual Cursor & Magnetic Elements
  initCursorAndMagnetics();

  // 5. Hero Cinematic Multi-Plane Parallax
  initHeroCinematicParallax();

  // 6. Signature Moment: Pinned Horizontal Timeline Scroller (Recipe R5)
  initPinnedHorizontalTimeline();

  // 7. Apple-style Reading Highlight Line-by-Line (Recipe R2)
  initReadingHighlight();

  // 8. Telemetry HUD Scene Progress
  initTelemetryHUD();

  // 9. Web Audio API Haptics
  initWebAudioHaptics();

  // 10. Raycast Glow Cards Border Effect
  initRaycastGlowCards();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL & GSAP SYNC (Recipe R1)
   ========================================================================== */
let lenis;
function initLenisAndGSAP() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Smart Auto-Hiding Capsule Header (Emil Kowalski dynamic hide on scroll down, reveal on scroll up)
    const header = document.getElementById('siteHeader');
    let lastScrollY = 0;
    const scrollThreshold = 10;

    lenis.on('scroll', (e) => {
      const currentScrollY = e.scroll;

      // Add scrolled glass style after 50px
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Smart hide / show
      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY && currentScrollY > 160) {
          // Scrolling DOWN -> tuck header away smoothly
          header.classList.add('header-hidden');
          header.classList.remove('header-visible');
        } else {
          // Scrolling UP -> reveal floating header immediately
          header.classList.remove('header-hidden');
          header.classList.add('header-visible');
        }
        lastScrollY = currentScrollY;
      }
    });

    // Anchor Link Smooth Navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = anchor.getAttribute('href');
        if (target && target !== '#') {
          e.preventDefault();
          if (header) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
          }
          lenis.scrollTo(target, { offset: -20, duration: 1.5 });
        }
      });
    });
  }
}

/* ==========================================================================
   2. LIVING GOLDEN EMBERS & AMBIENT CANVAS
   Warm Caribbean golden embers floating softly upwards in the dark
   ========================================================================== */
function initLivingCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  // Embers Particles
  const numParticles = 65;
  const particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.6 + 0.25,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.45 + 0.15,
      hue: Math.random() > 0.4 ? 'rgba(255, 122, 26, ' : 'rgba(229, 178, 99, ',
      phase: Math.random() * Math.PI * 2,
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(p.phase) * 0.3;
      p.phase += 0.02;

      // Wrap around
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Mouse interactive push
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue + p.opacity + ')';
      ctx.shadowColor = 'rgba(255, 122, 26, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   3. DUAL CUSTOM CURSOR & MAGNETIC PHYSICS
   ========================================================================== */
function initCursorAndMagnetics() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function lerpCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .action-path-box, .h-card-inner, .glow-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });

  // GSAP Magnetic Elements
  if (window.gsap) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      const my = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) * 0.35;
        const relY = (e.clientY - rect.top - rect.height / 2) * 0.35;
        mx(relX);
        my(relY);
      });

      el.addEventListener('mouseleave', () => {
        mx(0);
        my(0);
      });
    });
  }
}

/* ==========================================================================
   4. HERO CINEMATIC MULTI-PLANE PARALLAX (Recipe R4)
   ========================================================================== */
function initHeroCinematicParallax() {
  const photo = document.getElementById('heroImgPhoto');
  const textWrap = document.getElementById('heroTextWrapper');

  // Subtle interactive cursor drift on full-bleed photo
  if (photo && window.innerWidth >= 1024) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      photo.style.transform = `scale(1.05) translate3d(${dx * -14}px, ${dy * -10}px, 0)`;
    });
  }

  // Scroll Parallax Scrub
  if (window.gsap && window.ScrollTrigger) {
    if (photo) {
      gsap.to(photo, {
        scale: 1.18,
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    if (textWrap) {
      gsap.to(textWrap, {
        y: -40,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  }
}

/* ==========================================================================
   5. SIGNATURE MOMENT: PINNED HORIZONTAL TIMELINE SCROLLER (Recipe R5)
   Locks the screen and scrolls the 4 eras horizontally with velocity!
   ========================================================================== */
function initPinnedHorizontalTimeline() {
  const section = document.querySelector('.h-timeline-section');
  const track = document.getElementById('hTimelineTrack');
  const wrap = document.getElementById('hTimelineWrap');
  const prevBtn = document.getElementById('timelinePrevBtn');
  const nextBtn = document.getElementById('timelineNextBtn');
  const counterEl = document.getElementById('timelineCurrentSlide');

  if (!section || !track) return;

  const slides = track.querySelectorAll('.h-timeline-slide');
  const totalSlides = slides.length;

  // Mobile counter & arrows update
  const updateMobileNavigation = () => {
    if (window.innerWidth >= 900) return;
    const scrollLeft = track.scrollLeft;
    const slideWidth = slides[0] ? slides[0].offsetWidth : window.innerWidth * 0.86;
    const gap = 20; // 1.25rem
    const activeIndex = Math.min(
      totalSlides,
      Math.max(1, Math.round(scrollLeft / (slideWidth + gap)) + 1)
    );

    if (counterEl) {
      counterEl.textContent = String(activeIndex).padStart(2, '0');
    }
    if (prevBtn) {
      prevBtn.style.opacity = activeIndex === 1 ? '0.35' : '1';
      prevBtn.style.pointerEvents = activeIndex === 1 ? 'none' : 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = activeIndex === totalSlides ? '0.35' : '1';
      nextBtn.style.pointerEvents = activeIndex === totalSlides ? 'none' : 'auto';
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const slideWidth = slides[0] ? slides[0].offsetWidth + 20 : 360;
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      if (soundEnabled && audioCtx) playTone(540, 'sine', 0.05, 0.02);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const slideWidth = slides[0] ? slides[0].offsetWidth + 20 : 360;
      track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      if (soundEnabled && audioCtx) playTone(680, 'sine', 0.05, 0.02);
    });
  }

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateMobileNavigation);
  }, { passive: true });

  updateMobileNavigation();

  if (!window.gsap || !window.ScrollTrigger) return;

  // Only enable pinned horizontal scroll on desktop/tablet width (> 900px)
  ScrollTrigger.matchMedia({
    '(min-width: 900px)': function () {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth * 1.05}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Individual slide inner card parallax depth
      gsap.utils.toArray('.h-card-inner').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.94, opacity: 0.75 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 90%',
              end: 'center center',
              scrub: true,
            },
          }
        );
      });
    },
    '(max-width: 899px)': function () {
      if (wrap) {
        wrap.style.height = 'auto';
        wrap.style.overflow = 'visible';
      }
      track.style.height = 'auto';
    },
  });
}

/* ==========================================================================
   6. APPLE-STYLE READING HIGHLIGHT (Recipe R2)
   Lines light up with a golden glow as you scroll through
   ========================================================================== */
function initReadingHighlight() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const lines = document.querySelectorAll('.scrub-line');
  lines.forEach((line) => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 75%',
      end: 'bottom 40%',
      onEnter: () => line.classList.add('active'),
      onLeaveBack: () => line.classList.remove('active'),
    });
  });
}

/* ==========================================================================
   7. TELEMETRY HUD SCENE PROGRESS
   ========================================================================== */
function initTelemetryHUD() {
  const sceneCounter = document.getElementById('currentSceneIndex');
  const thumb = document.getElementById('telemetryThumb');
  const scenes = document.querySelectorAll('[data-scene]');

  const updateHUD = () => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? Math.min(1, Math.max(0, scrollY / totalScroll)) : 0;

    if (thumb) {
      thumb.style.transform = `translateY(${progress * 67}px)`;
    }

    let currentIdx = 1;
    scenes.forEach((s) => {
      const rect = s.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.1) {
        currentIdx = s.getAttribute('data-scene') || currentIdx;
      }
    });

    if (sceneCounter) {
      sceneCounter.textContent = String(currentIdx).padStart(2, '0');
    }
  };

  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', updateHUD);
  } else {
    window.addEventListener('scroll', updateHUD, { passive: true });
  }
}

/* ==========================================================================
   8. WEB AUDIO API HAPTICS
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initWebAudioHaptics() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('active', soundEnabled);

    if (soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      playTone(520, 'sine', 0.15, 0.08);
    }
  });

  const triggers = document.querySelectorAll('.btn-magnetic, .action-path-box, .h-card-inner');
  triggers.forEach((t) => {
    t.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) {
        playTone(400, 'sine', 0.04, 0.02);
      }
    });
    t.addEventListener('click', () => {
      if (soundEnabled && audioCtx) {
        playTone(660, 'triangle', 0.1, 0.04);
      }
    });
  });
}

function playTone(freq, type, duration, gainVal) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context error ignore
  }
}

/* ==========================================================================
   9. RAYCAST GLOW BORDER ON CARDS
   ========================================================================== */
function initRaycastGlowCards() {
  const cards = document.querySelectorAll('.glow-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   10. LEAD MODAL & WHATSAPP GENERATOR
   ========================================================================== */
window.openLeadModalMario = function(intent) {
  const modal = document.getElementById('leadModalMario');
  const select = document.getElementById('marioLeadIntent');
  const title = document.getElementById('modalMarioTitle');
  const sub = document.getElementById('modalMarioSub');

  if (modal) {
    modal.classList.add('open');
    if (select && intent) select.value = intent;

    if (intent === 'comprar') {
      title.textContent = 'Quiero Comprar o Invertir en RD';
      sub.textContent = 'Evaluemos juntos las mejores opciones inmobiliarias del país.';
    } else if (intent === 'vender') {
      title.textContent = 'Quiero Vender Mi Propiedad';
      sub.textContent = 'Diseñemos un plan de marketing y exposición estratégica para tu inmueble.';
    } else if (intent === 'crecer') {
      title.textContent = 'Quiero Crecer en Bienes Raíces';
      sub.textContent = 'Conversemos sobre cómo acelerar tu carrera dentro de la industria.';
    }
  }
};

window.closeLeadModalMario = function() {
  const modal = document.getElementById('leadModalMario');
  if (modal) modal.classList.remove('open');
};

/* ==========================================================================
   MODERN MINIMALIST EXECUTIVE OVERLAY MENU (Awwwards / Swiss Navigation)
   ========================================================================== */
window.toggleExecutiveMenu = function() {
  const overlay = document.getElementById('navOverlay');
  if (!overlay) return;
  const isOpen = overlay.classList.contains('open');

  if (isOpen) {
    overlay.classList.remove('open');
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.start();
    }
    document.body.style.overflow = '';
  } else {
    overlay.classList.add('open');
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.stop();
    }
    document.body.style.overflow = 'hidden';

    // Stagger animation for executive links
    if (window.gsap) {
      gsap.fromTo(
        '.overlay-item',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  if (soundEnabled && audioCtx) {
    playTone(580, 'sine', 0.08, 0.03);
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLeadModalMario();
    const overlay = document.getElementById('navOverlay');
    if (overlay && overlay.classList.contains('open')) {
      window.toggleExecutiveMenu();
    }
  }
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById('leadModalMario');
  if (modal && e.target === modal) closeLeadModalMario();
});

window.handleFormSubmitMario = function(e) {
  e.preventDefault();
  const name = document.getElementById('marioLeadName').value;
  const phone = document.getElementById('marioLeadPhone').value;
  const intent = document.getElementById('marioLeadIntent').value;
  const message = document.getElementById('marioLeadMsg').value;

  let intentText = 'Información General';
  if (intent === 'comprar') intentText = 'Quiero Comprar o Invertir en RD';
  if (intent === 'vender') intentText = 'Quiero Vender Mi Propiedad';
  if (intent === 'crecer') intentText = 'Quiero Crecer en Bienes Raíces (Alveare)';

  const textEncoded = encodeURIComponent(
    `Hola Mario, te contacto desde tu plataforma oficial:\n\n` +
    `👤 *Nombre:* ${name}\n` +
    `📱 *Teléfono:* ${phone}\n` +
    `🎯 *Interés:* ${intentText}\n` +
    (message ? `📝 *Detalles:* ${message}\n\n` : '\n') +
    `Quedo a la espera de tu respuesta.`
  );

  const whatsappUrl = `https://wa.me/18293417575?text=${textEncoded}`;
  window.open(whatsappUrl, '_blank');
  closeLeadModalMario();
};

