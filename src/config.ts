/**
 * config.ts — shared configuration constants
 *
 * Reads boss settings from office.config.json in the project root.
 * Users can customise their boss name, sprite, and colour there.
 */

import userConfig from '../office.config.example.json'

type UserConfig = {
  boss?: { name?: string; sprite?: string; color?: string; emoji?: string }
}

const config = userConfig as UserConfig

const bossName   = config.boss?.name   ?? 'Boss'
const bossSprite = config.boss?.sprite ?? 'Me-1'
const bossColor  = config.boss?.color  ?? '#ff4444'
const bossEmoji  = config.boss?.emoji  ?? '👑'

// The boss — always in the office
export const BOSS_CHAR = bossSprite
export const BOSS_ROLE = 'boss'
export const BOSS_NAME = bossName
export const BOSS_COLOR = bossColor
export const BOSS_EMOJI = bossEmoji

// Map agent roles to character sprite base names (in /sprites/characters/)
export const ROLE_TO_CHAR: Record<string, string> = {
  'boss':                  bossSprite,
  'assistant':             'builder-engineer-mono',
  'debugger':              'tester-field-tech-mono',
  'code-reviewer':         'coordinator-space',
  'frontend-developer':    'builder-engineer-mono',
  'fullstack-developer':   'builder-engineer-mono',
  'test-engineer':         'tester-field-tech-mono',
  'security-auditor':      'tester-field-tech-mono',
  'devops-engineer':       'builder-engineer-mono',
  'architect-reviewer':    'ward-commander-mono',
  'performance-engineer':  'tester-field-tech-mono',
  'database-architect':    'builder-engineer-mono',
  'typescript-pro':        'builder-engineer-mono',
  'ai-engineer':           'builder-engineer-mono',
  'prompt-engineer':       'archivist-career-agent-space',
  'idea-agent':            'coordinator-space',
  'builder-agent':         'builder-engineer-mono',
  'designer-agent':        'coordinator-space',
  'researcher-agent':      'archivist-career-agent-space',
  'tutor-agent':           'coordinator-space',
  'qa-agent':              'tester-field-tech-mono',
  'archivist-agent':       'archivist-career-agent-space',
  'launcher-agent':        'ward-commander-mono',
  'station-ops-captain':   'ward-commander-mono',
  'station-systems-engineer': 'builder-engineer-mono',
  'station-coordinator':   'coordinator-space',
  'station-mission-specialist': 'orbit-elegant-astronaut-1',
  'station-field-tech':    'tester-field-tech-mono',
  'general-purpose':       'coordinator-space',
  'Explore':               'archivist-career-agent-space',
  // MCPs
  'github':                'archivist-career-agent-space',
  'supabase':              'builder-engineer-mono',
  'playwright':            'tester-field-tech-mono',
  'chrome':                'tester-field-tech-mono',
  'memory':                'archivist-career-agent-space',
  'seo':                   'coordinator-space',
  'gmail':                 'archivist-career-agent-space',
  'ios-simulator':         'tester-field-tech-mono',
}
