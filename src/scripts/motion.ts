/**
 * Motion runtime. Phase 20, cut back hard in Phase 21.
 *
 * One module, loaded once from BaseLayout, owning every animation on the site.
 * Nothing else may import GSAP — if a page needs motion it declares it with a
 * `data-*` attribute and this file decides what that means, so the vocabulary
 * stays small and consistent across pages.
 *
 * The attribute vocabulary, after Phase 21:
 *   data-reveal="up|fade|scale"   fade the element in when it enters view
 *   data-reveal-delay="0.15"      seconds, added to that element's start
 *   data-reveal-stagger           on a PARENT: its [data-reveal] children run
 *                                 as one staggered batch instead of separately
 *   data-hero                     on a PARENT: plays once on load, not on scroll
 *
 * What Phase 21 removed, and why:
 *
 *   data-split="words"  The statement that brightened word by word on scroll.
 *                       This was Linear's "Designed in California" section
 *                       almost exactly, and Linear is where the whole dark-SaaS
 *                       look comes from — so the borrowed move imported the
 *                       association with it. Gone, along with SplitText.
 *   data-split="lines"  The line-by-line mask reveal. Kept nothing back for it:
 *                       those elements now use a plain [data-reveal], which
 *                       reads nearly the same at a fraction of the machinery
 *                       and drops the fonts.ready race that gated real copy.
 *   Lenis               Smooth scroll. It is the single strongest "this is a
 *                       template" signal left in the site, and it overrides a
 *                       preference the reader already set in their OS. The
 *                       lightbox's data-lenis-stop went with it: a modal
 *                       <dialog> already blocks background scrolling natively.
 *   data-parallax       Never used by a single page. Dead code.
 *   initNav             The nav no longer floats, so it has no scrolled state
 *                       and nothing to hide on the way down.
 *
 * Contract with global.css: the hidden resting states live under `.js`, which
 * is set by a blocking inline script in <head>. This module's job is to undo
 * them. If it throws, or never loads, the page is still fully legible — that
 * is why the states are CSS-owned rather than set from here.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Timing, in one place.
 *
 * Retuned after review: the first pass ran ~1s per reveal on power3.out, which
 * decelerates hard and long — it reads as sluggish even though the numbers
 * looked reasonable. Shorter durations on a softer curve (power2.out), less
 * travel, and tighter staggers make the same choreography feel quicker AND
 * calmer, because the eye spends less time watching a thing ease to a stop.
 */
const EASE = 'power2.out';
const DUR = 0.55;
const STAGGER = 0.045;

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
} else {
  initReveals();
  initHero();
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
      duration: DUR,
      ease: EASE,
      stagger: STAGGER,
      // Start a little earlier than the element's own trigger below: a grid
      // finishes its stagger later than a single element starts, so matching
      // the two would land the last card after it is already well in view.
      scrollTrigger: { trigger: parent, start: 'top 92%', once: true },
      onComplete: () => children.forEach((c) => c.setAttribute('data-revealed', '')),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (grouped.has(el) || el.closest('[data-hero]')) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: DUR,
      delay: parseFloat(el.dataset.revealDelay ?? '0'),
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onComplete: () => el.setAttribute('data-revealed', ''),
    });
  });
}

/**
 * Resolves when webfonts are ready, or after `ms`, whichever comes first.
 * Never rejects — a caller that gates visible content on this must not be able
 * to lose that race.
 */
function fontsReadyOrTimeout(ms: number): Promise<void> {
  const ready = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([
    ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]).catch(() => undefined);
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

  fontsReadyOrTimeout(2000).then(() => {
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: EASE,
      stagger: 0.06,
      delay: 0.05,
    });
  });
}
