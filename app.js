/**
 * MARIO ALMONTE — EXECUTIVE REAL ESTATE & LEADERSHIP PLATFORM
 * Core Application Engine: Lenis, GSAP, Interactive Timeline, i18n & Leads
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Smooth Scrolling (Lenis)
  initLenis();

  // Initialize Preloader Sequence
  initPreloader();

  // Initialize Header Scroll Effects
  initHeaderScroll();

  // Initialize Desktop Cursor Glow & Tilt
  initCursorAndTilt();

  // Initialize Interactive Timeline
  initTimeline();

  // Initialize Language Switcher (ES / EN)
  initLanguageSwitcher();

  // Initialize Mobile Navigation
  initMobileNav();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL & GSAP SYNC
   ========================================================================== */
let lenis;
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

/* ==========================================================================
   2. PRELOADER SEQUENCE
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloaderCount');
  const barEl = document.getElementById('preloaderBar');

  if (!preloader || !countEl || !barEl) return;

  let currentYear = 2004;
  const targetYear = 2026;
  const duration = 1200; // ms
  const interval = duration / (targetYear - currentYear);

  const timer = setInterval(() => {
    currentYear++;
    countEl.textContent = currentYear + (currentYear === targetYear ? '+' : '');
    const progress = ((currentYear - 2004) / (targetYear - 2004)) * 100;
    barEl.style.width = `${progress}%`;

    if (currentYear >= targetYear) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('loaded');
        // Trigger Hero entry animations if GSAP available
        if (window.gsap) {
          gsap.from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
          gsap.from('.hero-lead', { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
          gsap.from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
          gsap.from('#portraitFrame', { scale: 0.96, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 });
        }
      }, 350);
    }
  }, interval);

  // Safety fallback: guaranteed reveal after 1.8 seconds max
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
    }
  }, 1800);
}

/* ==========================================================================
   3. HEADER SCROLL STATE
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. CURSOR GLOW & PORTRAIT 3D TILT
   ========================================================================== */
function initCursorAndTilt() {
  const cursorGlow = document.getElementById('cursorGlow');
  const portraitFrame = document.getElementById('portraitFrame');

  // Mouse move for ambient cursor glow
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    // Subtle 3D tilt on portrait frame
    if (portraitFrame && window.innerWidth > 1024) {
      const rect = portraitFrame.getBoundingClientRect();
      const isHovering = (
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50
      );

      if (isHovering) {
        const xVal = (e.clientX - (rect.left + rect.width / 2)) / 25;
        const yVal = -(e.clientY - (rect.top + rect.height / 2)) / 25;
        portraitFrame.style.transform = `perspective(1000px) rotateY(${xVal}deg) rotateX(${yVal}deg)`;
      } else {
        portraitFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      }
    }
  });
}

/* ==========================================================================
   5. TIMELINE STAGE SWITCHER
   ========================================================================== */
function initTimeline() {
  const tabBtns = document.querySelectorAll('.timeline-tab-btn');
  const stageCards = document.querySelectorAll('.timeline-stage-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStage = btn.getAttribute('data-stage');

      // Update Active Tab
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Show Corresponding Card
      stageCards.forEach((card, index) => {
        if (index == targetStage) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   6. BILINGUAL TRANSLATION SYSTEM (ES / EN)
   ========================================================================== */
const translations = {
  es: {
    nav_story: "Trayectoria",
    nav_hive: "Alveare",
    nav_leadership: "Liderazgo",
    nav_philosophy: "Filosofía",
    nav_connect: "Conectar",
    btn_lets_talk: "Iniciar Conversación",
    hero_badge: "CEO & BROKER OWNER • REPÚBLICA DOMINICANA",
    hero_h1_sub: "Real Estate. Leadership. Growth.",
    hero_p_lead: "Soy <strong>Mario Almonte</strong>, empresario y asesor inmobiliario dominicano. Empecé en 2004, mucho antes de imaginar que dos décadas más tarde lideraría mi propia firma y un equipo de profesionales que comparten una misma visión de excelencia.",
    hero_btn_explore: "Conocer Trayectoria",
    hero_btn_work: "¿Qué te trae aquí?",
    metric_years: "Años de Trayectoria (Desde 2004)",
    metric_families: "Familias & Inversionistas Guiados",
    metric_colmena: "Colmena de Líderes (Alveare)",
    card_hive_desc: "Creando Nuevos Líderes",
    statement_quote: "Los bienes raíces son mucho más que metros cuadrados, precios y transacciones.<br><span class=\"highlight\">Son decisiones. Son relaciones. Son personas.</span>",
    author_role_tag: "CEO & Broker Owner • Alveare Realty",
    timeline_tag: "Trayectoria & Evolución",
    timeline_title: "Más de 20 Años Forjando un Camino Propio",
    timeline_desc: "Cada etapa de estos más de 20 años preparó el terreno para la siguiente. Una travesía de aprendizaje riguroso, errores transformados en lecciones y relaciones que trascienden el tiempo.",
    tab_stage_1: "El Aprendizaje Inicial",
    tab_stage_2: "Madurez & Relaciones",
    tab_stage_3: "El Nacimiento de Alveare",
    tab_stage_4: "Creando Nuevos Líderes",
    stage_0_badge: "Fase I • Los Fundamentos",
    stage_0_title: "De la Administración al Corretaje Inmobiliario",
    stage_0_narrative: "Estudié Administración de Empresas y encontré en el corretaje inmobiliario una combinación que captó de inmediato mi atención: independencia, emprendimiento, relaciones humanas y la posibilidad de construir algo propio.<br><br>Los primeros años fueron, primordialmente, años de aprendizaje. Tomé cursos, busqué referentes, estudié el mercado y me propuse entender qué podía hacer de manera distinta para ofrecer un servicio superior.",
    stage_0_takeaway_title: "La Regla de Oro",
    stage_0_takeaway_text: "“Los detalles importan. La forma en que presentas una propiedad, la rapidez con la que respondes, el acompañamiento que brindas y, sobre todo, la relación que perdura tras el cierre.”",
    stage_0_stat_1: "Punto de partida de una visión de vida.",
    stage_0_stat_2: "Enfoque en dominar los detalles y el servicio al cliente.",
    stage_1_badge: "Fase II • Consolidación",
    stage_1_title: "Cientos de Negociaciones, Familias y Lecciones",
    stage_1_narrative: "Con el paso de los años llegaron cientos de clientes, proyectos emblemáticos, errores de los que aprender y relaciones sólidas que terminaron convirtiéndose en la columna vertebral de mi carrera.<br><br>Comprendí que la reputación no se gana con un gran negocio mediático: se forja a través de cientos de decisiones pequeñas tomadas de forma correcta, día tras día, durante décadas.",
    stage_1_takeaway_title: "Principio Operativo",
    stage_1_takeaway_text: "“Cada cliente que confía en ti está depositando su patrimonio, su tranquilidad y el futuro de su familia. No es una venta; es una responsabilidad ética innegociable.”",
    stage_1_stat_1: "Transacciones e inversiones asesoradas exitosamente.",
    stage_1_stat_2: "Presencia en los polos inmobiliarios más dinámicos del país.",
    stage_2_badge: "Fase III • De Consultor a Empresario",
    stage_2_title: "El Nacimiento de Alveare Realty",
    stage_2_narrative: "Tras aproximadamente dos décadas en la industria, decidí dar el paso y construir una empresa que representara plenamente mi forma de entender este negocio. Así nació <strong>Alveare Realty</strong>.<br><br><em>Alveare</em> significa colmena en italiano. Esa idea encapsula con exactitud lo que quería construir: una organización donde diversas personas trabajan, crecen y aportan hacia un propósito común.",
    stage_2_takeaway_title: "La Visión Alveare",
    stage_2_takeaway_text: "“Nuestro compromiso con el cliente es fundamental, pero la visión de Alveare va mucho más allá de vender inmuebles: queremos construir profesionales, relaciones y líderes.”",
    stage_2_stat_1: "Broker Owner al frente de una firma independiente de alto nivel.",
    stage_2_stat_2: "Cultura corporativa basada en sinergia, ética y colaboración.",
    stage_3_badge: "Fase IV • El Legado Activo",
    stage_3_title: "Creando Nuevos Líderes: El Verdadero Éxito",
    stage_3_narrative: "Durante años mi crecimiento se medía por las propiedades vendidas o el volumen cerrado. Con el tiempo, mi definición de éxito cambió radicalmente.<br><br>Hoy, mi mayor satisfacción es ver crecer a otros: presenciar cómo un asesor cierra su primera venta, cómo alguien que llegó con dudas desarrolla una confianza inquebrantable, y cómo asume responsabilidades hasta convertirse en referente.",
    stage_3_takeaway_title: "La Definición de Liderazgo",
    stage_3_takeaway_text: "“El liderazgo no consiste en crear seguidores. Consiste en desarrollar personas capaces de convertirse también en líderes. Mi meta no es una empresa que dependa de Mario Almonte, sino una organización repleta de líderes autónomos.”",
    stage_3_stat_1: "Dependencia de una sola persona: empoderamiento colectivo.",
    stage_3_stat_2: "El impacto en las personas como verdadero legado duradero.",
    hive_tag: "La Empresa • Alveare Realty",
    hive_title: "La Arquitectura de la Colmena",
    hive_desc: "Alveare es el resultado de dos décadas de aprendizaje, sintetizadas en una plataforma de alto rendimiento donde el crecimiento individual impulsa el éxito colectivo.",
    hive_callout_title: "¿Por qué Alveare?",
    hive_callout_desc: "<em>Alveare</em> significa colmena en italiano. Representa el poder del trabajo articulado, donde cada profesional aporta su talento con precisión geométrica y disciplina para generar un impacto que ninguna individualidad podría lograr por sí sola.",
    bento_1_title: "Asesoría de Alta Estrategia",
    bento_1_desc: "Guiamos decisiones de inversión evaluando plusvalía real, rendimiento de alquiler, seguridad jurídica y proyección urbana en República Dominicana.",
    bento_2_title: "Incubadora de Líderes",
    bento_2_desc: "Estructuras formativas y acompañamiento directo para que cada asesor construya su propia cartera, desarrolle seguridad y se convierta en referente.",
    bento_3_title: "Marketing Inmobiliario de Vanguardia",
    bento_3_desc: "Vender una propiedad requiere mucho más que publicarla. Implementamos narrativa visual de impacto, posicionamiento digital y negociación asertiva.",
    philo_tag: "Filosofía Inmutable",
    philo_title: "Dos Palabras que Definen una Carrera",
    philo_desc: "No son eslóganes comerciales. Son los principios que han guiado cada consulta, cada contrato y cada relación durante más de veinte años.",
    p1_heading: "EXCELENCIA",
    p1_quote: "“Hacer las cosas bien incluso cuando nadie está mirando.”",
    p1_body: "La excelencia se manifiesta en la exhaustividad del análisis previo, en la puntualidad rigurosa, en la transparencia sobre los riesgos y en la pulcritud con la que se redacta cada acuerdo. No es un acto aislado; es un hábito diario.",
    p2_heading: "COMPROMISO",
    p2_quote: "“Permanecer presente en todo el proceso y asumir la responsabilidad de los resultados.”",
    p2_body: "Estar cuando las negociaciones son fluidas es sencillo. El verdadero compromiso se prueba cuando surgen fricciones, dudas o desafíos imprevistos, resolviendo con serenidad y protegiendo siempre los intereses del cliente.",
    philo_footer: "“La reputación profesional no se construye con un gran negocio. Se construye con <strong>cientos de pequeñas decisiones tomadas correctamente a lo largo del tiempo</strong>.”",
    beyond_tag: "Más Allá del Inmueble",
    beyond_title: "Compartir lo Aprendido Mientras Sigo Aprendiendo",
    beyond_desc: "Mi marca personal representa el sector inmobiliario, pero no se limita exclusivamente a propiedades. Comparto vivencias reales sobre desarrollo empresarial, liderazgo y los desafíos del crecimiento.",
    action_tag: "Trabajemos Juntos",
    action_title: "¿Qué te Trae Aquí Hoy?",
    action_desc: "Selecciona la vía que mejor describe tu objetivo actual para ofrecerte un plan de acción directo y personalizado.",
    path_1_title: "Quiero Comprar o Invertir",
    path_1_desc: "Si estás considerando adquirir una propiedad o realizar una inversión inmobiliaria en la República Dominicana, te ayudamos a evaluar opciones objetivas con alto potencial de retorno y plusvalía.",
    path_1_cta: "Evaluar Opciones",
    path_2_title: "Quiero Vender Mi Propiedad",
    path_2_desc: "Más de dos décadas en el mercado nos permiten entender que vender una propiedad correctamente exige estrategia, presentación impecable, exposición dirigida, seguimiento y negociación experta.",
    path_2_cta: "Plan de Comercialización",
    path_3_title: "Quiero Crecer en Bienes Raíces",
    path_3_desc: "Si eres asesor inmobiliario o deseas construir una carrera sólida dentro de esta industria, quiero compartir contigo el conocimiento, las herramientas y la plataforma de Alveare para acelerar tu desarrollo.",
    path_3_cta: "Unirse a la Colmena",
    legacy_tag: "El Legado • 2004 — Presente",
    legacy_heading: "Una Carrera Aún en Construcción.",
    legacy_desc: "2004 fue el comienzo. Más de veinte años después, sigo sintiendo que aún queda muchísimo por edificar: nuevos proyectos, nuevas personas, nuevos líderes, nuevas ideas.<br><br>Los bienes raíces fueron el punto de partida.<br><strong>El impacto que podamos tener en las personas será el verdadero legado.</strong>"
  },
  en: {
    nav_story: "Story",
    nav_hive: "Alveare",
    nav_leadership: "Leadership",
    nav_philosophy: "Philosophy",
    nav_connect: "Connect",
    btn_lets_talk: "Start Conversation",
    hero_badge: "CEO & BROKER OWNER • DOMINICAN REPUBLIC",
    hero_h1_sub: "Real Estate. Leadership. Growth.",
    hero_p_lead: "I am <strong>Mario Almonte</strong>, a Dominican businessman and real estate advisor. I began my career in real estate in 2004, long before I imagined that more than two decades later I would be at the head of my own company and a team who share the same vision of growth.",
    hero_btn_explore: "Discover My Story",
    hero_btn_work: "What brings you here?",
    metric_years: "Years in Real Estate (Since 2004)",
    metric_families: "Families & Investors Guided",
    metric_colmena: "A Hive of Leaders (Alveare)",
    card_hive_desc: "Building Future Leaders",
    statement_quote: "Real estate is much more than square footage, prices, and transactions.<br><span class=\"highlight\">They are decisions. They are relationships. They are people.</span>",
    author_role_tag: "CEO & Broker Owner • Alveare Realty",
    timeline_tag: "Journey & Evolution",
    timeline_title: "More than 20 Years Growing Within Real Estate",
    timeline_desc: "Each stage prepared the way for the next. A journey of relentless learning, turning mistakes into wisdom, and fostering relationships that endure over time.",
    tab_stage_1: "Early Learning Curve",
    tab_stage_2: "Mastery & Relationships",
    tab_stage_3: "The Birth of Alveare",
    tab_stage_4: "Creating New Leaders",
    stage_0_badge: "Phase I • The Foundations",
    stage_0_title: "From Business Admin to Real Estate Brokerage",
    stage_0_narrative: "I studied Business Administration and found in real estate brokerage a combination that immediately caught my attention: independence, entrepreneurship, human relations, and the possibility of building something of my own.<br><br>The first few years were, primarily, years of learning. I took courses, looked for role models, studied the market, and tried to understand what I could do differently to offer a better service.",
    stage_0_takeaway_title: "The Golden Rule",
    stage_0_takeaway_text: "“Details matter. The way you present a property matters. How quickly you respond matters. The way you support a client matters. And the relationship that remains after closing a deal matters even more.”",
    stage_0_stat_1: "The starting point of a lifetime purpose.",
    stage_0_stat_2: "Relentless obsession with details and client trust.",
    stage_1_badge: "Phase II • Consolidation",
    stage_1_title: "Hundreds of Negotiations, Families, and Lessons",
    stage_1_narrative: "Over the years, hundreds of clients, negotiations, properties, projects, mistakes, lessons learned, and relationships came along, which ended up becoming a fundamental part of my career.<br><br>I learned that reputation is not built with one big deal. It is built with hundreds of small decisions made correctly over time.",
    stage_1_takeaway_title: "Guiding Principle",
    stage_1_takeaway_text: "“Every client placing their trust in you is entrusting their legacy, peace of mind, and family future. It is never just a deal; it is an undeniable ethical responsibility.”",
    stage_1_stat_1: "Transactions and investments successfully guided.",
    stage_1_stat_2: "Active presence across Dominican Republic prime markets.",
    stage_2_badge: "Phase III • From Consultant to Entrepreneur",
    stage_2_title: "The Birth of Alveare Realty",
    stage_2_narrative: "After approximately two decades in the real estate industry, I decided to build a company that represented my way of understanding this business. This is how <strong>Alveare Realty</strong> was born.<br><br><em>Alveare</em> means beehive in Italian. And that idea represents exactly what I wanted to build: an organization where different people work, grow, and contribute toward a common purpose.",
    stage_2_takeaway_title: "The Alveare Vision",
    stage_2_takeaway_text: "“Our commitment to the customer remains fundamental, but Alveare's vision goes far beyond selling properties. We want to build professionals. We want to build relationships. And we want to build leaders.”",
    stage_2_stat_1: "CEO & Broker Owner heading a premier independent firm.",
    stage_2_stat_2: "Corporate culture grounded in synergy, ethics, and mutual growth.",
    stage_3_badge: "Phase IV • The Active Legacy",
    stage_3_title: "Creating New Leaders: Redefining True Success",
    stage_3_narrative: "For many years my professional growth could be measured by the properties I sold, the clients I served, or the deals I managed to close. Over time, my definition of success began to change.<br><br>Today, one of my greatest satisfactions is seeing other people grow: watching an advisor make their first sale, seeing someone who arrived insecure begin to develop confidence, and seeing them become a role model for others.",
    stage_3_takeaway_title: "The Meaning of Leadership",
    stage_3_takeaway_text: "“Leadership is not about creating followers. It consists of developing people capable of also becoming leaders. My goal is not to build a company that depends on Mario Almonte. My goal is to build an organization full of people capable of leading.”",
    stage_3_stat_1: "Zero bottleneck: collective team empowerment.",
    stage_3_stat_2: "Impact on human lives as the true lasting legacy.",
    hive_tag: "The Company • Alveare Realty",
    hive_title: "The Hive Architecture",
    hive_desc: "Alveare is the culmination of twenty years of market mastery, organized into a high-performance ecosystem where personal growth fuels collective success.",
    hive_callout_title: "Why Alveare?",
    hive_callout_desc: "<em>Alveare</em> means beehive. It embodies the precision of articulated teamwork, where every advisor contributes their strengths with geometric clarity to create an impact no single individual could achieve alone.",
    bento_1_title: "Strategic Advisory",
    bento_1_desc: "Guiding high-stakes investment decisions by evaluating real appreciation, rental yields, legal clarity, and urban trends in the Dominican Republic.",
    bento_2_title: "Leadership Incubator",
    bento_2_desc: "Empowering advisors with structural training, mentorship, and support to build their own client portfolios and thrive as autonomous industry leaders.",
    bento_3_title: "High-Impact Marketing",
    bento_3_desc: "Selling a property requires much more than a listing. We deploy cinematic presentation, targeted multi-channel distribution, and master negotiation.",
    philo_tag: "Core Philosophy",
    philo_title: "Two Words That Anchor a Career",
    philo_desc: "These are not marketing slogans. They are the twin pillars that have governed every consultation, contract, and relationship for over two decades.",
    p1_heading: "EXCELLENCE",
    p1_quote: "“Doing things right even when no one is watching.”",
    p1_body: "Excellence reveals itself in thorough due diligence, unwavering punctuality, honest risk transparency, and immaculate contractual precision. It is not an occasional sprint; it is a daily standard.",
    p2_heading: "COMMITMENT",
    p2_quote: "“Remaining present throughout the entire process and taking responsibility for the results.”",
    p2_body: "Showing up when deals run smoothly is easy. Real commitment is forged when friction, hesitation, or unforeseen market shifts emerge—navigating with poise and protecting client interests above all.",
    philo_footer: "“Professional reputation is not built with one big deal. It is built with <strong>hundreds of small decisions made correctly over time</strong>.”",
    beyond_tag: "Beyond Real Estate",
    beyond_title: "What I Have Learned, While I Continue to Learn",
    beyond_desc: "My personal brand represents real estate, although I don't want to limit it exclusively to properties. I share what I've learned building businesses, teams, and facing the realities of growth.",
    action_tag: "Let's Work Together",
    action_title: "What Brings You Here Today?",
    action_desc: "Select the option that matches your current goal so we can provide a personalized, high-clarity path forward.",
    path_1_title: "I Want to Buy or Invest",
    path_1_desc: "If you are considering buying a property or making a real estate investment in the Dominican Republic, we can help you evaluate your options and make a more informed decision.",
    path_1_cta: "Evaluate Options",
    path_2_title: "I Want to Sell My Property",
    path_2_desc: "More than two decades in the market have allowed me to understand that selling a property correctly requires strategy, presentation, exposition, follow-up, and negotiation.",
    path_2_cta: "Marketing Strategy",
    path_3_title: "I Want to Grow in Real Estate",
    path_3_desc: "If you are a real estate agent or are considering developing a career within this industry, I want to share with you knowledge, experiences, and tools to accelerate your growth.",
    path_3_cta: "Join The Hive",
    legacy_tag: "The Legacy • 2004 — Present",
    legacy_heading: "A Career Still Under Construction.",
    legacy_desc: "2004 was the beginning. More than twenty years later, I still feel that there is still so much to build: new projects, new people, new leaders, new ideas.<br><br>Real estate was the starting point.<br><strong>The impact we can have on people will be the true legacy.</strong>"
  }
};

let currentLang = 'es';

function initLanguageSwitcher() {
  const langToggleBtn = document.getElementById('langToggle');
  const langES = document.getElementById('langES');
  const langEN = document.getElementById('langEN');

  if (!langToggleBtn) return;

  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  const langES = document.getElementById('langES');
  const langEN = document.getElementById('langEN');

  if (lang === 'es') {
    langES.classList.add('active');
    langEN.classList.remove('active');
    document.documentElement.lang = 'es';
  } else {
    langEN.classList.add('active');
    langES.classList.remove('active');
    document.documentElement.lang = 'en';
  }

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   7. LEAD MODAL & DIRECT WHATSAPP GENERATOR
   ========================================================================== */
window.openLeadModal = function(intent) {
  const modal = document.getElementById('leadModal');
  const select = document.getElementById('formIntent');
  const title = document.getElementById('modalTitle');
  const subtitle = document.getElementById('modalSubtitle');

  if (modal) {
    modal.classList.add('active');
    if (select && intent) {
      select.value = intent;
    }

    if (intent === 'comprar') {
      title.textContent = currentLang === 'es' ? 'Comprar o Invertir en RD' : 'Buy or Invest in DR';
      subtitle.textContent = currentLang === 'es' 
        ? 'Evaluemos juntos las mejores oportunidades inmobiliarias del país.'
        : 'Let us evaluate prime Dominican Republic property opportunities together.';
    } else if (intent === 'vender') {
      title.textContent = currentLang === 'es' ? 'Vender Mi Propiedad' : 'Sell My Property';
      subtitle.textContent = currentLang === 'es'
        ? 'Diseñemos un plan de marketing y exposición estratégica para tu inmueble.'
        : 'Let us design a strategic marketing and exposition plan for your property.';
    } else if (intent === 'crecer') {
      title.textContent = currentLang === 'es' ? 'Crecer en Bienes Raíces' : 'Grow in Real Estate';
      subtitle.textContent = currentLang === 'es'
        ? 'Da el siguiente salto en tu carrera y forma parte de Alveare Realty.'
        : 'Take your real estate career to the next level with Alveare Realty.';
    }
  }
};

window.closeLeadModal = function() {
  const modal = document.getElementById('leadModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

// Close modal on escape key or clicking outside
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLeadModal();
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById('leadModal');
  if (modal && e.target === modal) {
    closeLeadModal();
  }
});

// Form submission -> structured WhatsApp lead
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value;
  const phone = document.getElementById('formPhone').value;
  const intent = document.getElementById('formIntent').value;
  const message = document.getElementById('formMessage').value;

  let intentText = 'Información General';
  if (intent === 'comprar') intentText = 'Comprar o Invertir en RD';
  if (intent === 'vender') intentText = 'Vender una Propiedad';
  if (intent === 'crecer') intentText = 'Crecer en Bienes Raíces (Equipo Alveare)';

  const textEncoded = encodeURIComponent(
    `Hola Mario, te contacto a través de tu sitio web oficial:\n\n` +
    `👤 *Nombre:* ${name}\n` +
    `📱 *Teléfono:* ${phone}\n` +
    `🎯 *Interés:* ${intentText}\n` +
    (message ? `📝 *Detalles:* ${message}\n\n` : '\n') +
    `Quedo a la espera de tu respuesta.`
  );

  // Mario Almonte WhatsApp Contact URL (Dominican Republic phone format)
  const whatsappUrl = `https://wa.me/18293417575?text=${textEncoded}`;
  window.open(whatsappUrl, '_blank');
  closeLeadModal();
};

/* ==========================================================================
   8. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}
