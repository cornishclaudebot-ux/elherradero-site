/* El Herradero Western Wear — app shell.
   Every real-world value lives in CONFIG. One edit changes the whole site.
   Sources: elherraderoww.com/pages/store-info (hours, address, phone, socials),
            elherraderoww.com products.json (catalog, pulled 2026-07-29). */

window.EH = (function () {
  // ---------------------------------------------------------------------------
  // THIS IS THE PHOENIX STORE (Indian School Rd). Confirmed two ways: Aiden said
  // "Phoenix only", and the register's Visi-Soft title bar reads
  // "EL HERRADERO WESTERN WEAR (Indian)".
  //
  // There is a SEPARATE El Herradero in Mesa (1119 S Mesa Dr STE #103,
  // (480) 610-9808, IG @elherraderoww) and the Shopify store elherraderoww.com
  // lists ONLY that Mesa address on its store-info page. See README-AIDEN.md
  // "Two stores" before changing shopBase, because that is where checkout money
  // lands.
  // Store facts below verified against elherraderophoenix.com (their own site).
  // ---------------------------------------------------------------------------
  var CONFIG = {
    name: "El Herradero Western Wear",
    shortName: "El Herradero",
    address: "4344 W Indian School Rd. Suite 33, Phoenix, AZ 85031",
    // Their Phoenix site publishes no cross streets, so nothing is invented here.
    crossStreets: null,
    phone: "(623) 247-9144",
    phoneRaw: "+16232479144",
    email: "el.herradero.ww@gmail.com",
    shopBase: "https://elherraderoww.com",
    productBase: "https://elherraderoww.com/products/",
    instagram: "https://instagram.com/el_herradero",
    tiktok: null,
    facebook: "https://facebook.com/ELHERRADEROWW",
    hours: [
      ["Monday - Thursday", "10:00 am - 8:00 pm"],
      ["Friday - Saturday", "10:00 am - 9:00 pm"],
      ["Sunday", "10:00 am - 6:00 pm"]
    ],
    hoursNote: "Holidays may affect business hours.",
    catalogPulled: "July 29, 2026",

    // ---- fulfillment ----
    // inStock: safe to state, these ship from the Mesa floor.
    // special: DELIBERATELY does not promise a number. Set specialDays to a real
    // window ONLY once manufacturer lead times are confirmed per brand, then this
    // copy switches automatically. Never invent a shipping estimate.
    city: "Phoenix",
    leadInStock: "Ships in 1 to 2 business days from our store.",
    specialDays: null,
    specialFallback: "Special order. We confirm your exact delivery window within one business day of your order.",
    get leadSpecial() {
      return this.specialDays
        ? "Special order, arrives in about " + this.specialDays + "."
        : this.specialFallback;
    },
    // Flip to true ONLY after "Continue selling when out of stock" is enabled on
    // the Shopify variants. Until then Shopify returns 422 for sold-out variants,
    // so special orders are captured as a request instead of going to checkout.
    shopifyOversell: false
  };

  // derive, never hardcode
  CONFIG.mapApple = "https://maps.apple.com/?q=" + encodeURIComponent(CONFIG.address);
  CONFIG.mapGoogle = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
  CONFIG.mapEmbed = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.address) + "&output=embed";
  CONFIG.isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  CONFIG.mapUrl = CONFIG.isApple ? CONFIG.mapApple : CONFIG.mapGoogle;

  var ICON = {
    search: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>',
    chev: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9l6 6 6-6"/></svg>'
  };

  function nav() {
    var el = document.createElement("header");
    el.className = "nav";
    el.innerHTML =
      '<a class="nav__mark" href="./index.html" aria-label="' + CONFIG.name + ', home">' +
        '<img class="nav__bull" src="./assets/brand/mark-nav.png" alt="" ' +
             'width="49" height="72" decoding="async">' +
        '<span class="nav__name">EL HERRADERO' +
          '<span class="nav__mark-x"> <b>/</b> WESTERN WEAR</span></span>' +
      "</a>" +
      '<div class="nav__acts">' +
        '<a class="pill pill--solid" href="./shop.html">Shop</a>' +
        '<button class="pill pill--bag" id="bagBtn" aria-label="Open bag">Bag' +
          '<span class="badge" id="cartBadge" hidden>0</span></button>' +
        '<button class="pill" id="menuBtn" aria-expanded="false">Menu</button>' +
      "</div>";
    document.body.prepend(el);

    var m = document.createElement("nav");
    m.className = "menu";
    m.id = "menu";
    m.innerHTML =
      '<button class="pill menu__close" id="menuClose">Close</button>' +
      '<a href="./shop.html">Shop All</a>' +
      '<a href="./shop.html?c=Boots">Boots</a>' +
      '<a href="./shop.html?c=Felt+Hat">Hats</a>' +
      '<a href="./shop.html?c=Shirts+%26+Tops">Apparel</a>' +
      '<a href="./index.html#visit">Visit</a>';
    document.body.appendChild(m);

    function set(open) {
      m.classList.toggle("open", open);
      document.getElementById("menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }
    document.getElementById("menuBtn").onclick = function () { set(true); };
    document.getElementById("bagBtn").onclick = function () { cartOpen(true); };
    document.getElementById("menuClose").onclick = function () { set(false); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  function footer() {
    var el = document.createElement("footer");
    el.className = "foot";
    el.innerHTML =
      '<img class="foot__logo" src="./assets/brand/logo-foot.png" ' +
           'alt="' + CONFIG.name + '" width="1000" height="407" loading="lazy" decoding="async">' +
      '<div class="foot__rows">' +
        '<div class="foot__col"><h4>Visit</h4>' +
          '<a href="' + CONFIG.mapUrl + '" target="_blank" rel="noopener">' + CONFIG.address + "</a>" +
          (CONFIG.crossStreets ? "<p>" + CONFIG.crossStreets + "</p>" : "") +
        "</div>" +
        '<div class="foot__col"><h4>Contact</h4>' +
          '<a href="tel:' + CONFIG.phoneRaw + '">' + CONFIG.phone + "</a>" +
          (CONFIG.email ? '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a>" : "") +
        "</div>" +
        '<div class="foot__col"><h4>Follow</h4>' +
          // only render socials this store actually has
          [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"]]
            .filter(function (s) { return CONFIG[s[0]]; })
            .map(function (s) {
              return '<a href="' + CONFIG[s[0]] + '" target="_blank" rel="noopener">' + s[1] + "</a>";
            }).join("") +
        "</div>" +
        '<div class="foot__col foot__col--trim"><h4>Shop</h4>' +
          '<a href="./shop.html">All Products</a>' +
          '<a href="./shop.html?c=Boots">Boots</a>' +
          '<a href="./shop.html?c=Belts">Belts</a></div>' +
      "</div>" +
      '<div class="legal"><span>&copy; ' + new Date().getFullYear() + " " + CONFIG.name + "</span>" +
      "<span>" + CONFIG.city + ", Arizona</span></div>";
    document.body.appendChild(el);
  }

  function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add("in"); io.unobserve(r.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }

  function money(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  // Shopify CDN sizing. The stored srcs have no query string, so pick the
  // right separator instead of always appending "&" (which yields a 404).
  function img(src, w) {
    if (!src) return "";
    return src + (src.indexOf("?") === -1 ? "?" : "&") + "width=" + w;
  }

  // ---- catalog ----
  var CAT = null;
  function loadCatalog() {
    if (CAT) return Promise.resolve(CAT);
    return fetch("./data/catalog.json")
      .then(function (r) { if (!r.ok) throw new Error("catalog " + r.status); return r.json(); })
      .then(function (d) {
        CAT = d.items.map(function (o) {
          var handle = /^https?:/.test(o.u) ? o.u.split("/products/").pop() : o.u;
          return {
            title: o.t, brand: o.b, cat: o.c,
            price: o.p, priceMax: o.pm || null,
            sizes: o.s ? o.s.split("|") : [],
            inStock: !o.x,
            imgs: (o.i || []).map(function (s) { return /^https?:/.test(s) ? s : d.pre + s; }),
            handle: handle,
            // stay on our site
            url: "./product.html?h=" + encodeURIComponent(handle)
          };
        });
        return CAT;
      });
  }

  function cardHTML(p) {
    var image = p.imgs[0] || "";
    var price = p.priceMax && p.priceMax !== p.price
      ? money(p.price) + " - " + money(p.priceMax) : money(p.price);
    return '<a class="card" href="' + p.url + '">' +
      '<div class="card__img">' +
        (p.inStock ? "" : '<span class="tag-oos">Sold out</span>') +
        (image ? '<img loading="lazy" decoding="async" src="' + img(image, 520) + '" alt="' +
               p.title.replace(/"/g, "&quot;") + '">' : "") +
      "</div>" +
      '<div class="card__body">' +
        (p.brand ? '<div class="card__b">' + p.brand + "</div>" : "") +
        '<div class="card__t">' + p.title + "</div>" +
        '<div class="card__p">' + price + "</div>" +
        (p.sizes.length ? '<div class="card__s">' + p.sizes.slice(0, 9).join(" &middot; ") + "</div>" : "") +
      "</div></a>";
  }

  // ---------------- cart ----------------
  // Lives entirely on this site (localStorage). The ONLY handoff is the final
  // payment step, which goes to El Herradero's own Shopify checkout via a cart
  // permalink: /cart/<variantId>:<qty>,<variantId>:<qty>
  var CART_KEY = "eh_cart_v1";

  function cartRead() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function cartWrite(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    cartPaint();
  }
  function cartCount() {
    return cartRead().reduce(function (n, i) { return n + i.qty; }, 0);
  }
  function cartTotal() {
    return cartRead().reduce(function (n, i) { return n + i.price * i.qty; }, 0);
  }
  function cartAdd(item) {
    var items = cartRead();
    var hit = items.filter(function (i) { return i.vid === item.vid; })[0];
    if (hit) hit.qty += item.qty || 1;
    else items.push({
      vid: item.vid, qty: item.qty || 1, title: item.title, brand: item.brand,
      variant: item.variant, price: item.price, img: item.img, handle: item.handle,
      special: !!item.special
    });
    cartWrite(items);
    cartOpen(true);
  }
  function cartSetQty(vid, qty) {
    var items = cartRead().map(function (i) {
      if (i.vid === vid) i.qty = qty;
      return i;
    }).filter(function (i) { return i.qty > 0; });
    cartWrite(items);
  }
  function cartSplit() {
    var items = cartRead();
    // A special-order line can only ride Shopify checkout once overselling is on.
    var viaShopify = CONFIG.shopifyOversell
      ? items
      : items.filter(function (i) { return !i.special; });
    var viaRequest = CONFIG.shopifyOversell
      ? []
      : items.filter(function (i) { return i.special; });
    return { all: items, shopify: viaShopify, request: viaRequest };
  }

  // Shopify cart permalink. Verified 2026-07-29: in-stock variants resolve to the
  // store's own checkout; sold-out variants return 422 from /cart/add.js, which is
  // why they are routed to the request flow instead of being silently dropped.
  function checkoutUrl() {
    var s = cartSplit().shopify;
    if (!s.length) return null;
    return CONFIG.shopBase + "/cart/" +
      s.map(function (i) { return i.vid + ":" + i.qty; }).join(",");
  }

  function cartMount() {
    var el = document.createElement("div");
    el.id = "cartRoot";
    el.innerHTML =
      '<div class="cart__scrim" id="cartScrim"></div>' +
      '<aside class="cart" id="cartPanel" aria-label="Cart">' +
        '<div class="cart__top">' +
          '<strong>Your bag</strong>' +
          '<button class="pill" id="cartClose">Close</button>' +
        "</div>" +
        '<div class="cart__body" id="cartBody"></div>' +
        '<div class="cart__foot">' +
          '<div class="cart__sum"><span>Subtotal</span><b id="cartTotal">$0</b></div>' +
          '<p class="cart__fine">Shipping and tax calculated at checkout.</p>' +
          '<a class="pill pill--solid cart__go" id="cartGo" href="#">Checkout</a>' +
          '<div id="cartSpecial" hidden>' +
            '<p class="cart__split" id="cartSplitMsg"></p>' +
            '<a class="pill cart__req" id="cartReq" href="./special-order.html">Request special-order items</a>' +
          "</div>" +
        "</div>" +
      "</aside>";
    document.body.appendChild(el);
    document.getElementById("cartClose").onclick = function () { cartOpen(false); };
    document.getElementById("cartScrim").onclick = function () { cartOpen(false); };
    document.getElementById("cartGo").onclick = function (e) {
      var u = checkoutUrl();
      if (!u) { e.preventDefault(); return; }
      this.href = u;
    };
    cartPaint();
  }

  function cartOpen(open) {
    var r = document.getElementById("cartRoot");
    if (!r) return;
    r.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function cartPaint() {
    var badge = document.getElementById("cartBadge");
    var n = cartCount();
    if (badge) {
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    var body = document.getElementById("cartBody");
    if (!body) return;
    var items = cartRead();
    if (!items.length) {
      body.innerHTML = '<p class="cart__empty">Your bag is empty.</p>';
    } else {
      body.innerHTML = items.map(function (i) {
        return '<div class="crow">' +
          '<a class="crow__img" href="./product.html?h=' + encodeURIComponent(i.handle) + '">' +
            (i.img ? '<img src="' + img(i.img, 160) + '" alt="">' : "") + "</a>" +
          '<div class="crow__mid">' +
            (i.brand ? '<span class="crow__b">' + i.brand + "</span>" : "") +
            '<a class="crow__t" href="./product.html?h=' + encodeURIComponent(i.handle) + '">' + i.title + "</a>" +
            (i.variant && i.variant !== "Default" && i.variant !== "Default Title"
              ? '<span class="crow__v">' + i.variant + "</span>" : "") +
            (i.special
              ? '<span class="crow__tag crow__tag--sp">Special order</span>'
              : '<span class="crow__tag">In stock</span>') +
            '<div class="qty">' +
              '<button data-vid="' + i.vid + '" data-q="' + (i.qty - 1) + '" aria-label="Decrease">&minus;</button>' +
              "<span>" + i.qty + "</span>" +
              '<button data-vid="' + i.vid + '" data-q="' + (i.qty + 1) + '" aria-label="Increase">+</button>' +
            "</div>" +
          "</div>" +
          '<div class="crow__p">' + money(i.price * i.qty) + "</div>" +
        "</div>";
      }).join("");
      body.querySelectorAll(".qty button").forEach(function (b) {
        b.onclick = function () {
          cartSetQty(Number(b.dataset.vid), Number(b.dataset.q));
        };
      });
    }
    var t = document.getElementById("cartTotal");
    if (t) t.textContent = money(cartTotal());

    var sp = cartSplit();
    var go = document.getElementById("cartGo");
    if (go) {
      var u = checkoutUrl();
      var shopQty = sp.shopify.reduce(function (a, i) { return a + i.qty; }, 0);
      go.setAttribute("aria-disabled", u ? "false" : "true");
      go.href = u || "#";
      go.textContent = !items.length
        ? "Bag is empty"
        : (u ? "Checkout" + (shopQty ? " (" + shopQty + ")" : "")
             : "Nothing ready for checkout");
    }

    // Honest split: say exactly what will and will not go through checkout.
    var box = document.getElementById("cartSpecial");
    if (box) {
      var reqQty = sp.request.reduce(function (a, i) { return a + i.qty; }, 0);
      box.hidden = reqQty === 0;
      if (reqQty) {
        document.getElementById("cartSplitMsg").textContent =
          reqQty + (reqQty === 1 ? " item is" : " items are") +
          " a special order and cannot go through card checkout yet. " +
          "Send it as a request and we confirm your delivery window and take payment by phone.";
      }
    }
  }

  return {
    CONFIG: CONFIG, ICON: ICON, money: money, img: img,
    loadCatalog: loadCatalog, cardHTML: cardHTML,
    initChrome: function () { nav(); footer(); cartMount(); reveal(); },
    reveal: reveal,
    cartAdd: cartAdd, cartOpen: cartOpen, cartCount: cartCount,
    checkoutUrl: checkoutUrl
  };
})();
