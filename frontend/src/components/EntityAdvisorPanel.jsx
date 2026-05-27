import { useEffect, useRef, useState } from "react"

export default function EntityAdvisorPanel({
  advisorData,
  loading,
  error,
  apiUrl,
  clientName,
  onRefresh,
  onPrimaryAction,
  actionLoading,
  actionMessage,
  actionError,
  deliverablesReview,
  reviewLoading,
  reviewError,
  onOpenPortal,
}) {
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceReading, setVoiceReading] = useState(false)
  const [voiceScript, setVoiceScript] = useState("")
  const [voiceStatus, setVoiceStatus] = useState("")
  const [voiceError, setVoiceError] = useState("")
  const [conversationDraft, setConversationDraft] = useState("")
  const [conversationMessages, setConversationMessages] = useState([])
  const [conversationLoading, setConversationLoading] = useState(false)
  const [conversationError, setConversationError] = useState("")
  const [listening, setListening] = useState(false)
  const audioRef = useRef(null)
  const previewTimerRef = useRef(null)
  const recognitionRef = useRef(null)

  const defaultEntityAsset =
    "/creative-library/asset?path=02_Assets_Visuales%2FEntidad%2F762ae545-1c9a-42a1-9497-ea815042ce9b.mp4"
  const asset = advisorData?.assets?.find((item) => item.type === "video") || advisorData?.assets?.[0]
  const recommendation = advisorData?.recommendation
  const state = advisorData?.state || {}
  const entityState = advisorData?.entity_state || {}
  const reasoning = advisorData?.reasoning || {}
  const fluidMessages = advisorData?.fluid_messages || {}
  const scores = entityState?.scores || {}
  const signals = entityState?.signals || []
  const risks = entityState?.risks || []
  const opportunities = entityState?.opportunities || []
  const activeEngines = [
    ["Memoria", state.brand_memory_core],
    ["Visual DNA", state.visual_dna_engine],
    ["Contenido", state.content_intelligence_engine],
    ["Agent OS", state.ai_agent_os],
  ]

  const assetUrl = asset?.asset_url
    ? `${apiUrl}${asset.asset_url}`
    : `${apiUrl}${defaultEntityAsset}`

  const stopEntityVoice = () => {
    setVoiceReading(false)

    if (previewTimerRef.current) {
      window.clearTimeout(previewTimerRef.current)
      previewTimerRef.current = null
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  useEffect(() => {
    return () => stopEntityVoice()
  }, [])

  useEffect(() => {
    setConversationMessages([])
    setConversationDraft("")
    setConversationError("")
  }, [clientName])

  const speakPreview = (script) => {
    if (!("speechSynthesis" in window) || !script) {
      setVoiceReading(true)
      previewTimerRef.current = window.setTimeout(() => setVoiceReading(false), 5200)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(script.replaceAll("...", "."))
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice =
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("es")) || voices[0]

    if (spanishVoice) {
      utterance.voice = spanishVoice
    }

    utterance.lang = spanishVoice?.lang || "es-ES"
    utterance.rate = 0.82
    utterance.pitch = 0.92
    utterance.volume = 0.88
    utterance.onend = () => setVoiceReading(false)
    utterance.onerror = () => setVoiceReading(false)

    setVoiceReading(true)
    window.speechSynthesis.speak(utterance)
  }

  const playEntityVoice = async () => {
    if (!clientName || !recommendation) {
      setVoiceError("Selecciona un cliente con lectura disponible.")
      return
    }

    stopEntityVoice()
    setVoiceLoading(true)
    setVoiceError("")
    setVoiceStatus("Preparando voz de la Entidad...")

    try {
      const scriptRes = await fetch(`${apiUrl}/api/entity/voice-script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: clientName,
          advisor_message: recommendation.message,
          recommendation,
          state,
          next_best_action: {
            label: recommendation.next_action,
            action_key: recommendation.action_key,
          },
        }),
      })
      const scriptData = await scriptRes.json()

      if (!scriptRes.ok) {
        throw new Error(scriptData.detail || "No se pudo preparar el guion de voz.")
      }

      const script = scriptData.script || ""
      setVoiceScript(script)

      const voiceRes = await fetch(`${apiUrl}/api/entity/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: clientName,
          script,
        }),
      })
      const voiceData = await voiceRes.json()

      if (!voiceRes.ok || voiceData.status === "error") {
        throw new Error(voiceData.detail || "No se pudo generar la voz.")
      }

      setVoiceStatus(
        voiceData.status === "ready"
          ? "La entidad está leyendo..."
          : "Modo preview: voz simulada localmente."
      )

      if (voiceData.audio_url) {
        const audioUrl = voiceData.audio_url.startsWith("http")
          ? voiceData.audio_url
          : `${apiUrl}${voiceData.audio_url}`
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        audio.onended = () => setVoiceReading(false)
        audio.onerror = () => {
          setVoiceReading(false)
          setVoiceError("El audio no pudo reproducirse. Mostrando guion preview.")
        }
        setVoiceReading(true)
        await audio.play()
      } else {
        speakPreview(script)
      }
    } catch (err) {
      setVoiceError(err.message)
      setVoiceStatus("")
    } finally {
      setVoiceLoading(false)
    }
  }

  const speakEntityText = (text) => {
    setVoiceScript(text)
    setVoiceStatus("La entidad está leyendo...")
    stopEntityVoice()
    speakPreview(text)
  }

  const sendEntityConversation = async (messageOverride = "") => {
    const message = (messageOverride || conversationDraft).trim()

    if (!clientName || !message) {
      setConversationError("Selecciona un cliente y escribe una pregunta para la Entidad.")
      return
    }

    setConversationLoading(true)
    setConversationError("")
    setConversationMessages((items) => [
      ...items,
      {
        role: "user",
        content: message,
      },
    ])
    setConversationDraft("")

    try {
      const res = await fetch(`${apiUrl}/api/entity/conversation/${encodeURIComponent(clientName)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          mode: "internal",
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "La Entidad no pudo responder.")
      }

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        provider: data.provider,
      }
      setConversationMessages(data.history?.length ? data.history.slice(-8) : (items) => [...items, assistantMessage])
      speakEntityText(data.answer)
    } catch (err) {
      setConversationError(err.message)
    } finally {
      setConversationLoading(false)
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setConversationError("Este navegador no tiene reconocimiento de voz disponible.")
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = "es-ES"
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => {
      setListening(true)
      setConversationError("")
    }
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim()
      setConversationDraft(transcript)
    }
    recognition.onerror = () => {
      setListening(false)
      setConversationError("No pude escuchar con claridad. Probemos escribiendo o intenta otra vez.")
    }
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
  }

  return (
    <section className="glass-panel entity-advisor-panel">
      <div className="entity-advisor-visual">
        {assetUrl ? (
          asset?.type === "video" || assetUrl.endsWith(".mp4") ? (
            <video src={assetUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={assetUrl} alt="Entidad Brand Experience" />
          )
        ) : (
          <div className="entity-advisor-placeholder">BE</div>
        )}
        <div className="entity-advisor-glow" />
      </div>

      <div className="entity-advisor-content">
        <div className="panel-kicker">Entidad asesora</div>
        <div className="panel-title" translate="no">Brand Experience</div>

        {!clientName ? (
          <p className="entity-advisor-message">
            Selecciona un cliente para activar la lectura de la Entidad.
          </p>
        ) : loading ? (
          <p className="entity-advisor-message">Observando el sistema del cliente...</p>
        ) : error ? (
          <p className="entity-advisor-message warning">{error}</p>
        ) : recommendation ? (
          <>
            <p className="entity-advisor-message">
              {fluidMessages.status_reading || recommendation.message}
            </p>
            <div className="entity-advisor-next">
              <span>Proximo paso</span>
              <strong>{recommendation.next_action}</strong>
              {recommendation.reason ? <small>{recommendation.reason}</small> : null}
            </div>
            <div className="entity-engine-grid">
              {activeEngines.map(([label, enabled]) => (
                <div className={enabled ? "entity-engine active" : "entity-engine"} key={label}>
                  <span>{label}</span>
                  <strong>{enabled ? "Activo" : "Pendiente"}</strong>
                </div>
              ))}
            </div>
            <div className="entity-live-panel">
              <div className="entity-live-header">
                <span>Lectura cognitiva</span>
                <strong>Senales detectadas</strong>
              </div>
              <div className="entity-signal-list">
                {signals.slice(0, 4).map((signal) => (
                  <div className={`entity-signal ${signal.status}`} key={signal.id}>
                    <span>{signal.label}</span>
                    <small>{signal.interpretation}</small>
                  </div>
                ))}
              </div>
              <div className="entity-score-grid">
                {[
                  ["Claridad", scores.clarity],
                  ["Diferenciacion", scores.differentiation],
                  ["Premium", scores.premium_perception],
                  ["Visual", scores.visual_coherence],
                  ["Narrativa", scores.narrative_power],
                  ["Conversion", scores.conversion_readiness],
                ].map(([label, value]) => (
                  <div className="entity-score" key={label}>
                    <div>
                      <span>{label}</span>
                      <strong>{value ?? 0}</strong>
                    </div>
                    <i style={{ "--score": `${Math.max(0, Math.min(100, value ?? 0))}%` }} />
                  </div>
                ))}
              </div>
              <div className="entity-reasoning-grid">
                <div>
                  <span>Fortaleza</span>
                  <p>{opportunities[0] || entityState.oportunidad_principal || "Sistema con avance listo para ordenar."}</p>
                </div>
                <div>
                  <span>Riesgo</span>
                  <p>{risks[0] || "No convertir suficientes avances en una sintesis facil de aprobar."}</p>
                </div>
              </div>
              {reasoning.executive_reading ? (
                <div className="entity-criterion-card">
                  <div className="entity-criterion-header">
                    <span>Criterio de la Entidad</span>
                    <strong>{reasoning.entity_presence || "observando"}</strong>
                  </div>
                  <p>{reasoning.executive_reading}</p>
                  <small>Confianza: {reasoning.confidence || "inicial"}</small>
                </div>
              ) : null}
              {reasoning.strategic_questions?.length ? (
                <div className="entity-question-card">
                  <span>Preguntas estrategicas</span>
                  {reasoning.strategic_questions.map((question) => (
                    <p key={question}>{question}</p>
                  ))}
                </div>
              ) : null}
              {reasoning.action_routes?.length ? (
                <div className="entity-route-list">
                  {reasoning.action_routes.map((route) => (
                    <div className={`entity-route ${route.type}`} key={`${route.type}-${route.label}`}>
                      <span>{route.type}</span>
                      <strong>{route.label}</strong>
                      <small>{route.reason}</small>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <p className="entity-advisor-message">
            La Entidad esta lista para evaluar el proximo movimiento.
          </p>
        )}

        {clientName ? (
          <div className="entity-advisor-actions">
            {recommendation?.action_key ? (
              <button
                className="primary-action entity-advisor-action"
                type="button"
                onClick={() => onPrimaryAction?.(recommendation.action_key)}
                disabled={actionLoading}
              >
                {actionLoading ? "Ejecutando..." : recommendation.next_action}
              </button>
            ) : null}
            <button className="secondary-action entity-advisor-refresh" type="button" onClick={onRefresh}>
              Actualizar lectura
            </button>
            <button
              className="secondary-action entity-advisor-voice"
              type="button"
              onClick={playEntityVoice}
              disabled={voiceLoading || !recommendation}
            >
              {voiceLoading ? "Preparando..." : "Escuchar entidad"}
            </button>
            <button
              className="secondary-action entity-advisor-pause"
              type="button"
              onClick={stopEntityVoice}
              disabled={!voiceReading && !voiceLoading}
            >
              Pausar
            </button>
            <button className="secondary-action entity-advisor-refresh" type="button" onClick={onOpenPortal}>
              Abrir portal
            </button>
          </div>
        ) : null}

        {(voiceReading || voiceStatus || voiceScript || voiceError) && clientName ? (
          <div className={voiceReading ? "entity-voice-card reading" : "entity-voice-card"}>
            <div className="entity-voice-header">
              <span>{voiceReading ? "La entidad está leyendo..." : voiceStatus || "Entity Voice Preview"}</span>
              <div className="entity-voice-waves" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            {voiceScript ? <p>{voiceScript}</p> : null}
            {voiceError ? <strong>{voiceError}</strong> : null}
          </div>
        ) : null}

        {actionMessage ? <p className="entity-advisor-note">{actionMessage}</p> : null}
        {actionError ? <p className="entity-advisor-note warning">{actionError}</p> : null}
        {reviewLoading ? <p className="entity-advisor-note">La Entidad esta revisando entregables...</p> : null}
        {reviewError ? <p className="entity-advisor-note warning">{reviewError}</p> : null}
        {deliverablesReview ? (
          <div className="entity-review-card">
            <div>
              <span>Revision de entregables</span>
              <strong>{deliverablesReview.recommendation}</strong>
            </div>
            <div className="entity-review-stats">
              <span>{deliverablesReview.summary?.total_files || 0} archivos</span>
              <span>{deliverablesReview.summary?.core_deliverables || 0} principales</span>
              <span>{deliverablesReview.summary?.duplicate_groups || 0} duplicados</span>
            </div>
          </div>
        ) : null}

        {clientName ? (
          <div className="entity-conversation-card">
            <div className="entity-conversation-header">
              <div>
                <span>Conversar con la Entidad</span>
                <strong>{listening ? "Escuchando..." : conversationLoading ? "Razonando..." : "Lista para escuchar"}</strong>
              </div>
              <button
                className={listening ? "secondary-action entity-listen active" : "secondary-action entity-listen"}
                type="button"
                onClick={listening ? stopListening : startListening}
              >
                {listening ? "Detener" : "Escuchar"}
              </button>
            </div>

            <div className="entity-conversation-messages">
              {conversationMessages.length ? (
                conversationMessages.slice(-4).map((message, index) => (
                  <article className={`entity-conversation-message ${message.role}`} key={`${message.role}-${index}`}>
                    <span>{message.role === "user" ? "Vos" : "Entidad"}</span>
                    <p>{message.content}</p>
                  </article>
                ))
              ) : (
                <article className="entity-conversation-message assistant">
                  <span>Entidad</span>
                  <p>Estoy lista para escuchar. Puedo ayudarte a decidir, sintetizar, crear una respuesta para el cliente o convertir una idea en una accion concreta.</p>
                </article>
              )}
            </div>

            <div className="entity-conversation-input">
              <textarea
                value={conversationDraft}
                onChange={(event) => setConversationDraft(event.target.value)}
                placeholder="Hablale a la Entidad: que deberiamos hacer con este cliente, que falta, como lo presentamos, que generamos ahora..."
              />
              <button
                className="primary-action"
                type="button"
                onClick={() => sendEntityConversation()}
                disabled={conversationLoading || !conversationDraft.trim()}
              >
                {conversationLoading ? "Razonando..." : "Enviar"}
              </button>
            </div>
            {conversationError ? <p className="entity-advisor-note warning">{conversationError}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
