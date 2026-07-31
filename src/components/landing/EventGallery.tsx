import { useEffect, useRef } from 'react';

const photos = [
  '/gallery/gallery-1.jpg',
  '/gallery/gallery-2.jpg',
  '/gallery/gallery-3.jpg',
  '/gallery/gallery-4.jpg',
  '/gallery/gallery-5.jpg',
  '/gallery/gallery-6.jpg',
];

export default function EventGallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) track.style.animationPlayState = 'paused';
  }, []);

  return (
    <div className="gallery-strip">
      <div className="gallery-track" ref={trackRef}>
        {[...photos, ...photos].map((src, i) => (
          <div className="gallery-item" key={i}>
            <img src={src} alt="Кадр с прошедшего ИИ ШОУ" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
