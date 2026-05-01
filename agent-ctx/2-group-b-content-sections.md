# Task 2 — Group B: Content Sections

## Agent: Main Agent
## Task: Create 4 content section components for Keur Gui Luxe

### Work Log:

1. **Brand Story Scroll** (`/src/components/ui/brand-story-scroll.tsx`)
   - Created scroll-driven narrative with 4 chapters: Les Racines, L'Atelier, Le Défilé, L'Avenir
   - GSAP ScrollTrigger with `pin: true` for each chapter
   - Text animates in from left, images from right with parallax
   - Background gradient shifts between chapters
   - Progress indicator dots on right side (active one glows gold #d4af37)
   - Large chapter numbers (01-04) as subtle background text
   - Each chapter has specific image from gallery-heritage collection
   - Responsive: stacks on mobile via CSS media query

2. **Countdown Collection** (`/src/components/ui/countdown-collection.tsx`)
   - Target date: July 15, 2025 19:00:00 GMT (Dakar Fashion Week)
   - Flip-digit countdown with DAYS:HOURS:MINUTES:SECONDS
   - CSS 3D flip animation using key-based remount pattern (avoids lint issues with setState in effects)
   - Title: "Collection Été 2025" / "Dakar Fashion Week"
   - Dark background with CSS-only gold particle effect (30 animated particles)
   - "Réserver une invitation" button with gold (#d4af37) outline style
   - Sneak peek image strip (3 blurred images that clear on hover)
   - Responsive: stacks on mobile

3. **Newsletter Cinématique** (`/src/components/ui/newsletter-cinematic.tsx`)
   - Envelope with 3D CSS animation (perspective + rotateX for flap)
   - Click envelope → flap opens → form slides up from inside
   - Deep burgundy/bordeaux envelope with gold wax seal ("K" letter)
   - Title: "Restez Inspiré" with tagline
   - Form: email input + "S'abonner" button
   - Success state: checkmark SVG animation + French confirmation message
   - All state managed with useState, no external dependencies
   - Gold shimmer background with gradient

4. **Instagram Feed** (`/src/components/ui/instagram-feed.tsx`)
   - Title: "@keurguiluxe" with Instagram SVG icon
   - Grid of 6 mock posts (3 columns × 2 rows)
   - Each post: collection image + hover overlay (heart + likes, comment + count)
   - Instagram-style bottom gradient overlay
   - GSAP ScrollTrigger stagger animation on card entry
   - Hover: image scales up, overlay fades in
   - "Voir plus sur Instagram" button with gold styling
   - Responsive: 2 columns tablet, 1 column mobile

5. **Integration** — Updated `page.tsx` to import and render all 4 new components between the Featured Product section and the Footer.

### Technical Notes:
- Used `<style jsx>` for component-scoped CSS animations and responsive media queries
- Avoided `setState` in `useEffect` and ref access during render to satisfy strict React lint rules
- Used `key` prop pattern for flip animations instead of state-based tracking
- All animations use CSS keyframes or GSAP ScrollTrigger
- Color scheme: #d4af37 gold accent on #0a0a0a dark background

### Files Created/Modified:
- `/src/components/ui/brand-story-scroll.tsx` (new)
- `/src/components/ui/countdown-collection.tsx` (new)
- `/src/components/ui/newsletter-cinematic.tsx` (new)
- `/src/components/ui/instagram-feed.tsx` (new)
- `/src/app/page.tsx` (modified — added imports and component renders)

### Lint: ✅ Clean (no errors)
