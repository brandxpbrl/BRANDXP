import { useState } from "react"

export default function CognitiveInput({ onExecute, loading }) {
  const [prompt, setPrompt] = useState("")

  const handleExecute = (event) => {
    event?.preventDefault()

    if (!prompt.trim() || loading) return

    onExecute(prompt.trim())
  }

  return (
    <form className="glass-panel input-panel" onSubmit={handleExecute}>
      <div className="panel-kicker">Entrada cognitiva</div>
      <div className="panel-title">
        Describe vision, problema o marca.
      </div>
      <div className="panel-copy">
        El sistema traducira la idea en diagnostico, oportunidades, direccion visual y proximos pasos.
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 4000))}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            handleExecute(event)
          }
        }}
        placeholder="Ejemplo: analiza una marca de turismo premium en Rio y define identidad, posicionamiento, universo visual y contenido inicial."
        className="prompt-field"
      >
      </textarea>

      <div className="input-actions">
        <div className="character-count">
          {prompt.length}/4000
        </div>

        <button className="primary-action" type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Analizando" : "Ejecutar analisis"}
        </button>
      </div>
    </form>
  )
}
