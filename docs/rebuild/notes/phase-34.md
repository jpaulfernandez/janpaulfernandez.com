# Phase 34 notes

## 34.1 Home singleton fields

- `home` is now `heroStatement` (text, required) + `heroWho` (text, multiline, required) in `keystatic.config.ts` and `src/content.config.ts`; `home.json` rewritten with the rebuild-plan section 5.1 drafts, unchanged.
- "Eleven years": PSBank starts 2015 (`src/content/career/psbank.md`), 2015 to 2026 is 11. Kept.
- Base is Manila. Program spec doc 09 line 199 says Angeles City; not used (README rule 8). Delivery-area list follows the phase file; doc 09 lines 199 and 305 give two other variants. Logged under Blocked-on-Paul.
- "A college of working students" is from the plan draft; no other source checked. Flagged for Paul.
- Minimal `index.astro` edit to keep the build green: destructure `heroStatement`/`heroWho`, h1 = `heroStatement`, hero lead paragraph = `heroWho`, and the "Who I am" (`heroIntro`) section and its manifesto comment deleted. `cleanSnippet`/`withInlineLinks` and the rest of the page are left for 34.2.
- CTA wording conflict (20-minute vs plain "scoping call") logged; 34.2 uses the phase file's wording.
