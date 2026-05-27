export default function ClientMemoryPanel({ clients = [], activeClient, onSelectClient }) {
  return (
    <section className="glass-panel">
      <div className="panel-kicker">Clientes activos</div>
      <div className="panel-title">Memoria</div>
      <div className="client-list">
        {clients.slice(0, 8).map((client) => (
          <button
            key={client.name}
            className={activeClient?.name === client.name ? "client-row active" : "client-row"}
            onClick={() => onSelectClient(client.name)}
          >
            <span>{client.name}</span>
            <small>{client.profile?.client_info?.status || "Discovery"}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
