/**
 * Phase 20 motion runtime.
 *
 * One module, loaded once from BaseLayout, owning every animation on the site.
 * Nothing else may import GSAP — if a page needs motion it declares it with a
 * `data-*` attribute and this file decides what that means, so the vocabulary
 * stays small and consistent across pages.
 *
 * The attribute vocabulary:
 *   data-reveal="up|fade|scale"   fade the element in when it enters view
 *   data-reveal-delay="0.15"      seconds, added to that element's start
 *   data-reveal-stagger           on a PARENT: its [data-reveal] children run
 *                                 as one staggered batch instead of separately
 *   data-split="words"            scrub word-by-word from dim to white
 *   data-split="lines"            mask-reveal line by line on enter
 *   data-parallax="-0.15"         translateY as a fraction of scroll distance
 *   data-hero                     on a PARENT: plays once on load, not on scroll
 *   data-lenis-stop               on a <dialog>: pause smooth scroll while open
 *
 * Contract with global.css: the hidden resting states live under `.js`, which
 * is set by a blocking inline script in <head>. This module's job is to undo
 * them. If it throws, or never loads, the page is still fully legible — that
 * is why the states are CSS-owned rather than set from here.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The site's one easing curve, matching --ease-out-quint in global.css. */
const EASE = 'power3.out';

/** Endpoints for the word-brightening scrub — see initSplits(). */
const DIM_WORD = '#6B6663';
const BRIGHT_WORD = '#FFFFFF';

/* ---------------------------------------------------------------------------
 * Reduced motion: show everything, wire nothing. The CSS media query already
 * neutralises the resting states; this stops us from attaching triggers that
 * would fight it.
 * ------------------------------------------------------------------------ */
if (reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    el.style.visibility = 'visible';
  });
} else {
  initSmoothScroll();
  initReveals();
  initSplits();
  initParallax();
  initHero();
}

/* Runs regardless of motion preference — these are behaviour, not decoration. */
initNav();
initClock();

/* ---------------------------------------------------------------------------
 * Smooth scroll. Lenis drives ScrollTrigger rather than the other way round,
 * so every scrubbed timeline reads the eased position instead of the raw one.
 * ------------------------------------------------------------------------ */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch devices already have momentum scrolling that feels better than
    // anything we can synthesise, and hijacking it costs us the address-bar
    // collapse on mobile Safari.
    syncTouch: false,
  });

  // Expose it so the lightbox and in-page anchors can talk to it without
  // importing this module (they are inline scripts in their own components).
  (window as unknown as { lenis: Lenis }).lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page anchors: hand them to Lenis so they ease instead of jumping.
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: -112 });
  });

  // A <dialog> that opens over the page must not leave the page scrolling
  // behind it. The lightbox marks itself with data-lenis-stop.
  document.querySelectorAll<HTMLDialogElement>('dialog[data-lenis-stop]').forEach((dialog) => {
    new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start()))
      .observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
}

/* ---------------------------------------------------------------------------
 * Reveals. Elements inside a [data-reveal-stagger] parent animate together as
 * one batch — otherwise a grid of six cards fires six near-identical triggers
 * and the eye reads it as noise rather than a sequence.
 * ------------------------------------------------------------------------ */
function initReveals() {
  const grouped = new Set<Element>();

  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((parent) => {
    const children = [...parent.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (!children.length) return;
    children.forEach((child) => grouped.add(child));

    gsap.to(children, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      onComplete: () => children.forEach((c) => c.setAttribute('data-revealed', '')),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (grouped.has(el) || el.closest('[data-hero]')) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      delay: parseFloat(el.dataset.revealDelay ?? '0'),
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => el.setAttribute('data-revealed', ''),
    });
  });
}

/* ---------------------------------------------------------------------------
 * Split text.
 *
 *   words — the statement starts dim and brightens word by word as it crosses
 *           the viewport. Scrubbed, so it tracks the scrollbar exactly.
 *   lines — each line rises out of its own clip on enter. Played, not scrubbed.
 *
 * Both wait on document.fonts.ready: splitting before Switzer arrives measures
 * the fallback's line breaks and the mask lands in the wrong places.
 * ------------------------------------------------------------------------ */
function initSplits() {
  const targets = document.querySelectorAll<HTMLElement>('[data-split]');
  if (!targets.length) return;

  document.fonts.ready.then(() => {
    targets.forEach((el) => {
      const mode = el.dataset.split;
      el.style.visibility = 'visible';

      if (mode === 'words') {
        const split = new SplitText(el, { type: 'words', wordsClass: 'split-word' });
        // Literal hex, not var(): GSAP interpolates colour channel by channel
        // and cannot read through a custom property to find them. These two
        // must stay in step with --color-paper-600 / --color-paper-50.
        gsap.set(split.words, { color: DIM_WORD });
        gsap.to(split.words, {
          color: BRIGHT_WORD,
          stagger: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        });
        return;
      }

      // "lines" — and the default for any other value.
      const split = new SplitText(el, {
        type: 'lines',
        linesClass: 'split-child',
        // Each line gets its own overflow:hidden wrapper to clip the rise.
        mask: 'lines',
      });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1,
        ease: EASE,
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    ScrollTrigger.refresh();
  });
}

/* ---------------------------------------------------------------------------
 * Parallax. Fractional — data-parallax="-0.2" moves the element up by 20% of
 * the distance it travels through the viewport.
 * ------------------------------------------------------------------------ */
function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax ?? '-0.15');
    gsap.fromTo(
      el,
      { yPercent: -depth * 50 },
      {
        yPercent: depth * 50,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

/* ---------------------------------------------------------------------------
 * Hero. One timeline on load rather than a scroll trigger, because the hero is
 * already in view — a scroll trigger would fire at the same instant but with a
 * frame of flicker while ScrollTrigger measures.
 * ------------------------------------------------------------------------ */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const items = hero.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  document.fonts.ready.then(() => {
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: EASE,
      stagger: 0.1,
      delay: 0.15,
    });
  });
}

/* ---------------------------------------------------------------------------
 * Nav. Solidifies once the page has moved off the top, and gets out of the way
 * when scrolling down on small screens where it covers real estate.
 * ------------------------------------------------------------------------ */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  let last = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    nav.dataset.scrolled = y > 24 ? 'true' : 'false';
    // Only hide well down the page, so the toggle never fires during the
    // small bounce at the top of a short page.
    nav.dataset.hidden = String(y > 320 && y > last && !nav.dataset.menuOpen);
    last = y;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------------------------------------------------------------------------
 * Clock. Manila time in the nav and the footer — the site is written from the
 * Philippines and saying so in the chrome is cheaper than saying so in copy.
 * ------------------------------------------------------------------------ */
function initClock() {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!clocks.length) return;

  const format = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });

  const tick = () => {
    const now = format.format(new Date());
    clocks.forEach((el) => (el.textContent = now));
  };

  tick();
  setInterval(tick, 10_000);
}
