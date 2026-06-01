import React, { useMemo, useState } from 'react'
import type { Agent } from '../types'
import { AGENT_CONFIGS } from '../types'
import type { MissionTask } from '../ops/types'
import { getTaskForAgent, statusLabel } from '../ops/agentOps'
import { ROLE_TO_CHAR } from '../config'
import { getSpritePath, useTheme } from '../theme'
import type { RoomId } from '../rooms'

export type TerminalTarget = 'broadcast' | string

export interface AgentTerminalLine {
  id: number
  agentId: string
  author: 'user' | 'agent' | 'system'
  text: string
  timestamp: string
}

interface AgentTerminalsProps {
  agents: Agent[]
  tasks: MissionTask[]
  currentRoom: RoomId
  lines: AgentTerminalLine[]
  activeTarget: TerminalTarget
  onActiveTargetChange: (target: TerminalTarget) => void
  onSend: (target: TerminalTarget, text: string) => void
  onClose: () => void
}

function getAvatarSrc(role: string, agentId: string): string {
  const charBase = ROLE_TO_CHAR[role] ?? 'coordinator-space'
  return getSpritePath(agentId, role, charBase, 'front-right')
}

const AgentTerminals: React.FC<AgentTerminalsProps> = ({
  agents,
  tasks,
  currentRoom,
  lines,
  activeTarget,
  onActiveTargetChange,
  onSend,
  onClose,
}) => {
  const theme = useTheme()
  void theme
  const [draft, setDraft] = useState('')

  const orderedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      if (a.room === currentRoom && b.room !== currentRoom) return -1
      if (a.room !== currentRoom && b.room === currentRoom) return 1
      return a.name.localeCompare(b.name)
    })
  }, [agents, currentRoom])

  const activeAgent = activeTarget === 'broadcast'
    ? null
    : orderedAgents.find(agent => agent.id === activeTarget) ?? null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onSend(activeTarget, trimmed)
    setDraft('')
  }

  return (
    <section className="ops-panel agent-terminals" aria-label="Agent terminals">
      <header className="ops-panel-header terminal-header">
        <div>
          <div className="ops-kicker">Agent Terminals</div>
          <h2>{orderedAgents.length} live sessions</h2>
        </div>
        <button className="ops-close" type="button" onClick={onClose} aria-label="Close agent terminals">x</button>
      </header>

      <div className="terminal-target-row" aria-label="Terminal target">
        <button
          type="button"
          className={`terminal-target ${activeTarget === 'broadcast' ? 'active' : ''}`}
          onClick={() => onActiveTargetChange('broadcast')}
        >
          Broadcast
        </button>
        {orderedAgents.slice(0, 10).map(agent => (
          <button
            key={agent.id}
            type="button"
            className={`terminal-target ${activeTarget === agent.id ? 'active' : ''}`}
            onClick={() => onActiveTargetChange(agent.id)}
            title={agent.name}
          >
            {agent.name}
          </button>
        ))}
      </div>

      <div className="terminal-grid">
        {orderedAgents.slice(0, 9).map(agent => {
          const cfg = AGENT_CONFIGS[agent.role] ?? AGENT_CONFIGS.default
          const task = getTaskForAgent(agent, tasks)
          const status = task?.status ?? (agent.state === 'working' ? 'coding' : 'idle')
          const agentLines = lines.filter(line => line.agentId === agent.id).slice(-5)
          const selected = activeTarget === agent.id

          return (
            <article key={agent.id} className={`terminal-card ${selected ? 'selected' : ''}`}>
              <button
                type="button"
                className="terminal-card-hit"
                onClick={() => onActiveTargetChange(agent.id)}
                aria-label={`Select ${agent.name}`}
              />
              <div className="terminal-card-head">
                <img src={getAvatarSrc(agent.role, agent.id)} alt="" className="terminal-avatar" />
                <div>
                  <strong>{agent.name}</strong>
                  <span>{cfg.title} / {agent.room}</span>
                </div>
                <em className={`terminal-status status-${status}`}>{statusLabel(status)}</em>
              </div>
              <div className="terminal-task-line">
                {task ? task.title : agent.task ?? 'Standing by'}
              </div>
              <div className="terminal-line-list">
                {agentLines.length === 0 ? (
                  <p className="terminal-empty">&gt; waiting for instructions</p>
                ) : agentLines.map(line => (
                  <p key={line.id} className={`terminal-line ${line.author}`}>
                    <span>{line.author === 'user' ? 'ward' : agent.name.toLowerCase()}:</span> {line.text}
                  </p>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <form className="terminal-compose" onSubmit={handleSubmit}>
        <label>
          {activeAgent ? `To ${activeAgent.name}` : 'Broadcast to visible crew'}
        </label>
        <div>
          <input
            type="text"
            value={draft}
            onChange={event => setDraft(event.target.value)}
            placeholder="Ask agents what to do next..."
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </section>
  )
}

export default AgentTerminals
