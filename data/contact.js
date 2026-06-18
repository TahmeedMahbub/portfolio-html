// =============================================================
// contact.js — Contact section content.
// `channels` holds email / github / linkedin entries.
// =============================================================

const contact = {
  label: 'Contact',
  title: "Let's build something useful",
  description:
    "If you have a business problem that needs a technical solution — automation, internal tools, or a product you want to ship — I'd like to hear about it.",

  help: {
    question: 'What can I help with?',
    chips: [
      'Business Automation',
      'Internal Tools',
      'Laravel Systems',
      'MVP Development',
      'Workflow Optimization',
    ],
  },

  // Each channel renders as a contact link row.
  channels: {
    email: {
      label: 'Email',
      value: 'tahmeedmahbub@gmail.com',
      href: 'mailto:tahmeedmahbub@gmail.com',
      desc: 'Best for project inquiries',
      external: false,
    },
    github: {
      label: 'GitHub',
      value: 'github.com/TahmeedMahbub',
      href: 'https://github.com/TahmeedMahbub',
      desc: "See what I'm building",
      external: true,
    },
    linkedin: {
      label: 'LinkedIn',
      value: 'linkedin.com/in/tahmeedmahbub',
      href: 'https://linkedin.com/in/tahmeedmahbub',
      desc: 'Professional background',
      external: true,
    },
  },

  note:
    'Currently open to freelance projects and full-time roles. Response time: usually within 24 hours.',
};
