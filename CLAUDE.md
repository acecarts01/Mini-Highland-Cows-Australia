# CLAUDE.md — Mini Highland Cows (MHC PTY LTD)

Read this before working on this repo. It exists because several of the
decisions below aren't visible from the code alone, and re-deriving them
from scratch risks repeating mistakes already found and fixed.

## What this is

Next.js 15 (App Router) / React 19 / Tailwind v4 site for MHC PTY LTD, a
Roma QLD breeder of registered miniature/micro Scottish Highland cattle.
Started as a Google AI Studio export; has since had a full SEO pass, real
client photography, a working mail pipeline, and a technical audit applied
on top.

## Deploy target — do not create a second project

- **Vercel project**: `mini-highland-cows-australia` under the **`ACE`**
  team (`ace-3ad9`), created directly from
  `github.com/acecarts01/Mini-Highland-Cows-Australia`.
- **Domain**: `minihighlandcow.com.au` (apex redirects to `www`). DNS is on
  GoDaddy, pointed at Vercel (`A @ → 216.150.1.1`,
  `CNAME www → 6a71363fc4e15137.vercel-dns-016.com.`) and confirmed valid.
- **A different Vercel team, `prop-money`, also has a deployment of this
  same GitHub repo** (`minihighlandcowsaustralia-*.vercel.app`), from
  before this session. It is a different Vercel account than the one
  connected in this environment, is not reachable from here, and the real
  domain is **not** pointed at it. Before doing anything Vercel-side,
  confirm which team/project you're actually looking at — don't assume
  the first project search result is the right one. See the ship-checklist
  skill's "verify project linkage" section for why this matters.
- Per the ship-checklist skill: before deploying, confirm which project a
  domain is actually aliased to; after deploying, confirm with fresh
  `X-Vercel-Id`/`Age` headers that a push actually reached the live domain
  rather than trusting a cached response.

## Git workflow on this project

- All work happens on `seo/metadata-schema-sitemap`. **Nothing is pushed to
  `main` or to GitHub until the project owner explicitly says to.** This
  has been asked for repeatedly and deliberately — don't push preemptively
  because a task "feels ready."
- `package-lock.json` exists locally but is deliberately **not** committed
  — the repo also has `bun.lock`, and committing both makes Vercel's
  package-manager detection ambiguous. Resolve this explicitly with the
  owner before committing either lockfile.
- `git push` over HTTPS needs Git Credential Manager's interactive sign-in,
  which does not surface a popup from this sandboxed environment. The
  project owner has to run the push themselves from a real terminal
  (PowerShell, or the actual Git Bash *application* — not the git-scm.com
  website, which is just a download page) the first time, after which the
  credential is cached and later pushes from an agent session work fine.

## Reply portal (app/api/contact/route.ts)

Replaces an unconfigured Web3Forms integration that silently discarded
every submission (one form didn't even attempt a network call). Full
detail in `docs/reply-portal.md`. The short version:

- One endpoint behind all four forms (contact, order-now, the order modal,
  the enquiry drawer), sending mail over Zoho SMTP via `lib/mailer.ts`.
- Needs `ZOHO_SMTP_USER` / `ZOHO_SMTP_PASS` / `ZOHO_SMTP_HOST` /
  `ZOHO_SMTP_PORT` set in Vercel. `ZOHO_SMTP_PASS` must be a Zoho
  **app-specific password** (Zoho Mail → Settings → Security → App
  Passwords) pasted directly into Vercel by a human — never typed or
  relayed by an agent, and Zoho only shows it once at generation time.
- Email templates (`lib/email-templates.ts`) follow the nested-table HTML
  email rule from the ship-checklist skill: every `<table>`/`<td>` needs
  **both** the `bgcolor` attribute and a `background-color` CSS property,
  or Outlook/Apple Mail can default an unstyled nested table to opaque
  white regardless of the parent's background. This bug class is invisible
  in every browser preview and only shows up in a real inbox on a real
  phone — don't consider an email template "done" without an actual send
  test once SMTP is live.

## The "Details Pending" draft-listing convention

17 catalog entries (`mhc-70`..`mhc-86` in `lib/site-config.ts`) were added
from real client photography with no business facts to go with them
(price, sex, chondro status, registration). Rather than inventing
plausible-looking specifics — which is exactly the problem found and fixed
in the *original* 23 listings' `getAnimalOrderSpecs()` (it unconditionally
fabricated a specific NLIS RFID number and a named sire/dam for every
animal) — these use honest placeholder values: `registry: 'Registration
Pending'`, `chondroStatus: 'Pending DNA Test'`, etc.

**If you touch this pattern, preserve the two places that specifically
check for it:**
- `getAnimalOrderSpecs()` in `lib/site-config.ts` checks
  `animal.registry === 'Registration Pending'` and returns honest "Pending"
  values instead of a fabricated NLIS number / sire / dam for those
  animals.
- The chondro-status ribbon badge (`components/AnimalCard.tsx` and
  `app/herd/[slug]/animal-detail.tsx`) has three branches — Non-Carrier /
  Carrier / anything else — not two. A binary Non-Carrier-or-else check
  will silently relabel "Pending DNA Test" as a confirmed
  "Chondro+ Dwarfism Carrier," which is a false, specific genetic claim.
  This was a real bug, already found and fixed once — don't reintroduce
  it by simplifying the branch back to two cases.

`docs/new-listings-todo.md` is the fill-in sheet for the real figures.
Two more photos (`Fiona.jfif`, `Tara.jfif`) were deliberately **not**
added — they don't look like standard Highland cattle (short coat/black
muzzle, and a Belted-Galloway colour pattern, respectively). Get an
explicit answer from the owner before adding them, rather than guessing.

## Photo pipeline

`scripts/import-client-photos.mjs` maps the client's raw photo folder onto
catalog slugs by matching the source filename against each product's
`name` field, then processes into WebP + AVIF at 1600×1200 (cover-cropped
for real livestock photos, fitted on white for equipment shots so the
whole product stays visible). `scripts/contact-sheet.mjs` regenerates
`docs/contact-sheet-*.png` from whatever's actually live, so those sheets
can't silently drift from the site. Re-run both after adding or replacing
any product photo.

## Gotchas already hit once

- **Next.js does not deep-merge `openGraph`/`twitter` metadata.** If a page
  defines its own `openGraph` object, it fully replaces the parent
  layout's — including `images` — rather than inheriting what it doesn't
  override. Every page that sets its own `openGraph` must also set its own
  `images`, or it silently loses the default social-share image. This bit
  us once (`public/og-default.png` wasn't showing on 10 of 11 static
  pages) and was fixed by adding `images: ['/og-default.png']` to each.
- **Don't hardcode image filenames or product specifics in JSX.** The
  homepage hero card once had a literal
  `src="/images/aila-silver-micro-heifer.webp"` plus hardcoded caption
  text — when that file was renamed during a photo cleanup, the hero
  silently 400'd on every load with no visible error in a screenshot (only
  visible in server logs / network requests). It's now a lookup against
  the real product record (`ALL_PRODUCTS.find(p => p.id === 'mhc-01')`).
  If something needs to reference a specific animal, look it up — don't
  spell out its filename or specs by hand.
- **The Isla → Aila rename** left a slug alias
  (`SLUG_ALIASES` in `app/herd/[slug]/page.tsx`) so both URLs still
  resolve; the canonical tag correctly points both to the `isla-*` slug.
  If more products get renamed, check for this pattern rather than letting
  two URLs serve identical content with two different canonicals.

## Known open items (not yet resolved, don't assume otherwise)

- **Real phone number**: `CONTACT.phone` / `whatsapp` in `lib/site-config.ts`
  are still the placeholder `+61 400 000 000`. Don't invent one.
- **Equipment/feed products** (10 items, `mhc-eq-*`): flagged to the owner
  as possibly out of scope ("we sell only cows") — no decision made yet on
  whether to remove them. Don't remove or keep them without checking.
- **RankMath-equivalent audit** and a full ship-checklist item 3 pass
  ("it works" proof standard) — partially done inline as changes were
  made; no single consolidated report exists yet.
- **Real live test order** — genuinely blocked until code is pushed
  somewhere reachable (main or a preview branch) with the Zoho credentials
  live, since `ZOHO_SMTP_PASS` only exists in Vercel's environment, not
  locally. Use `acecarts01@gmail.com` as the test customer email when this
  happens.
- Blog post titles run 99–111 characters (a bit long for search-result
  display, not broken) — lower priority than the fixes already made to
  every other page's titles.
