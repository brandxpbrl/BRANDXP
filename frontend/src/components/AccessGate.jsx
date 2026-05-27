import { useState } from "react"

export default function AccessGate({ apiUrl, checking, error, onAccessGranted }) {
  const [accessKey, setAccessKey] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setLoginError] = useState("")

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

  return (
    <div className="access-shell">
      <div className="access-aura" />
      <section className="access-card">
        <div className="access-mark" translate="no">BX</div>
        <div className="panel-kicker">Acceso privado</div>
        <h1 translate="no">Brand Experience OS</h1>
        <p>
          Ingresa tu llave para abrir el espacio correcto. Las llaves de developer activan el sistema completo; las llaves de cliente abren solo su portal.
        </p>

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

        {error ? <span className="access-message warning">{error}</span> : null}
        {loginError ? <span className="access-message warning">{loginError}</span> : null}
        <span className="access-message">
          La Entidad abre solo la informacion asociada a tu llave.
        </span>
      </section>
    </div>
  )
}
