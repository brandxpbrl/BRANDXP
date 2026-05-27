const statusLabels = {
  completed: "Completado",
  review: "En revision",
  progress: "En progreso",
  pending: "Pendiente",
  available: "Disponible",
  in_review: "En revision",
  ready: "Listo",
}

const statusClass = (status = "") => `portal-status ${status}`

const labelize = (value = "") => {
  if (!value) return "Pendiente"

  return statusLabels[value] || value.replaceAll("_", " ")
}

export default function ClientPortalPanel({
  clientName,
  portalData,
  loading,
  error,
  apiUrl,
  onRefresh,
  onViewDeliverable,
  deliverableContent,
  contentLoading,
  contentError,
  onCloseDeliverable,
  onPortalAction,
  portalActionLoading,
  portalActionMessage,
  portalActionError,
}) {
  if (!clientName) {
    return (
      <section className="glass-panel client-portal-empty">
        <div className="panel-kicker">Portal del Cliente</div>
        <div className="panel-title">Selecciona un cliente</div>
        <p>La sala estrategica del cliente se activa cuando hay una entidad seleccionada.</p>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="glass-panel client-portal-empty">
        <div className="panel-kicker">Portal del Cliente</div>
        <div className="panel-title">Cargando experiencia</div>
        <p>La Entidad esta preparando una lectura simple, visual y compartible.</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="glass-panel client-portal-empty">
        <div className="panel-kicker">Portal del Cliente</div>
        <div className="panel-title">Revision requerida</div>
        <p>{error}</p>
        <button className="secondary-action" type="button" onClick={onRefresh}>
          Reintentar
        </button>
      </section>
    )
  }

  const data = portalData || {}
  const status = data.brand_status || {}
  const analysis = data.executive_analysis || {}
  const recommendation = data.entity_recommendation || {}
  const review = data.review_status || {}
  const activation = data.activation_plan || {}
  const decision = activation.decision_board || {}
  const priorityActions = activation.priority_actions || []
  const pipeline = activation.production_pipeline || []
  const contentMoves = activation.content_moves || []
  const metrics = activation.observable_metrics || []
  const blockers = activation.blockers || []
  const modules = status.modules || []
  const timeline = data.progress_timeline || []
  const deliverables = data.deliverables || []
  const actions = data.available_actions || []

  return (
    <section className="client-portal">
      <div className="glass-panel client-portal-hero">
        <div>
          <div className="panel-kicker">Portal del Cliente</div>
          <h2>{data.client || clientName}</h2>
          <p>{data.welcome_message || "La Entidad esta preparando la lectura del cliente."}</p>
        </div>
        <div className="portal-hero-status">
          <span>Estado de marca</span>
          <strong>{status.overall || "En evolucion"}</strong>
          <small>{status.summary || "Avances listos para ordenar y revisar."}</small>
        </div>
      </div>

      <div className="portal-section-grid">
        <section className="glass-panel portal-section">
          <div className="portal-section-header">
            <div>
              <div className="panel-kicker">Brand status</div>
              <h3>Base estrategica</h3>
            </div>
            <button className="secondary-action compact" type="button" onClick={onRefresh}>
              Actualizar
            </button>
          </div>
          <div className="portal-status-grid">
            {modules.map((module) => (
              <div className="portal-status-card" key={module.name}>
                <span>{module.name}</span>
                <strong className={statusClass(module.status)}>
                  {statusLabels[module.status] || module.status}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel portal-section">
          <div className="panel-kicker">La Entidad recomienda</div>
          <h3>{recommendation.next_action || "Revisar direccion"}</h3>
          <p>{recommendation.message || "La marca necesita una lectura clara antes del siguiente movimiento."}</p>
          <div className="portal-reason">{recommendation.reason || "Este paso ordena avance, confianza y decision."}</div>
        </section>
      </div>

      <section className="glass-panel portal-section">
        <div className="panel-kicker">Analisis ejecutivo</div>
        <div className="portal-analysis-grid">
          <article>
            <span>Diagnostico actual</span>
            <p>{analysis.diagnosis || "Aun no hay diagnostico visible para cliente."}</p>
          </article>
          <article>
            <span>Brecha principal</span>
            <p>{analysis.main_gap || "Ordenar lo existente antes de avanzar."}</p>
          </article>
          <article>
            <span>Oportunidad</span>
            <p>{analysis.opportunity || "Convertir el sistema en una direccion simple de aprobar."}</p>
          </article>
          <article>
            <span>Direccion recomendada</span>
            <p>{analysis.recommended_direction || "Revisar entregables y preparar la siguiente etapa."}</p>
          </article>
        </div>
      </section>

      <section className="glass-panel portal-section activation-board">
        <div className="portal-section-header">
          <div>
            <div className="panel-kicker">Activation Board</div>
            <h3>De analisis a accion observable</h3>
          </div>
          <span className={`portal-status ${activation.activation_state || "pending"}`}>
            {activation.activation_state === "ready" ? "Listo para activar" : "Pendiente"}
          </span>
        </div>

        <div className="activation-command-row">
          <button
            className="primary-action compact"
            type="button"
            onClick={() => onPortalAction?.("create_sprint")}
            disabled={Boolean(portalActionLoading)}
          >
            {portalActionLoading === "create_sprint" ? "Creando..." : "Crear sprint"}
          </button>
          <button
            className="secondary-action compact"
            type="button"
            onClick={() => onPortalAction?.("mark_reviewed")}
            disabled={Boolean(portalActionLoading)}
          >
            {portalActionLoading === "mark_reviewed" ? "Marcando..." : "Marcar revision"}
          </button>
          <button
            className="secondary-action compact"
            type="button"
            onClick={() => onPortalAction?.("generate_summary")}
            disabled={Boolean(portalActionLoading)}
          >
            {portalActionLoading === "generate_summary" ? "Generando..." : "Generar resumen"}
          </button>
        </div>

        {portalActionMessage ? <p className="activation-action-message">{portalActionMessage}</p> : null}
        {portalActionError ? <p className="activation-action-message warning">{portalActionError}</p> : null}

        <div className="activation-decision-grid">
          <article>
            <span>Estado actual</span>
            <p>{decision.current_state || "Lectura pendiente."}</p>
          </article>
          <article>
            <span>Brecha a resolver</span>
            <p>{decision.main_gap || "Convertir informacion en decision visible."}</p>
          </article>
          <article>
            <span>Decision estrategica</span>
            <p>{decision.strategic_decision || "Definir el siguiente movimiento de marca."}</p>
          </article>
          <article>
            <span>Hecho cuando</span>
            <p>{decision.definition_of_done || "Existe una salida revisable y una decision tomada."}</p>
          </article>
        </div>

        <div className="activation-metrics">
          {metrics.map((metric) => (
            <div className={`activation-metric ${metric.type}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        {blockers.length ? (
          <div className="activation-blockers">
            <span>Bloqueos detectados</span>
            {blockers.map((blocker) => (
              <p key={blocker}>{blocker}</p>
            ))}
          </div>
        ) : null}
      </section>

      <div className="portal-section-grid">
        <section className="glass-panel portal-section">
          <div className="panel-kicker">Prioridades accionables</div>
          <div className="activation-list">
            {priorityActions.map((item) => (
              <article className="activation-action-card" key={item.id}>
                <div>
                  <span>{labelize(item.urgency)}</span>
                  <strong>{item.label}</strong>
                </div>
                <p>{item.action}</p>
                <small>{item.why}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel portal-section">
          <div className="panel-kicker">Pipeline productivo</div>
          <div className="activation-list">
            {pipeline.map((item) => (
              <article className="activation-action-card" key={item.id}>
                <div>
                  <span>{labelize(item.status)}</span>
                  <strong>{item.name}</strong>
                </div>
                <p>{item.next_action}</p>
                <small>{item.outcome}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

      {contentMoves.length ? (
        <section className="glass-panel portal-section">
          <div className="panel-kicker">Movimientos de contenido</div>
          <div className="content-move-grid">
            {contentMoves.map((move) => (
              <article className="content-move-card" key={move.id}>
                <span>{move.format}</span>
                <h4>{move.pillar}</h4>
                <p>{move.role}</p>
                <small>{move.observable_output}</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="portal-section-grid">
        <section className="glass-panel portal-section">
          <div className="panel-kicker">Avances</div>
          <div className="portal-timeline">
            {timeline.map((item) => (
              <div className="portal-timeline-item" key={item.label}>
                <i className={item.status === "completed" ? "done" : item.status} />
                <span>{item.label}</span>
                <strong>{statusLabels[item.status] || item.status}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel portal-section">
          <div className="panel-kicker">Proximo paso</div>
          <h3>{recommendation.next_action || "Preparar proxima etapa"}</h3>
          <p>{recommendation.reason || review.recommendation || "La Entidad recomienda una accion concreta antes de crear mas piezas."}</p>
          <div className="portal-actions">
            {actions.map((action) => (
              <button
                className={action.status === "available" ? "primary-action compact" : "secondary-action compact"}
                type="button"
                key={action.label}
                disabled={action.status !== "available" || Boolean(portalActionLoading)}
                onClick={
                  action.label === "Ver analisis"
                    ? () => onPortalAction?.("generate_summary")
                    : action.label === "Ver entregables"
                      ? () => onPortalAction?.("create_sprint")
                      : undefined
                }
              >
                {action.label}
                {action.status !== "available" ? <small>{action.status}</small> : null}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-panel portal-section">
        <div className="portal-section-header">
          <div>
            <div className="panel-kicker">Entregables</div>
            <h3>Material disponible para cliente</h3>
          </div>
          <span className="portal-count">{deliverables.length} visibles</span>
        </div>

        {deliverables.length ? (
          <div className="portal-deliverables-grid">
            {deliverables.map((item) => {
              const canPreview = ["md", "json", "txt"].includes(item.type)
              const assetUrl = `${apiUrl}/clients/${encodeURIComponent(data.client || clientName)}/deliverables/asset?path=${encodeURIComponent(item.path)}`

              return (
                <article className="portal-deliverable-card" key={item.path}>
                  <span>{item.type}</span>
                  <h4>{item.name}</h4>
                  <p>{item.created_at ? `Actualizado: ${item.created_at}` : "Disponible para revision."}</p>
                  <div className="portal-deliverable-actions">
                    {canPreview ? (
                      <button className="secondary-action compact" type="button" onClick={() => onViewDeliverable?.(item.path)}>
                        Ver
                      </button>
                    ) : (
                      <a className="secondary-action compact" href={assetUrl} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    )}
                    <button className="secondary-action compact" type="button" disabled>
                      Descargar
                      <small>Disponible proximamente</small>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="portal-muted">
            Todavia no hay entregables marcados como visibles para cliente. Los materiales internos siguen protegidos hasta revision.
          </p>
        )}
      </section>

      {(deliverableContent || contentLoading || contentError) && (
        <section className="glass-panel portal-section portal-preview">
          <div className="portal-section-header">
            <div>
              <div className="panel-kicker">Vista de analisis</div>
              <h3>{deliverableContent?.name || "Abriendo entregable"}</h3>
            </div>
            <button className="secondary-action compact" type="button" onClick={onCloseDeliverable}>
              Cerrar
            </button>
          </div>
          {contentLoading ? <p>Preparando lectura...</p> : null}
          {contentError ? <p className="portal-muted">{contentError}</p> : null}
          {deliverableContent?.content ? <pre>{deliverableContent.content}</pre> : null}
        </section>
      )}
    </section>
  )
}
