export interface WardMissionItem {
  id: string
  title: string
  detail: string
  tag?: string
}

export interface WardMissionSection {
  id: string
  title: string
  kicker: string
  items: WardMissionItem[]
}

export const wardMissionSections: WardMissionSection[] = [
  {
    id: 'ideas',
    title: 'Project Ideas',
    kicker: 'Incubator',
    items: [
      {
        id: 'idea-learning-coach',
        title: 'AI Learning Coach',
        detail: 'Track what Ward learned, what error happened, and the next tiny exercise.',
        tag: 'useful',
      },
      {
        id: 'idea-prompt-lab',
        title: 'Prompt Lab',
        detail: 'Store prompt versions, compare outputs, and keep the prompt that actually works.',
        tag: 'creative',
      },
      {
        id: 'idea-asset-director',
        title: 'Asset Director',
        detail: 'Review sprites, rooms, screenshots, and write cleaner art prompts for the next asset pass.',
        tag: 'visual',
      },
    ],
  },
  {
    id: 'learning',
    title: 'Learning Notes',
    kicker: 'Skill Log',
    items: [
      {
        id: 'learn-react-state',
        title: 'React state is the control room',
        detail: 'Room, panel, and task behavior all become simple once the state shape is clear.',
      },
      {
        id: 'learn-small-scope',
        title: 'Small v1 beats giant idea',
        detail: 'Ship one useful panel first, then connect it to real agent output later.',
      },
      {
        id: 'learn-verify',
        title: 'Build plus screenshot is the checkpoint',
        detail: 'A feature is not done until it compiles and the important screen can be seen.',
      },
    ],
  },
  {
    id: 'prompts',
    title: 'Prompt Library',
    kicker: 'Reusable',
    items: [
      {
        id: 'prompt-mission',
        title: 'Mission prompt',
        detail: 'Goal, agent roles, v1 scope, constraints, verification, and expected result.',
      },
      {
        id: 'prompt-asset',
        title: 'Asset prompt',
        detail: 'Reference match, canvas, style, negative prompt, and exact target files.',
      },
      {
        id: 'prompt-review',
        title: 'Review prompt',
        detail: 'Ask for bugs first, screenshots second, and next steps last.',
      },
    ],
  },
  {
    id: 'next',
    title: "Today's Next Steps",
    kicker: 'Do Now',
    items: [
      {
        id: 'next-click',
        title: 'Click the board',
        detail: 'Use Ward Mission Control as the home base for deciding what the agents do next.',
      },
      {
        id: 'next-pick',
        title: 'Pick one real mission',
        detail: 'Choose Learning Coach, Prompt Lab, or Asset Director as the first useful project.',
      },
      {
        id: 'next-wire',
        title: 'Wire real output later',
        detail: 'Replace demo data with actual markdown logs or backend task results when ready.',
      },
    ],
  },
]

export const wardAgentBrief = [
  {
    role: 'Portfolio Coach',
    output: 'Turns Ward’s projects into portfolio stories, case studies, screenshots, and GitHub-ready proof.',
  },
  {
    role: 'Project Finder',
    output: 'Looks at Ward’s current folders and picks the projects most worth finishing first.',
  },
  {
    role: 'Skill Mentor',
    output: 'Turns semester-4 learning goals into weekly practice plans, notes, and proof-of-progress tasks.',
  },
  {
    role: 'GitHub Polish Agent',
    output: 'Cleans project READMEs, repo descriptions, screenshots, setup steps, and roadmap sections.',
  },
  {
    role: 'CV Agent',
    output: 'Converts projects and coursework into CV bullets, LinkedIn copy, and interview stories.',
  },
  {
    role: 'Internship Scout',
    output: 'Maps target internships to skill gaps, application checklists, and next actions Ward can do this week.',
  },
]
