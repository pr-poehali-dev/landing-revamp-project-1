import func2url from '../../backend/func2url.json';

export const URLS = func2url as Record<string, string>;

export async function registerParticipant(data: { full_name: string; phone: string }) {
  const res = await fetch(URLS['register'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

export async function adminLogin(password: string) {
  const res = await fetch(URLS['admin-login'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

export async function adminCheckAuth(token: string) {
  const res = await fetch(`${URLS['admin-login']}?action=check`, {
    headers: { 'X-Auth-Token': token },
  });
  return res.status === 200;
}

export async function adminLogout(token: string) {
  await fetch(`${URLS['admin-login']}?action=logout`, {
    method: 'POST',
    headers: { 'X-Auth-Token': token },
  });
}

export async function getStats(token: string) {
  const res = await fetch(URLS['admin-stats'], {
    headers: { 'X-Auth-Token': token },
  });
  return res.json();
}

export async function getParticipants(token: string, params?: { search?: string; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.status) qs.set('status', params.status);
  const url = URLS['admin-participants'] + (qs.toString() ? '?' + qs.toString() : '');
  const res = await fetch(url, { headers: { 'X-Auth-Token': token } });
  return res.json();
}

export function getParticipantsCsvUrl(token: string, params?: { search?: string; status?: string }) {
  const qs = new URLSearchParams({ export: 'csv' });
  if (params?.search) qs.set('search', params.search);
  if (params?.status) qs.set('status', params.status);
  return URLS['admin-participants'] + '?' + qs.toString();
}

export async function runDraw(token: string, data: { title: string; prize_name: string }) {
  const res = await fetch(URLS['admin-draw'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

export async function getDrawHistory(token: string) {
  const res = await fetch(URLS['admin-draw'], { headers: { 'X-Auth-Token': token } });
  return res.json();
}
