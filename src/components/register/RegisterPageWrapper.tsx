const LOGO_BANNER = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/5dd48417-c7e4-4bcd-813a-59f545288154.png';

export default function RegisterPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundImage: 'url(https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/ee8e85b7-5bc4-488b-81e2-ff6047f87421.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col items-center py-5 px-4">
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="w-full max-w-sm" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mb-4">
          <a href="https://chernikovgpt.ru" target="_blank" rel="noopener noreferrer">
            <img
              src={LOGO_BANNER}
              alt="Бизнес у моря × Хакни Нейросети"
              className="w-full object-contain"
              style={{ borderRadius: 14, cursor: 'pointer' }}
            />
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
