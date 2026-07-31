# One connected system: Shopify POS

Written 2026-07-29 for **El Herradero Western Wear, Phoenix** (4344 W Indian School Rd Suite 33).

Based on your answers: cash and carry only (no layaway, no customer accounts), most manufacturer
hang tags already carry UPCs, full cutover away from Visi-Soft, one location.

Those four answers make this unusually clean. Layaway was the one thing that would have forced a
different product, and you do not need it.

## The recommendation

**Shopify POS Pro, on the Shopify you already have.**

The reason is not that Shopify POS is the best retail POS in the abstract. It is that it is the
only option where the register and the website are *the same system* rather than two systems with
a sync layer between them. There is no connector to break, no nightly job to fail, no drift to
reconcile. When a boot sells on the floor, the website's count drops in the same instant, because
there is only one count.

That directly answers what you asked for: scan in store, log what you have and what you do not,
and push the gaps online as orderable.

**Cost:** POS Lite is included free on your existing Shopify plan. POS Pro is about $89/month for
the one location and is the one you want, because Lite does not include stocktaking, purchase-order
style receiving, or per-staff permissions. One location, so one license.

**Hardware:** an iPad or iPhone runs the register. A Bluetooth barcode scanner (Socket Mobile S700
is the one Shopify certifies, roughly $300) makes scanning fast, though the device camera works if
you want to start with zero hardware spend. Add a Shopify card reader, cash drawer and receipt
printer to match what the counter does today.

### Alternatives, and why not

- **Lightspeed Retail** is genuinely stronger for apparel size/color matrices and for purchase
  orders across many vendors. But it is a separate system that syncs *into* Shopify, so you get
  two sources of truth and a connector that can silently fall behind. Worth revisiting only if
  buying and receiving across your 59 brands becomes the bottleneck.
- **Square for Retail** is cheaper but its Shopify sync is third-party. Same two-source problem,
  with less control.

Both are the right answer for a store that is *not* already on Shopify. You are, so they are not.

## The real work is data, not software

The software switch is a weekend. The catalog is the project.

**7,433 of 7,436 variants have no SKU and no barcode.** You cannot scan an item that has no
barcode on file, so nothing else starts until this is fixed. Everything below is in order.

### Phase 1: give every variant an identity

Since most hang tags already carry UPCs, the fastest route is to capture rather than invent.

1. Put an iPad on the counter in Shopify admin with the variant list open.
2. Walk the floor by brand. Scan the tag, paste the UPC into that variant's barcode field.
3. For items with no factory tag, generate an internal SKU and print a label. A sane scheme is
   `BRAND-STYLE-SIZE`, e.g. `WRA-WRT20JH-3030`, which is readable by staff and sorts correctly.
4. Set every variant to **track quantity**.

This is 835 styles to touch across 59 brands, but it is very front-loaded. Work biggest brand
first and you clear half the catalog in six brands:

| # | Brand | Styles | Cumulative | % of catalog |
|---|---|---|---|---|
| 1 | Cuadra | 87 | 87 | 10% |
| 2 | Kimes Ranch | 78 | 165 | 20% |
| 3 | Roper | 75 | 240 | 29% |
| 4 | Ariat | 71 | 311 | 37% |
| 5 | Platini | 55 | 366 | 44% |
| 6 | Hooey | 49 | 415 | **50%** |
| 7 | Cinch | 46 | 461 | 55% |
| 8 | Wrangler | 38 | 499 | 60% |
| 9 | Durango | 34 | 533 | 64% |
| 10 | Justin | 24 | 557 | 67% |
| 11 | Milano Hats | 23 | 580 | 69% |
| 12 | Caterpillar | 20 | 600 | **72%** |

Twelve brands gets you to 72%. The remaining 47 brands are the long tail, mostly a handful of
styles each, and can be done as items come across the counter rather than in a dedicated pass.

### Phase 2: make the numbers true

Right now the online counts say 4,740 of 7,436 variants are out of stock. Some of that is real,
some is stale. Do a full physical count with the scanner and set opening quantities. Until this
is done, "in stock" on the website is a guess, and a wrong "in stock" is worse than an honest
"special order".

### Phase 3: turn on the drop-ship model properly

This is the piece the website is already built for and waiting on.

In Shopify, set the variants you can reliably reorder to **"Continue selling when out of stock."**
Then in `assets/app.js` flip:

```js
shopifyOversell: true
```

The moment both are done, every size on the site, in stock or not, goes through one normal card
checkout. The customer pays online, you order from the manufacturer, it ships to their door. No
phone call, no separate request flow, no manual step. The site already labels each size with its
fulfillment path, so nothing about the front end has to change.

Also set `CONFIG.specialDays` to a real window once you know each brand's lead time. Leave it
`null` until then; the copy falls back to confirming the date within one business day rather than
promising a number you cannot hold.

### Phase 4: close the loop

- **Receiving:** scan cartons in as they arrive, so counts stay true without a second count.
- **Low stock:** Shopify POS Pro flags variants below a threshold, which becomes your reorder list.
- **What sells that you do not stock:** every special order is a signal. If the same size keeps
  getting special-ordered, buy it. That report is the difference between guessing your buy and
  knowing it.

## What this replaces

Visi-Soft's modules map cleanly, which is why a full cutover is realistic for you:

| Visi-Soft | Shopify POS |
|---|---|
| Punto de venta | POS app checkout |
| Inventario | Products and inventory, shared with the website |
| Ventas | Orders and reports |
| Clientes | Customers, with purchase history |
| Fin del dia | Daily sales summary and cash tracking |
| Reportes | Analytics |
| Apartados (layaway) | **Not needed, you are cash and carry** |
| CXC / CXP | **Not needed** |

The two modules Shopify POS genuinely cannot replace are the two you told me you do not use.
That is what makes this a clean cutover rather than a compromise.

## Before you cut over

1. **Confirm the Shopify ownership question.** See the "Two stores" section in `README-AIDEN.md`.
   The catalog and checkout currently run through elherraderoww.com, whose store-info page lists
   the Mesa address. If that Shopify is not the Phoenix store's, this whole plan needs a different
   Shopify account first, and card payments would otherwise land in the wrong place.
2. **Export Visi-Soft history first.** Once that Dell is retired you lose sales history unless it
   is exported. Its Reportes module should export; if not, the database file on that machine is
   the fallback. Do this before anything is uninstalled.
3. **Do not cut over during a busy stretch.** Phase 1 and 2 first, cutover on a slow weekday.
