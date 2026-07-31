import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenisInstance = l;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToEl(el: HTMLElement) {
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -72, duration: 0.9 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
