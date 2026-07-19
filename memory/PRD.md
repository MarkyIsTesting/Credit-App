# EuroKredit — PRD

## Problem statement
"Je veux un site web pour une entreprise de prêt d'argent" — nom EuroKredit.
Direction: Awwwards Site-of-the-Day level, cinematic editorial, kinetic hero, framer-motion + lenis smooth scrolling, subtle parallax.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis + react-fast-marquee. Cormorant Garamond (serif) + Manrope (sans).
- Backend: FastAPI + Motor/MongoDB. Endpoints under /api.
- DB collections: `loan_applications`, `contact_messages`.

## User personas
- Client patrimonial (Fr/Bel/Lux) cherchant financement discret.
- Entrepreneur cherchant prêt professionnel.
- Particulier auto/perso/rachat.

## Implemented (2026-12)
- Backend endpoints: GET /api/, POST /api/simulator, POST/GET /api/applications, POST /api/contact, GET /api/rates.
- Frontend sections:
  - Sticky glass Nav with 5 links + CTA
  - Kinetic Hero (mask reveal line-by-line, parallax kintsugi image, stats row)
  - Editorial Marquee (react-fast-marquee, serif italic)
  - Bento/Tetris loan types grid (5 offres) with hover scale + clip
  - Manifesto (3 numbered chapters, clipped side image)
  - Interactive Simulator (Shadcn Slider + Select, animated monthly number)
  - Testimonials (3 offset cards, glass)
  - FAQ (Shadcn Accordion, editorial style)
  - Application form (POST /api/applications, sonner toast)
  - Massive editorial footer with mega-text "EuroKredit."
- Grain overlay, gold accent #D4AF37, dark #0A0A0A.
- data-testid on all interactive elements.

## Backlog / Next actions
- P1: Admin dashboard to view applications (CRUD).
- P1: Email notifications (Resend integration) when a new application is submitted.
- P2: Multi-page (dedicated pages per loan type).
- P2: Cookie banner + legal pages (Mentions légales, RGPD).
- P2: Multi-language (FR/EN/DE).
- P2: Client account & application status tracking.

## Notes
- Amortization formula on backend and frontend must remain aligned.
- Rates are indicative (hard-coded in `RATES` dict).
