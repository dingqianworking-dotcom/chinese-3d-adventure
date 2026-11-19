// Bespoke 3D-Shaded Multi-Part Hero Rigs for all 12 Arcade Modes + Stage Ready Buffer Previews
// Pure graphical vector rigs (zero raw Bopomofo text nodes) with articulated sub-groups for interactive animation.

const HERO_STAGE_META = {
  dart: {
    badge: '皇家神箭射靶',
    shortName: '神箭射靶',
    readyTitle: '神箭手準備拉弓！',
    readyAction: '瞄準靶心・發射黃金羽箭',
    accent: '#e11d48',
    bgGrad: 'linear-gradient(155deg, #fff1f2 0%, #ffe4e6 46%, #fef3c7 100%)',
  },
  claw: {
    badge: '巨型夾娃娃機',
    shortName: '夾娃娃機',
    readyTitle: '巨型鋼爪啟動！',
    readyAction: '移動天車・夾起正確扭蛋球',
    accent: '#7c3aed',
    bgGrad: 'linear-gradient(155deg, #f5f3ff 0%, #ede9fe 48%, #fce7f3 100%)',
  },
  fish: {
    badge: '小熊甩竿釣魚',
    shortName: '甩竿釣魚',
    readyTitle: '釣魚小熊出海囉！',
    readyAction: '看準大魚・甩竿拉上漁船',
    accent: '#0284c7',
    bgGrad: 'linear-gradient(155deg, #ecfeff 0%, #bae6fd 52%, #dbeafe 100%)',
  },
  feed: {
    badge: '貪吃恐龍點心',
    shortName: '餵小恐龍',
    readyTitle: '小暴龍肚子餓囉！',
    readyAction: '張開大嘴・投入正確美味點心',
    accent: '#16a34a',
    bgGrad: 'linear-gradient(155deg, #f0fdf4 0%, #dcfce7 50%, #fef9c3 100%)',
  },
  chest_lock: {
    badge: '黃金海盜寶箱',
    shortName: '開大寶箱',
    readyTitle: '發現神秘黃金寶箱！',
    readyAction: '射出寶石金鑰匙・轉開大鎖頭',
    accent: '#d97706',
    bgGrad: 'linear-gradient(155deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
  },
  typo_laser: {
    badge: '外星飛碟雷射',
    shortName: '飛碟雷射',
    readyTitle: '外星飛碟鎖定目標！',
    readyAction: '掃描錯別字・發射電漿雷射砲',
    accent: '#0284c7',
    bgGrad: 'linear-gradient(155deg, #ecfeff 0%, #cffafe 48%, #e0e7ff 100%)',
  },
  mole: {
    badge: '巨槌打地鼠',
    shortName: '大槌地鼠',
    readyTitle: '舉起黃金星星大氣槌！',
    readyAction: '地鼠探出頭・重槌精準敲擊',
    accent: '#ea580c',
    bgGrad: 'linear-gradient(155deg, #fff7ed 0%, #ffedd5 50%, #dcfce7 100%)',
  },
  bubble_pop: {
    badge: '海豹七彩泡泡',
    shortName: '戳大泡泡',
    readyTitle: '小海豹吹出七彩泡泡！',
    readyAction: '發射星光球・擊破正確泡泡',
    accent: '#0284c7',
    bgGrad: 'linear-gradient(155deg, #f0f9ff 0%, #e0f2fe 50%, #fae8ff 100%)',
  },
  alchemy: {
    badge: '紫焰魔法煉金釜',
    shortName: '魔法大釜',
    readyTitle: '點燃紫焰魔法大釜！',
    readyAction: '投入發光魔藥・合成正確文字',
    accent: '#9333ea',
    bgGrad: 'linear-gradient(155deg, #faf5ff 0%, #f3e8ff 50%, #fef3c7 100%)',
  },
  train: {
    badge: '皇家蒸汽火車',
    shortName: '蒸汽火車',
    readyTitle: '皇家蒸汽火車進站！',
    readyAction: '依序掛上車廂・鳴笛全速出發',
    accent: '#e11d48',
    bgGrad: 'linear-gradient(155deg, #fff1f2 0%, #ffe4e6 50%, #e0f2fe 100%)',
  },
  memory: {
    badge: '魔術兔兔翻牌',
    shortName: '魔術翻牌',
    readyTitle: '魔術兔兔揮動星光棒！',
    readyAction: '記住牌面位置・翻出成對組合',
    accent: '#7c3aed',
    bgGrad: 'linear-gradient(155deg, #f5f3ff 0%, #ede9fe 50%, #fef9c3 100%)',
  },
  judge: {
    badge: '雷神閃電審判錘',
    shortName: '雷霆審判',
    readyTitle: '高舉黃金雷霆審判錘！',
    readyAction: '召喚正義閃電・劈中正確判斷',
    accent: '#ca8a04',
    bgGrad: 'linear-gradient(155deg, #fefce8 0%, #fef08a 48%, #e0f2fe 100%)',
  },
};

function getBowHeroSvg() {
  return `
  <svg class="hero-svg bow-hero-svg" viewBox="0 0 260 155" aria-hidden="true">
    <defs>
      <linearGradient id="bowGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="45%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="bowRuby" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fda4af"/>
        <stop offset="50%" stop-color="#e11d48"/>
        <stop offset="100%" stop-color="#881337"/>
      </linearGradient>
      <linearGradient id="arrowShaft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fde68a"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <filter id="bowShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#78350f" flood-opacity="0.35"/>
      </filter>
    </defs>
    <g filter="url(#bowShadow)" class="bow-pivot-group">
      <!-- Elastic Glowing Bowstring -->
      <path class="bow-string-path" d="M 34 98 Q 130 104 226 98" fill="none" stroke="#fef9c3" stroke-width="5" stroke-linecap="round"/>
      <path class="bow-string-core" d="M 34 98 Q 130 104 226 98" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>

      <!-- Left & Right Winged 3D Golden Bow Limbs -->
      <path class="bow-limb-left" d="M 130 58 C 92 42, 48 56, 26 96 C 42 104, 52 92, 68 82 C 88 70, 108 68, 130 74 Z" fill="url(#bowGold)" stroke="#78350f" stroke-width="3"/>
      <path class="bow-limb-right" d="M 130 58 C 168 42, 212 56, 234 96 C 218 104, 208 92, 192 82 C 172 70, 152 68, 130 74 Z" fill="url(#bowGold)" stroke="#78350f" stroke-width="3"/>

      <!-- Feather Wing Tips -->
      <circle cx="30" cy="96" r="8" fill="url(#bowRuby)" stroke="#fff" stroke-width="2"/>
      <circle cx="230" cy="96" r="8" fill="url(#bowRuby)" stroke="#fff" stroke-width="2"/>
      <path d="M 55 62 Q 85 50 112 58" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>
      <path d="M 205 62 Q 175 50 148 58" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>

      <!-- Center Ruby Grip Emblem -->
      <rect x="114" y="50" width="32" height="28" rx="10" fill="url(#bowRuby)" stroke="#fef08a" stroke-width="3.5"/>
      <ellipse cx="126" cy="58" rx="7" ry="4" fill="#ffffff" opacity="0.6"/>

      <!-- Nocked Giant 3D Feathered Arrow -->
      <g class="bow-nocked-arrow">
        <!-- Crimson Fletching Feathers -->
        <path d="M 130 96 L 114 118 L 128 112 Z" fill="url(#bowRuby)" stroke="#881337" stroke-width="2"/>
        <path d="M 130 96 L 146 118 L 132 112 Z" fill="url(#bowRuby)" stroke="#881337" stroke-width="2"/>
        <!-- Wooden Golden Shaft -->
        <rect x="126" y="24" width="8" height="88" rx="4" fill="url(#arrowShaft)" stroke="#78350f" stroke-width="2"/>
        <!-- Giant Sparkling Diamond-Gold Arrowhead -->
        <polygon points="130,4 111,34 125,29 135,29 149,34" fill="url(#bowGold)" stroke="#78350f" stroke-width="2.5"/>
        <polygon points="130,8 120,28 130,25" fill="#ffffff" opacity="0.75"/>
      </g>
    </g>
  </svg>`;
}

function getClawHeroSvg() {
  return `
  <svg class="hero-svg claw-hero-svg" viewBox="0 0 180 185" aria-hidden="true">
    <defs>
      <linearGradient id="clawChrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="48%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#475569"/>
      </linearGradient>
      <linearGradient id="clawDome" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f472b6"/>
        <stop offset="55%" stop-color="#db2777"/>
        <stop offset="100%" stop-color="#831843"/>
      </linearGradient>
      <linearGradient id="clawGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="60%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>
    <!-- Top Trolley Motor Box -->
    <g class="claw-trolley-head">
      <rect x="46" y="6" width="88" height="32" rx="14" fill="url(#clawDome)" stroke="#ffffff" stroke-width="3"/>
      <circle cx="66" cy="22" r="6" fill="#fef08a"/>
      <circle cx="90" cy="22" r="6" fill="#38bdf8"/>
      <circle cx="114" cy="22" r="6" fill="#4ade80"/>
      <path d="M 58 13 L 122 13" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
    </g>
    <!-- Central Hub & Glowing Core -->
    <g class="claw-jaw-assembly">
      <rect x="78" y="36" width="24" height="18" rx="6" fill="url(#clawGold)" stroke="#78350f" stroke-width="2.5"/>
      <!-- Left Articulated Giant Curved Steel Prong -->
      <g class="claw-arm-left" style="transform-origin: 76px 56px;">
        <path d="M 78 52 C 42 62, 22 96, 36 134 C 42 148, 56 156, 68 150 C 60 140, 52 126, 52 108 C 52 86, 66 70, 82 64 Z"
          fill="url(#clawChrome)" stroke="#334155" stroke-width="3"/>
        <path d="M 66 149 L 76 138 L 58 134 Z" fill="url(#clawGold)" stroke="#78350f" stroke-width="2"/>
      </g>
      <!-- Right Articulated Giant Curved Steel Prong -->
      <g class="claw-arm-right" style="transform-origin: 104px 56px;">
        <path d="M 102 52 C 138 62, 158 96, 144 134 C 138 148, 124 156, 112 150 C 120 140, 128 126, 128 108 C 128 86, 114 70, 98 64 Z"
          fill="url(#clawChrome)" stroke="#334155" stroke-width="3"/>
        <path d="M 114 149 L 104 138 L 122 134 Z" fill="url(#clawGold)" stroke="#78350f" stroke-width="2"/>
      </g>
      <!-- Center Power Joint -->
      <circle cx="90" cy="58" r="18" fill="url(#clawDome)" stroke="#fde047" stroke-width="3.5"/>
      <circle cx="90" cy="58" r="8" fill="#38bdf8"/>
      <circle cx="86" cy="54" r="3.5" fill="#ffffff"/>
    </g>
  </svg>`;
}

function getFishHeroSvg() {
  return `
  <svg class="hero-svg fish-hero-svg" viewBox="0 0 250 150" aria-hidden="true">
    <defs>
      <linearGradient id="boatWood" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="55%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <radialGradient id="bearFur" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fcd34d"/>
        <stop offset="55%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#92400e"/>
      </radialGradient>
    </defs>
    <!-- Cute 3D Fisherman Bear in Wooden Boat -->
    <g class="fish-boat-group">
      <!-- Ears & Head -->
      <circle cx="62" cy="42" r="12" fill="url(#bearFur)" stroke="#78350f" stroke-width="2.5"/>
      <circle cx="106" cy="42" r="12" fill="url(#bearFur)" stroke="#78350f" stroke-width="2.5"/>
      <circle cx="62" cy="42" r="6" fill="#fde68a"/>
      <circle cx="106" cy="42" r="6" fill="#fde68a"/>
      <!-- Straw Hat -->
      <ellipse cx="84" cy="30" rx="34" ry="9" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>
      <path d="M 64 30 C 66 12, 102 12, 104 30 Z" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>
      <path d="M 65 27 L 103 27" stroke="#ef4444" stroke-width="4"/>
      <!-- Face -->
      <circle cx="84" cy="58" r="28" fill="url(#bearFur)" stroke="#78350f" stroke-width="2.5"/>
      <ellipse cx="84" cy="64" rx="13" ry="10" fill="#fef3c7"/>
      <circle cx="74" cy="53" r="4" fill="#1e293b"/>
      <circle cx="94" cy="53" r="4" fill="#1e293b"/>
      <circle cx="72.5" cy="51.5" r="1.5" fill="#fff"/>
      <circle cx="92.5" cy="51.5" r="1.5" fill="#fff"/>
      <ellipse cx="84" cy="61" rx="5" ry="3.5" fill="#451a03"/>
      <path d="M 79 67 Q 84 72 89 67" fill="none" stroke="#451a03" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="66" cy="61" r="4.5" fill="#fb7185" opacity="0.55"/>
      <circle cx="102" cy="61" r="4.5" fill="#fb7185" opacity="0.55"/>
      <!-- Boat Hull -->
      <path d="M 28 92 L 144 92 L 128 128 L 44 128 Z" fill="url(#boatWood)" stroke="#78350f" stroke-width="3"/>
      <path d="M 36 104 L 136 104" stroke="#fef3c7" stroke-width="3" opacity="0.55"/>
      <!-- Water Waves under boat -->
      <path d="M 16 128 Q 42 118 68 128 T 120 128 T 168 128" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    </g>

    <!-- Giant Curved 3D Golden Fishing Rod & Spinning Reel + Red/White Bobber -->
    <g class="fish-rod-group" style="transform-origin: 112px 88px;">
      <path d="M 106 92 Q 162 24 232 36" fill="none" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
      <path d="M 106 92 Q 162 24 232 36" fill="none" stroke="#fde047" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Spinning Reel -->
      <circle cx="126" cy="76" r="11" fill="#38bdf8" stroke="#0369a1" stroke-width="2.5"/>
      <circle cx="126" cy="76" r="4" fill="#fef08a"/>
      <!-- Dangling Line & Classic Red-White Bobber -->
      <line x1="232" y1="36" x2="232" y2="88" stroke="#e0f2fe" stroke-width="2.5" stroke-dasharray="4 2"/>
      <g class="fish-bobber-group" id="fish-rod-tip-anchor">
        <circle cx="232" cy="96" r="13" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
        <path d="M 219 96 A 13 13 0 0 1 245 96 Z" fill="#ef4444"/>
        <rect x="229" y="79" width="6" height="8" rx="3" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
      </g>
    </g>
  </svg>`;
}

function getDinoHeroSvg(mood = 'hungry') {
  const isHappy = mood === 'happy';
  const isDizzy = mood === 'dizzy';
  return `
  <svg class="hero-svg dino-hero-svg ${isHappy ? 'is-happy' : ''} ${isDizzy ? 'is-dizzy' : ''}" viewBox="0 0 210 175" aria-hidden="true">
    <defs>
      <radialGradient id="dinoSkin" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#86efac"/>
        <stop offset="55%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#15803d"/>
      </radialGradient>
      <linearGradient id="dinoBelly" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="100%" stop-color="#fde047"/>
      </linearGradient>
    </defs>
    <!-- Back Spikes -->
    <polygon points="56,36 40,22 62,20" fill="#facc15" stroke="#b45309" stroke-width="2"/>
    <polygon points="48,62 28,50 52,44" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
    <polygon points="48,92 26,84 50,74" fill="#facc15" stroke="#b45309" stroke-width="2"/>

    <!-- Chubby Body & Tail -->
    <path d="M 54 115 Q 20 128 18 146 Q 42 154 68 144 Z" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="3"/>
    <ellipse cx="106" cy="126" rx="56" ry="42" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="3"/>
    <ellipse cx="114" cy="132" rx="36" ry="30" fill="url(#dinoBelly)" stroke="#ca8a04" stroke-width="2"/>
    <path d="M 86 122 L 142 122 M 84 136 L 144 136 M 90 150 L 138 150" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Cute Waving Little Arms -->
    <path class="dino-arm-l" d="M 68 114 Q 48 106 52 94 Q 62 92 74 104" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="2.5"/>
    <path class="dino-arm-r" d="M 146 114 Q 168 104 164 92 Q 154 90 140 104" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="2.5"/>

    <!-- Deep Mouth Cavity (Target for Flying Treats!) -->
    <ellipse class="dino-mouth-cavity" cx="122" cy="76" rx="34" ry="24" fill="#881337" stroke="#4c0519" stroke-width="2.5"/>
    <ellipse cx="124" cy="88" rx="22" ry="10" fill="#fb7185"/>

    <!-- Articulated Lower Jaw -->
    <g class="dino-lower-jaw" style="transform-origin: 86px 80px;">
      <path d="M 78 78 Q 124 108 164 84 Q 158 106 118 106 Q 84 104 78 78 Z" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="3"/>
      <polygon points="104,85 109,77 114,86" fill="#ffffff"/>
      <polygon points="132,86 137,78 142,85" fill="#ffffff"/>
    </g>

    <!-- Articulated Upper Head & Snout -->
    <g class="dino-upper-jaw" style="transform-origin: 84px 66px;">
      <path d="M 56 68 C 54 22, 122 10, 166 42 C 178 52, 174 72, 156 74 C 132 76, 98 76, 56 68 Z" fill="url(#dinoSkin)" stroke="#14532d" stroke-width="3"/>
      <!-- Cute White Rounded Teeth -->
      <polygon points="106,72 112,82 118,72" fill="#ffffff"/>
      <polygon points="128,72 134,82 140,72" fill="#ffffff"/>
      <polygon points="148,71 153,79 158,70" fill="#ffffff"/>
      <!-- Nostrils & Rosy Cheek -->
      <circle cx="154" cy="48" r="3.5" fill="#14532d"/>
      <ellipse cx="94" cy="58" rx="9" ry="5.5" fill="#fb7185" opacity="0.65"/>
      <!-- Big Glossy Eye -->
      <circle cx="104" cy="40" r="14" fill="#ffffff" stroke="#14532d" stroke-width="2.5"/>
      ${isHappy ? `
        <path d="M 96 42 Q 104 32 112 42" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      ` : isDizzy ? `
        <path d="M 97 34 L 111 46 M 111 34 L 97 46" stroke="#e11d48" stroke-width="3.5" stroke-linecap="round"/>
      ` : `
        <circle cx="107" cy="40" r="8" fill="#1e293b"/>
        <circle cx="104" cy="36" r="3.5" fill="#ffffff"/>
      `}
    </g>
  </svg>`;
}

function getChestHeroSvg(unlocked = false) {
  return `
  <svg class="hero-svg chest-hero-svg ${unlocked ? 'is-unlocked' : ''}" viewBox="0 0 220 165" aria-hidden="true">
    <defs>
      <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#d97706"/>
        <stop offset="50%" stop-color="#92400e"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
      <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="45%" stop-color="#facc15"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>

    <!-- Sparkling Gems & Coins Inside (Visible when lid opens!) -->
    <g class="chest-treasure-inside">
      <circle cx="78" cy="74" r="14" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="102" cy="66" r="16" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <polygon points="126,48 144,68 126,86 108,68" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
      <circle cx="146" cy="74" r="14" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
      <circle cx="92" cy="78" r="12" fill="#facc15" stroke="#b45309" stroke-width="2"/>
      <circle cx="118" cy="78" r="13" fill="#fde047" stroke="#b45309" stroke-width="2"/>
    </g>

    <!-- Hinged Upper Domed Lid -->
    <g class="chest-lid-group" style="transform-origin: 110px 76px;">
      <path d="M 34 78 C 36 30, 184 30, 186 78 Z" fill="url(#chestWood)" stroke="#451a03" stroke-width="3.5"/>
      <path d="M 34 74 L 186 74" stroke="url(#chestGold)" stroke-width="9"/>
      <path d="M 66 78 C 68 38, 78 38, 80 78" fill="none" stroke="url(#chestGold)" stroke-width="10"/>
      <path d="M 140 78 C 142 38, 152 38, 154 78" fill="none" stroke="url(#chestGold)" stroke-width="10"/>
      <ellipse cx="110" cy="48" rx="34" ry="6" fill="#ffffff" opacity="0.28"/>
    </g>

    <!-- Lower Chest Base Box -->
    <g class="chest-base-group">
      <rect x="36" y="78" width="148" height="72" rx="12" fill="url(#chestWood)" stroke="#451a03" stroke-width="3.5"/>
      <line x1="40" y1="102" x2="180" y2="102" stroke="#451a03" stroke-width="2.5"/>
      <line x1="40" y1="126" x2="180" y2="126" stroke="#451a03" stroke-width="2.5"/>
      <!-- Gold Straps & Corner Rivets -->
      <rect x="62" y="78" width="14" height="72" fill="url(#chestGold)" stroke="#78350f" stroke-width="2"/>
      <rect x="144" y="78" width="14" height="72" fill="url(#chestGold)" stroke="#78350f" stroke-width="2"/>
      <rect x="36" y="76" width="148" height="10" rx="4" fill="url(#chestGold)" stroke="#78350f" stroke-width="2"/>
    </g>

    <!-- Giant Front Golden Keyhole Padlock -->
    <g class="chest-padlock-group" style="transform-origin: 110px 96px;">
      <path d="M 96 86 V 72 A 14 14 0 0 1 124 72 V 86" fill="none" stroke="url(#chestGold)" stroke-width="8" stroke-linecap="round"/>
      <rect x="88" y="84" width="44" height="42" rx="11" fill="url(#chestGold)" stroke="#78350f" stroke-width="3"/>
      <circle cx="110" cy="100" r="6.5" fill="#451a03"/>
      <polygon points="107,102 113,102 115,116 105,116" fill="#451a03"/>
      <circle cx="98" cy="92" r="3.5" fill="#ffffff" opacity="0.7"/>
    </g>
  </svg>`;
}

function getUfoHeroSvg() {
  return `
  <svg class="hero-svg ufo-hero-svg" viewBox="0 0 230 145" aria-hidden="true">
    <defs>
      <radialGradient id="ufoGlass" cx="45%" cy="32%" r="65%">
        <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.92"/>
        <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.62"/>
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.85"/>
      </radialGradient>
      <linearGradient id="ufoHull" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="48%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
    </defs>
    <g class="ufo-hover-body">
      <!-- Cute Little Green Alien Pilot Inside Glass Dome -->
      <ellipse cx="115" cy="52" rx="22" ry="20" fill="#4ade80" stroke="#15803d" stroke-width="2.5"/>
      <line x1="106" y1="34" x2="100" y2="22" stroke="#15803d" stroke-width="3"/>
      <line x1="124" y1="34" x2="130" y2="22" stroke="#15803d" stroke-width="3"/>
      <circle cx="100" cy="20" r="4.5" fill="#fde047"/>
      <circle cx="130" cy="20" r="4.5" fill="#fde047"/>
      <circle cx="106" cy="48" r="4.5" fill="#ffffff"/><circle cx="106" cy="48" r="2.2" fill="#0f172a"/>
      <circle cx="115" cy="45" r="4.5" fill="#ffffff"/><circle cx="115" cy="45" r="2.2" fill="#0f172a"/>
      <circle cx="124" cy="48" r="4.5" fill="#ffffff"/><circle cx="124" cy="48" r="2.2" fill="#0f172a"/>
      <path d="M 108 57 Q 115 62 122 57" fill="none" stroke="#14532d" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Transparent 3D Glass Cockpit Dome -->
      <path d="M 62 68 C 64 14, 166 14, 168 68 Z" fill="url(#ufoGlass)" stroke="#bae6fd" stroke-width="3"/>
      <path d="M 78 52 C 84 28, 108 24, 122 26" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.75"/>

      <!-- Metallic Flying Saucer Rim -->
      <ellipse cx="115" cy="76" rx="96" ry="24" fill="url(#ufoHull)" stroke="#1e293b" stroke-width="3.5"/>
      <ellipse cx="115" cy="72" rx="74" ry="13" fill="#e2e8f0" opacity="0.65"/>

      <!-- Pulsing Rainbow Rim Lights -->
      <circle class="ufo-bulb b1" cx="44" cy="76" r="6.5" fill="#fb7185" stroke="#fff" stroke-width="1.5"/>
      <circle class="ufo-bulb b2" cx="78" cy="85" r="7" fill="#fde047" stroke="#fff" stroke-width="1.5"/>
      <circle class="ufo-bulb b3" cx="115" cy="88" r="7.5" fill="#4ade80" stroke="#fff" stroke-width="1.5"/>
      <circle class="ufo-bulb b4" cx="152" cy="85" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>
      <circle class="ufo-bulb b5" cx="186" cy="76" r="6.5" fill="#c084fc" stroke="#fff" stroke-width="1.5"/>

      <!-- Belly Plasma Laser Cannon Emitter -->
      <path d="M 94 98 L 136 98 L 126 118 L 104 118 Z" fill="#0284c7" stroke="#bae6fd" stroke-width="2.5"/>
      <circle id="ufo-cannon-core" cx="115" cy="120" r="11" fill="#38bdf8" stroke="#ffffff" stroke-width="3"/>
      <circle cx="115" cy="120" r="5" fill="#ffffff"/>
    </g>
  </svg>`;
}

function getMalletHeroSvg() {
  return `
  <svg class="hero-svg mallet-hero-svg" viewBox="0 0 190 140" aria-hidden="true">
    <defs>
      <linearGradient id="malletRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fda4af"/>
        <stop offset="45%" stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
      <linearGradient id="malletWood" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fde68a"/>
        <stop offset="55%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
    </defs>
    <g class="mallet-swing-group" style="transform-origin: 145px 120px;">
      <!-- Wooden Handle -->
      <rect x="96" y="56" width="18" height="78" rx="9" transform="rotate(-28 105 95)" fill="url(#malletWood)" stroke="#78350f" stroke-width="3"/>
      <!-- Giant 3D Carnival Barrel Head -->
      <g transform="rotate(-28 76 52)">
        <rect x="24" y="18" width="104" height="66" rx="22" fill="url(#malletRed)" stroke="#7f1d1d" stroke-width="3.5"/>
        <!-- Cushioned Yellow Impact Caps -->
        <ellipse cx="26" cy="51" rx="11" ry="32" fill="#fde047" stroke="#b45309" stroke-width="3"/>
        <ellipse cx="126" cy="51" rx="11" ry="32" fill="#fde047" stroke="#b45309" stroke-width="3"/>
        <!-- Gold Bands & Center Star -->
        <rect x="44" y="18" width="10" height="66" fill="#facc15"/>
        <rect x="98" y="18" width="10" height="66" fill="#facc15"/>
        <polygon points="76,30 82,43 96,45 86,55 88,69 76,62 64,69 66,55 56,45 70,43" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
        <path d="M 40 28 L 112 28" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
      </g>
    </g>
  </svg>`;
}

function getBubbleHeroSvg() {
  return `
  <svg class="hero-svg bubble-hero-svg" viewBox="0 0 220 140" aria-hidden="true">
    <defs>
      <radialGradient id="sealBody" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="65%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </radialGradient>
      <radialGradient id="soapOrb" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="55%" stop-color="#7dd3fc" stop-opacity="0.38"/>
        <stop offset="85%" stop-color="#f472b6" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#fde047" stop-opacity="0.8"/>
      </radialGradient>
    </defs>
    <!-- Cute 3D Baby Seal Blowing Bubbles -->
    <ellipse cx="78" cy="96" rx="46" ry="34" fill="url(#sealBody)" stroke="#0284c7" stroke-width="3"/>
    <circle cx="78" cy="56" r="32" fill="url(#sealBody)" stroke="#0284c7" stroke-width="3"/>
    <!-- Flippers -->
    <ellipse cx="34" cy="98" rx="16" ry="9" transform="rotate(-20 34 98)" fill="#7dd3fc" stroke="#0284c7" stroke-width="2.5"/>
    <ellipse cx="120" cy="88" rx="16" ry="9" transform="rotate(24 120 88)" fill="#7dd3fc" stroke="#0284c7" stroke-width="2.5"/>
    <!-- Eyes & Cute O-Mouth -->
    <circle cx="66" cy="50" r="4.5" fill="#0f172a"/><circle cx="64.5" cy="48.5" r="1.6" fill="#fff"/>
    <circle cx="90" cy="50" r="4.5" fill="#0f172a"/><circle cx="88.5" cy="48.5" r="1.6" fill="#fff"/>
    <circle cx="78" cy="58" r="4" fill="#334155"/>
    <circle cx="78" cy="68" r="5.5" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
    <circle cx="56" cy="58" r="5" fill="#f472b6" opacity="0.45"/>
    <circle cx="100" cy="58" r="5" fill="#f472b6" opacity="0.45"/>

    <!-- Giant Golden Star Bubble Wand Held by Seal -->
    <g class="bubble-wand-group">
      <line x1="126" y1="108" x2="148" y2="68" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
      <circle cx="158" cy="46" r="24" fill="none" stroke="#facc15" stroke-width="7"/>
      <circle cx="158" cy="46" r="19" fill="url(#soapOrb)"/>
    </g>

    <!-- Floating Iridescent Bubbles -->
    <circle class="float-b1" cx="194" cy="34" r="16" fill="url(#soapOrb)" stroke="#ffffff" stroke-width="2"/>
    <circle class="float-b2" cx="198" cy="76" r="11" fill="url(#soapOrb)" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`;
}

function getAlchemyHeroSvg() {
  return `
  <svg class="hero-svg alchemy-hero-svg" viewBox="0 0 210 150" aria-hidden="true">
    <defs>
      <radialGradient id="potIron" cx="38%" cy="35%" r="68%">
        <stop offset="0%" stop-color="#64748b"/>
        <stop offset="55%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </radialGradient>
      <linearGradient id="potionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="50%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#c084fc"/>
      </linearGradient>
    </defs>
    <!-- Cozy Magical Flames Underneath -->
    <g class="cauldron-flames">
      <path d="M 68 142 Q 76 116 88 136 Q 105 108 118 136 Q 132 114 142 142 Z" fill="#fb923c" stroke="#ea580c" stroke-width="2"/>
      <path d="M 80 142 Q 92 122 105 138 Q 116 120 130 142 Z" fill="#fde047"/>
    </g>
    <!-- Wooden Stirring Ladle -->
    <line class="cauldron-spoon" x1="128" y1="54" x2="154" y2="14" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
    <!-- Rising Potion Bubbles -->
    <circle class="pot-bub b1" cx="84" cy="36" r="8" fill="#4ade80" stroke="#fff" stroke-width="2"/>
    <circle class="pot-bub b2" cx="108" cy="24" r="10" fill="#c084fc" stroke="#fff" stroke-width="2"/>
    <circle class="pot-bub b3" cx="128" cy="38" r="7" fill="#fde047" stroke="#fff" stroke-width="2"/>

    <!-- Giant 3D Cast-Iron & Gold Cauldron -->
    <ellipse cx="105" cy="94" rx="58" ry="42" fill="url(#potIron)" stroke="#1e293b" stroke-width="3.5"/>
    <!-- Handles -->
    <circle cx="44" cy="88" r="10" fill="none" stroke="#facc15" stroke-width="5"/>
    <circle cx="166" cy="88" r="10" fill="none" stroke="#facc15" stroke-width="5"/>
    <!-- Rim & Bubbling Liquid Surface -->
    <ellipse cx="105" cy="56" rx="52" ry="15" fill="#1e293b" stroke="#facc15" stroke-width="4"/>
    <ellipse id="cauldron-mouth-target" cx="105" cy="56" rx="44" ry="10" fill="url(#potionGlow)"/>
    <path d="M 66 94 Q 68 116 92 122" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
  </svg>`;
}

function getTrainHeroSvg() {
  return `
  <svg class="hero-svg train-hero-svg" viewBox="0 0 220 135" aria-hidden="true">
    <defs>
      <linearGradient id="locoRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fb7185"/>
        <stop offset="50%" stop-color="#e11d48"/>
        <stop offset="100%" stop-color="#881337"/>
      </linearGradient>
      <linearGradient id="locoBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
    </defs>
    <!-- Puffing White 3D Steam Clouds -->
    <g class="train-steam-puffs">
      <circle cx="62" cy="18" r="10" fill="#ffffff" opacity="0.9"/>
      <circle cx="82" cy="12" r="13" fill="#ffffff" opacity="0.82"/>
      <circle cx="106" cy="10" r="9" fill="#ffffff" opacity="0.7"/>
    </g>
    <g class="train-body-group">
      <!-- Smokestack & Golden Dome -->
      <path d="M 48 56 L 42 28 L 68 28 L 62 56 Z" fill="#334155" stroke="#0f172a" stroke-width="2.5"/>
      <rect x="40" y="24" width="30" height="7" rx="3.5" fill="#facc15" stroke="#b45309" stroke-width="2"/>
      <path d="M 82 56 A 14 14 0 0 1 110 56 Z" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>

      <!-- Cab & Cute Engineer Window -->
      <rect x="122" y="30" width="66" height="66" rx="10" fill="url(#locoBlue)" stroke="#1e3a8a" stroke-width="3"/>
      <rect x="116" y="24" width="78" height="10" rx="5" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>
      <rect x="136" y="42" width="38" height="28" rx="6" fill="#e0f2fe" stroke="#1e3a8a" stroke-width="2.5"/>
      <!-- Little Bear Engineer Inside Window -->
      <circle cx="155" cy="58" r="10" fill="#d97706"/>
      <circle cx="151" cy="56" r="2" fill="#0f172a"/><circle cx="159" cy="56" r="2" fill="#0f172a"/>

      <!-- Red Boiler & Headlight -->
      <rect x="38" y="54" width="90" height="42" rx="14" fill="url(#locoRed)" stroke="#881337" stroke-width="3"/>
      <rect x="74" y="54" width="10" height="42" fill="#facc15"/>
      <circle cx="36" cy="70" r="9" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5"/>

      <!-- Cowcatcher & Chassis -->
      <polygon points="14,108 38,88 38,108" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>
      <rect x="34" y="94" width="160" height="14" rx="5" fill="#334155"/>

      <!-- 3 Big Spoked Spinning Wheels -->
      <g class="train-wheel w1" style="transform-origin: 62px 112px;">
        <circle cx="62" cy="112" r="16" fill="#ef4444" stroke="#1e293b" stroke-width="4"/>
        <circle cx="62" cy="112" r="5" fill="#fde047"/>
      </g>
      <g class="train-wheel w2" style="transform-origin: 112px 112px;">
        <circle cx="112" cy="112" r="16" fill="#ef4444" stroke="#1e293b" stroke-width="4"/>
        <circle cx="112" cy="112" r="5" fill="#fde047"/>
      </g>
      <g class="train-wheel w3" style="transform-origin: 164px 112px;">
        <circle cx="164" cy="112" r="18" fill="#ef4444" stroke="#1e293b" stroke-width="4"/>
        <circle cx="164" cy="112" r="6" fill="#fde047"/>
      </g>
      <!-- Side Coupling Rod -->
      <rect x="58" y="109" width="108" height="6" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
    </g>
  </svg>`;
}

function getMemoryHeroSvg() {
  return `
  <svg class="hero-svg memory-hero-svg" viewBox="0 0 210 140" aria-hidden="true">
    <defs>
      <linearGradient id="hatVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6d28d9"/>
        <stop offset="60%" stop-color="#4c1d95"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <!-- Cute White 3D Magician Bunny Popping out of Velvet Top Hat -->
    <g class="bunny-pop-group">
      <!-- Long Ears -->
      <ellipse cx="88" cy="28" rx="10" ry="24" transform="rotate(-12 88 28)" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
      <ellipse cx="88" cy="28" rx="5" ry="16" transform="rotate(-12 88 28)" fill="#fbcfe8"/>
      <ellipse cx="118" cy="28" rx="10" ry="24" transform="rotate(12 118 28)" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
      <ellipse cx="118" cy="28" rx="5" ry="16" transform="rotate(12 118 28)" fill="#fbcfe8"/>
      <!-- Bunny Head -->
      <circle cx="103" cy="58" r="25" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
      <circle cx="94" cy="54" r="4" fill="#1e293b"/><circle cx="92.8" cy="52.5" r="1.5" fill="#fff"/>
      <circle cx="112" cy="54" r="4" fill="#1e293b"/><circle cx="110.8" cy="52.5" r="1.5" fill="#fff"/>
      <ellipse cx="103" cy="61" rx="4" ry="3" fill="#f472b6"/>
      <circle cx="84" cy="61" r="4.5" fill="#fbcfe8"/>
      <circle cx="122" cy="61" r="4.5" fill="#fbcfe8"/>
      <!-- Red Bowtie -->
      <polygon points="103,79 91,73 91,85" fill="#ef4444"/>
      <polygon points="103,79 115,73 115,85" fill="#ef4444"/>
      <circle cx="103" cy="79" r="4" fill="#fde047"/>
    </g>

    <!-- Starry Magician Top Hat -->
    <ellipse cx="103" cy="88" rx="56" ry="13" fill="url(#hatVelvet)" stroke="#fde047" stroke-width="3"/>
    <path d="M 68 88 L 74 132 L 132 132 L 138 88 Z" fill="url(#hatVelvet)" stroke="#fde047" stroke-width="3"/>
    <rect x="70" y="92" width="66" height="9" fill="#ef4444"/>

    <!-- Waving Magic Wand -->
    <g class="bunny-wand-group" style="transform-origin: 132px 76px;">
      <line x1="126" y1="78" x2="178" y2="36" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
      <line x1="166" y1="45" x2="178" y2="36" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
      <polygon id="bunny-wand-tip" points="184,20 189,30 200,32 192,40 194,51 184,45 174,51 176,40 168,32 179,30" fill="#fde047" stroke="#f59e0b" stroke-width="2"/>
    </g>
  </svg>`;
}

function getJudgeHeroSvg() {
  return `
  <svg class="hero-svg judge-hero-svg" viewBox="0 0 210 140" aria-hidden="true">
    <defs>
      <linearGradient id="thunderGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="50%" stop-color="#facc15"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="thunderSteel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe"/>
        <stop offset="50%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
    </defs>
    <g class="judge-hammer-group" style="transform-origin: 105px 115px;">
      <!-- Angelic Golden Wings -->
      <path d="M 62 56 C 28 36, 16 62, 38 78 C 26 84, 38 96, 64 82 Z" fill="url(#thunderGold)" stroke="#b45309" stroke-width="2.5"/>
      <path d="M 148 56 C 182 36, 194 62, 172 78 C 184 84, 172 96, 146 82 Z" fill="url(#thunderGold)" stroke="#b45309" stroke-width="2.5"/>
      <!-- Handle -->
      <rect x="97" y="68" width="16" height="62" rx="8" fill="#78350f" stroke="#fde047" stroke-width="2.5"/>
      <!-- Giant Crystal-Steel Thunder Hammer Head -->
      <rect x="54" y="24" width="102" height="52" rx="14" fill="url(#thunderSteel)" stroke="url(#thunderGold)" stroke-width="4.5"/>
      <!-- Center Lightning Bolt Crest -->
      <polygon id="judge-bolt-origin" points="110,30 94,52 106,52 100,70 120,46 108,46" fill="#fef08a" stroke="#b45309" stroke-width="1.8"/>
    </g>
  </svg>`;
}

function getSwimmingFishSvg(idx = 0) {
  const palettes = [
    ['#fb923c', '#ef4444', '#fef08a'],
    ['#38bdf8', '#2563eb', '#bae6fd'],
    ['#f472b6', '#db2777', '#fbcfe8'],
    ['#4ade80', '#059669', '#bbf7d0'],
  ];
  const [c1, c2, fin] = palettes[idx % palettes.length];
  return `
  <svg class="fish-avatar-svg" viewBox="0 0 86 58" aria-hidden="true">
    <defs>
      <linearGradient id="fg${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <polygon class="fish-tail-fin" points="18,29 2,11 6,29 2,47" fill="${fin}" stroke="${c2}" stroke-width="2"/>
    <path d="M 36 13 Q 48 2 58 14 Z" fill="${fin}" stroke="${c2}" stroke-width="2"/>
    <ellipse cx="48" cy="29" rx="30" ry="19" fill="url(#fg${idx})" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="64" cy="24" r="5" fill="#ffffff"/>
    <circle cx="65.5" cy="24" r="2.6" fill="#0f172a"/>
    <path d="M 66 34 Q 72 37 75 33" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;
}

function getGachaCapsuleSvg(idx = 0) {
  const tops = ['#ef4444', '#3b82f6', '#eab308', '#10b981'];
  const topCol = tops[idx % tops.length];
  return `
  <svg class="capsule-avatar-svg" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="27" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M 5 32 A 27 27 0 0 1 59 32 Z" fill="${topCol}"/>
    <rect x="5" y="29" width="54" height="6" rx="3" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
    <circle cx="32" cy="32" r="7" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
    <ellipse cx="22" cy="18" rx="8" ry="4.5" transform="rotate(-25 22 18)" fill="#ffffff" opacity="0.65"/>
  </svg>`;
}

function getJeweledKeySvg(idx = 0) {
  const gems = ['#ef4444', '#38bdf8', '#a855f7', '#10b981'];
  const gem = gems[idx % gems.length];
  return `
  <svg class="key-avatar-svg" viewBox="0 0 74 52" aria-hidden="true">
    <g transform="rotate(-12 37 26)">
      <rect x="28" y="22" width="38" height="8" rx="4" fill="#facc15" stroke="#b45309" stroke-width="2.2"/>
      <rect x="50" y="29" width="6" height="10" rx="2" fill="#facc15" stroke="#b45309" stroke-width="2"/>
      <rect x="59" y="29" width="6" height="13" rx="2" fill="#facc15" stroke="#b45309" stroke-width="2"/>
      <circle cx="19" cy="26" r="15" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>
      <circle cx="19" cy="26" r="7.5" fill="${gem}" stroke="#ffffff" stroke-width="2"/>
    </g>
  </svg>`;
}

function getHeroRigByMode(mode, stateHint = '') {
  switch (mode) {
    case 'dart': return getBowHeroSvg();
    case 'claw': return getClawHeroSvg();
    case 'fish': return getFishHeroSvg();
    case 'feed': return getDinoHeroSvg(stateHint || 'hungry');
    case 'chest_lock': return getChestHeroSvg(stateHint === 'unlocked');
    case 'typo_laser': return getUfoHeroSvg();
    case 'mole': return getMalletHeroSvg();
    case 'bubble_pop': return getBubbleHeroSvg();
    case 'alchemy': return getAlchemyHeroSvg();
    case 'train': return getTrainHeroSvg();
    case 'memory': return getMemoryHeroSvg();
    case 'judge': return getJudgeHeroSvg();
    default: return getClawHeroSvg();
  }
}

module.exports = {
  HERO_STAGE_META,
  getHeroRigByMode,
  getBowHeroSvg,
  getClawHeroSvg,
  getFishHeroSvg,
  getDinoHeroSvg,
  getChestHeroSvg,
  getUfoHeroSvg,
  getMalletHeroSvg,
  getBubbleHeroSvg,
  getAlchemyHeroSvg,
  getTrainHeroSvg,
  getMemoryHeroSvg,
  getJudgeHeroSvg,
  getSwimmingFishSvg,
  getGachaCapsuleSvg,
  getJeweledKeySvg,
};
