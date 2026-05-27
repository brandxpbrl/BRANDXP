import { useEffect, useRef, useState } from "react"

const CENTER_VIDEO_PATH = "02_Assets_Visuales/Entidad/BrandIdentity.mp4"

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [name, setName] = useState("")
  const [idea, setIdea] = useState("")
  const centerVideoRef = useRef(null)

  const centerVideoUrl = `${apiUrl}/creative-library/asset?path=${encodeURIComponent(CENTER_VIDEO_PATH)}`

  useEffect(() => {
    const videoTimer = window.setTimeout(() => {
      centerVideoRef.current?.play().catch(() => {})
    }, 250)

    return () => {
      window.clearTimeout(videoTimer)
      if (centerVideoRef.current) {
        centerVideoRef.current.pause()
      }
    }
  }, [])

  const submitWelcome = (event) => {
    event.preventDefault()

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
          </div>
        </div>

        <form className="brand-welcome-dialogue" onSubmit={submitWelcome}>
          <div className="brand-welcome-fields">
            <input
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
