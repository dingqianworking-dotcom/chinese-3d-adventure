const fs = require('fs');
const path = require('path');

// Zero-dependency deterministic single-file bundler for CommonJS modules
const modules = {
  './audio': fs.readFileSync(path.join(__dirname, 'src/audio.js'), 'utf8'),
  './fx': fs.readFileSync(path.join(__dirname, 'src/fx.js'), 'utf8'),
  './zhuyin_helper': fs.readFileSync(path.join(__dirname, 'src/zhuyin_helper.js'), 'utf8'),
  './webgl3d': fs.readFileSync(path.join(__dirname, 'src/webgl3d.js'), 'utf8'),
  './curriculum_k2': fs.readFileSync(path.join(__dirname, 'src/curriculum_k2.js'), 'utf8'),
  './curriculum_g1': fs.readFileSync(path.join(__dirname, 'src/curriculum_g1.js'), 'utf8'),
  './curriculum_g2': fs.readFileSync(path.join(__dirname, 'src/curriculum_g2.js'), 'utf8'),
  './app': fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8'),
};

function toDataUri(relPath, mime = 'image/jpeg') {
  const full = path.join(__dirname, relPath);
  if (!fs.existsSync(full)) return '';
  return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`;
}

const skyUri = toDataUri('src/assets/sky_kingdom.jpg');
const meadowUri = toDataUri('src/assets/meadow_arena.jpg');
const badgeUri = toDataUri('src/assets/hero_badge.jpg');
const bossUri = toDataUri('src/assets/boss_dragon.jpg');
const moleUri = toDataUri('src/assets/mole_pal.jpg');

const lessonIds = [
  'k2_L1', 'k2_L2', 'k2_L3', 'k2_L4', 'k2_L5', 'k2_L6', 'k2_L7', 'k2_L8',
  'g1_L1', 'g1_L2', 'g1_L3', 'g1_L4', 'g1_L5', 'g1_L6', 'g1_L7',
  'g2_L7', 'g2_L8', 'g2_L9', 'g2_L10', 'g2_L11', 'g2_L12',
];
const lessonsArt = {};
for (const lid of lessonIds) {
  lessonsArt[lid] = toDataUri(`src/assets/lessons/${lid}.webp`, 'image/webp');
}

// Official Taiwan Ministry of Education《國語注音符號手冊-開放部件》37 studio human recordings (CC BY 4.0)
const zhuyinAudio = {};
for (let cp = 0x3105; cp <= 0x3129; cp++) {
  const hex = cp.toString(16);
  const sym = String.fromCodePoint(cp);
  const uri = toDataUri(`src/assets/zhuyin_moe/${hex}.mp3`, 'audio/mpeg');
  if (!uri) {
    throw new Error(`Missing official MOE audio file for ${sym} (${hex}.mp3)`);
  }
  zhuyinAudio[sym] = uri;
}

const artCss = `:root {
  --art-sky-kingdom: url("${skyUri}");
  --art-meadow-arena: url("${meadowUri}");
  --art-hero-badge: url("${badgeUri}");
}\n`;

const css = artCss + fs.readFileSync(path.join(__dirname, 'src/styles.css'), 'utf8');
const tpl = fs.readFileSync(path.join(__dirname, 'src/template.html'), 'utf8');

let jsBundle = `(function() {\n  const __mods = {};\n  const __cache = {};\n  function require(id) {\n    if (__cache[id]) return __cache[id].exports;\n    const m = { exports: {} };\n    __cache[id] = m;\n    __mods[id](require, m, m.exports);\n    return m.exports;\n  }\n`;

for (const [id, code] of Object.entries(modules)) {
  jsBundle += `  __mods[${JSON.stringify(id)}] = function(require, module, exports) {\n${code}\n  };\n`;
}
jsBundle += `  window.__ZHUYIN_AUDIO__ = ${JSON.stringify(zhuyinAudio)};\n`;
jsBundle += `  window.__ART__ = {
    sky: ${JSON.stringify(skyUri)},
    meadow: ${JSON.stringify(meadowUri)},
    badge: ${JSON.stringify(badgeUri)},
    boss: ${JSON.stringify(bossUri)},
    mole: ${JSON.stringify(moleUri)},
    lessons: ${JSON.stringify(lessonsArt)}
  };\n`;
jsBundle += `  require('./app');\n})();\n`;

const outHtml = tpl
  .replace('/*__INLINE_CSS__*/', () => css)
  .replace('/*__INLINE_JS__*/', () => jsBundle);

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
const outPath = path.join(__dirname, 'dist/index.html');
fs.writeFileSync(outPath, outHtml, 'utf8');
console.log('Built:', outPath, 'Bytes:', Buffer.byteLength(outHtml), 'MOE Symbols:', Object.keys(zhuyinAudio).length);
