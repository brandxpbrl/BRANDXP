import { useState } from "react"

export default function BrandWelcomeGate({ apiUrl, onContinue }) {
  const [name, setName] = useState("")
  const [idea, setIdea] = useState("")

  const videoUrl = `${apiUrl}/creative-library/asset?path=02_Assets_Visuales%2FEntidad%2FBrandIdentity.mp4`

  const submitWelcome = (event) => {
    event.preventDefault()

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
        <div className="brand-welcome-video-wrap">
          <video src={videoUrl} autoPlay muted loop playsInline />
          <div className="brand-welcome-video-glow" />
        </div>

        <form className="brand-welcome-dialogue" onSubmit={submitWelcome}>
          <span translate="no">Brand Experience OS</span>
          <h1>Hola, soy Brand.</h1>
          <p>
            Guiaré tu experiencia por el ecosistema que desarrollo todos los días para ser más eficaz y rápido. Dime cómo te llamas y qué estás pensando crear hoy.
          </p>

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
