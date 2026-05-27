import { useEffect, useRef, useState } from "react"

const IDENTITY_VIDEO_PATH =
  "02_Assets_Visuales/Entidad/Generated Video May 13, 2026 - 1_32AM.mp4"

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [name, setName] = useState("")
  const [idea, setIdea] = useState("")
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [audioActive, setAudioActive] = useState(false)
  const videoRef = useRef(null)
  const nameInputRef = useRef(null)

  const videoUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(IDENTITY_VIDEO_PATH)}`

  const playVideoWithSound = async (restart = false) => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (restart) {
      video.currentTime = 0
    }

    video.muted = false
    video.volume = 1

    try {
      await video.play()
      setAudioActive(true)
      setAudioBlocked(false)
    } catch {
      video.muted = true
      setAudioActive(false)
      setAudioBlocked(true)
      await video.play().catch(() => {})
    }
  }

  useEffect(() => {
    const videoTimer = window.setTimeout(() => playVideoWithSound(false), 350)

    return () => {
      window.clearTimeout(videoTimer)
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  const submitWelcome = (event) => {
    event.preventDefault()

    if (videoRef.current) {
      videoRef.current.pause()
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
          onClick={() => playVideoWithSound(true)}
          aria-label="Escuchar video de Brand"
        >
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            onEnded={() => {
              setAudioActive(false)
              nameInputRef.current?.focus()
            }}
            onPlaying={() => {
              setAudioActive(!videoRef.current?.muted)
            }}
            onVolumeChange={() => {
              setAudioActive(Boolean(videoRef.current && !videoRef.current.muted))
            }}
          />
          <div className="brand-welcome-video-glow" />
          <div className={audioActive ? "brand-voice-ring speaking" : "brand-voice-ring"}>
            <i />
            <i />
            <i />
            <i />
          </div>
          {audioBlocked ? (
            <span className="brand-audio-gate">Escuchar Brand</span>
          ) : null}
        </button>

        <form className="brand-welcome-dialogue" onSubmit={submitWelcome}>
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
