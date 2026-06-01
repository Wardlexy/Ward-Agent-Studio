import React from 'react'
import { wardAgentStudioCaseStudy } from '../portfolio/caseStudyData'
import type { PortfolioArtifactResult } from '../portfolio/types'

interface CaseStudyOutputProps {
  artifactResult?: PortfolioArtifactResult | null
  onClose: () => void
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="case-study-section">
      <h3>{title}</h3>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </section>
  )
}

const CaseStudyOutput: React.FC<CaseStudyOutputProps> = ({ artifactResult, onClose }) => {
  const data = wardAgentStudioCaseStudy

  return (
    <section className="ops-panel case-study-output" aria-label="Portfolio Case Study Output">
      <header className="ops-panel-header case-study-header">
        <div>
          <div className="ops-kicker">Portfolio Output</div>
          <h2>{artifactResult ? 'Generated Workspace Package' : 'Case Study Package'}</h2>
          <p>{artifactResult ? artifactResult.summary : data.pitch}</p>
        </div>
        <button className="ops-close" type="button" onClick={onClose} aria-label="Close case study output">x</button>
      </header>

      <div className="case-study-scroll">
        {artifactResult && (
          <section className="case-study-section case-study-artifacts">
            <h3>Real Files Written</h3>
            <p>{artifactResult.summary}</p>
            <div className="case-study-artifact-list">
              {artifactResult.artifacts.map(artifact => (
                <article key={artifact.path}>
                  <strong>{artifact.label}</strong>
                  <span>{artifact.path}</span>
                  <p>{artifact.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="case-study-hero">
          <span>Project Title</span>
          <strong>{data.projectTitle}</strong>
        </section>

        <div className="case-study-two-col">
          <section className="case-study-section">
            <h3>Problem</h3>
            <p>{data.problem}</p>
          </section>
          <section className="case-study-section">
            <h3>Solution</h3>
            <p>{data.solution}</p>
          </section>
        </div>

        <ListBlock title="Key Features" items={data.keyFeatures} />
        <ListBlock title="Tech Stack" items={data.techStack} />
        <ListBlock title="Screenshots Checklist" items={data.screenshotsChecklist} />
        <ListBlock title="Demo Flow" items={data.demoFlow} />

        <section className="case-study-section">
          <h3>GitHub README Section Draft</h3>
          {data.readmeDraft.map(item => <p key={item}>{item}</p>)}
        </section>

        <section className="case-study-section portfolio-card-copy">
          <h3>Portfolio Card Copy</h3>
          <strong>{data.portfolioCardCopy.title}</strong>
          <p>{data.portfolioCardCopy.description}</p>
          <div className="case-study-tags">
            {data.portfolioCardCopy.tags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
        </section>

        <ListBlock title="CV / Internship Bullets" items={data.recruiterBullets} />
        <ListBlock title="Roadmap / Next Improvements" items={data.roadmap} />
      </div>
    </section>
  )
}

export default CaseStudyOutput
