const ITEM = "ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-rich-section-renderer";
// Barre de progression (ancien et nouveau markup YouTube)
const PROGRESS = "ytd-thumbnail-overlay-resume-playback-renderer #progress, yt-thumbnail-overlay-progress-bar-view-model [style*='width']";
const WATCHED_MIN = 90; // % à partir duquel une vidéo est « complètement vue »

function shouldHide(el) {
  if (el.querySelector("a[href*='/shorts/'], ytd-reel-shelf-renderer")) return true;
  const bar = el.querySelector(PROGRESS);
  return !!bar && parseFloat(bar.style.width) >= WATCHED_MIN;
}

function scan() {
  if (!location.pathname.startsWith("/feed/subscriptions")) return;
  document.querySelectorAll(ITEM).forEach((el) => el.classList.toggle("yss-hidden", shouldHide(el)));
}

let timer;
new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(scan, 200); })
  .observe(document.body, { childList: true, subtree: true });
scan();
