# Website Proposal & Scope — BOSBA Premium Foods

> Filled-in sample based on the actual BOSBA build. **Prices are illustrative** —
> adjust to your real rates before sending. Currency: USD.

---

**Prepared for:** BOSBA Premium Foods
**Prepared by:** [Your name / studio]
**Contact:** [email] · [phone]
**Date:** 2026-06-30
**Proposal valid until:** 2026-07-30
**Version:** 1.0

---

## 1. Project Overview

BOSBA Premium Foods needs a fast, mobile-first online store to sell food products with
local delivery in Phnom Penh, scheduled delivery slots, online and cash payment, and a
full admin dashboard to manage products, orders, promotions, and media. The site is built
on Cloudflare (Workers + D1) for low cost and global speed, and also serves on camitc.com.

**Goals**

- Take orders online 24/7 with delivery scheduling and map-based address capture
- Accept payment by Cash on Delivery and KHQR (any Cambodian bank app)
- Give the owner a self-service admin for products, orders, promos, and content
- Rank on Google for local food searches and run marketing offers/promo codes

---

## 2. Scope of Work

This reflects the site **as built and delivered**. All items below are included.

### Phase 1 — Client Onboarding

| Deliverable                                             | Included | Price    |
| ------------------------------------------------------- | -------- | -------- |
| Discovery & requirements gathering                      | ✓        | $150     |
| Brand asset collection (logo, colors, product photos)   | ✓        | incl.    |
| Accounts & access setup (Cloudflare, domain, email/DNS) | ✓        | $100     |
| Contract & project kickoff                              | ✓        | incl.    |
| **Subtotal**                                            |          | **$250** |

### Phase 2 — Planning

| Deliverable                                                  | Included | Price    |
| ------------------------------------------------------------ | -------- | -------- |
| Sitemap, storefront/admin split & page list                  | ✓        | $200     |
| User & checkout flows                                        | ✓        | incl.    |
| Feature scope (v1) & data model (products, variants, orders) | ✓        | incl.    |
| Content & SEO keyword plan                                   | ✓        | $150     |
| Timeline & milestone schedule                                | ✓        | incl.    |
| **Subtotal**                                                 |          | **$350** |

### Phase 3 — Design

| Deliverable                                           | Included | Price      |
| ----------------------------------------------------- | -------- | ---------- |
| Wireframes (storefront + admin)                       | ✓        | $300       |
| High-fidelity mockups (desktop + mobile)              | ✓        | $700       |
| Design system (Tailwind tokens, shadcn/ui components) | ✓        | incl.      |
| Design revisions (up to 2 rounds)                     | ✓        | incl.      |
| **Subtotal**                                          |          | **$1,000** |

### Phase 4 — Development

| Deliverable                                                     | Included | Price       |
| --------------------------------------------------------------- | -------- | ----------- |
| Storefront frontend (responsive, PWA installable)               | ✓        | $1,500      |
| Backend: Cloudflare D1 + Drizzle ORM + server functions         | ✓        | $1,200      |
| Authentication (better-auth: email OTP + Google login)          | ✓        | $500        |
| Product catalog + variants/weights                              | ✓        | $900        |
| Cart, checkout, delivery scheduling & map/geolocation           | ✓        | $1,300      |
| Orders + PDF invoices                                           | ✓        | $700        |
| Online payment: KHQR gateway flow + Cash on Delivery            | ✓        | $600        |
| Admin dashboard / CMS (products, orders, roles)                 | ✓        | $1,000      |
| Promotions, promo codes & marketing offers                      | ✓        | $500        |
| Media library (image uploads, served from D1)                   | ✓        | $300        |
| Product reviews                                                 | ✓        | $400        |
| Internationalization (i18n)                                     | ✓        | $300        |
| Integrations (Resend email, analytics, OpenStreetMap geocoding) | ✓        | $400        |
| **Subtotal**                                                    |          | **$10,100** |

### Phase 5 — Testing & QA

| Deliverable                                       | Included | Price    |
| ------------------------------------------------- | -------- | -------- |
| Cross-browser & mobile-device testing             | ✓        | $400     |
| Functional testing (checkout, auth, orders)       | ✓        | incl.    |
| Performance & accessibility checks                | ✓        | incl.    |
| Security & spam protection (reCAPTCHA v3 on auth) | ✓        | $200     |
| Pre-launch bug-fix pass                           | ✓        | incl.    |
| **Subtotal**                                      |          | **$600** |

### Phase 6 — Launch

| Deliverable                                                     | Included | Price    |
| --------------------------------------------------------------- | -------- | -------- |
| Domain, DNS & SSL go-live (bosbapremiumfoods.com + camitc.com)  | ✓        | $150     |
| Production deployment (Cloudflare Workers)                      | ✓        | incl.    |
| SEO setup (sitemap, robots, canonical, JSON-LD structured data) | ✓        | $250     |
| Analytics installation (Cloudflare Web Analytics)               | ✓        | incl.    |
| Handover & admin training (1 session)                           | ✓        | incl.    |
| **Subtotal**                                                    |          | **$400** |

---

## 3. Pricing Summary

| Phase                      | Subtotal    |
| -------------------------- | ----------- |
| 1 — Onboarding             | $250        |
| 2 — Planning               | $350        |
| 3 — Design                 | $1,000      |
| 4 — Development            | $10,100     |
| 5 — Testing & QA           | $600        |
| 6 — Launch                 | $400        |
| **One-time project total** | **$12,700** |

_Taxes (if any) are additional. Third-party costs (domain registration, paid email/SMS
plans, payment processor fees) are billed at cost or paid directly by the client._

---

## 4. Phase 7 — Maintenance (Recurring)

Optional ongoing plan after launch. Choose one:

| Plan         | Includes                                                     | Price / month |
| ------------ | ------------------------------------------------------------ | ------------- |
| **Basic**    | Hosting mgmt, daily D1 backups, monitoring, security patches | $50           |
| **Standard** | Basic + 3 hrs/mo content & product updates                   | $120          |
| **Premium**  | Standard + priority support + new-feature hours              | $250          |

Out-of-plan work billed at **$35/hour**. Cancel with 30 days' notice.

---

## 5. Out of Scope

Not included; quoted separately if needed:

- Ongoing product data entry / content writing
- Paid advertising & social media management
- Payment processor / bank merchant onboarding fees
- Native mobile apps (the site is an installable PWA instead)
- Any feature not listed in §2

---

## 6. Timeline

| Milestone                        | Target date  |
| -------------------------------- | ------------ |
| Project start (deposit received) | [YYYY-MM-DD] |
| Design approved                  | [YYYY-MM-DD] |
| Development complete             | [YYYY-MM-DD] |
| Launch                           | [YYYY-MM-DD] |

_Assumes the client provides content, assets, and feedback within 3 business days at each
step. Delays shift dates accordingly._

---

## 7. Payment Schedule

| Stage              | %   | Amount | Due                    |
| ------------------ | --- | ------ | ---------------------- |
| Deposit (to start) | 40% | $5,080 | On signing             |
| Design approval    | 30% | $3,810 | At §6 design milestone |
| Before launch      | 30% | $3,810 | Before go-live         |

- Invoices payable within 7 days. Late payments may pause work.
- Deposit is non-refundable once work begins.
- Site goes live after the final payment clears.

---

## 8. Terms & Assumptions

- Prices valid until the date on this proposal.
- Includes 2 rounds of revisions per design deliverable; further changes billed hourly.
- Scope changes are quoted as a written change order before work proceeds.
- Client owns the delivered site and Cloudflare/domain accounts at launch.
- Client is responsible for the legality and rights of all supplied content.

---

## 9. Acceptance

By signing below, the client agrees to the scope, pricing, and terms above.

**Client:** **********\_\_********** **Date:** ****\_\_\_\_****

**Provider:** **********\_\_********** **Date:** ****\_\_\_\_****
