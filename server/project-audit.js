import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs'
import { basename, join, relative } from 'path'
import { homedir } from 'os'

const SKIP_DIRS = new Set([
  '.git',
  '.next',
  '.venv',
  '__pycache__',
  'build',
  'dist',
  'node_modules',
  'release',
  'venv',
])

const CODE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.ipynb',
  '.js',
  '.jsx',
  '.md',
  '.mjs',
  '.py',
  '.tsx',
  '.ts',
])

function safeStat(path) {
  try { return statSync(path) } catch { return null }
}

function safeRead(path, max = 16_000) {
  try { return readFileSync(path, 'utf8').slice(0, max) } catch { return '' }
}

function safeJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}

function safeList(path) {
  try { return readdirSync(path, { withFileTypes: true }) } catch { return [] }
}

function extname(name) {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : ''
}

function getAuditRoots(projectRoot) {
  const fromEnv = process.env.WARD_PROJECT_AUDIT_ROOTS
    ? process.env.WARD_PROJECT_AUDIT_ROOTS.split(';').map(item => item.trim()).filter(Boolean)
    : []

  const defaults = [
    join(homedir(), 'Projects'),
    join(homedir(), 'Documents', 'Portfolio'),
    join(homedir(), 'OneDrive', 'Documents', 'Portfolio'),
    projectRoot,
  ]

  return Array.from(new Set([...fromEnv, ...defaults])).filter(path => safeStat(path)?.isDirectory())
}

function hasAny(path, names) {
  return names.some(name => existsSync(join(path, name)))
}

function isProjectLike(path) {
  return hasAny(path, [
    '.git',
    'README.md',
    'package.json',
    'pyproject.toml',
    'requirements.txt',
    'src',
    'app',
    'server',
    'vite.config.ts',
    'vite.config.js',
  ])
}

function discoverCandidateDirs(root, maxDepth = 2) {
  const found = new Set()

  function walk(dir, depth) {
    if (found.size >= 80) return
    if (isProjectLike(dir)) found.add(dir)
    if (depth >= maxDepth) return

    for (const entry of safeList(dir)) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue
      walk(join(dir, entry.name), depth + 1)
    }
  }

  walk(root, 0)
  return Array.from(found)
}

function collectProjectFiles(root, maxDepth = 4, limit = 900) {
  const files = []

  function walk(dir, depth) {
    if (files.length >= limit || depth > maxDepth) return
    for (const entry of safeList(dir)) {
      if (files.length >= limit) return
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full, depth + 1)
        continue
      }
      const ext = extname(entry.name)
      if (CODE_EXTENSIONS.has(ext) || /\.(png|jpe?g|webp)$/i.test(entry.name)) {
        files.push(full)
      }
    }
  }

  walk(root, 0)
  return files
}

function detectTech(files, packageJson, pyproject, hasRequirements) {
  const names = files.map(file => file.toLowerCase())
  const tech = new Set()

  if (packageJson) {
    tech.add('JavaScript/TypeScript')
    const deps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
    if (deps.react) tech.add('React')
    if (deps.vite) tech.add('Vite')
    if (deps.express) tech.add('Express')
    if (deps.electron) tech.add('Electron')
    if (deps['better-sqlite3'] || deps.sqlite3) tech.add('SQLite')
  }
  if (pyproject || hasRequirements || names.some(name => name.endsWith('.py'))) tech.add('Python')
  if (names.some(name => name.endsWith('.ipynb'))) tech.add('Notebook')
  if (names.some(name => name.endsWith('.tsx'))) tech.add('TypeScript')
  if (names.some(name => name.endsWith('.html') || name.endsWith('.css'))) tech.add('Web UI')

  return Array.from(tech)
}

function titleFromReadme(readme) {
  const heading = readme.split(/\r?\n/).find(line => line.trim().startsWith('# '))
  return heading ? heading.replace(/^#\s+/, '').trim() : ''
}

function analyzeProject(path, projectRoot) {
  const packageJson = safeJson(join(path, 'package.json'))
  const pyproject = safeRead(join(path, 'pyproject.toml'), 4_000)
  const requirements = safeRead(join(path, 'requirements.txt'), 4_000)
  const readme = safeRead(join(path, 'README.md'), 12_000)
  const files = collectProjectFiles(path)
  const codeFiles = files.filter(file => CODE_EXTENSIONS.has(extname(file)))
  const imageFiles = files.filter(file => /\.(png|jpe?g|webp)$/i.test(file))
  const tech = detectTech(files, packageJson, pyproject, !!requirements)
  const rel = relative(projectRoot, path)
  const displayPath = formatDisplayPath(path, projectRoot)
  const name = packageJson?.name || titleFromReadme(readme) || basename(path)
  const stat = safeStat(path)
  const modifiedAt = stat?.mtime?.toISOString() ?? null

  let score = 0
  if (readme.length > 400) score += 14
  else if (readme) score += 8
  if (packageJson || pyproject || requirements) score += 12
  if (hasAny(path, ['src', 'app', 'server'])) score += 10
  if (existsSync(join(path, '.git'))) score += 8
  score += Math.min(20, Math.round(codeFiles.length / 2))
  score += Math.min(10, tech.length * 2)
  if (imageFiles.length > 0) score += 7
  if (/portfolio|agent|studio|openai|mcp|langgraph|app|dashboard|office/i.test(`${name} ${path}`)) score += 10
  if (modifiedAt && Date.now() - new Date(modifiedAt).getTime() < 1000 * 60 * 60 * 24 * 45) score += 7
  score = Math.min(score, 100)

  const missing = []
  if (!readme) missing.push('README')
  if (!imageFiles.length) missing.push('screenshots')
  if (!packageJson && !pyproject && !requirements) missing.push('run instructions')
  if (!existsSync(join(path, '.git'))) missing.push('Git history')

  const effort = missing.length >= 3 ? 'high' : missing.length >= 1 ? 'medium' : 'low'
  const topTech = tech.length ? tech.join(', ') : 'General project'

  const nextAction = !readme
    ? 'Write a README with pitch, setup, features, screenshots, and roadmap.'
    : !imageFiles.length
      ? 'Capture 2-3 screenshots and add them to the README.'
      : missing.includes('run instructions')
        ? 'Add clear local run instructions and tech stack notes.'
        : 'Turn this into a case study with problem, solution, demo flow, and CV bullets.'

  return {
    name,
    path: displayPath,
    relativePath: rel && !rel.startsWith('..') ? rel || '.' : displayPath,
    score,
    effort,
    tech,
    codeFileCount: codeFiles.length,
    hasReadme: !!readme,
    hasScreenshots: imageFiles.length > 0,
    modifiedAt,
    nextAction,
    cvAngle: `Shows ${topTech} work through a real project that can be explained with screenshots, setup steps, and a short demo.`,
    missing,
  }
}

function formatDisplayPath(path, projectRoot) {
  const workspaceRel = relative(projectRoot, path)
  if (!workspaceRel.startsWith('..')) {
    return workspaceRel === '' ? 'Ward Agent Studio workspace' : `Ward Agent Studio workspace/${workspaceRel.replace(/\\/g, '/')}`
  }

  const home = homedir()
  const homeRel = relative(home, path)
  if (homeRel && !homeRel.startsWith('..')) {
    return `~/${homeRel.replace(/\\/g, '/')}`
  }

  return basename(path)
}

function renderMarkdown({ generatedAt, roots, projects }) {
  const top = projects[0]
  const rows = projects.slice(0, 12).map((project, index) => (
    `| ${index + 1} | ${project.name.replace(/\|/g, '/')} | ${project.score} | ${project.effort} | ${project.tech.join(', ') || 'Unknown'} | ${project.nextAction.replace(/\|/g, '/')} |`
  ))

  const nextSteps = top
    ? [
        `1. Polish **${top.name}** first because it has the highest portfolio score.`,
        `2. Do this next: ${top.nextAction}`,
        '3. After that, generate a case study and CV bullets from the polished project.',
      ]
    : ['1. Add at least one project folder under `C:/Users/lexdw/Projects` and rerun the audit.']

  const projectSections = projects.slice(0, 5).map(project => `### ${project.name}
- Score: ${project.score}/100
- Effort: ${project.effort}
- Path: \`${project.relativePath}\`
- Tech: ${project.tech.join(', ') || 'Unknown'}
- Missing: ${project.missing.join(', ') || 'Nothing obvious'}
- Next action: ${project.nextAction}
- CV angle: ${project.cvAngle}
`).join('\n')

  return `# Ward Project Audit

Generated: ${generatedAt}

This file is created by Ward Agent Studio. It scans Ward's local project folders and ranks which projects are most useful to polish for GitHub, CV, portfolio, and internship proof.

## Scanned Roots

${roots.map(root => `- \`${root}\``).join('\n')}

## Best Next Move

${top ? `Polish **${top.name}** first.` : 'No project candidates found yet.'}

${nextSteps.join('\n')}

## Ranked Projects

| Rank | Project | Score | Effort | Tech | Next Action |
| --- | --- | ---: | --- | --- | --- |
${rows.join('\n') || '| - | No projects found | - | - | - | - |'}

## Top Project Notes

${projectSections || 'No project notes available yet.'}

## How To Use This

1. Pick the top project.
2. Do the listed next action.
3. Run the app and capture screenshots.
4. Start the Case Study mission in Ward Agent Studio.
5. Use the generated text for README, CV bullets, and portfolio copy.
`
}

export function writeWardProjectAudit(projectRoot) {
  const generatedAt = new Date().toISOString()
  const roots = getAuditRoots(projectRoot)
  const candidates = Array.from(new Set(roots.flatMap(root => discoverCandidateDirs(root))))
  const projects = candidates
    .map(path => analyzeProject(path, projectRoot))
    .sort((a, b) => b.score - a.score || a.effort.localeCompare(b.effort))

  const outputDir = join(projectRoot, 'docs', 'portfolio-audit')
  mkdirSync(outputDir, { recursive: true })

  const markdown = renderMarkdown({ generatedAt, roots, projects })
  const json = JSON.stringify({ generatedAt, roots, projects }, null, 2)
  const markdownPath = join(outputDir, 'ward-project-audit.md')
  const jsonPath = join(outputDir, 'project-audit.json')

  writeFileSync(markdownPath, markdown, 'utf8')
  writeFileSync(jsonPath, json, 'utf8')

  const top = projects[0]

  return {
    generatedAt,
    summary: top
      ? `Project audit complete. Best next move: polish "${top.name}" first (${top.score}/100).`
      : 'Project audit complete. No project candidates were found yet.',
    roots,
    topProjects: projects.slice(0, 5),
    artifacts: [
      {
        path: relative(projectRoot, markdownPath).replace(/\\/g, '/'),
        label: 'Project Audit Markdown',
        description: 'Ranked local projects with next actions for portfolio, CV, GitHub, and internship proof.',
      },
      {
        path: relative(projectRoot, jsonPath).replace(/\\/g, '/'),
        label: 'Project Audit JSON',
        description: 'Structured project audit data for future real-agent workflows.',
      },
    ],
  }
}
