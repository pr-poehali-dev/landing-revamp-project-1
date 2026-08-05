import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const photos = Array.from({ length: 25 }, (_, i) => `/gallery/photo-${String(i + 1).padStart(2, '0')}.jpg`);

export default function EventGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) track.style.animationPlayState = 'paused';
  }, []);

  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex]);

  return (
    <div className="gallery-strip">
      <div className="gallery-track" ref={trackRef}>
        {[...photos, ...photos].map((src, i) => (
          <div
            className="gallery-item"
            key={i}
            data-cursor="view"
            role="button"
            tabIndex={0}
            onClick={() => setOpenIndex(i % photos.length)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenIndex(i % photos.length); }}
          >
            <img src={src} alt="Кадр с прошедшего ИИ ШОУ" loading="lazy" />
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <div className="lightbox" onClick={close}>
          <button className="lb-close" aria-label="Закрыть" onClick={close}>
            <Icon name="X" size={22} strokeWidth={2} />
          </button>
          <button className="lb-nav lb-prev" aria-label="Предыдущее фото" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <Icon name="ChevronLeft" size={26} strokeWidth={2} />
          </button>
          <img
            className="lb-img"
            src={photos[openIndex]}
            alt="Кадр с прошедшего ИИ ШОУ"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lb-nav lb-next" aria-label="Следующее фото" onClick={(e) => { e.stopPropagation(); next(); }}>
            <Icon name="ChevronRight" size={26} strokeWidth={2} />
          </button>
          <div className="lb-count">{openIndex + 1} / {photos.length}</div>
        </div>
      )}
    </div>
  );
}
