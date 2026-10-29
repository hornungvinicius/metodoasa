(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav ganha fundo ao rolar
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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

  // Carrossel de prints: setas, barra de progresso e arraste nativo
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const bar = carousel.parentElement.querySelector('.carousel__bar');
    const step = () => {
      const item = track.querySelector('.carousel__item');
      return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : track.clientWidth;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const progress = max > 0 ? track.scrollLeft / max : 0;
      if (bar) {
        bar.style.setProperty('--bar-w', `${visible * 100}%`);
        bar.style.setProperty('--bar-x', `${progress * (1 / visible - 1) * 100}%`);
      }
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power2.out';
  const fadeIn = { opacity: 1, y: 0, duration: 0.8, ease };

  // Hero: entrada única e discreta
  gsap.fromTo('.hero .h1, .hero [data-reveal]', { opacity: 0, y: 14 }, { ...fadeIn, stagger: 0.07, delay: 0.1 });
  gsap.from('.hero .device, .hero .feed, .hero .obj', { opacity: 0, y: 20, duration: 1, ease, stagger: 0.06, delay: 0.25 });

  // Demais blocos: aparecem uma vez ao entrar na tela
  ScrollTrigger.batch('[data-reveal], [data-card], .h2', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch.filter((el) => !el.closest('.hero')), { opacity: 0, y: 14 }, { ...fadeIn, stagger: 0.06 }),
  });

  // Parallax leve
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { '--py': '0px' }, {
      '--py': `${el.dataset.parallax}px`,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });

  // Riscos sobre o que o aluno não precisa fazer
  gsap.utils.toArray('.strike').forEach((el, i) => {
    gsap.fromTo(el, { '--strike': 0 }, {
      '--strike': 1, duration: 0.6, ease: 'power2.inOut', delay: 0.3 + i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // Contador do resultado
  const counter = document.querySelector('[data-count]');
  if (counter) {
    const target = { v: 0 };
    gsap.to(target, {
      v: Number(counter.dataset.count), duration: 1.4, ease: 'power2.out',
      onUpdate: () => { counter.textContent = Math.round(target.v); },
      scrollTrigger: { trigger: counter, start: 'top 85%', once: true },
    });
  }

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
})();
