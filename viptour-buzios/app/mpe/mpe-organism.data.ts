export type OrganismStatus = "implemented" | "partial" | "bridge" | "proposed" | "evidence";

export type OrganismNode = {
  id: string;
  label: string;
  organ: string;
  role: string;
  status: OrganismStatus;
  source: string;
  outputs?: string[];
};

export type OrganismView = {
  id: string;
  label: string;
  description: string;
  status: "active" | "next";
  href?: string;
};

export const organismNodes: OrganismNode[] = [
  {
    id: "faseos-kernel",
    label: "FaseOS Kernel",
    organ: "SYSTEM",
    role: "Supervisión y orquestación local del runtime.",
    status: "implemented",
    source: "FASEOS_RUNTIME_OS_AUDIT",
    outputs: ["kernel_status.json", "kernel_events.jsonl", "service_health.csv"],
  },
  {
    id: "earth-server",
    label: "Earth Server",
    organ: "EARTH",
    role: "Ingesta de telemetría y persistencia de estado terrestre.",
    status: "implemented",
    source: "MPE_WORLD_RUNTIME_CANON_CROSSWALK_V1",
    outputs: ["earth_memory.jsonl"],
  },
  {
    id: "live-evolution",
    label: "Live Evolution Bridge",
    organ: "EVOLUTION",
    role: "Consume memoria, ejecuta procesos MPE y emite artefactos.",
    status: "bridge",
    source: "MPE_WORLD_RUNTIME_CANON_CROSSWALK_V1",
    outputs: ["GLB", "metrics", "manifests"],
  },
  {
    id: "live-quantum",
    label: "Live Quantum Bridge",
    organ: "MIND",
    role: "Puente experimental entre telemetría y modelo neural simbólico.",
    status: "bridge",
    source: "CORE_AND_BRAND_EXPERIENCE_OS_AUDIT",
    outputs: ["GLB", "runtime state"],
  },
  {
    id: "morphogenesis",
    label: "Morphogenesis Router",
    organ: "GEOMETRY",
    role: "Mapea experimentos e identidades a familias visuales y artefactos.",
    status: "implemented",
    source: "MPE_WORLD_RUNTIME_CANON_CROSSWALK_V1",
    outputs: ["GLB", "PNG", "visual evidence"],
  },
  {
    id: "memory",
    label: "Memory Fabric",
    organ: "MEMORY",
    role: "Event log + memoria operacional + heritage con provenance.",
    status: "proposed",
    source: "MPE-036 + MASTER architecture",
    outputs: ["event lineage", "working memory", "heritage candidates"],
  },
  {
    id: "source-evidence",
    label: "Source / Evidence",
    organ: "EPISTEMIC",
    role: "Traza fuente → claim → experimento → métrica → resultado → artefacto.",
    status: "proposed",
    source: "MPE source governance + artifact lineage audits",
    outputs: ["provenance graph", "epistemic status"],
  },
];

export const organismViews: OrganismView[] = [
  { id: "alive", label: "ALIVE", description: "Estado global del organismo, órganos, salud y propagación de eventos.", status: "active", href: "/mpe" },
  { id: "perception", label: "PERCEPTION", description: "Cámara, sensores y entradas externas.", status: "active", href: "/mpe/vision" },
  { id: "earth", label: "EARTH", description: "FaseOS, Earth Memory y telemetría física.", status: "active", href: "/mpe/earth" },
  { id: "mind", label: "MIND", description: "Hipótesis, posibilidades, ranking y discovery engine.", status: "active", href: "/mpe/mind" },
  { id: "lab", label: "LAB", description: "Experimentos, perturbaciones, replay y comparación.", status: "next" },
  { id: "evolution", label: "EVOLUTION", description: "Poblaciones, viabilidad, selección, recovery y futuros posibles.", status: "next" },
  { id: "geometry", label: "GEOMETRY", description: "Morphogenesis, atlas, estados y artefactos GLB.", status: "next" },
  { id: "memory", label: "MEMORY", description: "Working memory, episodios, experimentos y búsqueda histórica.", status: "next" },
  { id: "heritage", label: "HERITAGE", description: "Resultados y estructuras promovidas para persistir.", status: "next" },
  { id: "evidence", label: "SOURCE / EVIDENCE", description: "Provenance completa de claims, métricas, resultados y artefactos.", status: "active", href: "/mpe/source" },
  { id: "system", label: "SYSTEM", description: "Servicios, puertos, logs, errores y recovery operativo.", status: "active", href: "/mpe/system" },
];

export const organismFlow = [
  "SENSOR EVENT",
  "EARTH SERVER",
  "EVENT / MEMORY SURFACE",
  "MPE BRIDGE",
  "MORPHOGENESIS",
  "ARTIFACT + MANIFEST",
  "SOURCE / EVIDENCE",
  "ALIVE",
];

export const epistemicLegend = [
  "FOUNDATIONAL / DEFINED",
  "HYPOTHESIS",
  "EXPERIMENTAL DESIGN",
  "EMPIRICAL / INTERNAL",
  "DISCOVERY CANDIDATE",
  "OPEN CASE",
  "PROPOSED",
  "UNKNOWN",
];
