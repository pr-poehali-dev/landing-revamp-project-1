import gsap from 'gsap';

export function flashEl(sel: string, peak = 0.6) {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) return;
  gsap.fromTo(sel, { opacity: 0 }, { opacity: peak, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' });
}

export function fmt2(s: number) {
  const m = Math.floor(s / 60), ss = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
}

export function makeTimer(
  totalSec: number,
  onTick?: (str: string, left: number) => void,
  onZero?: () => void
) {
  let left = totalSec;
  const int = window.setInterval(() => {
    left--;
    if (left < 0) { left = totalSec; onZero?.(); }
    onTick?.(fmt2(left), left);
  }, 1000);
  return { stop: () => clearInterval(int) };
}

export function fmtNum(v: number, format: string) {
  if (format === 'dec') return v.toFixed(1).replace('.', ',');
  if (format === 'rub' || format === 'int') return Math.round(v).toLocaleString('ru-RU').replace(/,/g, ' ');
  return Math.round(v);
}

export function particleField(canvas: HTMLCanvasElement, count: number, drift = 1) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 2);

  let W = 0, H = 0, cx = 0, cy = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  type Node = { x: number; y: number; z: number; vx: number; vy: number; vz: number; r: number; hot: boolean; ph: number };
  const nodes: Node[] = [];
  const N = Math.max(46, Math.round(count * 0.62));
  const SPREAD = 1.15;
  const FOV = 1.9;

  for (let i = 0; i < N; i++) {
    nodes.push({
      x: (Math.random() * 2 - 1) * SPREAD,
      y: (Math.random() * 2 - 1) * SPREAD,
      z: Math.random() * 2 - 1,
      vx: (Math.random() * 2 - 1) * 0.00022 * drift,
      vy: (Math.random() * 2 - 1) * 0.00022 * drift,
      vz: (Math.random() * 2 - 1) * 0.00022 * drift,
      r: Math.random() * 1.5 + 1.1,
      hot: Math.random() < 0.22,
      ph: Math.random() * Math.PI * 2,
    });
  }

  type Pulse = { a: number; b: number; t: number; sp: number };
  const pulses: Pulse[] = [];

  const resize = () => {
    const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || innerWidth;
    const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || innerHeight;
    W = canvas.width = Math.max(1, Math.round(w * DPR));
    H = canvas.height = Math.max(1, Math.round(h * DPR));
    cx = W / 2; cy = H / 2;
  };
  resize();

  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(resize);
    ro.observe(canvas);
  }
  window.addEventListener('resize', resize);

  const onMove = (e: PointerEvent) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const px: number[] = [], py: number[] = [], pz: number[] = [], psc: number[] = [];

  let raf = 0;
  let last = 0;

  const draw = (t: number) => {
    const dt = last ? Math.min(t - last, 48) : 16;
    last = t;

    ctx.clearRect(0, 0, W, H);

    mouse.x += (mouse.tx - mouse.x) * 0.045;
    mouse.y += (mouse.ty - mouse.y) * 0.045;

    const ry = RM ? 0 : t * 0.00006 * drift + mouse.x * 0.35;
    const rx = RM ? 0 : Math.sin(t * 0.00004) * 0.18 + mouse.y * 0.22;
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const SX = (W / 2) / SPREAD * 1.12;
    const SY = (H / 2) / SPREAD * 1.12;
    const S = Math.min(SX, SY);

    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      if (!RM) {
        n.x += n.vx * dt; n.y += n.vy * dt; n.z += n.vz * dt;
        if (n.x > SPREAD || n.x < -SPREAD) n.vx *= -1;
        if (n.y > SPREAD || n.y < -SPREAD) n.vy *= -1;
        if (n.z > 1 || n.z < -1) n.vz *= -1;
      }
      const x1 = n.x * cosY - n.z * sinY;
      const z1 = n.x * sinY + n.z * cosY;
      const y2 = n.y * cosX - z1 * sinX;
      const z2 = n.y * sinX + z1 * cosX;
      const persp = FOV / (FOV + z2);
      px[i] = cx + x1 * SX * persp;
      py[i] = cy + y2 * SY * persp;
      pz[i] = z2;
      psc[i] = persp;
    }

    const LINK = S * 0.72;
    ctx.lineWidth = Math.max(1, DPR * 0.7);

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = px[i] - px[j], dy = py[i] - py[j];
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        const d = Math.sqrt(d2);
        const depth = (psc[i] + psc[j]) * 0.5;
        const a = (1 - d / LINK) * 0.3 * depth;
        if (a < 0.012) continue;
        ctx.strokeStyle = `rgba(0,229,245,${a})`;
        ctx.beginPath();
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(px[j], py[j]);
        ctx.stroke();

        if (!RM && pulses.length < 26 && Math.random() < 0.0014) {
          pulses.push({ a: i, b: j, t: 0, sp: 0.0011 + Math.random() * 0.0016 });
        }
      }
    }

    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k];
      p.t += p.sp * dt;
      if (p.t >= 1) { pulses.splice(k, 1); continue; }
      const ax = px[p.a], ay = py[p.a], bx = px[p.b], by = py[p.b];
      const x = ax + (bx - ax) * p.t;
      const y = ay + (by - ay) * p.t;
      const fade = Math.sin(p.t * Math.PI);
      const r = 2.1 * DPR * fade;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
      g.addColorStop(0, `rgba(140,250,255,${0.85 * fade})`);
      g.addColorStop(1, 'rgba(0,229,245,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 4.5, 0, 7);
      ctx.fill();
    }

    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      const depth = psc[i];
      const tw = RM ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0012 + n.ph);
      const r = n.r * depth * DPR * tw;
      const a = Math.min(1, (0.28 + depth * 0.5) * tw);

      if (n.hot) {
        const g = ctx.createRadialGradient(px[i], py[i], 0, px[i], py[i], r * 7);
        g.addColorStop(0, `rgba(0,229,245,${a * 0.5})`);
        g.addColorStop(1, 'rgba(0,229,245,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px[i], py[i], r * 7, 0, 7);
        ctx.fill();
      }

      ctx.fillStyle = n.hot ? `rgba(0,229,245,${a})` : `rgba(226,238,248,${a * 0.62})`;
      ctx.beginPath();
      ctx.arc(px[i], py[i], r, 0, 7);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    ro?.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
  };
}