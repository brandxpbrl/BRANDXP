import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

export default function Layout({ children, activeSection, onSectionChange }) {
  return (
    <div className="layout-shell">
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />

      <main className="main-surface">
        <TopBar />
        {children}
      </main>
    </div>
  )
}
