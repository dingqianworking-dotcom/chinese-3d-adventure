// Web Audio API Synthesizer + Taiwan Mandarin TTS Helper (Upgraded after Kid Playtest)
const RADICAL_SPEECH_MAP = [
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

const BOPOMOFO_SPEECH_MAP = {
  'ㄅ': '玻', 'ㄆ': '坡', 'ㄇ': '摸', 'ㄈ': '佛',
  'ㄉ': '得', 'ㄊ': '特', 'ㄋ': '訥', 'ㄌ': '勒',
  'ㄍ': '哥', 'ㄎ': '科', 'ㄏ': '喝',
  'ㄐ': '基', 'ㄑ': '欺', 'ㄒ': '希',
  'ㄓ': '知', 'ㄔ': '蚩', 'ㄕ': '詩', 'ㄖ': '日',
  'ㄗ': '資', 'ㄘ': '雌', 'ㄙ': '思',
  'ㄧ': '衣', 'ㄨ': '屋', 'ㄩ': '迂',
  'ㄚ': '啊', 'ㄛ': '喔', 'ㄜ': '鵝', 'ㄝ': '耶',
  'ㄞ': '哀', 'ㄟ': '欸', 'ㄠ': '熬', 'ㄡ': '歐',
  'ㄢ': '安', 'ㄣ': '恩', 'ㄤ': '昂', 'ㄥ': '亨',
  'ㄦ': '兒',
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmOn = false;
    this.autoRead = true;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.voices = [];
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
      return this.ctx;
    } catch (_) {
      return null;
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

  playSparkleBurst() {
    [659.25, 783.99, 987.77, 1318.5].forEach((n, i) => {
      this.tone(n, 0.1, 'sine', 0.13, i * 0.045);
    });
  }

  playLessonSFX(lessonId) {
    switch (lessonId) {
      case 'k2_L1': // 親親一家人: Warm music-box heart chord
        [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, 0.16, 'sine', 0.16, i * 0.055));
        break;
      case 'k2_L2': // 快樂動物村: Playful bunny hop + bird chirp
        this.tone(320, 0.11, 'sine', 0.17, 0, 740);
        this.tone(987.77, 0.09, 'triangle', 0.15, 0.12, 1318.5);
        break;
      case 'k2_L3': // 汪汪喵喵派對: Cute puppy-kitty bell bounce
        this.tone(587.33, 0.1, 'triangle', 0.17, 0, 783.99);
        this.tone(880, 0.14, 'sine', 0.16, 0.09, 1174.66);
        break;
      case 'k2_L4': // 小雞吃西瓜: Chick peep-peep!
        [1046.5, 1318.5, 1567.98].forEach((n, i) => this.tone(n, 0.075, 'sine', 0.15, i * 0.065, n * 1.18));
        break;
      case 'k2_L5': // 太陽與山水: Golden sunbeam & stream chime
        [523.25, 587.33, 783.99, 1046.5, 1318.5].forEach((n, i) => this.tone(n, 0.13, 'triangle', 0.15, i * 0.045));
        break;
      case 'k2_L6': // 森林數一數: 1-2-3-4 Toy Xylophone scale!
        [523.25, 587.33, 659.25, 698.46, 783.99].forEach((n, i) => this.tone(n, 0.1, 'triangle', 0.17, i * 0.055));
        break;
      case 'k2_L7': // 月亮綿羊島: Dreamy celesta lullaby twinkle
        [659.25, 987.77, 1318.5, 1567.98].forEach((n, i) => this.tone(n, 0.18, 'sine', 0.14, i * 0.06));
        break;
      case 'k2_L8': // 象形識字王: Royal xylophone fanfare
        [523.25, 659.25, 783.99, 1046.5, 1567.98].forEach((n, i) => this.tone(n, 0.15, 'triangle', 0.17, i * 0.05));
        break;
      case 'g1_L1': // 小船: Ocean wave + boat bell
        this.tone(320, 0.18, 'sine', 0.14, 0, 520);
        this.tone(880, 0.22, 'triangle', 0.16, 0.08);
        this.tone(1174.66, 0.26, 'sine', 0.14, 0.16);
        break;
      case 'g1_L2': // 印手印: Rainbow harp glissando
        [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, 0.12, 'triangle', 0.14, i * 0.04));
        break;
      case 'g1_L3': // 吹泡泡: Rapid bubbly pops
        [440, 587, 784, 1046].forEach((n, i) => this.tone(n, 0.08, 'sine', 0.15, i * 0.055, n * 1.45));
        break;
      case 'g1_L4': // 你好: Mountain echo chime (loud -> soft -> softer)
        this.tone(659.25, 0.16, 'triangle', 0.18, 0);
        this.tone(880, 0.18, 'sine', 0.16, 0.08);
        this.tone(659.25, 0.16, 'sine', 0.09, 0.28);
        this.tone(880, 0.18, 'sine', 0.08, 0.36);
        break;
      case 'g1_L5': // 外星人: Cute UFO sci-fi warble
        this.tone(520, 0.12, 'sine', 0.15, 0, 1180);
        this.tone(1180, 0.12, 'sine', 0.14, 0.11, 680);
        this.tone(960, 0.14, 'triangle', 0.14, 0.21, 1480);
        break;
      case 'g1_L6': // 小金魚: Underwater bloop-bloop
        [360, 480, 640].forEach((n, i) => this.tone(n, 0.09, 'sine', 0.16, i * 0.07, n * 1.6));
        break;
      case 'g1_L7': // 紅紅的春: Festive pentatonic New Year chime
        [587.33, 659.25, 783.99, 880, 1174.66].forEach((n, i) => this.tone(n, 0.14, 'triangle', 0.17, i * 0.05));
        break;
      case 'g2_L7': // 兔子: Boing-boing hop
        this.tone(260, 0.13, 'sine', 0.18, 0, 680);
        this.tone(320, 0.14, 'sine', 0.16, 0.13, 820);
        break;
      case 'g2_L8': // 角和腳: Shimmering golden antlers
        [783.99, 987.77, 1174.66, 1567.98].forEach((n, i) => this.tone(n, 0.14, 'sine', 0.14, i * 0.05));
        break;
      case 'g2_L9': // 赤腳國王: Royal fanfare trumpet
        this.tone(523.25, 0.11, 'sawtooth', 0.1, 0);
        this.tone(659.25, 0.11, 'sawtooth', 0.1, 0.09);
        this.tone(783.99, 0.24, 'triangle', 0.18, 0.18);
        break;
      case 'g2_L10': // 去農場玩: Happy farm cowbell/chime
        this.tone(587.33, 0.1, 'triangle', 0.16, 0);
        this.tone(880, 0.16, 'triangle', 0.16, 0.09);
        break;
      case 'g2_L11': // 幸福湯圓: Warm cozy chord
        [523.25, 659.25, 783.99, 987.77].forEach((n, i) => this.tone(n, 0.22, 'sine', 0.13, i * 0.04));
        break;
      case 'g2_L12': // 到野外上課: Rainbow waterfall arpeggio
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

  stopSpeak() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text, rate = 0.95) {
    if (this.muted || !text) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      let clean = String(text);
      for (const [sym, spoken] of RADICAL_SPEECH_MAP) {
        clean = clean.split(sym).join(spoken);
      }
      // First remove parenthesized Zhuyin annotations like （ㄔㄨㄢˊ） so words aren't read twice
      clean = clean.replace(/[（(][\u3105-\u3129ˊˇˋ˙\s/]+[)）]/g, '');
      // Convert any remaining standalone Bopomofo symbols (e.g. K2 ㄅㄆㄇ cards/options) to Taiwan Mandarin phonetic names!
      clean = clean.replace(/[\u3105-\u3129]/g, (ch) => (BOPOMOFO_SPEECH_MAP[ch] ? ` ${BOPOMOFO_SPEECH_MAP[ch]} ` : ''));
      clean = clean
        .replace(/[ˊˇˋ˙]/g, '')
        .replace(/[🫧🔍🧩🚂⚡🐉🏆✨💎⭐🎯🔊👆⭕❌□🐛💮🚃🎉💡🎁🔥🧪🔨👑🏡🐰🐶🐥⛰️🌿🌙🌳👨🏃👩🚪🐴🌬️🐘🐮🐦👋😄🦒👄🔓🌸🦆🦢❤️🦋🐱🌤️🧍🐑👂⬆️⬇️🌧️💖🐜]/gu, ' ')
        .replace(/＿+/g, '空格')
        .replace(/\s+/g, ' ')
        .trim();
      if (!clean) return;
      const u = new SpeechSynthesisUtterance(clean);
      const voices = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
      const twVoice =
        voices.find((v) => v.lang === 'zh-TW' && v.name.includes('Google')) ||
        voices.find((v) => v.lang === 'zh-TW') ||
        voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('zh'));
      if (twVoice) u.voice = twVoice;
      u.lang = 'zh-TW';
      u.rate = rate;
      u.pitch = 1.08;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }
}

module.exports = { SoundEngine };
