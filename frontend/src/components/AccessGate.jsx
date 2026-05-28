import { useState } from "react"

export default function AccessGate({ apiUrl, checking, error, onAccessGranted }) {
  const [mode, setMode] = useState("access")
  const [accessKey, setAccessKey] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [newClientForm, setNewClientForm] = useState({
    brandName: "",
    instagram: "",
    contactName: "",
    contactEmail: "",
    projectGoal: "",
    services: "",
    audience: "",
    links: "",
    notes: "",
  })
  const [newClientFiles, setNewClientFiles] = useState([])
  const [newClientSubmitting, setNewClientSubmitting] = useState(false)
  const [newClientStatus, setNewClientStatus] = useState("")
  const [newClientError, setNewClientError] = useState("")

  const updateNewClientField = (field, value) => {
    setNewClientForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submitAccess = async (event) => {
    event.preventDefault()

    if (!accessKey.trim()) {
      setLoginError("Ingresa una llave de acceso.")
      return
    }

    setSubmitting(true)
    setLoginError("")

    try {
      const res = await fetch(`${apiUrl}/api/access/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey.trim(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "La llave no es valida.")
      }

      window.localStorage.setItem("beos_access_token", data.token)
      window.localStorage.setItem("beos_access_mode", data.mode)
      window.localStorage.setItem("beos_access_client", data.client || "")
      onAccessGranted?.(data)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitNewClient = async (event) => {
    event.preventDefault()

    if (!newClientForm.brandName.trim() || !newClientForm.instagram.trim()) {
      setNewClientError("Completa nombre de marca e Instagram para solicitar el análisis.")
      return
    }

    setNewClientSubmitting(true)
    setNewClientStatus("")
    setNewClientError("")

    try {
      const formData = new FormData()
      formData.append("brand_name", newClientForm.brandName.trim())
      formData.append("instagram", newClientForm.instagram.trim())
      formData.append("contact_name", newClientForm.contactName.trim())
      formData.append("contact_email", newClientForm.contactEmail.trim())
      formData.append("project_goal", newClientForm.projectGoal.trim())
      formData.append("services", newClientForm.services.trim())
      formData.append("audience", newClientForm.audience.trim())
      formData.append("links", newClientForm.links.trim())
      formData.append("notes", newClientForm.notes.trim())

      for (const file of newClientFiles) {
        formData.append("files", file)
      }

      const res = await fetch(`${apiUrl}/api/public/client-intake`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo enviar la solicitud.")
      }

      setNewClientStatus("Solicitud recibida. Brand Experience OS ya guardó tu Instagram y contexto para el análisis.")
      setNewClientFiles([])
      setNewClientForm({
        brandName: "",
        instagram: "",
        contactName: "",
        contactEmail: "",
        projectGoal: "",
        services: "",
        audience: "",
        links: "",
        notes: "",
      })
    } catch (err) {
      setNewClientError(err.message)
    } finally {
      setNewClientSubmitting(false)
    }
  }

  return (
    <div className="access-shell">
      <div className="access-aura" />
      <section className={`access-card ${mode === "new_client" ? "new-client-card" : ""}`}>
        <div className="access-mark" translate="no">BX</div>
        <div className="panel-kicker">Acceso privado</div>
        <h1 translate="no">Brand Experience OS</h1>
        <p>
          Ingresa tu llave para abrir el espacio correcto. Las llaves de developer activan el sistema completo; las llaves de cliente abren solo su portal.
        </p>

        <div className="access-mode-switch" role="tablist" aria-label="Modo de acceso">
          <button
            className={mode === "access" ? "active" : ""}
            type="button"
            onClick={() => setMode("access")}
          >
            Tengo llave
          </button>
          <button
            className={mode === "new_client" ? "active" : ""}
            type="button"
            onClick={() => setMode("new_client")}
          >
            Cliente nuevo
          </button>
        </div>

        {mode === "access" ? (
          <form className="access-form" onSubmit={submitAccess}>
            <input
              autoComplete="off"
              placeholder="Llave de acceso"
              type="password"
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              disabled={checking || submitting}
            />
            <button className="primary-action" type="submit" disabled={checking || submitting}>
              {checking || submitting ? "Verificando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="new-client-intake" onSubmit={submitNewClient}>
            <div className="new-client-grid">
              <input
                placeholder="Nombre de la marca"
                value={newClientForm.brandName}
                onChange={(event) => updateNewClientField("brandName", event.target.value)}
                disabled={newClientSubmitting}
              />
              <input
                placeholder="Instagram @usuario o link"
                value={newClientForm.instagram}
                onChange={(event) => updateNewClientField("instagram", event.target.value)}
                disabled={newClientSubmitting}
              />
              <input
                placeholder="Tu nombre"
                value={newClientForm.contactName}
                onChange={(event) => updateNewClientField("contactName", event.target.value)}
                disabled={newClientSubmitting}
              />
              <input
                placeholder="Email / WhatsApp"
                value={newClientForm.contactEmail}
                onChange={(event) => updateNewClientField("contactEmail", event.target.value)}
                disabled={newClientSubmitting}
              />
            </div>

            <textarea
              placeholder="Qué querés crear o mejorar con tu marca"
              value={newClientForm.projectGoal}
              onChange={(event) => updateNewClientField("projectGoal", event.target.value)}
              disabled={newClientSubmitting}
            />
            <textarea
              placeholder="Servicios, productos o experiencia que vendés"
              value={newClientForm.services}
              onChange={(event) => updateNewClientField("services", event.target.value)}
              disabled={newClientSubmitting}
            />
            <textarea
              placeholder="Público, cliente ideal o mercado"
              value={newClientForm.audience}
              onChange={(event) => updateNewClientField("audience", event.target.value)}
              disabled={newClientSubmitting}
            />
            <textarea
              placeholder="Links adicionales, uno por línea"
              value={newClientForm.links}
              onChange={(event) => updateNewClientField("links", event.target.value)}
              disabled={newClientSubmitting}
            />
            <textarea
              placeholder="Notas extra, referencias o problema actual"
              value={newClientForm.notes}
              onChange={(event) => updateNewClientField("notes", event.target.value)}
              disabled={newClientSubmitting}
            />

            <label className="new-client-upload">
              <span>{newClientFiles.length ? `${newClientFiles.length} archivo(s) listo(s)` : "Subir capturas, logo, PDF o referencias"}</span>
              <input
                type="file"
                multiple
                onChange={(event) => setNewClientFiles(Array.from(event.target.files || []))}
                disabled={newClientSubmitting}
              />
            </label>

            <button
              className="primary-action"
              type="submit"
              disabled={newClientSubmitting || !newClientForm.brandName.trim() || !newClientForm.instagram.trim()}
            >
              {newClientSubmitting ? "Enviando..." : "Solicitar análisis"}
            </button>
          </form>
        )}

        {error ? <span className="access-message warning">{error}</span> : null}
        {loginError ? <span className="access-message warning">{loginError}</span> : null}
        {newClientError ? <span className="access-message warning">{newClientError}</span> : null}
        {newClientStatus ? <span className="access-message success">{newClientStatus}</span> : null}
        <span className="access-message">
          La Entidad abre solo la informacion asociada a tu llave.
        </span>
      </section>
    </div>
  )
}
