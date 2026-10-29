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

/* ----------------------------------------------------------------- viewer */

export function initViewer() {
  const dialog = document.getElementById('photo-modal') as HTMLDialogElement | null;
  if (!dialog) return;
  const $ = (id: string) => document.getElementById(id)!;
  const img = $('modal-img') as HTMLImageElement;
  const caption = $('modal-caption');
  const link = $('modal-link') as HTMLAnchorElement;
  const counter = $('modal-counter');
  const close = $('modal-close');
  const stage = dialog.querySelector<HTMLElement>('.lightbox-image-wrap')!;
  const triggers = [...document.querySelectorAll<HTMLAnchorElement>('.photo-trigger')];
  let current = 0;

  // Zoom state: img transform = translate(tx, ty) scale(s), origin centre.
  let s = 1;
  let tx = 0;
  let ty = 0;

  const apply = () => {
    // Keep the image covering the stage: no panning past its edges.
    const w = img.offsetWidth * s;
    const h = img.offsetHeight * s;
    const mx = Math.max(0, (w - stage.clientWidth) / 2);
    const my = Math.max(0, (h - stage.clientHeight) / 2);
    tx = clamp(tx, -mx, mx);
    ty = clamp(ty, -my, my);
    img.style.transform = s === 1 ? '' : `translate(${tx}px, ${ty}px) scale(${s})`;
  };

  // Scale to `next`, keeping the image point under `p` where it is.
  const zoomAt = (next: number, p: Point) => {
    next = clamp(next, 1, 4);
    const r = img.getBoundingClientRect();
    const cx = r.left + r.width / 2 - tx;
    const cy = r.top + r.height / 2 - ty;
    tx = p.x - cx - ((p.x - cx - tx) * next) / s;
    ty = p.y - cy - ((p.y - cy - ty) * next) / s;
    s = next;
    if (s === 1) tx = ty = 0;
    apply();
  };

  const show = (i: number) => {
    const n = triggers.length;
    current = (i + n) % n;
    const { src = '', alt = '', caption: text = '', href = '', hrefLabel = '' } =
      triggers[current].dataset;
    s = 1;
    tx = ty = 0;
    img.style.transform = '';
    img.src = src;
    img.alt = alt;
    caption.textContent = text;
    link.hidden = !href;
    if (href) {
      link.href = href;
      link.textContent = `from ${hrefLabel}`;
    }
    counter.textContent = `${current + 1} / ${n}`;
    for (const j of [current + 1, current - 1]) {
      const next = triggers[(j + n) % n].dataset.src;
      if (next) new Image().src = next;
    }
  };

  triggers.forEach((t, i) =>
    t.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
      dialog.showModal();
      close.focus();
    })
  );

  close.addEventListener('click', () => dialog.close());
  $('modal-prev').addEventListener('click', () => show(current - 1));
  $('modal-next').addEventListener('click', () => show(current + 1));

  // Esc is the dialog's own `cancel`. Focus goes back to the thumbnail of the
  // photo the visitor ended on, which may not be the one they opened.
  dialog.addEventListener('close', () => {
    const t = triggers[current];
    t.focus();
    t.scrollIntoView({ block: 'nearest' });
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // Pointer gestures on the stage. Moves and lifts are heard on the dialog
  // so a drag that leaves the stage still ends cleanly.
  const pts = new Map<number, Point>();
  let start: Point = { x: 0, y: 0 };
  let last: Point = { x: 0, y: 0 };
  let d0 = 0;
  let s0 = 1;
  let gesture = false;
  let tap = { t: 0, x: 0, y: 0 };

  stage.addEventListener('pointerdown', (e) => {
    const p = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, p);
    if (pts.size === 1) {
      start = last = p;
      gesture = false;
    } else if (pts.size === 2) {
      d0 = distance(...(pointsOf(pts) as [Point, Point]));
      s0 = s;
      gesture = true;
    }
  });

  dialog.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const p = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, p);
    if (pts.size === 2 && d0) {
      const [a, b] = pointsOf(pts);
      zoomAt((s0 * distance(a, b)) / d0, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    } else if (pts.size === 1) {
      if (distance(p, start) > 10) gesture = true;
      if (s > 1) {
        tx += p.x - last.x;
        ty += p.y - last.y;
        apply();
      }
      last = p;
    }
  });

  const lift = (e: PointerEvent) => {
    if (!pts.delete(e.pointerId)) return;
    if (pts.size) {
      // One finger left after a pinch: carry on as a pan from here.
      d0 = 0;
      last = pointsOf(pts)[0];
      return;
    }
    if (e.type === 'pointercancel') return;
    const p = { x: e.clientX, y: e.clientY };
    const dx = p.x - start.x;
    const dy = p.y - start.y;
    if (s === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      show(current + (dx < 0 ? 1 : -1));
    } else if (!gesture) {
      // Double-tap or double-click toggles 1× ↔ 2× at the tap point.
      if (e.timeStamp - tap.t < 300 && distance(p, tap) < 30) {
        zoomAt(s > 1 ? 1 : 2, p);
        gesture = true;
        tap.t = 0;
        return;
      }
      tap = { t: e.timeStamp, x: p.x, y: p.y };
    }
  };
  dialog.addEventListener('pointerup', lift);
  dialog.addEventListener('pointercancel', lift);

  // A click on the empty ground around the photo closes — unless it was the
  // end of a swipe, pan, pinch or double-tap.
  dialog.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (!gesture && (t === dialog || t === stage || t.classList.contains('lightbox-inner'))) {
      dialog.close();
    }
    gesture = false;
  });
}
