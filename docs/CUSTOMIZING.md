# Adapting this site for a real café

The Bistro 67 design is finished, so this guide doesn't turn it into a template. It lists exactly where each thing lives, so a new café can be swapped in without breaking the layout or the animation.

Work on a copy or a new branch, and keep the approved Bistro 67 version intact.

## 1. Café name

The name is written into the page text, not pulled from a variable, so each line can be phrased naturally. Search the project for `Bistro 67`, `BISTRO 67` and `67`:

| File | What to change |
|---|---|
| `index.html` | `<title>`, the meta and Open Graph tags, the header brand (`.brand`), the hidden `<h1>`, the canvas `aria-label`, the visit note and the footer |
| `js/main.js` | The heading of the copied order list (`Bistro 67 order list`) |
| `index.html` | The "THE / 67" signature words and the giant footer `67` (`.final67`). These are part of the brand device; replace them with the new café's equivalent mark or word. |

## 2. Logo

- **Header and footer:** the logo is text, in `.brand` in the header and in the first line of the footer. To use an image logo, replace `<b>BISTRO 67</b>` with an `<img>` (SVG preferred) and give it a fixed height in `css/styles.css` under `.brand`.
- **Favicon:** `assets/brand/favicon.svg`.
- **Social preview image:** `docs/screenshots/og-image.jpg`, at 1200×630.

## 3. Brand colours and fonts

All colours are tokens at the top of `css/styles.css`:

```css
--cream:#F2E9DC;   /* page background */
--paper:#FAF5EC;   /* light text on dark, order panel */
--esp:#25120C;     /* text, dark sections */
--orange:#C54822;  /* accent */
--caramel:#C98B54; /* small labels on dark */
```

The scroll colour changes read `--cream` and `--esp` from these tokens. Also update `<meta name="theme-color">` in `index.html`.

Fonts are the `--sans` and `--serif` tokens, plus the Google Fonts `<link>` in `index.html`. The display type relies on Archivo's variable width axis (`font-stretch: 62.5%`). If you switch fonts, choose a family that has a condensed width, or the large headings will change shape.

## 4. Menu and prices

Everything is in `js/config.js`, in the `MENU` object. Each item is:

```js
['Item name', price, 'Optional one-line description']
```

- `coffee` and `house` feed the two-column printed spread.
- `iced`, `coolers`, `bites`, `pizza` and `desserts` appear under "Full menu".
- The order list is built from the same data, so it stays in sync automatically.
- The note under "Your usual?" in `index.html` (vegetarian, GST, oat milk) is plain text; edit it there.

You can rename a category's label (the first string in each entry) freely. To add or remove a category, also edit the `rest` list in `js/main.js`.

## 5. Address, phone, hours and social

In `js/config.js`, fill in the `CAFE` object:

```js
const CAFE = {
  city: 'Mumbai',
  address: 'Shop 4, Example Road, Bandra West, Mumbai 400050',
  mapsUrl: 'https://maps.app.goo.gl/…',
  phone: '+91 98xxx xxxxx',
  instagram: 'cafehandle'
};
```

Any field left `null` shows "To be confirmed". Phone becomes a `tel:` link and Instagram a profile link once they are set.

Opening hours are a small table in the Visit section of `index.html`. Remove the "Proposed hours." line once the hours are real, and the footer disclaimer (`.end-demo`) once the business is real.

## 6. Photography

Photos live in `assets/photo/`, each at two widths: `name-1600.webp` and `name-800.webp`. To replace one, keep the same file name and aspect ratio, or update the matching `<img>` in `index.html`. Every `<img>` has `src`, `srcset`, `width`, `height` and `alt`.

| Section | File | Ratio |
|---|---|---|
| Signature | `signature` | 4:5. Use a dark background; its edges fade into espresso. |
| Menu spread | `spread` (main), `latteTop` (inset), `fries` (full menu) | 4:5, 1:1, 1:1 |
| A day at 67 | `espresso`, `laptop`, `friends`, `affogato` | 4:5, 3:2, 3:2, 4:5 |
| Corner table | `interior` | 16:10 |
| Visit | `window` | 4:5 |

Keep a consistent grade across a café's photos: warm, contrasty, slightly desaturated. One mismatched photo is the fastest way to make a site look assembled.

## 7. Hero animation

The hero draws `assets/hero/seq/cup_0001.webp` … `cup_0096.webp` on a canvas. To replace it:

1. Produce a new sequence of transparent WebP frames at 1320×1080, with the cup centred and its base near the bottom.
2. Put the frames in `assets/hero/seq/` using the same naming.
3. In `js/main.js`, update the `SEQ` object:
   - `count`: the number of frames.
   - `cupW`, `cupH`, `cupBottom`, `cupX`: the cup's width, height, bottom edge and centre in frame pixels. These keep the cup the same size on screen whatever the viewport.
   - `focus`: the point the final zoom pushes into, usually the centre of the splash.

The scroll timing is in the hero timeline in `js/main.js`: frames play from 12% to 78% of the pinned scroll, then the zoom and the espresso hand-off take over. Reversing works automatically.

Tip: composite every frame from the same few layers (cup, lid, liquid), so the product never shifts between frames.

## 8. Film

Replace `assets/film/made-here.mp4` and its poster `made-here.jpg`. Keep it silent, under about 8 MB, 16:9, and loopable. It plays only while its section is on screen.

## 9. Real ordering or reservations

The order list (`#order` in `index.html`, the "order list (preview)" block in `js/main.js`) only builds and copies text. To make it real, pick one of these:

- **WhatsApp ordering:** in the Copy button's handler, open `https://wa.me/<number>?text=<encoded list>` with the text from `#orderText`. Update the "Preview" note in `index.html`.
- **A delivery platform:** if the café is on Swiggy or Zomato, point the header "Order" button to its listing instead of opening the panel, and keep the panel for building a list.
- **Reservations:** link a booking tool (Dineout, EazyDiner, Google Reserve, or a Calendly/Typeform form) from the Visit section. Avoid building a custom form without a backend to receive it.

Whatever is connected, change the panel's wording so it never promises more than the system does.

## 10. Checklist before sending a café owner their site

- [ ] Name, logo, favicon and social image replaced
- [ ] `CAFE` details filled in, with no "To be confirmed" left
- [ ] Menu and prices confirmed by the owner
- [ ] Real hours set, and the "Proposed" notes removed
- [ ] Footer demo disclaimer (`.end-demo`) removed
- [ ] Photo credits updated in the footer and in `docs/CREDITS.md`
- [ ] Tested on a phone, with scrolling both down and back up through the hero
