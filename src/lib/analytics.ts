const COUNTERS = [101026698, 112773601];

type Ym = (id: number, action: string, ...rest: unknown[]) => void;

export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  try {
    const ym = (window as unknown as { ym?: Ym }).ym;
    if (typeof ym !== 'function') return;
    COUNTERS.forEach((id) => ym(id, 'reachGoal', goal, params));
  } catch {
    /* noop */
  }
}

const SCROLL_MARKS = [25, 50, 75, 100];

export function initAnalytics(): () => void {
  const fired = new Set<string>();

  const fireOnce = (goal: string, params?: Record<string, unknown>) => {
    if (fired.has(goal)) return;
    fired.add(goal);
    reachGoal(goal, params);
  };

  const onClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement | null)?.closest('a, button');
    if (!target) return;
    const href = target.getAttribute('href') || '';
    const text = (target.textContent || '').trim().toLowerCase();

    if (href.includes('getcourse.ru')) {
      reachGoal('buy_ticket_click', { url: href });
      return;
    }
    if (href.includes('t.me')) {
      reachGoal('telegram_click', { url: href });
      return;
    }
    if (href.includes('max.ru')) {
      reachGoal('max_click', { url: href });
      return;
    }
    if (href.startsWith('tel:')) {
      reachGoal('phone_click');
      return;
    }
    if (href === '#pricing' || text.includes('забронировать') || text.includes('тариф')) {
      reachGoal('pricing_view_click');
    }
    if (href === '#program' || text.includes('программу')) {
      reachGoal('program_view_click');
    }
  };

  document.addEventListener('click', onClick, true);

  const sectionGoals: Record<string, string> = {
    program: 'program_section_view',
    speaker: 'speaker_section_view',
    pricing: 'pricing_section_view',
    venue: 'venue_section_view',
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const goal = sectionGoals[entry.target.id];
        if (goal) fireOnce(goal);
      });
    },
    { threshold: 0.35 },
  );

  Object.keys(sectionGoals).forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = Math.round((window.scrollY / max) * 100);
    SCROLL_MARKS.forEach((mark) => {
      if (pct >= mark) fireOnce(`scroll_${mark}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('scroll', onScroll);
    observer.disconnect();
  };
}
