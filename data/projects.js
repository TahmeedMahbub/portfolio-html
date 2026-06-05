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
      title: 'Order Management System',
      status: 'shipped',
      problem:
        'A business tracked 200+ daily orders across WhatsApp, spreadsheets, and sticky notes — causing missed orders and frustrated customers.',
      solution:
        'Built a Laravel-based internal tool with role-based access, real-time order status tracking, automated customer notifications, and a reporting dashboard.',
      outcome:
        'Cut order processing time by ~60%. No missed orders reported in the first 6 months.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Filament', 'Livewire'],
      demoUrl: '#',
      downloadUrl: '#',
      downloadButtonName: 'Download APK',
    },
    {
      title: 'Business Automation Suite',
      status: 'shipped',
      problem:
        'A growing SME was spending 15+ hours weekly on data entry, invoice generation, and inter-department reporting.',
      solution:
        'Designed and built a modular automation system integrating with existing tools — triggering workflows, generating documents, and syncing records automatically.',
      outcome:
        'Recovered 12+ hours per week. Reporting that took a day now runs in minutes.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Webhooks'],
      demoUrl: '#',
      downloadUrl: '#',
      downloadButtonName: 'Download',
    },
    {
      title: 'Inventory & Supply Chain Tool',
      status: 'shipped',
      problem:
        'Manual stock tracking led to over-ordering, stockouts, and no visibility into supplier performance.',
      solution:
        'Built a centralized inventory system with low-stock alerts, supplier tracking, purchase order generation, and trend analytics.',
      outcome:
        'Reduced overstock by 35%. Procurement decisions now backed by data, not guesswork.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
      demoUrl: '#',
      downloadUrl: '#',
      downloadButtonName: 'Download',
    },
  ],
};

// Maps a project `status` to its badge label + CSS variant.
const projectStatusMeta = {
  shipped: { label: 'Shipped', badge: 'badge-success' },
  'in-progress': { label: 'In Progress', badge: 'badge-warning' },
};
