const defaultSteps = [
  "Carga semantica",
  "Alineacion de identidad",
  "Pensamiento multiagente",
  "Sintesis creativa",
  "Acciones recomendadas",
]

export default function ThinkingFlow({ loading, steps = [] }) {
  const visibleSteps = steps.length ? steps : defaultSteps

  return (
    <section className="glass-panel">
      <div className="panel-kicker">Flujo cognitivo</div>
      <div className="panel-title">Motor de analisis</div>

      <div className="flow-list">
        {visibleSteps.map((step, index) => (
          <div className="flow-item" key={`${step}-${index}`}>
            <div className={loading ? "flow-dot active" : "flow-dot"} />
            <div>
              <div className="flow-label">{step}</div>
              <div className="flow-caption">
                {loading ? "En progreso" : index === visibleSteps.length - 1 ? "Listo para continuar" : "Preparado"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
