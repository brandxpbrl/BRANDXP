import { useEffect, useState } from "react"

const INITIAL_FORM = {
  brand: "",
  video_objective: "",
  central_message: "",
  main_emotion: "",
  audience: "",
  visual_aesthetic: "",
  duration: "32",
  platform: "Instagram Reels",
  final_cta: "",
}

const FIELD_LABELS = {
  brand: "Marca",
  video_objective: "Objetivo del video",
  central_message: "Mensaje central",
  main_emotion: "Emocion principal",
  audience: "Publico",
  visual_aesthetic: "Estetica visual",
  duration: "Duracion",
  platform: "Plataforma",
  final_cta: "CTA final",
}

export default function CinematicCampaignBuilder({
  clientName = "",
  apiUrl = "",
  onGenerated,
}) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefMessage, setBriefMessage] = useState("")
  const [briefSource, setBriefSource] = useState("")
  const [result, setResult] = useState(null)
  const [copiedScene, setCopiedScene] = useState("")

  useEffect(() => {
    if (!clientName) return

    setForm((current) => ({
      ...current,
      brand: current.brand || clientName,
    }))
  }, [clientName])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const loadRecommendedBrief = async () => {
    if (!clientName.trim()) {
      setError("Selecciona un cliente activo.")
      return
    }

    setBriefLoading(true)
    setError("")
    setBriefMessage("")
    setBriefSource("")

    try {
      const response = await fetch(`${apiUrl}/api/clients/${encodeURIComponent(clientName)}/cinematic-campaigns/recommended-brief`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo leer la campana recomendada.")
      }

      setForm((current) => ({
        ...current,
        brand: data.brand || current.brand || clientName,
        video_objective: data.video_objective || "",
        central_message: data.central_message || "",
        main_emotion: data.main_emotion || "",
        audience: data.audience || "",
        visual_aesthetic: data.visual_aesthetic || "",
        duration: data.duration ? String(data.duration) : "60",
        platform: data.platform || "Instagram Reels 9:16",
        final_cta: data.final_cta || "",
      }))
      setBriefMessage(data.message || "Brief cargado. Puedes editarlo antes de generar prompts.")
      setBriefSource(data.source || "")
    } catch (err) {
      setError(err.message)
    } finally {
      setBriefLoading(false)
    }
  }

  const generateCampaign = async (event) => {
    event.preventDefault()

    if (!clientName.trim()) {
      setError("Selecciona un cliente activo.")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Construyendo campana cinematografica...")
    setCopiedScene("")

    try {
      const response = await fetch(`${apiUrl}/api/clients/${encodeURIComponent(clientName)}/cinematic-campaigns/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo generar la campana.")
      }

      setResult(data)
      setStatus("Campana guardada en cinematic_campaigns.")
      onGenerated?.(data)
    } catch (err) {
      setError(err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  const copyPrompt = async (scene) => {
    try {
      await navigator.clipboard.writeText(scene.veo_prompt)
      setCopiedScene(String(scene.number))
    } catch {
      setCopiedScene("error")
    }
  }

  const campaign = result?.campaign
  const scenes = campaign?.scenes || []

  return (
    <section className="cinematic-builder">
      <div className="glass-panel cinematic-builder-hero">
        <div>
          <div className="panel-kicker">Cinematic Campaign Builder</div>
          <div className="panel-title">Campanas optimizadas para Veo</div>
          <p>
            Convierte una idea simple en escenas verticales de 8 segundos, listas para producir con direccion cinematografica.
          </p>
        </div>
        <div className="cinematic-specs">
          <span>9:16</span>
          <span>Escenas 8s</span>
          <span>Sin texto</span>
          <span>Veo prompts</span>
        </div>
      </div>

      <form className="glass-panel cinematic-builder-form" onSubmit={generateCampaign}>
        <div className="portal-section-header">
          <div>
            <div className="panel-kicker">Brief creativo</div>
            <div className="panel-title">Idea base</div>
          </div>
          <span className={clientName ? "portal-status completed" : "portal-status pending"}>
            {clientName || "Sin cliente"}
          </span>
        </div>

        <div className="cinematic-form-grid">
          {Object.entries(FIELD_LABELS).map(([field, label]) => (
            <label className={field === "central_message" || field === "visual_aesthetic" ? "field-block wide" : "field-block"} key={field}>
              <span>{label}</span>
              {field === "central_message" || field === "visual_aesthetic" ? (
                <textarea
                  className="compact-area"
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  placeholder={field === "central_message" ? "Ej: Brasil vivido con intencion." : "Ej: dark luxury tropical, golden hour, cinematic realism."}
                />
              ) : (
                <input
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  placeholder={field === "duration" ? "32" : label}
                />
              )}
            </label>
          ))}
        </div>

        <div className="dashboard-actions">
          <button className="secondary-action" type="button" onClick={loadRecommendedBrief} disabled={briefLoading || loading || !clientName.trim()}>
            {briefLoading ? "Leyendo analisis..." : "Usar campana recomendada por el analisis"}
          </button>
          <button className="primary-action" type="submit" disabled={loading || !clientName.trim()}>
            {loading ? "Generando..." : "Generar campana Veo"}
          </button>
        </div>

        {briefMessage ? (
          <p className="soft-status">
            {briefMessage}
            {briefSource ? ` Fuente: ${briefSource}` : ""}
          </p>
        ) : null}
        {status ? <p className="soft-status">{status}</p> : null}
        {error ? <p className="soft-warning">{error}</p> : null}
      </form>

      {campaign ? (
        <section className="glass-panel cinematic-output">
          <div className="portal-section-header">
            <div>
              <div className="panel-kicker">Resultado</div>
              <div className="panel-title">Campana cinematografica</div>
            </div>
            <span className="portal-count">{scenes.length} escenas</span>
          </div>

          <div className="cinematic-summary-grid">
            <article>
              <span>Concepto</span>
              <p>{campaign.concept}</p>
            </article>
            <article>
              <span>Direccion creativa</span>
              <p>{campaign.creative_direction_note}</p>
            </article>
          </div>

          <div className="cinematic-structure">
            <span>Estructura narrativa</span>
            {(campaign.narrative_structure || []).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="cinematic-scene-list">
            {scenes.map((scene) => (
              <article className="cinematic-scene-card" key={scene.number}>
                <div className="cinematic-scene-head">
                  <div>
                    <span>Escena {scene.number} / {scene.duration_seconds}s</span>
                    <strong>{scene.title}</strong>
                  </div>
                  <button className="secondary-action" type="button" onClick={() => copyPrompt(scene)}>
                    {copiedScene === String(scene.number) ? "Copiado" : "Copiar prompt"}
                  </button>
                </div>

                <p className="cinematic-role">{scene.narrative_role}</p>
                <pre className="cinematic-prompt">{scene.veo_prompt}</pre>

                <div className="cinematic-edit-text">
                  <span>Texto para CapCut/Premiere</span>
                  <p>{scene.edit_text || "Sin texto sugerido para esta escena."}</p>
                </div>
              </article>
            ))}
          </div>

          {result.files?.length ? (
            <div className="results-save-path">
              <span>Archivos guardados</span>
              <strong>{result.files.join(" | ")}</strong>
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  )
}
