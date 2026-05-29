export default function ClientWorkbench({
  clientName,
  setClientName,
  clientNotes,
  setClientNotes,
  instagram,
  setInstagram,
  links,
  setLinks,
  transcription,
  setTranscription,
  selectedFiles,
  setSelectedFiles,
  intakeStatus,
  loading,
  saving,
  onCreateClient,
  onSaveIntake,
  onExecuteFramework,
  onExecuteSavedIntake,
  isExistingClient,
  clientJustCreated,
  onBuildAdvancedOS,
}) {
  return (
    <section className="glass-panel client-workbench">
      <div className="workbench-head">
        <div>
          <div className="panel-kicker">Client Analysis Dashboard</div>
          <div className="panel-title">Nuevo cliente y fuentes</div>
        </div>
        <div className={clientName ? "workbench-status active" : "workbench-status"}>
          {clientName ? "Cliente en lectura" : "Sin cliente activo"}
        </div>
      </div>
      <div className="panel-copy">
        Carga contexto, señales y materiales. El framework convierte esa información en diagnóstico, memoria y entregables accionables.
      </div>

      <div className="form-grid">
        <label className="field-block">
          <span>Cliente</span>
          <input
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            placeholder="Ej: Miranda Experience"
          />
        </label>

        <label className="field-block">
          <span>Instagram</span>
          <input
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
            placeholder="@usuario o link"
          />
        </label>
      </div>

      <label className="field-block">
        <span>Links de investigacion</span>
        <textarea
          value={links}
          onChange={(event) => setLinks(event.target.value)}
          placeholder="Un link por linea"
          className="compact-area"
        />
      </label>

      <label className="field-block">
        <span>Transcripcion / notas de llamada</span>
        <textarea
          value={transcription}
          onChange={(event) => setTranscription(event.target.value)}
          placeholder="Pega aqui transcripciones, brief, notas de Zoom o insights del cliente."
        />
      </label>

      <label className="field-block">
        <span>Contexto estrategico</span>
        <textarea
          value={clientNotes}
          onChange={(event) => setClientNotes(event.target.value)}
          placeholder="Problema actual, percepcion deseada, publico, servicios, estilo visual."
          className="compact-area"
        />
      </label>

      <div className="upload-zone">
        <div>
          <strong>PDFs, capturas, materiales</strong>
          <span>{selectedFiles.length ? `${selectedFiles.length} archivo(s) listo(s)` : "Transcripciones, PDFs, logos, screenshots o referencias"}</span>
        </div>
        <input
          type="file"
          multiple
          onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
        />
      </div>

      <div className="dashboard-actions">
        <button className="secondary-action" onClick={onCreateClient} disabled={saving || loading || !clientName.trim()}>
          Crear cliente
        </button>
        <button className="secondary-action" onClick={onSaveIntake} disabled={saving || loading || !clientName.trim()}>
          Guardar fuentes
        </button>
        <button className="primary-action" onClick={onExecuteFramework} disabled={loading || saving || !clientName.trim()}>
          {loading ? "Analizando..." : (isExistingClient ? "Actualizar diagnóstico" : "Ejecutar framework")}
        </button>
        <button className="secondary-action" onClick={onExecuteSavedIntake} disabled={loading || saving || !clientName.trim()}>
          Ejecutar intake guardado
        </button>
      </div>

      {intakeStatus ? <div className="soft-status">{intakeStatus}</div> : null}

      {clientJustCreated && (
        <div style={{
          marginTop: "16px",
          padding: "16px 20px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))",
          border: "1px solid rgba(251,191,36,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.92rem", marginBottom: "4px" }}>
                Borrador básico — sin Advanced OS
              </div>
              <div style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                Este cliente fue creado como borrador. Todavía <strong>no tiene</strong> memoria de marca, Visual DNA Engine, Content Intelligence ni AI Agent OS. El Asesor de Entidad no podrá leer su estado real.
              </div>
            </div>
          </div>
          <button
            onClick={onBuildAdvancedOS}
            disabled={loading || saving}
            style={{
              alignSelf: "flex-start",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid rgba(251,191,36,0.5)",
              background: "rgba(251,191,36,0.15)",
              color: "#fbbf24",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,191,36,0.28)"; e.currentTarget.style.borderColor = "#fbbf24" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(251,191,36,0.15)"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)" }}
          >
            🚀 Construir Advanced OS
          </button>
        </div>
      )}
    </section>
  )
}
