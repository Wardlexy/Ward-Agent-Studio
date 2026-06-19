const topProjects = [
  {
    name: 'Ward Agent Studio',
    score: 94,
    effort: 'medium',
    tech: ['React', 'TypeScript', 'Vite', 'Express', 'Vercel'],
    nextAction: 'Polish the public demo, add screenshots, and write a recruiter-friendly case study.',
    cvAngle: 'Shows a practical student portfolio command center with agent-style workflows, local artifact generation, and deployable UI.',
    missing: ['public screenshots', 'short demo video'],
  },
]

const artifacts = [
  {
    path: 'docs/portfolio-audit/ward-project-audit.md',
    label: 'Project Audit Markdown',
    description: 'Ranked project notes with next actions for portfolio, CV, GitHub, and internship proof.',
  },
  {
    path: 'docs/portfolio-audit/project-audit.json',
    label: 'Project Audit JSON',
    description: 'Structured project audit data for future real-agent workflows.',
  },
]

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    summary: 'Vercel demo audit complete. Best next move: polish Ward Agent Studio first (94/100). Run locally to scan Ward private folders.',
    roots: ['public Vercel demo'],
    topProjects,
    artifacts,
  })
}
