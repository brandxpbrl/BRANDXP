"use client";
import { useEffect, useRef, useState } from "react";
import domain from "@/lib/crm-nz/domain";
import type {
  Member,
  Lead,
  LeadData,
  Snapshot,
  Evidence,
} from "@/lib/crm-nz/domain";
import styles from "./workspace.module.css";

const money = (cents: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(
    cents / 100,
  );
const dateText = (date: string) =>
  date
    ? new Date(date).toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" })
    : "Sin fecha";
const stages = ["new", "contacted", "meeting", "proposal", "won", "lost"];
const stageLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  meeting: "Reunión",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};
const opportunities: Record<string, string> = {
  web_missing: "Desarrollo web",
  web_redesign: "Rediseño",
  branding: "Branding",
};
const iso = (v: FormDataEntryValue | null) =>
  v ? new Date(String(v)).toISOString() : "";
const centsInput = (value: FormDataEntryValue | null) => {
  const s = String(value || "0");
  if (!/^\d+(\.\d{1,2})?$/.test(s))
    throw Error("Usa un importe positivo con máximo dos decimales.");
  return Math.round(Number(s) * 100);
};
type Place = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  attributions?: { provider: string; providerUri: string }[];
};
async function api(path: string, body?: unknown) {
  const response = await fetch(`/api/crm-nz/${path}`, {
    method: body ? "POST" : "GET",
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok)
    throw Object.assign(
      new Error(result.error || "No se pudo completar la operación"),
      { status: response.status },
    );
  return result;
}
export default function CrmWorkspace({
  member,
  logout,
}: {
  member: Member;
  logout: () => Promise<void>;
}) {
  const [state, setState] = useState<Snapshot | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("pipeline"),
    [selected, setSelected] = useState<string | null>(null),
    [filter, setFilter] = useState("");
  const [places, setPlaces] = useState<Place[]>([]),
    [placeId, setPlaceId] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ serialized: string; id: string } | null>(null);
  useEffect(() => {
    let active = true;
    api("state")
      .then((data) => {
        if (active) setState(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function execute(command: unknown) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const serialized = JSON.stringify(command);
      if (pending.current?.serialized !== serialized)
        pending.current = { serialized, id: crypto.randomUUID() };
      const result = await api("state", {
        command,
        requestId: pending.current.id,
      });
      setState(result);
      pending.current = null;
      setNotice("Guardado en el CRM NZ.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function reload() {
    setBusy(true);
    setError("");
    try {
      setState(await api("state"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setPlaces([]);
    const form = new FormData(event.currentTarget);
    try {
      const result = await api("places", {
        region: form.get("region"),
        category: form.get("category"),
      });
      setPlaces(result.places);
      setNotice(
        result.places.length
          ? "Resultados temporales. Guarda sólo el Place ID y verifica los datos en una fuente independiente."
          : "Google Places no devolvió resultados.",
      );
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setPlaces([]), 300000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const lead = state?.leads.find((l) => l.id === selected);
  const leads = (state?.leads || [])
    .filter((l) => !filter || l.stage === filter)
    .toSorted((a, b) => b.score - a.score);
  return (
    <main className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>BRAND EXPERIENCE / NZ · PRIVATE</p>
          <h1>Commercial workspace.</h1>
        </div>
        <div>
          <span>
            {member.role === "admin"
              ? "Administrador"
              : member.role === "ben"
                ? "Ben"
                : "Cassia"}
          </span>
          <small>{member.email}</small>
          <form action={logout}>
            <button className={styles.secondary}>Cerrar sesión</button>
          </form>
        </div>
      </header>
      <nav className={styles.nav} aria-label="Secciones CRM">
        {[
          ["pipeline", "Oportunidades"],
          ["capture", "Captación"],
          ...(member.role === "admin" ? [["finance", "Administración"]] : []),
        ].map(([id, label]) => (
          <button
            key={id}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
        <a
          href="https://www.riovibestransfer.com/brand-experience"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portafolio ↗
        </a>
        <button disabled={busy} onClick={reload}>
          Actualizar
        </button>
      </nav>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      {!state ? (
        <p role="status">
          {error
            ? "Conexión NZ pendiente. No se muestran datos comerciales."
            : "Cargando el CRM privado…"}
        </p>
      ) : (
        <>
          <section className={styles.metrics} aria-label="Dashboard">
            {[
              ["Clientes", state.leads.length],
              [
                "Contactos",
                state.activities.filter((a) => a.kind === "contact").length,
              ],
              [
                "Oportunidades con evidencia",
                state.leads.filter((l) => l.score > 0).length,
              ],
              [
                "Ventas ganadas",
                state.leads.filter((l) => l.stage === "won").length,
              ],
            ].map(([label, value]) => (
              <article key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </article>
            ))}
          </section>
          {tab === "capture" && (
            <section className={styles.panel}>
              <h2>Descubrir empresas</h2>
              <p>
                Busca en Nueva Zelanda. Los datos de Google Places son
                temporales y no se copian al Sheet. Máximo 30 búsquedas por
                usuario y día UTC.
              </p>
              <form onSubmit={search} className={styles.inline}>
                <label>
                  Región
                  <select name="region">
                    {domain.regions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Categoría
                  <select name="category">
                    {domain.categories.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
                <button disabled={busy}>Buscar empresas</button>
              </form>
              {places.length > 0 && (
                <>
                  <p className={styles.google}>Google Maps</p>
                  <div className={styles.results}>
                    {places.map((p) => (
                      <article key={p.id}>
                        <h3>{p.displayName?.text}</h3>
                        <p>{p.formattedAddress}</p>
                        {p.googleMapsUri && (
                          <a
                            href={p.googleMapsUri}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Ver en Google Maps ↗
                          </a>
                        )}
                        {p.attributions?.map((a, i) => (
                          <a
                            key={i}
                            href={a.providerUri}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {a.provider}
                          </a>
                        ))}
                        <button
                          disabled={busy}
                          onClick={() => {
                            setPlaceId(p.id);
                            setSelected(null);
                            setTab("pipeline");
                            setNotice(
                              "Place ID seleccionado. Introduce los datos desde el sitio oficial u otra fuente independiente.",
                            );
                          }}
                        >
                          Usar sólo Place ID
                        </button>
                      </article>
                    ))}
                  </div>
                </>
              )}
              <p>
                <a href="/brandexperience/crm-nz/privacy">
                  Privacidad y condiciones de captación
                </a>
              </p>
            </section>
          )}
          {tab === "pipeline" && (
            <div className={styles.columns}>
              <section className={styles.panel}>
                <div className={styles.inline}>
                  <h2>Pipeline</h2>
                  <button
                    onClick={() => {
                      setSelected(null);
                      setPlaceId("");
                    }}
                  >
                    Nuevo cliente
                  </button>
                </div>
                <label>
                  Filtrar estado
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {stageLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <div className={styles.leads}>
                  {leads.map((l) => (
                    <button
                      key={l.id}
                      className={
                        selected === l.id ? styles.selected : styles.lead
                      }
                      onClick={() => setSelected(l.id)}
                    >
                      <strong>{l.businessName}</strong>
                      <span>
                        {l.region} · {stageLabels[l.stage]}
                      </span>
                      <span>
                        {l.owner || "Sin asignar"} · {l.score} puntos ·{" "}
                        {l.priority}
                      </span>
                      <small>
                        {l.nextStep || "Sin próximo paso"} ·{" "}
                        {dateText(l.nextStepAt)}
                      </small>
                    </button>
                  ))}
                  {!leads.length && <p>No hay clientes en esta vista.</p>}
                </div>
              </section>
              <section className={styles.panel}>
                <LeadEditor
                  key={lead ? `${lead.id}-${lead.revision}` : `new-${placeId}`}
                  lead={lead}
                  placeId={placeId}
                  member={member}
                  busy={busy}
                  save={execute}
                />
                {lead && (
                  <>
                    <h2>Actividad y contactos</h2>
                    <ActivityForm lead={lead} busy={busy} save={execute} />
                    <ol className={styles.timeline}>
                      {state.activities
                        .filter((a) => a.leadId === lead.id)
                        .toReversed()
                        .map((a) => (
                          <li key={a.id}>
                            <strong>{a.kind}</strong>
                            <p>{a.note}</p>
                            <small>
                              {dateText(a.occurredAt)} · {a.actor}
                              <br />
                              Registrado {dateText(a.at)}
                            </small>
                          </li>
                        ))}
                    </ol>
                    <h3>Asistencia opcional</h3>
                    <p>
                      Gemini genera un borrador a partir de tus evidencias.
                      Requiere activación y revisión humana.
                    </p>
                    <button
                      disabled={busy || !lead.evidence.length}
                      onClick={async () => {
                        setBusy(true);
                        setError("");
                        try {
                          const result = await api("gemini", {
                            leadId: lead.id,
                          });
                          setNotice(`${result.status}\n${result.draft}`);
                        } catch (e) {
                          setError((e as Error).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Solicitar borrador Gemini
                    </button>
                  </>
                )}
              </section>
            </div>
          )}
          {tab === "finance" && member.role === "admin" && state.finance && (
            <section className={styles.panel}>
              <h2>Administración · NZD</h2>
              <p>
                Ingresos cobrados menos costos registrados. El beneficio
                positivo se reparte 55% fundador / 45% socios comerciales. Los
                anticipos del fundador son deuda separada.
              </p>
              <section className={styles.metrics}>
                {Object.entries({
                  Ingresos: state.finance.revenue,
                  Costos: state.finance.cost,
                  Resultado: state.finance.profit,
                  "Beneficio distribuible": state.finance.distributable,
                  "55% fundador": state.finance.founderShare,
                  "45% socios": state.finance.partnerShare,
                  "Anticipos pendientes": state.finance.advanceDue,
                  "Saldo fundador": state.finance.founderBalance,
                  "Saldo socios": state.finance.partnerDue,
                  "Caja disponible": state.finance.cash,
                }).map(([label, value]) => (
                  <article key={label}>
                    <small>{label}</small>
                    <strong>{money(value)}</strong>
                  </article>
                ))}
              </section>
              <FinanceForm busy={busy} save={execute} />
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Fecha NZ</th>
                      <th>Tipo</th>
                      <th>Importe</th>
                      <th>Nota</th>
                      <th>Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.transactions.toReversed().map((t) => (
                      <tr key={t.id}>
                        <td>{dateText(t.occurredAt)}</td>
                        <td>{t.kind}</td>
                        <td>{money(t.amountCents)}</td>
                        <td>{t.note}</td>
                        <td>{t.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
      <footer>
        Brand Experience · NZ pilot · Historial mostrado en Pacific/Auckland;
        los campos de fecha usan la zona horaria de tu navegador.{" "}
        <a href="/brandexperience/crm-nz/privacy">Privacidad</a>
      </footer>
    </main>
  );
}
function LeadEditor({
  lead,
  placeId,
  member,
  busy,
  save,
}: {
  lead?: Lead;
  placeId: string;
  member: Member;
  busy: boolean;
  save: (command: unknown) => Promise<void>;
}) {
  const [evidence, setEvidence] = useState<Evidence[]>(lead?.evidence || []);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const f = new FormData(event.currentTarget);
    try {
      const str = (name: string) => String(f.get(name) || "");
      const data: LeadData = {
        businessName: str("businessName"),
        placeId: str("placeId"),
        website: str("website"),
        contactEmail: str("contactEmail"),
        phone: str("phone"),
        region: str("region"),
        category: str("category"),
        sourceUrl: str("sourceUrl"),
        sourceVerifiedAt: iso(f.get("sourceVerifiedAt")),
        owner: (str("owner") || null) as LeadData["owner"],
        stage: str("stage"),
        nextStep: str("nextStep"),
        nextStepAt: iso(f.get("nextStepAt")),
        proposalCents: centsInput(f.get("proposal")),
        evidence,
      };
      await save({
        type: lead ? "updateLead" : "createLead",
        leadId: lead?.id,
        revision: lead?.revision,
        data,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <h2>{lead ? "Ficha comercial" : "Nuevo cliente"}</h2>
      <p>
        Registra datos verificados en una fuente independiente de Google Places.
        Las evidencias son observaciones humanas; los puntos son una regla de
        priorización.
      </p>
      <form onSubmit={submit} className={styles.form}>
        <label>
          Nombre del negocio
          <input
            name="businessName"
            required
            maxLength={200}
            defaultValue={lead?.businessName}
          />
        </label>
        <label>
          Place ID (opcional)
          <input
            name="placeId"
            maxLength={300}
            defaultValue={lead?.placeId || placeId}
          />
        </label>
        <label>
          Sitio oficial
          <input name="website" type="url" defaultValue={lead?.website} />
        </label>
        <label>
          Email de contacto
          <input
            name="contactEmail"
            type="email"
            defaultValue={lead?.contactEmail}
          />
        </label>
        <label>
          Teléfono
          <input name="phone" maxLength={100} defaultValue={lead?.phone} />
        </label>
        <label>
          Región
          <select name="region" defaultValue={lead?.region}>
            {domain.regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select name="category" defaultValue={lead?.category}>
            {domain.categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Fuente independiente (URL)
          <input
            name="sourceUrl"
            type="url"
            required
            defaultValue={lead?.sourceUrl}
          />
        </label>
        <label>
          Fecha de verificación
          <input
            name="sourceVerifiedAt"
            type="datetime-local"
            required
            defaultValue={
              lead?.sourceVerifiedAt ? localDate(lead.sourceVerifiedAt) : ""
            }
          />
        </label>
        <label>
          Responsable
          <select
            name="owner"
            defaultValue={
              lead?.owner || (member.role === "admin" ? "" : member.role)
            }
          >
            {member.role === "admin" ? (
              <>
                <option value="">Sin asignar</option>
                <option value="ben">Ben</option>
                <option value="cassia">Cassia</option>
              </>
            ) : (
              <option value={member.role}>{member.role}</option>
            )}
          </select>
        </label>
        <label>
          Estado
          <select name="stage" defaultValue={lead?.stage || "new"}>
            {stages.map((s) => (
              <option value={s} key={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Valor propuesta (NZD)
          <input
            name="proposal"
            type="number"
            min="0"
            step="0.01"
            defaultValue={(lead?.proposalCents || 0) / 100}
          />
        </label>
        <label>
          Próximo paso
          <textarea
            name="nextStep"
            maxLength={1500}
            defaultValue={lead?.nextStep}
          />
        </label>
        <label>
          Seguimiento
          <input
            name="nextStepAt"
            type="datetime-local"
            defaultValue={lead?.nextStepAt ? localDate(lead.nextStepAt) : ""}
          />
        </label>
        <fieldset className={styles.full}>
          <legend>Evidencias · hasta 12 · vigencia 90 días</legend>
          {evidence.map((e, i) => (
            <div key={i} className={styles.evidence}>
              <strong>{opportunities[e.kind]}</strong>
              <a href={e.url} target="_blank" rel="noopener noreferrer">
                Fuente ↗
              </a>
              <p>{e.note}</p>
              <small>{dateText(e.observedAt)}</small>
              <button
                type="button"
                onClick={() => setEvidence(evidence.filter((_, n) => n !== i))}
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={evidence.length >= 12}
            onClick={() =>
              setEvidence([
                ...evidence,
                {
                  kind: "branding",
                  url: "",
                  note: "",
                  observedAt: new Date().toISOString(),
                },
              ])
            }
          >
            Añadir evidencia
          </button>
          {evidence.map((e, i) => (
            <div className={styles.evidenceFields} key={`edit-${i}`}>
              <label>
                Tipo
                <select
                  value={e.kind}
                  onChange={(event) =>
                    setEvidence(
                      evidence.map((v, n) =>
                        n === i
                          ? {
                              ...v,
                              kind: event.target.value as Evidence["kind"],
                            }
                          : v,
                      ),
                    )
                  }
                >
                  {Object.entries(opportunities).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                URL verificable
                <input
                  type="url"
                  required
                  value={e.url}
                  onChange={(event) =>
                    setEvidence(
                      evidence.map((v, n) =>
                        n === i ? { ...v, url: event.target.value } : v,
                      ),
                    )
                  }
                />
              </label>
              <label>
                Observación concreta
                <textarea
                  required
                  maxLength={1500}
                  value={e.note}
                  onChange={(event) =>
                    setEvidence(
                      evidence.map((v, n) =>
                        n === i ? { ...v, note: event.target.value } : v,
                      ),
                    )
                  }
                />
              </label>
              <label>
                Fecha observada
                <input
                  type="datetime-local"
                  required
                  value={localDate(e.observedAt)}
                  onChange={(event) => {
                    if (event.target.value)
                      setEvidence(
                        evidence.map((v, n) =>
                          n === i
                            ? {
                                ...v,
                                observedAt: new Date(
                                  event.target.value,
                                ).toISOString(),
                              }
                            : v,
                        ),
                      );
                  }}
                />
              </label>
            </div>
          ))}
        </fieldset>
        <label className={styles.full}>
          <span>
            <input type="checkbox" required /> Verifiqué los datos en la fuente
            indicada; no copié contenido de Google Places.
          </span>
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>{busy ? "Guardando…" : "Guardar ficha"}</button>
      </form>
    </>
  );
}
function localDate(value: string) {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
function ActivityForm({
  lead,
  busy,
  save,
}: {
  lead: Lead;
  busy: boolean;
  save: (command: unknown) => Promise<void>;
}) {
  const [error, setError] = useState("");
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const f = new FormData(event.currentTarget);
        try {
          void save({
            type: "addActivity",
            leadId: lead.id,
            data: {
              kind: f.get("kind"),
              note: f.get("note"),
              occurredAt: iso(f.get("occurredAt")),
            },
          });
        } catch (e) {
          setError((e as Error).message);
        }
      }}
    >
      <label>
        Tipo
        <select name="kind">
          {["contact", "response", "meeting", "proposal", "note"].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <label>
        Fecha del contacto
        <input name="occurredAt" type="datetime-local" required />
      </label>
      <label className={styles.full}>
        Detalle
        <textarea name="note" maxLength={3000} required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button disabled={busy}>Registrar actividad</button>
    </form>
  );
}
function FinanceForm({
  busy,
  save,
}: {
  busy: boolean;
  save: (command: unknown) => Promise<void>;
}) {
  const [error, setError] = useState("");
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const f = new FormData(event.currentTarget);
        try {
          void save({
            type: "recordTransaction",
            data: {
              kind: f.get("kind"),
              amountCents: centsInput(f.get("amount")),
              note: f.get("note"),
              occurredAt: iso(f.get("occurredAt")),
              leadId: "",
            },
          });
        } catch (e) {
          setError((e as Error).message);
        }
      }}
    >
      <label>
        Movimiento
        <select name="kind">
          {[
            ["revenue", "Ingreso cobrado"],
            ["cost", "Costo"],
            ["founder_advance", "Anticipo fundador"],
            ["founder_repayment", "Reembolso anticipo"],
            ["founder_distribution", "Pago beneficio fundador"],
            ["partner_distribution", "Pago beneficio socios"],
          ].map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Importe NZD
        <input name="amount" type="number" min="0.01" step="0.01" required />
      </label>
      <label>
        Fecha
        <input name="occurredAt" type="datetime-local" required />
      </label>
      <label>
        Concepto
        <input name="note" required maxLength={1500} />
      </label>
      {error && <p role="alert">{error}</p>}
      <button disabled={busy}>Registrar movimiento</button>
    </form>
  );
}
