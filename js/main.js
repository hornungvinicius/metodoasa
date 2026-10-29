(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav ganha fundo ao rolar
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Glow interno dos cards segue o cursor
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power4.out';
  const shown = 'inset(0% 0% 0% 0%)';

  // Quebra a headline nas linhas reais (mede a largura atual) e envolve cada uma numa máscara.
  // Ao terminar a animação o HTML original volta, então o texto continua refluindo no resize.
  const splitLines = (el) => {
    const original = el.innerHTML;
    const words = [];
    const walk = (node, cls) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, cls }));
        } else if (n.nodeType === 1) {
          walk(n, n.className || cls);
        }
      });
    };
    walk(el, '');
    el.innerHTML = words.map(({ w, cls }) => `<span class="w${cls ? ` ${cls}` : ''}">${w}</span>`).join(' ');
    const lines = [];
    let top = null;
    el.querySelectorAll('.w').forEach((span) => {
      if (span.offsetTop !== top) { lines.push([]); top = span.offsetTop; }
      lines[lines.length - 1].push(span.outerHTML);
    });
    el.innerHTML = lines.map((l) => `<span class="line-mask"><span class="line">${l.join(' ')}</span></span>`).join('');
    el.dataset.split = '';
    return { lines: el.querySelectorAll('.line'), restore: () => { el.innerHTML = original; } };
  };

  const revealHeading = (el, vars) => {
    const { lines, restore } = splitLines(el);
    gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.15, ease, stagger: 0.08, onComplete: restore, ...vars });
  };

  document.fonts.ready.then(() => {
    revealHeading(document.querySelector('.hero__title'), { delay: 0.1 });
    document.querySelectorAll('.h2').forEach((h) => {
      revealHeading(h, { scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    ScrollTrigger.refresh();
  });

  // Reveals com clip-path (de baixo para cima)
  const heroReveals = document.querySelectorAll('.hero [data-reveal]');
  gsap.fromTo(heroReveals, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 }, {
    clipPath: shown, y: 0, duration: 1, ease, stagger: 0.08, delay: 0.45,
  });

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 }, {
      clipPath: shown, y: 0, duration: 1, ease,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // Cards: wipe diagonal em grupo
  ScrollTrigger.batch('[data-card]', {
    start: 'top 88%',
    onEnter: (batch) => gsap.fromTo(batch,
      { clipPath: 'inset(0% 0% 100% 0% round 22px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.1, ease: 'expo.out', stagger: 0.1 }),
  });

  // Hero: celulares entram por máscara e depois fazem parallax
  gsap.fromTo('.hero .device, .hero .feed', { clipPath: 'inset(100% 0% 0% 0% round 46px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 46px)', duration: 1.4, ease: 'expo.out', stagger: 0.15, delay: 0.3,
    onComplete() { gsap.set(this.targets(), { clearProps: 'clipPath' }); },
  });
  gsap.from('.hero .obj', { autoAlpha: 0, duration: 1.2, ease: 'power2.out', stagger: 0.12, delay: 0.7 });

  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { '--py': '0px' }, {
      '--py': `${el.dataset.parallax}px`,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Texto gigante de fundo desliza na horizontal
  gsap.utils.toArray('[data-drift]').forEach((el) => {
    gsap.fromTo(el, { xPercent: 8 }, {
      xPercent: -8, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Riscos sobre o que o aluno não precisa fazer
  gsap.utils.toArray('.strike').forEach((el, i) => {
    gsap.fromTo(el, { '--strike': 0 }, {
      '--strike': 1, duration: 0.8, ease: 'power3.inOut', delay: 0.3 + i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Linha da timeline cresce com o scroll
  gsap.fromTo('.steps__line', { '--progress': 0 }, {
    '--progress': 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true },
  });

  // Contador do resultado
  const counter = document.querySelector('[data-count]');
  if (counter) {
    const target = { v: 0 };
    gsap.to(target, {
      v: Number(counter.dataset.count), duration: 1.6, ease: 'power3.out',
      onUpdate: () => { counter.textContent = Math.round(target.v); },
      scrollTrigger: { trigger: counter, start: 'top 85%' },
    });
  }
  gsap.fromTo('.big-result__n, .big-result__t', { clipPath: 'inset(0% 100% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '.results__copy', start: 'top 80%' },
  });

  // Prova: celular com o print e o card flutuante sobem por máscara
  gsap.fromTo('.proof > *', { clipPath: 'inset(100% 0% 0% 0% round 24px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.3, ease: 'expo.out', stagger: 0.15,
    scrollTrigger: { trigger: '.proof', start: 'top 80%' },
    onComplete() { gsap.set(this.targets(), { clearProps: 'clipPath' }); },
  });

  // Feed automático: mensagens chegando em loop
  const feed = gsap.utils.toArray('[data-feed]');
  if (feed.length) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true });
    tl.set(feed, { clipPath: 'inset(0% 0% 100% 0% round 12px)', y: 16 });
    feed.forEach((m, i) => {
      tl.to(m, { clipPath: 'inset(0% 0% 0% 0% round 12px)', y: 0, duration: 0.6, ease: 'expo.out' }, i * 0.9);
    });
    tl.to({}, { duration: 2 });
    ScrollTrigger.create({
      trigger: '.diff__visual', start: 'top 80%', end: 'bottom top',
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    gsap.fromTo('.clock__arc', { strokeDashoffset: 1232 }, {
      strokeDashoffset: 400, ease: 'none',
      scrollTrigger: { trigger: '.diff', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
})();
