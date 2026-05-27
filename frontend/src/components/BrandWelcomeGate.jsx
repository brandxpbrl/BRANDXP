import { useEffect, useRef, useState } from "react"

const WELCOME_SCRIPT =
  "Hola, soy Brand. Guiaré tu experiencia por el ecosistema que desarrollo todos los días para ser más eficaz y rápido. Dime cómo te llamas y qué estás pensando crear hoy."

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [name, setName] = useState("")
  const [idea, setIdea] = useState("")
  const [voiceState, setVoiceState] = useState("preparing")
  const [voiceBlocked, setVoiceBlocked] = useState(false)
  const nameInputRef = useRef(null)
  const voiceStartRef = useRef(null)

  const videoUrl = `${apiUrl}/creative-library/asset?path=02_Assets_Visuales%2FEntidad%2FBrandIdentity.mp4`

  const getSpanishVoice = () => {
    if (!("speechSynthesis" in window)) {
      return null
    }

    const voices = window.speechSynthesis.getVoices()
    return (
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("es-")) ||
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("es")) ||
      voices[0] ||
      null
    )
  }

  const speakWelcome = (manual = false) => {
    if (!("speechSynthesis" in window)) {
      setVoiceState("blocked")
      setVoiceBlocked(true)
      return
    }

    window.clearTimeout(voiceStartRef.current)
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(WELCOME_SCRIPT)
    const spanishVoice = getSpanishVoice()

    if (spanishVoice) {
      utterance.voice = spanishVoice
    }

    utterance.lang = spanishVoice?.lang || "es-ES"
    utterance.rate = 0.82
    utterance.pitch = 0.9
    utterance.volume = 0.92
    utterance.onstart = () => {
      setVoiceState("speaking")
      setVoiceBlocked(false)
    }
    utterance.onend = () => {
      setVoiceState("done")
      nameInputRef.current?.focus()
    }
    utterance.onerror = () => {
      setVoiceState("blocked")
      setVoiceBlocked(true)
    }

    setVoiceState("preparing")
    window.speechSynthesis.speak(utterance)

    voiceStartRef.current = window.setTimeout(() => {
      if (!window.speechSynthesis.speaking && !manual) {
        setVoiceState("blocked")
        setVoiceBlocked(true)
      }
    }, 1400)
  }

  useEffect(() => {
    const startVoice = () => speakWelcome(false)
    const voiceTimer = window.setTimeout(startVoice, 500)

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = startVoice
    }

    return () => {
      window.clearTimeout(voiceTimer)
      window.clearTimeout(voiceStartRef.current)
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const submitWelcome = (event) => {
    event.preventDefault()

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    window.sessionStorage.setItem("brand_welcome_seen", "true")
    window.sessionStorage.setItem("brand_welcome_name", name.trim())
    window.sessionStorage.setItem("brand_welcome_idea", idea.trim())
    onContinue?.({
      name: name.trim(),
      idea: idea.trim(),
    })
  }

  return (
    <main className="brand-welcome-shell">
      <div className="brand-welcome-orbit" />
      <section className="brand-welcome-stage" aria-label="Bienvenida de Brand">
        <button
          className="brand-welcome-video-wrap"
          type="button"
          onClick={() => speakWelcome(true)}
          aria-label="Escuchar voz de Brand"
        >
          <video src={videoUrl} autoPlay muted loop playsInline />
          <div className="brand-welcome-video-glow" />
          <div className={voiceState === "speaking" ? "brand-voice-ring speaking" : "brand-voice-ring"}>
            <i />
            <i />
            <i />
            <i />
          </div>
        </button>

        <form className="brand-welcome-dialogue" onSubmit={submitWelcome}>
          <h1 className="sr-only">Hola, soy Brand.</h1>
          <p className="sr-only">{WELCOME_SCRIPT}</p>
          <div className="brand-welcome-voice-status" aria-live="polite">
            <span translate="no">Brand Experience OS</span>
            <button className="brand-voice-trigger" type="button" onClick={() => speakWelcome(true)}>
              {voiceState === "speaking" ? "Brand está hablando" : voiceBlocked ? "Activar voz" : "Repetir voz"}
            </button>
          </div>

          <div className="brand-welcome-fields">
            <input
              ref={nameInputRef}
              autoComplete="name"
              placeholder="Cómo te llamas"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <textarea
              placeholder="Qué estás pensando crear hoy"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
            />
          </div>

          <button className="primary-action brand-welcome-action" type="submit">
            Entrar al ecosistema
          </button>
        </form>
      </section>
    </main>
  )
}
