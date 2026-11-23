# Architecture

Static single-page app. No router library: `App.tsx` owns the current page in state and keeps
the URL in step with `history.pushState`.

## Routing

```text
ROUTES = home | ecosystem | products | solutions | docs | company | contact
```

- `pageFromPathname()` maps `window.location.pathname` to a page, falling back to `home`.
- `/u/<slot>/...` account-slot prefixes are stripped before the match, so a signed-in user
  can share the same URL.
- Navigation calls `pushState`; `popstate` re-reads the path, so back/forward work.
- Deep links survive a refresh because Cloudflare Pages serves `index.html` for every
  unmatched path (`public/_redirects`, last rule).

## Layout

```text
App.tsx
├── AppShell          chrome around every page: Navbar, PortalBar, Footer, error boundary
│   ├── Navbar        brand mark, primary nav (src/data/nav.ts), theme switch, account entry
│   ├── PortalBar     ecosystem strip of subdomain links (src/data/dock.ts)
│   └── Footer
├── PageShell         per-page frame: breadcrumbs, title block, brand mark
└── page              Home | Ecosystem | Products | Solutions | Docs | Company | Contact
```

`ErrorBoundary` catches a render failure and shows a recoverable screen instead of a blank
page. `Breadcrumbs` is fed from the same route table, so the visible trail and the
`BreadcrumbList` structured data never disagree.

## Data

Content is data, not markup:

| File | Holds |
|---|---|
| `src/data/apps.ts` | the product catalogue: name, description, subdomain, category, repo, icon |
| `src/data/nav.ts` | primary navigation items and their icons |
| `src/data/dock.ts` | the ecosystem strip entries |
| `src/data/companyData.ts` | company facts for the company page and the structured data |
| `src/config/brand.ts` | domain and Accounts URLs, overridable with `VITE_*` variables |

Adding a product means editing `apps.ts` (plus `dock.ts` if it belongs in the strip) — no
component change.

## Theme

`src/context/ThemeContext.tsx` provides light/dark; the palette is zinc plus the brand blue
`#0494f4`, applied through Tailwind 4 utilities in `src/index.css`. No inline hex in
components.

## Account

`src/hooks/useGothwadSession.ts` + `src/lib/gothwadSso.ts` read the shared `.bansify.com`
session from the Accounts Worker; `src/lib/accountMenuWidget.ts` loads the central account
menu so the avatar menu is identical to Mail, Drive and Store. The site never stores a token:
the session lives in HttpOnly cookies on the Accounts domain.

## SEO surface

`index.html` carries the static meta tags and JSON-LD; `App.tsx` updates the per-route title,
description, canonical URL and breadcrumb structured data. Details in [SEO.md](SEO.md).
