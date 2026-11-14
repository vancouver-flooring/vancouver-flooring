// Vancouver Flooring — one-page site.
// All editable content lives in data/site.json and data/gallery.json,
// which the owners edit through the Pages CMS admin (see README.md).

const PAGE_SIZE = 12;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

let items = [];      // all gallery items, newest first
let visible = [];    // items matching the current filter
let shown = PAGE_SIZE;
let filter = "All";
let current = 0;     // index into `visible` for the lightbox

const $ = (id) => document.getElementById(id);

// Pages CMS stores media paths starting with "/" (e.g. "/media/x.jpg").
// On a GitHub Pages project site the site lives under /<repo>/, so make
// paths relative to the page instead.
function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.replace(/^\/+/, "");
}

const isVideo = (path) => VIDEO_EXT.test(path || "");

async function loadJson(path, fallback) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.warn("Could not load", path, e);
    return fallback;
  }
}

function applySite(site) {
  document.querySelectorAll("[data-site]").forEach((el) => {
    const v = site[el.dataset.site];
    if (v) el.textContent = v;
  });
  if (site.phone) {
    const tel = "tel:" + site.phone.replace(/[^\d+]/g, "");
    document.querySelectorAll(".js-phone").forEach((a) => { a.href = tel; });
  }
  if (site.email) $("emailLink").href = "mailto:" + site.email;
  $("year").textContent = new Date().getFullYear();
}

function mediaEl(item, { controls = false, thumb = false } = {}) {
  const src = mediaUrl(item.media);
  if (!src) {
    const d = document.createElement("div");
    d.className = "wood";
    return d;
  }
  if (isVideo(src)) {
    const v = document.createElement("video");
    v.src = thumb ? src + "#t=0.5" : src;
    v.muted = thumb;
    v.playsInline = true;
    v.preload = "metadata";
    if (controls) { v.controls = true; v.autoplay = true; }
    return v;
  }
  const img = document.createElement("img");
  img.src = src;
  img.alt = item.title || "Flooring project";
  img.loading = thumb ? "lazy" : "eager";
  return img;
}

function renderFilters() {
  const cats = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const box = $("filters");
  box.innerHTML = "";
  if (cats.length < 3) return; // no point filtering with a single category
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.role = "tab";
    b.textContent = c;
    b.setAttribute("aria-selected", c === filter);
    b.onclick = () => { filter = c; shown = PAGE_SIZE; renderFilters(); renderGrid(); };
    box.appendChild(b);
  });
}

function renderGrid() {
  visible = filter === "All" ? items : items.filter((i) => i.category === filter);
  const grid = $("grid");
  grid.innerHTML = "";
  visible.slice(0, shown).forEach((item, idx) => {
    const t = document.createElement("button");
    t.className = "tile";
    t.setAttribute("aria-label", "Open " + (item.title || "project"));
    t.appendChild(mediaEl(item, { thumb: true }));
    if (isVideo(item.media)) {
      const p = document.createElement("span");
      p.className = "play";
      p.textContent = "▶";
      t.appendChild(p);
    }
    const cap = document.createElement("span");
    cap.className = "tile-cap";
    cap.innerHTML = "<strong></strong><span></span>";
    cap.querySelector("strong").textContent = item.title || "";
    cap.querySelector("span").textContent = [item.category, item.location].filter(Boolean).join(" · ");
    t.appendChild(cap);
    t.onclick = () => openLightbox(idx);
    grid.appendChild(t);
  });
  $("moreBtn").hidden = visible.length <= shown;
  $("empty").hidden = visible.length > 0;
}

function openLightbox(idx) {
  current = (idx + visible.length) % visible.length;
  const item = visible[current];
  const box = $("lbMedia");
  box.innerHTML = "";
  box.appendChild(mediaEl(item, { controls: true }));
  $("lbTitle").textContent = item.title || "";
  $("lbDesc").textContent = item.description || "";
  const date = item.date ? new Date(item.date + "T12:00").toLocaleDateString("en-CA", { month: "long", year: "numeric" }) : "";
  $("lbMeta").textContent = [item.category, item.location, date].filter(Boolean).join(" · ");
  const multi = visible.length > 1;
  $("lbPrev").hidden = $("lbNext").hidden = !multi;
  const dlg = $("lightbox");
  if (!dlg.open) dlg.showModal();
}

function closeLightbox() {
  $("lbMedia").innerHTML = ""; // stops any playing video
  $("lightbox").close();
}

function wireLightbox() {
  const dlg = $("lightbox");
  $("lbClose").onclick = closeLightbox;
  $("lbPrev").onclick = () => openLightbox(current - 1);
  $("lbNext").onclick = () => openLightbox(current + 1);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) closeLightbox(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!dlg.open) return;
    if (e.key === "ArrowLeft") openLightbox(current - 1);
    if (e.key === "ArrowRight") openLightbox(current + 1);
  });
  // Swipe on phones
  let x0 = null;
  dlg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) openLightbox(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

function setHero() {
  const hero = $("heroPhoto");
  const pick = items.find((i) => i.featured && i.media && !isVideo(i.media))
            || items.find((i) => i.media && !isVideo(i.media));
  if (pick) hero.style.backgroundImage = `url("${mediaUrl(pick.media)}")`;
  else hero.classList.add("wood");
}

function wireNav() {
  const bar = $("topbar"), nav = $("nav"), toggle = $("navToggle");
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.onclick = () => setOpen(!nav.classList.contains("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Underline the menu item for the section currently on screen
  const links = [...nav.querySelectorAll(".nav-link")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = document.querySelector(l.getAttribute("href")); if (s) io.observe(s); });
}

async function init() {
  wireNav();
  const [site, gallery] = await Promise.all([
    loadJson("data/site.json", {}),
    loadJson("data/gallery.json", []),
  ]);
  applySite(site);
  items = (Array.isArray(gallery) ? gallery : [])
    .filter((i) => i && !i.hidden)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  setHero();
  renderFilters();
  renderGrid();
  $("moreBtn").onclick = () => { shown += PAGE_SIZE; renderGrid(); };
  // "See staircases →" etc. in What we do: jump to the gallery, pre-filtered
  document.querySelectorAll("[data-filter]").forEach((a) => {
    a.addEventListener("click", () => {
      filter = items.some((i) => i.category === a.dataset.filter) ? a.dataset.filter : "All";
      shown = PAGE_SIZE;
      renderFilters();
      renderGrid();
    });
  });
  wireLightbox();
}

init();
