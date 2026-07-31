# El Herradero Western Wear — site rebuild + full catalog extract

Built 2026-07-29. **LIVE for review at
https://cornishclaudebot-ux.github.io/elherradero-site/**

This is a preview URL on Aiden's GitHub, not a public launch. It is not on any El Herradero
domain, is not linked from anywhere, and is not indexed. Read the checkout warning in
"Two stores" below before pointing a real domain at it or sharing it with customers.

Repo: https://github.com/cornishclaudebot-ux/elherradero-site (GitHub Pages, `main`, root).
To redeploy: commit and push to `main`, Pages rebuilds in about 40 seconds.

## Run it

```bash
cd ~/elherradero-site && python3 -m http.server 4362
```

Then open http://127.0.0.1:4362 (registered in `~/.claude/launch.json` as `elherradero`, port 4362).

## Two stores. Read this before touching CONFIG or checkout.

There are **two different El Herradero western wear stores in the Phoenix metro**, and they are
not the same business record:

| | **Phoenix (ours)** | **Mesa** |
|---|---|---|
| Address | 4344 W Indian School Rd. Suite 33, Phoenix, AZ 85031 | 1119 S Mesa Dr. STE #103, Mesa, AZ 85210 |
| Phone | (623) 247-9144 | (480) 610-9808 |
| Instagram | @el_herradero | @elherraderoww |
| Website | elherraderophoenix.com (Wix, "Work in progress") | **elherraderoww.com (Shopify)** |
| Email | el.herradero.ww@gmail.com | not published |

**The register I identified is the Phoenix one.** The Visi-Soft title bar reads
`EL HERRADERO WESTERN WEAR (Indian)` — "(Indian)" is Indian School Rd. Aiden also confirmed
"Phoenix only". So `CONFIG` now carries the Phoenix address, phone, hours and socials, all
verified against elherraderophoenix.com.

**Unresolved and it involves money.** The 835-product catalog and the working checkout both come
from **elherraderoww.com**, which is the store whose own store-info page lists only the Mesa
address. Aiden said "it's our site", so the likeliest reading is common ownership with the
Shopify acting as the company's online store. But until that is confirmed:

> `CONFIG.shopBase` points at elherraderoww.com, so **every card payment lands in Shopify
> shop id 46604288151**. If that Shopify belongs to the Mesa store rather than to Phoenix,
> this site would route Phoenix customers' money into Mesa's account. Confirm ownership before
> the site goes anywhere near live.

Also worth knowing: 4344 W Indian School Rd is the same address as Stratus Event Center, so the
Phoenix store is a suite at a property Aiden already works with.

## What their register actually runs

The store PC is a **Dell OptiPlex 7040 SFF** (Service Tag `3GY16K2`, Windows 10 Pro) running
**Visi-Soft ver 2.01** — "Sistema Integral Inventarios y CxC", a legacy Spanish-language
Windows POS. Modules: Ventas, Clientes, Inventario, Servicios, Fin del dia, Reportes,
Punto de venta, CXC/CXP, Apartados.

Three things this means:

1. **Visi-Soft is Windows-only and offline.** Inventory lives in a database file on that
   Dell's own drive. There is no cloud tenant, so it cannot be "downloaded and logged into"
   from a Mac. The app without that machine's database is an empty shell.
2. **Visi-Soft and the Shopify store do not talk to each other.** They are two separate
   systems of record. Nothing syncs.
3. **7,433 of 7,436 Shopify variants have no SKU.** That is the concrete reason a sync does
   not exist: there is no shared identifier to join a Visi-Soft item to a Shopify variant.
   Any future integration starts by writing SKUs into Shopify.

### Why HDMI / USB-C could not screen-share it

A MacBook's HDMI and USB-C ports are video **outputs**. A cable between two computers carries
no screen signal in that direction. Capturing the register's display needs a **USB 3.0 HDMI
capture card** (~$10-25 on Amazon, e.g. the acer or UGREEN units) which presents itself as a
webcam. Verified: `ffmpeg -f avfoundation -list_devices true -i ""` showed no new device after
plugging in, and `system_profiler SPDisplaysDataType` showed only the built-in panel.

Network route was also checked and is closed: the Dell sits at **192.168.12.113** on the shared
LAN, and ports 3389 (RDP), 445/139 (SMB), 80/443, 5900 (VNC) are all closed. Remote Desktop
would have to be enabled on the machine itself first.

## Catalog extract (the real product list)

Source: `elherraderoww.com` Shopify storefront, `products.json`, pulled 2026-07-29.

| Metric | Value |
|---|---|
| Products (styles) | 835 |
| Variants (sellable SKUs) | 7,436 |
| In stock variants | 2,696 |
| Out of stock variants | 4,740 (64%) |
| Styles fully out of stock | 99 |
| Brands | 59 |
| Categories | 29 |
| Price range | $5.99 to $1,599.99 |
| Average variant price | $162.30 |
| Variants missing a SKU | 7,433 |
| Styles with 1 or 0 photos | 184 |

Top categories: Shirts & Tops (212), Boots (89), Cap (84), Belts (70), Work Boots & Shoes (56),
Pants (53), Outerwear (48), Shoes (32), Felt Hat (28), Ankle Boots (28).

Top brands: Cuadra (87), Kimes Ranch (78), Roper (75), Ariat (71), Platini (55), Hooey (49),
Cinch (46), Wrangler (38), Durango (34), Justin (24).

### Files in `data/`

| File | What it is |
|---|---|
| `catalog_variants.csv` | Every one of the 7,436 sellable SKUs, one per row. The full list. |
| `catalog_products.csv` | 835 rows, one per style, sizes collapsed into a column. |
| `catalog.json` | 245 KB compressed index the site loads at runtime. |
| `products.json` | Site-ready trimmed JSON with descriptions. |
| `catalog_raw.json` | Untouched Shopify payload, archived. |
| `catalog_report.json` | The analysis table above, machine readable. |

Regenerate with `python3 /private/tmp/.../build_data.py` (script kept in the session scratchpad)
or re-pull from `products.json?limit=250&page=N` (4 pages).

## The site

House system: **Hi Ibiza minimal** (premium retail, product-forward), token-remapped for
western — near-black `#0a0908` ground, bone `#f4f1ea` type, saddle `#a8622c` accent, Archivo
display. Governing metaphor: **their own boot-and-hat wall**, built from real product
photography rather than ambient decoration.

- `index.html` — hero wall (real merchandise, GPU transform-only drift), departments rail with
  live counts, new arrivals, visit panel.
- `shop.html` — all 835 styles, search + department + brand + sort, 48-per-page progressive
  reveal, deep-linkable via `?c=Boots`.
- `assets/app.js` — `EH.CONFIG` holds every real-world value; nav and footer injected on every
  page. One edit changes the site.
- `assets/site.css` — tokens, components, iPhone trims at 560px.

Every number on the site is derived from the catalog at runtime. Nothing is hardcoded and
there is no placeholder content anywhere.

### Verified

- 63/63 images load, zero broken (Shopify CDN sizing uses `?width=` not `&width=`, which was
  a real bug caught in preview).
- Console clean, no errors.
- 375px and 1280px both walked. Nav fits, no horizontal scroll, 44px+ tap targets, 16px inputs.
- Hours, address, phone and both map links resolve from CONFIG and match their own store-info page.
- Screenshots in `.shots/`.

### Sourcing note

Their own store-info page gives **(480) 610-9808** and **1119 S Mesa Dr. STE #103, Mesa, AZ 85210**.
A web search had returned a 623 number and a Phoenix address — that is a different, related
storefront. The site uses their own page as authoritative.

## Everything stays on our site now

Nothing bounces to the old storefront. `assets/app.js` builds every product card as
`./product.html?h=<handle>`, and the only outbound links in the whole site are the map and the
three social icons in the footer.

- **`product.html`** — full detail page on our domain: image gallery with thumbnails, brand,
  price, size grid, fulfillment line, the manufacturer's own description rendered on the page
  (headline promoted, spec bullets as a list), plus Sizes/Specs/Try-it-on detail blocks and
  8 related products from the same department.
- **`data/p/<handle>.json`** — 835 detail files, 2.4 KB average, so a product page is instant
  and the shop index stays at 245 KB.
- **Cart** — lives entirely on our site in `localStorage` (`eh_cart_v1`). Slide-out bag with
  quantity steppers, per-line In stock / Special order tags, and a running subtotal.

## Sizes are all open, and the special-order path

Every size is selectable. Nothing is disabled or struck through. A size we do not stock is
marked with a saddle dot and becomes a **special order**, which is exactly the drop-ship model:
we bring it from the manufacturer and it ships to the customer.

**One hard constraint, verified empirically rather than assumed.** Shopify refuses to put an
out-of-stock variant in a cart:

```
POST https://elherraderoww.com/cart/add.js  {"items":[{"id":46204631285911,"quantity":1}]}
-> HTTP 422  "The product '... - 28 x 30' is already sold out."
```

An in-stock variant on the same product returns 200 and adds fine, and a cart permalink for
in-stock lines resolves to El Herradero's own checkout (shop id 46604288151, confirmed).

So the cart splits honestly:
- **In-stock lines** go to `elherraderoww.com/cart/<variantId>:<qty>,...` and take a card today.
- **Special-order lines** are held out of that permalink (they would be silently dropped) and
  routed to `special-order.html`, which builds a real pre-filled text message and call link to
  **(480) 610-9808** with the exact items, sizes and total.

**The single decision that upgrades this.** In Shopify, set the relevant variants to
**"Continue selling when out of stock"** (inventory policy `continue`). The moment that is on,
flip `CONFIG.shopifyOversell = true` in `assets/app.js` and every size, in stock or not, flows
through one normal card checkout with a longer stated lead time. No separate system, no manual
step. That is a real commitment to fulfill from the manufacturer, so it is your call, not mine,
and I did not touch their live store settings.

**Lead times are deliberately not invented.** `CONFIG.leadInStock` states 1 to 2 business days
from the Mesa floor, which is safe. `CONFIG.specialDays` is `null`, so the special-order copy
reads "We confirm your exact delivery window within one business day of your order." Set
`specialDays` to a real window (per brand if they differ) once you have manufacturer lead
times, and the copy switches automatically. Never ship a guessed shipping estimate.

## Still open

1. **SKUs.** 7,433 of 7,436 variants have none. This is the prerequisite for ever syncing
   Visi-Soft, and it also makes special orders far easier to place with each manufacturer.
2. **Self-updating catalog.** Not yet wired. Same shape as The 44: pull `products.json` on a
   launchd cron from the Mac's residential IP, refuse to write on a short or suspicious
   response, commit only if changed.
3. **Photography.** 184 styles have one photo or none.
4. **Per-brand lead times.** Cuadra, Ariat and Kimes Ranch will not have the same window.

## Brand assets

Built from the logo file Aiden supplied (`ChatGPT Image Jul 29, 2026 at 08_40_11 PM.png`),
recoloured losslessly rather than regenerated, so the bull line work is byte-for-byte his artwork.
Method: trim the white margin, then take alpha from darkness (`alpha = invert(luminance)`) and
paint the result a flat colour. That keeps the antialiased edges clean instead of leaving a white
halo, which is what a plain background-removal would have done.

All in `assets/brand/`:

| File | Use |
|---|---|
| `logo-master.png` | trimmed original, black on white, the archive copy |
| `logo-bone.png` / `logo-white.png` / `logo-ink.png` | full lockup, transparent, in site bone / pure white / near-black for light backgrounds |
| `mark-bone.png`, `mark-ink.png` | bull rider only |
| `wordmark-bone.png` | type only |
| `mark-nav.png` | bull sized for the nav (90x132, 20 KB) |
| `logo-foot.png` | lockup for the footer (1000px wide) |
| `icon-180.png`, `icon-512.png` | iOS home screen and PWA icons, bull on ink |
| `og-image.jpg` | 1200x630 share card |
| `../favicon.ico` | 16/32/48 multi-size |

**Where it appears:** bull mark plus the wordmark set in Archivo in the nav; full lockup in the
footer at 50% opacity as the closing brand moment; bull as favicon and iOS home-screen icon; full
lockup on the share card.

**Why the nav is a bull plus HTML type rather than the lockup image.** The lockup is 2.45:1, so
at any nav-appropriate height "WESTERN WEAR" lands around 6 to 7px and turns to mush. The bull
alone also failed at 28px, reading as noise, so it is sized at 42px desktop / 34px phone, which is
its legibility floor rather than a proportion picked to match the type.

> **Deploy note.** `og:url` and `og:image` are absolute and currently point at
> `https://www.elherraderophoenix.com`. Open Graph crawlers do not resolve relative paths, so if
> this deploys anywhere else, find and replace that base across the four HTML files or shares will
> show no image.

## iOS pass

Not just responsive, actually built for the iPhone, since most traffic arrives from Instagram
in-app browsers.

- `viewport-fit=cover` plus `env(safe-area-inset-*)` on the nav, the bag footer and the buy bar,
  so nothing hides under the notch or the home indicator.
- `theme-color`, `apple-mobile-web-app-capable`, `black-translucent` status bar, and an
  `apple-mobile-web-app-title` so an added-to-home-screen icon behaves.
- `-webkit-tap-highlight-color:transparent`, `-webkit-touch-callout:none` and `user-select:none`
  on controls, so taps do not flash grey and long-press does not select button text.
- **Bag is a bottom sheet on phones**, not a side drawer, with a grabber pill, `max-height:88svh`,
  and `overscroll-behavior:contain` so scrolling the bag does not drag the page behind it.
- **Gallery is a real swipe carousel** at 640px and below: `scroll-snap-type:x mandatory` with
  momentum scrolling, and the thumbnails collapse into dots that stay in sync both ways.
- **Sticky buy bar** appears once the price scrolls off, showing live price plus the chosen size
  and whether it is in stock or a special order. Tapping Add with no size picked scrolls the size
  grid into view rather than just erroring.
- `100svh` not `100vh`, so the hero does not jump when Safari's address bar collapses.
- 16px inputs (no iOS zoom-on-focus), 44px+ tap targets, `format-detection=telephone=no` so iOS
  stops auto-linking numbers in product copy.

Verified at 375px: body scroll width 377 against a 375 viewport on all of index, shop and
product. No horizontal scroll anywhere.

## Bugs found and fixed in preview (not on faith)

- Shopify CDN sizing needs `?width=`; appending `&width=` to a query-less URL 404s every image.
- The off-screen cart drawer widened the document and created horizontal scroll on phones.
  Fixed by clipping it inside a fixed, viewport-sized `#cartRoot` with `overflow:hidden`.
- `grid-template-columns:1fr` on the product page let the thumbnail scroll row's min-content
  blow the column out to 572px inside a 375px viewport. Fixed with `minmax(0,1fr)` plus
  `min-width:0` on the grid children. Body scroll width is now 377 against a 375 viewport.
- Category labels ran into their counts because the count span was inline, not block.
- The nav brand mark truncated once Bag was added; tightened the phone nav instead of shortening
  the brand. All three nav pills are 44px tall.
- The buy bar never revealed: first attempt observed the size grid, which is 905px tall and so
  never stops intersecting. Second attempt used an IntersectionObserver sentinel, which also
  failed because IO fires only on state changes and a scripted jump from below-viewport to
  above-viewport is the same non-intersecting state. Final version is a passive scroll listener
  checking the price's `top < 0`. Also dropped a requestAnimationFrame throttle, because rAF
  starves in a backgrounded tab and the stuck flag then blocks every later check.
