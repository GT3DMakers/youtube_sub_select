const ITEM = "ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-rich-section-renderer";
// Barre de progression (ancien et nouveau markup YouTube)
const PROGRESS = "ytd-thumbnail-overlay-resume-playback-renderer #progress, yt-thumbnail-overlay-progress-bar-view-model [style*='width']";
const WATCHED_MIN = 90; // % à partir duquel une vidéo est « complètement vue »

const KEY = "yss-hidden-ids";
const hidden = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));

const videoId = (el) => new URL(el.querySelector("a[href*='/watch?v=']")?.href || "about:blank").searchParams.get("v");

// Règle CSS injectée dès document_start : masque instantanément, sans attendre le scan JS.
const style = document.createElement("style");
document.documentElement.append(style);
const applyHiddenCss = () => {
  style.textContent = [...hidden].map((id) =>
    `ytd-rich-item-renderer:has(a[href*="v=${id}"]), ytd-grid-video-renderer:has(a[href*="v=${id}"]), ytd-video-renderer:has(a[href*="v=${id}"]) { display: none !important; }`).join("\n");
};
applyHiddenCss();

function addButton(el, id) {
  if (el.querySelector(":scope > .yss-btn")) return;
  const b = document.createElement("button");
  b.className = "yss-btn";
  b.textContent = "✕";
  b.title = "Masquer cette vidéo";
  b.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    hidden.add(id);
    localStorage.setItem(KEY, JSON.stringify([...hidden]));
    applyHiddenCss();
    scan();
  };
  el.append(b);
}

function shouldHide(el) {
  const id = videoId(el);
  if (id) { if (hidden.has(id)) return true; addButton(el, id); }
  if (el.querySelector("a[href*='/shorts/'], ytd-reel-shelf-renderer")) return true;
  const bar = el.querySelector(PROGRESS);
  return !!bar && parseFloat(bar.style.width) >= WATCHED_MIN;
}

function scan() {
  if (!location.pathname.startsWith("/feed/subscriptions")) return;
  document.querySelectorAll(ITEM).forEach((el) => el.classList.toggle("yss-hidden", shouldHide(el)));
}

let timer;
new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(scan, 50); })
  .observe(document.documentElement, { childList: true, subtree: true });
scan();
