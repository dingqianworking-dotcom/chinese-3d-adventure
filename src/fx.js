// 60fps Canvas 2D Arcade Juice & Giant Hero Weapon/Projectile Engine
// Includes Giant 3D Feathered Arrows, Real Cast-&-Reel Fishing Line, Full-Stage UFO Plasma Beams,
// Giant Carnival Toy Mallet Swings, Rotating Golden Keys, Thunderbolts, Oversized Food/Potions, Confetti & Shockwaves.

class FXEngine {
  constructor(canvasId = 'fx-canvas') {
    this.canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.rings = [];
    this.texts = [];
    this.darts = [];
    this.beams = [];
    this.fishingCasts = [];
    this.mallets = [];
    this.lastTime = performance.now();
    this.running = false;
    if (this.canvas && this.ctx) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.running = true;
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  confettiBurst(x, y, count = 42) {
    if (!this.ctx) return;
    const colors = ['#fde047', '#fb7185', '#38bdf8', '#4ade80', '#c084fc', '#fb923c', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const spd = 160 + Math.random() * 340;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 140,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 12,
        life: 0.75 + Math.random() * 0.55,
        maxLife: 1.3,
        color: colors[i % colors.length],
        star: i % 3 === 0,
      });
    }
  }

  shockwave(x, y, color = '#fde047', maxR = 95) {
    if (!this.ctx) return;
    this.rings.push({ x, y, r: 10, maxR, color, life: 0.48, maxLife: 0.48 });
  }

  multiRipple(x, y, colors = ['#fde047', '#38bdf8', '#fb7185']) {
    if (!this.ctx) return;
    colors.forEach((col, i) => {
      setTimeout(() => {
        this.rings.push({ x, y, r: 12, maxR: 85 + i * 38, color: col, life: 0.55, maxLife: 0.55 });
      }, i * 95);
    });
  }

  emojiBurst(x, y, emojis = ['✨', '🌟'], count = 14, floatUp = false) {
    if (!this.ctx) return;
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const spd = floatUp ? (70 + Math.random() * 140) : (120 + Math.random() * 250);
      this.particles.push({
        x: x + (Math.random() - 0.5) * 28,
        y: y + (Math.random() - 0.5) * 18,
        vx: Math.cos(ang) * spd,
        vy: floatUp ? (-120 - Math.random() * 150) : (Math.sin(ang) * spd - 120),
        gravity: floatUp ? -35 : 380,
        size: 22 + Math.random() * 12,
        rot: (Math.random() - 0.5) * 0.5,
        vrot: (Math.random() - 0.5) * 3,
        life: 0.95 + Math.random() * 0.45,
        maxLife: 1.4,
        emoji: emojis[i % emojis.length],
      });
    }
  }

  floatText(x, y, text, color = '#fbbf24') {
    if (!this.ctx) return;
    this.texts.push({ x, y, vy: -95, text, color, life: 1.05, maxLife: 1.05 });
  }

  _withSafety(arr, item, timeoutMs, finish) {
    arr.push(item);
    setTimeout(() => {
      const idx = arr.indexOf(item);
      if (idx >= 0) arr.splice(idx, 1);
      finish();
    }, timeoutMs);
  }

  // Giant 64px Custom/Emoji Flying Projectile (Food into Dino Jaws, Potion into Cauldron, Starlight Wand Pin)
  flyItem(fromX, fromY, toX, toY, emoji = '🍩', trailColor = 'rgba(253, 224, 71, 0.88)', onArrive = null, arcHeight = 76, kind = 'emoji') {
    if (!this.ctx) {
      if (onArrive) onArrive();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (onArrive) onArrive();
    };
    const item = {
      fromX, fromY, toX, toY,
      emoji,
      kind,
      trailColor,
      arcHeight,
      t: 0,
      dur: kind === 'arrow' ? 0.25 : 0.30,
      onArrive: finish,
    };
    this._withSafety(this.darts, item, 580, finish);
  }

  // 1) Giant 96px 3D Golden-Tipped Crimson-Feathered Arrow!
  shootArrow(fromX, fromY, toX, toY, onArrive = null) {
    this.flyItem(fromX, fromY, toX, toY, '🏹', 'rgba(251, 191, 36, 0.92)', onArrive, 32, 'arrow');
  }

  flyDart(fromX, fromY, toX, toY, onArrive = null) {
    this.shootArrow(fromX, fromY, toX, toY, onArrive);
  }

  // 2) Giant 84px 3D Ruby-Gold Key that flies to chest lock and twists!
  flyGoldenKey(fromX, fromY, toX, toY, onArrive = null) {
    this.flyItem(fromX, fromY, toX, toY, '🗝️', 'rgba(250, 204, 21, 0.92)', onArrive, 68, 'key');
  }

  // 3) Real 2-Stage Cast-and-Reel Fishing Line + Bobber + Big Wriggling Fish!
  castFishingLine(rodX, rodY, fishX, fishY, fishColor = '#fb923c', onArrive = null) {
    if (!this.ctx) {
      if (onArrive) onArrive();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (onArrive) onArrive();
    };
    const cast = {
      rodX, rodY, fishX, fishY, fishColor,
      splashed: false,
      t: 0,
      dur: 0.44,
      onArrive: finish,
    };
    this._withSafety(this.fishingCasts, cast, 720, finish);
  }

  // 4) Massive Full-Stage UFO Plasma Laser Beam / Thunder Hammer Lightning Bolt!
  fireLaserBeam(fromX, fromY, toX, toY, color = '#38bdf8', onArrive = null, isLightning = false) {
    if (!this.ctx) {
      if (onArrive) onArrive();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (onArrive) onArrive();
    };
    const beam = {
      fromX, fromY, toX, toY, color, isLightning,
      impacted: false,
      t: 0,
      dur: 0.28,
      onArrive: finish,
    };
    this._withSafety(this.beams, beam, 520, finish);
  }

  strikeLightning(fromX, fromY, toX, toY, onArrive = null) {
    this.fireLaserBeam(fromX, fromY, toX, toY, '#facc15', onArrive, true);
  }

  // 5) Giant 135px 3D Red-and-Gold Carnival Star Mallet Smash!
  swingGiantMallet(targetX, targetY, isOk = true, onArrive = null) {
    if (!this.ctx) {
      if (onArrive) onArrive();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (onArrive) onArrive();
    };
    const m = {
      x: targetX,
      y: targetY,
      isOk,
      smashed: false,
      t: 0,
      dur: 0.30,
      onArrive: finish,
    };
    this._withSafety(this.mallets, m, 550, finish);
  }

  screenShake(px = 7) {
    const shell = document.querySelector('.app-shell');
    if (!shell || typeof shell.animate !== 'function') return;
    shell.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${-px}px, ${px * 0.6}px)` },
        { transform: `translate(${px}px, ${-px * 0.6}px)` },
        { transform: `translate(${-px * 0.5}px, ${-px * 0.4}px)` },
        { transform: 'translate(0, 0)' },
      ],
      { duration: 240, easing: 'ease-out' }
    );
  }

  drawStar(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? r : r * 0.45;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGiantArrow(ctx, x, y, ang) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    // Crimson tail feathers
    ctx.fillStyle = '#e11d48';
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-46, 0);
    ctx.lineTo(-68, -16);
    ctx.lineTo(-54, 0);
    ctx.lineTo(-68, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Thick Golden-Wood Shaft
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-52, -4.5, 82, 9, 4);
    ctx.fill();
    ctx.stroke();

    // Giant Gleaming Golden Broadhead Tip
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 0);
    ctx.lineTo(18, -17);
    ctx.lineTo(24, 0);
    ctx.lineTo(18, 17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // White shine on arrowhead
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.moveTo(42, 0);
    ctx.lineTo(22, -10);
    ctx.lineTo(26, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGiantGoldenKey(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    // Shaft & Teeth
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#783509';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-6, -6, 48, 12, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(22, 4, 8, 13);
    ctx.strokeRect(22, 4, 8, 13);
    ctx.fillRect(33, 4, 8, 16);
    ctx.strokeRect(33, 4, 8, 16);
    // Ornate Bow Ring + Ruby Gem
    ctx.beginPath();
    ctx.arc(-16, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-16, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#e11d48';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  drawGiantCarnivalMallet(ctx, pivotX, pivotY, angleRad) {
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angleRad);
    // Handle extending left-up from pivot
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-88, -9, 86, 18, 8);
    ctx.fill();
    ctx.stroke();

    // Giant Red & Gold Barrel Head centered around (-92, 0)
    ctx.save();
    ctx.translate(-94, 0);
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-28, -46, 56, 92, 16);
    ctx.fill();
    ctx.stroke();

    // Yellow Cushioned Strike Ends (Top & Bottom)
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -46, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 46, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center Star Emblem
    ctx.fillStyle = '#fef08a';
    this.drawStar(ctx, 0, 0, 16, -0.3);
    ctx.restore();
    ctx.restore();
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) * 0.001);
    this.lastTime = now;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // 1) Flying Arrows, Golden Keys & Giant Snacks/Potions
    for (let i = this.darts.length - 1; i >= 0; i--) {
      const d = this.darts[i];
      d.t += dt / d.dur;
      const p = Math.min(1, d.t);
      const arc = d.arcHeight || 60;
      const x = d.fromX + (d.toX - d.fromX) * p;
      const y = d.fromY + (d.toY - d.fromY) * p - Math.sin(p * Math.PI) * arc;
      // Exact instantaneous tangent angle along parabola
      const dx = d.toX - d.fromX;
      const dy = (d.toY - d.fromY) - Math.cos(p * Math.PI) * Math.PI * arc;
      const ang = Math.atan2(dy, dx);

      // Bold Glowing Ribbon Trail
      ctx.save();
      ctx.strokeStyle = d.trailColor || 'rgba(253, 224, 71, 0.85)';
      ctx.lineWidth = d.kind === 'arrow' ? 10 : 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(ang) * 58, y - Math.sin(ang) * 58);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      if (d.kind === 'arrow') {
        this.drawGiantArrow(ctx, x, y, ang);
      } else if (d.kind === 'key') {
        const spin = p > 0.78 ? ((p - 0.78) / 0.22) * (Math.PI / 2) : Math.sin(p * Math.PI * 2) * 0.2;
        this.drawGiantGoldenKey(ctx, x, y, spin);
      } else {
        ctx.save();
        ctx.translate(x, y);
        const scale = 1 + Math.sin(p * Math.PI) * 0.25;
        ctx.scale(scale, scale);
        ctx.rotate(Math.sin(p * Math.PI * 3) * 0.28);
        ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
        ctx.shadowBlur = 12;
        ctx.font = '58px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.emoji || '🍩', 0, 0);
        ctx.restore();
      }

      if (p >= 1) {
        const cb = d.onArrive;
        this.darts.splice(i, 1);
        this.shockwave(d.toX, d.toY, '#fde047', 115);
        this.confettiBurst(d.toX, d.toY, 28);
        if (cb) cb();
      }
    }

    // 2) Real Cast-&-Reel Fishing Lines + Bobber + Caught Big Fish!
    for (let i = this.fishingCasts.length - 1; i >= 0; i--) {
      const fc = this.fishingCasts[i];
      fc.t += dt / fc.dur;
      const p = Math.min(1, fc.t);
      let bx;
      let by;
      let caught = false;
      if (p < 0.42) {
        const k = p / 0.42;
        bx = fc.rodX + (fc.fishX - fc.rodX) * k;
        by = fc.rodY + (fc.fishY - fc.rodY) * k - Math.sin(k * Math.PI) * 45;
      } else {
        caught = true;
        if (!fc.splashed) {
          fc.splashed = true;
          this.multiRipple(fc.fishX, fc.fishY, ['#38bdf8', '#ffffff', '#bae6fd']);
          this.emojiBurst(fc.fishX, fc.fishY, ['💦', '💧', '✨'], 12, false);
        }
        const k = (p - 0.42) / 0.58;
        bx = fc.fishX + (fc.rodX - fc.fishX) * k;
        by = fc.fishY + (fc.rodY - fc.fishY) * k - Math.sin(k * Math.PI) * 65;
      }

      // Taut Fishing Line from Rod Tip to Bobber
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(fc.rodX, fc.rodY);
      ctx.quadraticCurveTo((fc.rodX + bx) / 2, Math.min(fc.rodY, by) - 18, bx, by);
      ctx.stroke();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Red & White 3D Bobber
      ctx.beginPath();
      ctx.arc(bx, by, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, 13, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Big Wriggling Caught 3D Fish Dangling Below Bobber!
      if (caught) {
        ctx.save();
        ctx.translate(bx, by + 28);
        ctx.rotate(Math.sin(p * 32) * 0.32 - Math.PI / 2);
        ctx.fillStyle = fc.fishColor || '#fb923c';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, 17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-24, 0);
        ctx.lineTo(-42, -14);
        ctx.lineTo(-42, 14);
        ctx.closePath();
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(14, -4, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15, -4, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      if (p >= 1) {
        const cb = fc.onArrive;
        this.fishingCasts.splice(i, 1);
        this.confettiBurst(fc.rodX, fc.rodY, 26);
        if (cb) cb();
      }
    }

    // 3) Full-Stage UFO Plasma Laser Beams & Thunder Hammer Lightning Bolts!
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.t += dt / b.dur;
      const p = Math.min(1, b.t);
      const alpha = p < 0.7 ? 1 : (1 - (p - 0.7) / 0.3);

      if (!b.impacted && p >= 0.25) {
        b.impacted = true;
        this.shockwave(b.toX, b.toY, b.color, 125);
        this.confettiBurst(b.toX, b.toY, 28);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (b.isLightning) {
        // Jagged 6-segment Thunder Bolt
        const pts = [{ x: b.fromX, y: b.fromY }];
        const segs = 6;
        for (let s = 1; s < segs; s++) {
          const r = s / segs;
          const jitter = (s % 2 === 0 ? 1 : -1) * (18 + Math.sin(now * 0.08 + s) * 8);
          pts.push({
            x: b.fromX + (b.toX - b.fromX) * r + jitter,
            y: b.fromY + (b.toY - b.fromY) * r,
          });
        }
        pts.push({ x: b.toX, y: b.toY });

        ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
        ctx.lineWidth = 30;
        ctx.beginPath();
        pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.stroke();

        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 13;
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.stroke();
      } else {
        // Thick Multi-Core UFO Plasma Cannon Beam
        ctx.strokeStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 24;
        ctx.lineWidth = 28 * (1.1 - p * 0.3);
        ctx.beginPath();
        ctx.moveTo(b.fromX, b.fromY);
        ctx.lineTo(b.toX, b.toY);
        ctx.stroke();

        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 14;
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Glowing Muzzle & Impact Flares
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.fromX, b.fromY, 18, 0, Math.PI * 2);
        ctx.arc(b.toX, b.toY, 24, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (p >= 1) {
        const cb = b.onArrive;
        this.beams.splice(i, 1);
        if (cb) cb();
      }
    }

    // 4) Giant Carnival Star Mallet Smash!
    for (let i = this.mallets.length - 1; i >= 0; i--) {
      const m = this.mallets[i];
      m.t += dt / m.dur;
      const p = Math.min(1, m.t);
      let ang;
      if (p < 0.48) {
        // Fast overhead smash down!
        const k = p / 0.48;
        ang = 1.15 - k * 1.18;
      } else {
        if (!m.smashed) {
          m.smashed = true;
          this.shockwave(m.x, m.y, m.isOk ? '#fde047' : '#fb7185', 115);
          this.floatText(m.x, m.y - 42, m.isOk ? '💥 咚！命中！' : '💥 咚！', m.isOk ? '#f59e0b' : '#fb7185');
        }
        const k = (p - 0.48) / 0.52;
        ang = -0.03 + k * 0.35;
      }
      this.drawGiantCarnivalMallet(ctx, m.x + 86, m.y - 6, ang);

      if (p >= 1) {
        const cb = m.onArrive;
        this.mallets.splice(i, 1);
        if (cb) cb();
      }
    }

    // Shockwave Rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life -= dt;
      if (r.life <= 0) { this.rings.splice(i, 1); continue; }
      const p = 1 - r.life / r.maxLife;
      const rad = 12 + (r.maxR - 12) * p;
      ctx.save();
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = 1 - p;
      ctx.lineWidth = 6 * (1 - p) + 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Confetti, Stars & Lesson Emoji Sprites
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.vy += (p.gravity !== undefined ? p.gravity : 520) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life * 1.6);
      if (p.emoji) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${Math.round(p.size)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        if (p.star) {
          this.drawStar(ctx, p.x, p.y, p.size * 0.85, p.rot);
        } else {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        }
      }
      ctx.restore();
    }

    // Floating Arcade Text
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      if (t.life <= 0) { this.texts.splice(i, 1); continue; }
      t.y += t.vy * dt;
      t.vy *= 0.94;
      ctx.save();
      ctx.globalAlpha = Math.min(1, t.life * 1.8);
      ctx.font = '900 26px "Nunito", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}

module.exports = { FXEngine };
