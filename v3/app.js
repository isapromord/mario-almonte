/**
 * MARIO ALMONTE — V3 HAUTE EDITORIAL CHIAROSCURO ENGINE
 * Lenis Smooth Scroll + GSAP ScrollTrigger Pinned Horizontal Timeline
 * Interactive B&W to Color Portrait Bloom + Apple Line-by-Line Highlight
 * Ambient Raycast Ember Canvas + Dual Magnetic Cursor + Web Audio Haptics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Lenis Smooth Scroll & GSAP Sync
  initLenisAndGSAP();

  // 3. Interactive Chiaroscuro Portrait Stage (B&W to Color Bloom)
  initPortraitChiaroscuroStage();

  // 4. Living Amber Dust & Raycast Canvas
  initLivingRaycastCanvas();

  // 5. Dual Magnetic Cursor & Interactive Targets
  initCursorAndMagnetics();

  // 6. Pinned Horizontal Timeline Scroller (Scene 02: Mi Historia)
  initPinnedHorizontalTimeline();

  // 7. Apple Reading Highlight Line-by-Line (Scene 05: Mi Filosofía)
  initReadingHighlight();

  // 8. Telemetry HUD Scene Progress
  initTelemetryHUD();

  // 9. Web Audio API Haptics
  initWebAudioHaptics();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL & GSAP SYNC
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

    // Auto-Hiding Minimalist Header with Frosted Glass Scroll State
    const header = document.getElementById('siteHeader');
    let lastScrollY = 0;
    const scrollThreshold = 8;

    lenis.on('scroll', (e) => {
      const currentScrollY = e.scroll;

      // Toggle frosted glass background when scrolled
      if (header) {
        if (currentScrollY > 20) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY && currentScrollY > 160) {
          header.classList.add('header-hidden');
          header.classList.remove('header-visible');
        } else {
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
   2. INTERACTIVE CHIAROSCURO PORTRAIT STAGE (B&W TO COLOR BLOOM)
   ========================================================================== */
function initPortraitChiaroscuroStage() {
  const stage = document.getElementById('portraitStage');
  const badgeLabel = document.querySelector('.portrait-tap-badge .tap-label');
  if (!stage) return;

  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // Desktop Hover State Audio Feedback
  stage.addEventListener('mouseenter', () => {
    if (isTouchDevice) return;
    if (soundEnabled && audioCtx) playTone(640, 'sine', 0.08, 0.02);
  });

  // Toggle reveal helper (smooth bloom between B&W chiaroscuro and full color)
  const toggleStageColor = () => {
    const isRevealed = stage.classList.toggle('revealed');
    if (badgeLabel) {
      badgeLabel.textContent = isRevealed ? 'Color activo' : 'Toca para ver a color';
    }
    if (soundEnabled && audioCtx) {
      playTone(isRevealed ? 720 : 480, 'sine', 0.1, 0.03);
    }
  };

  // Instant Mobile Touch Detection (differentiates tap from scroll swipe)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 10 || dy > 10) {
        touchMoved = true;
      }
    }
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    if (!touchMoved) {
      toggleStageColor();
    }
  }, { passive: true });

  // Desktop Click Toggle
  stage.addEventListener('click', () => {
    if (!isTouchDevice) {
      toggleStageColor();
    }
  });
}

/* ==========================================================================
   3. LIVING RAYCAST AMBIENT CANVAS (Golden Obsidian Sparks)
   ========================================================================== */
function initLivingRaycastCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? 'rgba(255, 122, 26,' : 'rgba(212, 175, 55,',
      pulseSpeed: Math.random() * 0.02 + 0.005,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const safeAlpha = Math.max(0.05, Math.min(0.65, p.alpha));
      ctx.fillStyle = `${p.color} ${safeAlpha})`;
      ctx.shadowBlur = p.size * 5;
      ctx.shadowColor = 'rgba(255, 122, 26, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   4. DUAL MAGNETIC CURSOR & INTERACTION PHYSICS
   ========================================================================== */
function initCursorAndMagnetics() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Magnetic Pull on interactive elements
  const magnetics = document.querySelectorAll('[data-magnetic]');
  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.18}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   5. PINNED HORIZONTAL TIMELINE SCROLLER (Scene 02: Mi Historia)
   ========================================================================== */
function initPinnedHorizontalTimeline() {
  const section = document.querySelector('.h-timeline-section');
  const track = document.getElementById('hTimelineTrack');
  const prevBtn = document.getElementById('timelinePrevBtn');
  const nextBtn = document.getElementById('timelineNextBtn');
  const counterEl = document.getElementById('timelineCurrentSlide');
  if (!section || !track) return;

  const slides = track.querySelectorAll('.h-timeline-slide');
  const totalSlides = slides.length;

  // Function to update mobile counter & arrow disabled states
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

  // Wire Mobile Prev / Next Buttons
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

  // Initial call for mobile
  updateMobileNavigation();

  // Desktop Responsive Pinning via GSAP matchMedia
  if (window.gsap && window.ScrollTrigger) {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', () => {
      const getScrollDist = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollDist,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.1,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
      };
    });
  }
}

/* ==========================================================================
   6. APPLE READING HIGHLIGHT LINE-BY-LINE (Scene 05: Mi Filosofía)
   ========================================================================== */
function initReadingHighlight() {
  const lines = document.querySelectorAll('[data-reading-line]');
  if (!lines.length || !window.gsap || !window.ScrollTrigger) return;

  lines.forEach((line) => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 75%',
      end: 'bottom 35%',
      onEnter: () => line.classList.add('active'),
      onLeave: () => line.classList.remove('active'),
      onEnterBack: () => line.classList.add('active'),
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

  const triggers = document.querySelectorAll('.btn-magnetic, .action-card-v3, .pilar-card, .social-passport-card');
  triggers.forEach((t) => {
    t.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) {
        playTone(420, 'sine', 0.04, 0.02);
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
    // Audio context ignore
  }
}

/* ==========================================================================
   9. MODERN MINIMALIST EXECUTIVE OVERLAY MENU
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

/* ==========================================================================
   10. LEAD MODAL & WHATSAPP LOGIC
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
    `Hola Mario, te contacto desde tu plataforma oficial (V3):\n\n` +
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
