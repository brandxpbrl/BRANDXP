import React, { useState, useEffect } from "react"

export default function OnboardingWizard({ apiUrl, onComplete, onLoadClients }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form Fields
  const [clientName, setClientName] = useState("")
  const [category, setCategory] = useState("default")
  const [instagram, setInstagram] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [links, setLinks] = useState("")
  const [notes, setNotes] = useState("")
  const [transcription, setTranscription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])

  // Job status
  const [jobId, setJobId] = useState("")
  const [jobStatus, setJobStatus] = useState(null)

  // Status Polling
  useEffect(() => {
    if (!jobId) return

    let isMounted = true
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiUrl}/api/clients/onboard/status/${jobId}`)
        if (!res.ok) throw new Error("No se pudo obtener el estado del job.")
        const data = await res.json()

        if (isMounted) {
          setJobStatus(data)
          if (data.status === "COMPLETED" || data.status === "FAILED") {
            clearInterval(interval)
            setLoading(false)
            if (data.status === "COMPLETED" && onLoadClients) {
              onLoadClients()
            }
          }
        }
      } catch (err) {
        console.error("Error al consultar estado:", err)
      }
    }, 2000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [jobId, apiUrl])

  const handleNext = () => {
    if (step === 1 && !clientName.trim()) {
      setError("El nombre del cliente es obligatorio.")
      return
    }
    setError("")
    setStep(step + 1)
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError("")
    setStep(5)

    const linkList = links
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (websiteUrl.trim()) {
      linkList.unshift(websiteUrl.trim())
    }

    const payload = {
      client_name: clientName.trim(),
      category: category.trim() || "default",
      instagram: instagram.trim() || null,
      links: linkList,
      transcription: transcription.trim() || null,
      notes: notes.trim() || null,
    }

    try {
      const res = await fetch(`${apiUrl}/api/clients/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail?.result?.error || data.detail || "Error al iniciar onboarding.")
      }

      setJobId(data.job_id)
      setJobStatus(data)

      // Handle optional file uploads if any files were selected
      if (selectedFiles.length) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append("category", file.type.includes("pdf") ? "Material_Actual" : "Instagram_Actual")
          formData.append("file", file)

          await fetch(`${apiUrl}/clients/${encodeURIComponent(clientName.trim())}/uploads`, {
            method: "POST",
            body: formData,
          })
        }
      }
    } catch (err) {
      setError(err.message)
      setJobStatus({
        status: "FAILED",
        result: { error: err.message },
      })
      setLoading(false)
    }
  }

  const resetWizard = () => {
    setStep(1)
    setClientName("")
    setCategory("default")
    setInstagram("")
    setWebsiteUrl("")
    setLinks("")
    setNotes("")
    setTranscription("")
    setSelectedFiles([])
    setJobId("")
    setJobStatus(null)
    setError("")
    setLoading(false)
  }

  const getEngineProgressIcon = (engineState) => {
    if (!jobStatus) return "○"
    if (jobStatus.status === "COMPLETED") return "✓"
    if (jobStatus.status === "FAILED") return "✕"
    if (engineState === "COMPLETED") return "✓"
    if (engineState === "FAILED") return "✕"
    return "⚡"
  }

  return (
    <section className="glass-panel onboarding-wizard-panel">
      {/* Wizard Header */}
      <div className="workbench-head">
        <div>
          <div className="panel-kicker">Advanced OS Orchestration</div>
          <div className="panel-title">Asistente de Onboarding Automático</div>
        </div>
        <div className="status-pill soft">
          {step < 5 ? `Paso ${step} de 4` : jobStatus?.status || "Iniciando..."}
        </div>
      </div>

      <div className="panel-copy">
        Registra nuevos clientes y genera de forma secuencial su identidad base, memoria cognitiva y motores avanzados de IA con rollback automático en caso de fallos.
      </div>

      {/* Progress Bar */}
      {step <= 4 && (
        <div style={{ display: "flex", gap: "8px", margin: "16px 0", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${(step / 4) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--pink), var(--cyan))", transition: "width 0.3s ease" }} />
        </div>
      )}

      {error && (
        <div style={{ padding: "12px", background: "rgba(217, 66, 143, 0.15)", border: "1px solid var(--pink)", borderRadius: "8px", color: "#ffb7d7", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="new-client-intake">
          <div className="form-grid">
            <label className="field-block">
              <span>Nombre del Cliente / Marca *</span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Miranda Experience"
              />
            </label>

            <label className="field-block">
              <span>Categoría / Preset de Lujo</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "46px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(7, 10, 20, 0.82)",
                  color: "#ffffff",
                  outline: "none"
                }}
              >
                <option value="default">Sleek Corporate / Modern Premium</option>
                <option value="fashion">High-End Editorial / Minimalist Luxury</option>
                <option value="hospitality">Tropical Premium / Warm Luxury</option>
                <option value="wellness">Organic Minimal / Healing Sanctuary</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Sources */}
      {step === 2 && (
        <div className="new-client-intake">
          <div className="form-grid">
            <label className="field-block">
              <span>Link de Instagram</span>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/usuario"
              />
            </label>

            <label className="field-block">
              <span>Sitio Web Oficial</span>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://marca.com"
              />
            </label>
          </div>

          <label className="field-block">
            <span>Links Adicionales de Investigación</span>
            <textarea
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="Pega links externos, tableros de Pinterest, notas adicionales (un link por línea)"
              className="compact-area"
            />
          </label>
        </div>
      )}

      {/* Step 3: Project Info */}
      {step === 3 && (
        <div className="new-client-intake">
          <label className="field-block">
            <span>Contexto Estratégico y Notas de Marca</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Propósito, dolores, tensiones competitivas, público ideal..."
              style={{ minHeight: "100px" }}
            />
          </label>

          <label className="field-block">
            <span>Transcripción de Reunión o Zoom Briefing</span>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Pega la transcripción cruda de onboarding para la extracción contextual profunda de los agentes de IA."
              style={{ minHeight: "130px" }}
            />
          </label>

          <div className="upload-zone">
            <div>
              <strong>Materiales de Marca (Opcional)</strong>
              <span>{selectedFiles.length ? `${selectedFiles.length} archivo(s) listo(s)` : "Selecciona PDFs o referencias para la memoria cognitiva"}</span>
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
            />
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div style={{ display: "grid", gap: "16px", color: "rgba(255,255,255,0.85)" }}>
          <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#ffffff", fontSize: "16px", fontWeight: "bold" }}>Resumen del Intake</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 0", color: "var(--muted)", width: "160px" }}>Marca:</td>
                  <td style={{ padding: "6px 0", fontWeight: "bold" }}>{clientName}</td>
                </tr>
                <tr>
                  <td style={{ padding: "6px 0", color: "var(--muted)" }}>Preset de Lujo:</td>
                  <td style={{ padding: "6px 0" }}>{category}</td>
                </tr>
                {instagram && (
                  <tr>
                    <td style={{ padding: "6px 0", color: "var(--muted)" }}>Instagram:</td>
                    <td style={{ padding: "6px 0" }}>{instagram}</td>
                  </tr>
                )}
                {websiteUrl && (
                  <tr>
                    <td style={{ padding: "6px 0", color: "var(--muted)" }}>Sitio Web:</td>
                    <td style={{ padding: "6px 0" }}>{websiteUrl}</td>
                  </tr>
                )}
                {selectedFiles.length > 0 && (
                  <tr>
                    <td style={{ padding: "6px 0", color: "var(--muted)" }}>Archivos adjuntos:</td>
                    <td style={{ padding: "6px 0" }}>{selectedFiles.length} archivos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
            Al hacer clic en "Generar Cliente", el DCC clasificará la calidad del intake e iniciará la síntesis secuencial en backend.
          </p>
        </div>
      )}

      {/* Step 5: Generation Status & Completion */}
      {step === 5 && (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Status Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid rgba(69,198,246,0.18)", borderRadius: "8px", background: "rgba(69, 198, 246, 0.04)" }}>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted)" }}>Estado de Ejecución</div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: jobStatus?.status === "COMPLETED" ? "#9df7e6" : jobStatus?.status === "FAILED" ? "#ffb7d7" : "var(--cyan)" }}>
                {jobStatus?.status === "COMPLETED" ? "READY" : jobStatus?.status === "FAILED" ? "ERROR" : "PROCESANDO MOTORES..."}
              </div>
            </div>
            {jobStatus?.result?.classification && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted)" }}>Clasificación DCC</div>
                <div style={{ padding: "4px 10px", background: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {jobStatus.result.classification}
                </div>
              </div>
            )}
          </div>

          {/* Engine Generation Status Steps */}
          <div style={{ display: "grid", gap: "10px" }}>
            <h4 style={{ margin: "0", color: "#ffffff", fontSize: "15px", fontWeight: "bold" }}>Componentes de Advanced OS</h4>
            
            {/* 1. Intake score */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>Intake Quality Score</span>
              <strong style={{ color: "var(--cyan)" }}>
                {jobStatus?.result?.intake_quality_score !== undefined ? `${jobStatus.result.intake_quality_score} pts` : "Evaluando..."}
              </strong>
            </div>

            {/* 2. Prompt Pack */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>Prompt Pack Generator (9 prompts)</span>
              <strong>
                {getEngineProgressIcon(jobStatus?.result?.prompt_pack?.status ? "COMPLETED" : "WAITING")}
              </strong>
            </div>

            {/* 3. Memory */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>Brand Memory Core</span>
              <strong>
                {getEngineProgressIcon(jobStatus?.result?.engines?.status?.brand_memory_core)}
              </strong>
            </div>

            {/* 4. Visual DNA */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>Visual DNA Engine</span>
              <strong>
                {getEngineProgressIcon(jobStatus?.result?.engines?.status?.visual_dna_engine)}
              </strong>
            </div>

            {/* 5. Content Intelligence */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>Content Intelligence Engine</span>
              <strong>
                {getEngineProgressIcon(jobStatus?.result?.engines?.status?.content_intelligence_engine)}
              </strong>
            </div>

            {/* 6. AI Agent OS */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>
              <span>AI Agent OS Builder</span>
              <strong>
                {getEngineProgressIcon(jobStatus?.result?.engines?.status?.ai_agent_os)}
              </strong>
            </div>
          </div>

          {/* Completion Details */}
          {jobStatus?.status === "COMPLETED" && (
            <div style={{ padding: "14px", border: "1px solid rgba(157, 247, 230, 0.16)", borderRadius: "8px", background: "rgba(157, 247, 230, 0.04)" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#9df7e6", marginBottom: "8px" }}>Onboarding Completado Exitosamente</div>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 8px 0" }}>
                Todos los motores de IA del cliente han sido inicializados. Los prompt packs y archivos de directrices correspondientes han sido persistidos.
              </p>
              <div style={{ fontSize: "12px", color: "var(--cyan)" }}>
                - Preset aplicado: {jobStatus.result.prompt_pack.preset_applied || "Multi-Agent Framework"}<br />
                - Archivos generados: {
                  (jobStatus.result.prompt_pack.created_files?.length || 0) +
                  Object.values(jobStatus.result.engines?.created_files || {}).reduce((acc, curr) => acc + (curr?.length || 0), 0)
                } archivos creados en el espacio del cliente.
              </div>
            </div>
          )}

          {jobStatus?.status === "FAILED" && (
            <div style={{ padding: "14px", border: "1px solid rgba(255, 102, 189, 0.2)", borderRadius: "8px", background: "rgba(255, 102, 189, 0.05)", color: "#ffb7d7", fontSize: "13px" }}>
              <strong>Error en la compilación:</strong>
              <div style={{ marginTop: "4px" }}>{jobStatus?.result?.error || "Error desconocido en el backend."}</div>
              {jobStatus?.result?.rollback_executed && (
                <div style={{ marginTop: "8px", fontSize: "11px", textTransform: "uppercase", color: "var(--pink)" }}>
                  Rollback transaccional ejecutado. Directorios parciales eliminados.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="dashboard-actions" style={{ marginTop: "24px" }}>
        {step > 1 && step < 5 && (
          <button className="secondary-action" onClick={handleBack} disabled={loading}>
            Atrás
          </button>
        )}
        {step < 4 && (
          <button className="primary-action" onClick={handleNext}>
            Siguiente
          </button>
        )}
        {step === 4 && (
          <button className="primary-action" onClick={handleGenerate} disabled={loading}>
            {loading ? "Iniciando..." : "Generar Cliente"}
          </button>
        )}
        {step === 5 && (jobStatus?.status === "COMPLETED" || jobStatus?.status === "FAILED") && (
          <button className="secondary-action" onClick={resetWizard}>
            Onboard Nuevo Cliente
          </button>
        )}
      </div>
    </section>
  )
}
