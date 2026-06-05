// =============================================================
// scrollspy.js — Detects the section currently in view and
// notifies a callback. Pure detection; no DOM styling here.
// =============================================================

function initScrollspy(sectionIds, onActive) {
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onActive(id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    obs.observe(el);
  });
}
