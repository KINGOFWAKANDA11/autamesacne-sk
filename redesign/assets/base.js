/* AutoMesacne.sk redesign — shared behaviors (expects gsap + ScrollTrigger loaded) */

/* ANALYTICS: dataLayer events; GA4/GTM ID doplniť pri nasadení do <head> */
window.dataLayer = window.dataLayer || [];
window.amTrack = function (event, params) {
  window.dataLayer.push(Object.assign({ event: event }, params || {}));
  if (typeof gtag === 'function') gtag('event', event, params || {});
};

(function () {
  /* auto-tracking CTA klikov */
  document.addEventListener('click', e => {
    const a = e.target.closest('a.btn, .callback, .nav-phone, .sc-tel');
    if (!a) return;
    amTrack('cta_click', {
      cta_text: (a.textContent || '').trim().slice(0, 60) || 'phone',
      cta_href: a.getAttribute('href') || '',
      page: location.pathname.split('/').pop() || 'index.html'
    });
  });

  /* HAMBURGER */
  const burger = document.querySelector('.nav-burger');
  const mmenu = document.querySelector('.mobile-menu');
  if (burger && mmenu) {
    burger.addEventListener('click', () => {
      const open = !mmenu.classList.contains('open');
      mmenu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mmenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* LIGHTBOX pre [data-lightbox] obrázky */
  const lbImgs = document.querySelectorAll('[data-lightbox] img, img[data-lightbox]');
  if (lbImgs.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Zavrieť">&times;</button><img alt=""><div class="lb-cap"></div>';
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lb-cap');
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    lb.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    lbImgs.forEach(img => {
      const holder = img.closest('[data-lightbox]') || img;
      holder.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        lbImg.src = img.src;
        lbCap.textContent = img.alt || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }
})();

(function () {
  const hasGsap = typeof gsap !== 'undefined';
  if (!hasGsap) { document.documentElement.classList.add('no-gsap'); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  /* CURSOR */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    window.addEventListener('mousemove', e => {
      gsap.to(dot, { x: e.clientX - 3, y: e.clientY - 3, duration: 0.08 });
      gsap.to(ring, { x: e.clientX - 18, y: e.clientY - 18, duration: 0.28, ease: 'power2.out' });
    });
    document.querySelectorAll('a, button, input, select, textarea, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* NAV BG */
  const nav = document.querySelector('nav.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* REVEALS */
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* COUNTERS */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(o, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) })
    });
  });

  /* FAQ */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.q').addEventListener('click', () => {
      const a = item.querySelector('.a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* GENERIC FILTER CHIPS: .chip[data-filter] filters [data-type] items in target grid */
  document.querySelectorAll('[data-filter-row]').forEach(row => {
    const gridSel = row.dataset.filterRow;
    row.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.filter;
        document.querySelectorAll(gridSel + ' [data-type]').forEach(card => {
          const show = f === 'all' || card.dataset.type === f;
          card.style.display = show ? '' : 'none';
        });
        ScrollTrigger.refresh();
      });
    });
  });
})();
