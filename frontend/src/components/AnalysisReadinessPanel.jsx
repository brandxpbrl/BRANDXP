const sourceLabels = {
  instagram: "Instagram actual",
  logo: "Logo actual",
  material: "Material actual",
  transcription: "Transcripcion de Zoom",
  notes: "Notas / contexto",
  links: "Links",
}

export default function AnalysisReadinessPanel({
  clientName,
  analysisPlan,
  loading,
  error,
  onCheck,
}) {
  const sources = analysisPlan?.sources || {}
  const availableSources = Object.entries(sources).filter(([, source]) => source.status === "available")
  const missingSources = analysisPlan?.missing_sources || []

  return (
    <section className="glass-panel">
      <div className="panel-header">
        <div>
          <div className="panel-kicker">Fuentes</div>
          <div className="panel-title">Preparacion del analisis</div>
        </div>

        <button className="secondary-action" onClick={onCheck} disabled={loading || !clientName.trim()}>
          {loading ? "Verificando..." : "Verificar fuentes"}
        </button>
      </div>

      {!clientName.trim() ? (
        <div className="panel-copy">
          Selecciona o crea un cliente para verificar fuentes.
        </div>
      ) : null}

      {error ? (
        <div className="soft-warning">
          {error}
        </div>
      ) : null}

      {analysisPlan ? (
        <div className="analysis-dashboard">
          <div className="decision-band">
            <div>
              <span>Estado</span>
              <strong>{analysisPlan.can_run ? "Listo para analizar" : "Faltan fuentes para analizar"}</strong>
            </div>
            <div className="score-lockup">
              <span>Confianza</span>
              <strong>{analysisPlan.confidence}</strong>
            </div>
            <div className="score-lockup">
              <span>Escritura</span>
              <strong>{analysisPlan.will_write_files ? "Si" : "No"}</strong>
            </div>
          </div>

          <div className="diagnosis-grid">
            <div>
              <span>Disponibles</span>
              <p>
                {availableSources.length
                  ? availableSources.map(([name, source]) => `${sourceLabels[name] || name}: ${source.items}`).join(", ")
                  : "Sin fuentes disponibles"}
              </p>
            </div>
            <div>
              <span>Faltantes</span>
              <p>
                {missingSources.length
                  ? missingSources.map((name) => sourceLabels[name] || name).join(", ")
                  : "No hay faltantes criticos detectados"}
              </p>
            </div>
            <div>
              <span>Cliente</span>
              <p>{analysisPlan.client}</p>
            </div>
          </div>

          {analysisPlan.pipeline?.length ? (
            <div className="next-sprint">
              <div className="section-label">Pipeline recomendado</div>
              <ol>
                {analysisPlan.pipeline.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ) : null}

          {analysisPlan.agents?.length ? (
            <div className="agent-strip">
              {analysisPlan.agents.map((agent) => (
                <span key={agent}>{agent}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
