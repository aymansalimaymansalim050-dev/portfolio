/* ==========================================================================
   JS-READY FLAG
   Lets styles.css hide .reveal elements only once JS is confirmed running,
   so a failed/blocked script.js never leaves content permanently invisible.
   ========================================================================== */
document.documentElement.classList.add('js-ready');

/* ==========================================================================
   MOBILE NAV TOGGLE
   Toggles the menu open/closed and keeps aria-expanded in sync so screen
   readers announce the state correctly — not just a visual change.
   ========================================================================== */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  primaryNav.classList.toggle('open');
});

// Close the mobile menu after a nav link is clicked, so it doesn't stay
// open over the section you just navigated to.
primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('open');
  });
});

// Escape closes the mobile menu and sends focus back to the toggle button,
// so keyboard users aren't left stranded inside a hidden menu.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (navToggle.getAttribute('aria-expanded') !== 'true') return;
  navToggle.setAttribute('aria-expanded', 'false');
  primaryNav.classList.remove('open');
  navToggle.focus();
});

/* ==========================================================================
   SCROLLSPY — status bar + active nav link
   IntersectionObserver watches each <section>, without a scroll event
   listener running expensive layout math on every pixel scrolled.
   Whichever section is most visible updates both the footer status line
   and which nav link is marked active.
   ========================================================================== */
const sections = document.querySelectorAll('main section[id]');
const statusSection = document.getElementById('statusSection');
const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      statusSection.textContent = id;

      navLinks.forEach((link) => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  {
    // Counts a section as "current" once it crosses the vertical middle
    // of the viewport, which feels more natural than the exact top edge.
    rootMargin: '-50% 0px -50% 0px',
  }
);

sections.forEach((section) => observer.observe(section));

/* ==========================================================================
   SCROLL REVEAL
   Each section's .reveal wrapper fades and rises into place the first time
   it enters the viewport, then stops being observed — it only needs to fire
   once. Same IntersectionObserver pattern as the scrollspy above.
   ========================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   LANGUAGE SWITCHER
   Every element carrying data-i18n gets its text swapped for the matching
   entry in `translations`. No page reload, no framework — just look up the
   key and write it in. The choice is remembered in localStorage so it
   sticks on the next visit.
   ========================================================================== */
const translations = {
  en: {
    skipLink: 'Skip to content',
    navMenu: 'Menu',
    navWork: 'Work',
    navAbout: 'About',
    navSkills: 'Skills',
    navContact: 'Contact',
    heroEyebrow: 'Front-End Developer — React & TypeScript',
    heroHeadline: 'I build interfaces that are fast, accessible, and easy to maintain.',
    heroLede: 'I turn designs into responsive, production-ready interfaces — with clean, readable code underneath.',
    heroCtaWork: 'See my work',
    heroCtaContact: 'Get in touch',
    heroCtaGithub: 'GitHub',
    heroMetaAriaLabel: 'Quick facts',
    heroMetaBasedIn: 'Based in',
    heroMetaLocation: 'Toledo, Spain',
    heroMetaFocusLabel: 'Focus',
    heroMetaFocusValue: 'Front-end development',
    heroMetaStatusLabel: 'Status',
    heroMetaStatusValue: 'Open to work',
    workEyebrow: 'Selected work',
    workHeading: "Things I've built",
    project1Desc: 'A weather lookup app that fetches live forecasts from a public API, with geolocation support and a responsive layout that adapts from a single card to a multi-day grid.',
    project1Feat1: 'Live forecast lookup by city or geolocation',
    project1Feat2: 'Responsive layout: single card → multi-day grid',
    project2Desc: 'A daily habit tracker that saves progress to local storage, with a streak calendar and a drag-to-reorder habit list — no backend, no build step.',
    project2Feat1: 'Streak calendar backed by Web Storage',
    project2Feat2: 'Drag-to-reorder habit list',
    project3Desc: 'A product catalog built with React, pulling live data from a public REST API. Includes category filtering, a persistent cart via Context, and a fully responsive grid.',
    project3Feat1: 'Category filtering across the full catalog',
    project3Feat2: 'Persistent cart state via React Context',
    project3Feat3: 'Fully responsive product grid',
    projectStatusConcept: 'Concept — not built yet. Live demo and source links will go here once it ships.',
    linkLiveSite: 'Live site →',
    linkSource: 'Source →',
    aboutEyebrow: 'About',
    aboutHeading: 'A little about how I work',
    aboutBio1: "I'm a front-end developer based in Toledo, and I care about the part of the job most people skip past: does this layout hold up on every screen, can someone using only a keyboard actually get through it, does the markup make sense to someone reading it cold. That's the work I enjoy.",
    aboutBio2: "Right now I'm deep in React and TypeScript, turning project ideas into things that actually run in a browser instead of staying sketches. I'm looking for a junior front-end role or freelance work where I can keep building — and keep getting better at it.",
    factSemantic: 'semantic HTML',
    factAccessible: 'WCAG contrast',
    factResponsive: 'first design',
    skillsEyebrow: 'Skills',
    skillsHeading: 'What I work with',
    skillsCore: 'Core',
    skillsTools: 'Tools',
    skillsPractices: 'Practices',
    practiceResponsive: 'Responsive design',
    practiceAccessibility: 'Accessibility',
    practiceTesting: 'Testing',
    practiceRest: 'REST APIs',
    contactEyebrow: 'Contact',
    contactHeading: "Let's work together",
    contactLede: "I'm currently open to new opportunities and freelance work. The fastest way to reach me is email.",
    contactResume: 'Resume (PDF)',
    footerBackToTop: 'back to top ↑',
    pageTitle: 'ayman salim — Front-End Developer',
    pageDescription: 'Front-end developer specializing in React and TypeScript, building fast, responsive, and accessible web interfaces.',
  },
  es: {
    skipLink: 'Saltar al contenido',
    navMenu: 'Menú',
    navWork: 'Trabajo',
    navAbout: 'Sobre mí',
    navSkills: 'Habilidades',
    navContact: 'Contacto',
    heroEyebrow: 'Desarrollador Front-End — React y TypeScript',
    heroHeadline: 'Construyo interfaces rápidas, accesibles y fáciles de mantener.',
    heroLede: 'Convierto diseños en interfaces responsivas y listas para producción, con código limpio y legible por debajo.',
    heroCtaWork: 'Ver mi trabajo',
    heroCtaContact: 'Contactar',
    heroCtaGithub: 'GitHub',
    heroMetaAriaLabel: 'Datos rápidos',
    heroMetaBasedIn: 'Ubicación',
    heroMetaLocation: 'Toledo, España',
    heroMetaFocusLabel: 'Enfoque',
    heroMetaFocusValue: 'Desarrollo front-end',
    heroMetaStatusLabel: 'Estado',
    heroMetaStatusValue: 'Disponible para trabajar',
    workEyebrow: 'Trabajo seleccionado',
    workHeading: 'Cosas que he construido',
    project1Desc: 'Una app del clima que obtiene pronósticos en vivo desde una API pública, con soporte de geolocalización y un diseño responsivo que pasa de una sola tarjeta a una cuadrícula de varios días.',
    project1Feat1: 'Consulta de pronóstico en vivo por ciudad o geolocalización',
    project1Feat2: 'Diseño responsivo: una tarjeta → cuadrícula de varios días',
    project2Desc: 'Un rastreador de hábitos diarios que guarda el progreso en almacenamiento local, con un calendario de rachas y una lista de hábitos que se puede reordenar arrastrando — sin backend, sin proceso de compilación.',
    project2Feat1: 'Calendario de rachas basado en Web Storage',
    project2Feat2: 'Lista de hábitos reordenable arrastrando',
    project3Desc: 'Un catálogo de productos hecho con React, que obtiene datos en vivo desde una API REST pública. Incluye filtrado por categoría, un carrito persistente mediante Context, y una cuadrícula totalmente responsiva.',
    project3Feat1: 'Filtrado por categoría en todo el catálogo',
    project3Feat2: 'Carrito persistente mediante React Context',
    project3Feat3: 'Cuadrícula de productos totalmente responsiva',
    projectStatusConcept: 'Concepto — todavía no construido. Los enlaces de demo y código aparecerán aquí cuando esté listo.',
    linkLiveSite: 'Sitio en vivo →',
    linkSource: 'Código →',
    aboutEyebrow: 'Sobre mí',
    aboutHeading: 'Un poco sobre cómo trabajo',
    aboutBio1: 'Soy un desarrollador front-end afincado en Toledo, y me importa la parte del trabajo que mucha gente se salta: si este diseño aguanta en cualquier pantalla, si alguien que solo usa el teclado puede navegarlo de verdad, si el marcado tiene sentido para quien lo lea después sin contexto. Eso es lo que disfruto.',
    aboutBio2: 'Ahora mismo estoy metido de lleno en React y TypeScript, convirtiendo ideas de proyectos en cosas que realmente funcionan en un navegador en vez de quedarse en bocetos. Busco un puesto junior de front-end o trabajo freelance donde pueda seguir construyendo — y seguir mejorando.',
    factSemantic: 'HTML semántico',
    factAccessible: 'contraste WCAG',
    factResponsive: 'diseño mobile-first',
    skillsEyebrow: 'Habilidades',
    skillsHeading: 'Con qué trabajo',
    skillsCore: 'Básico',
    skillsTools: 'Herramientas',
    skillsPractices: 'Prácticas',
    practiceResponsive: 'Diseño responsivo',
    practiceAccessibility: 'Accesibilidad',
    practiceTesting: 'Pruebas',
    practiceRest: 'APIs REST',
    contactEyebrow: 'Contacto',
    contactHeading: 'Trabajemos juntos',
    contactLede: 'Actualmente estoy abierto a nuevas oportunidades y trabajo freelance. La forma más rápida de contactarme es por correo.',
    contactResume: 'Currículum (PDF)',
    footerBackToTop: 'volver arriba ↑',
    pageTitle: 'ayman salim — Desarrollador Front-End',
    pageDescription: 'Desarrollador front-end especializado en React y TypeScript, creando interfaces web rápidas, responsivas y accesibles.',
  },
};

const langToggle = document.getElementById('langToggle');
const metaDescription = document.querySelector('meta[name="description"]');

function applyLanguage(lang) {
  const dict = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = dict[el.getAttribute('data-i18n')];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', dict[el.getAttribute('data-i18n-aria')]);
  });

  document.documentElement.lang = lang;
  document.title = dict.pageTitle;
  metaDescription.setAttribute('content', dict.pageDescription);

  // Button shows the CURRENT language, so it always matches what's on screen.
  langToggle.textContent = lang.toUpperCase();

  localStorage.setItem('lang', lang);
}

let currentLang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
applyLanguage(currentLang);

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  applyLanguage(currentLang);
});
