# SpandanAI Phase 7D.1 — Team Card Hover Micro-Polish Prototype

Human visual review (6 September 2026): **PASS.** No 7D.2 retune. GitHub landing status is in `docs/PHASE_7D_1_COMPLETION_REPORT.md`. The body below is the prototype snapshot.

## A. Phase 7D.1 result

**LOCAL PROTOTYPE / HUMAN REVIEW REQUIRED**  
**NOT COMMITTED**  
**NOT PUSHED**  
**NOT DEPLOYED**

**Date:** 6 September 2026  
**Base:** `673730e` (`docs: record Phase 7D completion`) after Phase 7D push.

This is a timing-only polish. Lift distance, shadow recipe, images, and electrical effects are unchanged.

---

## B. Original hover implementation

`src/components/TeamMemberCard.jsx` (homepage and `/team` share this component).

- Framer Motion `whileHover`: `y: -4` and `boxShadow: 0 18px 40px rgba(0,0,0,0.12)`
- **No** explicit Framer `transition` on hover → Motion default **spring**
- Inline CSS: `transition: transform 0.2s ease, box-shadow 0.2s ease`
- Rest shadow: `0 10px 25px rgba(0,0,0,0.08)`
- `useReducedMotion`: `whileHover` omitted (no lift)
- `cardHover` in `animations.js` is unused (not this control)
- Cards are not links

---

## C. Root cause of slow / floaty feel

Two systems animated the same properties:

1. Framer Motion default **spring** on `y` (overshoot / slow settle when moving quickly between cards).
2. CSS `transform` **200ms ease** fighting that spring.

Shadow also used 200ms CSS ease, so the lift and shadow lagged the pointer.

---

## D. Before values

| Property | Value |
|----------|--------|
| Movement | `y: -4` (4px) |
| Timing | CSS 200ms + FM spring (implicit) |
| Easing | CSS `ease`; FM spring default |
| Shadow timing | CSS 200ms ease |
| Motion type | Spring (FM) overlapping CSS tween |

---

## E. After values

| Property | Value |
|----------|--------|
| Movement | `y: -4` (unchanged) |
| Duration | **150ms** (`0.15`) |
| Easing | cubic-bezier **[0.22, 1, 0.36, 1]** (ease-out) |
| Shadow | same rest/hover recipes; now tweened with the lift |
| Motion type | Framer Motion **tween** only |
| CSS transform/shadow transition | **removed** (no overlap) |

No scale, rotate, glow, or photo zoom.

---

## F. Exact files modified (product)

- `src/components/TeamMemberCard.jsx`

---

## G. Homepage result

Same `TeamMemberCard`. Hover timing applies to all four leadership cards.

---

## H. /team result

Same component, same hover.

---

## I. Rapid pointer result

Expected: enter → 150ms lift, leave → 150ms return, no spring bounce. Human rapid-pointer review still required.

---

## J. Mobile result

No CSS `:hover` sticky state added. `whileHover` is pointer hover. Touch should not depend on hover. Human check at 390/430 still required.

---

## K. Reduced motion result

`prefers-reduced-motion: reduce` still disables `whileHover` (no translation). Component `transition` duration is `0` in that mode.

---

## L. Image performance regression

**UNCHANGED.** No JPEG, loading, decoding, or dimension edits in this phase.

---

## M. Accessibility regression

Cards remain non-clickable. No new focus ring/hover-for-keyboard requirement. Reduced motion respected. Header/skip/menu not edited.

---

## N. Electrical regression

Electrical files not edited.

---

## O. Responsive regression

Layout/CSS card size unchanged. 768 / short-landscape not retuned.

---

## P. Build result

`npm run build` **PASS**. No errors. No new warnings.

```
dist/assets/index-DCdKucgy.js                         407.96 kB │ gzip: 130.48 kB
dist/assets/index-D5ihWw1E.css                         19.85 kB │ gzip:   5.30 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
```

JS +0.03 kB vs Phase 7D landing (`index-pLTBtr_j.js` 407.93 kB). CSS hash unchanged.

---

## Q. Dependency result

**NONE.**

---

## R. Human test instructions

1. Homepage — hover each card slowly.  
2. Move quickly across all four.  
3. Enter/leave the same card repeatedly.  
4. `/team` leadership — same.  
5. Rapid pass across `/team` cards.  
6. Shadow and lift should feel synchronized.  
7. No bounce/spring.  
8. Faces must not zoom.  
9. Mobile/touch — no sticky hover.  
10. Reduced motion if convenient.

Please answer:

1. Does the card react quickly enough now?  
2. Does it still feel smooth?  
3. Does it feel less floaty?  
4. Is 4px lift still appropriate?  
5. Is the shadow transition fast enough?  
6. Does rapid movement across cards feel clean?  
7. Does it still look professional/subtle?  
8. Would you prefer slightly faster/slower?

**Do not commit.** Wait for approval.

---

## S. Next step

Human visual review of Phase 7D.1.

NO COMMIT. NO PUSH. NO DEPLOY. Do not start Phase 7E.
