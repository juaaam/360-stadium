# 360 Stadium — Mobile Edition (Version 2)

An English-only, responsive sports-platform prototype for investor demonstrations. Built with React, TypeScript, Vite, Lucide icons, and locally served fonts and assets.

## Version 2 layout

This branch preserves the original booking, organizer, Academy, AI Coach, rewards, profile, and notification features while presenting them in a touch-first app layout inspired by the supplied references. It uses a centered application canvas on desktop and a full-width phone layout, six colorful circular shortcuts, swipeable cards, lavender training panels, and persistent bottom navigation. `src/pages/MobileHome.tsx` defines the new home screen; `src/mobile-app.css` styles this edition. The original version remains on `main` and `netlify-download`.

To compare live versions, deploy this branch (`mobile-app-layout`) in a separate Netlify project, or upload `downloads/360-stadium-mobile-v2-netlify.zip` to a new Netlify site. The ZIP contains compiled production files with `index.html` at its root.

## Run

Node.js 22.12+ or 24 is recommended. From this directory:

```sh
npm ci
npm run dev
```

The development server uses port **5173**. `npm run build` type-checks and creates a static production build in `dist/`. `npm run preview` serves that build on port 4173. Hash-based routing supports static hosting without server rewrite rules.

## Deploy to Netlify

Connect Netlify to `juaaam/360-stadium` and deploy the `main` branch. The included `netlify.toml` sets the build command to `npm run build`, publish directory to `dist`, and Node.js to version 24. Leave the base directory empty (repository root).

For manual drag-and-drop deployment, run `npm ci` and `npm run build`, then upload the **dist folder**, not the source repository or source ZIP. The source `index.html` references TypeScript that a plain static host cannot execute; Vite converts it into browser-ready assets during the build. Hash-based routes need no redirect rule.

If a previous deployment is blank, check that the published `index.html` loads `/assets/…js`, rather than `/src/main.tsx`, then redeploy with these settings.

## Connected demo

1. Home → **Find your next game**.
2. Explore → **Women only** → **Volleyball** → **The Friday volleyball club**.
3. **Count me in** → select player places → optional parking → confirm.
4. View the ticket, booking reference, and earned loyalty points.
5. **Meet your AI Coach** → select a sample or private local video → **Run demo assessment**.
6. Review the sport-specific feedback and open the recommended Academy course.
7. Enroll, open an illustrated lesson, and mark it complete.
8. Open the athlete profile to see bookings, learning progress, and assessments together.

Also implemented: venue reservations; fictional official tickets and parking; combined discovery filters and an illustrated map; saved events/courses; a five-step match wizard; organizer request approval, team assignments, edits, and cancellation; reward redemption with applied booking/course credits; notification read states; onboarding and profile preferences; membership previews; editable promotional banners; and **Reset Demo** under Profile → Preferences.

## Demo boundaries and storage

All events, facilities, instructors, people, achievements, inventory, and prices are demonstration data. No venue, league, or ticketing partnership is implied. No payments, authentication, external uploads, or production AI calls occur.

AI assessments use coherent prewritten sport scenarios. They are **not computed from uploaded videos**. The bundled clips are original animated diagrams, explicitly labeled as illustrated practice samples. Uploaded videos are previewed through browser blob URLs and stay in the current browser session; the file and its URL are not persisted or sent to a server.

Bookings, favorites, preferences, created matches, courses, points, assessment history, and banner settings persist in `localStorage` under `360-stadium-demo-v1`. Reset restores the seeded athlete. This is a local prototype, not a multi-user backend. Inventory and organizer requests are simulated in the same browser.

Points are earned at 1 point per SAR paid in the demo. Canceled bookings release places and reverse their earned points. A reward credit applies once to the next eligible transaction. Courses and bookings with zero cost earn zero points.

## Customize

- **Brand name and logo:** `src/data.ts` exports `brand`; replace `public/images/logo.png`.
- **Events, venues, courses, assessment scenarios, default banner slides:** `src/data.ts`.
- **Seeded athlete and initial demo state:** `src/store.tsx`.
- **Presentation banner uploads:** Profile → Preferences → Manage promotional banners. PNG/JPEG/WebP up to 1 MB each; up to three custom banners. Images use `object-fit: contain`, custom copy and destination, a Sponsored option, swipe/manual controls, and opt-in auto rotation. Removing all custom banners restores the defaults.
- **Membership example pricing:** `src/pages/Coach.tsx`.
- **Appearance and responsive layouts:** `src/styles.css`.

The supplied logo was prepared as a transparent web asset. Sports photographs were generated for this fictional demonstration. Fonts, photos, and sample clips are bundled locally; the running application makes no external service requests.

## Verify

```sh
npm run build
npm test
```

Playwright runs desktop Chromium and an emulated iPhone viewport. The cloud environment has `/usr/bin/chromium`. On another machine, set `CHROMIUM_PATH` to your Chromium executable. The suite starts Vite if it is not already running.

Tests cover the complete investor journey, persistence, inventory and point reversal, reward credits, organizer actions, private video preview, sport-specific results, custom banners, official/venue/school scenarios, and layout checks across the screens.

`node scripts/generate-samples.mjs` regenerates the six original illustrated WebM clips. It needs the development server, Chromium, and FFmpeg; normal development uses the checked-in clips and does not require FFmpeg.
