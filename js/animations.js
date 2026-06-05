// =============================================================
// animations.js — Live clock + scroll-reveal (fade-up).
// =============================================================

// Updates the status-bar clock every second.
function initClock({ timeZone, timeSuffix }) {
  const render = () => {
    const el = document.getElementById('dhaka-time');
    if (!el) return;
    const t = new Date().toLocaleTimeString('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    el.textContent = `${t} — ${timeSuffix}`;
  };
  render();
  setInterval(render, 1000);
}

// Reveals .fade-up elements as they scroll into view, with a
// subtle staggered delay. Call AFTER content is rendered.
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    obs.observe(el);
  });
}
