const KEY = 'vm23g-motion';
const root = document.documentElement;
const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export const motionAllowed = () => root.dataset.motion !== 'paused' && !reduceQuery.matches;

const sync = () => {
  const paused = root.dataset.motion === 'paused';
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(paused));
    const label = btn.querySelector('[data-motion-label]');
    if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
  });
};

export const setMotion = (paused: boolean) => {
  if (paused) root.dataset.motion = 'paused';
  else delete root.dataset.motion;
  try {
    localStorage.setItem(KEY, paused ? 'paused' : 'playing');
  } catch {}
  sync();
  window.dispatchEvent(new CustomEvent('vm23g:motion', { detail: { allowed: motionAllowed() } }));
};

document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest('[data-motion-toggle]');
  if (btn) setMotion(root.dataset.motion !== 'paused');
});

reduceQuery.addEventListener('change', () => {
  window.dispatchEvent(new CustomEvent('vm23g:motion', { detail: { allowed: motionAllowed() } }));
});

sync();
