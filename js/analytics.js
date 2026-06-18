/**
 * analytics.js — Front-end client for the portfolio analytics endpoint.
 * -----------------------------------------------------------------------------
 * Drop this file into your site and load it once, e.g. in index.html:
 *
 *     <script src="js/analytics.js" defer></script>
 *
 * It automatically:
 *   - generates a stable visitor id (stored in localStorage),
 *   - records a "visit" on page load,
 *   - tracks how long each <section data-section="..."> is on screen,
 *   - tracks how long each [data-project="..."] is on screen,
 *   - records max scroll depth + total time, and closes the session on unload.
 *
 * Public API for custom events:
 *     Analytics.event('cta_click', 'hire_me');
 * -----------------------------------------------------------------------------
 */
(function () {
  'use strict';

  // ==========================================================================
  // ▶ ENDPOINT — all fetch() requests are sent here.
  // ==========================================================================
  var ENDPOINT =
    'http://tahmeed-mahbub-rafid.atwebpages.com/portfolio-visitors/track.php';

  // --- stable per-visitor id ------------------------------------------------
  var STORAGE_KEY = 'pf_session_id';
  function getSessionId() {
    var id = null;
    try {
      id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id =
          'v_' +
          Date.now().toString(36) +
          '_' +
          Math.random().toString(36).slice(2, 10);
        localStorage.setItem(STORAGE_KEY, id);
      }
    } catch (e) {
      // localStorage blocked (private mode) → fall back to per-page id.
      id = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
    return id;
  }

  var sessionId = getSessionId();
  var visitId = null; // pf_sessions.id returned by the "visit" action.
  var startTime = Date.now();
  var maxScroll = 0;

  // --- low-level sender -----------------------------------------------------
  function send(payload, opts) {
    payload.session_id = sessionId;
    var body = JSON.stringify(payload);

    // Use sendBeacon for unload events so the request isn't cancelled.
    if (opts && opts.beacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      return Promise.resolve(null);
    }

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true,
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null; // never let analytics break the page.
      });
  }

  // --- public helpers -------------------------------------------------------
  var Analytics = {
    event: function (name, value) {
      send({ action: 'event', event_name: name, event_value: value || null });
    },
    section: function (name, seconds) {
      send({ action: 'section', section_name: name, duration_seconds: seconds });
    },
    project: function (name, seconds) {
      send({ action: 'project', project_name: name, duration_seconds: seconds });
    },
  };
  window.Analytics = Analytics;

  // ==========================================================================
  // 1) Record the visit on load.
  // ==========================================================================
  send({
    action: 'visit',
    page_url: location.href,
    referrer: document.referrer || null,
  }).then(function (res) {
    if (res && res.visit_id) visitId = res.visit_id;
  });

  // ==========================================================================
  // 2) Scroll-depth tracking.
  // ==========================================================================
  function updateScroll() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? Math.round((doc.scrollTop / scrollable) * 100) : 0;
    if (pct > maxScroll) maxScroll = Math.min(100, pct);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });

  // ==========================================================================
  // 3) Time-on-section / time-on-project via IntersectionObserver.
  //    Mark sections with:   <section data-section="projects">
  //    Mark projects with:   <div data-project="My App">
  // ==========================================================================
  function trackVisible(selector, attr, reporter) {
    var timers = new WeakMap();
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          var name = el.getAttribute(attr);
          if (!name) return;

          if (entry.isIntersecting) {
            timers.set(el, Date.now());
          } else if (timers.has(el)) {
            var seconds = Math.round((Date.now() - timers.get(el)) / 1000);
            timers.delete(el);
            if (seconds >= 1) reporter(name, seconds);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(selector).forEach(function (el) {
      observer.observe(el);
    });

    // Flush still-visible elements on unload.
    return function flush() {
      document.querySelectorAll(selector).forEach(function (el) {
        if (timers.has(el)) {
          var seconds = Math.round((Date.now() - timers.get(el)) / 1000);
          var name = el.getAttribute(attr);
          if (name && seconds >= 1) reporter(name, seconds);
        }
      });
    };
  }

  var flushSections;
  var flushProjects;
  function initObservers() {
    flushSections = trackVisible('[data-section]', 'data-section', Analytics.section);
    flushProjects = trackVisible('[data-project]', 'data-project', Analytics.project);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObservers);
  } else {
    initObservers();
  }

  // ==========================================================================
  // 4) Close the session on page exit.
  // ==========================================================================
  function endSession() {
    if (flushSections) flushSections();
    if (flushProjects) flushProjects();

    send(
      {
        action: 'session_end',
        visit_id: visitId,
        total_duration_seconds: Math.round((Date.now() - startTime) / 1000),
        max_scroll_percent: maxScroll,
      },
      { beacon: true }
    );
  }

  window.addEventListener('pagehide', endSession);
  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') endSession();
  });
})();
