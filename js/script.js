(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Header: sombra ao rolar
  ------------------------------------------------------------------ */
  const header = document.getElementById('site-header');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------
     Menu mobile
  ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  /* ------------------------------------------------------------------
     Revelação suave ao rolar
  ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     Comparador Antes / Depois
  ------------------------------------------------------------------ */
  class ComparisonSlider {
    constructor(root, { onImageClick } = {}) {
      this.root = root;
      this.before = root.querySelector('[data-before]');
      this.handle = root.querySelector('[data-handle]');
      this.onImageClick = onImageClick;
      this.value = 50;
      this.dragging = false;

      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleClick = this.handleClick.bind(this);

      this.bindEvents();
      this.set(this.value);
    }

    set(percent) {
      this.value = Math.min(100, Math.max(0, percent));
      this.before.style.clipPath = `inset(0 ${100 - this.value}% 0 0)`;
      this.handle.style.left = `${this.value}%`;
      this.handle.setAttribute('aria-valuenow', String(Math.round(this.value)));
    }

    percentFromClientX(clientX) {
      const rect = this.root.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    bindEvents() {
      this.handle.addEventListener('pointerdown', this.handlePointerDown);
      this.handle.addEventListener('keydown', this.handleKeydown);
      this.root.addEventListener('click', this.handleClick);
    }

    handlePointerDown(event) {
      event.preventDefault();
      this.dragging = true;
      this.root.classList.add('is-dragging');
      this.handle.setPointerCapture(event.pointerId);
      window.addEventListener('pointermove', this.handlePointerMove);
      window.addEventListener('pointerup', this.handlePointerUp);
    }

    handlePointerMove(event) {
      if (!this.dragging) return;
      this.set(this.percentFromClientX(event.clientX));
    }

    handlePointerUp() {
      this.dragging = false;
      this.root.classList.remove('is-dragging');
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
    }

    handleKeydown(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.set(this.value - 5);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.set(this.value + 5);
      }
    }

    handleClick(event) {
      if (event.target.closest('[data-handle]')) return;

      if (this.onImageClick) {
        this.onImageClick(event);
        return;
      }

      this.set(this.percentFromClientX(event.clientX));
    }
  }

  /* ------------------------------------------------------------------
     Lightbox
  ------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImgBefore = document.getElementById('lightbox-img-before');
  const lightboxImgAfter = document.getElementById('lightbox-img-after');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxComparisonRoot = document.getElementById('lightbox-comparison');

  let lastFocusedElement = null;
  let lightboxSliderInstance = null;

  const openLightbox = (card, triggerEl) => {
    const beforeImg = card.querySelector('[data-before] img');
    const afterImg = card.querySelector('.comparison-slider__pane--after img');

    lightboxImgBefore.src = beforeImg.src;
    lightboxImgBefore.alt = beforeImg.alt;
    lightboxImgAfter.src = afterImg.src;
    lightboxImgAfter.alt = afterImg.alt;
    lightboxTitle.textContent = card.dataset.title || '';
    lightboxDesc.textContent = card.dataset.desc || '';

    lastFocusedElement = triggerEl;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';

    if (!lightboxSliderInstance) {
      lightboxSliderInstance = new ComparisonSlider(lightboxComparisonRoot);
    } else {
      lightboxSliderInstance.set(50);
    }

    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ------------------------------------------------------------------
     Inicializar sliders da galeria
  ------------------------------------------------------------------ */
  document.querySelectorAll('.gallery [data-comparison]').forEach((card) => {
    // eslint-disable-next-line no-new
    new ComparisonSlider(card, {
      onImageClick: () => openLightbox(card, card),
    });
  });
})();
