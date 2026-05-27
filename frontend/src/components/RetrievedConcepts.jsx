const defaultConcepts = [
  "Brand Identity",
  "Strategic Clarity",
  "Visual Direction",
  "Narrative System",
  "Creative Opportunity",
]

export default function RetrievedConcepts({ concepts = [] }) {
  const visibleConcepts = concepts.length ? concepts : defaultConcepts

  return (
    <section className="glass-panel">
      <div className="panel-kicker">Conceptos recuperados</div>
      <div className="panel-title">Senales de marca</div>

      <div className="concept-list">
        {visibleConcepts.map((concept) => (
          <div className="concept-card" key={concept}>
            {concept}
          </div>
        ))}
      </div>
    </section>
  )
}
