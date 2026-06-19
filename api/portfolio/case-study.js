const artifacts = [
  {
    path: 'docs/case-study/ward-agent-studio-case-study.md',
    label: 'Full Case Study',
    description: 'Problem, solution, features, stack, demo flow, CV bullets, internship angle, and roadmap.',
  },
  {
    path: 'docs/case-study/ward-agent-studio-readme-section.md',
    label: 'README Section Draft',
    description: 'GitHub-ready summary text Ward can paste into the main README.',
  },
  {
    path: 'docs/case-study/ward-agent-studio-recruiter-notes.md',
    label: 'CV and Internship Notes',
    description: 'Short portfolio card copy plus CV and internship-friendly bullets.',
  },
]

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    summary: 'Vercel demo generated a Ward Agent Studio case study package preview. Run locally to write markdown files into docs/case-study.',
    artifacts,
  })
}
