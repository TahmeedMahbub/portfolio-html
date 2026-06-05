// =============================================================
// renderer.js — Pure view layer.
// Turns data objects into HTML strings and mounts them into the
// page's section containers. Knows NOTHING about where data comes
// from; app.js wires data → renderer. No content lives here.
// =============================================================

// --- Helpers --------------------------------------------------

// Escape plain text destined for innerHTML.
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Write an HTML string into the element with the given id.
const mount = (id, html) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
};

// Standard section heading block (label + title + optional desc).
const heading = (id, label, title, description) => `
  <p class="section-label fade-up">${esc(label)}</p>
  <h2 class="section-title fade-up" id="${esc(id)}-h">${esc(title)}</h2>
  ${description ? `<p class="section-desc fade-up">${esc(description)}</p>` : ''}
`;

// "Available" status pill (used in the status bar and overview).
const statusDot = (label) => `
  <div class="status-dot-wrap" role="status" aria-label="${esc(label)}">
    <div class="dot-pulse"></div>
    <span class="status-label">${esc(label)}</span>
  </div>
`;

// Inline SVG icons for project buttons.
const ICONS = {
  external:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
};

// --- Shell: status bar, sidebar, mobile nav -------------------

function renderStatusBar(site) {
  mount(
    'status-bar',
    `
    <div class="sb-inner">
      <span class="sb-name">${esc(site.name)}</span>
      <span class="sb-time" id="dhaka-time" aria-label="Current time in Dhaka"></span>
      ${statusDot(site.status.label)}
    </div>
  `
  );
}

function renderSidebar(site, navItems) {
  const links = navItems
    .map(
      (n) =>
        `<li class="nav-item"><a href="#${esc(n.id)}" data-section="${esc(
          n.id
        )}">${esc(n.label)}</a></li>`
    )
    .join('');

  mount(
    'sidebar',
    `
    <div>
      <p class="nav-label">Navigation</p>
      <div class="nav-wrap">
        <span class="nav-glass" aria-hidden="true"><span class="nav-glass-reflection"></span></span>
        <ul class="nav-list">${links}</ul>
      </div>
    </div>
    <a href="${esc(site.cta.href)}" class="sidebar-cta">${esc(site.cta.label)}</a>
  `
  );
}

function renderMobileNav(mobileNavItems) {
  const btns = mobileNavItems
    .map(
      (n) =>
        `<button class="mobile-nav-btn" data-section="${esc(
          n.id
        )}" aria-label="${esc(n.label)}">${esc(
          n.label
        )}<div class="mobile-nav-indicator"></div></button>`
    )
    .join('');

  mount('mobile-nav', `<div class="mobile-nav-inner">${btns}</div>`);
}

// --- Sections -------------------------------------------------

function renderOverview(data) {
  const stats = data.stats
    .map(
      (s) =>
        `<div class="stat-chip"><span class="stat-value">${esc(
          s.value
        )}</span><span class="stat-label">${esc(s.label)}</span></div>`
    )
    .join('');

  const lines = data.config.lines
    .map(
      (l) =>
        `<div class="config-line"><span class="config-key">${esc(
          l.key
        )}</span><span class="config-arrow">→</span><span class="config-val">${esc(
          l.value
        )}</span></div>`
    )
    .join('');

  const badges = data.config.badges
    .map((b) => `<span class="badge badge-default">${esc(b)}</span>`)
    .join('');

  mount(
    'overview',
    `
    <div class="overview-grid">
      <div>
        <div class="overview-tag-row fade-up">
          <span class="overview-tag">${esc(data.tag)}</span>
          <div class="overview-divider"></div>
          ${statusDot(data.statusLabel)}
        </div>
        <h1 class="hero-name fade-up">${esc(data.name)}</h1>
        <p class="hero-role fade-up">${esc(data.role)}</p>
        <p class="hero-philosophy fade-up">${esc(data.philosophy)}</p>
        <div class="quick-stats fade-up">${stats}</div>
      </div>
      <div class="config-card fade-up">
        <div class="config-header">
          <div class="config-dot"></div>
          <div class="config-dot"></div>
          <div class="config-dot"></div>
          <span class="config-filename">${esc(data.config.filename)}</span>
        </div>
        <div class="config-body">${lines}</div>
        <div class="config-footer">${badges}</div>
      </div>
    </div>
  `
  );
}

function renderWhy(data) {
  mount(
    'why',
    `
    <p class="section-label fade-up">${esc(data.label)}</p>
    <h2 class="section-title fade-up" id="why-h">${esc(data.title)}</h2>
    <blockquote class="philosophy-card fade-up" aria-label="Why I build">
      <span class="quote-mark" aria-hidden="true">"</span>
      <p class="philosophy-text">${data.quote}</p>
      <cite class="philosophy-cite">${esc(data.cite)}</cite>
    </blockquote>
  `
  );
}

// Shared card grid used by both "What I Build" and "Principles".
function numberedCards(items) {
  return items
    .map(
      (it) =>
        `<div class="domain-card fade-up"><span class="domain-num">${esc(
          it.number
        )}</span><h3 class="domain-title">${esc(
          it.title
        )}</h3><p class="domain-desc">${esc(
          it.description
        )}</p><div class="domain-corner"></div></div>`
    )
    .join('');
}

function renderDomains(data) {
  mount(
    'domains',
    `
    ${heading('domains', data.label, data.title, data.description)}
    <div class="domains-grid">${numberedCards(data.items)}</div>
  `
  );
}

function renderPrinciples(data) {
  mount(
    'principles',
    `
    ${heading('principles', data.label, data.title, data.description)}
    <div class="domains-grid">${numberedCards(data.items)}</div>
  `
  );
}

function renderProjects(data, statusMeta) {
  const cards = data.items
    .map((p) => {
      const meta = statusMeta[p.status] || { label: p.status, badge: 'badge-default' };
      const chips = p.technologies
        .map((t) => `<span class="stack-chip">${esc(t)}</span>`)
        .join('');

      const buttons = [];
      if (p.demoUrl)
        buttons.push(
          `<a href="${esc(
            p.demoUrl
          )}" class="project-btn project-btn-primary" aria-label="Live demo of ${esc(
            p.title
          )}">${ICONS.external} Live Demo</a>`
        );
      if (p.downloadUrl) {
        const downloadLabel = p.downloadButtonName || 'Download';
        buttons.push(
          `<a href="${esc(
            p.downloadUrl
          )}" class="project-btn" aria-label="${esc(downloadLabel)} ${esc(
            p.title
          )}">${ICONS.download} ${esc(downloadLabel)}</a>`
        );
      }

      return `
      <article class="project-card fade-up" aria-label="Project: ${esc(p.title)}">
        <div class="project-bar ${esc(p.status)}"></div>
        <div class="project-body">
          <div class="project-header">
            <h3 class="project-title">${esc(p.title)}</h3>
            <span class="badge ${esc(meta.badge)}">${esc(meta.label)}</span>
          </div>
          <div class="project-cols">
            <div><p class="project-field-label">Problem</p><p class="project-field-text">${esc(
              p.problem
            )}</p></div>
            <div><p class="project-field-label">Solution</p><p class="project-field-text">${esc(
              p.solution
            )}</p></div>
          </div>
          <div class="project-divider"></div>
          <div class="project-bottom">
            <div class="project-bottom-left">
              <div class="stack-chips">${chips}</div>
              ${
                buttons.length
                  ? `<div class="project-actions">${buttons.join('')}</div>`
                  : ''
              }
            </div>
            <div class="outcome-block"><p class="outcome-label">Outcome</p><p class="outcome-text">${esc(
              p.outcome
            )}</p></div>
          </div>
        </div>
      </article>`;
    })
    .join('');

  mount(
    'projects',
    `${heading('projects', data.label, data.title, data.description)}${cards}`
  );
}

function renderBuilding(data, categoryBadge) {
  const columns = data.columns
    .map((col) => {
      const colItems = data.items.filter((it) => it.status === col.status);
      const cards = colItems
        .map((it) => {
          const variant = categoryBadge[it.category] || 'badge-default';
          return `
          <div class="roadmap-card fade-up">
            <div><span class="badge ${esc(variant)}">${esc(it.category)}</span></div>
            <h3 class="roadmap-card-title">${esc(it.title)}</h3>
            <p class="roadmap-card-desc">${esc(it.description)}</p>
          </div>`;
        })
        .join('');

      return `
      <div>
        <div class="roadmap-col-header fade-up"><div class="col-dot ${esc(
          col.dot
        )}"></div><span class="col-title">${esc(
        col.label
      )}</span><span class="col-count">${colItems.length}</span></div>
        ${cards}
      </div>`;
    })
    .join('');

  mount(
    'building',
    `
    ${heading('building', data.label, data.title, data.description)}
    <div class="roadmap-grid">${columns}</div>
  `
  );
}

function renderNow(data) {
  const cards = data.items
    .map(
      (it) =>
        `<div class="domain-card fade-up"><span class="now-card-label">${esc(
          it.category
        )}</span><h3 class="domain-title">${esc(
          it.title
        )}</h3><p class="domain-desc">${esc(
          it.description
        )}</p><div class="domain-corner"></div></div>`
    )
    .join('');

  mount(
    'now',
    `
    ${heading('now', data.label, data.title, data.description)}
    <div class="now-grid">${cards}</div>
  `
  );
}

function renderImpact(data) {
  const metrics = data.metrics
    .map(
      (m) =>
        `<div class="metric-card fade-up"><p class="metric-value"${
          m.ariaLabel ? ` aria-label="${esc(m.ariaLabel)}"` : ''
        }>${esc(m.value)}</p><p class="metric-label">${esc(
          m.title
        )}</p><p class="metric-desc">${esc(m.description)}</p></div>`
    )
    .join('');

  mount(
    'impact',
    `
    ${heading('impact', data.label, data.title, data.description)}
    <div class="impact-metrics">${metrics}</div>
    <blockquote class="philosophy-card fade-up" aria-label="Design philosophy">
      <span class="quote-mark" aria-hidden="true">"</span>
      <p class="philosophy-text">${data.quote.text}</p>
      <cite class="philosophy-cite">${esc(data.quote.cite)}</cite>
    </blockquote>
  `
  );
}

function renderToolkit(data) {
  const rows = Object.values(data.groups)
    .map((g) => {
      const tools = g.items
        .map((t) => `<span class="tool-chip">${esc(t)}</span>`)
        .join('');
      return `<div class="toolkit-row" role="listitem"><span class="toolkit-cat">${esc(
        g.label
      )}</span><div class="toolkit-tools">${tools}</div></div>`;
    })
    .join('');

  mount(
    'toolkit',
    `
    ${heading('toolkit', data.label, data.title, data.description)}
    <div class="toolkit-table fade-up" role="list" aria-label="Technology toolkit">${rows}</div>
    <p class="toolkit-note fade-up">${esc(data.note)}</p>
  `
  );
}

function renderContact(data) {
  const chips = data.help.chips
    .map((c) => `<span class="tool-chip">${esc(c)}</span>`)
    .join('');

  const links = Object.values(data.channels)
    .map((c) => {
      const rel = c.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `
      <a href="${esc(c.href)}"${rel} class="contact-link fade-up">
        <div><p class="cl-label">${esc(c.label)}</p><p class="cl-value">${esc(
        c.value
      )}</p></div>
        <div class="cl-meta"><p class="cl-desc">${esc(
          c.desc
        )}</p><p class="cl-arrow">→</p></div>
      </a>`;
    })
    .join('');

  mount(
    'contact',
    `
    ${heading('contact', data.label, data.title, data.description)}
    <div class="help-block fade-up">
      <p class="help-q">${esc(data.help.question)}</p>
      <div class="help-chips">${chips}</div>
    </div>
    <div class="contact-links">${links}</div>
    <p class="contact-note fade-up">${esc(data.note)}</p>
  `
  );
}
