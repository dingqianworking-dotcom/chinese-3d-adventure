// 60fps Canvas 2D Arcade Juice & Particle Engine (Confetti, Shockwaves, Flying Projectiles, Floating Text, Screen Shake)
class FXEngine {
  constructor(canvasId = 'fx-canvas') {
    this.canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.rings = [];
    this.texts = [];
    this.darts = [];
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

  flyItem(fromX, fromY, toX, toY, emoji = '🎯', trailColor = 'rgba(253, 224, 71, 0.82)', onArrive = null, arcHeight = 62) {
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
      trailColor,
      arcHeight,
      t: 0,
      dur: 0.24,
      onArrive: finish,
    };
    this.darts.push(item);
    // Safety fallback if requestAnimationFrame is throttled in background tabs
    setTimeout(() => {
      const idx = this.darts.indexOf(item);
      if (idx >= 0) this.darts.splice(idx, 1);
      finish();
    }, 480);
  }

  flyDart(fromX, fromY, toX, toY, onArrive) {
    this.flyItem(fromX, fromY, toX, toY, '🎯', 'rgba(253, 224, 71, 0.82)', onArrive, 55);
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

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) * 0.001);
    this.lastTime = now;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Flying Projectiles (Darts, Treats, Magic Keys, Fish, Lasers)
    for (let i = this.darts.length - 1; i >= 0; i--) {
      const d = this.darts[i];
      d.t += dt / d.dur;
      const p = Math.min(1, d.t);
      const x = d.fromX + (d.toX - d.fromX) * p;
      const y = d.fromY + (d.toY - d.fromY) * p - Math.sin(p * Math.PI) * (d.arcHeight || 55);
      const ang = Math.atan2(d.toY - d.fromY, d.toX - d.fromX);

      ctx.save();
      ctx.strokeStyle = d.trailColor || 'rgba(253, 224, 71, 0.78)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(ang) * 34, y - Math.sin(ang) * 34 + 10);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.translate(x, y);
      ctx.rotate(d.emoji === '🎯' ? ang + Math.PI / 4 : Math.sin(p * Math.PI * 3) * 0.25);
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.emoji || '🎯', 0, 0);
      ctx.restore();

      if (p >= 1) {
        const cb = d.onArrive;
        this.darts.splice(i, 1);
        this.shockwave(d.toX, d.toY, '#fde047', 105);
        this.confettiBurst(d.toX, d.toY, 26);
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
      ctx.font = '900 24px "Nunito", "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
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
