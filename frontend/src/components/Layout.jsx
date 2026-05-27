import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

export default function Layout({ children, activeSection, accessMode = "developer", onSectionChange }) {
  return (
    <div className="layout-shell">
      <Sidebar activeSection={activeSection} accessMode={accessMode} onSectionChange={onSectionChange} />

      <main className="main-surface">
        <TopBar />
        {children}
      </main>
    </div>
  )
}
