export default function FrameworkResultsHub({
  clientName = "",
  analysisMeta = null,
  structuredAnalysis = null,
  deliverablesCount = 0,
  deliverablesLoading = false,
  onRefreshDeliverables,
  onRunAgain,
  onRunSavedIntake,
}) {
  const savedAnalysis = analysisMeta?.savedAnalysis
  const score = structuredAnalysis?.overall_score
  const confidence = structuredAnalysis?.confidence
  const headline = structuredAnalysis?.headline || "Ejecuta el framework para ver el diagnostico completo."

  return (
    <section className="glass-panel results-hub">
      <div className="panel-header">
        <div>
          <div className="panel-kicker">Framework intelligence</div>
          <div className="panel-title">Análisis y entregables</div>
        </div>
        <div className="dashboard-actions results-hub-actions">
          <button className="secondary-action" type="button" onClick={onRefreshDeliverables} disabled={!clientName}>
            {deliverablesLoading ? "Actualizando..." : "Actualizar"}
          </button>
          <button className="primary-action" type="button" onClick={onRunAgain} disabled={!clientName}>
            Ejecutar de nuevo
          </button>
          <button className="secondary-action" type="button" onClick={onRunSavedIntake} disabled={!clientName}>
            Usar intake guardado
          </button>
        </div>
      </div>

      <div className="results-hub-client">
        <span>Cliente activo</span>
        <strong>{clientName || "Sin cliente seleccionado"}</strong>
        <p>{headline}</p>
      </div>

      <div className="results-summary-grid">
        <div>
          <span>Score</span>
          <strong>{typeof score === "number" ? score : "--"}</strong>
        </div>
        <div>
          <span>Confianza</span>
          <strong>{typeof confidence === "number" ? `${confidence}%` : "--"}</strong>
        </div>
        <div>
          <span>Entregables</span>
          <strong>{deliverablesCount}</strong>
        </div>
        <div>
          <span>Memoria</span>
          <strong>{savedAnalysis?.latest ? "Guardada" : "Pendiente"}</strong>
        </div>
      </div>

      {savedAnalysis?.latest ? (
        <div className="results-save-path">
          <span>Ultimo analisis</span>
          <strong>{savedAnalysis.latest}</strong>
        </div>
      ) : null}
    </section>
  )
}
