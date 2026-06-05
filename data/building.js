// =============================================================
// building.js — Public roadmap.
// Each item: { status, category, title, description }
//   status   → which column it belongs to (key in `columns`)
//   category → badge text shown on the card
// Cards are grouped into columns in the order of `columns` below.
// =============================================================

const building = {
  label: 'Currently Building',
  title: 'Public roadmap',
  description:
    "What I'm working on when I'm not working for clients. Always building something.",

  // Column definitions (order = left-to-right). `dot` is the CSS modifier.
  columns: [
    { status: 'in-progress', label: 'In Progress', dot: 'inprogress' },
    { status: 'next', label: 'Next Up', dot: 'next' },
    { status: 'idea', label: 'Idea Queue', dot: 'idea' },
  ],

  items: [
    {
      status: 'in-progress',
      category: 'Product',
      title: 'LifeBook',
      description:
        'A personal operating system for goals, habits, and work — built for builders.',
    },
    {
      status: 'next',
      category: 'Open Source',
      title: 'Automation Toolkit',
      description:
        'Reusable workflow components and integrations for Laravel-based internal tools.',
    },
    {
      status: 'idea',
      category: 'AI',
      title: 'AI Assistant for SMEs',
      description:
        'Natural language interface for small business operations — query your data, trigger workflows.',
    },
  ],
};

// Maps a card `category` to its badge CSS variant.
const categoryBadge = {
  Product: 'badge-warning',
  'Open Source': 'badge-default',
  AI: 'badge-accent',
};
