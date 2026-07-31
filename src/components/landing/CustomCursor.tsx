import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const lbl = lblRef.current;
    if (!dot || !ring || !lbl) return;

    let rx = -100, ry = -100, tx = -100, ty = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx - 3}px,${ty - 3}px)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const loop = () => {
      rx += (tx - rx) * 0.15;
      ry += (ty - ry) * 0.15;
      ring.style.transform = `translate(${rx - ring.offsetWidth / 2}px,${ry - ring.offsetHeight / 2}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const dc = target.closest('[data-cursor]');
      const inter = target.closest('a,button,.faq-q');
      if (dc) {
        ring.classList.add('lbl'); ring.classList.remove('hov');
        dot.classList.add('off');
        lbl.textContent = dc.getAttribute('data-cursor') === 'drag' ? 'ТЯНИ' : 'СМОТРИ';
      } else if (inter) {
        ring.classList.add('hov'); ring.classList.remove('lbl');
        dot.classList.remove('off');
      } else {
        ring.classList.remove('hov', 'lbl');
        dot.classList.remove('off');
      }
    };
    document.addEventListener('pointerover', onOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring"><span ref={lblRef}></span></div>
    </>
  );
}
