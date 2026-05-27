export default function DeliverablesPanel({
  clientName = "",
  apiUrl = "",
  deliverablesData = null,
  loading = false,
  error = "",
  onRefresh,
  onGenerateDeliverables,
  onGenerateVisualBoards,
  onGenerateMaster,
  onGeneratePromptPack,
  generatingDeliverables = false,
  generatingVisualBoards = false,
  generatingMaster = false,
  generatingPromptPack = false,
  actionMessage = "",
  actionError = "",
  deliverableContent = null,
  contentLoading = false,
  contentError = "",
  onViewDeliverable,
  onCloseDeliverable,
}) {
  const items = deliverablesData?.items || []
  const hasClient = Boolean(clientName.trim())
  const actionInProgress =
    generatingDeliverables || generatingVisualBoards || generatingMaster || generatingPromptPack
  const readableExtensions = new Set([".json", ".md", ".txt"])
  const visualExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"])

  const formatSize = (size = 0) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${size} B`
  }

  const formatDate = (value) => {
    if (!value) return "Sin fecha"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString()
  }

  const displayContent = () => {
    if (!deliverableContent) return ""

    if (deliverableContent.extension !== ".json") {
      return deliverableContent.content
    }

    try {
      return JSON.stringify(JSON.parse(deliverableContent.content), null, 2)
    } catch {
      return deliverableContent.content
    }
  }

  const normalizePath = (item) => item.relative_path || item.name || ""

  const isMaster = (item) => {
    const name = item.name || ""
    return /^MASTER_BRAND_EXPERIENCE(_\d{8}_\d{6})?\.md$/i.test(name)
  }

  const isPromptPack = (item) => {
    const path = normalizePath(item)
    return path.startsWith("05_ENTREGAS/prompt_pack")
  }

  const isVisualBoard = (item) => {
    const path = normalizePath(item)
    const name = item.name || ""

    return (
      path.startsWith("05_ENTREGAS/visuals/") ||
      path.startsWith("05_ENTREGAS/board_specs/") ||
      [
        "brand_identity_board.md",
        "storytelling_strategy_board.md",
        "visual_universe_board.md",
      ].includes(name)
    )
  }

  const isLegacy = (item) => {
    const name = item.name || ""

    return [
      "brand_analysis.md",
      "identity_patch.md",
      "entity_bible.md",
      "visual_universe.md",
      "content_strategy.md",
      "ai_prompts.md",
      "action_plan.md",
      "deliverables_index.json",
    ].includes(name)
  }

  const groups = items.reduce(
    (acc, item) => {
      if (isMaster(item)) {
        acc.main.push(item)
      } else if (isPromptPack(item)) {
        acc.promptPack.push(item)
      } else if (isVisualBoard(item)) {
        acc.visuals.push(item)
      } else if (isLegacy(item)) {
        acc.legacy.push(item)
      } else {
        acc.other.push(item)
      }

      return acc
    },
    { main: [], promptPack: [], visuals: [], legacy: [], other: [] },
  )

  const sortByModified = (list) =>
    [...list].sort((a, b) => new Date(b.modified_at || 0) - new Date(a.modified_at || 0))

  const renderDeliverableCard = (deliverable) => (
    <div
      key={deliverable.relative_path}
      className={visualExtensions.has(deliverable.extension) ? "deliverable-card visual-preview-card" : "deliverable-card"}
    >
      {visualExtensions.has(deliverable.extension) && apiUrl && clientName ? (
        <img
          className="deliverable-visual-preview"
          src={`${apiUrl}/clients/${encodeURIComponent(clientName)}/deliverables/asset?path=${encodeURIComponent(deliverable.relative_path)}`}
          alt={deliverable.name}
        />
      ) : null}

      <div className="deliverable-card-title">{deliverable.name}</div>
      <span className="deliverable-chip">{deliverable.type}</span>
      <div className="deliverable-path">{deliverable.relative_path}</div>

      <div className="deliverable-meta">
        <span>Extension</span>
        <strong>{deliverable.extension || "Sin extension"}</strong>
        <span>Tamano</span>
        <strong>{formatSize(deliverable.size)}</strong>
        <span>Modificado</span>
        <strong>{formatDate(deliverable.modified_at)}</strong>
      </div>

      {typeof deliverable.children_count === "number" ? (
        <div className="deliverable-meta">
          <span>Contenido</span>
          <strong>{deliverable.children_count} items</strong>
        </div>
      ) : null}

      {deliverable.type === "file" && readableExtensions.has(deliverable.extension) ? (
        <button
          className="secondary-action"
          type="button"
          onClick={() => onViewDeliverable(deliverable.relative_path)}
          disabled={contentLoading}
        >
          Ver
        </button>
      ) : null}
    </div>
  )

  const renderGroup = (title, description, list, variant = "") => {
    if (!list.length) return null

    return (
      <div className={`deliverable-section ${variant}`}>
        <div className="deliverable-section-header">
          <div>
            <div className="deliverable-section-title">{title}</div>
            <p className="deliverable-section-copy">{description}</p>
          </div>
          <span className="deliverable-count">{list.length}</span>
        </div>

        <div className="deliverable-grid">
          {sortByModified(list).map(renderDeliverableCard)}
        </div>
      </div>
    )
  }

  return (
    <section className="glass-panel deliverable-panel">
      <div className="panel-kicker">Brand Experience Framework</div>
      <div className="panel-title">Entregables</div>

      <div className="dashboard-actions">
        <button
          className="secondary-action"
          type="button"
          onClick={onRefresh}
          disabled={loading || !hasClient}
        >
          {loading ? "Actualizando..." : "Actualizar entregables"}
        </button>

        <button
          className="secondary-action"
          type="button"
          onClick={onGenerateDeliverables}
          disabled={actionInProgress || !hasClient}
        >
          {generatingDeliverables ? "Generando..." : "Generar entregables"}
        </button>

        <button
          className="secondary-action"
          type="button"
          onClick={onGenerateVisualBoards}
          disabled={actionInProgress || !hasClient}
        >
          {generatingVisualBoards ? "Generando boards..." : "Generar visual boards"}
        </button>

        <button
          className="primary-action"
          type="button"
          onClick={onGenerateMaster}
          disabled={actionInProgress || !hasClient}
        >
          {generatingMaster ? "Generando master..." : "Generar master"}
        </button>

        <button
          className="secondary-action"
          type="button"
          onClick={onGeneratePromptPack}
          disabled={actionInProgress || !hasClient}
        >
          {generatingPromptPack ? "Generando prompts..." : "Generar Prompt Pack"}
        </button>
      </div>

      {!hasClient ? (
        <p className="muted-copy">Selecciona un cliente para ver entregables.</p>
      ) : null}

      {error ? <p className="muted-copy">{error}</p> : null}
      {actionMessage ? <p className="soft-status">{actionMessage}</p> : null}
      {actionError ? <p className="soft-warning">{actionError}</p> : null}

      {hasClient && loading ? (
        <p className="muted-copy">Cargando entregables...</p>
      ) : null}

      {hasClient && !loading && !error && deliverablesData && !items.length ? (
        <p className="muted-copy">No hay entregables todavía.</p>
      ) : null}

      {contentLoading ? <p className="muted-copy">Abriendo entregable...</p> : null}
      {contentError ? <p className="soft-warning">{contentError}</p> : null}

      {deliverableContent ? (
        <div className="deliverable-reader">
          <div className="deliverable-reader-header">
            <div>
              <div className="deliverable-card-title">{deliverableContent.name}</div>
              <div className="deliverable-path">{deliverableContent.relative_path}</div>
            </div>

            <button className="secondary-action" type="button" onClick={onCloseDeliverable}>
              Cerrar
            </button>
          </div>

          <div className="deliverable-meta">
            <span>Extension</span>
            <strong>{deliverableContent.extension}</strong>
            <span>Tamano</span>
            <strong>{formatSize(deliverableContent.size)}</strong>
          </div>

          <pre className="deliverable-content-block">{displayContent()}</pre>
        </div>
      ) : null}

      {items.length ? (
        <div className="deliverable-groups">
          {renderGroup(
            "Principal",
            "Archivo maestro unificado listo para revisar o entregar.",
            groups.main,
            "deliverable-section-main",
          )}

          {renderGroup(
            "Prompt Pack",
            "Prompts y contexto maestro listos para copiar y usar en ChatGPT u otra herramienta creativa.",
            groups.promptPack,
          )}

          {renderGroup(
            "Visual Boards",
            "Boards, specs y visuales generados para la presentación de marca.",
            groups.visuals,
          )}

          {renderGroup(
            "Legacy / archivos anteriores",
            "Archivos separados generados antes del master. Se mantienen como historial.",
            groups.legacy,
            "deliverable-section-legacy",
          )}

          {renderGroup(
            "Otros",
            "Archivos no clasificados dentro de la carpeta de entregables.",
            groups.other,
          )}
        </div>
      ) : null}
    </section>
  )
}
