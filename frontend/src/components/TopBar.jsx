export default function TopBar() {
  return (
    <header className="topbar">
      <div>
        <h1 translate="no">Brand Experience OS</h1>
        <div className="topbar-copy">
          Centro de inteligencia creativa para leer marcas, activar agentes y convertir estrategia en entregables observables.
        </div>
      </div>

      <div className="topbar-actions">
        <div className="status-pill">Sistema online</div>
        <div className="status-pill soft">Gemini AI</div>
      </div>
    </header>
  )
}
