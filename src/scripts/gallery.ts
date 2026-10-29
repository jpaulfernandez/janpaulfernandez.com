/**
 * gallery.ts — the only gallery client code (Phase 35, ≤ 6 KB gzip).
 *
 *   initDensity(grid)  /gallery/ only: photos per row via the − / + buttons,
 *                      `-` / `=` keys, ⌘/Ctrl + wheel and a two-finger pinch.
 *                      It writes one custom property (`--cols`) and each
 *                      thumbnail's `sizes`; everything else is CSS.
 *   initViewer()       both gallery pages: binds every `a.photo-trigger` to
 *                      the <dialog id="photo-modal"> in Lightbox.astro (that
 *                      file documents the data-* contract). Swipe / arrows,
 *                      pinch-zoom 1–4×, double-tap 2×, pan when zoomed.
 *
 * Pages import what they need, so the set pages ship the viewer only. Nothing
 * animates, so prefers-reduced-motion has nothing to switch off.
 */

type Point = { x: number; y: number };

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const pointsOf = (m: Map<number, Point>) => [...m.values()];

/* ---------------------------------------------------------------- density */

const LEVELS = { phone: [3, 5, 7], wide: [4, 6, 8, 12] };
const KEY = 'gallery-cols';

export function initDensity(grid: HTMLElement | null) {
  if (!grid) return;
  const wide = matchMedia('(min-width: 48rem)');
  const out = document.getElementById('density-out') as HTMLButtonElement;
  const inn = document.getElementById('density-in') as HTMLButtonElement;
  const readout = document.getElementById('density-level')!;
  const imgs = grid.querySelectorAll('img');
  const levels = () => (wide.matches ? LEVELS.wide : LEVELS.phone);
  let cols = 0;

  const setCols = (n: number, persist: boolean) => {
    const list = levels();
    cols = n;
    grid.style.setProperty('--cols', String(n));
    // A 12-across level must not keep 720px files; 4-across must not stay soft.
    imgs.forEach((img) => (img.sizes = `${(100 / n).toFixed(1)}vw`));
    readout.textContent = `${n} per row`;
    out.disabled = n === list[list.length - 1];
    inn.disabled = n === list[0];
    if (persist) {
      try { localStorage.setItem(KEY, String(n)); } catch {}
    }
  };

  // A stored level counts only if this breakpoint offers it.
  const resolve = () => {
    let stored = 0;
    try { stored = Number(localStorage.getItem(KEY)); } catch {}
    setCols(levels().includes(stored) ? stored : wide.matches ? 6 : 3, false);
  };

  // +1 = zoom out (more per row, as in Photos), -1 = zoom in.
  const step = (dir: number) => {
    const list = levels();
    const i = clamp(list.indexOf(cols) + dir, 0, list.length - 1);
    if (list[i] !== cols) setCols(list[i], true);
  };

  out.addEventListener('click', () => step(1));
  inn.addEventListener('click', () => step(-1));
  wide.addEventListener('change', resolve);

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector('dialog[open]')) return;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.key === '-') step(1);
    else if (e.key === '=' || e.key === '+') step(-1);
  });

  // ⌘/Ctrl + wheel, which is also what a desktop trackpad pinch sends. One
  // flick is one step; a plain wheel scrolls the page as usual.
  let acc = 0;
  grid.addEventListener(
    'wheel',
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) >= 60) {
        step(Math.sign(acc));
        acc = 0;
      }
    },
    { passive: false }
  );

  // Two-finger pinch: every 25% change in finger distance is one level.
  const pts = new Map<number, Point>();
  let d0 = 0;
  let pinched = false;
  const up = (e: PointerEvent) => {
    pts.delete(e.pointerId);
    if (pts.size < 2) d0 = 0;
    if (!pts.size && pinched) setTimeout(() => (pinched = false), 300);
  };
  grid.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) d0 = distance(...(pointsOf(pts) as [Point, Point]));
  });
  grid.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size !== 2 || !d0) return;
    const d = distance(...(pointsOf(pts) as [Point, Point]));
    const r = d / d0;
    if (r > 1.25 || r < 0.8) {
      step(r > 1 ? -1 : 1);
      d0 = d;
      pinched = true;
    }
  });
  grid.addEventListener('pointerup', up);
  grid.addEventListener('pointercancel', up);
  // Lifting the fingers over a thumbnail must not open the viewer.
  grid.addEventListener(
    'click',
    (e) => {
      if (!pinched) return;
      e.preventDefault();
      e.stopPropagation();
      pinched = false;
    },
    true
  );

  resolve();
}
