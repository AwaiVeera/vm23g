const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

if (fine.matches) {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as Element).closest<HTMLElement>('[data-glow]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}
