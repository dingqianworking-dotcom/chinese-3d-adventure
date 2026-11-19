const { SoundEngine } = require('./audio');
const { FXEngine } = require('./fx');
const { annotateZhuyin, renderVerticalZhuyin, renderCharWithZhuyin, escapeHtml } = require('./zhuyin_helper');
const {
  iconBrandCrest,
  iconGoldCoin,
  iconStarGem,
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
} = require('./ui_icons');
const { World3DEngine } = require('./webgl3d');
const {
  HERO_STAGE_META,
  getHeroRigByMode,
  getSwimmingFishSvg,
  getGachaCapsuleSvg,
  getJeweledKeySvg,
} = require('./arcade_rigs');
const { K2_LESSONS, K2_BOSS_EXTRAS } = require('./curriculum_k2');
const { GRADE1_LESSONS, GRADE1_BOSS_EXTRAS } = require('./curriculum_g1');
const { GRADE2_LESSONS, GRADE2_BOSS_EXTRAS, PET_CATALOG } = require('./curriculum_g2');

const STORAGE_KEY = 'chinese_3d_final_exam_v2';
const PUNCT_RE = /^[，。！？、：；「」『』（）…—]$/;

const PRAISE_BADGES = [
  '神準滿分！',
  '太厲害了！',
  '百發百中！',
  '閃電學霸！',
  '表現超棒！',
  '火力全開！',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sleepMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanExplain(text) {
  if (!text) return '';
  return stripDisplayEmojis(String(text)).replace(
    /^(答對[^！!]*|太[^！!]*|超[^！!]*|完全[^！!]*|神[^！!]*|百發百中|一百分|滿分|叮咚[^！!]*|轟隆[^！!]*|金光[^！!]*|閃耀[^！!]*|合成[^！!]*|破案[^！!]*|抓到[^！!]*|抓得好|沒錯|沒被騙[^！!]*|嘟嘟[^！!]*|月考[^！!]*|魔王題[^！!]*|學霸[^！!]*|理解力[^！!]*|三胞胎[^！!]*|射中[^！!]*|射得好|成語[^！!]*|觀念[^！!]*|邏輯[^！!]*|想像力[^！!]*|暖心[^！!]*|精準[^！!]*|訂正[^！!]*|火眼金睛|眼力[^！!]*|素養[^！!]*|閱讀[^！!]*|哈哈[^！!]*|破解[^！!]*|好棒[^！!]*|好厲害[^！!]*)[！!]\s*/,
    ''
  );
}

const LESSON_FX_CONFIG = {
  k2_L1: { action: '點亮溫馨小屋', cheer: '爸爸媽媽抱抱！', colors: ['#f472b6', '#fb7185', '#fde047'], focus: '聲母 ㄅㄆㄇㄈ・生活識字 4 字', floatUp: true },
  k2_L2: { action: '召喚快樂動物', cheer: '動物朋友嗨！', colors: ['#34d399', '#fb923c', '#fde047'], focus: '聲母 ㄉㄊㄋㄌ・動物與動作詞', floatUp: true },
  k2_L3: { action: '開啟汪喵派對', cheer: '汪汪喵喵！', colors: ['#38bdf8', '#fb7185', '#fde047'], focus: '聲母 ㄍㄎㄏ・日常核心字彙', floatUp: true },
  k2_L4: { action: '點亮小雞果園', cheer: '啾啾開心唱！', colors: ['#facc15', '#fb7185', '#4ade80'], focus: '聲母 ㄐㄑㄒ・數量與食物字', floatUp: true },
  k2_L5: { action: '點亮太陽山水', cheer: '陽光亮晶晶！', colors: ['#fde047', '#38bdf8', '#4ade80'], focus: '翹舌音 ㄓㄔㄕㄖ・自然象形字', floatUp: true },
  k2_L6: { action: '點亮森林數數', cheer: '一二三四五！', colors: ['#10b981', '#fde047', '#38bdf8'], focus: '平舌音 ㄗㄘㄙ・數字與時間字', floatUp: true },
  k2_L7: { action: '點亮星夜月光', cheer: '晚安小綿羊！', colors: ['#818cf8', '#f472b6', '#fde047'], focus: '介音 ㄧㄨㄩ・動物與情感字', floatUp: true },
  k2_L8: { action: '點亮識字神樹', cheer: '識字小狀元！', colors: ['#fb7185', '#fde047', '#4ade80'], focus: '韻母總合拼讀・幼小銜接核心字', floatUp: true },
  g1_L1: { action: '小船乘風破浪', cheer: '乘風破浪！', colors: ['#38bdf8', '#0ea5e9', '#fde047'], focus: '字音字形・彎彎的月兒與小船比喻', floatUp: false },
  g1_L2: { action: '綻放彩虹手印', cheer: '五彩手印！', colors: ['#fb7185', '#facc15', '#c084fc'], focus: '部首辨析・手印變花朵創意造句', floatUp: true },
  g1_L3: { action: '吹出七彩泡泡', cheer: '泡泡飛高高！', colors: ['#38bdf8', '#c084fc', '#f472b6'], focus: '前後鼻音・量詞與動態語詞運用', floatUp: true },
  g1_L4: { action: '呼喚山谷回音', cheer: '你好～你好～！', colors: ['#4ade80', '#38bdf8', '#fde047'], focus: '禮貌對話・山谷回音課文理解', floatUp: true },
  g1_L5: { action: '啟動星際飛碟', cheer: '星際好朋友！', colors: ['#a855f7', '#38bdf8', '#fde047'], focus: '形近字訂正・想像力閱讀推論', floatUp: true },
  g1_L6: { action: '小金魚吐泡泡', cheer: '游來游去真開心！', colors: ['#fb923c', '#38bdf8', '#fde047'], focus: '動作疊詞・池塘生態情境理解', floatUp: true },
  g1_L7: { action: '施放迎春煙火', cheer: '新年快樂！', colors: ['#ef4444', '#fde047', '#fb923c'], focus: '節慶吉祥話・過年習俗閱讀統整', floatUp: true },
  g2_L7: { action: '小兔森林跳躍', cheer: '活力滿滿！', colors: ['#4ade80', '#fb923c', '#fde047'], focus: '寓言成語・守株待兔寓意推論', floatUp: false },
  g2_L8: { action: '閃耀森林金角', cheer: '金角閃閃發光！', colors: ['#fde047', '#38bdf8', '#4ade80'], focus: '多音字辨析・角色心情轉折理解', floatUp: true },
  g2_L9: { action: '點亮國王皇冠', cheer: '智慧金皇冠！', colors: ['#facc15', '#ef4444', '#38bdf8'], focus: '部首組字・故事因果邏輯判斷', floatUp: false },
  g2_L10: { action: '微風吹拂牧場', cheer: '春暖花開真舒服！', colors: ['#4ade80', '#fde047', '#38bdf8'], focus: '四字語詞・季節景物描寫修辭', floatUp: true },
  g2_L11: { action: '品嚐幸福湯圓', cheer: '團圓甜在心！', colors: ['#f472b6', '#fde047', '#fb7185'], focus: '記事寫作重點・家庭溫暖情感理解', floatUp: true },
  g2_L12: { action: '點亮彩虹瀑布', cheer: '大自然真奇妙！', colors: ['#ef4444', '#fde047', '#38bdf8', '#4ade80'], focus: '譬喻與擬人修辭・自然觀察素養', floatUp: true },
};

const K2_TYPE_TO_MODE = {
  k2_dart: 'dart',
  k2_bubble: 'bubble_pop',
  k2_spell: 'alchemy',
  k2_claw: 'claw',
  k2_fish: 'fish',
  k2_feed: 'feed',
  k2_match: 'memory',
  k2_mole: 'mole',
  k2_chest: 'chest_lock',
};

function assignArcadeModes(questions) {
  const used = new Set();
  const deferred = [];

  // Pass 1: Assign signature primary modes
  questions.forEach((q, idx) => {
    let mode = null;
    if (K2_TYPE_TO_MODE[q.type]) {
      mode = K2_TYPE_TO_MODE[q.type];
    } else if (q.type === 'k2_sound') {
      mode = !used.has('dart') ? 'dart' : 'bubble_pop';
    } else if (q.type === 'k2_bridge') {
      mode = !used.has('fish') ? 'fish' : 'feed';
    } else if (q.type === 'memory') {
      mode = 'memory';
    } else if (q.type === 'train') {
      mode = 'train';
    } else if (q.type === 'judge') {
      mode = 'judge';
    } else if (q.type === 'typo') {
      if (!used.has('mole')) mode = 'mole';
      else if (!used.has('typo_laser')) mode = 'typo_laser';
      else mode = idx % 2 === 0 ? 'mole' : 'typo_laser';
    } else if (q.type === 'alchemy') {
      if (!used.has('alchemy')) mode = 'alchemy';
      else deferred.push(q);
    } else if (q.type === 'bubble') {
      if (!used.has('dart')) mode = 'dart';
      else if (!used.has('bubble_pop')) mode = 'bubble_pop';
      else deferred.push(q);
    } else {
      deferred.push(q);
    }

    if (mode) {
      q._arcadeMode = mode;
      used.add(mode);
    }
  });

  // Pass 2: Assign deferred questions (long options claim spacious 2x2 cabinets)
  const sortedDeferred = [...deferred].sort((a, b) => {
    const maxA = Math.max(0, ...(a.options || []).map((o) => stripDisplayEmojis(o).length));
    const maxB = Math.max(0, ...(b.options || []).map((o) => stripDisplayEmojis(o).length));
    return maxB - maxA;
  });

  sortedDeferred.forEach((q, dIdx) => {
    const maxLen = Math.max(0, ...(q.options || []).map((o) => stripDisplayEmojis(o).length));
    let pool;
    if (q.type === 'bubble') {
      pool = ['claw', 'fish', 'chest_lock', 'feed', 'dart', 'bubble_pop'];
    } else if (maxLen > 5) {
      pool = ['claw', 'fish', 'feed', 'chest_lock'];
    } else {
      pool = ['claw', 'fish', 'feed', 'chest_lock', 'mole', 'bubble_pop', 'dart'];
    }
    let picked = pool.find((m) => !used.has(m));
    if (!picked) {
      picked = pool[dIdx % pool.length];
    }
    q._arcadeMode = picked;
    used.add(picked);
  });

  // Prevent adjacent identical modes in 12-stage Boss / Custom sessions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (i > 0 && q._arcadeMode === questions[i - 1]._arcadeMode) {
      const swapIdx = questions.findIndex((other, j) => j > i && other._arcadeMode !== q._arcadeMode);
      if (swapIdx !== -1) {
        [questions[i], questions[swapIdx]] = [questions[swapIdx], questions[i]];
      }
    }
  }

  questions.forEach((q) => {
    const m = q._arcadeMode || 'claw';
    const meta = HERO_STAGE_META[m] || HERO_STAGE_META.claw;
    if (q.type === 'typo' && m === 'mole') {
      q._arcadeBadge = '抓錯字打地鼠';
    } else {
      q._arcadeBadge = meta.badge;
    }
  });

  return questions;
}

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
    this._flowSeq = 0;
    this._autoAdvanceTimer = null;
    this._bufferReadyTimer = null;
    this._lastHoverSfxAt = 0;

    // Live UI indicator whenever voice starts/finishes speaking
    this.sound.onSpeakStateChange = (speaking) => {
      document.body.classList.toggle('is-voice-speaking', speaking);
      const spkBtn = document.getElementById('btn-speak-now');
      if (spkBtn) spkBtn.classList.toggle('speaking-pulse', speaking);
      const pill = document.getElementById('voice-sync-status');
      if (pill && !speaking && this.session && this.session.answered) {
        pill.classList.add('done-speaking');
        pill.innerHTML = `<span class="voice-dot done"></span><span>講解完成・即將前往下一關</span>`;
      }
    };

    this.canvas = document.getElementById('world3d');
    this.world = new World3DEngine(this.canvas);
    this.world.setPet(this.state.equippedPet);

    this.mountStaticHudIcons();
    this.bindGlobalKeys();
    this.bindStageInteractive();
    this.syncSky(this.getHubSky());
    this.world.setScene(this.state.grade === 'g2' ? 'hub_g2' : 'hub_g1');
    this.render();
  }

  mountStaticHudIcons() {
    const crestEl = document.getElementById('hud-brand-crest');
    if (crestEl) crestEl.innerHTML = iconBrandCrest();
    const coinEl = document.getElementById('hud-coin-icon');
    if (coinEl) coinEl.innerHTML = iconGoldCoin(22);
    const gemEl = document.getElementById('hud-gem-icon');
    if (gemEl) gemEl.innerHTML = iconStarGem(22);
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
        cheer: '奇幻星光！',
        colors: ['#fde047', '#38bdf8', '#fb7185'],
        floatUp: true,
      };
      const safeX = Number.isFinite(x) ? x : window.innerWidth * 0.5;
      const safeY = Number.isFinite(y) ? y : window.innerHeight * 0.4;
      this.sound.playLessonSFX(lessonId);
      this.fx.multiRipple(safeX, safeY, cfg.colors);
      this.fx.emojiBurst(safeX, safeY, cfg.colors, Math.round(14 * intensity), cfg.floatUp);
      this.fx.confettiBurst(safeX, safeY, Math.round(20 * intensity));
      this.fx.floatText(safeX, safeY - 18, cfg.cheer, cfg.colors[0]);
      if (this.view !== 'play') {
        this.world.spawnBurst([0, 0.25, 0.55], Math.round(22 * intensity), cfg.colors);
      }

      const stageWrap = document.getElementById('stage-3d-wrap');
      if (stageWrap && this.view !== 'play') {
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
      if (this.view === 'gacha' || this.view === 'play') return;
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
      coins: 60,
      gems: 3,
      stars: {},
      unlockedPets: ['shiba'],
      equippedPet: 'shiba',
      mistakes: {},
      bestCombo: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      skillStats: {},
      autoRead: true,
      showZhuyin: true,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('chinese_3d_final_exam_v1');
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const merged = { ...fallback, ...parsed };
      if (!['k2', 'g1', 'g2'].includes(merged.grade)) merged.grade = 'g1';
      if (!merged.skillStats || typeof merged.skillStats !== 'object') merged.skillStats = {};
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
    const cleaned = stripDisplayEmojis(text);
    let exclude = (q && q.excludeChars) || '';
    if (q && q.type === 'bubble') {
      exclude += (q.targetHighlight || '') + ((q.prompt || '').match(/[「『]([^」』]+)[」』]/g) || []).join('');
    }
    return annotateZhuyin(cleaned, this.state.showZhuyin, exclude);
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
    if (this.state.grade === 'k2') return ['#fdf2f8', '#fce7f3', '#fffbeb'];
    return this.state.grade === 'g1'
      ? ['#e0f2fe', '#bae6fd', '#fefce8']
      : ['#ecfdf5', '#d1fae5', '#fffbeb'];
  }

  syncSky([top, mid, bot]) {
    const r = document.documentElement.style;
    r.setProperty('--sky-top', top);
    r.setProperty('--sky-mid', mid);
    r.setProperty('--sky-bot', bot);
  }

  bumpCoinChip() {
    const el = document.getElementById('hud-coins-chip') || document.getElementById('play-coins-chip');
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 260);
  }

  showDopaminePopup({ coinGain, isFever, chestStep, praise }) {
    const layer = document.getElementById('play-toast-layer') || document.getElementById('dopamine-fx-layer');
    if (!layer) return;
    if (this._fxTimer) clearTimeout(this._fxTimer);
    layer.innerHTML = `
      <div class="coin-burst-pop">${iconGoldCoin(22)} <span>${escapeHtml(praise)} +${coinGain} 金幣${isFever ? '（雙倍火力）' : ''}</span></div>
      ${chestStep ? `<div class="chest-toast-banner">${iconMilestoneChest(true, false, 24)} <span>第 ${chestStep} 關寶箱開啟！額外 +15 金幣 ＆ +1 寶石</span></div>` : ''}
    `;
    this._fxTimer = setTimeout(() => {
      if (layer) layer.innerHTML = '';
    }, chestStep ? 2400 : 1650);
  }

  scrollFeedbackIntoView() {
    requestAnimationFrame(() => {
      const target = document.getElementById('feedback-zone') || document.getElementById('train-retry-msg');
      if (target && typeof target.scrollIntoView === 'function') {
        const rect = target.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 8 || rect.top < 0) {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  clearAutoTimers() {
    this._flowSeq++;
    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }
    if (this._bufferReadyTimer) {
      clearTimeout(this._bufferReadyTimer);
      this._bufferReadyTimer = null;
    }
  }

  // Wait for BOTH a minimum comfortable visual duration AND full completion of speech (never cutting off voice!)
  scheduleVoiceAwareFlow(speechPromise, minVisualMs, afterSpeechGraceMs, onReady) {
    const token = ++this._flowSeq;
    const pSpeech = Promise.resolve(speechPromise).catch(() => ({ completed: true }));
    const pMin = sleepMs(minVisualMs);

    Promise.all([pSpeech, pMin]).then(([res]) => {
      if (token !== this._flowSeq) return;
      if (res && res.completed === false) return;
      const grace = this.state.autoRead ? afterSpeechGraceMs : 120;
      this._autoAdvanceTimer = setTimeout(() => {
        this._autoAdvanceTimer = null;
        if (token !== this._flowSeq) return;
        onReady();
      }, grace);
    });
  }

  bindGlobalKeys() {
    window.addEventListener('keydown', (e) => {
      if (this.view !== 'play' || !this.session) return;
      if (e.key === 'Enter' || e.key === ' ') {
        if (this.session.finaleBuffer) {
          e.preventDefault();
          this.finishSession();
          return;
        }
        if (this.session.stageBuffer) {
          e.preventDefault();
          this.enterActiveStage();
          return;
        }
        if (this.session.answered) {
          e.preventDefault();
          this.nextQuestion();
          return;
        }
      }
      if (!this.session.answered && !this.session.stageBuffer && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const btns = document.querySelectorAll('[data-opt-idx]');
        if (btns[idx]) btns[idx].click();
      }
    });
  }

  switchGrade(g) {
    this.clearAutoTimers();
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
    this.clearAutoTimers();
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
      if (typeof window !== 'undefined' && window.scrollY > 40) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } catch (_) {}
  }

  findAnyLesson(lessonId) {
    return [...K2_LESSONS, ...GRADE1_LESSONS, ...GRADE2_LESSONS].find((l) => l.id === lessonId) || null;
  }

  openStudy(lessonId) {
    const lesson = this.findAnyLesson(lessonId);
    if (!lesson) return;
    this.clearAutoTimers();
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
        : `${lesson.code}，${stripDisplayEmojis(lesson.title)}，重點字詞導讀！點選字卡可以聽發音喔！`;
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
      title: `${lesson.code}・${stripDisplayEmojis(lesson.title)}`,
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
      ? '幼兒中班總複習・識字小狀元挑戰'
      : g === 'g1'
        ? '一年級總複習・星際魔王決戰'
        : '二年級總複習・奇幻魔王決戰';

    this.launchSession({
      id: `boss_${g}`,
      title: bossTitle,
      scene: 'boss',
      sky: ['#ffe4e6', '#fecdd3', '#fef9c3'],
      isBoss: true,
      isMistakeMode: false,
      questions: combined,
    });
  }

  openCustomPicker() {
    this.clearAutoTimers();
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
      title: `自選課次特訓（共 ${chosen.length} 課）`,
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
      title: '弱點錯題黃金修練',
      scene: 'boss',
      sky: ['#e0f2fe', '#d1fae5', '#fef9c3'],
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
    if ((q.type === 'memory' || q.type === 'k2_match') && Array.isArray(q.pairs)) {
      const cards = [];
      q.pairs.forEach((pair, pIdx) => {
        const pairHanziObj = pair.find((s) => s && typeof s === 'object' && s.hanzi);
        const pairWord = pairHanziObj ? pairHanziObj.hanzi : '';
        pair.forEach((side, sIdx) => {
          const uid = `${pIdx}_${sIdx}`;
          if (side && typeof side === 'object') {
            if (side.hanzi) {
              cards.push({ uid, pairId: pIdx, kind: 'k2_hanzi', hanzi: side.hanzi, tts: side.tts || side.hanzi, flipped: false, matched: false, mismatch: false });
            } else {
              cards.push({ uid, pairId: pIdx, kind: 'k2_pic_zy', pairWord, zy: side.zy || '', tts: side.tts || side.zy || '', flipped: false, matched: false, mismatch: false });
            }
          } else {
            const txt = String(side || '');
            cards.push({ uid, pairId: pIdx, kind: 'text', text: txt, tts: txt, flipped: false, matched: false, mismatch: false });
          }
        });
      });
      let shufCards = shuffle(cards);
      if (shufCards.length >= 4 && shufCards[0].pairId === shufCards[1].pairId && shufCards[2].pairId === shufCards[3].pairId) {
        [shufCards[1], shufCards[2]] = [shufCards[2], shufCards[1]];
      }
      q.memCards = shufCards;
      q.memMatched = 0;
      q.memPeeking = true;
      q._peekTimerSet = false;
      q._memFlippedIds = [];
      q._memLock = false;
    }
    return q;
  }

  launchSession(cfg) {
    this.clearAutoTimers();
    assignArcadeModes(cfg.questions || []);
    const targetSession = {
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
      stageBuffer: true,
      finaleBuffer: false,
      bufferDurationMs: 2100,
    };
    this.session = targetSession;
    this.view = 'play';
    this.syncSky(cfg.sky);
    this.world.bossHpRatio = 1.0;
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.world.setScene(cfg.scene);
    this.sound.playStageReady();

    const firstQ = targetSession.questions[0];
    const firstMeta = HERO_STAGE_META[(firstQ && firstQ._arcadeMode) || 'claw'] || HERO_STAGE_META.claw;
    const introPromise = this.state.autoRead
      ? this.sound.speak(`第 1 關，${firstMeta.readyTitle}`)
      : Promise.resolve({ completed: true });

    this.render();
    this.scrollToStage();

    this.scheduleVoiceAwareFlow(introPromise, 1950, 380, () => {
      if (this.view === 'play' && this.session === targetSession && targetSession.stageBuffer) {
        this.enterActiveStage();
      }
    });
  }

  enterActiveStage() {
    this.clearAutoTimers();
    const s = this.session;
    if (!s || this.view !== 'play') return;
    s.stageBuffer = false;
    this.sound.playPop();
    this.render();
    this.scrollToStage();
    this.autoSpeakCurrent();
  }

  autoSpeakCurrent() {
    if (!this.state.autoRead || !this.session || this.session.stageBuffer || this.session.finaleBuffer) return;
    const q = this.session.questions[this.session.index];
    if (q) {
      if (q.type === 'bubble') this.sound.playCensorBeep();
      this.sound.speak(q.tts || q.prompt);
    }
  }

  recordSkillProgress(q, isRight) {
    this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
    if (isRight) this.state.totalCorrect = (this.state.totalCorrect || 0) + 1;
    const meta = getQuestionSkillMeta(q);
    if (!this.state.skillStats) this.state.skillStats = {};
    const cur = this.state.skillStats[meta.tag] || { right: 0, total: 0 };
    cur.total += 1;
    if (isRight) cur.right += 1;
    this.state.skillStats[meta.tag] = cur;
  }

  handleAnswer(isRight, pickedVal = null) {
    const s = this.session;
    if (!s || s.answered) return;
    this.clearAutoTimers();
    const q = s.questions[s.index];
    s.answered = true;
    s.isCorrect = isRight;
    s.pickedValue = pickedVal;
    s.justOpenedChest = 0;

    this.recordSkillProgress(q, isRight);
    const bodyExplain = cleanExplain(q.explain);
    let speechPromise = Promise.resolve({ completed: true });

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
        this.fx.confettiBurst(cx, cy * 0.7, 56);
        this.fx.shockwave(cx, cy * 0.7, '#fb7185', 140);
        this.fx.floatText(cx, cy * 0.7, '星光砲命中！', '#fb7185');
        this.fx.screenShake(9);
        const remaining = Math.max(0, 1 - s.correctCount / s.questions.length);
        this.world.bossHpRatio = remaining;
      } else {
        this.sound.playCorrect(s.combo);
        this.fx.confettiBurst(cx, cy, s.combo >= 3 ? 48 : 32);
        if (lCfg) {
          this.fx.multiRipple(cx, cy * 0.65, lCfg.colors);
          this.fx.emojiBurst(cx, cy * 0.65, lCfg.colors, s.combo >= 3 ? 14 : 10, lCfg.floatUp);
        } else {
          this.fx.shockwave(cx, cy, s.combo >= 3 ? '#fb7185' : '#fde047', 110);
        }
        this.fx.floatText(cx, cy - 20, s.combo >= 3 ? `${s.combo} 連擊 +${gain}` : `+${gain} 金幣`, '#f59e0b');
      }

      if (this.state.autoRead) {
        speechPromise = this.sound.speak(`答對了！${bodyExplain}`);
      }
    } else {
      s.combo = 0;
      this.world.fever = false;
      document.body.classList.remove('fever-active');
      this.sound.playWrong();

      const cleanCopy = { ...q };
      [
        'shuffledOptions', 'poolCarriages', 'hooked', 'trainRetries', 'trainRetryMsg',
        'caughtBug', 'wrongTaps', '_arcadeMode', '_arcadeIcon', '_arcadeBadge',
        '_dartFlying', '_moleWhacking', '_clawBusy', '_fishBusy', '_feedBusy',
        '_chestBusy', '_laserBusy', '_alchemyBusy', '_judgeBusy', '_bubbleBusy',
        '_typoStep1Busy', '_trainBusy', '_lastClawPct', '_lastBowDeg',
        'memCards', 'memMatched', 'memPeeking',
        '_peekTimerSet', '_memFlippedIds', '_memLock',
      ].forEach((k) => { delete cleanCopy[k]; });
      this.state.mistakes[q.id] = cleanCopy;

      if (this.state.autoRead) {
        speechPromise = this.sound.speak(`沒關係，我們一起學會它！${bodyExplain}`);
      }
    }

    // Estimate visual bar duration cleanly while guaranteeing speech NEVER gets cut off!
    const estChars = bodyExplain ? bodyExplain.length + 6 : 8;
    const hasVoices = this.sound.hasRealTtsVoices();
    const minVisualMs = isRight ? 2150 : 2850;
    const estTotalMs = (this.state.autoRead && hasVoices)
      ? Math.max(minVisualMs + 850, estChars * 255 + 950)
      : minVisualMs + 150;
    s._autoAdvanceMs = estTotalMs;

    this.saveState();
    this.render();
    this.scrollFeedbackIntoView();

    this.scheduleVoiceAwareFlow(speechPromise, minVisualMs, 850, () => {
      if (this.view === 'play' && this.session === s && s.answered) {
        this.nextQuestion();
      }
    });
  }

  nextQuestion() {
    this.clearAutoTimers();
    const s = this.session;
    if (!s) return;
    this.sound.stopSpeak();
    const layer = document.getElementById('play-toast-layer') || document.getElementById('dopamine-fx-layer');
    if (layer) layer.innerHTML = '';

    if (s.index + 1 < s.questions.length) {
      s.index++;
      s.answered = false;
      s.isCorrect = false;
      s.pickedValue = null;
      s.justOpenedChest = 0;
      s.stageBuffer = true;
      s.finaleBuffer = false;
      s.bufferDurationMs = 2150;

      const nextQ = s.questions[s.index];
      const nextMeta = HERO_STAGE_META[(nextQ && nextQ._arcadeMode) || 'claw'] || HERO_STAGE_META.claw;
      this.sound.playStageReady();
      this.fx.confettiBurst(window.innerWidth * 0.5, window.innerHeight * 0.42, 22);

      const introPromise = this.state.autoRead
        ? this.sound.speak(`第 ${s.index + 1} 關，${nextMeta.readyTitle}`)
        : Promise.resolve({ completed: true });

      this.render();
      this.scrollToStage();

      this.scheduleVoiceAwareFlow(introPromise, 2000, 400, () => {
        if (this.view === 'play' && this.session === s && s.stageBuffer) {
          this.enterActiveStage();
        }
      });
    } else {
      s.stageBuffer = false;
      s.finaleBuffer = true;
      s.bufferDurationMs = 1950;
      this.sound.playChest();
      this.fx.confettiBurst(window.innerWidth * 0.5, window.innerHeight * 0.42, 46);

      const finPromise = this.state.autoRead
        ? this.sound.speak('太棒了！完成所有關卡，開啟黃金皇冠大寶箱！')
        : Promise.resolve({ completed: true });

      this.render();
      this.scrollToStage();

      this.scheduleVoiceAwareFlow(finPromise, 1850, 380, () => {
        if (this.view === 'play' && this.session === s && s.finaleBuffer) {
          this.finishSession();
        }
      });
    }
  }

  finishSession() {
    this.clearAutoTimers();
    const s = this.session;
    if (!s) return;
    s.finaleBuffer = false;
    const ratio = s.correctCount / Math.max(1, s.questions.length);
    const stars = ratio >= 0.88 ? 3 : ratio >= 0.6 ? 2 : 1;
    const prev = this.state.stars[s.id] || 0;
    if (stars > prev) this.state.stars[s.id] = stars;

    const clearBonus = s.isBoss ? 50 : 25;
    this.state.coins += clearBonus;
    s.earnedCoins += clearBonus;
    this.state.gems += stars;
    s.earnedGems += stars;
    s.finalStars = stars;

    if (s.isBoss && stars === 3 && !this.state.unlockedPets.includes('dragon')) {
      this.state.unlockedPets.push('dragon');
      s.unlockedSpecialDragon = true;
    }

    this.saveState();
    this.world.fever = false;
    document.body.classList.remove('fever-active');
    this.sound.playVictory();
    this.fx.confettiBurst(window.innerWidth * 0.28, window.innerHeight * 0.45, 55);
    this.fx.confettiBurst(window.innerWidth * 0.72, window.innerHeight * 0.45, 55);
    this.view = 'victory';
    this.render();
  }

  openGacha() {
    this.clearAutoTimers();
    this.sound.playPop();
    this.sound.stopSpeak();
    this.view = 'gacha';
    this.gachaLastWon = null;
    this.gachaRolling = false;
    this.syncSky(['#fef3c7', '#fde68a', '#fffbeb']);
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
    this.clearAutoTimers();
    this.sound.playTap();
    this.sound.stopSpeak();
    this.view = 'report';
    this.render();
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
    if (this.view === 'play' || this.view === 'victory') return;
    const stageTop = document.getElementById('stage-overlay-top');
    const stageBot = document.getElementById('stage-overlay-bot');
    const actorEl = document.getElementById('pixar-stage-actor');
    const bgArt = document.getElementById('stage-bg-art');
    const stageWrap = document.getElementById('stage-3d-wrap');
    if (!stageTop || !stageBot) return;

    const currentPet = PET_CATALOG.find((p) => p.id === this.state.equippedPet) || PET_CATALOG[0];
    const lessonId = this.view !== 'gacha' ? this.getCurrentLessonId() : null;
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
        actorEl.innerHTML = '';
      } else {
        actorEl.innerHTML = `
          <button type="button" class="pixar-actor-card" id="btn-pixar-actor" title="點點守護夥伴！">
            <img class="pixar-actor-img" src="${badgeArt}" alt="${escapeHtml(currentPet.name)}" />
            <span class="pixar-actor-pill">${escapeHtml(currentPet.name)}</span>
          </button>
        `;
        const actorBtn = document.getElementById('btn-pixar-actor');
        if (actorBtn) {
          actorBtn.onclick = () => {
            this.sound.playSparkleBurst();
            const r = actorBtn.getBoundingClientRect();
            this.fx.confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 28);
            this.fx.floatText(r.left + r.width / 2, r.top, '一起出發闖關！', '#fde047');
          };
        }
      }
    }

    let label = this.state.grade === 'k2'
      ? '幼兒中班・ㄅㄆㄇ識字奇幻島'
      : this.state.grade === 'g1'
        ? '一年級・天空童話王國'
        : '二年級・奇幻閱讀王國';
    if (this.view === 'hub' && this.hoverLesson) {
      label = `${this.hoverLesson.code}《${stripDisplayEmojis(this.hoverLesson.title)}》`;
    } else if (this.view === 'study' && this.activeLesson) {
      label = `${this.activeLesson.code}《${stripDisplayEmojis(this.activeLesson.title)}》`;
    } else if (this.view === 'gacha') {
      label = '守護神獸扭蛋殿堂';
    } else if (this.view === 'report') {
      label = '家長專區・學習診斷中心';
    }

    stageTop.innerHTML = `
      <div class="scene-label-tag">${renderVerticalZhuyin(label, 'inline')}</div>
    `;

    if (this.view === 'gacha') {
      stageBot.innerHTML = '';
    } else {
      const lCfg = lessonId && LESSON_FX_CONFIG[lessonId];
      stageBot.innerHTML = `
        ${lCfg
          ? `<button type="button" class="stage-fx-trigger-btn" id="btn-stage-fx">${iconSingleStarMini()} <span>${escapeHtml(lCfg.action)}</span></button>`
          : `<div></div>`}
        <button type="button" class="pet-partner-tag" id="btn-stage-pet" title="更換守護神獸">
          <img class="pet-mini-avatar" src="${badgeArt}" alt="" />
          <span>夥伴・${escapeHtml(currentPet.name)}</span>
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
    const isImmersiveGame = this.view === 'play' || this.view === 'victory';
    const wasImmersive = document.body.classList.contains('in-play');
    document.body.classList.toggle('in-play', isImmersiveGame);
    if (wasImmersive !== isImmersiveGame && !isImmersiveGame) {
      requestAnimationFrame(() => this.world.resize());
    }

    // Update Global Hub HUD Bar
    const coinsVal = document.getElementById('hud-coins-val');
    if (coinsVal) coinsVal.textContent = this.state.coins;
    const gemsVal = document.getElementById('hud-gems-val');
    if (gemsVal) gemsVal.textContent = this.state.gems;

    const btnGacha = document.getElementById('btn-open-gacha');
    if (btnGacha) {
      btnGacha.innerHTML = `${iconGachaGlobe(20)} <span>神獸扭蛋</span>`;
      btnGacha.onclick = () => this.openGacha();
    }

    const btnReport = document.getElementById('btn-open-report');
    if (btnReport) {
      btnReport.innerHTML = `${iconReportChart(20)} <span>家長報告</span>`;
      btnReport.onclick = () => this.openReport();
    }

    const btnZhuyin = document.getElementById('btn-toggle-zhuyin');
    if (btnZhuyin) {
      btnZhuyin.innerHTML = `<span class="zy-mini-stack"><span>ㄅ</span><span>ㄆ</span><span>ㄇ</span></span> <span>${this.state.showZhuyin ? '注音開' : '注音關'}</span>`;
      btnZhuyin.classList.toggle('active-toggle', this.state.showZhuyin);
      btnZhuyin.onclick = () => {
        this.sound.playTap();
        this.state.showZhuyin = !this.state.showZhuyin;
        this.saveState();
        this.render();
      };
    }

    const btnVoice = document.getElementById('btn-toggle-voice');
    if (btnVoice) {
      btnVoice.innerHTML = `${iconSpeaker(this.state.autoRead, 19)} <span>${this.state.autoRead ? '語音開' : '靜音'}</span>`;
      btnVoice.classList.toggle('active-toggle', this.state.autoRead);
      btnVoice.onclick = () => {
        this.state.autoRead = !this.state.autoRead;
        this.sound.autoRead = this.state.autoRead;
        if (!this.state.autoRead) this.sound.stopSpeak();
        this.saveState();
        this.render();
      };
    }

    const btnBgm = document.getElementById('btn-toggle-bgm');
    if (btnBgm) {
      btnBgm.innerHTML = `${iconMusicNote(this.sound.bgmOn, 18)} <span>${this.sound.bgmOn ? '配樂開' : '配樂'}</span>`;
      btnBgm.classList.toggle('active-toggle', this.sound.bgmOn);
      btnBgm.onclick = () => {
        this.sound.toggleBgm();
        this.render();
      };
    }

    const brandHome = document.getElementById('btn-brand-home');
    if (brandHome) brandHome.onclick = () => this.goHub();

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
    const earnedStars = lessons.reduce((acc, l) => acc + (this.state.stars[l.id] || 0), 0);
    const maxStars = lessons.length * 3;

    deck.innerHTML = `
      <div class="hub-world-topbar">
        <div class="grade-switch-group" role="tablist" aria-label="選擇學習年段">
          <button id="tab-grade-k2" class="grade-island-tab ${g === 'k2' ? 'is-active k2-theme' : ''}">
            <span class="grade-tab-main">幼兒中班</span>
            <span class="grade-tab-sub">注音啟蒙・生活識字</span>
          </button>
          <button id="tab-grade-1" class="grade-island-tab ${g === 'g1' ? 'is-active g1-theme' : ''}">
            <span class="grade-tab-main">國小一年級</span>
            <span class="grade-tab-sub">115 南一版下學期</span>
          </button>
          <button id="tab-grade-2" class="grade-island-tab ${g === 'g2' ? 'is-active g2-theme' : ''}">
            <span class="grade-tab-main">國小二年級</span>
            <span class="grade-tab-sub">115 南一版下學期</span>
          </button>
        </div>

        <div class="hub-star-summary">
          ${renderStarsSvg(3, 20)}
          <span>本章節星章 <strong>${earnedStars} / ${maxStars}</strong></span>
        </div>
      </div>

      <div class="featured-portals-grid">
        <div class="portal-card boss-portal">
          <div class="portal-crest">${iconBossCrest(40)}</div>
          <div class="portal-info">
            <div class="portal-title-row">
              <h2 class="portal-title">${isK2 ? '識字狀元總挑戰' : '魔王總複習決戰'}</h2>
              ${renderStarsSvg(bossStars, 18)}
            </div>
            <p class="portal-desc">跨課綜合精選 12 關・三星通關解鎖傳說神獸</p>
          </div>
          <button id="btn-start-boss" class="toy-btn coral portal-cta-btn">立即挑戰</button>
        </div>

        <div class="portal-card custom-portal">
          <div class="portal-crest">${iconCompassQuest(40)}</div>
          <div class="portal-info">
            <h2 class="portal-title">自選課次特訓</h2>
            <p class="portal-desc">自由勾選段考或月考範圍，集中強化練習</p>
          </div>
          <button id="btn-open-custom" class="toy-btn primary portal-cta-btn">選擇範圍</button>
        </div>

        <div class="portal-card mistake-portal">
          <div class="portal-crest">${iconMistakeShield(40)}</div>
          <div class="portal-info">
            <h2 class="portal-title">錯題黃金修練（${mistakesCount}）</h2>
            <p class="portal-desc">${mistakesCount > 0 ? '自動收錄答錯題目，針對弱點一題一題學會' : '目前沒有待修練錯題，保持超棒狀態！'}</p>
          </div>
          <button id="btn-start-mistakes" class="toy-btn mint portal-cta-btn" ${mistakesCount === 0 ? 'disabled' : ''}>
            ${mistakesCount > 0 ? '開始修練' : '全數掌握'}
          </button>
        </div>
      </div>

      <div class="hub-section-heading">
        <h2 class="hub-section-title">${isK2 ? '選擇主題島嶼・邊玩邊學注音與國字' : '選擇課次島嶼・每課 9 關主題遊戲挑戰'}</h2>
      </div>

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
      const lCfg = LESSON_FX_CONFIG[l.id] || {};
      const focusText = lCfg.focus || '核心字詞・語句理解・9 關互動闖關';

      const card = document.createElement('div');
      card.className = 'lesson-card lesson-card-3d';
      card.id = `card-${l.id}`;
      card.dataset.lessonId = l.id;
      card.innerHTML = `
        <div class="lesson-3d-thumb">
          <img class="lesson-3d-img" src="${thumbSrc}" alt="${escapeHtml(stripDisplayEmojis(l.title))}" draggable="false" />
          <span class="lesson-3d-gloss"></span>
          <span class="lesson-3d-code">${escapeHtml(l.code)}</span>
          <span class="lesson-3d-stars">${renderStarsSvg(st, 20)}</span>
        </div>
        <div class="lesson-card-body">
          <h3 class="lesson-name">${this.fmtText(l.title)}</h3>
          <p class="lesson-focus-meta">${renderVerticalZhuyin(focusText, 'inline')}</p>
          <div class="lesson-btn-row">
            <button type="button" class="toy-btn sun sm lesson-action-btn" id="study-${l.id}">
              ${iconBookCards(17)} <span>${isLessonK2 ? '字卡導讀' : '課前導讀'}</span>
            </button>
            <button type="button" class="toy-btn primary sm lesson-action-btn" id="play-${l.id}">
              ${iconPlayTriangle(15)} <span>進入闖關</span>
            </button>
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

      document.getElementById(`study-${l.id}`).onclick = (e) => {
        e.stopPropagation();
        const r = card.getBoundingClientRect();
        this.openStudy(l.id);
        this.triggerLessonFX(l.id, r.left + r.width / 2, r.top + 60, 0.7);
      };

      document.getElementById(`play-${l.id}`).onclick = (e) => {
        e.stopPropagation();
        const r = card.getBoundingClientRect();
        this.startLesson(l.id);
        this.triggerLessonFX(l.id, r.left + r.width / 2, r.top + 60, 0.85);
      };

      card.onclick = (e) => {
        if (e.target && e.target.closest && e.target.closest('button')) return;
        const r = card.getBoundingClientRect();
        this.startLesson(l.id);
        this.triggerLessonFX(l.id, e.clientX || (r.left + r.width / 2), e.clientY || (r.top + 60), 0.85);
      };
    });
  }

  renderStudy(deck) {
    const l = this.activeLesson;
    if (!l) return this.goHub();
    const isK2 = l.id.startsWith('k2_');
    deck.innerHTML = `
      <div class="subview-header">
        <div>
          <span class="pedagogy-tag">點選圖卡即可聆聽標準發音與解說</span>
          <h2 class="subview-title">${escapeHtml(l.code)}・${this.fmtText(l.title)}</h2>
        </div>
        <div class="subview-actions">
          <button id="btn-study-back" class="toy-btn">${iconBackArrow(16)} <span>返回地圖</span></button>
          <button id="btn-study-go" class="toy-btn coral">${iconPlayTriangle(15)} <span>開始闖關</span></button>
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
            <span class="k2-study-illus">${getK2WordIllustrationSvg(sc.word, sc.pic)}</span>
            <span class="k2-study-hanzi">${escapeHtml(sc.word)}</span>
            <div class="study-zhuyin k2-study-zy">${renderVerticalZhuyin(sc.zhuyin, 'study')}</div>
          </div>
          <div class="study-tip-row">
            <span>${this.fmtText(sc.tip)}</span>
            <span class="study-spk-badge">${iconSpeaker(true, 18)}</span>
          </div>
        `;
      } else {
        div.innerHTML = `
          <div class="study-card-head">
            <div class="study-word">${this.fmtText(sc.word)}</div>
            <span class="study-spk-badge">${iconSpeaker(true, 18)}</span>
          </div>
          <div class="study-zhuyin">${renderVerticalZhuyin(sc.zhuyin, 'study')}</div>
          <div class="study-tip">${this.fmtText(sc.tip)}</div>
        `;
      }
      div.onclick = (e) => {
        const r = div.getBoundingClientRect();
        this.triggerLessonFX(l.id, e.clientX || (r.left + r.width / 2), e.clientY || (r.top + 30), 0.65);
        this.sound.speak(sc.tts || `${sc.word}。${sc.tip}`);
      };
      wrap.appendChild(div);
    });
  }

  renderCustomPicker(deck) {
    const lessons = this.getLessons();
    deck.innerHTML = `
      <div class="subview-header">
        <div>
          <span class="pedagogy-tag">考前重點複習</span>
          <h2 class="subview-title">勾選想練習的課次範圍</h2>
        </div>
        <div class="subview-actions">
          <button id="btn-custom-all" class="toy-btn sm">全部勾選</button>
          <button id="btn-custom-back" class="toy-btn sm">${iconBackArrow(16)} <span>返回地圖</span></button>
        </div>
      </div>
      <div class="scope-check-grid" id="scope-grid"></div>
      <div style="text-align:center;margin-top:18px;">
        <button id="btn-launch-custom" class="toy-btn coral" style="font-size:1.12rem;padding:13px 32px;">
          ${iconPlayTriangle(16)} <span>開始特訓（已選 ${this.customSelectedIds.size} 課）</span>
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
      label.className = `scope-item ${checked ? 'is-checked' : ''}`;
      label.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''} />
        <img src="${thumbSrc}" alt="" class="scope-thumb-img" />
        <span class="scope-item-title">${escapeHtml(l.code)}《${this.fmtText(l.title)}》</span>
      `;
      label.querySelector('input').onchange = (e) => {
        if (e.target.checked) {
          this.customSelectedIds.add(l.id);
        } else {
          this.customSelectedIds.delete(l.id);
        }
        this.render();
      };
      grid.appendChild(label);
    });
  }

  renderQuestGemBar(s) {
    const total = s.questions.length;
    const nodes = s.questions.map((_, idx) => {
      const stepNum = idx + 1;
      const isDone = idx < s.index || (idx === s.index && (s.answered || s.finaleBuffer));
      const isCurrent = idx === s.index && !s.finaleBuffer;
      const isMilestone = stepNum === 3 || stepNum === 6;
      const isGrand = stepNum === total;
      const stateCls = isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-upcoming';
      let inner = `<span class="gem-step-num">${stepNum}</span>`;
      if (isGrand) {
        inner = iconMilestoneChest(isDone, true, 20);
      } else if (isMilestone) {
        inner = iconMilestoneChest(Boolean(s.chestsClaimed[stepNum]), false, 20);
      }
      return `<div class="quest-gem-node ${stateCls} ${isMilestone || isGrand ? 'is-chest-node' : ''}">${inner}</div>`;
    }).join('');

    return `<div class="quest-gem-bar" aria-label="闖關進度第 ${s.index + 1} 關，共 ${total} 關">${nodes}</div>`;
  }

  renderGameTopHud(s, showSpeakBtn = true) {
    const stepNo = Math.min(s.questions.length, s.index + 1);
    const bossPct = Math.max(0, Math.round(this.world.bossHpRatio * 100));

    return `
      <div class="game-stage-hud">
        <button type="button" id="btn-play-exit" class="game-hud-back-btn" title="返回世界地圖">
          ${iconBackArrow(17)} <span>地圖</span>
        </button>

        <div class="game-hud-center">
          ${this.renderQuestGemBar(s)}
        </div>

        <div class="game-hud-right">
          <div class="game-hud-coin-pill" id="play-coins-chip">
            ${iconGoldCoin(20)} <span>${this.state.coins}</span>
          </div>
          <span class="game-hud-step-badge">第 ${stepNo} / ${s.questions.length} 關</span>
          ${showSpeakBtn ? `
            <button type="button" id="btn-speak-now" class="game-hud-speak-btn ${this.sound.isSpeaking ? 'speaking-pulse' : ''}" title="再聽一次題目">
              ${iconSpeaker(true, 20)} <span>唸題</span>
            </button>
          ` : ''}
        </div>
      </div>
      ${s.isBoss ? `
        <div class="game-boss-hp-strip">
          <span class="boss-hp-tag">魔王護盾 ${bossPct}%</span>
          <div class="boss-hp-rail"><div class="boss-hp-bar-fill" style="width:${bossPct}%"></div></div>
        </div>
      ` : ''}
      <div class="play-toast-layer" id="play-toast-layer" aria-live="polite"></div>
    `;
  }

  renderPlay(deck) {
    const s = this.session;
    const q = s.questions[s.index];

    if (s.finaleBuffer || s.stageBuffer) {
      this.renderStageBufferView(deck, s, q);
      return;
    }

    const mode = q._arcadeMode || 'claw';
    const meta = HERO_STAGE_META[mode] || HERO_STAGE_META.claw;
    const skillMeta = getQuestionSkillMeta(q);

    deck.innerHTML = `
      <div class="game-cabinet-shell" id="command-deck" style="--stage-accent:${meta.accent};">
        ${this.renderGameTopHud(s, true)}

        <div class="game-task-signboard">
          <div class="task-sign-pills">
            <span class="task-mode-crest">${renderVerticalZhuyin(q._arcadeBadge || meta.badge, 'inline')}</span>
            <span class="task-skill-pill">${escapeHtml(skillMeta.tag)}</span>
            ${s.combo >= 2 ? `<span class="task-combo-pill ${s.combo >= 3 ? 'is-fever' : ''}">${s.combo} 連擊${s.combo >= 3 ? '・雙倍金幣' : ''}</span>` : ''}
          </div>
          <h2 class="question-prompt">${this.fmtText(q.prompt, q)}</h2>
        </div>

        ${q.story ? `
          <div class="story-reading-box" id="story-box">
            <div class="story-scroll-text">${this.fmtText(q.story, q)}</div>
            <button type="button" id="btn-read-story" class="toy-btn sm sun story-listen-btn">
              ${iconSpeaker(true, 17)} <span>聽短文</span>
            </button>
          </div>
        ` : ''}

        <div id="interactive-arena" class="game-interactive-arena"></div>
        <div id="feedback-zone"></div>
      </div>
    `;

    document.getElementById('btn-play-exit').onclick = () => this.goHub();
    const speakBtn = document.getElementById('btn-speak-now');
    if (speakBtn) {
      speakBtn.onclick = () => {
        if (q.type === 'bubble') this.sound.playCensorBeep();
        this.sound.speak(q.tts || q.prompt);
      };
    }
    const storyBtn = document.getElementById('btn-read-story');
    if (storyBtn) storyBtn.onclick = () => this.sound.speak(q.story);

    const arena = document.getElementById('interactive-arena');
    const isK2 = Boolean(q.id && q.id.startsWith('k2_'));

    if (mode === 'dart') {
      if (isK2) this.renderK2SoundMode(arena, q, s, true);
      else this.renderDartMode(arena, q, s);
    } else if (mode === 'bubble_pop') {
      if (isK2) this.renderK2SoundMode(arena, q, s, false);
      else this.renderBubbleMode(arena, q, s);
    } else if (mode === 'alchemy') {
      if (isK2) this.renderK2SpellMode(arena, q, s);
      else this.renderAlchemyMode(arena, q, s);
    } else if (mode === 'claw') {
      this.renderClawMode(arena, q, s);
    } else if (mode === 'fish') {
      this.renderFishMode(arena, q, s);
    } else if (mode === 'feed') {
      this.renderFeedMode(arena, q, s);
    } else if (mode === 'chest_lock') {
      this.renderChestLockMode(arena, q, s);
    } else if (mode === 'memory') {
      this.renderMemoryMode(arena, q, s);
    } else if (mode === 'mole') {
      if (q.type === 'typo') this.renderTypoMode(arena, q, s, false);
      else if (isK2) this.renderK2MoleMode(arena, q, s);
      else this.renderQuizMoleMode(arena, q, s);
    } else if (mode === 'typo_laser') {
      this.renderTypoMode(arena, q, s, true);
    } else if (mode === 'train') {
      this.renderTrainMode(arena, q, s);
    } else if (mode === 'judge') {
      this.renderJudgeMode(arena, q, s);
    } else {
      this.renderClawMode(arena, q, s);
    }

    if (s.answered) {
      const fb = document.getElementById('feedback-zone');
      const isLast = s.index + 1 >= s.questions.length;
      const bodyExplain = cleanExplain(q.explain);
      const autoMs = s._autoAdvanceMs || 2400;
      const chestBanner = s.justOpenedChest
        ? `<div class="chest-bonus-pill">${iconMilestoneChest(true, false, 20)} <span>第 ${s.justOpenedChest} 關里程碑寶箱解鎖！額外獲得 +15 金幣 ＆ +1 寶石</span></div>`
        : '';
      const speakingNow = this.sound.isSpeaking && this.state.autoRead;

      fb.innerHTML = `
        <div class="feedback-sheet mastery-feedback-card ${s.isCorrect ? 'good' : 'retry'}" style="--auto-ms:${autoMs}ms;">
          <div class="feedback-main-col">
            ${chestBanner}
            <div class="feedback-headline-row">
              <span class="feedback-verdict-badge ${s.isCorrect ? 'is-good' : 'is-retry'}">
                ${s.isCorrect ? '答對過關！' : '重點解析'}
              </span>
              <span class="feedback-skill-chip">能力重點：${escapeHtml(skillMeta.tag)}</span>
              <span class="voice-sync-pill ${speakingNow ? '' : 'done-speaking'}" id="voice-sync-status">
                <span class="voice-dot ${speakingNow ? 'live' : 'done'}"></span>
                <span>${speakingNow ? '語音詳解朗讀中・聽完自動下一關' : (isLast ? '準備開啟終極寶箱…' : '準備前往下一關…')}</span>
              </span>
            </div>
            <div class="feedback-explain-body">${this.fmtText(bodyExplain)}</div>
            <div class="auto-advance-track">
              <div class="auto-advance-fill"></div>
            </div>
          </div>
          <button type="button" id="btn-next-q" class="toy-btn ${s.isCorrect ? 'mint' : 'orange'} feedback-next-btn">
            <span>${isLast ? '開啟寶箱' : '下一關'}</span> ${iconPlayTriangle(14)}
          </button>
        </div>
      `;
      document.getElementById('btn-next-q').onclick = () => this.nextQuestion();
    }
  }

  renderStageBufferView(deck, s, q) {
    const currentPet = PET_CATALOG.find((p) => p.id === this.state.equippedPet) || PET_CATALOG[0];
    const petImg = this.getPetArt(currentPet.id);

    if (s.finaleBuffer) {
      deck.innerHTML = `
        <div class="game-cabinet-shell" id="command-deck" style="--stage-accent:#d97706;">
          ${this.renderGameTopHud(s, false)}
          <div class="stage-ready-card finale-mode" id="stage-ready-card" style="--buf-ms:${s.bufferDurationMs || 1950}ms; --ready-accent:#d97706;">
            <div class="stage-ready-top-pill">全數挑戰完成・共 ${s.questions.length} 關</div>
            <div class="stage-ready-hero-showcase anim-chest_lock">
              <div class="stage-ready-aura"></div>
              ${getHeroRigByMode('chest_lock', 'unlocked')}
            </div>
            <h2 class="stage-ready-title">${this.fmtText('黃金皇冠大寶箱開啟！')}</h2>
            <p class="stage-ready-sub">${this.fmtText('正在結算本課榮譽星章、冒險金幣與學習成果')}</p>
            <div class="buffer-rocket-wrap">
              <div class="buffer-rocket-track"><div class="buffer-rocket-fill"></div></div>
            </div>
            <button type="button" id="btn-buffer-go" class="toy-btn sun stage-ready-go-btn">
              <span>查看成果與領獎</span> ${iconPlayTriangle(15)}
            </button>
          </div>
        </div>
      `;
      document.getElementById('btn-play-exit').onclick = () => this.goHub();
      const card = document.getElementById('stage-ready-card');
      const goBtn = document.getElementById('btn-buffer-go');
      if (goBtn) goBtn.onclick = (e) => { e.stopPropagation(); this.finishSession(); };
      if (card) card.onclick = () => this.finishSession();
      return;
    }

    const mode = q._arcadeMode || 'claw';
    const meta = HERO_STAGE_META[mode] || HERO_STAGE_META.claw;
    const skillMeta = getQuestionSkillMeta(q);
    const stepNo = s.index + 1;
    const total = s.questions.length;

    // Motivating treasure milestone teaser for kids
    let kidQuestHook = '';
    if (stepNo <= 3) {
      const rem = 3 - stepNo + 1;
      kidQuestHook = stepNo === 3
        ? '本關答對即可開啟【第 3 關黃金小寶箱】領寶石！'
        : `再闖 ${rem} 關就能打開【第 3 關黃金小寶箱】！`;
    } else if (stepNo <= 6) {
      const rem = 6 - stepNo + 1;
      kidQuestHook = stepNo === 6
        ? '本關答對即可開啟【第 6 關黃金小寶箱】領寶石！'
        : `再闖 ${rem} 關就能打開【第 6 關黃金小寶箱】！`;
    } else {
      const rem = total - stepNo + 1;
      kidQuestHook = stepNo === total
        ? '最後決戰！過關開啟【終極皇冠大寶箱】！'
        : `距離【終極皇冠大寶箱】只剩最後 ${rem} 關！`;
    }

    // Adventure Island Stepping-Stone Map with hopping Guardian Pet
    const islandNodesHtml = s.questions.map((_, idx) => {
      const num = idx + 1;
      const done = idx < s.index;
      const cur = idx === s.index;
      const isChest = num === 3 || num === 6 || num === total;
      return `
        <div class="island-step-stone ${done ? 'done' : cur ? 'current' : 'upcoming'}">
          ${cur ? `<img class="island-pet-hopper" src="${petImg}" alt="${escapeHtml(currentPet.name)}" />` : ''}
          <span class="stone-disc">
            ${isChest ? iconMilestoneChest(done, num === total, 18) : num}
          </span>
        </div>
      `;
    }).join('');

    deck.innerHTML = `
      <div class="game-cabinet-shell" id="command-deck" style="--stage-accent:${meta.accent};">
        ${this.renderGameTopHud(s, false)}

        <div class="stage-ready-card" id="stage-ready-card" style="background:${meta.bgGrad}; --ready-accent:${meta.accent}; --buf-ms:${s.bufferDurationMs || 2150}ms;">
          <div class="quest-island-strip">
            <div class="island-stones-row">${islandNodesHtml}</div>
            <div class="quest-hook-pill">${iconGoldCoin(18)} <span>${escapeHtml(kidQuestHook)}</span></div>
          </div>

          <div class="stage-ready-top-row">
            <span class="stage-ready-step-pill">第 ${stepNo} / ${total} 關・準備登場</span>
            <span class="stage-ready-mode-tag">${renderVerticalZhuyin(meta.badge, 'inline')}</span>
          </div>

          <div class="stage-ready-hero-showcase anim-${mode}">
            <div class="stage-ready-aura"></div>
            ${getHeroRigByMode(mode)}
          </div>

          <h2 class="stage-ready-title">${this.fmtText(meta.readyTitle)}</h2>
          <p class="stage-ready-sub">${this.fmtText(meta.readyAction)}</p>

          <div class="parent-value-strip">
            <span class="parent-value-badge">本關訓練能力</span>
            <span class="parent-value-text"><strong>${escapeHtml(skillMeta.tag)}</strong>｜${escapeHtml(skillMeta.parentNote)}</span>
          </div>

          <div class="buffer-rocket-wrap">
            <div class="buffer-rocket-track">
              <div class="buffer-rocket-fill"></div>
            </div>
          </div>

          <button type="button" id="btn-buffer-go" class="toy-btn coral stage-ready-go-btn">
            ${iconPlayTriangle(15)} <span>立即開始挑戰</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-play-exit').onclick = () => this.goHub();
    const card = document.getElementById('stage-ready-card');
    const goBtn = document.getElementById('btn-buffer-go');
    if (goBtn) {
      goBtn.onclick = (e) => {
        e.stopPropagation();
        this.enterActiveStage();
      };
    }
    if (card) {
      card.onclick = () => this.enterActiveStage();
    }
  }

  renderArcadeContextBanner(q, s) {
    const isK2 = Boolean(q.id && q.id.startsWith('k2_'));
    if (isK2 && q.fixedPart && q.resultChar) {
      const firstIsMissing = q.missingPos === 'first';
      const fixedSlotHtml = `<button type="button" class="alchemy-slot k2-zy-slot k2-fixed-tap" id="btn-k2-fixed-zy" title="點我聽注音發音">${renderVerticalZhuyin(q.fixedPart, 'bubble')}</button>`;
      const mysterySlotHtml = `<div class="alchemy-slot k2-zy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? renderVerticalZhuyin(q.answer, 'bubble') : '？'}</div>`;
      const slot1Html = firstIsMissing ? mysterySlotHtml : fixedSlotHtml;
      const slot2Html = !firstIsMissing ? mysterySlotHtml : fixedSlotHtml;
      const toneHtml = q.toneLabel ? `<span class="k2-tone-pill">${escapeHtml(q.toneLabel)}</span>` : '';
      return `
        <div class="alchemy-arena k2-spell-arena context-workbench">
          <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點我聽拼音提示">
            <span class="k2-clue-illus">${getK2WordIllustrationSvg(q.resultChar, q.pic)}</span>
            <span class="k2-speak-tag">${iconSpeaker(true, 16)} <span>聽拼音</span></span>
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
      `;
    }
    if (isK2 && (q.pic || q.charFocus || q.hintZhuyin)) {
      const refWord = q.charFocus || q.resultChar || q.answer || '';
      return `
        <div class="k2-clue-bar-wrap">
          <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點圖再聽一次">
            <span class="k2-clue-illus">${getK2WordIllustrationSvg(refWord, q.pic)}</span>
            ${q.charFocus ? `<span class="k2-clue-hanzi">${escapeHtml(q.charFocus)}</span>` : ''}
            ${q.hintZhuyin ? `<span class="k2-mole-zy-badge">${renderVerticalZhuyin(q.hintZhuyin, 'bubble')}</span>` : ''}
            <span class="k2-speak-tag">${iconSpeaker(true, 16)} <span>聽發音</span></span>
          </button>
        </div>
      `;
    }
    if (q.type === 'bubble' && q.targetHighlight) {
      const highlighted = escapeHtml(stripDisplayEmojis(q.targetHighlight)).replace(/([「『][^」』]+[」』])/g, '<span class="muted-char-focus">$1</span>');
      return `
        <div class="target-word-banner">
          <div class="muted-hint-chip">挑戰自己拼讀</div>
          <div class="target-word-main">${highlighted}</div>
        </div>
      `;
    }
    if (q.type === 'alchemy' && q.basePart) {
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
            <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '？'}</div>
          </div>
        `
        : `
          <div class="alchemy-formula">
            <div class="alchemy-slot">${escapeHtml(q.basePart)}</div>
            <div class="alchemy-plus">＋</div>
            <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.answer) : '？'}</div>
            <div class="alchemy-plus">＝</div>
            <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '？'}</div>
          </div>
        `;
      return `
        <div class="alchemy-arena context-workbench">
          <div class="workbench-hint-label">
            語詞提示：${this.fmtText(q.wordHint, q)} ${isVertical ? '（上下結構）' : '（左右結構）'}
          </div>
          ${formulaHtml}
        </div>
      `;
    }
    return '';
  }

  bindArcadeContextBanner(q) {
    const clueBtn = document.getElementById('btn-k2-clue');
    if (clueBtn) {
      clueBtn.onclick = () => {
        this.sound.playPop();
        this.sound.speak(q.tts || q.resultChar || q.charFocus || q.answer);
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
  }

  populateArcadeOption(btn, opt, q, leadGraphicHtml = '') {
    const cleanOpt = stripDisplayEmojis(opt);
    const isPureZhuyin = /^[\u3105-\u3129ˊˇˋ˙\s]+$/.test(cleanOpt);
    const isK2 = Boolean(q.id && q.id.startsWith('k2_'));
    let bodyHtml = '';
    let allowSpeakChip = false;

    if (isPureZhuyin) {
      bodyHtml = renderVerticalZhuyin(cleanOpt, 'bubble');
      allowSpeakChip = isK2;
    } else if (q.optZhuyin && q.optZhuyin[opt]) {
      bodyHtml = renderCharWithZhuyin(cleanOpt, q.optZhuyin[opt], 'k2ruby');
      allowSpeakChip = true;
    } else if (isK2) {
      bodyHtml = `<span class="arcade-k2-pure-hanzi">${escapeHtml(cleanOpt)}</span>`;
      allowSpeakChip = false;
    } else {
      bodyHtml = this.fmtText(cleanOpt, q);
      allowSpeakChip = q.type !== 'bubble';
    }

    btn.innerHTML = `
      ${leadGraphicHtml ? `<span class="arcade-opt-prop">${leadGraphicHtml}</span>` : ''}
      <span class="arcade-opt-content">${bodyHtml}</span>
      ${allowSpeakChip ? `<span role="button" tabindex="0" class="opt-speak-chip" title="聽這個選項的發音">${iconSpeaker(true, 16)}</span>` : ''}
    `;

    const spk = btn.querySelector('.opt-speak-chip');
    if (spk) {
      spk.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.sound.speak(cleanOpt);
      };
    }
  }

  renderClawMode(arena, q, s) {
    const pickedIdx = s.answered ? Math.max(0, q.shuffledOptions.indexOf(s.pickedValue)) : 0;
    const initClawX = typeof q._lastClawPct === 'number' ? q._lastClawPct.toFixed(1) : '50.0';
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="claw-machine-stage" id="claw-stage">
        <div class="claw-top-rail"></div>
        <div class="claw-gantry-zone">
          <div class="claw-carriage ${s.answered ? 'is-clamped' : ''}" id="claw-carriage" style="--claw-x: ${initClawX}%;">
            <div class="claw-cable-rod" id="claw-cable-rod"></div>
            <div class="claw-rig-wrap" id="claw-rig-wrap">${getHeroRigByMode('claw')}</div>
            <div class="claw-held-capsule ${s.answered ? 'show' : ''}" id="claw-held-capsule">
              ${s.answered ? getGachaCapsuleSvg(pickedIdx) : ''}
            </div>
          </div>
        </div>
        <div class="claw-capsules-grid" id="claw-grid"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const stage = document.getElementById('claw-stage');
    const carriage = document.getElementById('claw-carriage');
    const heldCap = document.getElementById('claw-held-capsule');
    const grid = document.getElementById('claw-grid');

    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `claw-capsule-btn cap-${idx % 4}`;
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.populateArcadeOption(btn, opt, q, getGachaCapsuleSvg(idx));

      btn.onpointerenter = (e) => {
        if (s.answered || q._clawBusy || (e && e.pointerType && e.pointerType !== 'mouse')) return;
        if (stage && carriage) {
          const sr = stage.getBoundingClientRect();
          const br = btn.getBoundingClientRect();
          const pctX = Math.max(18, Math.min(82, ((br.left + br.width / 2 - sr.left) / Math.max(1, sr.width)) * 100));
          carriage.style.setProperty('--claw-x', `${pctX.toFixed(1)}%`);
        }
      };

      btn.onclick = () => {
        if (s.answered || q._clawBusy) return;
        q._clawBusy = true;
        this.sound.playClawGrab();
        const br = btn.getBoundingClientRect();
        if (stage && carriage) {
          const sr = stage.getBoundingClientRect();
          const pctX = Math.max(18, Math.min(82, ((br.left + br.width / 2 - sr.left) / Math.max(1, sr.width)) * 100));
          q._lastClawPct = pctX;
          carriage.style.setProperty('--claw-x', `${pctX.toFixed(1)}%`);
          carriage.classList.remove('is-clamped');
          carriage.classList.add('is-open', 'is-dropping');
        }
        setTimeout(() => {
          if (carriage) {
            carriage.classList.remove('is-open', 'is-dropping');
            carriage.classList.add('is-clamped');
          }
          if (heldCap) {
            heldCap.innerHTML = getGachaCapsuleSvg(idx);
            heldCap.classList.add('show');
          }
          btn.classList.add('grabbed-lift');
          this.fx.multiRipple(br.left + br.width / 2, br.top + br.height / 2, ['#fde047', '#38bdf8', '#fb7185']);
        }, 155);
        setTimeout(() => {
          q._clawBusy = false;
          this.handleAnswer(opt === q.answer, opt);
        }, 365);
      };
      grid.appendChild(btn);
    });
  }

  renderFishMode(arena, q, s) {
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="fish-pond-stage">
        <div class="fish-hero-waterline">
          <div class="fish-hero-rig" id="fish-hero-rig">${getHeroRigByMode('fish')}</div>
        </div>
        <div class="fish-pond-grid" id="fish-grid"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const heroRig = document.getElementById('fish-hero-rig');
    const rodAnchor = document.getElementById('fish-rod-tip-anchor');
    const grid = document.getElementById('fish-grid');
    const fishColors = ['#fb923c', '#38bdf8', '#f472b6', '#4ade80'];

    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `fish-swim-btn f-${idx % 4}`;
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.populateArcadeOption(btn, opt, q, getSwimmingFishSvg(idx));

      btn.onclick = () => {
        if (s.answered || q._fishBusy) return;
        q._fishBusy = true;
        btn.classList.add('hooked');
        if (heroRig) heroRig.classList.add('rod-casting');
        this.sound.playFishSplash();
        const br = btn.getBoundingClientRect();
        const anchorEl = rodAnchor || heroRig;
        const rr = anchorEl ? anchorEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 110, width: 0, height: 0 };
        this.fx.castFishingLine(
          rr.left + rr.width / 2,
          rr.top + rr.height / 2,
          br.left + br.width / 2,
          br.top + br.height / 2,
          fishColors[idx % fishColors.length],
          () => {
            q._fishBusy = false;
            this.handleAnswer(opt === q.answer, opt);
          }
        );
      };
      grid.appendChild(btn);
    });
  }

  renderFeedMode(arena, q, s) {
    const moodState = s.answered ? (s.isCorrect ? 'happy' : 'dizzy') : 'hungry';
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="dino-feeder-stage">
        <div class="dino-hero-spotlight">
          <div class="dino-hero-rig ${s.answered && s.isCorrect ? 'dino-chomping' : ''}" id="dino-hero-rig">
            ${getHeroRigByMode('feed', moodState)}
          </div>
        </div>
        <div class="dino-food-grid" id="dino-grid"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const dinoRig = document.getElementById('dino-hero-rig');
    const cavity = dinoRig ? dinoRig.querySelector('.dino-mouth-cavity') : null;
    const grid = document.getElementById('dino-grid');

    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dino-food-btn df-${idx % 4}`;
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.populateArcadeOption(btn, opt, q, getDinoTreatSvg(idx));

      btn.onclick = () => {
        if (s.answered || q._feedBusy) return;
        q._feedBusy = true;
        this.sound.playPop();
        if (dinoRig) dinoRig.classList.add('mouth-wide-open');
        const isOk = opt === q.answer;
        const br = btn.getBoundingClientRect();
        const targetEl = cavity || dinoRig;
        const mr = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 100, width: 0, height: 0 };
        this.fx.flyItem(
          br.left + br.width / 2,
          br.top + br.height / 2,
          mr.left + mr.width / 2,
          mr.top + mr.height / 2,
          'treat',
          'rgba(251, 146, 60, 0.92)',
          () => {
            q._feedBusy = false;
            if (dinoRig) {
              dinoRig.classList.remove('mouth-wide-open');
              dinoRig.classList.add('dino-chomping');
            }
            this.sound.playDinoChomp(isOk);
            this.handleAnswer(isOk, opt);
          },
          88,
          'treat'
        );
      };
      grid.appendChild(btn);
    });
  }

  renderChestLockMode(arena, q, s) {
    const isUnlocked = Boolean(s.answered && s.isCorrect);
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="chest-lock-stage">
        <div class="chest-hero-spotlight">
          <div class="chest-hero-rig" id="chest-hero-rig">${getHeroRigByMode('chest_lock', isUnlocked ? 'unlocked' : '')}</div>
        </div>
        <div class="chest-keys-grid" id="chest-keys-grid"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const chestRig = document.getElementById('chest-hero-rig');
    const padlock = chestRig ? chestRig.querySelector('.chest-padlock-group') : null;
    const grid = document.getElementById('chest-keys-grid');

    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `chest-key-btn ck-${idx % 4}`;
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.populateArcadeOption(btn, opt, q, getJeweledKeySvg(idx));

      btn.onclick = () => {
        if (s.answered || q._chestBusy) return;
        q._chestBusy = true;
        this.sound.playTap();
        const isOk = opt === q.answer;
        const br = btn.getBoundingClientRect();
        const targetEl = padlock || chestRig;
        const cr = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 100, width: 0, height: 0 };
        this.fx.flyGoldenKey(
          br.left + br.width / 2,
          br.top + br.height / 2,
          cr.left + cr.width / 2,
          cr.top + cr.height / 2,
          () => {
            q._chestBusy = false;
            if (isOk) {
              this.sound.playKeyUnlock();
              const svg = chestRig ? chestRig.querySelector('.chest-hero-svg') : null;
              if (svg) svg.classList.add('is-unlocked');
            }
            this.fx.shockwave(cr.left + cr.width / 2, cr.top + cr.height / 2, isOk ? '#fde047' : '#fb7185', 105);
            this.handleAnswer(isOk, opt);
          }
        );
      };
      grid.appendChild(btn);
    });
  }

  renderMemoryMode(arena, q, s) {
    const totalPairs = (q.pairs && q.pairs.length) || 3;
    const matchedNow = s.answered ? totalPairs : (q.memMatched || 0);
    const statusText = s.answered
      ? `${totalPairs} 組配對完成！`
      : q.memPeeking
        ? `記住牌面位置（可直接點擊翻牌）`
        : `已配對 ${matchedNow} / ${totalPairs} 組`;

    arena.innerHTML = `
      <div class="memory-arena-stage">
        <div class="memory-hero-header">
          <div class="memory-hero-rig" id="memory-hero-rig">${getHeroRigByMode('memory')}</div>
          <div class="memory-status-bar">${escapeHtml(statusText)}</div>
        </div>
        <div class="memory-grid-3x2" id="memory-grid"></div>
      </div>
    `;

    if (q.memPeeking && !q._peekTimerSet && !s.answered) {
      q._peekTimerSet = true;
      setTimeout(() => {
        if (this.view === 'play' && this.session && this.session.questions[this.session.index] === q && q.memPeeking) {
          q.memPeeking = false;
          this.render();
        }
      }, 950);
    }

    const memRig = document.getElementById('memory-hero-rig');
    const wandTip = document.getElementById('bunny-wand-tip');
    const grid = document.getElementById('memory-grid');
    (q.memCards || []).forEach((card, idx) => {
      const isFaceUp = Boolean(s.answered || q.memPeeking || card.matched || card.flipped);
      const isMatched = Boolean(s.answered || card.matched);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `mem-card-${idx}`;
      btn.dataset.pairId = String(card.pairId);
      btn.className = `mem-card-btn ${isFaceUp ? 'is-face-up' : ''} ${isMatched ? 'is-matched' : ''} ${card.mismatch ? 'is-mismatch' : ''}`;

      let frontHtml = '';
      if (card.kind === 'k2_hanzi') {
        frontHtml = `<span class="mem-k2-hanzi">${escapeHtml(card.hanzi)}</span>`;
      } else if (card.kind === 'k2_pic_zy') {
        frontHtml = `
          <span class="mem-k2-illus">${getK2WordIllustrationSvg(card.pairWord)}</span>
          <span class="mem-k2-zy">${renderVerticalZhuyin(card.zy, 'bubble')}</span>
        `;
      } else {
        frontHtml = `<span class="mem-g-text">${this.fmtText(card.text, q)}</span>`;
      }

      btn.innerHTML = `
        <span class="mem-card-inner">
          <span class="mem-face mem-face-back">${getMagicCardBackSvg()}</span>
          <span class="mem-face mem-face-front">${frontHtml}</span>
        </span>
      `;

      btn.onclick = () => {
        if (s.answered || q._memLock) return;
        if (q.memPeeking) q.memPeeking = false;
        if (card.matched || card.flipped) return;

        card.flipped = true;
        q._memFlippedIds.push(card.uid);
        this.sound.playCardFlip();
        if (this.state.autoRead && card.tts) {
          this.sound.speak(card.tts);
        }

        if (q._memFlippedIds.length === 1) {
          this.render();
          return;
        }

        if (q._memFlippedIds.length === 2) {
          const [id1, id2] = q._memFlippedIds;
          const c1 = q.memCards.find((c) => c.uid === id1);
          const c2 = q.memCards.find((c) => c.uid === id2);
          if (c1 && c2 && c1.pairId === c2.pairId) {
            c1.matched = true;
            c2.matched = true;
            q._memFlippedIds = [];
            q.memMatched = (q.memMatched || 0) + 1;
            this.sound.playPairMatch();
            const r = btn.getBoundingClientRect();
            const wr = (wandTip || memRig) ? (wandTip || memRig).getBoundingClientRect() : null;
            if (memRig) memRig.classList.add('wand-casting');
            if (wr) {
              this.fx.flyItem(wr.left + wr.width / 2, wr.top + wr.height / 2, r.left + r.width / 2, r.top + r.height / 2, 'star_orb', 'rgba(250, 204, 21, 0.9)', null, 36, 'star_orb');
            }
            this.fx.confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 26);
            if (q.memMatched >= totalPairs) {
              this.handleAnswer(true, 'paired_all');
            } else {
              this.render();
            }
          } else {
            q._memLock = true;
            if (c1) c1.mismatch = true;
            if (c2) c2.mismatch = true;
            this.render();
            setTimeout(() => {
              if (c1) { c1.flipped = false; c1.mismatch = false; }
              if (c2) { c2.flipped = false; c2.mismatch = false; }
              q._memFlippedIds = [];
              q._memLock = false;
              if (this.view === 'play') this.render();
            }, 560);
          }
        }
      };

      grid.appendChild(btn);
    });
  }

  renderQuizMoleMode(arena, q, s) {
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="mole-meadow-arena">
        <div class="mole-hero-header">
          <div class="mallet-hero-rig" id="mallet-hero-rig">${getHeroRigByMode('mole')}</div>
        </div>
        <div class="mole-holes-grid" id="mole-holes-grid"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const malletRig = document.getElementById('mallet-hero-rig');
    const holes = document.getElementById('mole-holes-grid');
    const moleSrc = (window.__ART__ && window.__ART__.mole) || '';
    q.shuffledOptions.forEach((opt, idx) => {
      const cleanOpt = stripDisplayEmojis(opt);
      const hole = document.createElement('button');
      hole.type = 'button';
      hole.className = `mole-hole-btn m-${idx}`;
      hole.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) hole.classList.add('correct-pick');
        else if (opt === s.pickedValue) hole.classList.add('wrong-pick');
      }
      const isPureZy = /^[\u3105-\u3129ˊˇˋ˙\s]+$/.test(cleanOpt);
      const signInner = isPureZy ? renderVerticalZhuyin(cleanOpt, 'inline') : this.fmtText(cleanOpt, q);
      hole.innerHTML = `
        <span class="mole-critter">
          <img class="mole-pixar-img" src="${moleSrc}" alt="地鼠" />
          <span class="mole-sign mole-quiz-sign">${signInner}</span>
        </span>
        <span class="mole-mound"></span>
      `;
      hole.onclick = () => {
        if (s.answered || q._moleWhacking) return;
        q._moleWhacking = true;
        hole.classList.add('whacking');
        if (malletRig) malletRig.classList.add('mallet-swing-hide');
        const isOk = opt === q.answer;
        this.sound.playHammerBonk(isOk);
        const r = hole.getBoundingClientRect();
        this.fx.screenShake(8);
        this.fx.swingGiantMallet(r.left + r.width / 2, r.top + r.height * 0.42, isOk, () => {
          q._moleWhacking = false;
          this.handleAnswer(isOk, opt);
        });
      };
      holes.appendChild(hole);
    });
  }

  renderDartMode(arena, q, s) {
    const initDeg = typeof q._lastBowDeg === 'number' ? q._lastBowDeg.toFixed(1) : '0';
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="dart-arena-box archery-range-stage" id="archery-stage">
        <div class="dart-targets-grid" id="dart-wrap"></div>
        <div class="archery-bow-dock">
          <div class="hero-bow-rig" id="hero-bow-rig" style="--bow-angle: ${initDeg}deg;">
            ${getHeroRigByMode('dart')}
          </div>
        </div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const wrap = document.getElementById('dart-wrap');
    const bowRig = document.getElementById('hero-bow-rig');

    const aimBowAt = (btnEl) => {
      if (!bowRig || !btnEl) return { bowX: window.innerWidth / 2, bowY: window.innerHeight - 90, toX: 0, toY: 0 };
      const br = bowRig.getBoundingClientRect();
      const tr = btnEl.getBoundingClientRect();
      const bowX = br.left + br.width / 2;
      const bowY = br.top + br.height * 0.45;
      const toX = tr.left + tr.width / 2;
      const toY = tr.top + tr.height / 2;
      const deg = Math.max(-42, Math.min(42, (Math.atan2(toX - bowX, Math.max(40, bowY - toY)) * 180) / Math.PI));
      q._lastBowDeg = deg;
      bowRig.style.setProperty('--bow-angle', `${deg.toFixed(1)}deg`);
      return { bowX, bowY, toX, toY };
    };

    q.shuffledOptions.forEach((opt, idx) => {
      const cleanOpt = stripDisplayEmojis(opt);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dart-target-btn d-${idx}`;
      btn.dataset.optIdx = idx;
      const isHitTarget = Boolean(s.answered && opt === s.pickedValue);
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      const isPureZy = /^[\u3105-\u3129ˊˇˋ˙\s]+$/.test(cleanOpt);
      const coreHtml = isPureZy ? renderVerticalZhuyin(cleanOpt, 'dart') : this.fmtText(cleanOpt, q);
      btn.innerHTML = `
        <span class="dart-ring-outer">
          <span class="dart-ring-mid">
            <span class="dart-ring-core">${coreHtml}</span>
          </span>
        </span>
        ${isHitTarget ? `<span class="dart-stuck-arrow" aria-hidden="true">${getPinnedArrowSvg()}</span>` : ''}
      `;

      btn.onpointerenter = (e) => {
        if (s.answered || q._dartFlying || (e && e.pointerType && e.pointerType !== 'mouse')) return;
        aimBowAt(btn);
      };

      btn.onclick = () => {
        if (s.answered || q._dartFlying) return;
        q._dartFlying = true;
        const coords = aimBowAt(btn);
        if (bowRig) bowRig.classList.add('bow-drawing');
        this.sound.playBowTwang();
        setTimeout(() => {
          if (bowRig) {
            bowRig.classList.remove('bow-drawing');
            bowRig.classList.add('bow-released');
          }
          this.sound.playDartThrow();
          this.fx.shootArrow(coords.bowX, coords.bowY, coords.toX, coords.toY, () => {
            q._dartFlying = false;
            this.handleAnswer(opt === q.answer, opt);
          });
        }, 85);
      };
      wrap.appendChild(btn);
    });
  }

  renderBubbleMode(arena, q, s) {
    arena.innerHTML = `
      ${this.renderArcadeContextBanner(q, s)}
      <div class="bubble-hero-stage">
        <div class="bubble-hero-header">
          <div class="bubble-hero-rig" id="bubble-hero-rig">${getHeroRigByMode('bubble_pop')}</div>
        </div>
        <div class="bubbles-stage" id="bubbles-wrap"></div>
      </div>
    `;
    this.bindArcadeContextBanner(q);

    const sealRig = document.getElementById('bubble-hero-rig');
    const wandGroup = sealRig ? sealRig.querySelector('.bubble-wand-group') : null;
    const wrap = document.getElementById('bubbles-wrap');
    q.shuffledOptions.forEach((opt, idx) => {
      const cleanOpt = stripDisplayEmojis(opt);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bubble-opt-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      const isPureZy = /^[\u3105-\u3129ˊˇˋ˙\s]+$/.test(cleanOpt);
      btn.innerHTML = isPureZy ? renderVerticalZhuyin(cleanOpt, 'bubble') : this.fmtText(cleanOpt, q);
      btn.onclick = () => {
        if (s.answered || q._bubbleBusy) return;
        q._bubbleBusy = true;
        this.sound.playPop();
        const r = btn.getBoundingClientRect();
        const originEl = wandGroup || sealRig;
        const wr = originEl ? originEl.getBoundingClientRect() : { left: r.left, top: r.top - 80, width: 0, height: 0 };
        this.fx.flyItem(
          wr.left + wr.width / 2,
          wr.top + wr.height / 2,
          r.left + r.width / 2,
          r.top + r.height / 2,
          'star_orb',
          'rgba(56, 189, 248, 0.9)',
          () => {
            q._bubbleBusy = false;
            this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#38bdf8', 100);
            this.fx.emojiBurst(r.left + r.width / 2, r.top + r.height / 2, ['#38bdf8', '#bae6fd', '#f472b6'], 12, true);
            this.handleAnswer(opt === q.answer, opt);
          },
          36,
          'star_orb'
        );
      };
      wrap.appendChild(btn);
    });
  }

  renderTypoMode(arena, q, s, useLaser = false) {
    const stepText = s.answered
      ? `訂正完成：${q.chars.map((c, i) => (i === q.wrongIndex ? `【${q.answer}】` : c)).join('')}`
      : !q.caughtBug
        ? '第一步・點出句子中寫錯的字'
        : '第二步・點選正確的國字完成訂正';

    let realWrongOrd = 0;
    for (let i = 0; i <= q.wrongIndex; i++) {
      if (!PUNCT_RE.test(q.chars[i])) realWrongOrd++;
    }

    arena.innerHTML = `
      <div class="typo-hero-stage ${useLaser ? 'is-ufo-stage' : 'is-mole-stage'}">
        <div class="typo-hero-top">
          ${useLaser
            ? `<div class="ufo-hero-rig" id="ufo-hero-rig">${getHeroRigByMode('typo_laser')}</div>`
            : `<div class="mallet-hero-rig" id="mallet-hero-rig">${getHeroRigByMode('mole')}</div>`}
          <div class="typo-step-banner ${useLaser ? 'laser-theme' : ''}" id="typo-banner">${escapeHtml(stepText)}</div>
        </div>

        <div class="typo-sentence-grid" id="typo-chars"></div>

        ${useLaser ? `
          <div class="ufo-laser-arena" id="typo-stamps" style="${!q.caughtBug && !s.answered ? 'display:none;' : ''}">
            <div class="ufo-crystals-grid" id="ufo-crystals-grid"></div>
          </div>
        ` : `
          <div class="mole-meadow-arena" id="typo-stamps" style="${!q.caughtBug && !s.answered ? 'display:none;' : ''}">
            <div class="mole-holes-grid" id="mole-holes-grid"></div>
          </div>
        `}
      </div>
    `;

    const ufoRig = document.getElementById('ufo-hero-rig');
    const ufoCore = document.getElementById('ufo-cannon-core');
    const malletRig = document.getElementById('mallet-hero-rig');
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
      btn.type = 'button';
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
        if (s.answered || q.caughtBug || q._typoStep1Busy) return;
        if (idx === q.wrongIndex) {
          const r = btn.getBoundingClientRect();
          if (useLaser) {
            q._typoStep1Busy = true;
            this.sound.playUfoLaser();
            if (ufoRig) ufoRig.classList.add('ufo-firing');
            const cr = (ufoCore || ufoRig) ? (ufoCore || ufoRig).getBoundingClientRect() : { left: r.left, top: r.top - 90, width: 0, height: 0 };
            this.fx.fireLaserBeam(
              cr.left + cr.width / 2,
              cr.top + cr.height / 2,
              r.left + r.width / 2,
              r.top + r.height / 2,
              '#38bdf8',
              () => {
                q._typoStep1Busy = false;
                q.caughtBug = true;
                if (this.state.autoRead) this.sound.speak('鎖定錯字！請選正確的國字水晶！');
                this.render();
              }
            );
          } else {
            q.caughtBug = true;
            this.sound.playMolePop();
            this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#4ade80', 90);
            if (this.state.autoRead) this.sound.speak('找到錯字了！請敲正確的字！');
            this.render();
          }
        } else {
          q.wrongTaps = (q.wrongTaps || 0) + 1;
          this.sound.playTap();
          btn.classList.remove('shake-no');
          void btn.offsetWidth;
          btn.classList.add('shake-no');
          const banner = document.getElementById('typo-banner');
          if (banner) {
            banner.textContent = q.wrongTaps >= 2
              ? `提示：仔細看看第 ${realWrongOrd} 個字「${q.chars[q.wrongIndex]}」`
              : `「${ch}」寫對了，再找找哪個字寫錯囉`;
          }
        }
      };
      charsWrap.appendChild(btn);
    });

    if ((q.caughtBug || s.answered) && useLaser) {
      const grid = document.getElementById('ufo-crystals-grid');
      q.shuffledOptions.forEach((opt, idx) => {
        const cry = document.createElement('button');
        cry.type = 'button';
        cry.className = `ufo-crystal-btn uc-${idx % 4}`;
        cry.dataset.optIdx = idx;
        if (s.answered) {
          if (opt === q.answer) cry.classList.add('correct-pick');
          else if (opt === s.pickedValue) cry.classList.add('wrong-pick');
        }
        cry.innerHTML = `
          <span class="ufo-crystal-gem">${getSpaceCrystalSvg(idx)}</span>
          <span class="ufo-crystal-char">${escapeHtml(stripDisplayEmojis(opt))}</span>
        `;
        cry.onclick = () => {
          if (s.answered || q._laserBusy) return;
          q._laserBusy = true;
          const isOk = opt === q.answer;
          this.sound.playUfoLaser();
          if (ufoRig) ufoRig.classList.add('ufo-firing');
          const cr = cry.getBoundingClientRect();
          const mr = (ufoCore || ufoRig) ? (ufoCore || ufoRig).getBoundingClientRect() : { left: window.innerWidth / 2, top: cr.top - 100, width: 0, height: 0 };
          this.fx.fireLaserBeam(
            mr.left + mr.width / 2,
            mr.top + mr.height / 2,
            cr.left + cr.width / 2,
            cr.top + cr.height / 2,
            isOk ? '#38bdf8' : '#fb7185',
            () => {
              q._laserBusy = false;
              this.handleAnswer(isOk, opt);
            }
          );
        };
        grid.appendChild(cry);
      });
    } else if (q.caughtBug || s.answered) {
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
          <span class="mole-critter">
            <img class="mole-pixar-img" src="${moleSrc}" alt="地鼠" />
            <span class="mole-sign">${escapeHtml(stripDisplayEmojis(opt))}</span>
          </span>
          <span class="mole-mound"></span>
        `;
        hole.onclick = () => {
          if (s.answered || q._moleWhacking) return;
          q._moleWhacking = true;
          hole.classList.add('whacking');
          if (malletRig) malletRig.classList.add('mallet-swing-hide');
          const isOk = opt === q.answer;
          this.sound.playHammerBonk(isOk);
          const r = hole.getBoundingClientRect();
          this.fx.screenShake(8);
          this.fx.swingGiantMallet(r.left + r.width / 2, r.top + r.height * 0.42, isOk, () => {
            q._moleWhacking = false;
            this.handleAnswer(isOk, opt);
          });
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
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '？'}</div>
        </div>
      `
      : `
        <div class="alchemy-formula">
          <div class="alchemy-slot">${escapeHtml(q.basePart)}</div>
          <div class="alchemy-plus">＋</div>
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.answer) : '？'}</div>
          <div class="alchemy-plus">＝</div>
          <div class="alchemy-slot ${s.answered ? 'result-forged' : 'mystery'}">${s.answered ? escapeHtml(q.resultChar) : '？'}</div>
        </div>
      `;

    arena.innerHTML = `
      <div class="alchemy-arena alchemy-hero-arena">
        <div class="cauldron-hero-rig" id="cauldron-hero-rig">${getHeroRigByMode('alchemy')}</div>
        <div class="alchemy-workbench">
          <div class="workbench-hint-label">
            造詞提示：${this.fmtText(q.wordHint, q)} ${isVertical ? '（上下疊合）' : '（左右組合）'}
          </div>
          ${formulaHtml}
        </div>
      </div>
      <div class="options-grid" id="alchemy-opts"></div>
    `;
    const potRig = document.getElementById('cauldron-hero-rig');
    const potMouth = document.getElementById('cauldron-mouth-target');
    const wrap = document.getElementById('alchemy-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card-btn alchemy-potion-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      this.populateArcadeOption(btn, opt, q, getMagicPotionSvg(idx));
      btn.onclick = () => {
        if (s.answered || q._alchemyBusy) return;
        q._alchemyBusy = true;
        this.sound.playCauldronBubble();
        const br = btn.getBoundingClientRect();
        const targetEl = potMouth || potRig;
        const pr = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 90, width: 0, height: 0 };
        this.fx.flyItem(
          br.left + br.width / 2,
          br.top + br.height / 2,
          pr.left + pr.width / 2,
          pr.top + pr.height / 2,
          'potion',
          'rgba(192, 132, 252, 0.92)',
          () => {
            q._alchemyBusy = false;
            this.fx.shockwave(pr.left + pr.width / 2, pr.top + pr.height / 2, '#c084fc', 100);
            this.handleAnswer(opt === q.answer, opt);
          },
          78,
          'potion'
        );
      };
      wrap.appendChild(btn);
    });
  }

  renderTrainMode(arena, q, s) {
    arena.innerHTML = `
      ${q.trainRetryMsg && !s.answered ? `<div class="train-retry-banner" id="train-retry-msg">${escapeHtml(q.trainRetryMsg)}</div>` : ''}
      <div class="train-track-box ${s.answered && s.isCorrect ? 'train-departed' : ''}" id="train-track">
        <div class="train-hero-engine" id="train-hero-rig">${getHeroRigByMode('train')}</div>
        <div class="train-cars-coupled" id="train-cars-coupled"></div>
      </div>
      <div class="train-pool" id="train-pool"></div>
    `;
    const coupled = document.getElementById('train-cars-coupled');
    const pool = document.getElementById('train-pool');

    const activeList = s.answered ? q.answerOrder.map((text) => ({ text })) : q.hooked;
    if (activeList.length === 0) {
      const hint = document.createElement('span');
      hint.className = 'train-empty-hint';
      hint.textContent = '請依序點選下方車廂掛上火車頭（點已掛車廂可取下重排）';
      coupled.appendChild(hint);
    } else {
      activeList.forEach((car, hIdx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'train-hooked-car';
        b.innerHTML = this.fmtText(car.text, q);
        if (!s.answered) {
          b.title = '點擊取下這節車廂';
          b.onclick = () => {
            this.sound.playTap();
            const removed = q.hooked.splice(hIdx, 1)[0];
            const orig = q.poolCarriages.find((c) => c.id === removed.id);
            if (orig) orig.used = false;
            this.render();
          };
        }
        coupled.appendChild(b);
      });
    }

    if (!s.answered) {
      q.poolCarriages.forEach((car, idx) => {
        if (car.used) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toy-btn primary train-pool-car-btn';
        btn.dataset.optIdx = idx;
        btn.innerHTML = `${getTrainCarBadgeSvg()} <span>${this.fmtText(car.text, q)}</span>`;
        btn.onclick = () => {
          if (q._trainBusy) return;
          car.used = true;
          q.hooked.push(car);
          q.trainRetryMsg = '';
          this.sound.playHook();
          if (q.hooked.length === q.answerOrder.length) {
            const ok = q.hooked.map((c) => c.text).join('|') === q.answerOrder.join('|');
            if (ok) {
              q._trainBusy = true;
              this.sound.playTrainHorn();
              this.render();
              const trEl = document.getElementById('train-track');
              if (trEl) trEl.classList.add('train-departing');
              setTimeout(() => {
                q._trainBusy = false;
                this.handleAnswer(true, q.hooked.map((c) => c.text).join(''));
              }, 260);
            } else if ((q.trainRetries || 0) < 1) {
              q.trainRetries = (q.trainRetries || 0) + 1;
              q.hooked = [];
              q.poolCarriages.forEach((c) => { c.used = false; });
              q.trainRetryMsg = '車廂順序差一點點喔！已為你退回重排，再試一次保住連擊！';
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
      <div class="judge-thunder-stage">
        <div class="judge-hero-header">
          <div class="judge-hero-rig" id="judge-hero-rig">${getHeroRigByMode('judge')}</div>
        </div>
        <div class="judge-statement-box">
          <div class="judge-stmt-text">${this.fmtText(q.statement, q)}</div>
          <button type="button" id="btn-read-stmt" class="toy-btn sm sun judge-spk-btn" title="聽敘述">
            ${iconSpeaker(true, 17)}
          </button>
        </div>
        <div class="judge-buttons-row">
          <button type="button" id="judge-yes" data-opt-idx="0" class="toy-btn mint judge-big-btn">
            ${getJudgeRuneSvg(true)} <span>正確</span>
          </button>
          <button type="button" id="judge-no" data-opt-idx="1" class="toy-btn coral judge-big-btn">
            ${getJudgeRuneSvg(false)} <span>錯誤</span>
          </button>
        </div>
      </div>
    `;
    const stmtBtn = document.getElementById('btn-read-stmt');
    if (stmtBtn) stmtBtn.onclick = () => this.sound.speak(q.statement);

    const judgeRig = document.getElementById('judge-hero-rig');
    const boltOrigin = document.getElementById('judge-bolt-origin');
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

    const triggerJudgeBolt = (picked, btnEl) => {
      if (s.answered || q._judgeBusy) return;
      q._judgeBusy = true;
      if (judgeRig) judgeRig.classList.add('hammer-slamming');
      this.sound.playThunderStrike();
      this.fx.screenShake(7);
      const br = btnEl.getBoundingClientRect();
      const orEl = boltOrigin || judgeRig;
      const hr = orEl ? orEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 90, width: 0, height: 0 };
      this.fx.strikeLightning(
        hr.left + hr.width / 2,
        hr.top + hr.height / 2,
        br.left + br.width / 2,
        br.top + br.height / 2,
        () => {
          q._judgeBusy = false;
          this.handleAnswer(q.answer === picked, picked);
        }
      );
    };

    yesBtn.onclick = () => triggerJudgeBolt('⭕', yesBtn);
    noBtn.onclick = () => triggerJudgeBolt('❌', noBtn);
  }

  renderK2SoundMode(arena, q, s, useDart = true) {
    const initDeg = typeof q._lastBowDeg === 'number' ? q._lastBowDeg.toFixed(1) : '0';
    arena.innerHTML = `
      <div class="k2-clue-bar-wrap">
        <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點我再聽一次發音">
          <span class="k2-clue-illus">${getK2WordIllustrationSvg(q.charFocus || q.answer, q.pic)}</span>
          ${q.charFocus ? `<span class="k2-clue-hanzi">${escapeHtml(q.charFocus)}</span>` : ''}
          <span class="k2-speak-tag">${iconSpeaker(true, 16)} <span>點聽發音</span></span>
        </button>
      </div>
      ${useDart ? `
        <div class="dart-arena-box archery-range-stage" id="archery-stage">
          <div class="dart-targets-grid" id="k2-sound-wrap"></div>
          <div class="archery-bow-dock">
            <div class="hero-bow-rig" id="hero-bow-rig" style="--bow-angle: ${initDeg}deg;">
              ${getHeroRigByMode('dart')}
            </div>
          </div>
        </div>
      ` : `
        <div class="bubble-hero-stage">
          <div class="bubble-hero-header">
            <div class="bubble-hero-rig" id="bubble-hero-rig">${getHeroRigByMode('bubble_pop')}</div>
          </div>
          <div class="bubbles-stage" id="k2-sound-wrap"></div>
        </div>
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
    const bowRig = document.getElementById('hero-bow-rig');
    const sealRig = document.getElementById('bubble-hero-rig');
    const wandGroup = sealRig ? sealRig.querySelector('.bubble-wand-group') : null;

    const aimBowAt = (btnEl) => {
      if (!bowRig || !btnEl) return { bowX: window.innerWidth / 2, bowY: window.innerHeight - 90, toX: 0, toY: 0 };
      const br = bowRig.getBoundingClientRect();
      const tr = btnEl.getBoundingClientRect();
      const bowX = br.left + br.width / 2;
      const bowY = br.top + br.height * 0.45;
      const toX = tr.left + tr.width / 2;
      const toY = tr.top + tr.height / 2;
      const deg = Math.max(-42, Math.min(42, (Math.atan2(toX - bowX, Math.max(40, bowY - toY)) * 180) / Math.PI));
      q._lastBowDeg = deg;
      bowRig.style.setProperty('--bow-angle', `${deg.toFixed(1)}deg`);
      return { bowX, bowY, toX, toY };
    };

    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.optIdx = idx;
      if (useDart) {
        btn.className = `dart-target-btn d-${idx}`;
        const isHitTarget = Boolean(s.answered && opt === s.pickedValue);
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
          ${isHitTarget ? `<span class="dart-stuck-arrow" aria-hidden="true">${getPinnedArrowSvg()}</span>` : ''}
        `;
        btn.onpointerenter = (e) => {
          if (s.answered || q._dartFlying || (e && e.pointerType && e.pointerType !== 'mouse')) return;
          aimBowAt(btn);
        };
        btn.onclick = () => {
          if (s.answered || q._dartFlying) return;
          q._dartFlying = true;
          const coords = aimBowAt(btn);
          if (bowRig) bowRig.classList.add('bow-drawing');
          this.sound.playBowTwang();
          setTimeout(() => {
            if (bowRig) {
              bowRig.classList.remove('bow-drawing');
              bowRig.classList.add('bow-released');
            }
            this.sound.playDartThrow();
            this.fx.shootArrow(coords.bowX, coords.bowY, coords.toX, coords.toY, () => {
              q._dartFlying = false;
              this.handleAnswer(opt === q.answer, opt);
            });
          }, 85);
        };
      } else {
        btn.className = 'bubble-opt-btn';
        if (s.answered) {
          if (opt === q.answer) btn.classList.add('correct-pick');
          else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
        }
        btn.innerHTML = renderVerticalZhuyin(opt, 'bubble');
        btn.onclick = () => {
          if (s.answered || q._bubbleBusy) return;
          q._bubbleBusy = true;
          this.sound.playPop();
          const r = btn.getBoundingClientRect();
          const originEl = wandGroup || sealRig;
          const wr = originEl ? originEl.getBoundingClientRect() : { left: r.left, top: r.top - 80, width: 0, height: 0 };
          this.fx.flyItem(
            wr.left + wr.width / 2,
            wr.top + wr.height / 2,
            r.left + r.width / 2,
            r.top + r.height / 2,
            'star_orb',
            'rgba(56, 189, 248, 0.9)',
            () => {
              q._bubbleBusy = false;
              this.fx.shockwave(r.left + r.width / 2, r.top + r.height / 2, '#38bdf8', 100);
              this.fx.emojiBurst(r.left + r.width / 2, r.top + r.height / 2, ['#38bdf8', '#bae6fd', '#f472b6'], 12, true);
              this.handleAnswer(opt === q.answer, opt);
            },
            36,
            'star_orb'
          );
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
      <div class="alchemy-arena k2-spell-arena alchemy-hero-arena">
        <div class="cauldron-hero-rig" id="cauldron-hero-rig">${getHeroRigByMode('alchemy')}</div>
        <div class="alchemy-workbench">
          <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點我聽拼音提示">
            <span class="k2-clue-illus">${getK2WordIllustrationSvg(q.resultChar, q.pic)}</span>
            <span class="k2-speak-tag">${iconSpeaker(true, 16)} <span>聽拼音</span></span>
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
      </div>
      <div class="options-grid k2-spell-opts" id="k2-spell-opts"></div>
    `;

    this.bindArcadeContextBanner(q);

    const potRig = document.getElementById('cauldron-hero-rig');
    const potMouth = document.getElementById('cauldron-mouth-target');
    const wrap = document.getElementById('k2-spell-opts');
    q.shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card-btn k2-zy-card-btn alchemy-potion-btn';
      btn.dataset.optIdx = idx;
      if (s.answered) {
        if (opt === q.answer) btn.classList.add('correct-pick');
        else if (opt === s.pickedValue) btn.classList.add('wrong-pick');
      }
      btn.innerHTML = `
        <span class="arcade-opt-prop">${getMagicPotionSvg(idx)}</span>
        <span class="k2-zy-opt-center">${renderVerticalZhuyin(opt, 'bubble')}</span>
        <span role="button" tabindex="0" class="opt-speak-chip" title="聽注音發音">${iconSpeaker(true, 16)}</span>
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
        if (s.answered || q._alchemyBusy) return;
        q._alchemyBusy = true;
        this.sound.playCauldronBubble();
        const br = btn.getBoundingClientRect();
        const targetEl = potMouth || potRig;
        const pr = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: br.top - 90, width: 0, height: 0 };
        this.fx.flyItem(
          br.left + br.width / 2,
          br.top + br.height / 2,
          pr.left + pr.width / 2,
          pr.top + pr.height / 2,
          'potion',
          'rgba(192, 132, 252, 0.92)',
          () => {
            q._alchemyBusy = false;
            this.fx.shockwave(pr.left + pr.width / 2, pr.top + pr.height / 2, '#c084fc', 100);
            this.handleAnswer(opt === q.answer, opt);
          },
          78,
          'potion'
        );
      };
      wrap.appendChild(btn);
    });
  }

  renderK2MoleMode(arena, q, s) {
    arena.innerHTML = `
      <div class="k2-clue-bar-wrap">
        <button type="button" class="k2-hero-clue-card compact" id="btn-k2-clue" title="點我聽聲音提示">
          <span class="k2-clue-illus">${getK2WordIllustrationSvg(q.answer, q.pic)}</span>
          ${q.hintZhuyin ? `<span class="k2-mole-zy-badge">${renderVerticalZhuyin(q.hintZhuyin, 'bubble')}</span>` : ''}
          <span class="k2-speak-tag">${iconSpeaker(true, 16)} <span>聽音找字</span></span>
        </button>
      </div>
      <div class="mole-meadow-arena">
        <div class="mole-hero-header">
          <div class="mallet-hero-rig" id="mallet-hero-rig">${getHeroRigByMode('mole')}</div>
        </div>
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

    const malletRig = document.getElementById('mallet-hero-rig');
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
        <span class="mole-critter">
          <img class="mole-pixar-img" src="${moleSrc}" alt="地鼠" />
          <span class="mole-sign k2-mole-hanzi">${escapeHtml(stripDisplayEmojis(opt))}</span>
        </span>
        <span class="mole-mound"></span>
      `;
      hole.onclick = () => {
        if (s.answered || q._moleWhacking) return;
        q._moleWhacking = true;
        hole.classList.add('whacking');
        if (malletRig) malletRig.classList.add('mallet-swing-hide');
        const isOk = opt === q.answer;
        this.sound.playHammerBonk(isOk);
        const r = hole.getBoundingClientRect();
        this.fx.screenShake(8);
        this.fx.swingGiantMallet(r.left + r.width / 2, r.top + r.height * 0.42, isOk, () => {
          q._moleWhacking = false;
          this.handleAnswer(isOk, opt);
        });
      };
      holes.appendChild(hole);
    });
  }

  renderVictory(deck) {
    const s = this.session;
    const canGacha = this.state.coins >= 50;
    const accuracy = Math.round((s.correctCount / Math.max(1, s.questions.length)) * 100);

    deck.innerHTML = `
      <div class="game-cabinet-shell victory-cabinet">
        <div class="victory-center">
          <span class="victory-ribbon-pill">闖關挑戰完成</span>
          <h2 class="victory-lesson-title">${renderVerticalZhuyin(stripDisplayEmojis(s.title), 'inline')}</h2>
          <div class="victory-stars-showcase">${renderStarsSvg(s.finalStars, 52)}</div>

          <div class="victory-stats-cards">
            <div class="vic-stat-box">
              <span class="vic-stat-label">答對率</span>
              <strong class="vic-stat-val">${s.correctCount} / ${s.questions.length}（${accuracy}%）</strong>
            </div>
            <div class="vic-stat-box">
              <span class="vic-stat-label">最高連擊</span>
              <strong class="vic-stat-val">${s.maxCombo} 連擊</strong>
            </div>
            <div class="vic-stat-box">
              <span class="vic-stat-label">獲得獎勵</span>
              <strong class="vic-stat-val">${iconGoldCoin(20)} +${s.earnedCoins} ・ ${iconStarGem(20)} +${s.earnedGems}</strong>
            </div>
          </div>

          ${s.unlockedSpecialDragon ? `
            <div class="victory-dragon-unlock">
              恭喜以三星滿分擊敗總複習魔王，解鎖傳說神獸【星光狀元龍】！
            </div>
          ` : ''}

          <div class="victory-actions-row">
            ${canGacha ? `
              <button type="button" id="btn-vic-gacha" class="toy-btn sun victory-cta-btn">
                ${iconGachaGlobe(22)} <span>前往神獸扭蛋殿堂（持有 ${this.state.coins} 金幣）</span>
              </button>
            ` : ''}
            <button type="button" id="btn-vic-hub" class="toy-btn primary victory-cta-btn">
              ${iconBackArrow(18)} <span>返回地圖選下一課</span>
            </button>
          </div>
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
      <div class="subview-header">
        <div>
          <span class="pedagogy-tag">闖關累積金幣獎勵兌換</span>
          <h2 class="subview-title">守護神獸扭蛋殿堂（已收集 ${this.state.unlockedPets.length} / ${PET_CATALOG.length}）</h2>
        </div>
        <div class="subview-actions">
          <button id="btn-spin-gacha" class="toy-btn coral" ${!canSpin ? 'disabled' : ''}>
            ${iconGachaGlobe(20)} <span>${this.gachaRolling ? '轉動扭蛋中…' : '轉動扭蛋（50 金幣）'}</span>
          </button>
          <button id="btn-gacha-back" class="toy-btn">${iconBackArrow(16)} <span>返回地圖</span></button>
        </div>
      </div>

      ${this.gachaLastWon ? `
        <div class="feedback-sheet good" style="margin-top:14px;">
          <img class="pet-3d-avatar" src="${this.getPetArt(this.gachaLastWon.id)}" alt="" />
          <div class="feedback-main-col">
            <strong style="font-size:1.12rem;color:#065f46;">${this.gachaLastWon.isNew ? '恭喜獲得全新守護夥伴！' : '夥伴星力提升（額外 +5 寶石）！'}</strong>
            <div><strong>${escapeHtml(this.gachaLastWon.name)}</strong>（${escapeHtml(this.gachaLastWon.rarity)}）— ${escapeHtml(stripDisplayEmojis(this.gachaLastWon.desc || ''))}</div>
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
          : `<div class="pet-mystery-egg">${getMysteryEggSvg()}</div>`}
        <div class="pet-name">${unlocked ? escapeHtml(p.name) : '神秘守護蛋'}</div>
        <div class="pet-rarity">${escapeHtml(p.rarity)}</div>
        <div class="pet-equip-tag">
          ${equipped ? '目前陪伴中' : unlocked ? '點擊設為夥伴' : '50 金幣扭蛋解鎖'}
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
    const allMistakes = Object.values(this.state.mistakes || {});
    const totalAns = this.state.totalAnswered || 0;
    const totalCor = this.state.totalCorrect || 0;
    const overallAcc = totalAns > 0 ? Math.round((totalCor / totalAns) * 100) : 100;

    const skillDimensions = [
      '聽音辨字・注音啟蒙',
      '拼音合成・聲調練習',
      '部首結構・造字邏輯',
      '錯別字偵測・視覺校對',
      '語法結構・句型重組',
      '課文素養・閱讀理解',
    ];

    const skillRowsHtml = skillDimensions.map((dim) => {
      const st = (this.state.skillStats && this.state.skillStats[dim]) || { right: 0, total: 0 };
      const pct = st.total > 0 ? Math.round((st.right / st.total) * 100) : 0;
      const statusLabel = st.total === 0 ? '尚未施測' : `${st.right} / ${st.total} 題正確（${pct}%）`;
      return `
        <div class="report-skill-row">
          <div class="report-skill-head">
            <strong>${escapeHtml(dim)}</strong>
            <span>${escapeHtml(statusLabel)}</span>
          </div>
          <div class="report-skill-bar">
            <div class="report-skill-fill" style="width:${st.total > 0 ? Math.max(8, pct) : 0}%"></div>
          </div>
        </div>
      `;
    }).join('');

    deck.innerHTML = `
      <div class="subview-header">
        <div>
          <span class="pedagogy-tag">家長專區・學習成效分析與弱點追蹤</span>
          <h2 class="subview-title">國語文核心素養診斷報告</h2>
        </div>
        <button id="btn-report-back" class="toy-btn primary">${iconBackArrow(16)} <span>返回冒險地圖</span></button>
      </div>

      <div class="report-summary-grid">
        <div class="report-stat-card">
          <span class="report-card-kicker">幼兒中班・注音啟蒙</span>
          <strong class="report-card-big">${k2Stars} / 24 星章</strong>
          <div class="report-card-sub">總複習挑戰：${renderStarsSvg(this.state.stars.boss_k2 || 0, 17)}</div>
        </div>
        <div class="report-stat-card">
          <span class="report-card-kicker">國小一年級・115 南一</span>
          <strong class="report-card-big">${g1Stars} / 21 星章</strong>
          <div class="report-card-sub">總複習挑戰：${renderStarsSvg(this.state.stars.boss_g1 || 0, 17)}</div>
        </div>
        <div class="report-stat-card">
          <span class="report-card-kicker">國小二年級・115 南一</span>
          <strong class="report-card-big">${g2Stars} / 18 星章</strong>
          <div class="report-card-sub">總複習挑戰：${renderStarsSvg(this.state.stars.boss_g2 || 0, 17)}</div>
        </div>
        <div class="report-stat-card">
          <span class="report-card-kicker">累計作答正確率</span>
          <strong class="report-card-big">${totalAns > 0 ? `${overallAcc}%` : '準備出發'}</strong>
          <div class="report-card-sub">已作答 ${totalAns} 題・最高 ${this.state.bestCombo} 連擊</div>
        </div>
      </div>

      <div class="report-two-col">
        <div class="report-panel">
          <h3 class="report-panel-title">六大語文能力向度分析</h3>
          <div class="report-skills-list">${skillRowsHtml}</div>
        </div>

        <div class="report-panel">
          <h3 class="report-panel-title">待加強錯題庫（${allMistakes.length} 題）</h3>
          ${allMistakes.length === 0
            ? `<p class="report-empty-note">目前所有練習題目皆已掌握，沒有累積錯題！</p>`
            : `
              <ul class="report-mistake-list">
                ${allMistakes.slice(0, 6).map((mq) => `<li>${escapeHtml(stripDisplayEmojis(mq.prompt || ''))}</li>`).join('')}
              </ul>
              <button type="button" id="btn-report-fix-now" class="toy-btn mint" style="margin-top:10px;">立即啟動弱點錯題修練</button>
            `}
        </div>
      </div>

      <div class="moe-credit-note">
        注音符號真人發音音源：中華民國教育部《國語注音符號手冊－開放部件》（創用 CC 姓名標示 4.0 國際授權）
      </div>
    `;
    document.getElementById('btn-report-back').onclick = () => this.goHub();
    const fixBtn = document.getElementById('btn-report-fix-now');
    if (fixBtn) {
      fixBtn.onclick = () => {
        const firstM = allMistakes[0];
        if (firstM && firstM.id) {
          const gMatch = firstM.id.match(/^(k2|g1|g2)_/);
          if (gMatch) this.state.grade = gMatch[1];
        }
        this.startMistakeReview();
      };
    }
  }
}

function iconSingleStarMini() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-2px;"><path d="M12 2 L14.9 8.6 L22 9.4 L16.7 14.2 L18.2 21.2 L12 17.6 L5.8 21.2 L7.3 14.2 L2 9.4 L9.1 8.6 Z" fill="#fde047" stroke="#b45309" stroke-width="1.5"/></svg>`;
}

window.addEventListener('DOMContentLoaded', () => {
  window.__app = new ChineseAdventureApp();
});
