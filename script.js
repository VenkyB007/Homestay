/* Gotul Hampi Homestay, site behaviour.
   Header shrink, mobile menu, staggered reveals, floating leaves that
   move with scroll, count-up numbers, FAQ accordion, photo viewer,
   nearby strip arrows, floating WhatsApp button and the enquiry form.
   No framework, no build step. */

// WhatsApp number in international format, digits only (no +, spaces or dashes).
// A normal (non-business) WhatsApp account works fine with wa.me links.
const WHATSAPP_NUMBER = "916360250021";
const HOUSE_NAME = "Gotul Hampi Homestay";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- header: shrink once the page is scrolled ----------
const nav = document.querySelector(".nav");
const onScrollHeader = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 24);
onScrollHeader();
window.addEventListener("scroll", onScrollHeader, { passive: true });

// ---------- mobile menu ----------
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");

function setMenu(open) {
  if (!toggle || !menu) return;
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  toggle.querySelector("i").className = open ? "ph ph-x" : "ph ph-list";
}

if (toggle && menu) {
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !e.target.closest(".nav")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
  });
}

// Highlight the menu link for the section currently on screen.
const sectionLinks = menu ? Array.from(menu.querySelectorAll('a[href^="#"]')) : [];
const sectionTargets = sectionLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if (sectionTargets.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sectionTargets.forEach((el) => spy.observe(el));
}

// ---------- button labels: two copies so the text can roll on hover ----------
document.querySelectorAll(".btn").forEach((btn) => {
  if (btn.querySelector(".btn__label")) return;
  const text = btn.textContent.trim();
  if (!text) return;
  const icons = Array.from(btn.querySelectorAll("i"));
  btn.textContent = "";
  icons.forEach((i) => btn.appendChild(i));
  const label = document.createElement("span");
  label.className = "btn__label";
  const inner = document.createElement("span");
  inner.className = "btn__text";
  inner.textContent = text;
  inner.dataset.text = text;
  label.appendChild(inner);
  btn.appendChild(label);
});

// ---------- reveal on scroll, staggered inside any [data-stagger] group ----------
document.querySelectorAll("[data-stagger]").forEach((group) => {
  const items = Array.from(group.children).filter((el) => el.classList.contains("reveal"));
  items.forEach((el, i) => el.style.setProperty("--d", `${Math.min(i * 0.09, 0.9)}s`));
});

const revealEls = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ---------- floating leaves and chips: drift with scroll ----------
// Each element has data-float (how far it moves, as a fraction of scroll)
// and optionally data-rotate (degrees over a full viewport of scrolling).
const floaters = Array.from(document.querySelectorAll("[data-float]"));
if (floaters.length && !reduceMotion && finePointer) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    floaters.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      // Progress runs from -1 (parent just below the viewport) to 1 (just above it).
      const progress = Math.max(-1, Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2)));
      const speed = parseFloat(el.dataset.float) || 0.2;
      const rot = parseFloat(el.dataset.rotate) || 0;
      el.style.setProperty("--py", `${(-progress * speed * 160).toFixed(1)}px`);
      el.style.setProperty("--pr", `${(progress * rot).toFixed(1)}deg`);
    });
  };
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
}

// ---------- count-up numbers ----------
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(run);
  }
}

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq__item").forEach((item) => {
  const btn = item.querySelector(".faq__q");
  btn.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    // One open at a time keeps the list short on phones.
    document.querySelectorAll(".faq__item.is-open").forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-open");
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      }
    });
    item.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
});

// ---------- WhatsApp links ----------
function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = whatsappUrl(`Hello, I would like to ask about a stay at ${HOUSE_NAME}.`);
  a.target = "_blank";
  a.rel = "noopener";
});

// Floating button: hidden while the hero or the contact form is on screen,
// since both already show their own WhatsApp button.
const fab = document.getElementById("fab");
if (fab && "IntersectionObserver" in window) {
  const covered = new Set();
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) covered.add(entry.target);
        else covered.delete(entry.target);
      });
      fab.classList.toggle("is-hidden", covered.size > 0);
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".hero, #contact").forEach((el) => watcher.observe(el));
}

// ---------- nearby strip arrows (mouse users) ----------
const scroller = document.getElementById("around-scroller");
if (scroller) {
  const step = () => {
    const card = scroller.querySelector(".place");
    return card ? card.getBoundingClientRect().width + 16 : 320;
  };
  document.querySelector(".js-scroll-prev")?.addEventListener("click", () =>
    scroller.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" })
  );
  document.querySelector(".js-scroll-next")?.addEventListener("click", () =>
    scroller.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" })
  );
}

// ---------- photo viewer ----------
const lightbox = document.getElementById("lightbox");
const zooms = Array.from(document.querySelectorAll(".zoom"));

if (lightbox && zooms.length && typeof lightbox.showModal === "function") {
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const stage = document.getElementById("lightbox-stage");
  let index = 0;

  const show = (i) => {
    index = (i + zooms.length) % zooms.length;
    const source = zooms[index].querySelector("img");
    img.src = source.currentSrc || source.src;
    img.alt = source.alt;
    caption.textContent = source.alt;
  };
  const open = (i) => {
    show(i);
    lightbox.showModal();
    document.body.classList.add("has-dialog");
  };
  const close = () => lightbox.close();

  zooms.forEach((btn, i) => btn.addEventListener("click", () => open(i)));
  document.getElementById("lightbox-close").addEventListener("click", close);
  document.getElementById("lightbox-prev").addEventListener("click", () => show(index - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => show(index + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === stage) close();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("has-dialog");
    zooms[index].focus();
  });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe left or right to move between photos, swipe down to close.
  let startX = 0, startY = 0, tracking = false;
  stage.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? index + 1 : index - 1);
    else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close();
  }, { passive: true });
}

// ---------- enquiry form ----------
const form = document.getElementById("enquiry");

if (form) {
  const today = new Date().toISOString().slice(0, 10);
  const inEl = form.querySelector("#f-in");
  const outEl = form.querySelector("#f-out");
  const sent = document.getElementById("enquiry-sent");
  const sentLink = document.getElementById("enquiry-link");
  inEl.min = today;
  outEl.min = today;
  inEl.addEventListener("change", () => {
    outEl.min = inEl.value || today;
    if (outEl.value && outEl.value <= inEl.value) outEl.value = "";
  });

  const setInvalid = (input, bad) =>
    input.closest(".field").classList.toggle("is-invalid", bad);

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#f-name");
    const guests = form.querySelector("#f-guests").value;
    const msg = form.querySelector("#f-msg").value.trim();

    const nameBad = !name.value.trim();
    const inBad = !inEl.value;
    const outBad = !outEl.value || outEl.value <= inEl.value;
    setInvalid(name, nameBad);
    setInvalid(inEl, inBad);
    setInvalid(outEl, outBad);
    if (nameBad || inBad || outBad) {
      form.querySelector(".is-invalid input").focus();
      return;
    }

    const lines = [
      `Hello, this is ${name.value.trim()}.`,
      `I would like to book a stay at ${HOUSE_NAME}.`,
      `Check-in: ${fmt(inEl.value)}`,
      `Check-out: ${fmt(outEl.value)}`,
      `Guests: ${guests}`,
      `Booking: the whole house`,
    ];
    if (msg) lines.push(`Note: ${msg}`);

    const url = whatsappUrl(lines.join("\n"));
    // Keep a visible link as well: some phones block pop-ups from scripts.
    sentLink.href = url;
    sent.classList.add("is-visible");
    window.open(url, "_blank", "noopener");
  });

  form.querySelectorAll("input").forEach((input) =>
    input.addEventListener("input", () => setInvalid(input, false))
  );
}

// ---------- footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
