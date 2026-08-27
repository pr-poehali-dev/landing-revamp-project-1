import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { markLeadSubmitted } from '@/lib/leadTracking';

const FUNC_URL = 'https://functions.poehali.dev/d08a4e85-a466-4556-bf5e-34024cc94682';

export default function BloggerApplication() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    socialLink: '',
    phone: '',
  });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.socialLink || !form.phone) {
      toast.error('Заполните все поля формы');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          page: window.location.href,
          ref: new URLSearchParams(window.location.search).get('ref') || localStorage.getItem('ref_code') || '',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success('Заявка отправлена! Мы свяжемся с вами.');
      markLeadSubmitted();
      setForm({ name: '', socialLink: '', phone: '' });
      setOpen(false);
    } catch {
      toast.error('Не удалось отправить заявку. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="blogger-cta rv" onClick={() => setOpen(true)}>
        <span className="blogger-cta-icon">
          <img src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/99a93fd7-2933-413e-bda7-07ed2ae792d8.png" alt="" width={22} height={22} />
        </span>
        <span className="blogger-cta-text">
          <span className="blogger-cta-title">Я БЛОГЕР</span>
          <span className="blogger-cta-sub">Получи аккредитацию и приходи со своей аудиторией</span>
        </span>
        <span className="arr">→</span>
      </button>

      <div className={`spons-modal-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {open && (
          <div className="spons-modal blogger-modal" onClick={(e) => e.stopPropagation()}>
            <button className="spons-modal-close" onClick={() => setOpen(false)} aria-label="Закрыть">×</button>
            <div className="spons-modal-scroll" data-lenis-prevent>
              <div className="eyebrow">// АККРЕДИТАЦИЯ БЛОГЕРА</div>
              <h3><img src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/99a93fd7-2933-413e-bda7-07ed2ae792d8.png" alt="" width={24} height={24} className="spons-modal-icon" /> Заявка блогера</h3>
              <p className="spons-modal-intro">Оставьте контакты — мы свяжемся и расскажем об условиях сотрудничества.</p>

              <form className="blogger-form" onSubmit={submit}>
                <label className="blogger-field">
                  <span>Имя</span>
                  <input type="text" required value={form.name} onChange={update('name')} placeholder="Ваше имя" />
                </label>

                <label className="blogger-field">
                  <span>Ссылка на соцсеть</span>
                  <input type="text" required value={form.socialLink} onChange={update('socialLink')} placeholder="https://..." />
                </label>

                <label className="blogger-field">
                  <span>Телефон для связи</span>
                  <input type="tel" required value={form.phone} onChange={update('phone')} placeholder="+7 900 000-00-00" />
                </label>

                <button className="btn magnetic" type="submit" disabled={submitting}>
                  {submitting ? 'Отправляем…' : 'Отправить заявку'} <span className="arr">→</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}