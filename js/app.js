// =============================================================
// app.js — Entry point (classic script, no bundler/server needed).
// Loads AFTER all /data/*.js and /js/*.js files in index.html, so
// their globals (site, overview, renderStatusBar, ...) are ready.
//
// Flow:
//   1. Render shell (status bar, sidebar, mobile nav)
//   2. Render every section from its data file
//   3. Initialise behavior (clock, reveal, scrollspy, nav)
//
// To update content, edit the files in /data — never this file.
// =============================================================

function renderAll() {
  // Shell
  renderStatusBar(site);
  renderSidebar(site, navItems);
  renderMobileNav(mobileNavItems);

  // Sections
  renderOverview(overview);
  renderWhy(whyBuild);
  renderDomains(whatIBuild);
  renderPrinciples(principles);
  renderProjects(projects, projectStatusMeta);
  renderBuilding(building, categoryBadge);
  renderNow(now);
  renderImpact(impact);
  renderToolkit(toolkit);
  renderContact(contact);
}

function init() {
  renderAll();

  initClock(site.status);
  initFadeUp();

  const nav = initNavigation();
  const sectionIds = navItems.map((n) => n.id);
  initScrollspy(sectionIds, nav.setActive);

  // Set the initial active section + place the glass selector.
  nav.setActive(sectionIds[0]);
  nav.positionActiveGlass();
}

// Run once the container shell exists in the DOM.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
