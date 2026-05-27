const moduleCopy = {
  panel: {
    title: "Panel operativo",
    copy: "Carga el contexto del cliente, guarda fuentes y ejecuta el framework completo.",
  },
  engine: {
    title: "Motor cognitivo",
    copy: "Revision del flujo multiagente, sintesis del sistema y respuesta generada.",
  },
  entities: {
    title: "Entidades",
    copy: "Vista del cliente activo como entidad viva dentro del sistema Brand Experience OS.",
  },
  client_portal: {
    title: "Portal del Cliente",
    copy: "Sala estrategica premium para mostrar avance, analisis, entregables y proximos pasos sin exponer el dashboard interno.",
  },
  client_chat: {
    title: "Chat operativo",
    copy: "Operador contextual por cliente para ejecutar prompts, proximos pasos y acciones derivadas del Activation Board.",
  },
  memory: {
    title: "Nucleo de memoria",
    copy: "Analisis guardado, contexto recuperado y entregables asociados a la memoria del cliente.",
  },
  entity_bible: {
    title: "Biblia de la Entidad",
    copy: "Base para revisar el diagnostico, la identidad revelada y el universo estrategico del cliente.",
  },
  visual_ai: {
    title: "IA visual",
    copy: "Entrada directa a visual boards, prompt packs y direccion estetica generada.",
  },
  strategy: {
    title: "Estudio de estrategia",
    copy: "Preparacion de fuentes, readiness y ejecucion del framework desde una mirada estrategica.",
  },
  analytics: {
    title: "Analitica",
    copy: "Lectura de score, confianza, prioridades y estado tecnico del analisis.",
  },
  exports: {
    title: "Exportaciones",
    copy: "Centro de archivos generados, master deliverable y materiales listos para compartir.",
  },
}

export default function WorkspaceModuleHeader({ activeSection = "panel" }) {
  const module = moduleCopy[activeSection] || moduleCopy.panel

  return (
    <section className="glass-panel workspace-module-header">
      <div>
        <div className="panel-kicker">Modulo activo</div>
        <div className="panel-title">{module.title}</div>
        <p>{module.copy}</p>
      </div>
      <div className="module-signal-strip">
        <span>Memoria</span>
        <span>Visual DNA</span>
        <span>Contenido</span>
        <span>Agent OS</span>
      </div>
    </section>
  )
}
