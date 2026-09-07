export type ObservationMode = "OBSERVING" | "INTERPRETING" | "PROPOSING" | "UNKNOWN";

export type VisibleEntity = {
  id: string;
  kind: "heading" | "action" | "price" | "text";
  text: string;
};

export type VisibleScene = {
  pathname: string;
  area: string;
  title: string | null;
  entities: VisibleEntity[];
  capturedAt: number;
};

export type Observation = {
  mode: ObservationMode;
  line: string;
  source: string;
  evidence: string[];
  differences: string[];
  possibilities: string[];
  epistemicStatus: "OBSERVED" | "INTERPRETED" | "PROPOSED" | "UNKNOWN";
};

const clean = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();
const short = (value: string, max = 150) => value.length > max ? `${value.slice(0, max - 1)}…` : value;

function visible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.bottom > 72 && r.top < window.innerHeight * .86;
}

function kindFor(el: HTMLElement, text: string): VisibleEntity["kind"] {
  if (/^H[1-6]$/.test(el.tagName)) return "heading";
  if (el.matches("a,button,[role=button]")) return "action";
  if (/(?:R\$|US\$|USD|BRL|€|£|\$)\s?\d/i.test(text)) return "price";
  return "text";
}

export function captureVisibleScene(pathname: string, area: string): VisibleScene {
  const selectors = "main h1,main h2,main h3,main p,main a,main button,main [data-self-observer],section h1,section h2,section h3,section p,section a,section button";
  const seen = new Set<string>();
  const entities: VisibleEntity[] = [];
  for (const [index, el] of [...document.querySelectorAll<HTMLElement>(selectors)].entries()) {
    if (!visible(el)) continue;
    const text = short(clean(el.dataset.selfObserver || el.innerText), 180);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    entities.push({ id: `${pathname}:${index}`, kind: kindFor(el, text), text });
    if (entities.length >= 24) break;
  }
  return { pathname, area, title: clean(document.title) || null, entities, capturedAt: Date.now() };
}

export function observeScene(current: VisibleScene, previous: VisibleScene | null): Observation {
  if (!current.entities.length) return {
    mode: "UNKNOWN", line: "No encuentro suficiente evidencia visible para interpretar esta zona.",
    source: `VISIBLE_SCENE · ${current.pathname}`, evidence: [], differences: [], possibilities: [], epistemicStatus: "UNKNOWN"
  };

  const previousTexts = new Set(previous?.entities.map(entity => entity.text) ?? []);
  const appeared = current.entities.filter(entity => !previousTexts.has(entity.text));
  const differences = previous && previous.pathname === current.pathname
    ? appeared.slice(0, 4).map(entity => `Δ visible: ${entity.text}`)
    : previous ? [`Δ contexto: ${previous.area} → ${current.area}`] : [];

  const heading = current.entities.find(entity => entity.kind === "heading");
  const action = current.entities.find(entity => entity.kind === "action");
  const price = current.entities.find(entity => entity.kind === "price");
  const evidence = [heading, price, action].filter(Boolean).map(entity => `${entity!.kind.toUpperCase()}: ${entity!.text}`);

  // V0.1 deliberately keeps interpretation deterministic and evidence-bound.
  // Semantic/LLM cognition can consume this contract later without replacing perception.
  if (differences.length) return {
    mode: "INTERPRETING",
    line: short(`Detecto una diferencia en ${current.area}: ${differences[0].replace(/^Δ (visible|contexto): /, "")}`),
    source: `VISIBLE_SCENE + Δ · ${current.pathname}`, evidence, differences,
    possibilities: action ? [`Posibilidad observable: ${action.text}`] : [], epistemicStatus: "INTERPRETED"
  };

  if (heading) return {
    mode: "OBSERVING", line: short(`Estoy observando ${current.area}: ${heading.text}`),
    source: `VISIBLE_SCENE · ${current.pathname}`, evidence, differences: [],
    possibilities: action ? [`Acción visible: ${action.text}`] : [], epistemicStatus: "OBSERVED"
  };

  return {
    mode: "OBSERVING", line: short(`Observo: ${current.entities[0].text}`), source: `VISIBLE_SCENE · ${current.pathname}`,
    evidence, differences: [], possibilities: [], epistemicStatus: "OBSERVED"
  };
}
