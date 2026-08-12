import { useEffect, useRef, useState } from 'react';
import { useCounters } from './useCounters';

export default function School() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => { setRootEl(rootRef.current); }, []);
  useCounters(rootEl);

  return (
    <section id="school" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 07 · ШКОЛА</div>

        <h2 className="h2 rv">
          ДУМАЕШЬ, МЫ СДЕЛАЛИ ШОУ ПО МЕТОДИЧКЕ?<br />
          МЫ ТАК УЧИМ КАЖДУЮ НЕДЕЛЮ.
        </h2>

        <div className="mani-lines rv">
          <p className="mani-line">НИ ОДНОЙ ЛЕКЦИИ.</p>
          <p className="mani-line">НИ ОДНОГО «ПОСМОТРИ ЗАПИСЬ ПОТОМ».</p>
          <p className="mani-line">СИДИШЬ В КЛАССЕ — ДЕЛАЕШЬ РУКАМИ.</p>
        </div>

        <p className="lead rv" style={{ maxWidth: 720 }}>
          «Хакни Нейросети» — живая школа ИИ во Владивостоке. Первая
          на Дальнем Востоке. С 2022 года. У нас не рассказывают,
          как нейросети изменят мир. У нас ты поднимаешь сайт, бота
          и ролик прямо на занятии, пока куратор смотрит тебе в экран
          и спрашивает: «Ну что, завелось?»
        </p>

        <p className="lead rv" style={{ maxWidth: 720 }}>
          Шоу «Без Ширмы» — не спецпроект. Это обычный формат школы.
          Просто на 300 человек сразу.
        </p>

        <div className="school-stats-grid rv">
          <div className="school-stat">
            <div className="stat-num">
              <span data-count="10000" data-fmt="int">0</span>+
            </div>
            <div className="stat-cap">выпускников — и все делали руками</div>
          </div>
          <div className="school-stat">
            <div className="stat-num">
              <span data-count="72">0</span>
            </div>
            <div className="stat-cap">часа чистой практики за курс. Лекций — ноль</div>
          </div>
          <div className="school-stat">
            <div className="stat-num">
              <span data-count="94">0</span>%
            </div>
            <div className="stat-cap">применяют ИИ в работе уже через месяц</div>
          </div>
          <div className="school-stat">
            <div className="stat-num">5.0<span className="dim">/5</span></div>
            <div className="stat-cap">рейтинг. Нам бы соврать скромнее, но отзывы честные</div>
          </div>
        </div>

        <div className="trust-line rv">
          <span className="trust-cap">
            Работаем при поддержке «Опоры России». Нам доверяют:
          </span>
          Мой Бизнес · Росмолодёжь · ПАО «Дальприбор» ·
          Правительство Приморского края · Пасифик Медиа · VLPACIFIC
        </div>

        <a
          className="btn btn-ghost magnetic rv"
          href="https://chernikovgpt.ru/"
          target="_blank"
          rel="noopener"
        >
          Зайти на сайт школы <span className="arr">→</span>
        </a>
      </div>
    </section>
  );
}