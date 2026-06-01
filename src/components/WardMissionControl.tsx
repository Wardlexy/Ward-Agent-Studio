import React from 'react'
import type { MissionTask } from '../ops/types'
import { statusLabel } from '../ops/agentOps'
import { portfolioMissionTemplates, RECOMMENDED_STUDENT_TEMPLATE_ID } from '../portfolio/missionTemplates'

interface WardMissionControlProps {
  tasks: MissionTask[]
  onStartMission: (templateId: string) => void
  onOpenCaseStudy: () => void
  caseStudyReady: boolean
  onClose: () => void
}

const WardMissionControl: React.FC<WardMissionControlProps> = ({
  tasks,
  onStartMission,
  onOpenCaseStudy,
  caseStudyReady,
  onClose,
}) => {
  const activeTasks = tasks.filter(task => task.status !== 'done')
  const topTasks = activeTasks.slice(0, 2)
  const averageProgress = tasks.length
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0
  const activeTemplateIds = new Set(
    activeTasks
      .map(task => portfolioMissionTemplates.find(template => task.id.includes(template.id))?.id)
      .filter(Boolean) as string[],
  )
  const simpleTemplates = [
    RECOMMENDED_STUDENT_TEMPLATE_ID,
    'template-build-case-study',
    'template-cv-project-bullets',
  ]
    .map(id => portfolioMissionTemplates.find(template => template.id === id))
    .filter(Boolean) as typeof portfolioMissionTemplates
  const recommendedTemplate = simpleTemplates[0]

  return (
    <section className="ops-panel ward-mission-control" aria-label="Ward Mission Control">
      <header className="ops-panel-header ward-mission-header">
        <div>
          <div className="ops-kicker">Ward Agent Studio</div>
          <h2>Ward Mission Control</h2>
          <p className="ward-product-line">Student portfolio and career lab for turning Ward’s projects, learning, and internship prep into proof-of-work.</p>
        </div>
        <div className="ward-header-actions">
          <button
            className="ward-output-button"
            type="button"
            onClick={onOpenCaseStudy}
            aria-label="Open Portfolio Output Package"
          >
            {caseStudyReady ? 'Output Package' : 'Preview Package'}
          </button>
          <button className="ops-close" type="button" onClick={onClose} aria-label="Close Ward Mission Control">x</button>
        </div>
      </header>

      <div className="ward-mission-summary">
        <div>
          <span>Running Now</span>
          <strong>{activeTasks.length}</strong>
        </div>
        <div>
          <span>Package Progress</span>
          <strong>{averageProgress}%</strong>
        </div>
        <div>
          <span>Main Use</span>
          <strong>Student Portfolio</strong>
        </div>
      </div>

      <div className="ward-mission-scroll">
        <section className="ward-section ward-mission-guide ward-simple-hero">
          <div className="ward-section-heading">
            <span>Start Here</span>
            <h3>Pick one useful output</h3>
          </div>
          <p className="ward-section-note">
            If you are not sure what to do, start here. The agents will help choose which project is most worth polishing for your CV, GitHub, and portfolio.
          </p>
          {recommendedTemplate && (
            <button
              className="ward-primary-mission-button"
              type="button"
              disabled={activeTemplateIds.has(recommendedTemplate.id)}
              onClick={() => onStartMission(recommendedTemplate.id)}
            >
              {activeTemplateIds.has(recommendedTemplate.id) ? 'Project Audit Running' : 'Start Project Audit'}
            </button>
          )}
          <div className="ward-simple-steps">
            <span>1. Agents pick the best project</span>
            <span>2. Agents write the next step</span>
            <span>3. Output becomes CV / GitHub material</span>
          </div>
        </section>

        <section className="ward-section active-missions-section">
          <div className="ward-section-heading">
            <span>Now Working</span>
            <h3>Mission Progress</h3>
          </div>
          <div className="ward-active-list">
            {topTasks.length ? (
              topTasks.map(task => (
                <article key={task.id} className={`ward-active-card status-${task.status}`}>
                  <div className="ops-task-topline">
                    <strong>{task.title}</strong>
                    <span>{task.progress}%</span>
                  </div>
                  <p>{task.lastAction}</p>
                  <div className="ops-task-meta">
                    <span>{task.currentRoom.replace('-', ' ')}</span>
                    <span>{statusLabel(task.status)}</span>
                  </div>
                  <div className="ops-progress-track small">
                    <div className={`ops-progress-fill status-${task.status}`} style={{ width: `${task.progress}%` }} />
                  </div>
                </article>
              ))
            ) : (
              <article className="ward-active-card ward-empty-mission-card">
                <strong>No mission running yet</strong>
                <p>Start with Project Audit first. It is the clearest first step because it tells you which project to polish before doing anything else.</p>
                <button
                  className="ward-start-button"
                  type="button"
                  onClick={() => onStartMission(RECOMMENDED_STUDENT_TEMPLATE_ID)}
                >
                  Start Project Audit
                </button>
              </article>
            )}
          </div>
        </section>

        <section className="ward-section">
          <div className="ward-section-heading">
            <span>Simple Choices</span>
            <h3>3 Useful Missions</h3>
          </div>
          <div className="ward-simple-mission-grid">
            {simpleTemplates.map(template => (
              <article key={template.id} className={`ward-template-card priority-${template.priority}`}>
                <div className="ward-template-title">
                  <strong>{template.title}</strong>
                  <span>{template.priority}</span>
                </div>
                <p>{template.description}</p>
                <div className="ward-template-output">
                  <span>Result</span>
                  <strong>{template.expectedOutput}</strong>
                </div>
                <button
                  className="ward-start-button"
                  type="button"
                  disabled={activeTemplateIds.has(template.id)}
                  onClick={() => onStartMission(template.id)}
                >
                  {activeTemplateIds.has(template.id) ? 'Running' : 'Start'}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="ward-section ward-simple-help">
          <div className="ward-section-heading">
            <span>Meaning</span>
            <h3>What you get</h3>
          </div>
          <p><strong>Project Audit</strong> = choose the project that is most worth finishing.</p>
          <p><strong>Case Study</strong> = turn one project into a portfolio story.</p>
          <p><strong>CV Bullets</strong> = turn your project work into CV and internship lines.</p>
        </section>
      </div>
    </section>
  )
}

export default WardMissionControl
