// Bespoke 3D Glossy Vector Icons, Props, Badges & Illustrated Word Tokens
// Zero stock Unicode emojis — every graphic uses multi-layered 3D gradients, bevels & specular highlights.

let _svgUid = 0;

function iconBrandCrest() {
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon brand-crest-svg" viewBox="0 0 56 56" aria-hidden="true">
      <defs>
        <linearGradient id="bcShield_${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="bcInner_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="55%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
      </defs>
      <path d="M28 4 L50 13 V29 C50 42 40 50 28 54 C16 50 6 42 6 29 V13 Z" fill="url(#bcShield_${u})" stroke="#78350f" stroke-width="2.2"/>
      <path d="M28 9 L45 16 V28.5 C45 38.5 37.5 45 28 48.5 C18.5 45 11 38.5 11 28.5 V16 Z" fill="url(#bcInner_${u})"/>
      <ellipse cx="22" cy="16" rx="10" ry="4" fill="#ffffff" opacity="0.35" transform="rotate(-18 22 16)"/>
      <path d="M16 34 L14 21 L22 26 L28 17 L34 26 L42 21 L40 34 Z" fill="#fde047" stroke="#92400e" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="16" y="34" width="24" height="4.5" rx="2" fill="#f59e0b" stroke="#92400e" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="2.6" fill="#fb7185"/>
    </svg>
  `;
}

function iconGoldCoin(size = 24) {
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon coin-3d-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="coinRim_${u}" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="45%" stop-color="#facc15"/>
          <stop offset="85%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </radialGradient>
        <linearGradient id="coinCore_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="21.5" r="16.5" fill="#92400e" opacity="0.45"/>
      <circle cx="20" cy="19.5" r="16.5" fill="url(#coinRim_${u})" stroke="#78350f" stroke-width="1.8"/>
      <circle cx="20" cy="19.5" r="12" fill="url(#coinCore_${u})" stroke="#fef08a" stroke-width="1.4"/>
      <path d="M20 10.5 L22.6 16.2 L28.8 16.9 L24.1 21 L25.4 27.1 L20 23.9 L14.6 27.1 L15.9 21 L11.2 16.9 L17.4 16.2 Z" fill="#fef9c3" stroke="#b45309" stroke-width="1.1" stroke-linejoin="round"/>
      <ellipse cx="14" cy="11" rx="5" ry="2.3" fill="#ffffff" opacity="0.65" transform="rotate(-28 14 11)"/>
    </svg>
  `;
}

function iconStarGem(size = 24) {
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon gem-3d-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="gemTop_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="45%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="gemBot_${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
      </defs>
      <polygon points="20,4 34,14 29,34 11,34 6,14" fill="url(#gemBot_${u})" stroke="#1e3a8a" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="20,4 34,14 20,19 6,14" fill="url(#gemTop_${u})"/>
      <polygon points="20,4 26,14 20,34 14,14" fill="#bae6fd" opacity="0.48"/>
      <polygon points="13,9 20,6 18,13 10,13" fill="#ffffff" opacity="0.72"/>
    </svg>
  `;
}

function iconSingleStar(filled = true, size = 24) {
  if (!filled) {
    return `
      <svg class="ui-3d-icon star-3d-svg empty" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 4 L24.9 14.1 L36 15.7 L27.9 23.5 L29.8 34.6 L20 29.3 L10.2 34.6 L12.1 23.5 L4 15.7 L15.1 14.1 Z"
          fill="rgba(226,232,240,0.65)" stroke="#94a3b8" stroke-width="2.2" stroke-linejoin="round"/>
      </svg>
    `;
  }
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon star-3d-svg filled" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="starGold3D_${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="45%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <path d="M20 5.5 L24.9 15.6 L36 17.2 L27.9 25 L29.8 36.1 L20 30.8 L10.2 36.1 L12.1 25 L4 17.2 L15.1 15.6 Z" fill="#92400e" opacity="0.35"/>
      <path d="M20 3.5 L24.9 13.6 L36 15.2 L27.9 23 L29.8 34.1 L20 28.8 L10.2 34.1 L12.1 23 L4 15.2 L15.1 13.6 Z"
        fill="url(#starGold3D_${u})" stroke="#92400e" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="16.5" cy="13.5" rx="4.2" ry="2.1" fill="#ffffff" opacity="0.7" transform="rotate(-25 16.5 13.5)"/>
    </svg>
  `;
}

function renderStarsSvg(count = 0, size = 22) {
  const n = Math.max(0, Math.min(3, Number(count) || 0));
  return `<span class="stars-3d-row" aria-label="${n} 顆星">${[1, 2, 3].map((i) => iconSingleStar(i <= n, size)).join('')}</span>`;
}

function iconSpeaker(active = true, size = 22) {
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon speaker-3d-svg ${active ? 'is-on' : 'is-off'}" width="${size}" height="${size}" viewBox="0 0 36 36" aria-hidden="true">
      <defs>
        <linearGradient id="spkHorn_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="55%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <path d="M6 13 H12 L21 6 V30 L12 23 H6 A2 2 0 0 1 4 21 V15 A2 2 0 0 1 6 13 Z" fill="url(#spkHorn_${u})" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/>
      ${active
        ? `<path class="spk-wave w1" d="M25 12.5 C27.8 15.2 27.8 20.8 25 23.5" fill="none" stroke="#0284c7" stroke-width="2.8" stroke-linecap="round"/>
           <path class="spk-wave w2" d="M29 8.5 C33.5 13.5 33.5 22.5 29 27.5" fill="none" stroke="#0ea5e9" stroke-width="2.8" stroke-linecap="round"/>`
        : `<line x1="25" y1="13" x2="32" y2="23" stroke="#e11d48" stroke-width="3" stroke-linecap="round"/>
           <line x1="32" y1="13" x2="25" y2="23" stroke="#e11d48" stroke-width="3" stroke-linecap="round"/>`}
    </svg>
  `;
}

function iconMusicNote(active = false, size = 20) {
  return `
    <svg class="ui-3d-icon music-3d-svg" width="${size}" height="${size}" viewBox="0 0 36 36" aria-hidden="true">
      <path d="M14 26 V9 L30 5 V22" fill="none" stroke="${active ? '#059669' : '#475569'}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="10.5" cy="26.5" r="5" fill="${active ? '#10b981' : '#64748b'}"/>
      <circle cx="26.5" cy="22.5" r="5" fill="${active ? '#10b981' : '#64748b'}"/>
    </svg>
  `;
}

function iconGachaGlobe(size = 22) {
  return `
    <svg class="ui-3d-icon gacha-3d-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="16" r="12" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <circle cx="16" cy="18" r="4" fill="#fb7185"/>
      <circle cx="24" cy="17" r="4" fill="#facc15"/>
      <circle cx="20" cy="12" r="3.8" fill="#4ade80"/>
      <ellipse cx="15" cy="10" rx="5" ry="2.4" fill="#ffffff" opacity="0.75" transform="rotate(-24 15 10)"/>
      <path d="M10 25 H30 L32 36 H8 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="20" cy="30.5" r="3.4" fill="#fde047" stroke="#92400e" stroke-width="1.4"/>
    </svg>
  `;
}

function iconReportChart(size = 22) {
  return `
    <svg class="ui-3d-icon report-3d-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="4" y="5" width="32" height="30" rx="7" fill="#eff6ff" stroke="#2563eb" stroke-width="2.2"/>
      <rect x="10" y="21" width="5" height="9" rx="2" fill="#38bdf8"/>
      <rect x="17.5" y="15" width="5" height="15" rx="2" fill="#6366f1"/>
      <rect x="25" y="10" width="5" height="20" rx="2" fill="#f59e0b"/>
    </svg>
  `;
}

function iconBackArrow(size = 18) {
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M18 7 L8 16 L18 25 M9 16 H26" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconPlayTriangle(size = 17) {
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 28 28" aria-hidden="true">
      <polygon points="7,4 24,14 7,24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconBookCards(size = 18) {
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 7 C9 5.5 14 6.5 16 9 C18 6.5 23 5.5 28 7 V25 C23 23.5 18 24.5 16 27 C14 24.5 9 23.5 4 25 Z" fill="#fef9c3" stroke="#92400e" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="16" y1="9" x2="16" y2="26.5" stroke="#b45309" stroke-width="2.2"/>
    </svg>
  `;
}

function iconMilestoneChest(opened = false, grand = false, size = 26) {
  if (grand) {
    return `
      <svg class="ui-3d-icon milestone-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 29 L6 14 L14 19 L20 9 L26 19 L34 14 L32 29 Z" fill="#fde047" stroke="#92400e" stroke-width="2.2" stroke-linejoin="round"/>
        <rect x="8" y="29" width="24" height="5.5" rx="2.5" fill="#f59e0b" stroke="#92400e" stroke-width="2"/>
        <circle cx="20" cy="22" r="3" fill="#e11d48"/>
      </svg>
    `;
  }
  return `
    <svg class="ui-3d-icon milestone-svg ${opened ? 'is-open' : ''}" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      ${opened ? `<circle cx="20" cy="18" r="14" fill="#fef08a" opacity="0.65"/>` : ''}
      <rect x="7" y="18" width="26" height="15" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <path d="${opened ? 'M7 16 C7 8 33 8 33 16 Z' : 'M7 19 C7 11 33 11 33 19 Z'}" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
      <rect x="17" y="16" width="6" height="7" rx="2" fill="#fef08a" stroke="#78350f" stroke-width="1.6"/>
    </svg>
  `;
}

function iconBossCrest(size = 34) {
  const u = ++_svgUid;
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="bossBadgeG_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fb7185"/>
          <stop offset="100%" stop-color="#be123c"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#bossBadgeG_${u})" stroke="#881337" stroke-width="2.5"/>
      <path d="M13 31 L11 17 L19 22 L24 12 L29 22 L37 17 L35 31 Z" fill="#fde047" stroke="#78350f" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="24" cy="26" r="2.8" fill="#be123c"/>
    </svg>
  `;
}

function iconCompassQuest(size = 34) {
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#0ea5e9" stroke="#0369a1" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="14.5" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
      <polygon points="24,11 28,24 24,21 20,24" fill="#ef4444"/>
      <polygon points="24,37 28,24 24,27 20,24" fill="#334155"/>
      <circle cx="24" cy="24" r="3" fill="#facc15" stroke="#78350f" stroke-width="1.4"/>
    </svg>
  `;
}

function iconMistakeShield(size = 34) {
  return `
    <svg class="ui-3d-icon" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5 L41 12 V24 C41 34.5 33.5 41.5 24 44 C14.5 41.5 7 34.5 7 24 V12 Z" fill="#10b981" stroke="#047857" stroke-width="2.5"/>
      <path d="M16 24.5 L21.5 30 L33 18" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

// ============================================================================
// Custom 3D Props for Mini-Games (Zero Stock Emojis)
// ============================================================================

function getDinoTreatSvg(idx = 0) {
  const kind = idx % 4;
  if (kind === 0) {
    // 3D Strawberry Glazed Donut
    return `
      <svg class="prop-3d-svg" viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="36" rx="24" ry="20" fill="#d97706" stroke="#92400e" stroke-width="2.2"/>
        <ellipse cx="32" cy="32" rx="23" ry="18.5" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
        <ellipse cx="32" cy="32" rx="8.5" ry="6.5" fill="#fff7ed" stroke="#be123c" stroke-width="2"/>
        <rect x="19" y="21" width="5" height="2.4" rx="1.2" fill="#fef08a" transform="rotate(-24 19 21)"/>
        <rect x="40" y="22" width="5" height="2.4" rx="1.2" fill="#38bdf8" transform="rotate(28 40 22)"/>
        <rect x="24" y="42" width="5" height="2.4" rx="1.2" fill="#4ade80" transform="rotate(15 24 42)"/>
        <rect x="39" y="40" width="5" height="2.4" rx="1.2" fill="#ffffff" transform="rotate(-18 39 40)"/>
        <ellipse cx="23" cy="23" rx="7" ry="3" fill="#ffffff" opacity="0.45" transform="rotate(-20 23 23)"/>
      </svg>
    `;
  }
  if (kind === 1) {
    // 3D Deluxe Golden Burger
    return `
      <svg class="prop-3d-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 30 C10 14 54 14 54 30 Z" fill="#f59e0b" stroke="#92400e" stroke-width="2.2"/>
        <ellipse cx="25" cy="21" rx="2.2" ry="1.2" fill="#fef9c3"/>
        <ellipse cx="33" cy="19" rx="2.2" ry="1.2" fill="#fef9c3"/>
        <ellipse cx="40" cy="22" rx="2.2" ry="1.2" fill="#fef9c3"/>
        <path d="M8 31 Q16 35 24 31 T40 31 T56 31" fill="none" stroke="#22c55e" stroke-width="4.5" stroke-linecap="round"/>
        <polygon points="12,34 52,34 48,40 32,37 16,40" fill="#facc15"/>
        <rect x="10" y="35" width="44" height="8" rx="4" fill="#7c2d12" stroke="#451a03" stroke-width="1.8"/>
        <rect x="11" y="43" width="42" height="9" rx="4.5" fill="#fbbf24" stroke="#92400e" stroke-width="2"/>
      </svg>
    `;
  }
  if (kind === 2) {
    // 3D Glossy Ruby Berry
    return `
      <svg class="prop-3d-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 54 C15 46 12 24 23 18 C28 15 36 15 41 18 C52 24 49 46 32 54 Z" fill="#f43f5e" stroke="#9f1239" stroke-width="2.2"/>
        <path d="M22 18 L28 10 L32 16 L37 10 L42 18 Q32 22 22 18 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="25" cy="29" r="1.6" fill="#fef08a"/>
        <circle cx="33" cy="27" r="1.6" fill="#fef08a"/>
        <circle cx="39" cy="31" r="1.6" fill="#fef08a"/>
        <circle cx="28" cy="38" r="1.6" fill="#fef08a"/>
        <circle cx="36" cy="40" r="1.6" fill="#fef08a"/>
        <ellipse cx="24" cy="26" rx="4.5" ry="8" fill="#ffffff" opacity="0.38" transform="rotate(-18 24 26)"/>
      </svg>
    `;
  }
  // 3D Golden Cheese Pizza Slice
  return `
    <svg class="prop-3d-svg" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 16 Q32 8 52 16 L32 55 Z" fill="#facc15" stroke="#b45309" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M10 16 Q32 7 54 16 L51 22 Q32 14 13 22 Z" fill="#d97706" stroke="#78350f" stroke-width="2"/>
      <circle cx="27" cy="27" r="4.2" fill="#ef4444" stroke="#991b1b" stroke-width="1.4"/>
      <circle cx="38" cy="30" r="3.8" fill="#ef4444" stroke="#991b1b" stroke-width="1.4"/>
      <circle cx="32" cy="40" r="3.6" fill="#ef4444" stroke="#991b1b" stroke-width="1.4"/>
    </svg>
  `;
}

function getMagicPotionSvg(idx = 0) {
  const palettes = [
    { liq1: '#c084fc', liq2: '#7e22ce', rim: '#6b21a8' },
    { liq1: '#38bdf8', liq2: '#0284c7', rim: '#075985' },
    { liq1: '#4ade80', liq2: '#15803d', rim: '#14532d' },
    { liq1: '#fb7185', liq2: '#be123c', rim: '#881337' },
  ];
  const p = palettes[idx % palettes.length];
  return `
    <svg class="prop-3d-svg potion-3d-svg" viewBox="0 0 56 56" aria-hidden="true">
      <rect x="22" y="5" width="12" height="7" rx="2.5" fill="#d97706" stroke="#78350f" stroke-width="1.8"/>
      <rect x="20" y="11" width="16" height="5" rx="2.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8"/>
      <path d="M23 16 V22 L11 38 A10 10 0 0 0 19 52 H37 A10 10 0 0 0 45 38 L33 22 V16 Z" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M14 35 Q28 31 42 35 L43 39 A8 8 0 0 1 36 49 H20 A8 8 0 0 1 13 39 Z" fill="${p.liq1}" stroke="${p.rim}" stroke-width="1.5"/>
      <circle cx="23" cy="42" r="2.3" fill="#ffffff" opacity="0.75"/>
      <circle cx="31" cy="39" r="1.8" fill="#ffffff" opacity="0.75"/>
      <path d="M18 28 L14 38" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.8"/>
    </svg>
  `;
}

function getSpaceCrystalSvg(idx = 0) {
  const hues = [
    ['#e0f2fe', '#38bdf8', '#0369a1'],
    ['#fae8ff', '#d946ef', '#86198f'],
    ['#dcfce7', '#4ade80', '#15803d'],
    ['#fef9c3', '#facc15', '#b45309'],
  ];
  const [light, mid, dark] = hues[idx % hues.length];
  return `
    <svg class="prop-3d-svg crystal-3d-svg" viewBox="0 0 52 52" aria-hidden="true">
      <polygon points="26,4 42,16 36,46 16,46 10,16" fill="${mid}" stroke="${dark}" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="26,4 42,16 26,24 10,16" fill="${light}"/>
      <polygon points="26,4 33,16 26,46 19,16" fill="#ffffff" opacity="0.38"/>
    </svg>
  `;
}

function getMagicCardBackSvg() {
  const u = ++_svgUid;
  return `
    <svg class="card-back-crest-svg" viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id="mcGold_${u}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r="26" fill="rgba(255,255,255,0.16)" stroke="url(#mcGold_${u})" stroke-width="2.5"/>
      <path d="M36 14 L41.5 27.5 L56 29 L45 38.5 L48.2 52.5 L36 45 L23.8 52.5 L27 38.5 L16 29 L30.5 27.5 Z"
        fill="url(#mcGold_${u})" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="36" cy="35" r="5" fill="#ffffff" opacity="0.85"/>
    </svg>
  `;
}

function getTrainCarBadgeSvg() {
  return `
    <svg class="ui-3d-icon train-car-badge-svg" width="26" height="26" viewBox="0 0 36 36" aria-hidden="true">
      <rect x="4" y="8" width="28" height="17" rx="4" fill="#fde047" stroke="#92400e" stroke-width="2"/>
      <rect x="8" y="12" width="8" height="7" rx="1.5" fill="#bae6fd" stroke="#0369a1" stroke-width="1.4"/>
      <rect x="20" y="12" width="8" height="7" rx="1.5" fill="#bae6fd" stroke="#0369a1" stroke-width="1.4"/>
      <circle cx="11" cy="27" r="4" fill="#334155" stroke="#0f172a" stroke-width="1.6"/>
      <circle cx="25" cy="27" r="4" fill="#334155" stroke="#0f172a" stroke-width="1.6"/>
    </svg>
  `;
}

function getPinnedArrowSvg() {
  return `
    <svg class="pinned-arrow-3d-svg" viewBox="0 0 64 64" aria-hidden="true">
      <line x1="52" y1="12" x2="18" y2="46" stroke="#b45309" stroke-width="5.5" stroke-linecap="round"/>
      <line x1="51" y1="11" x2="17" y2="45" stroke="#fde047" stroke-width="2.4" stroke-linecap="round"/>
      <polygon points="12,52 17,37 27,47" fill="#facc15" stroke="#78350f" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="52,12 60,6 56,16" fill="#ef4444" stroke="#991b1b" stroke-width="1.4"/>
      <polygon points="48,16 58,14 52,22" fill="#fb7185" stroke="#991b1b" stroke-width="1.4"/>
    </svg>
  `;
}

function getJudgeRuneSvg(isYes = true) {
  if (isYes) {
    return `
      <svg class="ui-3d-icon judge-rune-svg" width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="13" fill="none" stroke="#ffffff" stroke-width="6"/>
        <circle cx="20" cy="20" r="13" fill="none" stroke="#dcfce7" stroke-width="3"/>
      </svg>
    `;
  }
  return `
    <svg class="ui-3d-icon judge-rune-svg" width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M11 11 L29 29 M29 11 L11 29" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `;
}

function getMysteryEggSvg() {
  const u = ++_svgUid;
  return `
    <svg class="mystery-egg-svg" viewBox="0 0 64 72" aria-hidden="true">
      <defs>
        <radialGradient id="eggShell_${u}" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="55%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
      </defs>
      <path d="M32 6 C17 6 10 29 10 45 C10 59 20 66 32 66 C44 66 54 59 54 45 C54 29 47 6 32 6 Z" fill="url(#eggShell_${u})" stroke="#b45309" stroke-width="2.5"/>
      <circle cx="24" cy="30" r="4.5" fill="#fb7185" opacity="0.75"/>
      <circle cx="40" cy="38" r="5.5" fill="#38bdf8" opacity="0.75"/>
      <circle cx="27" cy="49" r="4" fill="#4ade80" opacity="0.75"/>
    </svg>
  `;
}

// Bespoke 3D Illustrated Picture Token for K2 Vocabulary (Zero stock emojis & zero Hanzi leak in clues!)
function getK2WordIllustrationSvg(word = '') {
  const key = String(word || '').trim();
  const numberMap = { '一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '七': '7', '十': '10' };
  if (numberMap[key]) {
    const num = numberMap[key];
    return `
      <svg class="k2-illus-svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="6" y="6" width="52" height="52" rx="16" fill="#fef08a" stroke="#d97706" stroke-width="3"/>
        <rect x="11" y="11" width="42" height="42" rx="12" fill="#ffffff"/>
        <text x="32" y="42" text-anchor="middle" font-size="28" font-weight="900" fill="#d97706" font-family="system-ui, sans-serif">${num}</text>
      </svg>
    `;
  }

  let inner = '';
  let bg = '#e0f2fe';
  let rim = '#0284c7';

  if (key === '日' || key === '早' || key === '天') {
    bg = '#fef9c3'; rim = '#ea580c';
    inner = `
      <circle cx="32" cy="32" r="13" fill="#facc15" stroke="#ea580c" stroke-width="2.5"/>
      <g stroke="#f97316" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="11" x2="32" y2="15"/><line x1="32" y1="49" x2="32" y2="53"/>
        <line x1="11" y1="32" x2="15" y2="32"/><line x1="49" y1="32" x2="53" y2="32"/>
        <line x1="17" y1="17" x2="20" y2="20"/><line x1="44" y1="44" x2="47" y2="47"/>
        <line x1="47" y1="17" x2="44" y2="20"/><line x1="20" y1="44" x2="17" y2="47"/>
      </g>`;
  } else if (key === '月' || key === '星') {
    bg = '#ede9fe'; rim = '#6d28d9';
    inner = `
      <path d="M36 14 A16 16 0 1 0 48 38 A13 13 0 1 1 36 14 Z" fill="#fde047" stroke="#b45309" stroke-width="2"/>
      <circle cx="44" cy="20" r="3.5" fill="#facc15"/>`;
  } else if (key === '山' || key === '高') {
    bg = '#dcfce7'; rim = '#15803d';
    inner = `
      <polygon points="8,48 25,16 40,48" fill="#22c55e" stroke="#166534" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="24,48 41,22 56,48" fill="#4ade80" stroke="#166534" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="25,16 30,26 20,26" fill="#ffffff"/>`;
  } else if (key === '水' || key === '雨') {
    bg = '#e0f2fe'; rim = '#0284c7';
    inner = `
      <path d="M32 12 C32 12 16 30 16 40 A16 16 0 0 0 48 40 C48 30 32 12 32 12 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="2.4"/>
      <ellipse cx="26" cy="36" rx="4" ry="7" fill="#ffffff" opacity="0.6" transform="rotate(-15 26 36)"/>`;
  } else if (key === '風') {
    bg = '#e0f2fe'; rim = '#0284c7';
    inner = `
      <path d="M12 25 H40 A6 6 0 1 0 34 19" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
      <path d="M10 34 H46 A6 6 0 1 1 40 40" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <path d="M16 43 H32" fill="none" stroke="#7dd3fc" stroke-width="3.6" stroke-linecap="round"/>`;
  } else if (key === '火') {
    bg = '#ffedd5'; rim = '#ea580c';
    inner = `
      <path d="M32 10 C42 22 48 30 46 41 A14 14 0 0 1 18 41 C16 31 23 22 32 10 Z" fill="#f97316" stroke="#c2410c" stroke-width="2.2"/>
      <path d="M32 24 C37 31 39 36 38 43 A6 6 0 0 1 26 43 C25 36 28 31 32 24 Z" fill="#fde047"/>`;
  } else if (key === '木' || key === '竹' || key === '草') {
    bg = '#dcfce7'; rim = '#15803d';
    inner = `
      <rect x="28" y="36" width="8" height="15" rx="2" fill="#92400e"/>
      <circle cx="32" cy="24" r="13" fill="#22c55e" stroke="#166534" stroke-width="2.2"/>
      <circle cx="24" cy="29" r="9" fill="#4ade80"/>
      <circle cx="40" cy="29" r="9" fill="#16a34a"/>`;
  } else if (key === '花') {
    bg = '#fce7f3'; rim = '#db2777';
    inner = `
      <circle cx="32" cy="19" r="8" fill="#fb7185"/><circle cx="44" cy="28" r="8" fill="#f472b6"/>
      <circle cx="39" cy="42" r="8" fill="#fb7185"/><circle cx="25" cy="42" r="8" fill="#f472b6"/>
      <circle cx="20" cy="28" r="8" fill="#fb7185"/><circle cx="32" cy="31" r="7" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>`;
  } else if (key === '西') {
    // 3D Watermelon slice
    bg = '#dcfce7'; rim = '#16a34a';
    inner = `
      <path d="M12 24 A20 20 0 0 0 52 24 Z" fill="#22c55e" stroke="#15803d" stroke-width="2.5"/>
      <path d="M16 24 A16 16 0 0 0 48 24 Z" fill="#f43f5e"/>
      <circle cx="26" cy="30" r="1.8" fill="#0f172a"/><circle cx="32" cy="33" r="1.8" fill="#0f172a"/><circle cx="38" cy="30" r="1.8" fill="#0f172a"/>`;
  } else if (key === '衣') {
    // 3D Sunny T-Shirt
    bg = '#dbeafe'; rim = '#2563eb';
    inner = `
      <path d="M22 16 L11 24 L16 31 L21 27 V48 H43 V27 L48 31 L53 24 L42 16 Q32 22 22 16 Z" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="32" cy="34" r="4.5" fill="#fde047"/>`;
  } else if (key === '門' || key === '開') {
    // 3D Golden Wooden Door
    bg = '#fef3c7'; rim = '#b45309';
    inner = `
      <rect x="17" y="13" width="30" height="39" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2.4"/>
      <line x1="32" y1="13" x2="32" y2="52" stroke="#78350f" stroke-width="2"/>
      <circle cx="28" cy="33" r="2.3" fill="#fef08a"/><circle cx="36" cy="33" r="2.3" fill="#fef08a"/>`;
  } else if (key === '跑') {
    // 3D Sporty Sneaker
    bg = '#fee2e2'; rim = '#e11d48';
    inner = `
      <path d="M14 42 V24 L26 24 L35 34 H49 A5 5 0 0 1 52 42 Z" fill="#fb7185" stroke="#be123c" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="12" y="41" width="41" height="6" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.8"/>
      <line x1="25" y1="28" x2="31" y2="28" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (key === '馬') {
    // 3D Cute Pony
    bg = '#ffedd5'; rim = '#c2410c';
    inner = `
      <path d="M20 48 V28 C20 18 30 14 38 17 L46 24 L43 32 L34 30 V48 Z" fill="#d97706" stroke="#78350f" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M21 17 L26 11 L29 17" fill="#92400e"/>
      <path d="M18 20 Q13 28 18 38" fill="none" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <circle cx="36" cy="23" r="2.4" fill="#0f172a"/>`;
  } else if (key === '兔') {
    // 3D White Bunny
    bg = '#fce7f3'; rim = '#ec4899';
    inner = `
      <ellipse cx="25" cy="19" rx="4.5" ry="11" fill="#ffffff" stroke="#db2777" stroke-width="2"/>
      <ellipse cx="39" cy="19" rx="4.5" ry="11" fill="#ffffff" stroke="#db2777" stroke-width="2"/>
      <ellipse cx="25" cy="19" rx="2" ry="7" fill="#fbcfe8"/><ellipse cx="39" cy="19" rx="2" ry="7" fill="#fbcfe8"/>
      <circle cx="32" cy="37" r="14" fill="#ffffff" stroke="#db2777" stroke-width="2.2"/>
      <circle cx="27" cy="35" r="2.2" fill="#0f172a"/><circle cx="37" cy="35" r="2.2" fill="#0f172a"/>
      <ellipse cx="32" cy="40" rx="3" ry="2" fill="#fb7185"/>`;
  } else if (key === '牛' || key === '羊') {
    // 3D Cute Horned Critter
    bg = '#fef9c3'; rim = '#ca8a04';
    inner = `
      <path d="M16 20 Q12 12 20 14" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
      <path d="M48 20 Q52 12 44 14" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
      <circle cx="32" cy="33" r="15" fill="#ffffff" stroke="#78350f" stroke-width="2.2"/>
      <ellipse cx="32" cy="40" rx="10" ry="6.5" fill="#fde68a" stroke="#b45309" stroke-width="1.6"/>
      <circle cx="26" cy="29" r="2.3" fill="#0f172a"/><circle cx="38" cy="29" r="2.3" fill="#0f172a"/>`;
  } else if (key === '狗' || key === '貓') {
    // 3D Cute Pet Face
    bg = '#ffedd5'; rim = '#ea580c';
    inner = `
      <polygon points="16,26 19,12 29,20" fill="#fb923c" stroke="#9a3412" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="48,26 45,12 35,20" fill="#fb923c" stroke="#9a3412" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="32" cy="34" r="15" fill="#fdba74" stroke="#9a3412" stroke-width="2.2"/>
      <circle cx="26" cy="32" r="2.4" fill="#0f172a"/><circle cx="38" cy="32" r="2.4" fill="#0f172a"/>
      <polygon points="32,36 29,40 35,40" fill="#7c2d12"/>`;
  } else if (key === '雞' || key === '鴨' || key === '鵝' || key === '鳥' || key === '飛') {
    // 3D Golden Chick / Bird
    bg = '#fef9c3'; rim = '#eab308';
    inner = `
      <circle cx="31" cy="34" r="15" fill="#fde047" stroke="#b45309" stroke-width="2.2"/>
      <polygon points="45,32 54,35 45,39" fill="#f97316" stroke="#c2410c" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="36" cy="30" r="2.5" fill="#0f172a"/>
      <path d="M22 34 Q27 42 33 36" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>`;
  } else if (key === '魚') {
    bg = '#e0f2fe'; rim = '#0284c7';
    inner = `
      <polygon points="46,32 56,22 56,42" fill="#fb923c" stroke="#c2410c" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="29" cy="32" rx="17" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2.2"/>
      <circle cx="20" cy="29" r="3" fill="#0f172a"/><circle cx="19" cy="28" r="1.1" fill="#ffffff"/>`;
  } else if (key === '車') {
    bg = '#fee2e2'; rim = '#dc2626';
    inner = `
      <path d="M12 36 L17 22 H45 L51 36 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <rect x="9" y="34" width="46" height="11" rx="5" fill="#f87171" stroke="#991b1b" stroke-width="2"/>
      <circle cx="20" cy="46" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="44" cy="46" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>`;
  } else if (key === '手' || key === '來') {
    bg = '#ffedd5'; rim = '#f97316';
    inner = `
      <path d="M22 46 V24 A2.5 2.5 0 0 1 27 24 V20 A2.5 2.5 0 0 1 32 20 V22 A2.5 2.5 0 0 1 37 22 V26 A2.5 2.5 0 0 1 42 26 V42 A10 10 0 0 1 22 46 Z" fill="#fed7aa" stroke="#c2410c" stroke-width="2.2" stroke-linejoin="round"/>`;
  } else if (key === '口' || key === '樂') {
    bg = '#fef9c3'; rim = '#eab308';
    inner = `
      <circle cx="32" cy="32" r="17" fill="#fde047" stroke="#ca8a04" stroke-width="2.2"/>
      <circle cx="26" cy="27" r="2.4" fill="#0f172a"/><circle cx="38" cy="27" r="2.4" fill="#0f172a"/>
      <path d="M22 34 A10 10 0 0 0 42 34 Z" fill="#fb7185" stroke="#9f1239" stroke-width="1.8"/>`;
  } else if (key === '耳') {
    bg = '#ffedd5'; rim = '#ea580c';
    inner = `
      <path d="M24 22 C24 12 44 12 44 27 C44 37 36 40 34 46 C32 50 24 49 24 43" fill="none" stroke="#c2410c" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M30 26 C30 20 38 20 38 28 C38 33 33 35 32 39" fill="none" stroke="#fb923c" stroke-width="3" stroke-linecap="round"/>`;
  } else if (key === '上' || key === '下') {
    bg = '#dbeafe'; rim = '#2563eb';
    const pts = key === '上' ? '32,12 50,32 39,32 39,50 25,50 25,32 14,32' : '32,52 50,32 39,32 39,14 25,14 25,32 14,32';
    inner = `<polygon points="${pts}" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2.4" stroke-linejoin="round"/>`;
  } else if (key === '大' || key === '小') {
    bg = '#fef9c3'; rim = '#d97706';
    const r = key === '大' ? 17 : 8.5;
    inner = `<circle cx="32" cy="32" r="${r}" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>`;
  } else if (key === '心' || key === '愛' || key === '爸' || key === '媽' || key === '人') {
    bg = '#ffe4e6'; rim = '#e11d48';
    inner = `
      <path d="M32 49 C32 49 13 37 13 24 A10 10 0 0 1 32 19 A10 10 0 0 1 51 24 C51 37 32 49 32 49 Z" fill="#fb7185" stroke="#be123c" stroke-width="2.4"/>
      <ellipse cx="23" cy="23" rx="4.5" ry="2.5" fill="#ffffff" opacity="0.6" transform="rotate(-25 23 23)"/>`;
  } else {
    // Radiant 3D Starlight Crest (never leaks Hanzi text!)
    bg = '#fef3c7'; rim = '#d97706';
    inner = `
      <path d="M32 13 L37.2 24.5 L50 26 L40.4 34.6 L43 47 L32 40.6 L21 47 L23.6 34.6 L14 26 L26.8 24.5 Z" fill="#facc15" stroke="#b45309" stroke-width="2.2" stroke-linejoin="round"/>`;
  }

  return `
    <svg class="k2-illus-svg" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="18" fill="${bg}" stroke="${rim}" stroke-width="2.6"/>
      <ellipse cx="24" cy="12" rx="14" ry="4" fill="#ffffff" opacity="0.55"/>
      ${inner}
    </svg>
  `;
}

// Strip raw system emojis from curriculum strings at display time while preserving punctuation & Zhuyin
const DISPLAY_EMOJI_STRIP_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}]/gu;
function stripDisplayEmojis(str) {
  if (!str) return '';
  return String(str)
    .replace(/[1-9]️⃣|🔟/g, '')
    .replace(DISPLAY_EMOJI_STRIP_RE, '')
    .replace(/^\s+/, '')
    .replace(/\s{2,}/g, ' ');
}

// Pedagogical skill classification for Parent Value visibility
function getQuestionSkillMeta(q) {
  const t = (q && q.type) || '';
  const m = (q && q._arcadeMode) || '';
  if (t.startsWith('k2_sound') || t === 'k2_dart' || t === 'k2_bubble') {
    return { tag: '聽音辨字・注音啟蒙', parentNote: '訓練標準教育部注音符號聽覺辨識與聲韻敏感度' };
  }
  if (t === 'k2_spell' || t === 'k2_claw') {
    return { tag: '拼音合成・聲調練習', parentNote: '建立聲母、韻母與四聲結合拼讀邏輯' };
  }
  if (t.startsWith('k2_')) {
    return { tag: '圖文連結・生活識字', parentNote: '將注音發音連結核心生活國字，奠定一年級閱讀基礎' };
  }
  if (t === 'bubble') {
    return { tag: '字音聲調・精準辨讀', parentNote: '強化平翹舌、前後鼻音與一字多音考點辨析' };
  }
  if (t === 'alchemy') {
    return { tag: '部首結構・造字邏輯', parentNote: '拆解部件與部首意義，從根本減少寫錯別字' };
  }
  if (t === 'typo' || m === 'typo_laser') {
    return { tag: '錯別字偵測・視覺校對', parentNote: '訓練月考改錯題最關鍵的形近字與同音字辨識力' };
  }
  if (t === 'train') {
    return { tag: '語法結構・句型重組', parentNote: '培養完整語句邏輯、連接詞運用與寫作造句基礎' };
  }
  if (t === 'memory') {
    return { tag: '詞彙配對・工作記憶', parentNote: '同步訓練國語詞義連結與專注力短期記憶' };
  }
  if (t === 'judge') {
    return { tag: '課文統整・是非判斷', parentNote: '檢核課文主旨理解與月考高頻觀念釐清' };
  }
  return { tag: '課文素養・閱讀理解', parentNote: '培養文意推論、情境應用與閱讀素養解題力' };
}

module.exports = {
  iconBrandCrest,
  iconGoldCoin,
  iconStarGem,
  iconSingleStar,
  renderStarsSvg,
  iconSpeaker,
  iconMusicNote,
  iconGachaGlobe,
  iconReportChart,
  iconBackArrow,
  iconPlayTriangle,
  iconBookCards,
  iconMilestoneChest,
  iconBossCrest,
  iconCompassQuest,
  iconMistakeShield,
  getDinoTreatSvg,
  getMagicPotionSvg,
  getSpaceCrystalSvg,
  getMagicCardBackSvg,
  getTrainCarBadgeSvg,
  getPinnedArrowSvg,
  getJudgeRuneSvg,
  getMysteryEggSvg,
  getK2WordIllustrationSvg,
  stripDisplayEmojis,
  getQuestionSkillMeta,
};
