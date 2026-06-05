// =============================================================
// principles.js — Building principles.
// Each item: { number, title, description }
// =============================================================

const principles = {
  label: 'Principles',
  title: 'How I think about building',
  description:
    'A few rules I keep coming back to. They shape every system I ship.',

  items: [
    {
      number: '01',
      title: 'Build for the people using it',
      description:
        'Software should fit the workflow that already exists, not force a new one onto the team.',
    },
    {
      number: '02',
      title: 'Prefer simple over clever',
      description:
        'Clever breaks at 2am. Simple systems are the ones still running a year later.',
    },
    {
      number: '03',
      title: 'Automate the repeatable',
      description:
        "If a task happens on a schedule, it shouldn't depend on someone remembering to do it.",
    },
    {
      number: '04',
      title: 'Measure what actually changes',
      description:
        'Success is hours saved and errors removed — not lines of code or tech choices.',
    },
    {
      number: '05',
      title: 'Ship, then sharpen',
      description:
        'A working system in production teaches more than a perfect one stuck in planning.',
    },
  ],
};
