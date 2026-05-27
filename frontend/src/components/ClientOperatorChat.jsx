import { useState } from "react"

export default function ClientOperatorChat({
  clientName,
  chatContext,
  loading,
  error,
  messages,
  selectedPromptId,
  onSelectPrompt,
  onSendMessage,
  sending,
  sendError,
  sendMessage,
}) {
  const [draft, setDraft] = useState("")
  const prompts = chatContext?.suggested_prompts || []
  const activation = chatContext?.activation || {}
  const decision = activation?.decision_board || {}
  const history = messages?.length ? messages : chatContext?.history || []
  const selectedPrompt = prompts.find((prompt) => prompt.id === selectedPromptId)

  const submit = async () => {
    const text = draft.trim() || selectedPrompt?.prompt || ""

    if (!text) return

    await onSendMessage?.(text, selectedPromptId)
    setDraft("")
  }

  if (!clientName) {
    return (
      <section className="glass-panel client-chat-empty">
        <div className="panel-kicker">Client Operator Chat</div>
        <div className="panel-title">Selecciona un cliente</div>
        <p>El chat se activa con memoria, analisis, Activation Board y entregables del cliente seleccionado.</p>
      </section>
    )
  }

  return (
    <section className="client-chat">
      <div className="glass-panel client-chat-hero">
        <div>
          <div className="panel-kicker">Client Operator Chat</div>
          <h2>{clientName}</h2>
          <p>
            Chat operativo para ejecutar proximos pasos, desarrollar prompts y convertir el analisis en salidas concretas.
          </p>
        </div>
        <div className="client-chat-status">
          <span>Decision activa</span>
          <strong>{decision.next_visible_output || "Preparar accion"}</strong>
          <small>{decision.strategic_decision || activation.headline || "El sistema esta leyendo el contexto del cliente."}</small>
        </div>
      </div>

      {loading ? (
        <section className="glass-panel client-chat-empty">
          <p>Cargando contexto operativo del cliente...</p>
        </section>
      ) : error ? (
        <section className="glass-panel client-chat-empty">
          <p>{error}</p>
        </section>
      ) : (
        <div className="client-chat-grid">
          <section className="glass-panel client-chat-prompts">
            <div className="panel-kicker">Prompts ejecutables</div>
            <div className="prompt-chip-list">
              {prompts.map((prompt) => (
                <button
                  className={selectedPromptId === prompt.id ? "prompt-chip active" : "prompt-chip"}
                  type="button"
                  key={prompt.id}
                  onClick={() => onSelectPrompt?.(selectedPromptId === prompt.id ? "" : prompt.id)}
                >
                  <span>{prompt.label}</span>
                  <small>{prompt.prompt}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-panel client-chat-panel">
            <div className="client-chat-messages">
              {history.length ? (
                history.map((message, index) => (
                  <article className={`chat-message ${message.role}`} key={`${message.role}-${index}-${message.created_at || ""}`}>
                    <span>{message.role === "user" ? "Usuario" : "Client Operator"}</span>
                    <p>{message.content}</p>
                    {message.provider ? <small>{message.provider}</small> : null}
                  </article>
                ))
              ) : (
                <article className="chat-message assistant">
                  <span>Client Operator</span>
                  <p>
                    Estoy listo para ejecutar prompts, ordenar proximos pasos o convertir el Activation Board en acciones concretas.
                  </p>
                </article>
              )}
            </div>

            {selectedPromptId ? (
              <div className="selected-prompt-preview">
                <span>Prompt activo</span>
                <p>{selectedPrompt?.prompt}</p>
              </div>
            ) : null}

            <div className="client-chat-input">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribi que queres ejecutar: crear una pieza, ordenar entregables, preparar mensaje al cliente, desarrollar un prompt..."
              />
              <button
                className="primary-action"
                type="button"
                onClick={submit}
                disabled={sending || (!draft.trim() && !selectedPromptId)}
              >
                {sending ? "Ejecutando..." : selectedPromptId ? "Ejecutar prompt" : "Enviar"}
              </button>
            </div>

            {sendMessage ? <p className="chat-action-message">{sendMessage}</p> : null}
            {sendError ? <p className="chat-action-message warning">{sendError}</p> : null}
          </section>
        </div>
      )}
    </section>
  )
}
