# Feature Expansion — M/Y Oceana
## Conversion-Focused Feature Additions

---

## Implemented Features

| # | Feature | ROI | Complexity | Status |
|---|---|---|---|---|
| 1 | Sticky CTA Bar | High | Low | ✅ Done |
| 2 | Multi-Step Inquiry Form | High | Medium | ✅ Done |
| 3 | Availability Urgency Messaging | High | Low | ✅ Done |
| 4 | Enhanced Testimonials (4 cards + tags) | Medium | Low | ✅ Done |
| 5 | Post-Submit Confirmation State | Medium | Low | ✅ Done |

---

## Feature Details

### 1. Sticky CTA Bar
**Why it converts:** Most visitors who scroll past the hero don't click the hero CTA. Without a persistent path to inquiry, those visitors have to scroll back up or remember to find the form. The sticky bar keeps the primary action visible throughout the session.

**Behavior:** Appears when hero scrolls out of view. Disappears when the inquiry form is visible. Slides up from the bottom.

---

### 2. Multi-Step Inquiry Form
**Why it converts:** A 7-field form presented all at once triggers "effort aversion." Breaking it into 3 steps reduces perceived friction. Step 1 (dates + party size) asks low-commitment, easy questions first — once a user answers those, they're more likely to complete the rest (sunk cost + momentum).

**Step structure:**
- Step 1: When & Who (dates, party size)
- Step 2: About You (name, email, phone)
- Step 3: Anything else? (message — optional)

---

### 3. Availability Urgency Messaging
**Why it converts:** Availability without urgency framing is just a calendar. Adding context — total expeditions, one already booked, dates fill in order — makes scarcity feel real rather than manufactured. Real scarcity is the most honest and effective urgency signal.

**Changes:** Updated sub-copy, urgency note, lock icon on booked slot, CTA added below the grid.

---

### 4. Enhanced Testimonials
**Why it converts:** Generic "great trip!" testimonials are discounted. Testimonials with trip-type context (Family Charter, Anniversary, Fishing Trip) let the reader self-identify and increase relevance. A 4th card gives more coverage without feeling padded.

**Changes:** 4 cards (was 3), trip-type tag on each, 2x2 grid layout.

---

### 5. Post-Submit Confirmation State
**Why it converts:** Without a confirmation state, form submission lands in ambiguity. Guests don't know if anything happened. A clear "we received this" message sets expectations, reduces anxiety, and reinforces the relationship that was just initiated.

**Note:** Frontend-only in prototype. No data is actually sent. Requires Formspree, Netlify Forms, or custom backend endpoint for production.

---

## Features Not Implemented (and Why)

| Feature | Decision |
|---|---|
| FAQ accordion on homepage | Skipped — `faq.html` already exists, duplication adds no clear conversion lift |
| Chat/assistant UI | Skipped — adds UI complexity without conversion data to justify it; requires backend for real value |
| Date picker / calendar | Skipped — select dropdown is sufficient for prototype; calendar widget adds dependencies |
| Video embed | Skipped — no client video asset available |

---

## Backend Requirements for Production

| Feature | What's needed |
|---|---|
| Form submission | Formspree (free), Netlify Forms, or server endpoint |
| Availability dates | Admin panel or CMS to update booked/open status |
| Post-submit email | Backend trigger or form service with email notifications |
