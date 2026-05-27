import { useEffect, useRef, useState } from "react"

const IDENTITY_VIDEO_PATH =
  "02_Assets_Visuales/Entidad/Generated Video May 13, 2026 - 1_32AM.mp4"
const CENTER_VIDEO_PATH = "02_Assets_Visuales/Entidad/BrandIdentity.mp4"

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [name, setName] = useState("")
  const [idea, setIdea] = useState("")
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [audioActive, setAudioActive] = useState(false)
  const identityVideoRef = useRef(null)
  const centerVideoRef = useRef(null)
  const nameInputRef = useRef(null)

  const identityVideoUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(IDENTITY_VIDEO_PATH)}`
  const centerVideoUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(CENTER_VIDEO_PATH)}`

  const playIdentityVideoWithSound = async (restart = false) => {
    const video = identityVideoRef.current

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
    const videoTimer = window.setTimeout(() => playIdentityVideoWithSound(false), 350)

    return () => {
      window.clearTimeout(videoTimer)
      if (identityVideoRef.current) {
        identityVideoRef.current.pause()
      }
      if (centerVideoRef.current) {
        centerVideoRef.current.pause()
      }
    }
  }, [])

  const submitWelcome = (event) => {
    event.preventDefault()

    if (identityVideoRef.current) {
      identityVideoRef.current.pause()
    }
    if (centerVideoRef.current) {
      centerVideoRef.current.pause()
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
        <div className="brand-welcome-media-grid">
          <button
            className="brand-welcome-video-wrap brand-welcome-video-wrap--side"
            type="button"
            onClick={() => playIdentityVideoWithSound(true)}
            aria-label="Escuchar video de identidad de Brand"
          >
            <video
              ref={identityVideoRef}
              src={identityVideoUrl}
              autoPlay
              playsInline
              onEnded={() => {
                setAudioActive(false)
                nameInputRef.current?.focus()
              }}
              onPlaying={() => {
                setAudioActive(!identityVideoRef.current?.muted)
              }}
              onVolumeChange={() => {
                setAudioActive(Boolean(identityVideoRef.current && !identityVideoRef.current.muted))
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

          <div className="brand-welcome-video-wrap brand-welcome-video-wrap--center" aria-label="Brand Identity">
            <video
              ref={centerVideoRef}
              src={centerVideoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="brand-welcome-video-glow" />
          </div>
        </div>

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
