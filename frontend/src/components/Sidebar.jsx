export default function Sidebar({ activeSection = "panel", onSectionChange }) {
  const items = [
    { id: "panel", label: "Panel", target: "framework" },
    { id: "engine", label: "Motor cognitivo", target: "results" },
    { id: "entities", label: "Entidades", target: "results" },
    { id: "client_portal", label: "Portal del Cliente", target: "portal" },
    { id: "client_chat", label: "Chat operativo", target: "client_chat" },
    { id: "memory", label: "Nucleo de memoria", target: "results" },
    { id: "entity_bible", label: "Biblia de la Entidad", target: "results" },
    { id: "visual_ai", label: "IA visual", target: "results" },
    { id: "strategy", label: "Estudio de estrategia", target: "framework" },
    { id: "analytics", label: "Analitica", target: "results" },
    { id: "exports", label: "Exportaciones", target: "results" },
  ]

  return (
    <aside className="sidebar">
      <div>
        <div className="brand-lockup">
          <div className="brand-title" translate="no">
            BRAND EXPERIENCE
          </div>
          <div className="brand-subtitle" translate="no">
            Creative Intelligence OS
          </div>
        </div>

        <nav className="nav-list">
          {items.map((item) => (
            <button
              className={activeSection === item.id ? "nav-item active" : "nav-item"}
              key={item.id}
              type="button"
              onClick={() => onSectionChange?.(item)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="operator-card">
        <span>Modo</span>
        Brand Architect
      </div>
    </aside>
  )
}
