import { useEffect, useRef } from 'react';

const p1 = ['ОПОРА РОССИИ', 'МОЙ БИЗНЕС', 'ЦРП ВЛАДИВОСТОК'];
const p2 = ['ПАО «ДАЛЬПРИБОР»', 'АЭРОПОРТ ВЛАДИВОСТОК', 'РОСМОЛОДЁЖЬ'];

function fillPart(el: HTMLElement, arr: string[]) {
  let h = '';
  for (let r = 0; r < 4; r++) arr.forEach((t) => { h += `<span>${t}</span><span>·</span>`; });
  el.innerHTML = h;
}

export default function Partners() {
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (r1Ref.current) fillPart(r1Ref.current, p1);
    if (r2Ref.current) fillPart(r2Ref.current, p2);
  }, []);

  return (
    <section id="partners">
      <div className="wrap">
        <div className="eyebrow rv">// 08 · ПАРТНЁРЫ ПЕРВОГО ШОУ</div>
        <div className="part-sub rv">Кто доверился школе Хакни Нейросети:</div>
      </div>
      <div className="part-row r1" id="part-r1" ref={r1Ref}></div>
      <div className="part-row r2" id="part-r2" ref={r2Ref}></div>
    </section>
  );
}