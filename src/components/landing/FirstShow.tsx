import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const SHOW_VIDEO = '/hero.mp4';
const SHOW_POSTER = '/hero-poster.jpg';

const facts = [
  { icon: 'Users', val: '300', cap: 'предпринимателей в зале' },
  { icon: 'Clock', val: '8 часов', cap: 'живой практики без слайдов' },
  { icon: 'Sparkles', val: '11 блоков', cap: 'готовых результатов на сцене' },
];

export default function FirstShow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="first-show">
      <div className="wrap">
        <div className="eyebrow rv">// 04 · КАК ЭТО БЫЛО</div>
        <h2 className="h2 rv">КАК ПРОШЛО НАШЕ<br />ПЕРВОЕ ШОУ</h2>
        <p className="lead rv" style={{ maxWidth: 680 }}>
          Полный зал отеля «Экватор», восемь часов живой практики и результаты, которые рождались прямо на сцене. Посмотрите, как это выглядело.
        </p>

        <div className="fs-grid rv">
          <div className="fs-video" data-cursor="view">
            <div className="frame">
              <video
                ref={videoRef}
                src={SHOW_VIDEO}
                poster={SHOW_POSTER}
                loop
                muted
                playsInline
                preload="none"
                aria-label="Видео с первого ИИ ШОУ БЕЗ ШИРМЫ во Владивостоке"
              />
              <button className="fs-play" onClick={togglePlay} aria-label={playing ? 'Пауза' : 'Смотреть видео'}>
                <Icon name={playing ? 'Pause' : 'Play'} size={26} strokeWidth={2} />
              </button>
              <button className="sound-toggle" onClick={toggleSound} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
                <Icon name={muted ? 'VolumeX' : 'Volume2'} size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="brackets"><i></i><i></i><i></i><i></i></div>
            <div className="float-tag t1">ВЕДУЩИЙ — СЕРГЕЙ ЧЕРНИКОВ</div>
            <div className="float-tag t3 tred">ШОУ 1.0</div>
          </div>

          <div className="fs-facts">
            {facts.map((f) => (
              <div className="fs-fact" key={f.cap}>
                <span className="fs-fact-ico"><Icon name={f.icon} size={20} strokeWidth={2} /></span>
                <div>
                  <div className="fs-fact-val">{f.val}</div>
                  <div className="fs-fact-cap">{f.cap}</div>
                </div>
              </div>
            ))}
            <div className="fs-note">
              На сцене первого шоу были зампред правительства Приморья и министр цифрового развития. Версия 2.0 — мощнее.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}