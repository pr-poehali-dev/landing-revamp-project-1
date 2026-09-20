const STORAGE_KEY = 'gc_partner_code';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_RE = /^[A-Za-z0-9_-]{1,64}$/;

type Stored = { code: string; ts: number };

export function readGcpcFromUrl(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('gcpc');
    if (!raw) return null;
    const code = raw.trim();
    return CODE_RE.test(code) ? code : null;
  } catch {
    return null;
  }
}

export function saveGcpc(code: string): void {
  try {
    const data: Stored = { code, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export function getStoredGcpc(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (!data?.code || !CODE_RE.test(data.code)) return null;
    if (!data.ts || Date.now() - data.ts > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data.code;
  } catch {
    return null;
  }
}

export function getActiveGcpc(): string | null {
  const fromUrl = readGcpcFromUrl();
  if (fromUrl) {
    saveGcpc(fromUrl);
    return fromUrl;
  }
  return getStoredGcpc();
}

export function withGcpc(url: string, code?: string | null): string {
  const gcpc = code ?? getActiveGcpc();
  if (!gcpc) return url;
  try {
    const parsed = new URL(url, window.location.href);
    parsed.searchParams.set('gcpc', gcpc);
    return parsed.toString();
  } catch {
    return url;
  }
}

function decorateLinks(code: string): void {
  const nodes = document.querySelectorAll<HTMLAnchorElement>('a[data-gc-link]');
  nodes.forEach((el) => {
    const href = el.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const next = withGcpc(href, code);
    if (next !== href) el.setAttribute('href', next);
  });
}

export function initGetcourseReferral(): () => void {
  const code = getActiveGcpc();
  if (!code) return () => {};

  decorateLinks(code);

  const observer = new MutationObserver(() => decorateLinks(code));
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'data-gc-link'],
  });

  return () => observer.disconnect();
}
