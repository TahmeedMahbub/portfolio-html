// =============================================================
// toolkit.js — Tools & technologies grouped by purpose.
// `groups` is an ordered list; each group has a label + items[].
// =============================================================

const toolkit = {
  label: 'Toolkit',
  title: 'Tools & technologies',
  description:
    'Organized by purpose, not by hype. I reach for what solves the problem well.',

  groups: {
    backend: {
      label: 'Backend',
      items: ['PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'REST APIs'],
    },
    frontend: {
      label: 'Frontend',
      items: ['Livewire', 'Alpine.js', 'Tailwind CSS', 'Filament'],
    },
    workflow: {
      label: 'Workflow',
      items: ['Laravel Queues', 'Webhooks', 'Cron Jobs', 'Event Broadcasting'],
    },
    aiTooling: {
      label: 'AI & Tooling',
      items: ['OpenAI API', 'Prompt Engineering', 'Git', 'Linux', 'Docker'],
    },
    exploring: {
      label: 'Exploring',
      items: ['Next.js', 'TypeScript', 'Python', 'LangChain', 'Supabase'],
    },
  },

  note: '* "Exploring" marks technologies I\'m actively learning.',
};
