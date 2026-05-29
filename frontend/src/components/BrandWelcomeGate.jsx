import { useEffect, useRef, useState } from "react"

const CENTER_VIDEO_PATH = "02_Assets_Visuales/Entidad/BrandIdentity.mp4"
const WELCOME_AUDIO_PATH = "02_Assets_Visuales/Entidad/bienvenida.mp3"

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [voiceStatus, setVoiceStatus] = useState("idle")
  const centerVideoRef = useRef(null)
  const welcomeAudioRef = useRef(null)
  const navigateAfterVoiceRef = useRef(false)

  const centerVideoUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(CENTER_VIDEO_PATH)}`
  const welcomeAudioUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(WELCOME_AUDIO_PATH)}`

  const completeWelcome = () => {
    if (centerVideoRef.current) {
      centerVideoRef.current.pause()
    }

    if (welcomeAudioRef.current) {
      welcomeAudioRef.current.pause()
    }

    window.sessionStorage.setItem("brand_welcome_seen", "true")
    window.sessionStorage.setItem("brand_welcome_name", "")
    window.sessionStorage.setItem("brand_welcome_idea", "")
    onContinue?.({
      name: "",
      idea: "",
    })
  }

  useEffect(() => {
    const videoTimer = window.setTimeout(() => {
      centerVideoRef.current?.play().catch(() => {})
    }, 250)

    const audioTimer = window.setTimeout(() => {
      const audio = welcomeAudioRef.current

      if (!audio) {
        return
      }

      audio.volume = 1
      audio.play()
        .then(() => setVoiceStatus("playing"))
        .catch(() => setVoiceStatus("blocked"))
    }, 450)

    return () => {
      window.clearTimeout(videoTimer)
      window.clearTimeout(audioTimer)
      if (centerVideoRef.current) {
        centerVideoRef.current.pause()
      }
      if (welcomeAudioRef.current) {
        welcomeAudioRef.current.pause()
      }
    }
  }, [])

  const submitWelcome = (event) => {
    event.preventDefault()
    const audio = welcomeAudioRef.current

    if (
      audio
      && voiceStatus !== "playing"
      && !audio.ended
      && audio.currentTime < 0.25
    ) {
      navigateAfterVoiceRef.current = true
      audio.play()
        .then(() => setVoiceStatus("playing"))
        .catch(() => completeWelcome())
      return
    }

    completeWelcome()
  }

  const handleAudioEnded = () => {
    setVoiceStatus("complete")

    if (navigateAfterVoiceRef.current) {
      completeWelcome()
    }
  }

  return (
    <main className="brand-welcome-shell">
      <section className="brand-welcome-stage" aria-label="Bienvenida de Brand">
        <div className="brand-welcome-media-grid">
          <div className="brand-welcome-video-wrap brand-welcome-video-wrap--center" aria-label="Brand Identity">
            <video
              ref={centerVideoRef}
              src={centerVideoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
            <audio
              ref={welcomeAudioRef}
              src={welcomeAudioUrl}
              preload="auto"
              onEnded={handleAudioEnded}
            />
          </div>
        </div>

        <form className="brand-welcome-dialogue" onSubmit={submitWelcome}>
          <button className="primary-action brand-welcome-action" type="submit">
            NAVEGAR
          </button>
        </form>
      </section>
    </main>
  )
}
