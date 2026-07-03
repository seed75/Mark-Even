// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Scroll reveals, staggered where siblings arrive together
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced && "IntersectionObserver" in window) {
  document.querySelectorAll(".program-row").forEach((el, i) => { el.dataset.delay = i * 90; });
  document.querySelectorAll(".approach-item").forEach((el, i) => { el.dataset.delay = i * 110; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".timecode").forEach(flapText);
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// Split-flap settle: timecodes clack through characters before landing,
// like a departure board updating for the next session
const FLAPCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function flapText(el) {
  if (reduced || el.dataset.flapping) return;
  el.dataset.flapping = "true";
  const chars = [...el.textContent];
  const settle = chars.map((c, i) => (/[a-z0-9]/i.test(c) ? 3 + i * 0.6 : 0));
  const last = Math.max(...settle);
  let frame = 0;
  const timer = setInterval(() => {
    frame++;
    el.textContent = chars
      .map((c, i) => (frame >= settle[i] ? c : FLAPCHARS[Math.floor(Math.random() * FLAPCHARS.length)]))
      .join("");
    if (frame >= last) {
      clearInterval(timer);
      el.textContent = chars.join("");
    }
  }, 42);
}
if (!reduced) {
  setTimeout(() => flapText(document.querySelector(".hero .timecode")), 350);
}

// Run-sheet clock: the header ticks from 08:00 to 17:30 as you scroll the day,
// rendered as split-flap tiles that flip when a digit changes
const dayBar = document.querySelector(".day-progress");
const dayTime = document.querySelector(".day-clock .time");
const clockTiles = [..."08:00"].map((ch) => {
  const s = document.createElement("span");
  s.className = ch === ":" ? "sep" : "tile";
  s.textContent = ch;
  return s;
});
dayTime.textContent = "";
dayTime.append(...clockTiles);
function setClock(str) {
  [...str].forEach((ch, i) => {
    const tile = clockTiles[i];
    if (tile.textContent !== ch) {
      tile.textContent = ch;
      if (!reduced && tile.classList.contains("tile")) {
        tile.classList.remove("flap");
        void tile.offsetWidth; // restart the flip
        tile.classList.add("flap");
      }
    }
  });
}
let dayTicking = false;
function updateDay() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const f = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  dayBar.style.transform = `scaleX(${f})`;
  const mins = 480 + Math.round((f * 570) / 5) * 5; // 08:00 -> 17:30, 5-min steps
  setClock(`${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`);
  // sky: morning porcelain -> midday warmth -> golden hour (closing section brings the night)
  const SKY = [
    [0, [244, 245, 242]],
    [0.35, [247, 243, 234]],
    [0.65, [246, 235, 216]],
    [0.85, [240, 224, 199]],
    [1, [240, 224, 199]]
  ];
  let s = 1;
  while (SKY[s][0] < f) s++;
  const [f0, c0] = SKY[s - 1];
  const [f1, c1] = SKY[s];
  const t = f1 === f0 ? 0 : (f - f0) / (f1 - f0);
  const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * t));
  document.documentElement.style.setProperty("--paper", `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
  dayTicking = false;
}
window.addEventListener("scroll", () => {
  if (!dayTicking) { dayTicking = true; requestAnimationFrame(updateDay); }
}, { passive: true });
window.addEventListener("resize", updateDay);
updateDay();

// Lights off: hover the wordmark and the venue goes dark, the name glows
const heroTitle = document.querySelector(".hero-title");
document.querySelectorAll(".hero-title .suffix-a, .hero-title .suffix-b").forEach((el) => {
  el.addEventListener("animationend", () => el.classList.add("lit"), { once: true });
});
if (window.matchMedia("(hover: hover)").matches) {
  heroTitle.addEventListener("pointerenter", () => document.body.classList.add("lights-off"));
  heroTitle.addEventListener("pointerleave", () => document.body.classList.remove("lights-off"));
} else {
  heroTitle.addEventListener("click", () => document.body.classList.toggle("lights-off"));
}
