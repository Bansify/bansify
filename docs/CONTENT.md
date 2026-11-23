# Content

All copy lives in data files, so adding a product is an edit, not a component change.

## Adding a product

1. **`src/data/apps.ts`** — add an entry: name, one-line description, subdomain, category,
   GitHub repo, icon. Match the shape of the neighbours exactly.
2. **`src/data/dock.ts`** — add it to the ecosystem strip if it belongs there.
3. **`src/data/nav.ts`** — only if the product gets a top-level page on this site.
4. Run `npm run verify`.

## Copy rules

- **Sentence case** for headings, buttons and nav labels.
- One line of description per product. No superlatives ("fastest", "world's best") unless
  the claim is measurable and sourced.
- Say what the product **does**, not what it aspires to.
- No emojis in the UI, no exclamation marks.
- Every external link opens with `rel="noopener"`.

## Company facts

`src/data/companyData.ts` feeds the company page **and** the `Organization` structured data.
Change a fact once, there.

## Images

- Product icons: square PNG, transparent or on `#0494F4`, at least 512×512.
- Never render text as an image — it breaks SEO, translation and dark mode.
- Keep the page light: images are the usual weight problem on a directory page.
