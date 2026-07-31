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
  let W = 0, H = 0;
  const pts: { x: number; y: number; r: number; s: number; c: string; a: number; ph: number }[] = [];
  const mouse = { x: 0.5, y: 0.5 };

  const resize = () => {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.6 + 0.6,
      s: Math.random() * 0.00012 + 0.00004,
      c: Math.random() < 0.15 ? '0,229,245' : '242,246,250',
      a: Math.random() * 0.5 + 0.15,
      ph: Math.random() * Math.PI * 2,
    });
  }

  const onMove = (e: PointerEvent) => {
    mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let raf = 0;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    const mx = (mouse.x - 0.5) * 20 * devicePixelRatio;
    const my = (mouse.y - 0.5) * 20 * devicePixelRatio;
    pts.forEach((p) => {
      p.y -= p.s * drift;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      const tw = 0.6 + 0.4 * Math.sin(t * 0.001 + p.ph);
      ctx.beginPath();
      ctx.arc(p.x * W + mx * p.r * 0.4, p.y * H + my * p.r * 0.4, p.r * devicePixelRatio, 0, 7);
      ctx.fillStyle = `rgba(${p.c},${p.a * tw})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
  };
}
