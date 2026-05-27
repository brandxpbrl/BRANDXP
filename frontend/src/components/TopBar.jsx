export default function TopBar() {
  return (
    <header className="topbar">
      <div>
        <h1>Creative Command Center</h1>
        <div className="topbar-copy">
          Sistema vivo para leer marcas, activar agentes y transformar contexto en entregables observables.
        </div>
      </div>

      <div className="topbar-actions">
        <div className="status-pill">Live OS</div>
        <div className="status-pill soft">Gemini</div>
      </div>
    </header>
  )
}
