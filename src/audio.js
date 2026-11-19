// Web Audio API Synthesizer + Official Taiwan MOE Bopomofo Human Recordings (CC BY 4.0) + Taiwan Mandarin TTS Engine
const RADICAL_SPEECH_MAP = [
  ['ㄕㄣˊ ˙ㄇㄜ', '什麼'],
  [' vs ', ' 對比 '],
  ['/', '、'],
  ['扌', '提手旁'],
  ['氵', '三點水'],
  ['糹', '糸部'],
  ['宀', '寶蓋頭'],
  ['刂', '立刀旁'],
  ['忄', '豎心旁'],
  ['犭', '犬部'],
  ['辶', '走部'],
  ['攴', '攴部'],
  ['衤', '衣部'],
  ['冂', '同字框'],
  ['↔', '相反詞是'],
  ['＝', '等於'],
  ['＋', '加'],
];

// Unambiguous single-reading (單音字, non-polyphonic) Taiwan Mandarin characters
// for multi-symbol or toned Bopomofo syllables appearing in G1/G2/K2 explanations & tips.
// All 37 standalone untoned Bopomofo symbols (ㄅ–ㄩ) ALWAYS play official Taiwan MOE studio recordings!
const ZHUYIN_SYLLABLE_TO_HANZI = {
  '˙ㄇㄜ': '麼',
  '˙ㄉㄜ': '的',
  'ㄅㄚˇ': '把', 'ㄅㄚˋ': '爸', 'ㄅㄠˋ': '抱', 'ㄅㄨˊ': '拔', 'ㄅㄨˋ': '布',
  'ㄆㄠˇ': '跑', 'ㄆㄠˋ': '泡', 'ㄆㄥˊ': '朋',
  'ㄇㄚ': '媽', 'ㄇㄚˇ': '馬', 'ㄇㄠ': '貓', 'ㄇㄢˇ': '滿', 'ㄇㄣˊ': '門',
  'ㄇㄧˇ': '米', 'ㄇㄧˋ': '蜜', 'ㄇㄧㄢˊ': '綿', 'ㄇㄨˋ': '木',
  'ㄈㄟ': '飛', 'ㄈㄤˊ': '房', 'ㄈㄥ': '風', 'ㄈㄨˊ': '福',
  'ㄉㄚˋ': '大', 'ㄉㄞˋ': '帶', 'ㄉㄠˋ': '到', 'ㄉㄡ': '兜', 'ㄉㄥ': '燈',
  'ㄉㄧˋ': '地', 'ㄉㄧㄝˊ': '蝶', 'ㄉㄧㄠ': '雕', 'ㄉㄧㄠˋ': '釣',
  'ㄉㄧㄥ': '盯', 'ㄉㄧㄥˋ': '定', 'ㄉㄨ': '督', 'ㄉㄨˇ': '賭', 'ㄉㄨㄛ': '多',
  'ㄊㄢˇ': '毯', 'ㄊㄤ': '湯', 'ㄊㄤˋ': '燙', 'ㄊㄧㄝ': '貼',
  'ㄊㄧㄠˊ': '條', 'ㄊㄧㄠˋ': '跳', 'ㄊㄧㄢ': '天', 'ㄊㄧㄥ': '聽',
  'ㄊㄨ': '禿', 'ㄊㄨˋ': '兔', 'ㄊㄨㄛ': '拖', 'ㄊㄨㄢˊ': '團',
  'ㄋㄚˇ': '哪', 'ㄋㄚˋ': '那', 'ㄋㄧㄠˇ': '鳥', 'ㄋㄧㄡˊ': '牛',
  'ㄋㄨㄛˋ': '糯', 'ㄋㄨㄢˇ': '暖',
  'ㄌㄜˋ': '樂', 'ㄌㄞˊ': '來', 'ㄌㄧˇ': '裡', 'ㄌㄧㄡˊ': '流',
  'ㄌㄧㄢˊ': '連', 'ㄌㄧㄤˇ': '兩', 'ㄌㄨˋ': '路', 'ㄌㄨㄛˋ': '落',
  'ㄍㄜˊ': '格', 'ㄍㄠ': '高', 'ㄍㄡˇ': '狗', 'ㄍㄢˇ': '趕', 'ㄍㄤ': '剛',
  'ㄎㄜˇ': '渴', 'ㄎㄞ': '開', 'ㄎㄡˇ': '口',
  'ㄏㄜ': '喝', 'ㄏㄜˊ': '河', 'ㄏㄠˇ': '好', 'ㄏㄢˋ': '汗',
  'ㄏㄨˊ': '壺', 'ㄏㄨㄚ': '花', 'ㄏㄨㄚˋ': '畫', 'ㄏㄨㄛˇ': '火',
  'ㄏㄨㄛˊ': '活', 'ㄏㄨㄛˋ': '貨', 'ㄏㄨㄟˊ': '回', 'ㄏㄨㄥˊ': '紅',
  'ㄐㄧ': '雞', 'ㄐㄧㄚ': '家', 'ㄐㄧㄚˇ': '甲', 'ㄐㄧㄚˋ': '嫁',
  'ㄐㄧㄠ': '交', 'ㄐㄧㄠˇ': '絞', 'ㄐㄧㄢ': '尖', 'ㄐㄧㄥˋ': '靜',
  'ㄐㄩㄝˊ': '決',
  'ㄑㄧ': '七', 'ㄑㄧˇ': '起', 'ㄑㄧㄚˋ': '恰', 'ㄑㄧㄠ': '敲',
  'ㄑㄧㄠˇ': '巧', 'ㄑㄧㄠˋ': '俏', 'ㄑㄧㄡˊ': '球', 'ㄑㄧㄢˊ': '前',
  'ㄑㄧㄤˋ': '嗆', 'ㄑㄧㄥˇ': '請',
  'ㄒㄧ': '西', 'ㄒㄧㄠ': '消', 'ㄒㄧㄠˇ': '小', 'ㄒㄧㄠˋ': '笑',
  'ㄒㄧㄢˋ': '線', 'ㄒㄧㄤˋ': '象', 'ㄒㄧㄣ': '心', 'ㄒㄧㄥ': '星', 'ㄒㄧㄥˋ': '姓',
  'ㄒㄧㄚˋ': '下',
  'ㄓㄠ': '招', 'ㄓㄡ': '州', 'ㄓㄢ': '沾', 'ㄓㄤ': '張', 'ㄓㄤˋ': '丈',
  'ㄓㄥˋ': '正', 'ㄓㄨ': '珠', 'ㄓㄨˊ': '竹', 'ㄓㄨˇ': '主', 'ㄓㄨㄤˋ': '壯',
  'ㄔㄜ': '車', 'ㄔㄤ': '昌', 'ㄔㄤˇ': '場', 'ㄔㄤˋ': '唱',
  'ㄔㄨㄟ': '吹', 'ㄔㄨㄢˊ': '船', 'ㄔㄨㄣ': '春', 'ㄔㄨㄤˊ': '床', 'ㄔㄨㄤˋ': '創',
  'ㄕˊ': '十', 'ㄕˋ': '是', 'ㄕㄜˊ': '蛇', 'ㄕㄡˇ': '手', 'ㄕㄡˋ': '受',
  'ㄕㄢ': '山', 'ㄕㄣ': '深', 'ㄕㄣˊ': '神', 'ㄕㄤˋ': '上', 'ㄕㄥ': '生',
  'ㄕㄨˋ': '樹', 'ㄕㄨㄛˋ': '碩', 'ㄕㄨㄟˇ': '水',
  'ㄖˋ': '日', 'ㄖㄡˋ': '肉', 'ㄖㄣˊ': '人', 'ㄖㄨㄛˋ': '弱', 'ㄖㄨㄥˊ': '容',
  'ㄗㄠˇ': '早', 'ㄗㄣˇ': '怎', 'ㄗㄤ': '髒',
  'ㄘㄞˊ': '才', 'ㄘㄞˇ': '彩', 'ㄘㄠˇ': '草',
  'ㄙˋ': '四', 'ㄙㄡˋ': '嗽', 'ㄙㄢ': '三', 'ㄙㄨㄟˊ': '隨',
  'ㄜˊ': '鵝', 'ㄜˋ': '餓', 'ㄞˋ': '愛', 'ㄦˇ': '耳', 'ㄦˋ': '二',
  'ㄧˊ': '移', 'ㄧˇ': '椅', 'ㄧˋ': '意', 'ㄧㄚ': '鴨',
  'ㄧㄠ': '腰', 'ㄧㄠˊ': '搖', 'ㄧㄠˇ': '咬', 'ㄧㄠˋ': '耀',
  'ㄧㄡ': '優', 'ㄧㄡˊ': '郵', 'ㄧㄡˇ': '友', 'ㄧㄣ': '音',
  'ㄧㄤˊ': '羊', 'ㄧㄥˇ': '影',
  'ㄨˊ': '吳', 'ㄨˇ': '五', 'ㄨˋ': '霧', 'ㄨㄚ': '蛙',
  'ㄨㄟ': '威', 'ㄨㄟˊ': '圍', 'ㄨㄟˇ': '尾', 'ㄨㄟˋ': '位',
  'ㄨㄢˊ': '完', 'ㄨㄤˋ': '忘',
  'ㄩˊ': '魚', 'ㄩˇ': '雨', 'ㄩㄝˋ': '月', 'ㄩㄥˇ': '泳',
};

const EMOJI_STRIP_RE = /[🫧🔍🧩🚂⚡🐉🏆✨💎⭐🎯🔊👆⭕❌□🐛💮🚃🎉💡🎁🔥🧪🔨👑🏡🐰🐶🐥⛰️🌿🌙🌳👨🏃👩🚪🐴🌬️🐘🐮🐦👋😄🦒👄🔓🌸🦆🦢❤️🦋🐱🌤️🧍🐑👂⬆️⬇️🌧️💖🐜🔟1️⃣2️⃣3️⃣4️⃣5️⃣7️⃣🕹️🎣🦖🃏🗝️🛸🍩🍔🍓🍕🐠🐡🐟🐬🔮🧰🦾🪝💦😋🏹🚀⏭️💥😵🎊🗺️🎰🪙]/gu;
const ZHUYIN_TOKEN_RE = /(?:˙)?[\u3105-\u3129]+(?:[ˊˇˋ˙])?/g;
const PURE_PUNCT_RE = /^[\s，。！？、；：「」『』（）()—…,.!?;:'"]+$/;

function base64DataUriToArrayBuffer(uri) {
  const commaIdx = uri.indexOf(',');
  const b64 = commaIdx >= 0 ? uri.slice(commaIdx + 1) : uri;
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes.buffer;
}

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmOn = false;
    this.autoRead = true;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.voices = [];
    this.moeBuffers = new Map();
    this._decodingPromises = new Map();
    this._activeMoeSources = new Set();
    this._activeHtmlAudios = new Set();
    this._speakSeqId = 0;
    this._warmedUpMoe = false;
    this.playedMoeSymbols = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  ensureCtx() {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.ctx && !this._warmedUpMoe) {
        this._warmedUpMoe = true;
        this.warmupMoeAudio();
      }
      return this.ctx;
    } catch (_) {
      return null;
    }
  }

  decodeMoeSymbol(sym) {
    if (this.moeBuffers.has(sym)) {
      return Promise.resolve(this.moeBuffers.get(sym));
    }
    if (this._decodingPromises.has(sym)) {
      return this._decodingPromises.get(sym);
    }
    const map = typeof window !== 'undefined' && window.__ZHUYIN_AUDIO__;
    const uri = map && map[sym];
    const ctx = this.ensureCtx();
    if (!uri || !ctx) return Promise.resolve(null);

    const p = new Promise((resolve) => {
      try {
        const ab = base64DataUriToArrayBuffer(uri);
        let settled = false;
        const finish = (buf) => {
          if (settled) return;
          settled = true;
          if (buf) this.moeBuffers.set(sym, buf);
          this._decodingPromises.delete(sym);
          resolve(buf || null);
        };
        const maybePromise = ctx.decodeAudioData(
          ab.slice(0),
          (buf) => finish(buf),
          () => finish(null)
        );
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then((buf) => finish(buf)).catch(() => finish(null));
        }
      } catch (_) {
        this._decodingPromises.delete(sym);
        resolve(null);
      }
    });
    this._decodingPromises.set(sym, p);
    return p;
  }

  warmupMoeAudio() {
    if (typeof window === 'undefined' || !window.__ZHUYIN_AUDIO__) return;
    const keys = Object.keys(window.__ZHUYIN_AUDIO__);
    let idx = 0;
    const step = () => {
      if (idx >= keys.length) return;
      const batch = keys.slice(idx, idx + 6);
      idx += 6;
      Promise.all(batch.map((k) => this.decodeMoeSymbol(k))).finally(() => {
        if (idx < keys.length) setTimeout(step, 18);
      });
    };
    setTimeout(step, 10);
  }

  async playZhuyinSymbol(sym, gainVal = 1.05) {
    if (this.muted || !sym) return;
    const map = typeof window !== 'undefined' && window.__ZHUYIN_AUDIO__;
    const uri = map && map[sym];
    if (!uri) return;

    this.playedMoeSymbols.push({ sym, t: Date.now() });
    if (this.playedMoeSymbols.length > 120) {
      this.playedMoeSymbols.splice(0, this.playedMoeSymbols.length - 120);
    }

    const buf = await this.decodeMoeSymbol(sym);
    const ctx = this.ensureCtx();
    if (buf && ctx) {
      await new Promise((resolve) => {
        let done = false;
        let timer = null;
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        src.buffer = buf;
        gain.gain.value = gainVal;
        src.connect(gain);
        gain.connect(ctx.destination);
        this._activeMoeSources.add(src);

        const finish = () => {
          if (done) return;
          done = true;
          if (timer) clearTimeout(timer);
          this._activeMoeSources.delete(src);
          resolve();
        };
        src.onended = finish;
        timer = setTimeout(finish, Math.ceil(buf.duration * 1000) + 180);
        try {
          src.start(0);
        } catch (_) {
          finish();
        }
      });
      return;
    }

    // Fallback to HTML5 Audio if Web Audio decoding is unavailable
    if (typeof Audio !== 'undefined') {
      await new Promise((resolve) => {
        let done = false;
        const a = new Audio(uri);
        a.volume = 1.0;
        this._activeHtmlAudios.add(a);
        const finish = () => {
          if (done) return;
          done = true;
          this._activeHtmlAudios.delete(a);
          resolve();
        };
        a.onended = finish;
        a.onerror = finish;
        setTimeout(finish, 950);
        a.play().catch(finish);
      });
    }
  }

  tone(freq, dur = 0.12, type = 'sine', vol = 0.16, delay = 0, slideTo = null) {
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + dur);
      }
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(Math.max(0.002, vol), now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    } catch (_) {}
  }

  playTap() {
    this.tone(520, 0.07, 'triangle', 0.12, 0, 680);
  }

  playPop() {
    this.tone(420, 0.09, 'sine', 0.16, 0, 880);
  }

  playChest() {
    const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98];
    notes.forEach((n, i) => this.tone(n, 0.16, 'triangle', 0.2, i * 0.05));
  }

  playCensorBeep() {
    this.tone(880, 0.09, 'sine', 0.14, 0, 1046);
  }

  playDartThrow() {
    this.tone(920, 0.11, 'sine', 0.14, 0, 280);
    this.tone(180, 0.09, 'triangle', 0.22, 0.14, 75);
    this.tone(1318.5, 0.12, 'sine', 0.15, 0.18, 1568);
  }

  playHammerBonk(hit = true) {
    this.tone(420, 0.08, 'triangle', 0.22, 0, 130);
    this.tone(240, 0.12, 'sine', 0.2, 0.05, 85);
    if (hit) {
      this.tone(784, 0.1, 'triangle', 0.16, 0.09, 1046);
    }
  }

  playMolePop() {
    this.tone(330, 0.08, 'sine', 0.12, 0, 660);
  }

  playClawGrab() {
    this.tone(240, 0.12, 'triangle', 0.13, 0, 340);
    this.tone(460, 0.12, 'sine', 0.14, 0.11, 250);
    this.tone(659.25, 0.14, 'triangle', 0.16, 0.22, 987.77);
  }

  playFishSplash() {
    this.tone(720, 0.09, 'sine', 0.13, 0, 320);
    [290, 440, 660, 880].forEach((n, i) => this.tone(n, 0.075, 'sine', 0.14, 0.08 + i * 0.04, n * 1.35));
  }

  playDinoChomp(isYum = true) {
    this.tone(360, 0.08, 'sine', 0.13, 0, 640);
    this.tone(190, 0.08, 'triangle', 0.22, 0.11, 95);
    this.tone(210, 0.08, 'triangle', 0.2, 0.19, 105);
    if (isYum) {
      this.tone(587.33, 0.11, 'sine', 0.16, 0.25, 880);
    }
  }

  playCardFlip() {
    this.tone(460, 0.065, 'triangle', 0.12, 0, 760);
  }

  playPairMatch() {
    [587.33, 783.99, 1174.66].forEach((n, i) => this.tone(n, 0.12, 'triangle', 0.16, i * 0.05));
  }

  playKeyUnlock() {
    this.tone(660, 0.08, 'triangle', 0.15, 0, 880);
    this.tone(523.25, 0.09, 'sine', 0.16, 0.09, 1046.5);
    this.tone(1318.5, 0.16, 'triangle', 0.18, 0.17);
  }

  playUfoLaser() {
    this.tone(1180, 0.12, 'sawtooth', 0.11, 0, 280);
    this.tone(880, 0.11, 'sine', 0.15, 0.12, 1480);
  }

  playBowTwang() {
    this.tone(195, 0.09, 'triangle', 0.19, 0, 340);
    this.tone(680, 0.14, 'sine', 0.13, 0.05, 1380);
  }

  playCauldronBubble() {
    [320, 480, 640, 880].forEach((n, i) => this.tone(n, 0.08, 'sine', 0.14, i * 0.045, n * 1.3));
  }

  playThunderStrike() {
    this.tone(920, 0.09, 'sawtooth', 0.12, 0, 180);
    this.tone(160, 0.22, 'triangle', 0.22, 0.06, 65);
    this.tone(1046.5, 0.15, 'triangle', 0.14, 0.12);
  }

  playStageReady() {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      this.tone(n, i === 3 ? 0.2 : 0.085, 'triangle', 0.16, i * 0.065);
    });
  }

  playSparkleBurst() {
    [659.25, 783.99, 987.77, 1318.5].forEach((n, i) => {
      this.tone(n, 0.1, 'sine', 0.13, i * 0.045);
    });
  }

  playLessonSFX(lessonId) {
    switch (lessonId) {
      case 'k2_L1':
        [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, 0.16, 'sine', 0.16, i * 0.055));
        break;
      case 'k2_L2':
        this.tone(320, 0.11, 'sine', 0.17, 0, 740);
        this.tone(987.77, 0.09, 'triangle', 0.15, 0.12, 1318.5);
        break;
      case 'k2_L3':
        this.tone(587.33, 0.1, 'triangle', 0.17, 0, 783.99);
        this.tone(880, 0.14, 'sine', 0.16, 0.09, 1174.66);
        break;
      case 'k2_L4':
        [1046.5, 1318.5, 1567.98].forEach((n, i) => this.tone(n, 0.075, 'sine', 0.15, i * 0.065, n * 1.18));
        break;
      case 'k2_L5':
        [523.25, 587.33, 783.99, 1046.5, 1318.5].forEach((n, i) => this.tone(n, 0.13, 'triangle', 0.15, i * 0.045));
        break;
      case 'k2_L6':
        [523.25, 587.33, 659.25, 698.46, 783.99].forEach((n, i) => this.tone(n, 0.1, 'triangle', 0.17, i * 0.055));
        break;
      case 'k2_L7':
        [659.25, 987.77, 1318.5, 1567.98].forEach((n, i) => this.tone(n, 0.18, 'sine', 0.14, i * 0.06));
        break;
      case 'k2_L8':
        [523.25, 659.25, 783.99, 1046.5, 1567.98].forEach((n, i) => this.tone(n, 0.15, 'triangle', 0.17, i * 0.05));
        break;
      case 'g1_L1':
        this.tone(320, 0.18, 'sine', 0.14, 0, 520);
        this.tone(880, 0.22, 'triangle', 0.16, 0.08);
        this.tone(1174.66, 0.26, 'sine', 0.14, 0.16);
        break;
      case 'g1_L2':
        [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, 0.12, 'triangle', 0.14, i * 0.04));
        break;
      case 'g1_L3':
        [440, 587, 784, 1046].forEach((n, i) => this.tone(n, 0.08, 'sine', 0.15, i * 0.055, n * 1.45));
        break;
      case 'g1_L4':
        this.tone(659.25, 0.16, 'triangle', 0.18, 0);
        this.tone(880, 0.18, 'sine', 0.16, 0.08);
        this.tone(659.25, 0.16, 'sine', 0.09, 0.28);
        this.tone(880, 0.18, 'sine', 0.08, 0.36);
        break;
      case 'g1_L5':
        this.tone(520, 0.12, 'sine', 0.15, 0, 1180);
        this.tone(1180, 0.12, 'sine', 0.14, 0.11, 680);
        this.tone(960, 0.14, 'triangle', 0.14, 0.21, 1480);
        break;
      case 'g1_L6':
        [360, 480, 640].forEach((n, i) => this.tone(n, 0.09, 'sine', 0.16, i * 0.07, n * 1.6));
        break;
      case 'g1_L7':
        [587.33, 659.25, 783.99, 880, 1174.66].forEach((n, i) => this.tone(n, 0.14, 'triangle', 0.17, i * 0.05));
        break;
      case 'g2_L7':
        this.tone(260, 0.13, 'sine', 0.18, 0, 680);
        this.tone(320, 0.14, 'sine', 0.16, 0.13, 820);
        break;
      case 'g2_L8':
        [783.99, 987.77, 1174.66, 1567.98].forEach((n, i) => this.tone(n, 0.14, 'sine', 0.14, i * 0.05));
        break;
      case 'g2_L9':
        this.tone(523.25, 0.11, 'sawtooth', 0.1, 0);
        this.tone(659.25, 0.11, 'sawtooth', 0.1, 0.09);
        this.tone(783.99, 0.24, 'triangle', 0.18, 0.18);
        break;
      case 'g2_L10':
        this.tone(587.33, 0.1, 'triangle', 0.16, 0);
        this.tone(880, 0.16, 'triangle', 0.16, 0.09);
        break;
      case 'g2_L11':
        [523.25, 659.25, 783.99, 987.77].forEach((n, i) => this.tone(n, 0.22, 'sine', 0.13, i * 0.04));
        break;
      case 'g2_L12':
        [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((n, i) => this.tone(n, 0.11, 'sine', 0.13, i * 0.038));
        break;
      default:
        this.playSparkleBurst();
    }
  }

  playCorrect(combo = 1) {
    const semitone = Math.min(combo - 1, 8);
    const mult = Math.pow(2, semitone / 12);
    this.tone(523.25 * mult, 0.11, 'triangle', 0.18, 0);
    this.tone(659.25 * mult, 0.11, 'triangle', 0.18, 0.07);
    this.tone(783.99 * mult, 0.22, 'sine', 0.22, 0.14);
    if (combo >= 3) {
      this.tone(1046.5 * mult, 0.28, 'triangle', 0.18, 0.21);
    }
  }

  playFever() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => this.tone(n, 0.14, 'triangle', 0.18, i * 0.055));
  }

  playCannon() {
    this.tone(740, 0.12, 'sawtooth', 0.12, 0, 220);
    this.tone(180, 0.28, 'triangle', 0.24, 0.1, 55);
    this.tone(880, 0.2, 'sine', 0.15, 0.14, 1320);
  }

  playWrong() {
    this.tone(310, 0.14, 'sine', 0.14, 0, 250);
    this.tone(250, 0.18, 'triangle', 0.12, 0.11, 210);
  }

  playHook() {
    this.tone(440, 0.08, 'triangle', 0.15, 0, 587);
  }

  playTrainHorn() {
    this.tone(587.33, 0.22, 'triangle', 0.16, 0);
    this.tone(739.99, 0.22, 'triangle', 0.14, 0);
    this.tone(587.33, 0.32, 'triangle', 0.16, 0.26);
    this.tone(739.99, 0.32, 'triangle', 0.14, 0.26);
  }

  playGachaSpin() {
    for (let i = 0; i < 8; i++) {
      this.tone(300 + i * 55, 0.06, 'triangle', 0.14, i * 0.075);
    }
  }

  playGachaReveal() {
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    chord.forEach((f, i) => this.tone(f, 0.32, 'triangle', 0.16, i * 0.06));
  }

  playVictory() {
    const seq = [
      [523.25, 0, 0.13],
      [659.25, 0.13, 0.13],
      [783.99, 0.26, 0.13],
      [1046.5, 0.39, 0.38],
      [783.99, 0.45, 0.12],
      [1046.5, 0.58, 0.45],
    ];
    seq.forEach(([f, d, l]) => this.tone(f, l, 'triangle', 0.2, d));
  }

  toggleBgm(forceState) {
    this.bgmOn = typeof forceState === 'boolean' ? forceState : !this.bgmOn;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmOn && !this.muted) {
      const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33];
      this.bgmTimer = setInterval(() => {
        if (this.muted || !this.bgmOn) return;
        const note = melody[this.bgmStep % melody.length];
        this.tone(note, 0.16, 'sine', 0.045, 0);
        this.bgmStep++;
      }, 360);
    }
    return this.bgmOn;
  }

  hasRealTtsVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    const list = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    return Boolean(list && list.length > 0);
  }

  _setSpeaking(flag) {
    if (this.isSpeaking === flag) return;
    this.isSpeaking = flag;
    if (typeof this.onSpeakStateChange === 'function') {
      try {
        this.onSpeakStateChange(flag);
      } catch (_) {}
    }
  }

  stopSpeak() {
    this._speakSeqId++;
    for (const src of this._activeMoeSources) {
      try {
        src.stop(0);
      } catch (_) {}
    }
    this._activeMoeSources.clear();
    for (const a of this._activeHtmlAudios) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (_) {}
    }
    this._activeHtmlAudios.clear();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    this._setSpeaking(false);
  }

  tokenizeForSpeech(rawText) {
    if (!rawText) return [];
    let clean = String(rawText);
    for (const [sym, spoken] of RADICAL_SPEECH_MAP) {
      clean = clean.split(sym).join(spoken);
    }
    // Strip parenthesized Zhuyin ruby annotations like （ㄔㄨㄢˊ） so annotated Hanzi aren't spoken twice
    clean = clean.replace(/[（(][\u3105-\u3129ˊˇˋ˙\s/]+[)）]/g, '');
    clean = clean.replace(EMOJI_STRIP_RE, ' ').replace(/＿+/g, '空格');

    const segments = [];
    let ttsBuf = '';
    let lastIndex = 0;

    const flushTts = (trailingText) => {
      const combined = (ttsBuf + (trailingText || '')).replace(/\s+/g, ' ').trim();
      ttsBuf = '';
      if (!combined) return;
      const leadMatch = combined.match(/^[，。！？、；：,.!?;:\s]+/);
      if (leadMatch && segments.length && segments[segments.length - 1].type === 'moe') {
        const lp = leadMatch[0];
        if (/[！!。？?]/.test(lp)) segments[segments.length - 1].pauseMs = 150;
        else if (/[,，]/.test(lp)) segments[segments.length - 1].pauseMs = 115;
        else if (/、/.test(lp)) segments[segments.length - 1].pauseMs = 70;
      }
      const stripped = combined.replace(/^[，。！？、；：,.!?;:\s]+/, '').trim();
      if (!stripped || PURE_PUNCT_RE.test(stripped)) return;
      segments.push({ type: 'tts', text: stripped });
    };

    ZHUYIN_TOKEN_RE.lastIndex = 0;
    let match;
    while ((match = ZHUYIN_TOKEN_RE.exec(clean)) !== null) {
      const before = clean.slice(lastIndex, match.index);
      lastIndex = match.index + match[0].length;
      const token = match[0];

      if (/^[\u3105-\u3129]$/.test(token)) {
        flushTts(before);
        segments.push({ type: 'moe', sym: token, pauseMs: 85 });
      } else if (ZHUYIN_SYLLABLE_TO_HANZI[token]) {
        ttsBuf += before + ZHUYIN_SYLLABLE_TO_HANZI[token];
      } else {
        flushTts(before);
        const syms = Array.from(token.replace(/[ˊˇˋ˙]/g, ''));
        syms.forEach((s) => {
          segments.push({ type: 'moe', sym: s, pauseMs: 70 });
        });
      }
    }

    flushTts(clean.slice(lastIndex));
    return segments;
  }

  _speakUtterance(text, rate, seqId) {
    if (this.muted || !text || seqId !== this._speakSeqId) return Promise.resolve();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve();

    return new Promise((resolve) => {
      let done = false;
      let pollId = null;
      let maxTimer = null;
      const finish = () => {
        if (done) return;
        done = true;
        if (pollId) clearInterval(pollId);
        if (maxTimer) clearTimeout(maxTimer);
        resolve();
      };

      try {
        const u = new SpeechSynthesisUtterance(text);
        const voices = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
        const twVoice =
          voices.find((v) => v.lang === 'zh-TW' && v.name.includes('Google')) ||
          voices.find((v) => v.lang === 'zh-TW') ||
          voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('zh'));
        if (twVoice) u.voice = twVoice;
        u.lang = 'zh-TW';
        u.rate = rate;
        u.pitch = 1.05;
        u.onend = finish;
        u.onerror = finish;

        window.speechSynthesis.speak(u);

        // Safety monitor: if OS has no TTS voices, resolve fast; otherwise allow full speech duration without cutting off!
        if (!voices || voices.length === 0) {
          maxTimer = setTimeout(finish, 180);
        } else {
          const startedAt = Date.now();
          pollId = setInterval(() => {
            if (seqId !== this._speakSeqId) {
              finish();
              return;
            }
            if (Date.now() - startedAt > 360 && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
              finish();
            }
          }, 120);
          maxTimer = setTimeout(finish, Math.min(18000, Math.max(2200, text.length * 380)));
        }
      } catch (_) {
        finish();
      }
    });
  }

  speak(text, rate = 0.95) {
    if (this.muted || !text) {
      this._setSpeaking(false);
      return Promise.resolve({ completed: true });
    }
    this.stopSpeak();
    const seqId = this._speakSeqId;
    const segments = this.tokenizeForSpeech(text);
    if (!segments.length) {
      this._setSpeaking(false);
      return Promise.resolve({ completed: true });
    }

    this._setSpeaking(true);
    return (async () => {
      try {
        for (let i = 0; i < segments.length; i++) {
          if (this.muted || seqId !== this._speakSeqId) {
            return { completed: false };
          }
          const seg = segments[i];
          if (seg.type === 'moe') {
            await this.playZhuyinSymbol(seg.sym);
            if (i + 1 < segments.length && seqId === this._speakSeqId && !this.muted) {
              const waitMs = Math.max(45, seg.pauseMs || 85);
              await new Promise((r) => setTimeout(r, waitMs));
            }
          } else if (seg.type === 'tts') {
            await this._speakUtterance(seg.text, rate, seqId);
          }
        }
        return { completed: seqId === this._speakSeqId };
      } finally {
        if (seqId === this._speakSeqId) {
          this._setSpeaking(false);
        }
      }
    })();
  }
}

module.exports = { SoundEngine, ZHUYIN_SYLLABLE_TO_HANZI };
