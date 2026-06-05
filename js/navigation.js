// =============================================================
// navigation.js — Active-state visuals + smooth-scroll wiring.
// Owns: sidebar links, the floating glass selector, and the
// mobile nav buttons. Exposes setActive(id) for the scrollspy.
// =============================================================

function initNavigation() {
  const navLinks = Array.from(document.querySelectorAll('.nav-item [data-section]'));
  const mobileBtns = Array.from(document.querySelectorAll('.mobile-nav-btn'));
  const glass = document.querySelector('.nav-glass');
  const reflection = document.querySelector('.nav-glass-reflection');
  let lastGlassTop = null;

  // Slide the frosted-glass capsule onto the active link.
  function moveGlass(link) {
    if (!glass || !link) return;
    const top = link.offsetTop;
    glass.style.height = `${link.offsetHeight}px`;
    glass.style.transform = `translateY(${top}px)`;
    glass.style.opacity = '1';

    if (reflection) {
      const delta = lastGlassTop === null ? 0 : top - lastGlassTop;
      reflection.style.transition = 'none';
      reflection.style.transform = `translateY(${-delta * 0.35}px) rotate(8deg)`;
      requestAnimationFrame(() => {
        reflection.style.transition = '';
        reflection.style.transform = 'translateY(0) rotate(8deg)';
      });
    }
    lastGlassTop = top;
  }

  // Update active classes across sidebar + mobile, then move glass.
  function setActive(id) {
    let activeLink = null;
    navLinks.forEach((a) => {
      const on = a.dataset.section === id;
      a.classList.toggle('active', on);
      if (on) activeLink = a;
    });
    moveGlass(activeLink);

    mobileBtns.forEach((b) => {
      const on = b.dataset.section === id;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  // Snap the glass to the current active link without animating
  // (used on load / resize so it never slides in from the top).
  function positionActiveGlass() {
    const active = document.querySelector('.nav-item [data-section].active');
    if (active && glass) {
      const prev = glass.style.transition;
      glass.style.transition = 'none';
      lastGlassTop = null;
      moveGlass(active);
      requestAnimationFrame(() => {
        glass.style.transition = prev || '';
      });
    }
  }

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Smooth-scroll wiring for sidebar + mobile nav.
  navLinks.forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo(a.dataset.section);
    })
  );
  mobileBtns.forEach((b) =>
    b.addEventListener('click', () => scrollTo(b.dataset.section))
  );

  window.addEventListener('load', positionActiveGlass);
  window.addEventListener('resize', positionActiveGlass);

  return { setActive, positionActiveGlass };
}
