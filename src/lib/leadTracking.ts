const LEAD_SUBMITTED_KEY = 'lead_submitted';
export const LEAD_SUBMITTED_EVENT = 'lead-submitted';

export function markLeadSubmitted() {
  try {
    localStorage.setItem(LEAD_SUBMITTED_KEY, '1');
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(LEAD_SUBMITTED_EVENT));
}

export function hasSubmittedLead(): boolean {
  try {
    return localStorage.getItem(LEAD_SUBMITTED_KEY) === '1';
  } catch {
    return false;
  }
}
