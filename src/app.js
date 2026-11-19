const { SoundEngine } = require('./audio');
const { FXEngine } = require('./fx');
const { annotateZhuyin, renderVerticalZhuyin, renderCharWithZhuyin, escapeHtml } = require('./zhuyin_helper');
const { World3DEngine } = require('./webgl3d');
const { K2_LESSONS, K2_BOSS_EXTRAS } = require('./curriculum_k2');
const { GRADE1_LESSONS, GRADE1_BOSS_EXTRAS } = require('./curriculum_g1');
const { GRADE2_LESSONS, GRADE2_BOSS_EXTRAS, PET_CATALOG } = require('./curriculum_g2');

const STORAGE_KEY = 'chinese_3d_final_exam_v2';
const PUNCT_RE = /^[，。！？、：；「」『』（）…—]$/;

const PRAISE_BADGES = [
  '🌟 神準滿分！',
  '🚀 太強了吧！',
  '🎯 百發百中！',
  '⚡ 閃電學霸！',
  '🌈 超級天才！',
  '🔥 火力全開！',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cleanExplain(text) {
  if (!text) return '';
  return String(text).replace(
    /^(答對[^！!]*|太[^！!]*|超[^！!]*|完全[^！!]*|神[^！!]*|百發百中|一百分|滿分|叮咚[^！!]*|轟隆[^！!]*|金光[^！!]*|閃耀[^！!]*|合成[^！!]*|破案[^！!]*|抓到[^！!]*|抓得好|沒錯|沒被騙[^！!]*|嘟嘟[^！!]*|月考[^！!]*|魔王題[^！!]*|學霸[^！!]*|理解力[^！!]*|三胞胎[^！!]*|射中[^！!]*|射得好|成語[^！!]*|觀念[^！!]*|邏輯[^！!]*|想像力[^！!]*|暖心[^！!]*|精準[^！!]*|訂正[^！!]*|火眼金睛|眼力[^！!]*|素養[^！!]*|閱讀[^！!]*|哈哈[^！!]*|破解[^！!]*|好棒[^！!]*|好厲害[^！!]*)[！!]\s*/,
    ''
  );
}

const LESSON_FX_CONFIG = {
  k2_L1: { action: '🏡 點溫馨小屋', cheer: '🩷 爸爸媽媽抱抱！', emojis: ['🏡', '🩷', '👨', '👩', '✨'], colors: ['#f472b6', '#fb7185', '#fde047'], floatUp: true },
  k2_L2: { action: '🐰 點快樂動物', cheer: '🐰 動物朋友嗨！', emojis: ['🐰', '🐘', '🐮', '🐦', '✨'], colors: ['#34d399', '#fb923c', '#fde047'], floatUp: true },
  k2_L3: { action: '🐶 點汪喵派對', cheer: '🐶 汪汪喵喵！', emojis: ['🐶', '🐱', '🌸', '🔥', '✨'], colors: ['#38bdf8', '#fb7185', '#fde047'], floatUp: true },
  k2_L4: { action: '🐥 點小雞西瓜', cheer: '🐥 啾啾吃西瓜！', emojis: ['🐥', '🍉', '🐟', '🌟', '✨'], colors: ['#facc15', '#fb7185', '#4ade80'], floatUp: true },
  k2_L5: { action: '☀️ 點太陽山水', cheer: '☀️ 太陽亮晶晶！', emojis: ['☀️', '⛰️', '💧', '🚗', '✨'], colors: ['#fde047', '#38bdf8', '#4ade80'], floatUp: true },
  k2_L6: { action: '🌿 點森林數數', cheer: '🌿 一二三四！', emojis: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '🌿'], colors: ['#10b981', '#fde047', '#38bdf8'], floatUp: true },
  k2_L7: { action: '🌙 點月亮綿羊', cheer: '🌙 晚安小綿羊！', emojis: ['🌙', '🐑', '⭐', '🦆', '✨'], colors: ['#818cf8', '#f472b6', '#fde047'], floatUp: true },
  k2_L8: { action: '🌳 點魔法大樹', cheer: '👑 識字小狀元！', emojis: ['🌳', '⭐', '👑', '💖', '✨'], colors: ['#fb7185', '#fde047', '#4ade80'], floatUp: true },
  g1_L1: { action: '🌊 點小船衝浪', cheer: '⛵ 乘風破浪！', emojis: ['⛵', '🐟', '🌊', '💧', '✨'], colors: ['#38bdf8', '#0ea5e9', '#fde047'], floatUp: false },
  g1_L2: { action: '🖐️ 點彩虹手印', cheer: '🌈 五彩手印！', emojis: ['🖐️', '🌸', '🌷', '🌈', '✨'], colors: ['#fb7185', '#facc15', '#c084fc'], floatUp: true },
  g1_L3: { action: '🫧 點吹泡泡', cheer: '🫧 泡泡飛高高！', emojis: ['🫧', '🌈', '✨', '💫'], colors: ['#38bdf8', '#c084fc', '#f472b6'], floatUp: true },
  g1_L4: { action: '⛰️ 點山谷回音', cheer: '📢 你好～你好～！', emojis: ['🐿️', '🎵', '🎶', '🌲', '✨'], colors: ['#4ade80', '#38bdf8', '#fde047'], floatUp: true },
  g1_L5: { action: '🛸 點外星飛碟', cheer: '🛸 嗶嗶！外星朋友！', emojis: ['🛸', '👽', '🪐', '⭐', '🌟'], colors: ['#a855f7', '#38bdf8', '#fde047'], floatUp: true },
  g1_L6: { action: '🐠 點小金魚', cheer: '🐠 咕嚕咕嚕～！', emojis: ['🐠', '🫧', '🌟', '🐚', '✨'], colors: ['#fb923c', '#38bdf8', '#fde047'], floatUp: true },
  g1_L7: { action: '🧨 點舞獅煙火', cheer: '🧨 新年快樂！', emojis: ['🧨', '🏮', '🦁', '🎆', '✨'], colors: ['#ef4444', '#fde047', '#fb923c'], floatUp: true },
  g2_L7: { action: '🐰 點小兔跳跳', cheer: '🐰 蹦蹦跳！', emojis: ['🐰', '🥕', '🍄', '🌿', '✨'], colors: ['#4ade80', '#fb923c', '#fde047'], floatUp: false },
  g2_L8: { action: '🦌 點閃耀金角', cheer: '🦌 金角亮晶晶！', emojis: ['🦌', '🦋', '🌸', '✨', '🌟'], colors: ['#fde047', '#38bdf8', '#4ade80'], floatUp: true },
  g2_L9: { action: '👑 點國王皇冠', cheer: '👑 國王萬歲！', emojis: ['👑', '💎', '🌟', '🏰', '✨'], colors: ['#facc15', '#ef4444', '#38bdf8'], floatUp: false },
  g2_L10: { action: '🐑 點農場小羊', cheer: '🐑 咩～！好舒服！', emojis: ['🐑', '🌻', '🦋', '🍀', '✨'], colors: ['#4ade80', '#fde047', '#38bdf8'], floatUp: true },
  g2_L11: { action: '🥣 點幸福湯圓', cheer: '🩷 甜甜蜜蜜！', emojis: ['🩷', '🥣', '💛', '✨', '🌟'], colors: ['#f472b6', '#fde047', '#fb7185'], floatUp: true },
  g2_L12: { action: '🌈 點彩虹瀑布', cheer: '🌈 大自然真美！', emojis: ['🌈', '🦋', '🌿', '💧', '✨'], colors: ['#ef4444', '#fde047', '#38bdf8', '#4ade80'], floatUp: true },
};

class ChineseAdventureApp {
  constructor() {
    this.sound = new SoundEngine();
    this.fx = new FXEngine('fx-canvas');
    this.state = this.loadState();
    this.sound.autoRead = this.state.autoRead;

    this.view = 'hub'; // hub | study | custom_picker | play | victory | gacha | report
    this.activeLesson = null;
    this.hoverLesson = null;
    this.session = null;
    this.customSelectedIds = new Set();
    this._fxTimer = null;
    this._lastHoverSfxAt = 0;

    this.canvas = document.getElementById('world3d');
    this.world = new World3DEngine(this.canvas);
    this.world.setPet(this.state.equippedPet);

    this.bindGlobalKeys();
    this.bindStageInteractive();
    this.syncSky(this.getHubSky());
    this.world.setScene(this.state.grade === 'g2' ? 'hub_g2' : 'hub_g1');
    this.render();
  }

  getCurrentLessonId() {
    if (this.view === 'hub' && this.hoverLesson) return this.hoverLesson.id;
    if (this.view === 'study' && this.activeLesson) return this.activeLesson.id;
    if ((this.view === 'play' || this.view === 'victory') && this.session) {
      if (LESSON_FX_CONFIG[this.session.id]) return this.session.id;
      const q = this.session.questions && this.session.questions[this.session.index];
      const m = q && q.id && q.id.match(/^((?:k2|g[12])_L\d+)/);
      if (m && LESSON_FX_CONFIG[m[1]]) return m[1];
    }
    return null;
  }

  triggerLessonFX(lessonId, x, y, intensity = 1) {
    try {
      const cfg = LESSON_FX_CONFIG[lessonId] || {
        cheer: '✨ 奇幻魔法！',
        emojis: ['✨', '🌟', '🌈'],
        colors: ['#fde047', '#38bdf8', '#fb7185'],
        floatUp: true,
      };
      const safeX = Number.isFinite(x) ? x : window.innerWidth * 0.5;
      const safeY = Number.isFinite(y) ? y : window.innerHeight * 0.4;
      this.sound.playLessonSFX(lessonId);
      this.fx.multiRipple(safeX, safeY, cfg.colors);
      this.fx.emojiBurst(safeX, safeY, cfg.emojis, Math.round(14 * intensity), cfg.floatUp);
      this.fx.confettiBurst(safeX, safeY, Math.round(20 * intensity));
      this.fx.floatText(safeX, safeY - 18, cfg.cheer, cfg.colors[0]);
      this.world.spawnBurst([0, 0.25, 0.55], Math.round(22 * intensity), cfg.colors);

      const stageWrap = document.getElementById('stage-3d-wrap');
      if (stageWrap) {
        stageWrap.classList.remove('stage-light-flash');
        void stageWrap.offsetWidth;
        stageWrap.classList.add('stage-light-flash');
      }
    } catch (_) {}
  }

  bindStageInteractive() {
    const stageWrap = document.getElementById('stage-3d-wrap');
    const bgArt = document.getElementById('stage-bg-art');
    if (!stageWrap) return;

    stageWrap.addEventListener('pointermove', (e) => {
      if (!bgArt) return;
      const r = stageWrap.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
      const ny = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
      bgArt.style.setProperty('--stage-tx', `${(-nx * 10).toFixed(1)}px`);
      bgArt.style.setProperty('--stage-ty', `${(-ny * 7).toFixed(1)}px`);
    });

    stageWrap.addEventListener('pointerleave', () => {
      if (!bgArt) return;
      bgArt.style.setProperty('--stage-tx', '0px');
      bgArt.style.setProperty('--stage-ty', '0px');
    });

    stageWrap.addEventListener('click', (e) => {
      if (this.view === 'gacha') return;
      if (e.target.closest('#btn-stage-pet') || e.target.closest('#btn-pixar-actor') || e.target.closest('#btn-stage-fx')) return;
      const lid = this.getCurrentLessonId();
      if (lid) {
        this.triggerLessonFX(lid, e.clientX, e.clientY, 1);
      } else {
        this.sound.playSparkleBurst();
        this.fx.multiRipple(e.clientX, e.clientY, ['#fde047', '#38bdf8', '#fb7185']);
        this.fx.confettiBurst(e.clientX, e.clientY, 26);
      }
    });
  }

  loadState() {
    const fallback = {
      grade: 'g1',
      coins: 60, // Welcome coins so kids can spin 1 3D Gacha right away or after Lesson 1!
      gems: 3,
      stars: {},
      unlockedPets: ['shiba'],
      equippedPet: 'shiba',
      mistakes: {},
      bestCombo: 0,
      autoRead: true,
      showZhuyin: true,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('chinese_3d_final_exam_v1');
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const merged = { ...fallback, ...parsed };
      if (!['k2', 'g1', 'g2'].includes(merged.grade)) merged.grade = 'g1';
      if (merged.mistakes && typeof merged.mistakes === 'object') {
        const canonical = {};
        [
          ...K2_LESSONS.flatMap((l) => l.questions),
          ...K2_BOSS_EXTRAS,
          ...GRADE1_LESSONS.flatMap((l) => l.questions),
          ...GRADE1_BOSS_EXTRAS,
          ...GRADE2_LESSONS.flatMap((l) => l.questions),
          ...GRADE2_BOSS_EXTRAS,
        ].forEach((q) => { canonical[q.id] = q; });
        Object.keys(merged.mistakes).forEach((qid) => {
          if (canonical[qid]) merged.mistakes[qid] = { ...canonical[qid] };
        });
      }
      return merged;
    } catch (_) {
      return fallback;
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (_) {}
  }

  fmtText(text, q = null) {
    if (!text) return '';
    let exclude = '';
    if (q && q.type === 'bubble') {
      exclude = (q.targetHighlight || '') + ((q.prompt || '').match(/[「『]([^」』]+)[」』]/g) || []).join('');
    }
    return annotateZhuyin(text, this.state.showZhuyin, exclude);
  }

  getLessons(grade = this.state.grade) {
    if (grade === 'k2') return K2_LESSONS;
    return grade === 'g1' ? GRADE1_LESSONS : GRADE2_LESSONS;
  }

  getBossExtras(grade = this.state.grade) {
    if (grade === 'k2') return K2_BOSS_EXTRAS;
    return grade === 'g1' ? GRADE1_BOSS_EXTRAS : GRADE2_BOSS_EXTRAS;
  }

  getHubSky() {
    if (this.state.grade === 'k2') return ['#f472b6', '#fbcfe8', '#fef9c3'];
    return this.state.grade === 'g1'
      ? ['#38bdf8', '#bae6fd', '#fef9c3']
      : ['#10b981', '#a7f3d0', '#fef9c3'];
  }

  syncSky([top, mid, bot]) {
    const r = document.documentElement.style;
    r.setProperty('--sky-top', top);
    r.setProperty('--sky-mid', mid);
    r.setProperty('--sky-bot', bot);
  }

  bumpCoinChip() {
    const el = document.getElementById('hud-coins-chip');
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 260);
  }

  showDopaminePopup({ coinGain, isFever, chestStep, praise }) {
    const layer = document.getElementById('dopamine-fx-layer');
    if (!layer) return;
    if (this._fxTimer) clearTimeout(this._fxTimer);
    layer.innerHTML = `
      <div class="coin-burst-pop">${praise} +${coinGain} 🪙${isFever ? ' 🔥雙倍' : ''}</div>
      ${chestStep ? `<div class="chest-toast-banner">🎁 第 ${chestStep} 關寶箱大爆發！額外 +15 🪙 +1 💎！</div>` : ''}
    `;
    this._fxTimer = setTimeout(() => {
      layer.innerHTML = '';
    }, chestStep ? 2150 : 1400);
  }

  scrollFeedbackIntoView() {
    requestAnimationFrame(() => {
      const target = document.getElementById('feedback-zone') || document.getElementById('train-retry-msg');
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  bindGlobalKeys() {
    window.addEventListener('keydown', (e) => {
      if (this.view !== 'play' || !this.session) return;
      if (this.session.answered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        this.nextQuestion();
        return;
      }
      if (!this.session.answered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const btns = document.querySelectorAll('[data-opt-idx]');
        if (btns[idx]) btns[idx].click();
      }
    });
  }

  switchGrade(g) {
    this.sound.playTap();
    this.sound.stopSpeak();
    this.state.grade = g;
    this.hoverLesson = null;
    this.saveState();
    this.view = 'hub';
    this.syncSky(this.getHubSky());
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.world.setScene(g === 'g2' ? 'hub_g2' : 'hub_g1');
    this.render();
  }

  goHub() {
    this.sound.playTap();
    this.sound.stopSpeak();
    this.view = 'hub';
    this.hoverLesson = null;
    this.session = null;
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.syncSky(this.getHubSky());
    this.world.setScene(this.state.grade === 'g2' ? 'hub_g2' : 'hub_g1');
    this.world.setPet(this.state.equippedPet);
    this.render();
  }

  scrollToStage() {
    try {
      if (typeof window !== 'undefined' && window.scrollY > 80) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (_) {
      try { window.scrollTo(0, 0); } catch (__) {}
    }
  }

  findAnyLesson(lessonId) {
    return [...K2_LESSONS, ...GRADE1_LESSONS, ...GRADE2_LESSONS].find((l) => l.id === lessonId) || null;
  }

  openStudy(lessonId) {
    const lesson = this.findAnyLesson(lessonId);
    if (!lesson) return;
    this.sound.playPop();
    this.activeLesson = lesson;
    this.view = 'study';
    this.syncSky(lesson.sky);
    this.world.setScene(lesson.scene);
    this.render();
    this.scrollToStage();
    if (this.state.autoRead) {
      const msg = lesson.id.startsWith('k2_')
        ? `${lesson.code}，點選大圖卡，聽注音認識國字喔！`
        : `${lesson.code}，${lesson.title}，考前重點秘笈！點選卡片可以聽發音喔！`;
      this.sound.speak(msg);
    }
  }

  startLesson(lessonId) {
    const lesson = this.findAnyLesson(lessonId);
    if (!lesson) return;
    this.sound.playPop();
    this.activeLesson = lesson;
    const questions = lesson.questions.map((q) => this.prepareQuestion(q));
    this.launchSession({
      id: lesson.id,
      title: `${lesson.icon} ${lesson.code}：${lesson.title}`,
      scene: lesson.scene,
      sky: lesson.sky,
      isBoss: false,
      isMistakeMode: false,
      questions,
    });
  }

  startBossBattle() {
    this.sound.playFever();
    const g = this.state.grade;
    const lessons = this.getLessons(g);
    const perLessonPool = [];
    lessons.forEach((l) => {
      const picked = shuffle(l.questions).slice(0, 1);
      perLessonPool.push(...picked);
    });
    const extraCount = g === 'k2' ? 4 : g === 'g1' ? 5 : 6;
    const extras = shuffle(this.getBossExtras(g)).slice(0, extraCount);
    const combined = shuffle([...perLessonPool, ...extras]).slice(0, 12).map((q) => this.prepareQuestion(q));
    const bossTitle = g === 'k2'
      ? '🐉 幼兒中班總複習：ㄅ ㄆ ㄇ 識字小狀元'
      : g === 'g1'
        ? '🐉 一年級期末總複習：星際魔王決戰'
        : '🐉 二年級期末總複習：夢工廠魔王決戰';

    this.launchSession({
      id: `boss_${g}`,
      title: bossTitle,
      scene: 'boss',
      sky: ['#be123c', '#fda4af', '#fef08a'],
      isBoss: true,
      isMistakeMode: false,
      questions: combined,
    });
  }

  openCustomPicker() {
    this.sound.playTap();
    this.customSelectedIds = new Set(this.getLessons().map((l) => l.id));
    this.view = 'custom_picker';
    this.render();
    this.scrollToStage();
  }

  startCustomSession() {
    const chosen = this.getLessons().filter((l) => this.customSelectedIds.has(l.id));
    if (!chosen.length) return;
    this.sound.playPop();
    const pool = [];
    chosen.forEach((l) => { pool.push(...l.questions); });
    const questions = shuffle(pool).slice(0, Math.min(10, pool.length)).map((q) => this.prepareQuestion(q));
    this.launchSession({
      id: `custom_${this.state.grade}`,
      title: `🎯 自選範圍特訓（共 ${chosen.length} 課）`,
      scene: chosen[0].scene,
      sky: chosen[0].sky,
      isBoss: false,
      isMistakeMode: false,
      questions,
    });
  }

  getGradeMistakes() {
    const prefix = this.state.grade + '_';
    return Object.values(this.state.mistakes).filter((q) => q && q.id && q.id.startsWith(prefix));
  }

  startMistakeReview() {
    const list = this.getGradeMistakes();
    if (!list.length) return;
    this.sound.playPop();
    const questions = shuffle(list).slice(0, 10).map((q) => this.prepareQuestion(q));
    this.launchSession({
      id: `mistake_${this.state.grade}`,
      title: '💎 錯題閃電復活營',
      scene: 'boss',
      sky: ['#0284c7', '#a7f3d0', '#fef9c3'],
      isBoss: false,
      isMistakeMode: true,
      questions,
    });
  }

  prepareQuestion(raw) {
    const q = JSON.parse(JSON.stringify(raw));
    if (q.options) {
      q.shuffledOptions = shuffle(q.options);
    }
    if (q.type === 'train' && q.answerOrder) {
      let shuf = shuffle(q.answerOrder);
      if (shuf.join('|') === q.answerOrder.join('|') && shuf.length > 1) {
        [shuf[0], shuf[1]] = [shuf[1], shuf[0]];
      }
      q.poolCarriages = shuf.map((text, idx) => ({ id: idx, text, used: false }));
      q.hooked = [];
      q.trainRetries = 0;
      q.trainRetryMsg = '';
    }
    if (q.type === 'typo') {
      q.caughtBug = false;
      q.wrongTaps = 0;
    }
    return q;
  }

  launchSession(cfg) {
    this.session = {
      ...cfg,
      index: 0,
      correctCount: 0,
      combo: 0,
      maxCombo: 0,
      earnedCoins: 0,
      earnedGems: 0,
      answered: false,
      isCorrect: false,
      pickedValue: null,
      justOpenedChest: 0,
      chestsClaimed: {},
    };
    this.view = 'play';
    this.syncSky(cfg.sky);
    this.world.bossHpRatio = 1.0;
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.world.setScene(cfg.scene);
    this.render();
    this.scrollToStage();
    this.autoSpeakCurrent();
  }

  autoSpeakCurrent() {
    if (!this.state.autoRead || !this.session) return;
    const q = this.session.questions[this.session.index];
    if (q) {
      if (q.type === 'bubble') this.sound.playCensorBeep();
      this.sound.speak(q.tts || q.prompt);
    }
  }

  handleAnswer(isRight, pickedVal = null) {
    const s = this.session;
    if (!s || s.answered) return;
    const q = s.questions[s.index];
    s.answered = true;
    s.isCorrect = isRight;
    s.pickedValue = pickedVal;
    s.justOpenedChest = 0;

    const bodyExplain = cleanExplain(q.explain);

    if (isRight) {
      s.correctCount++;
      s.combo++;
      if (s.combo > s.maxCombo) s.maxCombo = s.combo;
      if (s.combo > this.state.bestCombo) this.state.bestCombo = s.combo;

      const wasFever = this.world.fever;
      if (s.combo >= 3) {
        this.world.fever = true;
        document.body.classList.add('fever-active');
        if (!wasFever) this.sound.playFever();
      }

      const gain = this.world.fever ? 24 : 12;
      this.state.coins += gain;
      s.earnedCoins += gain;
      this.bumpCoinChip();

      // Milestone mini-chests at question 3 and 6!
      const stepNum = s.index + 1;
      let chestStep = 0;
      if ((stepNum === 3 || stepNum === 6) && !s.chestsClaimed[stepNum]) {
        s.chestsClaimed[stepNum] = true;
        s.justOpenedChest = stepNum;
        chestStep = stepNum;
        this.state.coins += 15;
        s.earnedCoins += 15;
        this.state.gems += 1;
        s.earnedGems += 1;
        this.sound.playChest();
        this.world.spawnBurst([0, 0.45, 0.65], 40);
      }

      const praise = PRAISE_BADGES[(s.correctCount + s.index) % PRAISE_BADGES.length];
      this.showDopaminePopup({
        coinGain: gain,
        isFever: this.world.fever,
        chestStep,
        praise,
      });

      if (s.isMistakeMode && this.state.mistakes[q.id]) {
        delete this.state.mistakes[q.id];
        this.state.gems += 2;
        s.earnedGems += 2;
      }

      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.36;
      const activeLid = this.getCurrentLessonId();
      const lCfg = activeLid && LESSON_FX_CONFIG[activeLid];

      if (s.isBoss) {
        this.sound.playCannon();
        this.world.fireBossCannon();
        this.fx.confettiBurst(cx, cy * 0.7, 56);
        this.fx.shockwave(cx, cy * 0.7, '#fb7185', 140);
        this.fx.floatText(cx, cy * 0.7, '💥 星光砲命中！', '#fb7185');
        this.fx.screenShake(11);
        const remaining = Math.max(0, 1 - s.correctCount / s.questions.length);
        this.world.bossHpRatio = remaining;
      } else {
        this.sound.playCorrect(s.combo);
        this.world.spawnBurst([0, 0.25, 0.6], 26, lCfg ? lCfg.colors : undefined);
        this.fx.confettiBurst(cx, cy, s.combo >= 3 ? 52 : 34);
        if (lCfg) {
          this.fx.multiRipple(cx, cy * 0.65, lCfg.colors);
          this.fx.emojiBurst(cx, cy * 0.65, lCfg.emojis, s.combo >= 3 ? 16 : 11, lCfg.floatUp);
        } else {
          this.fx.shockwave(cx, cy, s.combo >= 3 ? '#fb7185' : '#fde047', 110);
        }
        this.fx.floatText(cx, cy - 20, s.combo >= 3 ? `🔥 ${s.combo} 連擊 +${gain}🪙` : `+${gain} 🪙`, '#f59e0b');
        if (s.combo >= 2) this.fx.screenShake(6);
      }
      this.world.cheerPet();

      if (this.state.autoRead) {
        this.sound.speak(`答對了！${bodyExplain}`);
      }
    } else {
      s.combo = 0;
      this.world.fever = false;
      document.body.classList.remove('fever-active');
      this.sound.playWrong();

      // Store clean copy into mistake vault for targeted review!
      const cleanCopy = { ...q };
      delete cleanCopy.shuffledOptions;
      delete cleanCopy.poolCarriages;
      delete cleanCopy.hooked;
      delete cleanCopy.trainRetries;
      delete cleanCopy.trainRetryMsg;
      delete cleanCopy.caughtBug;
      delete cleanCopy.wrongTaps;
      this.state.mistakes[q.id] = cleanCopy;

      if (this.state.autoRead) {
        this.sound.speak(`沒關係，學起來就會了！${bodyExplain}`);
      }
    }

    this.saveState();
    this.render();
    this.scrollFeedbackIntoView();
  }

  nextQuestion() {
    const s = this.session;
    if (!s) return;
    this.sound.playTap();
    this.sound.stopSpeak();
    const layer = document.getElementById('dopamine-fx-layer');
    if (layer) layer.innerHTML = '';

    if (s.index + 1 < s.questions.length) {
      s.index++;
      s.answered = false;
      s.isCorrect = false;
      s.pickedValue = null;
      s.justOpenedChest = 0;
      this.render();
      this.autoSpeakCurrent();
    } else {
      this.finishSession();
    }
  }

  finishSession() {
    const s = this.session;
    const ratio = s.correctCount / Math.max(1, s.questions.length);
    const stars = ratio >= 0.88 ? 3 : ratio >= 0.6 ? 2 : 1;
    const prev = this.state.stars[s.id] || 0;
    if (stars > prev) this.state.stars[s.id] = stars;

    // Completion treasure bonus
    const clearBonus = s.isBoss ? 50 : 25;
    this.state.coins += clearBonus;
    s.earnedCoins += clearBonus;
    this.state.gems += stars;
    s.earnedGems += stars;
    s.finalStars = stars;

    // Unlock Mythic Dragon if Boss cleared with 3 stars!
    if (s.isBoss && stars === 3 && !this.state.unlockedPets.includes('dragon')) {
      this.state.unlockedPets.push('dragon');
      s.unlockedSpecialDragon = true;
    }

    this.saveState();
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.sound.playVictory();
    this.world.spawnBurst([0, 0.4, 0.5], 55);
    this.fx.confettiBurst(window.innerWidth * 0.28, window.innerHeight * 0.45, 55);
    this.fx.confettiBurst(window.innerWidth * 0.72, window.innerHeight * 0.45, 55);
    this.world.cheerPet();
    this.view = 'victory';
    this.render();
  }

  openGacha() {
    this.sound.playPop();
    this.sound.stopSpeak();
    this.view = 'gacha';
    this.gachaLastWon = null;
    this.gachaRolling = false;
    this.syncSky(['#f59e0b', '#fde68a', '#fffbeb']);
    this.world.setScene('gacha');
    this.render();
  }

  spinGacha() {
    if (this.gachaRolling || this.state.coins < 50) return;
    this.state.coins -= 50;
    this.gachaRolling = true;
    this.gachaLastWon = null;
    this.sound.playGachaSpin();
    this.world.setScene('gacha');
    this.world.triggerGachaSpin();
    this.saveState();
    this.render();

    setTimeout(() => {
      // Prioritize locked pets first so kids ALWAYS get exciting new 3D companions!
      const locked = PET_CATALOG.filter((p) => !this.state.unlockedPets.includes(p.id));
      let won;
      let isNew = false;
      if (locked.length > 0) {
        won = locked[Math.floor(Math.random() * locked.length)];
        this.state.unlockedPets.push(won.id);
        isNew = true;
      } else {
        won = PET_CATALOG[Math.floor(Math.random() * PET_CATALOG.length)];
        this.state.gems += 5;
      }
      this.state.equippedPet = won.id;
      this.world.setPet(won.id);
      this.world.showGachaPet(won.id);
      this.sound.playGachaReveal();
      if (this.state.autoRead) {
        this.sound.speak(`哇！恭喜轉出${won.rarity}守護神獸，${won.name}！${won.desc}`);
      }
      this.gachaRolling = false;
      this.gachaLastWon = { ...won, isNew };
      this.saveState();
      this.render();
    }, 780);
  }

  equipPet(petId) {
    if (!this.state.unlockedPets.includes(petId)) return;
    this.sound.playPop();
    this.state.equippedPet = petId;
    this.world.setPet(petId);
    if (this.view === 'gacha') {
      this.world.showGachaPet(petId);
    } else {
      this.world.cheerPet();
    }
    const pet = PET_CATALOG.find((p) => p.id === petId);
    if (pet && this.state.autoRead) {
      this.sound.speak(`${pet.name}上場陪你一起闖關！`);
    }
    this.saveState();
    this.render();
  }

  openReport() {
    this.sound.playTap();
    this.sound.stopSpeak();
    this.view = 'report';
    this.render();
  }

  renderStars(n = 0) {
    return [1, 2, 3].map((i) => (i <= n ? '⭐' : '☆')).join('');
  }

  attachOptionContent(btn, optText, q, prefix = '') {
    btn.innerHTML = `
      <span class="option-card-label">${prefix}${this.fmtText(optText, q)}</span>
      <span role="button" tabindex="0" class="opt-speak-chip" title="聽這個選項的發音">🔊</span>
    `;
    const spk = btn.querySelector('.opt-speak-chip');
    if (spk) {
      spk.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.sound.speak(optText);
      };
    }
  }

  getPetArt(petId) {
    const art = window.__ART__ || {};
    const ls = art.lessons || {};
    const map = {
      shiba: art.badge,
      unicorn: ls.g1_L3,
      koi: ls.g1_L6,
      bunny: ls.g2_L7,
      sheep: ls.g2_L10,
      deer: ls.g2_L8,
      alien: ls.g1_L5,
      panda: ls.g2_L11,
      lion: ls.g1_L7,
      butterfly: ls.g2_L12,
      dino: ls.g2_L9,
      dragon: art.boss,
    };
    return map[petId] || art.badge || '';
  }

  renderStageOverlays() {
    const stageTop = document.getElementById('stage-overlay-top');
    const stageBot = document.getElementById('stage-overlay-bot');
    const actorEl = document.getElementById('pixar-stage-actor');
    const bgArt = document.getElementById('stage-bg-art');
    const stageWrap = document.getElementById('stage-3d-wrap');
    if (!stageTop || !stageBot) return;

    const currentPet = PET_CATALOG.find((p) => p.id === this.state.equippedPet) || PET_CATALOG[0];
    const isBoss = this.view === 'play' && this.session && this.session.isBoss;
    const lessonId = !isBoss && this.view !== 'gacha' ? this.getCurrentLessonId() : null;
    const lessonArt = lessonId && window.__ART__ && window.__ART__.lessons && window.__ART__.lessons[lessonId];
    const badgeArt = this.getPetArt(currentPet.id);

    if (bgArt) {
      const targetUrl = lessonArt || (window.__ART__ && window.__ART__.sky) || '';
      if (bgArt.dataset.artKey !== (lessonId || 'sky')) {
        bgArt.dataset.artKey = lessonId || 'sky';
        bgArt.style.backgroundImage = `url("${targetUrl}")`;
        bgArt.classList.remove('scene-pop-in');
        void bgArt.offsetWidth;
        bgArt.classList.add('scene-pop-in');
      }
    }

    if (actorEl) {
      if (this.view === 'gacha' || lessonArt) {
        // Let the 3D Gacha machine or the lesson's Pixar 3D hero scene shine unobstructed!
        actorEl.innerHTML = '';
      } else {
        const imgSrc = isBoss
          ? (window.__ART__ && window.__ART__.boss) || ''
          : badgeArt;
        const badgeText = isBoss ? '😈 錯字大魔王' : `🐾 ${currentPet.name}`;
        actorEl.innerHTML = `
          <button type="button" class="pixar-actor-card ${isBoss ? 'is-boss' : ''}" id="btn-pixar-actor" title="點點我！">
            <img class="pixar-actor-img" src="${imgSrc}" alt="${escapeHtml(badgeText)}" />
            <span class="pixar-actor-pill">${escapeHtml(badgeText)}</span>
          </button>
        `;
        const actorBtn = document.getElementById('btn-pixar-actor');
        if (actorBtn) {
          actorBtn.onclick = () => {
            this.sound.playSparkleBurst();
            const r = actorBtn.getBoundingClientRect();
            this.fx.confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 28);
            this.fx.floatText(r.left + r.width / 2, r.top, isBoss ? '🔥 來挑戰我吧！' : '✨ 加油！', '#fde047');
          };
        }
      }
    }

    let label = this.state.grade === 'k2'
      ? '🎠 幼兒中班 ㄅ ㄆ ㄇ 識字樂園'
      : this.state.grade === 'g1'
        ? '🏝️ 一年級天空王國'
        : '🏝️ 二年級夢幻王國';
    if (this.view === 'hub' && this.hoverLesson) {
      label = `${this.hoverLesson.code}《${this.hoverLesson.title}》`;
    } else if (this.view === 'study' && this.activeLesson) {
      label = `${this.activeLesson.code}《${this.activeLesson.title}》`;
    } else if (this.view === 'play' && this.session) {
      label = this.session.title;
    } else if (this.view === 'gacha') {
      label = '🎰 扭蛋屋';
    }

    let comboHtml = '';
    if (this.view === 'play' && this.session && this.session.combo >= 2) {
      const isFev = this.session.combo >= 3;
      comboHtml = `<div class="combo-pill ${isFev ? 'fever' : ''}">
        ${isFev ? `🔥 ${this.session.combo} 連擊！金幣×2` : `⚡ ${this.session.combo} 連擊！`}
      </div>`;
    }

    stageTop.innerHTML = `
      <div class="scene-label-tag">${renderVerticalZhuyin(label, 'inline')}</div>
      ${comboHtml}
    `;

    if (isBoss) {
      const pct = Math.max(0, Math.round(this.world.bossHpRatio * 100));
      stageBot.innerHTML = `
        <div class="boss-hp-box">
          <div class="boss-hp-title">
            <span>🐉 魔王血量</span>
            <span>${pct}%</span>
          </div>
          <div class="boss-hp-track">
            <div class="boss-hp-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    } else if (this.view === 'gacha') {
      stageBot.innerHTML = ``;
    } else {
      const lCfg = lessonId && LESSON_FX_CONFIG[lessonId];
      stageBot.innerHTML = `
        ${lCfg
          ? `<button type="button" class="stage-fx-trigger-btn" id="btn-stage-fx">${escapeHtml(lCfg.action)} ✨</button>`
          : `<div></div>`}
        <button type="button" class="pet-partner-tag" id="btn-stage-pet">
          <img class="pet-mini-avatar" src="${badgeArt}" alt="" />
          <span>${escapeHtml(currentPet.name)}</span>
        </button>
      `;
      const fxBtn = document.getElementById('btn-stage-fx');
      if (fxBtn && lessonId) {
        fxBtn.onclick = (e) => {
          e.stopPropagation();
          const r = stageWrap ? stageWrap.getBoundingClientRect() : fxBtn.getBoundingClientRect();
          this.triggerLessonFX(lessonId, r.left + r.width * 0.5, r.top + r.height * 0.48, 1.2);
        };
      }
      const petBtn = document.getElementById('btn-stage-pet');
      if (petBtn) petBtn.onclick = (e) => { e.stopPropagation(); this.openGacha(); };
    }
  }

  render() {
    const wasPlay = document.body.classList.contains('in-play');
    const nowPlay = this.view === 'play';
    document.body.classList.toggle('in-play', nowPlay);
    if (wasPlay !== nowPlay) {
      requestAnimationFrame(() => this.world.resize());
    }

    // Update Top HUD Bar
    document.getElementById('hud-coins-val').textContent = this.state.coins;
    document.getElementById('hud-gems-val').textContent = this.state.gems;

    const btnZhuyin = document.getElementById('btn-toggle-zhuyin');
    if (btnZhuyin) {
      btnZhuyin.innerHTML = `<span class="zy-mini-stack"><span>ㄅ</span><span>ㄆ</span><span>ㄇ</span></span> ${this.state.showZhuyin ? '開' : '關'}`;
      btnZhuyin.classList.toggle('active-toggle', this.state.showZhuyin);
      btnZhuyin.onclick = () => {
        this.sound.playTap();
        this.state.showZhuyin = !this.state.showZhuyin;
        this.saveState();
        this.render();
      };
    }

    const btnVoice = document.getElementById('btn-toggle-voice');
    btnVoice.textContent = this.state.autoRead ? '🔊 唸題' : '🔈 靜音';
    btnVoice.classList.toggle('active-toggle', this.state.autoRead);
    btnVoice.onclick = () => {
      this.state.autoRead = !this.state.autoRead;
      this.sound.autoRead = this.state.autoRead;
      if (!this.state.autoRead) this.sound.stopSpeak();
      this.saveState();
      this.render();
    };

    const btnBgm = document.getElementById('btn-toggle-bgm');
    btnBgm.textContent = this.sound.bgmOn ? '🎵 開' : '🎵 音樂';
    btnBgm.classList.toggle('active-toggle', this.sound.bgmOn);
    btnBgm.onclick = () => {
      this.sound.toggleBgm();
      this.render();
    };

    document.getElementById('btn-open-gacha').onclick = () => this.openGacha();
    document.getElementById('btn-open-report').onclick = () => this.openReport();
    document.getElementById('btn-brand-home').onclick = () => this.goHub();

    this.renderStageOverlays();

    const deck = document.getElementById('main-deck');
    if (this.view === 'hub') this.renderHub(deck);
    else if (this.view === 'study') this.renderStudy(deck);
    else if (this.view === 'custom_picker') this.renderCustomPicker(deck);
    else if (this.view === 'play') this.renderPlay(deck);
    else if (this.view === 'victory') this.renderVictory(deck);
    else if (this.view === 'gacha') this.renderGacha(deck);
    else if (this.view === 'report') this.renderReport(deck);
  }

  renderHub(deck) {
    const g = this.state.grade;
    const isK2 = g === 'k2';
    const lessons = this.getLessons();
    const mistakesCount = this.getGradeMistakes().length;
    const bossStars = this.state.stars[`boss_${g}`] || 0;

    deck.innerHTML = `
      <div class="grade-tabs">
        <div class="grade-switch-group">
          <button id="tab-grade-k2" class="toy-btn grade-tab-btn ${g === 'k2' ? 'sun' : ''}">
            🐥 幼兒中班
          </button>
          <button id="tab-grade-1" class="toy-btn grade-tab-btn ${g === 'g1' ? 'coral' : ''}">
            🐣 一年級
          </button>
          <button id="tab-grade-2" class="toy-btn grade-tab-btn ${g === 'g2' ? 'mint' : ''}">
            🚀 二年級
          </button>
        </div>
      </div>

      ${isK2 ? `
        <div class="k2-step-ribbon" aria-label="中班四步慢慢認國字">
          <span class="k2-step-chip">🎯 聽音認 ${renderVerticalZhuyin('ㄅ', 'inline')}${renderVerticalZhuyin('ㄆ', 'inline')}${renderVerticalZhuyin('ㄇ', 'inline')}</span>
          <span class="k2-step-arrow">➔</span>
          <span class="k2-step-chip">🧪 拼音變國字</span>
          <span class="k2-step-arrow">➔</span>
          <span class="k2-step-chip">🧩 注音陪讀</span>
          <span class="k2-step-arrow">➔</span>
          <span class="k2-step-chip">🔨 敲地鼠認國字</span>
        </div>
      ` : ''}

      <div class="review-hero-strip">
        <div class="hero-action-card boss-card">
          <h2 class="hero-card-title">${isK2 ? '👑 識字大魔王' : '🐉 打大魔王'} ${this.renderStars(bossStars)}</h2>
          <button id="btn-start-boss" class="toy-btn coral">⚔️ 開戰！(12題)</button>
        </div>

        <div class="hero-action-card custom-card">
          <h2 class="hero-card-title">🎯 自己選關</h2>
          <button id="btn-open-custom" class="toy-btn primary">✨ 選關複習</button>
        </div>

        <div class="hero-action-card mistake-card">
          <h2 class="hero-card-title">💎 救錯題（${mistakesCount}）</h2>
          <button id="btn-start-mistakes" class="toy-btn mint" ${mistakesCount === 0 ? 'disabled style="opacity:0.55;cursor:default;"' : ''}>
            ${mistakesCount > 0 ? `🛠️ 去修補` : '✅ 全部會了'}
          </button>
        </div>
      </div>

      <h2 style="margin:6px 0 12px;font-size:1.15rem;font-weight:900;color:#0f172a;">
        🗺️ ${isK2 ? '選一關邊玩邊認字！' : '選一課來玩！'}
      </h2>
      <div class="lessons-grid" id="lessons-grid"></div>
    `;

    document.getElementById('tab-grade-k2').onclick = () => this.switchGrade('k2');
    document.getElementById('tab-grade-1').onclick = () => this.switchGrade('g1');
    document.getElementById('tab-grade-2').onclick = () => this.switchGrade('g2');
    document.getElementById('btn-start-boss').onclick = () => this.startBossBattle();
    document.getElementById('btn-open-custom').onclick = () => this.openCustomPicker();
    const mBtn = document.getElementById('btn-start-mistakes');
    if (mistakesCount > 0) mBtn.onclick = () => this.startMistakeReview();

    const grid = document.getElementById('lessons-grid');
    lessons.forEach((l) => {
      const st = this.state.stars[l.id] || 0;
      const thumbSrc = (window.__ART__ && window.__ART__.lessons && window.__ART__.lessons[l.id]) || '';
      const isLessonK2 = l.id.startsWith('k2_');
      const card = document.createElement('div');
      card.className = 'lesson-card lesson-card-3d';
      card.id = `card-${l.id}`;
      card.dataset.lessonId = l.id;
      card.innerHTML = `
        <div class="lesson-3d-thumb">
          <img class="lesson-3d-img" src="${thumbSrc}" alt="${escapeHtml(l.title)}" draggable="false" />
          <span class="lesson-3d-gloss"></span>
          <span class="lesson-3d-code">${escapeHtml(l.code)}</span>
          <span class="lesson-3d-stars">${this.renderStars(st)}</span>
          <button type="button" class="lesson-3d-fx-btn" id="fx-${l.id}" title="點我放聲光特效！">✨</button>
        </div>
        <div class="lesson-card-body">
          <h3 class="lesson-name">${this.fmtText(l.title)}</h3>
          <div class="lesson-btn-row">
            <button type="button" class="toy-btn sun sm" id="study-${l.id}" style="white-space:nowrap;">${isLessonK2 ? '📖 圖卡' : '📖 課文'}</button>
            <button type="button" class="toy-btn primary sm" id="play-${l.id}" style="white-space:nowrap;">▶️ 玩！</button>
          </div>
        </div>
      `;

      card.onpointerenter = (e) => {
        if (e && e.pointerType && e.pointerType !== 'mouse') return;
        const changed = !this.hoverLesson || this.hoverLesson.id !== l.id;
        this.hoverLesson = l;
        this.world.setScene(l.scene);
        this.renderStageOverlays();
        const now = performance.now();
        if (changed && now - this._lastHoverSfxAt > 260) {
          this._lastHoverSfxAt = now;
          this.sound.playLessonSFX(l.id);
        }
      };

      card.onpointermove = (e) => {
        if (e && e.pointerType && e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
        const py = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
        card.style.setProperty('--ix', `${(-px * 10).toFixed(1)}px`);
        card.style.setProperty('--iy', `${(-py * 8).toFixed(1)}px`);
        card.style.setProperty('--gx', `${Math.round((px + 0.5) * 100)}%`);
      };

      card.onpointerleave = () => {
        card.style.setProperty('--ix', '0px');
        card.style.setProperty('--iy', '0px');
      };

      grid.appendChild(card);

      document.getElementById(`fx-${l.id}`).onclick = (e) => {
        e.stopPropagation();
        this.hoverLesson = l;
        this.renderStageOverlays();
        const r = e.currentTarget.getBoundingClientRect();
        this.triggerLessonFX(l.id, r.left + r.width / 2, r.top + r.height / 2, 1);
      };

      document.getElementById(`study-${l.id}`).onclick = (e) => {
        e.stopPropagation();
        const r = card.getBoundingClientRect();
        const fxX = r.left + r.width / 2;
        const fxY = r.top + 60;
        this.openStudy(l.id);
        this.triggerLessonFX(l.id, fxX, fxY, 0.75);
      };

      document.getElementById(`play-${l.id}`).onclick = (e) => {
        e.stopPropagation();
        const r = card.getBoundingClientRect();
        const fxX = r.left + r.width / 2;
        const fxY = r.top + 60;
        this.startLesson(l.id);
        this.triggerLessonFX(l.id, fxX, fxY, 0.9);
      };

      card.onclick = (e) => {
        if (e.target && e.target.closest && e.target.closest('button')) return;
        const r = card.getBoundingClientRect();
        const fxX = e.clientX || (r.left + r.width / 2);
        const fxY = e.clientY || (r.top + 60);
        this.startLesson(l.id);
        this.triggerLessonFX(l.id, fxX, fxY, 0.9);
      };
    });
  }

  renderStudy(deck) {
    const l = this.activeLesson;
    if (!l) return this.goHub();
    const isK2 = l.id.startsWith('k2_');
    deck.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <span class="mode-pill">🔊 點卡片聽發音！</span>
          <h2 style="margin:4px 0 0;font-size:1.45rem;font-weight:900;">${escapeHtml(l.code)}：${this.fmtText(l.title)}</h2>
        </div>
        <div style="display:flex;gap:8px;">
          <button id="btn-study-back" class="toy-btn">⬅️ 回去</button>
          <button id="btn-study-go" class="toy-btn coral">▶️ 開始玩！</button>
        </div>
      </div>
      <div class="flashcards-grid ${isK2 ? 'k2-flashcards-grid' : ''}" id="study-cards-wrap"></div>
    `;
    document.getElementById('btn-study-back').onclick = () => this.goHub();
    document.getElementById('btn-study-go').onclick = () => {
      this.triggerLessonFX(l.id, window.innerWidth * 0.5, window.innerHeight * 0.35, 0.9);
      this.startLesson(l.id);
    };

    const wrap = document.getElementById('study-cards-wrap');
    l.studyCards.forEach((sc) => {
      const div = document.createElement('div');
      div.className = `study-card ${isK2 ? 'k2-study-card' : ''}`;
      if (isK2) {
        div.innerHTML = `
          <div class="k2-study-top">
            <span class="k2-study-pic">${escapeHtml(sc.pic || '🌟')}</span>
            <span class="k2-study-hanzi">${escapeHtml(sc.word)}</span>
            <div class="study-zhuyin k2-study-zy">${renderVerticalZhuyin(sc.zhuyin, 'study')}</div>
          </div>
          <div class="study-tip">${this.fmtText(sc.tip)} 🔊</div>
        `;
      } else {
        div.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="study-word">${this.fmtText(sc.word)}</div>
            <span>🔊✨</span>
          </div>
          <div class="study-zhuyin">${renderVerticalZhuyin(sc.zhuyin, 'study')}</div>
          <div class="study-tip">${this.fmtText(sc.tip)}</div>
        `;
      }
      div.onclick = (e) => {
        const r = div.getBoundingClientRect();
        this.triggerLessonFX(l.id, e.clientX || (r.left + r.width / 2), e.clientY || (r.top + 30), 0.7);
        this.sound.speak(sc.tts || `${sc.word}。${sc.tip}`);
      };
      wrap.appendChild(div);
    });
  }

  renderCustomPicker(deck) {
    const lessons = this.getLessons();
    deck.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <h2 style="margin:0;font-size:1.38rem;font-weight:900;">🎯 勾選想玩的關卡！</h2>
        </div>
        <div style="display:flex;gap:8px;">
          <button id="btn-custom-all" class="toy-btn sm">全選</button>
          <button id="btn-custom-back" class="toy-btn sm">⬅️ 回去</button>
        </div>
      </div>
      <div class="scope-check-grid" id="scope-grid"></div>
      <div style="text-align:center;margin-top:14px;">
        <button id="btn-launch-custom" class="toy-btn coral" style="font-size:1.15rem;padding:13px 28px;">
          ▶️ 開始玩！（${this.customSelectedIds.size} 關）
        </button>
      </div>
    `;
    document.getElementById('btn-custom-back').onclick = () => this.goHub();
    document.getElementById('btn-custom-all').onclick = () => {
      this.customSelectedIds = new Set(lessons.map((l) => l.id));
      this.render();
    };
    const launchBtn = document.getElementById('btn-launch-custom');
    launchBtn.disabled = this.customSelectedIds.size === 0;
    launchBtn.onclick = () => this.startCustomSession();

    const grid = document.getElementById('scope-grid');
    lessons.forEach((l) => {
      const checked = this.customSelectedIds.has(l.id);
      const thumbSrc = (window.__ART__ && window.__ART__.lessons && window.__ART__.lessons[l.id]) || '';
      const label = document.createElement('label');
      label.className = 'scope-item';
      label.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''} />
        <img src="${thumbSrc}" alt="" style="width:46px;height:32px;border-radius:8px;object-fit:cover;border:2px solid #cbd5e1;flex-shrink:0;" />
        <span>${escapeHtml(l.code)}《${this.fmtText(l.title)}》</span>
      `;
      label.querySelector('input').onchange = (e) => {
        if (e.target.checked) {
          this.customSelectedIds.add(l.id);
          const r = label.getBoundingClientRect();
          this.triggerLessonFX(l.id, r.left + r.width / 2, r.top + 20, 0.6);
        } else {
          this.customSelectedIds.delete(l.id);
        }
        this.render();
      };
      grid.appendChild(label);
    });
  }

  renderPlay(deck) {
    const s = this.session;
    const q = s.questions[s.index];
    const pct = Math.round(((s.index + (s.answered ? 1 : 0)) / s.questions.length) * 100);
    const chest3Done = Boolean(s.chestsClaimed[3]);
    const chest6Done = Boolean(s.chestsClaimed[6]);

    deck.innerHTML = `
      <div class="play-top-row">
        <button id="btn-play-exit" class="toy-btn sm">⬅️ 地圖</button>
        <div class="progress-track-wrap">
          <div class="progress-fill-bar" style="width:${pct}%"></div>
          <span class="milestone-chest" style="left:36%" title="第3題小寶箱（答對送 +15金幣 +1寶石）">${chest3Done ? '🎊' : '🎁'}</span>
          <span class="milestone-chest" style="left:72%" title="第6題小寶箱（答對送 +15金幣 +1寶石）">${chest6Done ? '🎊' : '🎁'}</span>
          <span class="milestone-chest" style="left:98%" title="過關大寶箱">🏆</span>
        </div>
        <div style="font-weight:900;font-size:0.92rem;color:#334155;">
          第 ${s.index + 1} / ${s.questions.length} 關
        </div>
        <button id="btn-speak-now" class="toy-btn sun sm">🔊 唸題目</button>
      </div>

      <div class="question-header">
        <div style="flex:1;">
          <span class="mode-pill">${renderVerticalZhuyin(q.modeBadge || '🌟 闖關挑戰', 'inline')}</span>
          <h2 class="question-prompt">${this.fmtText(q.prompt, q)}</h2>
        </div>
      </div>

      ${q.story ? `<div class="story-reading-box" id="story-box">${this.fmtText(q.story, q)} <button id="btn-read-story" class="toy-btn sm sun" style="margin-left:8px;">🔊 聽故事</button></div>` : ''}

      <div id="interactive-arena"></div>
      <div id="feedback-zone"></div>
    `;

    document.getElementById('btn-play-exit').onclick = () => this.goHub();
    document.getElementById('btn-speak-now').onclick = () => {
      if (q.type === 'bubble') this.sound.playCensorBeep();
      this.sound.speak(q.tts || q.prompt);
    };
    const storyBtn = document.getElementById('btn-read-story');
    if (storyBtn) storyBtn.onclick = () => this.sound.speak(q.story);

    const arena = document.getElementById('interactive-arena');
    if (q.type === 'bubble') {
      if (s.index % 2 === 0) this.renderDartMode(arena, q, s);
      else this.renderBubbleMode(arena, q, s);
    }
    else if (q.type === 'k2_sound') this.renderK2SoundMode(arena, q, s);
    else if (q.type === 'k2_spell') this.renderK2SpellMode(arena, q, s);
    else if (q.type === 'k2_bridge') this.renderK2BridgeMode(arena, q, s);
    else if (q.type === 'k2_mole') this.renderK2MoleMode(arena, q, s);
    else if (q.type === 'typo') this.renderTypoMode(arena, q, s);
    else if (q.type === 'alchemy') this.renderAlchemyMode(arena, q, s);
    else if (q.type === 'train') this.renderTrainMode(arena, q, s);
    else if (q.type === 'judge') this.renderJudgeMode(arena, q, s);
    else this.renderQuizMode(arena, q, s);

    if (s.answered) {
      const fb = document.getElementById('feedback-zone');
      const isLast = s.index + 1 >= s.questions.length;
      const bodyExplain = cleanExplain(q.explain);
      const chestBanner = s.justOpenedChest
        ? `<div><span class="chest-bonus-pill">🎁 第 ${s.justOpenedChest} 關里程碑寶箱打開啦！額外獲得 +15 🪙 金幣 ＆ +1 💎 寶石！</span></div>`
        : '';
      fb.innerHTML = `
        <div class="feedback-sheet ${s.isCorrect ? 'good' : 'retry'}">
          <div class="feedback-text">
            ${chestBanner}
            ${s.isCorrect ? '🎉 <strong>答對囉！</strong> ' : '💡 <strong>學起來就會囉！</strong> '}
            ${this.fmtText(bodyExplain)}
          </div>
          <button id="btn-next-q" class="toy-btn ${s.isCorrect ? 'mint' : 'orange'}" style="font-size:1.08rem;padding:11px 22px;">
            ${isLast ? '🏆 看過關成績與領獎！' : '➡️ 下一關！'}
          </button>
        </div>
      `;
      document.getElementById('btn-next-q').onclick = () => this.nextQuestion();
    }
  }

  renderDartMode(arena, q, s) {
    const highlighted = q.targetHighlight
      ? escapeHtml(q.targetHighlight).replace(/([「『][^」』]+[」』])/g, '<span class="muted-char-focus">$1</span>')
      : '';
    arena.innerHTML = `
      ${highlighted ? `
        <div class="target-word-banner">
          <div class="muted-hint-chip">🔇 自己讀！</div>
          <div class="target-word-main">${highlighted}</div>
        </div>
      ` : ''}
      <div class="dart-arena-box">
        <div class="dart-arena-hint">🎯 射中正確注音！</div>
        <div class="dart-targets-grid" id="dart-wrap"></div>
        <div class="dart-launcher-bar" id="dart-launcher">🎯 點靶心發射！</div>
      </div>
    `;
    const wrap = document.getElementById('dart-wrap');
    const launcher = document.getElementById('dart-launcher');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `dart-target-btn d-${idx}`;
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      btn.innerHTML = `
        <span class="dart-ring-outer">
          <span class="dart-ring-mid">
            <span class="dart-ring-core">${renderVerticalZhuyin(opt, 'dart')}</span>
          </span>
        </span>
      `;
      btn.onclick = () => {
        if (s.answered || q._dartFlying) return;
        q._dartFlying = true;
        this.sound.playDartThrow();
        const r = btn.getBoundingClientRect();
        const lr = launcher ? launcher.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 60, width: 0, height: 0 };
        const fromX = lr.left + lr.width / 2;
        const fromY = lr.top + lr.height / 2;
        const toX = r.left + r.width / 2;
        const toY = r.top + r.height / 2;
        this.fx.flyDart(fromX, fromY, toX, toY, () => {
          q._dartFlying = false;
          this.handleAnswer(opt === q.answer, opt);
        });
      };
      wrap.appendChild(btn);
    });
  }

  renderBubbleMode(arena, q, s) {
    const highlighted = q.targetHighlight
      ? escapeHtml(q.targetHighlight).replace(/([「『][^」』]+[」』])/g, '<span class="muted-char-focus">$1</span>')
      : '';
    arena.innerHTML = `
      ${highlighted ? `
        <div class="target-word-banner">
          <div class="muted-hint-chip">🔇 自己讀！</div>
          <div class="target-word-main">${highlighted}</div>
        </div>
      ` : ''}
      <div class="bubbles-stage" id="bubbles-wrap"></div>
    `;
    const wrap = document.getElementById('bubbles-wrap');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'bubble-opt-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      btn.innerHTML = renderVerticalZhuyin(opt, 'bubble');
      btn.onclick = () => {
        if (s.answered) return;
        const r = btn.getBoundingClientRect();
        this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#38bdf8', 90);
        this.handleAnswer(opt === q.answer, opt);
      };
      wrap.appendChild(btn);
    });
  }

  renderTypoMode(arena, q, s) {
    const stepText = s.answered
      ? `✅ ${q.chars.map((c, i) => (i === q.wrongIndex ? `【${q.answer}】` : c)).join('')}`
      : !q.caughtBug
        ? '🐛 點出寫錯的字！'
        : `🔨 敲對的字！`;

    // Count real (non-punctuation) character ordinal of wrongIndex for accurate kid hints
    let realWrongOrd = 0;
    for (let i = 0; i <= q.wrongIndex; i++) {
      if (!PUNCT_RE.test(q.chars[i])) realWrongOrd++;
    }

    arena.innerHTML = `
      <div class="typo-step-banner" id="typo-banner">${escapeHtml(stepText)}</div>
      <div class="typo-sentence-grid" id="typo-chars"></div>
      <div class="mole-meadow-arena" id="typo-stamps" style="${!q.caughtBug && !s.answered ? 'display:none;' : ''}">
        <div class="mole-arena-title">🔨 敲對的字！</div>
        <div class="mole-holes-grid" id="mole-holes-grid"></div>
      </div>
    `;

    const charsWrap = document.getElementById('typo-chars');
    q.chars.forEach((ch, idx) => {
      if (PUNCT_RE.test(ch)) {
        const span = document.createElement('span');
        span.className = 'char-punct';
        span.textContent = ch;
        charsWrap.appendChild(span);
        return;
      }

      const btn = document.createElement('button');
      btn.className = 'char-tile-btn';
      btn.id = `char-tile-${idx}`;
      if (s.answered && idx === q.wrongIndex) {
        btn.classList.add('Fixed-stamp');
        btn.textContent = q.answer;
      } else {
        if (q.caughtBug && idx === q.wrongIndex) btn.classList.add('caught-bug');
        btn.textContent = ch;
      }
      btn.onclick = () => {
        if (s.answered || q.caughtBug) return;
        if (idx === q.wrongIndex) {
          q.caughtBug = true;
          this.sound.playMolePop();
          const r = btn.getBoundingClientRect();
          this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#4ade80', 85);
          if (this.state.autoRead) this.sound.speak('抓到了！敲對的字！');
          this.render();
        } else {
          q.wrongTaps = (q.wrongTaps || 0) + 1;
          this.sound.playTap();
          btn.classList.remove('shake-no');
          void btn.offsetWidth;
          btn.classList.add('shake-no');
          const banner = document.getElementById('typo-banner');
          if (banner) {
            banner.textContent = q.wrongTaps >= 2
              ? `💡 看看第 ${realWrongOrd} 個字「${q.chars[q.wrongIndex]}」！`
              : `「${ch}」對喔，再找找 🔍`;
          }
        }
      };
      charsWrap.appendChild(btn);
    });

    if (q.caughtBug || s.answered) {
      const holes = document.getElementById('mole-holes-grid');
      const moleSrc = (window.__ART__ && window.__ART__.mole) || '';
      q.shuffledOptions.forEach((opt, idx) => {
        const hole = document.createElement('button');
        hole.className = `mole-hole-btn m-${idx}`;
        hole.dataset.optIdx = idx;
        if (s.answered) {
          if (opt === q.answer) hole.classList.add('correct-pick');
          else if (opt === s.pickedValue) hole.classList.add('wrong-pick');
        }
        hole.innerHTML = `
          <span class="mole-hammer">🔨</span>
          <span class="mole-critter">
            <img class="mole-pixar-img" src="${moleSrc}" alt="地鼠" />
            <span class="mole-sign">${escapeHtml(opt)}</span>
          </span>
          <span class="mole-mound"></span>
        `;
        hole.onclick = () => {
          if (s.answered || q._moleWhacking) return;
          q._moleWhacking = true;
          hole.classList.add('whacking');
          const isOk = opt === q.answer;
          this.sound.playHammerBonk(isOk);
          const r = hole.getBoundingClientRect();
          this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, isOk ? '#fde047' : '#fb7185', 95);
          this.fx.screenShake(7);
          setTimeout(() => {
            q._moleWhacking = false;
            this.handleAnswer(isOk, opt);
          }, 220);
        };
        holes.appendChild(hole);
      });
    }
  }

  renderAlchemyMode(arena, q, s) {
    const isVertical = q.position === 'top';
    const formulaHtml = isVertical
      ? `
        <div class="alchemy-formula">
          <div class="alchemy-stack" title="上下疊合結構">
            <div class="alchemy-slot">${escapeHtml(q.basePart)}</div>
            <div class="alchemy-plus">＋</div>
            <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.answer) : '？'}</div>
          </div>
          <div class="alchemy-plus">＝</div>
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '✨'}</div>
        </div>
      `
      : `
        <div class="alchemy-formula">
          <div class="alchemy-slot">${escapeHtml(q.basePart)}</div>
          <div class="alchemy-plus">＋</div>
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.answer) : '？'}</div>
          <div class="alchemy-plus">＝</div>
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '✨'}</div>
        </div>
      `;

    arena.innerHTML = `
      <div class="alchemy-arena">
        <div style="font-weight:800;color:#475569;font-size:0.96rem;">
          💡 造詞提示：${this.fmtText(q.wordHint, q)} ${isVertical ? '（上下疊合）' : '（左右組合）'}
        </div>
        ${formulaHtml}
      </div>
      <div class="options-grid" id="alchemy-opts"></div>
    `;
    const wrap = document.getElementById('alchemy-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-card-btn';
      btn.dataset.optIdx = idx;
      btn.style.fontSize = '1.48rem';
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.attachOptionContent(btn, opt, q);
      btn.onclick = () => {
        if (s.answered) return;
        this.handleAnswer(opt === q.answer, opt);
      };
      wrap.appendChild(btn);
    });
  }

  renderTrainMode(arena, q, s) {
    arena.innerHTML = `
      ${q.trainRetryMsg && !s.answered ? `<div class="train-retry-banner" id="train-retry-msg">${escapeHtml(q.trainRetryMsg)}</div>` : ''}
      <div class="train-track-box" id="train-track">
        <span class="train-engine">🚂</span>
      </div>
      <div class="train-pool" id="train-pool"></div>
    `;
    const track = document.getElementById('train-track');
    const pool = document.getElementById('train-pool');

    const activeList = s.answered ? q.answerOrder.map((text) => ({ text })) : q.hooked;
    if (activeList.length === 0) {
      const hint = document.createElement('span');
      hint.style.color = '#64748b';
      hint.style.fontWeight = '800';
      hint.textContent = '👆 依序點選下面的車廂卡片，掛上彩虹火車頭！（掛錯點車廂可取下）';
      track.appendChild(hint);
    } else {
      activeList.forEach((car, hIdx) => {
        const b = document.createElement('button');
        b.className = 'train-hooked-car';
        b.innerHTML = this.fmtText(car.text, q);
        if (!s.answered) {
          b.title = '點擊可取下車廂重排';
          b.onclick = () => {
            this.sound.playTap();
            const removed = q.hooked.splice(hIdx, 1)[0];
            const orig = q.poolCarriages.find((c) => c.id === removed.id);
            if (orig) orig.used = false;
            this.render();
          };
        }
        track.appendChild(b);
      });
    }

    if (!s.answered) {
      q.poolCarriages.forEach((car, idx) => {
        if (car.used) return;
        const btn = document.createElement('button');
        btn.className = 'toy-btn primary';
        btn.dataset.optIdx = idx;
        btn.style.fontSize = '1.15rem';
        btn.innerHTML = `🚃 ${this.fmtText(car.text, q)}`;
        btn.onclick = () => {
          car.used = true;
          q.hooked.push(car);
          q.trainRetryMsg = '';
          this.sound.playHook();
          if (q.hooked.length === q.answerOrder.length) {
            const ok = q.hooked.map((c) => c.text).join('|') === q.answerOrder.join('|');
            if (ok) {
              this.sound.playTrainHorn();
              this.handleAnswer(true, q.hooked.map((c) => c.text).join(''));
            } else if ((q.trainRetries || 0) < 1) {
              // Give 1 friendly retry before breaking combo!
              q.trainRetries = (q.trainRetries || 0) + 1;
              q.hooked = [];
              q.poolCarriages.forEach((c) => { c.used = false; });
              q.trainRetryMsg = '🚂 順序差一點點喔！車廂已退回，再聽一次題目重排看看（保住連擊機會！）';
              this.sound.playWrong();
              if (this.state.autoRead) {
                this.sound.speak('順序差一點點喔！再排一次試試看！');
              }
              this.render();
              this.scrollFeedbackIntoView();
            } else {
              this.handleAnswer(false, q.hooked.map((c) => c.text).join(''));
            }
          } else {
            this.render();
          }
        };
        pool.appendChild(btn);
      });
    }
  }

  renderJudgeMode(arena, q, s) {
    arena.innerHTML = `
      <div class="judge-statement-box">
        ${this.fmtText(q.statement, q)}
        <button id="btn-read-stmt" class="toy-btn sm sun" style="margin-left:8px;vertical-align:middle;" title="聽敘述">🔊</button>
      </div>
      <div class="judge-buttons-row">
        <button id="judge-yes" data-opt-idx="0" class="toy-btn mint judge-big-btn">⭕ 對！正確</button>
        <button id="judge-no" data-opt-idx="1" class="toy-btn coral judge-big-btn">❌ 錯！不對</button>
      </div>
    `;
    const stmtBtn = document.getElementById('btn-read-stmt');
    if (stmtBtn) stmtBtn.onclick = () => this.sound.speak(q.statement);

    const yesBtn = document.getElementById('judge-yes');
    const noBtn = document.getElementById('judge-no');
    if (s.answered) {
      if (q.answer === '⭕') {
        yesBtn.classList.add('correct-pick');
        if (s.pickedValue === '❌') noBtn.classList.add('wrong-pick');
      } else {
        noBtn.classList.add('correct-pick');
        if (s.pickedValue === '⭕') yesBtn.classList.add('wrong-pick');
      }
    }
    yesBtn.onclick = () => { if (!s.answered) this.handleAnswer(q.answer === '⭕', '⭕'); };
    noBtn.onclick = () => { if (!s.answered) this.handleAnswer(q.answer === '❌', '❌'); };
  }

  renderQuizMode(arena, q, s) {
    arena.innerHTML = `<div class="options-grid" id="quiz-opts"></div>`;
    const wrap = document.getElementById('quiz-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-card-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.attachOptionContent(btn, opt, q);
      btn.onclick = () => {
        if (s.answered) return;
        this.handleAnswer(opt === q.answer, opt);
      };
      wrap.appendChild(btn);
    });
  }

  renderK2SoundMode(arena, q, s) {
    const useDart = s.index % 2 === 0;
    arena.innerHTML = `
      <button type="button" class="k2-hero-clue-card" id="btn-k2-clue" title="點我再聽一次！">
        <span class="k2-clue-pic">${escapeHtml(q.pic || '🌟')}</span>
        <span class="k2-clue-hanzi">${escapeHtml(q.charFocus || '')}</span>
        <span class="k2-speak-tag">🔊 點聽發音</span>
      </button>
      ${useDart ? `
        <div class="dart-arena-box">
          <div class="dart-arena-hint">🎯 聽聲音，射中對的注音！</div>
          <div class="dart-targets-grid" id="k2-sound-wrap"></div>
          <div class="dart-launcher-bar" id="dart-launcher">🎯 點靶心發射！</div>
        </div>
      ` : `
        <div class="bubbles-stage" id="k2-sound-wrap"></div>
      `}
    `;

    const clueBtn = document.getElementById('btn-k2-clue');
    if (clueBtn) {
      clueBtn.onclick = () => {
        this.sound.playPop();
        this.sound.speak(q.tts || q.charFocus);
      };
    }

    const wrap = document.getElementById('k2-sound-wrap');
    const launcher = document.getElementById('dart-launcher');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.optIdx = idx;
      if (useDart) {
        btn.className = `dart-target-btn d-${idx}`;
        if (s.answered) {
          if (opt === q.answer) btn.classList.add('correct-pick');
          else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
        }
        btn.innerHTML = `
          <span class="dart-ring-outer">
            <span class="dart-ring-mid">
              <span class="dart-ring-core">${renderVerticalZhuyin(opt, 'dart')}</span>
            </span>
          </span>
        `;
        btn.onclick = () => {
          if (s.answered || q._dartFlying) return;
          q._dartFlying = true;
          this.sound.playDartThrow();
          const r = btn.getBoundingClientRect();
          const lr = launcher ? launcher.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 60, width: 0, height: 0 };
          this.fx.flyDart(lr.left + lr.width / 2, lr.top + lr.height / 2, r.left + r.width / 2, r.top + r.height / 2, () => {
            q._dartFlying = false;
            this.handleAnswer(opt === q.answer, opt);
          });
        };
      } else {
        btn.className = 'bubble-opt-btn';
        if (s.answered) {
          if (opt === q.answer) btn.classList.add('correct-pick');
          else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
        }
        btn.innerHTML = renderVerticalZhuyin(opt, 'bubble');
        btn.onclick = () => {
          if (s.answered) return;
          const r = btn.getBoundingClientRect();
          this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#38bdf8', 90);
          this.handleAnswer(opt === q.answer, opt);
        };
      }
      wrap.appendChild(btn);
    });
  }

  renderK2SpellMode(arena, q, s) {
    const firstIsMissing = q.missingPos === 'first';
    const fixedSlotHtml = `<button type="button" class="alchemy-slot k2-zy-slot k2-fixed-tap" id="btn-k2-fixed-zy" title="點我聽注音發音">${renderVerticalZhuyin(q.fixedPart, 'bubble')}</button>`;
    const mysterySlotHtml = `<div class="alchemy-slot k2-zy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? renderVerticalZhuyin(q.answer, 'bubble') : '？'}</div>`;
    const slot1Html = firstIsMissing ? mysterySlotHtml : fixedSlotHtml;
    const slot2Html = !firstIsMissing ? mysterySlotHtml : fixedSlotHtml;
    const toneHtml = q.toneLabel ? `<span class="k2-tone-pill">${escapeHtml(q.toneLabel)}</span>` : '';

    arena.innerHTML = `
      <div class="alchemy-arena k2-spell-arena">
        <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點我聽拼音提示！">
          <span class="k2-clue-pic">${escapeHtml(q.pic || '🧪')}</span>
          <span class="k2-speak-tag">🔊 點聽拼音</span>
        </button>
        <div class="alchemy-formula">
          ${slot1Html}
          <div class="alchemy-plus">＋</div>
          ${slot2Html}
          ${toneHtml}
          <div class="alchemy-plus">＝</div>
          <button type="button" class="alchemy-slot k2-hanzi-goal ${s.answered ? 'result-forged' : ''}" id="btn-k2-goal-hanzi" title="點我聽國字發音">
            ${s.answered ? renderCharWithZhuyin(q.resultChar, q.fullZhuyin, 'k2ruby') : escapeHtml(q.resultChar)}
          </button>
        </div>
      </div>
      <div class="options-grid k2-spell-opts" id="k2-spell-opts"></div>
    `;

    const clueBtn = document.getElementById('btn-k2-clue');
    if (clueBtn) {
      clueBtn.onclick = () => {
        this.sound.playPop();
        this.sound.speak(q.tts || q.resultChar);
      };
    }
    const fixedBtn = document.getElementById('btn-k2-fixed-zy');
    if (fixedBtn) {
      fixedBtn.onclick = () => {
        this.sound.speak(Array.from(q.fixedPart || '').join('、'));
      };
    }
    const goalBtn = document.getElementById('btn-k2-goal-hanzi');
    if (goalBtn) {
      goalBtn.onclick = () => {
        this.sound.speak(q.resultChar);
      };
    }

    const wrap = document.getElementById('k2-spell-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card-btn k2-zy-card-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      btn.innerHTML = `
        <span class="k2-zy-opt-center">${renderVerticalZhuyin(opt, 'bubble')}</span>
        <span role="button" tabindex="0" class="opt-speak-chip" title="聽注音發音">🔊</span>
      `;
      const spk = btn.querySelector('.opt-speak-chip');
      if (spk) {
        spk.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.sound.speak(opt);
        };
      }
      btn.onclick = () => {
        if (s.answered) return;
        this.handleAnswer(opt === q.answer, opt);
      };
      wrap.appendChild(btn);
    });
  }

  renderK2BridgeMode(arena, q, s) {
    arena.innerHTML = `
      <button type="button" class="k2-hero-clue-card" id="btn-k2-clue" title="點圖再聽一次！">
        <span class="k2-clue-pic giant">${escapeHtml(q.pic || '🌟')}</span>
        <span class="k2-speak-tag">🔊 點圖聽聲音</span>
      </button>
      <div class="options-grid k2-bridge-grid" id="k2-bridge-opts"></div>
    `;

    const clueBtn = document.getElementById('btn-k2-clue');
    if (clueBtn) {
      clueBtn.onclick = () => {
        this.sound.playPop();
        this.sound.speak(q.tts || q.answer);
      };
    }

    const wrap = document.getElementById('k2-bridge-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card-btn k2-bridge-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      const zy = q.optZhuyin && q.optZhuyin[opt];
      btn.innerHTML = `
        <span class="k2-bridge-char-wrap">${renderCharWithZhuyin(opt, zy, 'k2ruby')}</span>
        <span role="button" tabindex="0" class="opt-speak-chip" title="聽這個字的發音">🔊</span>
      `;
      const spk = btn.querySelector('.opt-speak-chip');
      if (spk) {
        spk.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.sound.speak(opt);
        };
      }
      btn.onclick = () => {
        if (s.answered) return;
        this.handleAnswer(opt === q.answer, opt);
      };
      wrap.appendChild(btn);
    });
  }

  renderK2MoleMode(arena, q, s) {
    arena.innerHTML = `
      <button type="button" class="k2-hero-clue-card" id="btn-k2-clue" title="點我聽聲音提示！">
        <span class="k2-clue-pic">${escapeHtml(q.pic || '🌟')}</span>
        ${q.hintZhuyin ? `<span class="k2-mole-zy-badge">${renderVerticalZhuyin(q.hintZhuyin, 'bubble')}</span>` : ''}
        <span class="k2-speak-tag">🔊 點聽找國字</span>
      </button>
      <div class="mole-meadow-arena">
        <div class="mole-arena-title">🔨 敲出對的國字地鼠！</div>
        <div class="mole-holes-grid" id="mole-holes-grid"></div>
      </div>
    `;

    const clueBtn = document.getElementById('btn-k2-clue');
    if (clueBtn) {
      clueBtn.onclick = () => {
        this.sound.playPop();
        this.sound.speak(q.tts || q.answer);
      };
    }

    const holes = document.getElementById('mole-holes-grid');
    const moleSrc = (window.__ART__ && window.__ART__.mole) || '';
    q.shuffledOptions.forEach((opt, idx) => {
      const hole = document.createElement('button');
      hole.type = 'button';
      hole.className = `mole-hole-btn m-${idx}`;
      hole.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) hole.classList.add('correct-pick');
        else if (opt === s.pickedValue) hole.classList.add('wrong-pick');
      }
      hole.innerHTML = `
        <span class="mole-hammer">🔨</span>
        <span class="mole-critter">
          <img class="mole-pixar-img" src="${moleSrc}" alt="地鼠" />
          <span class="mole-sign k2-mole-hanzi">${escapeHtml(opt)}</span>
        </span>
        <span class="mole-mound"></span>
      `;
      hole.onclick = () => {
        if (s.answered || q._moleWhacking) return;
        q._moleWhacking = true;
        hole.classList.add('whacking');
        const isOk = opt === q.answer;
        this.sound.playHammerBonk(isOk);
        const r = hole.getBoundingClientRect();
        this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, isOk ? '#fde047' : '#fb7185', 95);
        this.fx.screenShake(7);
        setTimeout(() => {
          q._moleWhacking = false;
          this.handleAnswer(isOk, opt);
        }, 220);
      };
      holes.appendChild(hole);
    });
  }

  renderVictory(deck) {
    const s = this.session;
    const canGacha = this.state.coins >= 50;
    deck.innerHTML = `
      <div class="victory-center">
        <span class="mode-pill">🎊 闖關大成功！</span>
        <h2 style="margin:8px 0 4px;font-size:1.65rem;font-weight:900;">${renderVerticalZhuyin(s.title, 'inline')}</h2>
        <div class="victory-stars">${this.renderStars(s.finalStars)}</div>
        <p style="font-size:1.15rem;font-weight:900;color:#334155;margin:6px 0 14px;">
          答對 ${s.correctCount} / ${s.questions.length} 題 ・ 最高 ${s.maxCombo} 連擊 ・ 獲得 🪙 +${s.earnedCoins} 金幣 ＆ 💎 +${s.earnedGems} 寶石！
        </p>
        ${s.unlockedSpecialDragon ? `<div style="background:#fef9c3;padding:10px 16px;border-radius:16px;font-weight:900;color:#b45309;margin-bottom:14px;">🐉 傳說降臨！你以三星滿分擊敗大魔王，免費獲得神話神獸【星光狀元龍】！</div>` : ''}
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:10px;">
          ${canGacha ? `<button id="btn-vic-gacha" class="toy-btn sun" style="font-size:1.12rem;padding:12px 22px;">🎰 去轉 3D 扭蛋抽神獸！（目前 ${this.state.coins} 🪙）</button>` : ''}
          <button id="btn-vic-hub" class="toy-btn primary" style="font-size:1.12rem;padding:12px 22px;">🗺️ 回地圖選下一關</button>
        </div>
      </div>
    `;
    const gBtn = document.getElementById('btn-vic-gacha');
    if (gBtn) gBtn.onclick = () => this.openGacha();
    document.getElementById('btn-vic-hub').onclick = () => this.goHub();
  }

  renderGacha(deck) {
    const canSpin = this.state.coins >= 50 && !this.gachaRolling;
    deck.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <h2 style="margin:0;font-size:1.38rem;font-weight:900;">
            🎰 扭蛋神獸屋（${this.state.unlockedPets.length} / ${PET_CATALOG.length}）
          </h2>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button id="btn-spin-gacha" class="toy-btn coral" ${!canSpin ? 'disabled style="opacity:0.55;cursor:default;"' : ''}>
            ${this.gachaRolling ? '🎰 轉轉轉...' : '🎰 轉扭蛋 (50🪙)'}
          </button>
          <button id="btn-gacha-back" class="toy-btn">⬅️ 回去</button>
        </div>
      </div>

      ${this.gachaLastWon ? `
        <div class="feedback-sheet good" style="margin-top:12px;">
          <img class="pet-3d-avatar" src="${this.getPetArt(this.gachaLastWon.id)}" alt="" />
          <div class="feedback-text">
            🎉 <strong>${this.gachaLastWon.isNew ? '抽到新夥伴！' : '夥伴升級（+5💎）！'}</strong>
            <strong>${escapeHtml(this.gachaLastWon.name)}</strong>（${escapeHtml(this.gachaLastWon.rarity)}）
          </div>
        </div>
      ` : ''}

      <div class="pets-grid" id="pets-grid"></div>
    `;

    document.getElementById('btn-gacha-back').onclick = () => this.goHub();
    const spinBtn = document.getElementById('btn-spin-gacha');
    if (canSpin) spinBtn.onclick = () => this.spinGacha();

    const grid = document.getElementById('pets-grid');
    PET_CATALOG.forEach((p) => {
      const unlocked = this.state.unlockedPets.includes(p.id);
      const equipped = this.state.equippedPet === p.id;
      const card = document.createElement('div');
      card.className = `pet-card ${equipped ? 'equipped' : ''} ${!unlocked ? 'locked' : ''}`;
      card.id = `pet-card-${p.id}`;
      card.innerHTML = `
        ${unlocked
          ? `<img class="pet-3d-avatar" src="${this.getPetArt(p.id)}" alt="${escapeHtml(p.name)}" />`
          : `<div class="pet-emoji">🥚</div>`}
        <div class="pet-name">${unlocked ? escapeHtml(p.name) : '？？？'}</div>
        <div class="pet-rarity">${escapeHtml(p.rarity)}</div>
        <div style="font-size:0.75rem;color:#475569;margin-top:4px;font-weight:800;">
          ${equipped ? '⭐ 陪伴中' : unlocked ? '點我上場' : '轉扭蛋'}
        </div>
      `;
      if (unlocked) {
        card.onclick = () => {
          const r = card.getBoundingClientRect();
          this.fx.confettiBurst(r.left + r.width / 2, r.top + 40, 22);
          this.equipPet(p.id);
        };
      }
      grid.appendChild(card);
    });
  }

  renderReport(deck) {
    const k2Stars = K2_LESSONS.reduce((s, l) => s + (this.state.stars[l.id] || 0), 0);
    const g1Stars = GRADE1_LESSONS.reduce((s, l) => s + (this.state.stars[l.id] || 0), 0);
    const g2Stars = GRADE2_LESSONS.reduce((s, l) => s + (this.state.stars[l.id] || 0), 0);
    const totalMistakes = Object.keys(this.state.mistakes).length;

    deck.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <span class="mode-pill">📊 學習進度與榮譽榜</span>
          <h2 style="margin:4px 0 0;font-size:1.42rem;font-weight:900;">奇幻學習榮譽戰報</h2>
        </div>
        <button id="btn-report-back" class="toy-btn primary">⬅️ 回冒險地圖</button>
      </div>

      <div class="review-hero-strip" style="margin-top:14px;">
        <div class="hero-action-card">
          <h3 class="hero-card-title">🐥 幼兒中班（第1～8關）</h3>
          <p class="hero-card-desc">累計星星：<strong>${k2Stars} / 24 ⭐</strong><br>識字魔王戰：${this.renderStars(this.state.stars.boss_k2 || 0)}</p>
        </div>
        <div class="hero-action-card">
          <h3 class="hero-card-title">🐣 一年級進度（第1～7課）</h3>
          <p class="hero-card-desc">累計星星：<strong>${g1Stars} / 21 ⭐</strong><br>期末魔王戰：${this.renderStars(this.state.stars.boss_g1 || 0)}</p>
        </div>
        <div class="hero-action-card">
          <h3 class="hero-card-title">🚀 二年級進度（第7～12課）</h3>
          <p class="hero-card-desc">累計星星：<strong>${g2Stars} / 18 ⭐</strong><br>期末魔王戰：${this.renderStars(this.state.stars.boss_g2 || 0)}</p>
        </div>
        <div class="hero-action-card">
          <h3 class="hero-card-title">🏅 冒險家紀錄</h3>
          <p class="hero-card-desc">最高連擊：<strong>${this.state.bestCombo} 連擊</strong><br>神獸收集：<strong>${this.state.unlockedPets.length} / 12 隻</strong><br>待修補錯題：<strong>${totalMistakes} 題</strong></p>
        </div>
      </div>
      <div class="moe-credit-note">
        🔊 注音符號真人發音素材：2017 © 教育部，國語注音符號手冊-開放部件（依「創用CC 姓名標示 4.0 國際版本」授權利用）
      </div>
    `;
    document.getElementById('btn-report-back').onclick = () => this.goHub();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__app = new ChineseAdventureApp();
});

