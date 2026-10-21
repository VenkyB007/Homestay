# Gotul Hampi Homestay, homestay website

A single-page static site. No build step. Open `index.html` in a browser to see it.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content. Search for `TODO` to find every spot that needs real details. |
| `styles.css` | Layout, colours, type and animations. Colours live at the top under `:root`. |
| `script.js` | Header, menu, scroll reveals, floating leaves, counters, FAQ, photo viewer and the WhatsApp enquiry form. The WhatsApp number is the first line. |
| `images/` | The homestay photos, cropped and compressed for the web (hero, about, rooms, terrace, gallery, social preview). |

## The look

Warm paper background, marigold buttons, an olive block for amenities. Every section sits in a big rounded "slab" inset from the page edge. Headings use Outfit, body text uses Manrope, both from Google Fonts. Icons are Phosphor, loaded from a CDN.

Motion, all of it CSS or a few lines of plain JavaScript:

- Hero text and card slide up on load, the photo settles with a slow zoom.
- Every section fades up as it scrolls into view. Items inside a group stagger one after another.
- The leaves drift on their own and move with the scroll on desktop.
- Button labels roll upward on hover. Cards lift. Photos zoom slightly.
- The header shrinks after you scroll and underlines the section you are in.
- The numbers in the olive block count up the first time they appear.
- FAQ answers open with a smooth height animation.

Everything respects the "reduce motion" setting on phones and computers. The site is light theme only, even when the visitor's device is set to dark mode.

## What is real and what is still a placeholder

Done: name, photos, WhatsApp and phone number (6360250021, same for both), the map pin and embed, the nearby distances (measured by road from the house), the nearby-place photos (Wikimedia Commons, credited in the footer). There is no email on purpose, and no price: the house is booked as one unit and visitors are asked to message for the rate. The reviews section was removed.

Still placeholder text in `index.html`, search for `TODO`:

1. **About section story** (family of four, three generations, opened in 2024).
2. **Address.** Only the village and pin code are real. Add the house number or street in the contact section and footer.
3. **FAQ answers.** Parking, meals, drivers, cycle hire and the check-in times are samples.
4. **Footer line** "Registered homestay, Karnataka Tourism". Remove if not true.
5. **Instagram link** in the footer.
6. **Logo.** The small house mark in the header is an inline SVG. Swap it for your own logo if you make one, and update the favicon at the top of `index.html`.

## Publishing

The site is served by GitHub Pages from the `main` branch of `github.com/VenkyB007/Homestay` at https://venkyb007.github.io/Homestay/. Every push to `main` redeploys it within a minute or two.

## Replacing the photos

Every image currently loads from `picsum.photos` with a descriptive seed. Save your photo into `images/` and change the `src`. The sizes below are what the layout was designed for. Any similar ratio works.

| Spot | Suggested size | Notes |
|---|---|---|
| Hero | 2000 x 1200 (wide) | The house front, the courtyard, or the view from the terrace. The most important photo on the page. The text card sits on the left, so keep the subject to the right. |
| About | 1200 x 900 (4:3) | Terrace or breakfast. |
| House (4) | 1200 x 933 | The two bedrooms, the hall with kitchenette, and the terrace. |
| Gallery (5) | 1200 x 900, 800 x 1000, 800 x 600, 800 x 600, 2000 x 600 (the last is a wide panorama) | |
| Nearby (6) | 700 x 500 | Your own photos of Hampi are better than stock. |
| Map | 900 x 400 | A screenshot of the map, until you paste the real embed. |
| Social preview | 1200 x 630 | The `og:image` meta tag at the top of `index.html`. |

Keep each file under about 400 KB. A free tool such as Squoosh (squoosh.app) does this well.

## Touch and small screens

Every button, link and form field is at least 48px tall. Hover effects only appear on devices with a mouse. On phones and tablets the menu collapses behind a round button, a floating "Book on WhatsApp" button follows the visitor (hidden while the top of the page or the form is on screen), the nearby strip and the reviews swipe sideways, and any room or gallery photo can be tapped to open full screen, then swiped left or right, or swiped down to close. Form text is 16px so iPhones do not zoom in on focus.

## Publishing

Any static host works: Cloudflare Pages, Netlify, GitHub Pages or a plain web server. Upload the four files and the `images` folder.
