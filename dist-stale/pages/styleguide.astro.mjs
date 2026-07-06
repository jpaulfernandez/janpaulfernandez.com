import { c as createComponent, a as renderHead, b as addAttribute, r as renderTemplate } from '../chunks/astro/server_C7-9n1Tc.mjs';
import 'piccolore';
import 'html-escaper';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Styleguide = createComponent(($$result, $$props, $$slots) => {
  const colors = [
    { name: "moss-900", hex: "#1E2B20", class: "bg-moss-900" },
    { name: "moss-700", hex: "#3B5240", class: "bg-moss-700" },
    { name: "moss-500", hex: "#5F7D5C", class: "bg-moss-500" },
    { name: "moss-200", hex: "#CDD9C6", class: "bg-moss-200" },
    { name: "beige-100", hex: "#F5F1E6", class: "bg-beige-100" },
    { name: "beige-50", hex: "#FBF9F2", class: "bg-beige-50" },
    { name: "ink", hex: "#26251F", class: "bg-ink" },
    { name: "citrus-500", hex: "#E8A13C", class: "bg-citrus-500" },
    { name: "citrus-300", hex: "#F4C566", class: "bg-citrus-300" }
  ];
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Styleguide — janpaulfernandez.com</title>${renderHead()}</head> <body class="p-8"> <h1>Styleguide</h1> <section class="mt-8"> <h2>Colors</h2> <ul class="mt-4 grid grid-cols-3 gap-4 list-none p-0"> ${colors.map((c) => renderTemplate`<li class="rounded-lg border border-moss-200 overflow-hidden"> <div${addAttribute(`${c.class} h-20`, "class")}></div> <p class="p-2 text-small">${c.name} — ${c.hex}</p> </li>`)} </ul> </section> <section class="mt-8"> <h2>Type scale</h2> <h1>H1 Heading — Archivo Black</h1> <h2>H2 Heading — Archivo Black</h2> <h3>H3 Heading — Lato Bold</h3> <p>Body text at 17–18px, line-height 1.7. The quick brown fox jumps over the lazy dog. This paragraph demonstrates the body copy styling used throughout the site, including line length and leading.</p> <p><em>Body text in italic, to confirm the Lato 400-italic weight loads correctly.</em></p> <small>Small text — 14px, used for captions and metadata.</small> </section> <section class="mt-8"> <h2>Link</h2> <p><a href="/">This is a link to the homepage</a> — moss-700 default, moss-500 on hover.</p> </section> <section class="mt-8"> <h2>Citrus CTA button</h2> <a href="/work-with-me" class="inline-block rounded-lg bg-citrus-500 text-moss-900 px-6 py-3 font-display text-small no-underline">
Work with me
</a> </section> </body></html>`;
}, "/sessions/peaceful-eloquent-newton/mnt/janpaulfernandez.com/src/pages/styleguide.astro", void 0);

const $$file = "/sessions/peaceful-eloquent-newton/mnt/janpaulfernandez.com/src/pages/styleguide.astro";
const $$url = "/styleguide";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Styleguide,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
