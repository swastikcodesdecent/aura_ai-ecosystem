// ============================================================
//  HACKATHON COMING SOON — app.js
//  Firebase v10 Modular SDK (ESM)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ──────────────────────────────────────────────────────────────
//  🔑  FIREBASE CONFIG
//  Replace values below with your own Firebase project config
//  from: https://console.firebase.google.com → Project Settings
// ──────────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyCoRxV90LHWQnyH73-25IP3RS6LBh8_fhQ",
    authDomain: "aura-ai-web-5d975.firebaseapp.com",
    projectId: "aura-ai-web-5d975",
    storageBucket: "aura-ai-web-5d975.firebasestorage.app",
    messagingSenderId: "779712956436",
    appId: "1:779712956436:web:78c05bb368162656f7bf01"
};

// ── INIT FIREBASE ──
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// ──────────────────────────────────────────────────────────────
//  PRELOADER — CATALYST 2K26 STYLE
// ──────────────────────────────────────────────────────────────
const LIGHT_COLORS = [
  "#e74c3c","#f39c12","#1abc9c","#e91e8c",
  "#e74c3c","#f1c40f","#1abc9c","#e91e8c",
  "#e74c3c","#1abc9c","#e91e8c","#e74c3c"
];

const QUOTES = [
  '"Friends don\'t lie." — calibrating the Upside Down...',
  '"Mornings are for coffee and contemplation." — booting systems...',
  '"She\'s our friend and she\'s crazy!" — initializing auth...',
  '"Nobody normal ever accomplished anything." — loading genius...',
];

const STATUSES_LOADER = [
  "OPENING THE GATE",
  "ENTERING THE UPSIDE DOWN",
  "CONNECTING TO HAWKINS LAB",
  "AUTHENTICATING DEMOGORGON",
  "GATE IS OPEN",
];

// Build Christmas lights
const lightsEl = document.getElementById("loader-lights");
LIGHT_COLORS.forEach((color) => {
  const b = document.createElement("div");
  b.className = "light-bulb";
  b.style.background = color;
  b.style.boxShadow = `0 0 8px ${color}, 0 0 20px ${color}66`;
  lightsEl.appendChild(b);
});

// Twinkle lights randomly
const bulbs = document.querySelectorAll(".light-bulb");
function twinkleLights() {
  bulbs.forEach(b => {
    b.style.opacity = Math.random() > 0.25 ? "1" : "0.12";
  });
  setTimeout(twinkleLights, 150 + Math.random() * 200);
}
twinkleLights();

// Progress bar refs
let barPct      = 0;
let statusIdx2  = 0;
const loaderBar = document.getElementById("loader-bar");
const loaderStat = document.getElementById("loader-status");
const loaderPct  = document.getElementById("loader-pct");
const loaderQ    = document.getElementById("loader-quote");
const loaderTit  = document.getElementById("loader-title");

// glitch data-text driven by CSS attr() on child spans

// Cycle quotes with fade
let qIdx = 0;
loaderQ.style.transition = "opacity 0.4s ease";
setInterval(() => {
  qIdx = (qIdx + 1) % QUOTES.length;
  loaderQ.style.opacity = "0";
  setTimeout(() => {
    loaderQ.textContent = QUOTES[qIdx];
    loaderQ.style.opacity = "1";
  }, 420);
}, 2400);

function advanceBar() {
  const step = Math.random() * 10 + 3;
  barPct = Math.min(barPct + step, 100);
  loaderBar.style.width = barPct + "%";
  loaderPct.textContent = Math.floor(barPct) + "%";

  const threshold = (statusIdx2 + 1) * (100 / STATUSES_LOADER.length);
  if (statusIdx2 < STATUSES_LOADER.length - 1 && barPct >= threshold) {
    loaderStat.textContent = STATUSES_LOADER[++statusIdx2];
  }

  if (barPct < 100) {
    setTimeout(advanceBar, 100 + Math.random() * 180);
  }
}
advanceBar();

// ──────────────────────────────────────────────────────────────
//  HIDE PRELOADER
// ──────────────────────────────────────────────────────────────
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  const main      = document.getElementById("main");
  preloader.style.transition = "opacity 0.8s ease";
  preloader.style.opacity    = "0";
  setTimeout(() => {
    preloader.style.display = "none";
    main.classList.remove("hidden");
  }, 800);
}

// ──────────────────────────────────────────────────────────────
//  UI HELPERS
// ──────────────────────────────────────────────────────────────
const loginSection        = document.getElementById("login-section");
const comingSoonSection   = document.getElementById("coming-soon-section");
const userInfoEl          = document.getElementById("user-info");

// Header
const userAvatarEl  = document.getElementById("user-avatar");
const userNameEl    = document.getElementById("user-name");
const liveClockEl   = document.getElementById("live-clock");

// Profile card
const profileAvatarEl = document.getElementById("profile-avatar");
const profileNameEl   = document.getElementById("profile-name");
const profileDateEl   = document.getElementById("profile-date");
const profileTimeEl   = document.getElementById("profile-time");

// Countdown
const cdDays  = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMins  = document.getElementById("cd-mins");
const cdSecs  = document.getElementById("cd-secs");

function showLoggedIn(user) {
  userAvatarEl.src            = user.photoURL || "";
  userNameEl.textContent      = user.displayName?.toUpperCase() || "HACKER";
  userInfoEl.style.display    = "flex";

  profileAvatarEl.src         = user.photoURL || "";
  profileNameEl.textContent   = user.displayName || "Anonymous";

  loginSection.classList.add("hidden");
  comingSoonSection.classList.remove("hidden");

  updateProfileDateTime();
  setInterval(updateProfileDateTime, 1000);
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function showLoggedOut() {
  userInfoEl.style.display = "none";
  loginSection.classList.remove("hidden");
  comingSoonSection.classList.add("hidden");
}

// ──────────────────────────────────────────────────────────────
//  DATE / TIME
// ──────────────────────────────────────────────────────────────
const MONTHS  = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAYS_WK = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

function fmt2(n) { return String(n).padStart(2, "0"); }

function updateProfileDateTime() {
  const now = new Date();
  profileDateEl.textContent = `${DAYS_WK[now.getDay()]}, ${fmt2(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  profileTimeEl.textContent = `${fmt2(now.getHours())}:${fmt2(now.getMinutes())}:${fmt2(now.getSeconds())}`;
}

function updateLiveClock() {
  const now = new Date();
  liveClockEl.textContent = `${fmt2(now.getHours())}:${fmt2(now.getMinutes())}:${fmt2(now.getSeconds())}`;
}

// ──────────────────────────────────────────────────────────────
//  COUNTDOWN — target: 22 May 2025, 09:00 AM IST (UTC+5:30 = 03:30 UTC)
// ──────────────────────────────────────────────────────────────
const TARGET = new Date("2026-05-22T03:30:00Z");

function updateCountdown() {
  let diff = TARGET - new Date();
  if (diff <= 0) {
    [cdDays, cdHours, cdMins, cdSecs].forEach(el => el.textContent = "00");
    return;
  }
  const days  = Math.floor(diff / 86400000); diff -= days  * 86400000;
  const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
  const mins  = Math.floor(diff / 60000);    diff -= mins  * 60000;
  const secs  = Math.floor(diff / 1000);
  setCount(cdDays, days); setCount(cdHours, hours);
  setCount(cdMins, mins); setCount(cdSecs, secs);
}

function setCount(el, val) {
  const str = fmt2(val);
  if (el.textContent !== str) {
    el.textContent = str;
    el.classList.add("flip");
    setTimeout(() => el.classList.remove("flip"), 200);
  }
}

// ──────────────────────────────────────────────────────────────
//  AUTH STATE
// ──────────────────────────────────────────────────────────────
const MIN_LOADER_MS = 3200;
const startedAt     = performance.now();

onAuthStateChanged(auth, (user) => {
  const elapsed = performance.now() - startedAt;
  const wait    = Math.max(0, MIN_LOADER_MS - elapsed);
  setTimeout(() => {
    hidePreloader();
    if (user) showLoggedIn(user);
    else       showLoggedOut();
  }, wait);
});

// ──────────────────────────────────────────────────────────────
//  GOOGLE LOGIN
// ──────────────────────────────────────────────────────────────
document.getElementById("google-login-btn").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    if (err.code === "auth/popup-closed-by-user") return;
    console.error("Login error:", err);
    alert("Sign-in failed: " + err.message);
  }
});

// ──────────────────────────────────────────────────────────────
//  LOGOUT
// ──────────────────────────────────────────────────────────────
document.getElementById("logout-btn").addEventListener("click", async () => {
  try { await signOut(auth); }
  catch (err) { console.error("Logout error:", err); }
});