# Reply portal

Every form on the site — contact, order-now, the order modal, and the
enquiry drawer — submits through one endpoint: `app/api/contact/route.ts`.
It replaces the old Web3Forms integration, which was never configured
(`web3formsKey: 'PENDING'`) and whose failures were either swallowed or, in
the enquiry drawer's case, never attempted at all — every "reservation
request" showed a success screen without sending anything, anywhere.

## How it works

1. Client calls `submitToReplyPortal()` (`lib/submit-form.ts`) with a
   `formType`, the submitter's `name`/`email`, and a `fields: {label, value}[]`
   array built from that form's own state.
2. `POST /api/contact` validates the payload, then sends two emails over
   Zoho SMTP via `lib/mailer.ts`:
   - **Business notification** → `CONTACT.email`, with `Reply-To` set to the
     customer's address, so replying in the inbox goes straight to them.
   - **Customer confirmation** → the address they submitted, acknowledging
     receipt.
3. If the business notification fails, the API returns an error and the
   client shows it — it never claims success for a message that wasn't
   delivered. If only the confirmation email fails, the enquiry has already
   reached the business, so that failure is logged but not surfaced to the
   customer.

Templates are in `lib/email-templates.ts`, built to the nested-table email
rules in `webforge-ship-checklist` (every `<table>`/`<td>` carries **both**
`bgcolor` and `background-color` — Outlook/Apple Mail default an unstyled
nested table to opaque white regardless of the parent's background, and that
bug is invisible anywhere except a real inbox).

A hidden `website` field on every form is a honeypot: a bot that fills every
input fills it too, and the API silently accepts without sending mail.

## Setup

Set three environment variables in Vercel (Project Settings → Environment
Variables) — see `.env.example` for details:

- `ZOHO_SMTP_USER` — the mailbox address (`info@minihighlandcow.com.au`)
- `ZOHO_SMTP_PASS` — a Zoho **app-specific password** (Zoho Mail → Settings
  → Security → App Passwords), not the account login password. Generate it
  in Zoho and paste it directly into Vercel — it should never pass through
  chat, a file, or any other tool.
- `ZOHO_SMTP_HOST` — defaults to `smtp.zoho.com`; only override if the
  mailbox was provisioned on a different Zoho data center.

Without these set, `POST /api/contact` returns `503` with a clear message
rather than crashing or silently succeeding — confirmed by testing locally
with the vars unset (see below).

## Verifying it for real

Per the ship-checklist: a working build is not proof an email is correct.
Before calling this done —

1. Set the three env vars (locally in `.env.local`, or in Vercel).
2. Submit each of the four forms for real.
3. Confirm the business notification lands in `info@minihighlandcow.com.au`
   and that hitting "Reply" addresses it to the customer.
4. Confirm the customer confirmation arrives, and open it on an **actual
   phone**, not just a desktop mail client — that's the only environment
   that reliably reproduces the nested-table background bug.
