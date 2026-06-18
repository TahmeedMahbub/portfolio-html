// =============================================================
// projects.js — Featured projects.
// Each item:
//   title, status, problem, solution, outcome,
//   technologies[], demoUrl, downloadUrl, downloadButtonName
// `status` drives the colored top bar + badge:
//   'shipped' | 'in-progress'
// Set demoUrl / downloadUrl to '' or null to hide that button.
// `downloadButtonName` sets the download button's label
// (defaults to 'Download' when omitted).
// =============================================================

const projects = {
  label: 'Featured Projects',
  title: "What I've built that matters",
  description:
    'Not portfolios of pretty UIs. Systems that changed how businesses operate.',

  items: [
    {
      title: 'Hishaber Khata',
      status: 'shipped',
      problem:
        'Small businesses tracked sales, purchases, stock, and due payments using notebooks and spreadsheets — leading to inaccurate records and poor business visibility.',
        solution:
        'Built a multi-tenant SaaS platform with sales, purchases, inventory tracking, due management, cashbook, reporting, and bilingual support for SME owners.',
        outcome:
        'Centralized daily operations, reduced manual bookkeeping, improved stock accuracy, and provided real-time business insights from any device.',
        technologies: ['PHP', 'Laravel', 'MySQL', 'Materialize CSS', 'JavaScript', 'Email'],
      demoUrl: '#',
    },
    {
      title: 'LifeBook',
        status: 'shipped',
      problem:
        'Many people start self-improvement journeys with motivation but fail to maintain momentum due to lack of structure, accountability, and feedback.',
        solution:
        'Built a full-featured personal growth platform featuring AI-powered mentors, gamified challenges, XP systems, achievements, notifications, and analytics.',
        outcome:
        'Transformed personal development into an engaging experience that rewards consistency and promotes long-term habit formation.',
        technologies: ['PHP', 'Laravel', 'MySQL', 'jQuery', 'OneSignal'],
      downloadUrl: './files/LifeBook.apk',
      downloadButtonName: 'Download APK',
    },
    // {
    //   title: 'Inventory & Supply Chain Tool',
    //   status: 'shipped',
    //   problem:
    //     'Manual stock tracking led to over-ordering, stockouts, and no visibility into supplier performance.',
    //   solution:
    //     'Built a centralized inventory system with low-stock alerts, supplier tracking, purchase order generation, and trend analytics.',
    //   outcome:
    //     'Reduced overstock by 35%. Procurement decisions now backed by data, not guesswork.',
    //   technologies: ['PHP', 'Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
    //   demoUrl: '#',
    //   downloadUrl: '#',
    //   downloadButtonName: 'Download Tool',
    // },
  ],
};

// Maps a project `status` to its badge label + CSS variant.
const projectStatusMeta = {
  shipped: { label: 'Shipped', badge: 'badge-success' },
  'in-progress': { label: 'In Progress', badge: 'badge-warning' },
};
