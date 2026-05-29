import { useState } from "react"

const INITIAL_NEW_CLIENT_FORM = {
  brandName: "",
  instagram: "",
  contactName: "",
  contactEmail: "",
  origin: "",
  vision: "",
  purpose: "",
  beneficiaries: "",
  mainObjective: "",
  targetAudience: "",
  market: "",
  identityWords: "",
  personality: "",
  differentiation: "",
  impactPhrase: "",
  personDescription: "",
  links: "",
  notes: "",
}

const BRAND_QUESTIONNAIRE = [
  {
    field: "origin",
    title: "1. Origen",
    prompt: "¿Cómo nació tu marca?",
    placeholder: "Cuéntanos la historia detrás del proyecto, qué te inspiró y por qué decidiste crearlo.",
  },
  {
    field: "vision",
    title: "2. Visión",
    prompt: "¿Qué quieres construir con tu marca?",
    placeholder: "Describe el impacto, la empresa o el futuro que imaginas.",
  },
  {
    field: "purpose",
    title: "3. Propósito",
    prompt: "¿Qué problema resuelve tu marca?",
    placeholder: "Qué necesidad cubres o qué transformación generas en las personas.",
  },
  {
    field: "beneficiaries",
    title: "4. Beneficiarios",
    prompt: "¿Quién se beneficia con tu marca?",
    placeholder: "A quién ayudas y cómo mejora su vida, negocio o experiencia.",
  },
  {
    field: "mainObjective",
    title: "5. Objetivo principal",
    prompt: "¿Cuál es el objetivo principal de tu marca actualmente?",
    placeholder: "Ejemplos: vender más, posicionarse, generar autoridad, captar clientes, expandirse.",
  },
  {
    field: "targetAudience",
    title: "6. Público objetivo",
    prompt: "¿Cuál es tu público ideal?",
    placeholder: "Describe a las personas que quieres atraer.",
  },
  {
    field: "market",
    title: "7. Nacionalidad o mercado",
    prompt: "¿De qué país o países es tu público principal?",
    placeholder: "País, ciudad, región o mercado principal.",
  },
  {
    field: "identityWords",
    title: "8. Identidad",
    prompt: "Define tu marca en 3 palabras.",
    placeholder: "Ejemplo: premium, cercana, transformadora.",
  },
  {
    field: "personality",
    title: "9. Personalidad",
    prompt: "¿Cómo habla tu marca?",
    placeholder: "Ejemplos: profesional, cercana, divertida, premium, técnica, inspiradora, elegante, disruptiva.",
  },
  {
    field: "differentiation",
    title: "10. Diferenciación",
    prompt: "¿Qué hace única a tu marca?",
    placeholder: "Por qué alguien debería elegirte a ti y no a la competencia.",
  },
  {
    field: "impactPhrase",
    title: "11. Frase de impacto",
    prompt: "¿Cuál es tu frase, lema o mensaje principal?",
    placeholder: "La frase que mejor representa la esencia de tu marca.",
  },
  {
    field: "personDescription",
    title: "Reflexión final",
    prompt: "Si tu marca fuera una persona, ¿cómo la describirías?",
    placeholder: "Esta respuesta ayuda a comprender la personalidad profunda de la marca.",
  },
]

export default function AccessGate({ apiUrl, checking, error, onAccessGranted }) {
  const [mode, setMode] = useState("access")
  const [accessKey, setAccessKey] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [newClientForm, setNewClientForm] = useState(INITIAL_NEW_CLIENT_FORM)
  const [newClientFiles, setNewClientFiles] = useState([])
  const [newClientSubmitting, setNewClientSubmitting] = useState(false)
  const [newClientStatus, setNewClientStatus] = useState("")
  const [newClientError, setNewClientError] = useState("")

  const answeredQuestionCount = BRAND_QUESTIONNAIRE.filter((question) =>
    newClientForm[question.field]?.trim()
  ).length

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
      formData.append("origin", newClientForm.origin.trim())
      formData.append("vision", newClientForm.vision.trim())
      formData.append("purpose", newClientForm.purpose.trim())
      formData.append("beneficiaries", newClientForm.beneficiaries.trim())
      formData.append("main_objective", newClientForm.mainObjective.trim())
      formData.append("target_audience", newClientForm.targetAudience.trim())
      formData.append("market", newClientForm.market.trim())
      formData.append("identity_words", newClientForm.identityWords.trim())
      formData.append("personality", newClientForm.personality.trim())
      formData.append("differentiation", newClientForm.differentiation.trim())
      formData.append("impact_phrase", newClientForm.impactPhrase.trim())
      formData.append("person_description", newClientForm.personDescription.trim())
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
      setNewClientForm(INITIAL_NEW_CLIENT_FORM)
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
            <div className="new-client-intro">
              <span>Cuestionario de esencia</span>
              <p>
                Antes de comenzar, queremos comprender la esencia de tu marca para construir una identidad sólida, auténtica y diferenciada.
              </p>
            </div>

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

            <div className="new-client-questionnaire">
              {BRAND_QUESTIONNAIRE.map((question) => (
                <label className="new-client-question" key={question.field}>
                  <span>{question.title}</span>
                  <strong>{question.prompt}</strong>
                  <textarea
                    placeholder={question.placeholder}
                    value={newClientForm[question.field]}
                    onChange={(event) => updateNewClientField(question.field, event.target.value)}
                    disabled={newClientSubmitting}
                  />
                </label>
              ))}
            </div>

            <div className="new-client-progress">
              {answeredQuestionCount} de {BRAND_QUESTIONNAIRE.length} respuestas completadas
            </div>

            <textarea
              className="new-client-aux-field"
              placeholder="Links adicionales: Instagram, web, referencias, competencia o material público. Uno por línea."
              value={newClientForm.links}
              onChange={(event) => updateNewClientField("links", event.target.value)}
              disabled={newClientSubmitting}
            />
            <textarea
              className="new-client-aux-field"
              placeholder="Notas extra, referencias visuales, urgencias o información que quieras sumar."
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
