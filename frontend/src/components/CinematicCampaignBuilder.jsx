import { useEffect, useState } from "react"

const INITIAL_FORM = {
  brand: "",
  video_objective: "",
  central_message: "",
  main_emotion: "",
  audience: "",
  visual_aesthetic: "",
  duration: "64",
  platform: "Instagram Reels 9:16",
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

const INTELLIGENCE_LABELS = {
  brand_objective: "Brand Objective",
  brand_type: "Brand Type",
  aesthetic_identity: "Aesthetic Identity",
  core_concept: "Core Concept",
  audience: "Audience",
  main_emotion: "Main Emotion",
  differentiator: "Differentiator",
  recommended_visual_direction: "Recommended Visual Direction",
  campaign_message: "Campaign Message",
}

const AUDIT_LABELS = {
  model_interpretation: "Model Interpretation",
  clarity_analysis: "Clarity Analysis",
  critical_risks: "Critical Risks",
  technical_optimization: "Technical Optimization",
  format_validation: "Format Validation",
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
  const [briefIntelligence, setBriefIntelligence] = useState(null)
  const [savedCampaigns, setSavedCampaigns] = useState(null)
  const [savedCampaignsLoading, setSavedCampaignsLoading] = useState(false)
  const [savedCampaignsError, setSavedCampaignsError] = useState("")
  const [result, setResult] = useState(null)
  const [copiedScene, setCopiedScene] = useState("")

  useEffect(() => {
    if (!clientName) return

    setForm((current) => ({
      ...current,
      brand: current.brand || clientName,
    }))
  }, [clientName])

  const loadSavedCampaigns = async () => {
    if (!clientName.trim()) {
      setSavedCampaigns(null)
      return
    }

    setSavedCampaignsLoading(true)
    setSavedCampaignsError("")

    try {
      const response = await fetch(`${apiUrl}/api/clients/${encodeURIComponent(clientName)}/cinematic-campaigns`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "No se pudieron cargar las campanas generadas.")
      }

      setSavedCampaigns(data)
    } catch (err) {
      setSavedCampaigns(null)
      setSavedCampaignsError(err.message)
    } finally {
      setSavedCampaignsLoading(false)
    }
  }

  useEffect(() => {
    loadSavedCampaigns()
  }, [clientName, apiUrl])

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
    setBriefIntelligence(null)

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
        duration: data.duration ? String(data.duration) : "64",
        platform: data.platform || "Instagram Reels 9:16",
        final_cta: data.final_cta || "",
      }))
      setBriefIntelligence(data.campaign_intelligence_summary || null)
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
    setStatus("Construyendo campana cinematografica V2...")
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
      setStatus("Campana V2 guardada en cinematic_campaigns.")
      await loadSavedCampaigns()
      onGenerated?.(data)
    } catch (err) {
      setError(err.message)
      setStatus("")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (value, copiedValue) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedScene(copiedValue)
    } catch {
      setCopiedScene("error")
    }
  }

  const copyPrompt = (scene) => {
    copyToClipboard(scene.veo_prompt || "", String(scene.number))
  }

  const copyAllPrompts = () => {
    const text = scenes
      .map((scene) => `Scene ${String(scene.number).padStart(2, "0")}\n${scene.veo_prompt}`)
      .join("\n\n")
    copyToClipboard(text, "all-prompts")
  }

  const copyEditingText = () => {
    const text = scenes
      .map((scene) => `Scene ${String(scene.number).padStart(2, "0")}: ${scene.editing_text || scene.edit_text || ""}`)
      .join("\n")
    copyToClipboard(text, "editing-text")
  }

  const campaign = result?.campaign
  const scenes = campaign?.scenes || []
  const generatedCampaigns = savedCampaigns?.items || []
  const intelligence = campaign?.campaign_intelligence_summary || briefIntelligence
  const structure = campaign?.narrative_structure || []

  const structureItem = (item, index) => {
    if (typeof item === "string") {
      return {
        scene_number: index + 1,
        scene_title: `Scene ${String(index + 1).padStart(2, "0")}`,
        purpose: item,
        meaning: item,
      }
    }

    return {
      scene_number: item?.scene_number || index + 1,
      scene_title: item?.scene_title || item?.title || `Scene ${String(index + 1).padStart(2, "0")}`,
      purpose: item?.purpose || "",
      meaning: item?.meaning || item?.narrative_meaning || "",
    }
  }

  return (
    <section className="cinematic-builder">
      <div className="glass-panel cinematic-builder-hero">
        <div>
          <div className="panel-kicker">Cinematic Campaign Builder V2</div>
          <div className="panel-title">Campanas auditadas para Veo</div>
          <p>
            Transforma la inteligencia estrategica del framework en escenas verticales, auditadas como AI Video Engineer y listas para producir en Veo.
          </p>
        </div>
        <div className="cinematic-specs">
          <span>9:16</span>
          <span>8 escenas</span>
          <span>AI audit</span>
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
                  placeholder={field === "duration" ? "64" : label}
                />
              )}
            </label>
          ))}
        </div>

        <div className="dashboard-actions">
          <button className="secondary-action" type="button" onClick={loadRecommendedBrief} disabled={briefLoading || loading || !clientName.trim()}>
            {briefLoading ? "Leyendo analisis..." : "Usar campaña recomendada por el análisis"}
          </button>
          <button className="primary-action" type="submit" disabled={loading || !clientName.trim()}>
            {loading ? "Generando..." : "Generar campaña V2"}
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

      <section className="glass-panel cinematic-saved-campaigns">
        <div className="portal-section-header">
          <div>
            <div className="panel-kicker">Campañas generadas</div>
            <div className="panel-title">Historial cinematográfico</div>
          </div>
          <div className="dashboard-actions compact-actions">
            <span className="portal-count">{generatedCampaigns.length} guardadas</span>
            <button className="secondary-action" type="button" onClick={loadSavedCampaigns} disabled={savedCampaignsLoading || !clientName.trim()}>
              {savedCampaignsLoading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {savedCampaignsError ? <p className="soft-warning">{savedCampaignsError}</p> : null}
        {!savedCampaignsLoading && !generatedCampaigns.length ? (
          <p className="muted-copy">Todavia no hay campanas cinematicas generadas para este cliente.</p>
        ) : null}

        {generatedCampaigns.length ? (
          <div className="cinematic-campaign-grid">
            {generatedCampaigns.map((item) => (
              <article className={item.is_latest ? "cinematic-campaign-card latest" : "cinematic-campaign-card"} key={item.relative_path}>
                <div className="cinematic-campaign-card-head">
                  <span>{item.is_latest ? "Ultima version" : "Historial"}</span>
                  <strong>{item.label}</strong>
                </div>
                <p>{item.concept || "Campana guardada sin resumen disponible."}</p>
                <div className="cinematic-campaign-meta">
                  <span>{item.scenes_count || 0} escenas</span>
                  <span>{item.generated_at || item.modified_at}</span>
                </div>
                <small>{item.relative_path}</small>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {intelligence ? (
        <section className="glass-panel cinematic-output">
          <div className="portal-section-header">
            <div>
              <div className="panel-kicker">Campaign Summary</div>
              <div className="panel-title">Inteligencia cinematográfica</div>
            </div>
            {campaign ? <span className="portal-count">{scenes.length} escenas</span> : null}
          </div>

          <div className="cinematic-intelligence-grid">
            {Object.entries(INTELLIGENCE_LABELS).map(([key, label]) => (
              <article key={key}>
                <span>{label}</span>
                <p>{intelligence[key] || "Pendiente de lectura."}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {campaign ? (
        <section className="glass-panel cinematic-output">
          <div className="portal-section-header">
            <div>
              <div className="panel-kicker">Resultado V2</div>
              <div className="panel-title">Campaña cinematográfica</div>
            </div>
            <div className="dashboard-actions compact-actions">
              <button className="secondary-action" type="button" onClick={copyAllPrompts}>
                {copiedScene === "all-prompts" ? "Copied" : "Copy All Prompts"}
              </button>
              <button className="secondary-action" type="button" onClick={copyEditingText}>
                {copiedScene === "editing-text" ? "Copied" : "Copy Editing Text"}
              </button>
            </div>
          </div>

          <div className="cinematic-summary-grid">
            <article>
              <span>Campaign Concept</span>
              <p>{campaign.concept}</p>
            </article>
            <article>
              <span>Director Notes</span>
              <p>{campaign.director_notes || campaign.creative_direction_note}</p>
            </article>
          </div>

          <div className="cinematic-structure">
            <span>Narrative Structure</span>
            {(structure || []).map((item, index) => {
              const normalized = structureItem(item, index)

              return (
                <article className="cinematic-structure-step" key={`${normalized.scene_number}-${normalized.scene_title}`}>
                  <strong>Scene {String(normalized.scene_number).padStart(2, "0")} — {normalized.scene_title}</strong>
                  <p>{normalized.purpose}</p>
                  {normalized.meaning ? <small>{normalized.meaning}</small> : null}
                </article>
              )
            })}
          </div>

          <div className="cinematic-scene-list">
            {scenes.map((scene) => {
              const audit = scene.ai_engineer_audit || {}

              return (
                <article className="cinematic-scene-card" key={scene.number}>
                  <div className="cinematic-scene-head">
                    <div>
                      <span>Scene {String(scene.number).padStart(2, "0")} / {scene.duration_seconds}s</span>
                      <strong>{scene.scene_title || scene.title}</strong>
                    </div>
                    <button className="secondary-action" type="button" onClick={() => copyPrompt(scene)}>
                      {copiedScene === String(scene.number) ? "Copied" : "Copy Scene Prompt"}
                    </button>
                  </div>

                  <p className="cinematic-role">{scene.summary || scene.narrative_purpose}</p>

                  <div className="cinematic-audit-grid">
                    {Object.entries(AUDIT_LABELS).map(([key, label]) => (
                      <article key={key}>
                        <span>{label}</span>
                        <p>{audit[key] || "Audit pending."}</p>
                      </article>
                    ))}
                  </div>

                  <div className="cinematic-prompt-block">
                    <span>Final Veo Prompt</span>
                    <pre className="cinematic-prompt">{scene.veo_prompt}</pre>
                  </div>

                  <div className="cinematic-edit-text">
                    <span>Editing Text</span>
                    <p>{scene.editing_text || scene.edit_text || "Sin texto sugerido para esta escena."}</p>
                  </div>
                </article>
              )
            })}
          </div>

          {campaign.final_editing_guide ? (
            <div className="cinematic-structure">
              <span>Final Editing Guide</span>
              <p>{campaign.final_editing_guide}</p>
            </div>
          ) : null}

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
