// =============================================================
// impact.js — Impact metrics + closing quote.
// Each metric: { value, title, description, ariaLabel? }
// `quote` accepts inline <em> for emphasis.
// =============================================================

const impact = {
  label: 'Impact',
  title: 'Outcomes over outputs',
  description:
    'I measure success by what changes after the software ships. Not lines of code. Not technology choices.',

  metrics: [
    {
      value: '~60%',
      title: 'Faster Operations',
      description: 'Less time spent processing each order after deployment',
      ariaLabel: 'about 60 percent',
    },
    {
      value: '12h+',
      title: 'Weekly Time Saved',
      description: 'Manual hours recovered per week through automation',
      ariaLabel: '12 plus hours',
    },
    {
      value: '5+',
      title: 'Workflows Automated',
      description: 'Business processes now running without manual steps',
      ariaLabel: '5 plus',
    },
    {
      value: '100%',
      title: 'Still in Use',
      description: "Every system I've shipped is still running in production",
      ariaLabel: 'still in use',
    },
  ],

  quote: {
    text:
      'I measure success by what changes <em>after the software is shipped</em>. Not lines of code. Not technology choices. Business outcomes.',
    cite: '— Tahmeed Mahbub, Software Engineer',
  },
};
