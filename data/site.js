// =============================================================
// site.js — Global site metadata, navigation & shell content.
// Edit this file to change the name, nav items, status, or CTA.
// =============================================================

const site = {
  name: 'Tahmeed Mahbub',
  // Status shown in the top status bar and overview tag row.
  status: {
    label: 'Available',
    timeZone: 'Asia/Dhaka',
    timeSuffix: 'Dhaka, BD',
  },
  // Sidebar "Get in touch" button.
  cta: {
    label: 'Get in touch',
    href: 'mailto:hello@tahmeed.dev',
  },
};

// Sidebar navigation — order defines section order in the page.
// `id` must match a <section> id; `label` is the visible text.
const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'domains', label: 'What I Build' },
  { id: 'principles', label: 'Principles' },
  { id: 'projects', label: 'Projects' },
  { id: 'building', label: 'Building' },
  { id: 'now', label: 'Now' },
  { id: 'impact', label: 'Impact' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

// Condensed navigation shown on mobile (bottom bar).
const mobileNavItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'building', label: 'Building' },
  { id: 'impact', label: 'Impact' },
  { id: 'contact', label: 'Contact' },
];
