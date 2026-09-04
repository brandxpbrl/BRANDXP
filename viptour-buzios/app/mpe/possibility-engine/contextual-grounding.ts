import type { MpeState, Possibility, PossibilityOperator, StateFact } from "./model";

export type ContextualPossibilityGrounding = {
  possibilityId: string;
  structuralOperator: PossibilityOperator;
  contextualTitle: string;
  transformation: string;
  requires: string[];
  opens: string[];
  mayClose: string[];
  unknowns: string[];
  cheapExperiment: string;
  sourceFactIds: string[];
  boundary: "CONTEXTUAL_GROUNDING_IS_DERIVED_NOT_EVIDENCE";
};

const labels = (facts: StateFact[]) => facts.map((fact) => fact.label).filter(Boolean);
const first = (facts: StateFact[], fallback: string) => facts[0]?.label ?? fallback;
const pair = (facts: StateFact[], fallback: string) => {
  const values = labels(facts).slice(0, 2);
  return values.length ? values.join(" + ") : fallback;
};

const titleFor = (op: PossibilityOperator, state: MpeState) => {
  const resource = first(state.resources, "un recurso disponible");
  const constraint = first(state.constraints, "una restricción relevante");
  const unknown = first(state.unknowns, "la incertidumbre principal");
  const resources = pair(state.resources, "recursos existentes");
  switch (op) {
    case "combine": return `Combinar ${resources}`;
    case "reuse": return `Reutilizar ${resource} en una función nueva`;
    case "connect": return `Conectar ${resource} con una capacidad o actor complementario`;
    case "remove_constraint": return `Reducir el impacto de: ${constraint}`;
    case "cooperate": return `Buscar cooperación para complementar ${resource}`;
    case "divide": return `Separar “${state.objective}” en una prueba mínima`;
    case "delay": return `Postergar el compromiso irreversible y observar ${unknown}`;
    case "experiment": return `Probar primero: ${unknown}`;
    case "acquire": return `Adquirir lo que falta para avanzar hacia ${state.objective}`;
    case "scale": return `Escalar una parte ya observable antes que todo el sistema`;
    case "abandon": return `Cerrar temporalmente una vía incompatible con ${constraint}`;
    case "mutate": return `Modificar una rama existente frente a ${constraint}`;
  }
};

export function groundPossibility(state: MpeState, possibility: Possibility): ContextualPossibilityGrounding {
  const op = possibility.operators[0] ?? "experiment";
  const constraint = first(state.constraints, "la restricción todavía no explicitada");
  const unknown = first(state.unknowns, "la incertidumbre principal");
  const resource = first(state.resources, "los recursos declarados");
  const contextualTitle = titleFor(op, state);
  const requires = op === "remove_constraint" ? [constraint] : op === "experiment" ? [unknown] : [resource];
  const opens = [
    op === "experiment" || op === "delay" ? `Nueva evidencia sobre ${unknown}` : `Una ruta alternativa hacia: ${state.objective}`,
    "Información para decidir qué rama explorar después",
  ];
  const mayClose = [
    op === "remove_constraint" ? `La forma actual de convivir con ${constraint}` : "Alguna alternativa que dependa de mantener intacta la configuración actual",
  ];
  const unknowns = state.unknowns.length ? labels(state.unknowns).slice(0, 3) : ["No hay desconocidos explícitos; eso no elimina incertidumbre."];
  const cheapExperiment = op === "experiment"
    ? `Diseñar una prueba reversible que produzca una observación sobre ${unknown}.`
    : `Aplicar ${contextualTitle.toLowerCase()} en una escala mínima y registrar qué dependencias, restricciones y opciones cambian antes de expandirla.`;
  return {
    possibilityId: possibility.id,
    structuralOperator: op,
    contextualTitle,
    transformation: `${contextualTitle}. Objetivo declarado: ${state.objective}.`,
    requires,
    opens,
    mayClose,
    unknowns,
    cheapExperiment,
    sourceFactIds: [...state.resources, ...state.constraints, ...state.unknowns].map((fact) => fact.id),
    boundary: "CONTEXTUAL_GROUNDING_IS_DERIVED_NOT_EVIDENCE",
  };
}

export function groundPossibilities(state: MpeState, possibilities: Possibility[]) {
  return new Map(possibilities.map((possibility) => [possibility.id, groundPossibility(state, possibility)] as const));
}
