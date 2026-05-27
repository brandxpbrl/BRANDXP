const scoreTone = (score = 0) => {
  if (score >= 78) return "strong"
  if (score >= 60) return "medium"
  return "critical"
}

export default function OutputPanel({ response, agents = [], analysisMeta, structuredAnalysis }) {
  const scorecard = structuredAnalysis?.scorecard || []
  const priorities = structuredAnalysis?.priorities || []
  const deliverables = structuredAnalysis?.deliverables || []
  const nextSprint = structuredAnalysis?.next_sprint || []
  const contentPillars = structuredAnalysis?.content_pillars || []
  const aiPrompts = structuredAnalysis?.ai_prompts || []

  return (
    <section className="glass-panel output-panel">
      <div className="panel-header">
        <div>
          <div className="panel-kicker">Sintesis del sistema</div>
          <div className="panel-title">Direccion estrategica</div>
        </div>

        {analysisMeta?.duration ? (
          <div className="status-pill">{(analysisMeta.duration / 1000).toFixed(1)}s</div>
        ) : null}
      </div>

      {analysisMeta?.provider ? (
        <div className="provider-row">
          <span>Proveedor activo: {analysisMeta.provider.active_provider || "sin datos"}</span>
          {analysisMeta.provider.fallback_used ? <span>Fallback Ollama usado</span> : null}
        </div>
      ) : null}

      {analysisMeta?.client ? (
        <div className="client-save-card">
          <div>
            <span>Cliente</span>
            <strong>{analysisMeta.client.name}</strong>
          </div>
          <div>
            <span>Estado</span>
            <strong>{analysisMeta.client.created ? "Creado" : "Actualizado"}</strong>
          </div>
          {analysisMeta.savedAnalysis?.latest ? (
            <div>
              <span>Memoria</span>
              <strong>Analisis guardado</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      {agents.length ? (
        <div className="agent-strip">
          {agents.map((agent) => (
            <span key={agent}>{agent}</span>
          ))}
        </div>
      ) : null}

      {structuredAnalysis ? (
        <div className="analysis-dashboard">
          <div className="decision-band">
            <div>
              <span>Resultado ejecutivo</span>
              <strong>{structuredAnalysis.headline}</strong>
            </div>
            <div className="score-lockup">
              <span>Score</span>
              <strong>{structuredAnalysis.overall_score}</strong>
            </div>
            <div className="score-lockup">
              <span>Confianza</span>
              <strong>{structuredAnalysis.confidence}%</strong>
            </div>
          </div>

          <div className="diagnosis-grid">
            <div>
              <span>Estado actual</span>
              <p>{structuredAnalysis.diagnosis?.current_state}</p>
            </div>
            <div>
              <span>Brecha principal</span>
              <p>{structuredAnalysis.diagnosis?.main_gap}</p>
            </div>
            <div>
              <span>Decision estrategica</span>
              <p>{structuredAnalysis.diagnosis?.strategic_decision}</p>
            </div>
          </div>

          {scorecard.length ? (
            <div className="scorecard-grid">
              {scorecard.map((item) => (
                <div className="score-card" key={item.key}>
                  <div className="score-card-header">
                    <span>{item.label}</span>
                    <strong className={`score-chip ${scoreTone(item.score)}`}>{item.score}</strong>
                  </div>
                  <div className="score-track">
                    <div style={{ width: `${item.score}%` }} />
                  </div>
                  <p>{item.action}</p>
                </div>
              ))}
            </div>
          ) : null}

          {priorities.length ? (
            <div className="priority-list">
              <div className="section-label">Prioridades</div>
              {priorities.map((priority) => (
                <div className="priority-row" key={priority.title}>
                  <span>{priority.urgency}</span>
                  <div>
                    <strong>{priority.title}</strong>
                    <p>{priority.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {deliverables.length ? (
            <div className="deliverable-output-grid">
              <div className="section-label">Entregables del sistema</div>
              {deliverables.map((deliverable) => (
                <div className="deliverable-output-card" key={deliverable.name}>
                  <strong>{deliverable.name}</strong>
                  <p>{deliverable.outcome}</p>
                  <ul>
                    {deliverable.actions.slice(0, 2).map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {contentPillars.length ? (
            <div className="pillar-grid">
              <div className="section-label">Sistema de contenido</div>
              {contentPillars.map((pillar) => (
                <div className="pillar-card" key={pillar.name}>
                  <strong>{pillar.name}</strong>
                  <p>{pillar.role}</p>
                </div>
              ))}
            </div>
          ) : null}

          {nextSprint.length ? (
            <div className="next-sprint">
              <div className="section-label">Sprint recomendado</div>
              <ol>
                {nextSprint.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          ) : null}

          {aiPrompts.length ? (
            <details className="prompt-details">
              <summary>Prompts IA listos</summary>
              <div>
                {aiPrompts.map((item) => (
                  <article key={item.name}>
                    <strong>{item.name}</strong>
                    <p>{item.prompt}</p>
                  </article>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      ) : null}

      <div className="response-text">
        {response || "..."}
      </div>

      {analysisMeta?.error ? (
        <div className="soft-warning">
          Estado tecnico: {analysisMeta.error}
        </div>
      ) : null}

      {analysisMeta?.providerErrors?.length ? (
        <div className="soft-warning">
          Fallback activado: {analysisMeta.providerErrors[0]}
        </div>
      ) : null}
    </section>
  )
}
