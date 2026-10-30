(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav ganha fundo ao rolar; o botão só aparece depois da primeira dobra
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    nav.classList.toggle('is-past-hero', !hero || window.scrollY > hero.offsetHeight - nav.offsetHeight);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Aviso de cookies: guarda a escolha e repassa ao GTM (Consent Mode + evento no dataLayer)
  const cookie = document.querySelector('[data-cookie]');
  if (cookie) {
    const KEY = 'asa-consent';
    const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
    const choose = (value) => {
      try { localStorage.setItem(KEY, value); } catch (e) { /* navegação privada: vale só nesta visita */ }
      const state = value === 'granted' ? 'granted' : 'denied';
      window.dataLayer = window.dataLayer || [];
      // O Consent Mode só reconhece o objeto arguments, como o gtag() oficial empurra
      (function gtag() { window.dataLayer.push(arguments); })('consent', 'update', { ad_storage: state, analytics_storage: state, ad_user_data: state, ad_personalization: state });
      window.dataLayer.push({ event: `cookie_consent_${state}` });
      cookie.hidden = true;
    };
    if (!read()) cookie.hidden = false;
    cookie.querySelector('[data-cookie-accept]').addEventListener('click', () => choose('granted'));
    cookie.querySelector('[data-cookie-deny]').addEventListener('click', () => choose('denied'));
    document.querySelectorAll('[data-cookie-open]').forEach((b) => b.addEventListener('click', () => { cookie.hidden = false; }));
  }

  // Glow interno dos cards de vidro segue o cursor
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.glass').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  if (reduce) {
    root.classList.remove('motion');
    return;
  }

  // GSAP só entra depois que a página terminou de carregar: o primeiro paint e o LCP
  // não esperam pelas animações.
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  const start = () => loadScript('js/vendor/gsap.min.js')
    .then(() => loadScript('js/vendor/ScrollTrigger.min.js'))
    .then(initMotion)
    .catch(() => root.classList.remove('motion'));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  function initMotion() {
    // O fallback do <head> já pode ter revelado tudo; nesse caso não anima mais nada
    if (!root.classList.contains('motion')) return;
    window.__motion = true;
    gsap.registerPlugin(ScrollTrigger);
    const ease = 'power2.out';
    const fadeIn = { opacity: 1, y: 0, duration: 0.8, ease };

    // Demais blocos: aparecem uma vez ao entrar na tela
    ScrollTrigger.batch('[data-reveal], [data-card], .h2', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 14 }, { ...fadeIn, stagger: 0.06 }),
    });

    // Parallax leve
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { '--py': '0px' }, {
        '--py': `${el.dataset.parallax}px`,
        ease: 'none',
        // No hero o parallax começa no scroll 0; senão o elemento pula quando o GSAP carrega
        scrollTrigger: el.closest('.hero')
          ? { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
          : { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });

    // Riscos sobre o que o aluno não precisa fazer
    gsap.utils.toArray('.strike').forEach((el, i) => {
      gsap.fromTo(el, { '--strike': 0 }, {
        '--strike': 1, duration: 0.6, ease: 'power2.inOut', delay: 0.3 + i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Feed automático: mensagens chegando em loop
    const feed = gsap.utils.toArray('[data-feed]');
    if (feed.length) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, paused: true });
      tl.set(feed, { opacity: 0, y: 8 });
      feed.forEach((m, i) => {
        tl.to(m, { opacity: 1, y: 0, duration: 0.5, ease }, i * 0.9);
      });
      tl.to({}, { duration: 2 });
      ScrollTrigger.create({
        trigger: '.diff__visual', start: 'top 80%', end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
      gsap.fromTo('.clock__arc', { strokeDashoffset: 1232 }, {
        strokeDashoffset: 400, ease: 'none',
        scrollTrigger: { trigger: '.diff', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    }
  }
})();
