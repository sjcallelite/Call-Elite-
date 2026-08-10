# RC Call Elite — Backend Architecture

This adds a production-ready backend to the existing RC Call Elite website
**without changing its frontend design or content**. The quote/contact form
is wired to a real API; a newsletter API is ready for whenever a newsletter
UI is added; leads are stored securely in Firestore.

The frontend itself lives at `public/index.html` — it's the same file you
provided, with three small, functional additions (diff-checked): a hidden
honeypot field, a status message region under the quote form, and one
`<script>` tag before `</body>`. No visual styling, layout, or copy changed.

## 1. Architecture

```
callelite-backend/
├── public/                  # Firebase Hosting root (the website)
│   ├── index.html           # unchanged design, form now wired to /api
│   └── js/backend-integration.js
├── functions/                # Firebase Cloud Functions (the backend)
│   ├── index.js              # exports the `api` HTTPS function
│   ├── src/
│   │   ├── app.js            # Express app: security, CORS, routes
│   │   ├── routes/           # contact.js, newsletter.js, health.js
│   │   ├── middleware/       # validate.js, rateLimit.js, security.js
│   │   ├── services/         # firestore.js, email.js
│   │   └── utils/sanitize.js
│   ├── package.json
│   └── .env.example
├── firebase.json             # Hosting + Functions + Firestore config
├── firestore.rules           # No public read/write; admin-only reads
├── firestore.indexes.json
└── .firebaserc.example
```

Requests flow: browser → Firebase Hosting (`/api/**` rewrite) → Cloud
Function `api` (Express) → Firestore. The frontend never talks to Firestore
directly — everything goes through validated, rate-limited API endpoints.

## 2. API endpoints

| Method | Path              | Purpose                        |
|--------|-------------------|---------------------------------|
| GET    | `/api/health`     | Liveness check                  |
| POST   | `/api/contact`    | Quote/contact form submission   |
| POST   | `/api/newsletter` | Newsletter subscription         |

`POST /api/contact` body (matches the existing quote form fields exactly):
```json
{ "service": "Interior Design", "city": "Bengaluru", "name": "Priya S",
  "phone": "+91 98765 43210", "message": "optional notes" }
```
Responses: `200 { success: true, message, leadId }` or
`400/500 { success: false, errors: [...] }`.

`POST /api/newsletter` body: `{ "email": "you@example.com" }`.

> **Note:** the current site has no newsletter signup UI, so nothing in the
> frontend calls this endpoint yet. It's ready to wire up whenever a
> newsletter field is added — no backend changes needed then.

## 3. Firebase setup

1. `npm install -g firebase-tools` (if not already installed).
2. `firebase login`
3. Create a Firebase project in the console, then:
   ```
   cp .firebaserc.example .firebaserc
   # edit .firebaserc and set your real project ID
   ```
4. Enable **Firestore** (production mode) and, if you plan to add an admin
   dashboard, **Firebase Authentication** in the console.

## 4. Firestore setup

- Data model: two collections, `leads` and `newsletter_subscribers` (see
  `functions/src/services/firestore.js` for exact fields — only fields the
  existing form actually collects, plus `status`, `source`, `createdAt`).
- Security rules (`firestore.rules`) deny **all** client read/write. Writes
  only happen server-side through the Admin SDK inside Cloud Functions.
  Reads are restricted to authenticated users listed in an `admins`
  collection — for future admin-dashboard use. Deploy with:
  ```
  firebase deploy --only firestore:rules,firestore:indexes
  ```

## 5. Firebase Functions setup

```
cd functions
cp .env.example .env      # for local emulator use only
npm install
```
Run locally:
```
firebase emulators:start --only functions,firestore,hosting
```
This serves the site at `http://localhost:5000` with `/api/**` routed to
the emulated function.

Deploy:
```
firebase deploy --only functions,hosting,firestore
```

## 6. Environment variables

See `functions/.env.example` for the full list and comments. Summary:

| Variable | Purpose |
|---|---|
| `ALLOWED_ORIGIN`, `ALLOWED_ORIGIN_STAGING` | CORS allow-list |
| `SMTP_HOST/PORT/SECURE/USER/PASSWORD` | Optional email notifications |
| `NOTIFY_FROM_EMAIL`, `NOTIFY_TO_EMAIL` | Who lead notifications go to |
| `CONTACT_RATE_LIMIT_*`, `NEWSLETTER_RATE_LIMIT_*` | Rate limiting |
| `GA_MEASUREMENT_ID` | GA4 property ID (frontend) |
| `GOOGLE_SITE_VERIFICATION` | Search Console meta tag value |

**In production, set secrets via Firebase, not a committed `.env`:**
```
firebase functions:secrets:set SMTP_PASSWORD
```
For non-secret config (allowed origin, GA ID) either bake them into your
build/deploy pipeline or use `firebase functions:config:set`.

No email provider, GA ID, Firebase config, or Search Console code has been
invented anywhere in this project — every placeholder is literally named
`YOUR_...` and documented here.

## 7. Local development

```
cd functions && npm install
cd .. && firebase emulators:start
```
Open `http://localhost:5000`, submit the quote form, and watch the
Firestore emulator UI (`http://localhost:4000`) for the new `leads`
document.

## 8. Deployment

```
firebase deploy
```
Deploys Hosting, Functions, and Firestore rules/indexes together. Function
region defaults to `asia-south1` in `functions/index.js` — change it if
you're hosting elsewhere.

## 9. Database security

- Firestore rules deny all public read/write (see `firestore.rules`).
- Cloud Functions use the Admin SDK, which bypasses security rules — this
  is standard and safe *because* the API layer in front of it validates,
  sanitizes, and rate-limits every request.
- IP addresses are stored **hashed** (SHA-256), not in plain text, purely
  to help spot abuse patterns.

## 10. Contact form setup

Already wired — see `public/js/backend-integration.js`. It posts to
`/api/contact`, shows success/error text in the `#quote-form-status`
element below the button, and resets the form on success. No design
changes; only `name`/`required` attributes were added to existing inputs
plus a hidden honeypot field.

## 11. Newsletter setup

Backend endpoint (`/api/newsletter`) is live and ready. There is currently
no newsletter form on the site. When one is added, point its `email`
field at `POST /api/newsletter` the same way the quote form calls
`/api/contact`.

## 12. Google Analytics setup

1. Create a GA4 property, copy its Measurement ID (looks like `G-XXXXXXX`).
2. In `public/index.html`, replace:
   ```html
   <script>window.GA_MEASUREMENT_ID = "YOUR_GA_MEASUREMENT_ID";</script>
   ```
   with your real ID. Until you do, GA stays fully inactive (no script is
   loaded) — no fake ID is ever sent.
3. Events already instrumented once a real ID is set: `generate_lead`
   (quote form submit), `whatsapp_click`, `phone_click`, `email_click`,
   `directions_click`.

## 13. Google Search Console setup

Replace the placeholder meta tag in `public/index.html`:
```html
<meta name="google-site-verification" content="YOUR_SEARCH_CONSOLE_VERIFICATION_CODE" />
```
with the verification string Search Console gives you for the HTML tag
method.

## Backend quality checklist (self-verified)

- [x] Frontend renders identically — diff-checked against your original
      file; only `name`/`required` attributes, one hidden honeypot field,
      one empty status `<div>`, and one `<script>` tag were added.
- [x] Quote form posts to `/api/contact` and displays the response.
- [x] Newsletter API exists and is documented as not-yet-wired (no UI
      exists to invent a connection for).
- [x] `GET/POST` endpoints validated end-to-end with a local test harness
      (valid submission, missing-fields, honeypot, duplicate newsletter
      signup, invalid email, disallowed CORS origin).
- [x] Errors return generic messages; no stack traces or internals leak.
- [x] No secrets in any frontend file — verified by inspection of
      `index.html` and `backend-integration.js`.
- [x] Firebase config uses `YOUR_...` placeholders throughout.
- [x] `firestore.rules` denies public read/write; admin reads only.
- [x] Rate limiting on both POST endpoints.
- [x] CORS restricted to an explicit allow-list (never `*`).
- [x] GA Measurement ID and Search Console code are both placeholders.
- [x] No business information (name, phone, email, address, socials) was
      altered anywhere.
