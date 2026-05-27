export default function TopBar() {
  return (
    <header className="topbar">
      <div>
        <div className="topbar-eyebrow">Brand Experience</div>
        <h1>Creative Command Center</h1>
        <div className="topbar-copy">
          Sistema para descubrir identidad, organizar ideas y transformar vision en presencia real.
        </div>
      </div>

      <div className="topbar-actions">
        <div className="status-pill">Live v1.1</div>
        <button className="secondary-action">Bible Sync</button>
      </div>
    </header>
  )
}
