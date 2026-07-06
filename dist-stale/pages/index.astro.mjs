import { c as createComponent, m as maybeRenderHead, r as renderTemplate } from '../chunks/astro/server_C7-9n1Tc.mjs';
import 'piccolore';
import 'html-escaper';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<h1>Jan Paul Fernandez</h1>`;
}, "/sessions/peaceful-eloquent-newton/mnt/janpaulfernandez.com/src/pages/index.astro", void 0);

const $$file = "/sessions/peaceful-eloquent-newton/mnt/janpaulfernandez.com/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
