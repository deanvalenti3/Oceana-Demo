# Full Site Build Plan — M/Y Oceana

## Confirmed Facts
- Vessel: M/Y Oceana | Company: Dorsal Ventures LLC, Juneau AK
- Offer: 8 Days / 7 Nights, private, up to 6 guests, all-inclusive, from $65,000
- Route: Juneau → White Stone Harbor → Tenakee Springs → Basket Bay → Cosmo Cove → Red Bluff Bay → Holkham Bay/Glacier → Juneau
- Crew: Captain Michael Grauso (USCG Licensed Master 200-Ton), Chef Ari Briens, First Mate Dom Pisano, Stewardess Lysanne
- Contact: info@oceanayachtcharter.com · (907) 555-0199
- ⚠ CONFIRM: Chef's jacket reads "ARIANE" — full name needs client verification

## Sitemap & Funnel Role

| Page | File | Funnel Role | Primary CTA |
|---|---|---|---|
| Home | index.html | Full funnel — awareness to conversion | Check Availability → #inquiry |
| Experience | experience.html | Desire builder | Check Availability → contact.html |
| Itinerary | itinerary.html | Specificity / desire | Request Your Dates → contact.html |
| Crew | crew.html | Trust anchor | Check Availability → contact.html |
| Gallery | gallery.html | Visual proof | Check Availability → contact.html |
| About | about.html | Brand story / trust | Check Availability → contact.html |
| Contact | contact.html | Lead capture (money page) | Request Availability (form submit) |
| FAQ | faq.html | Objection removal | Start the Conversation → contact.html |

## Image Distribution

| File | Used On |
|---|---|
| hero.webp | index (hero), crew (hero), contact (hero), itinerary (hero), about (secondary) |
| 1.webp | index (offer), experience (interior), gallery |
| 2.webp | index (itinerary), itinerary (feature), experience (activity), gallery |
| 3.webp | index (pull-quote bg), about (hero), gallery |
| michael.webp | index (crew), crew, gallery |
| chef_ari.webp | index (crew), crew, experience (chef section), gallery |
| first_mate_dom.webp | index (crew), crew, gallery |
| stewardess_lysanne.webp | index (crew), crew, gallery |

## CSS System
- All styles live in styles.css (linked from every page)
- No inline style blocks on any page
- Index.html updated to remove <style> block and link styles.css
- New components: .site-nav, .page-hero, .gallery-grid, .faq-item

## Navigation
```
[M/Y Oceana]  Experience · Itinerary · Crew · Gallery · About  [Check Availability]
```
- Fixed top, 64px tall, navy background
- Mobile: hamburger toggle via script.js

## Build Order
1. styles.css
2. index.html update (link CSS, swap nav)
3. contact.html
4. crew.html
5. experience.html
6. itinerary.html
7. gallery.html
8. about.html
9. faq.html
10. script.js
