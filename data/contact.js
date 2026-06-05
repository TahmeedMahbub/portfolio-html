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
      value: 'hello@tahmeed.dev',
      href: 'mailto:hello@tahmeed.dev',
      desc: 'Best for project inquiries',
      external: false,
    },
    github: {
      label: 'GitHub',
      value: 'github.com/tahmeed',
      href: 'https://github.com/tahmeed',
      desc: "See what I'm building",
      external: true,
    },
    linkedin: {
      label: 'LinkedIn',
      value: 'linkedin.com/in/tahmeed',
      href: 'https://linkedin.com/in/tahmeed',
      desc: 'Professional background',
      external: true,
    },
  },

  note:
    'Currently open to freelance projects and full-time roles. Response time: usually within 24 hours.',
};
