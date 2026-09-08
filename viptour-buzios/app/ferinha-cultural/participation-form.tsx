"use client";
import { useRef, useState, type FormEvent } from "react";
import { participationTypes, interests } from "@/config/ferinha";
import s from "./page.module.css";

export default function ParticipationForm() {
  const [status,setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message,setMessage] = useState("");
  const busy = useRef(false);
  const result = useRef<HTMLParagraphElement>(null);
  const key = useRef<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy.current || status === "success") return;
    const form = event.currentTarget;
    if(!form.reportValidity()) return;
    const data = new FormData(form);
    if(data.getAll("interests").length === 0){setStatus("error");setMessage("Elegí al menos una opción en ¿Qué estás buscando?");form.querySelector<HTMLInputElement>('input[name="interests"]')?.focus();return;}
    busy.current = true;setStatus("loading");setMessage("Enviando tu propuesta…");
    key.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/ferinha-cultural",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key.current},body:JSON.stringify({...Object.fromEntries(data),interests:data.getAll("interests"),consent:data.get("consent")==="on"}),signal:AbortSignal.timeout(15000)});
      const body = await response.json();
      if(!response.ok || body.accepted !== true) throw new Error(response.status===503 ? "Las inscripciones todavía no están habilitadas. Tu propuesta no fue enviada. Conservamos los campos en esta página para que puedas reintentar." : "No pudimos recibir tu propuesta. Revisá los campos e intentá nuevamente.");
      setStatus("success");setMessage("Recibimos tu propuesta. FERINHA CULTURAL está comenzando a construirse con personas como vos.");
    } catch(error){setStatus("error");setMessage(error instanceof Error && error.name!=="TimeoutError" ? error.message : "La conexión demoró demasiado. Podés reintentar.");}
    finally{busy.current=false;requestAnimationFrame(()=>result.current?.focus());}
  }
  return <form className={s.form} onSubmit={submit} aria-busy={status==="loading"}>
    <p className={s.note} id="form-help">Las inscripciones aún no están habilitadas. Podés explorar el formulario, pero tu propuesta todavía no podrá registrarse. * Campos obligatorios.</p>
    <fieldset disabled={status==="loading" || status==="success"} aria-describedby="form-help"><legend>Tu propuesta</legend><div className={s.fields}>
      <label className={s.field}>Nombre completo *<input name="name" autoComplete="name" required minLength={2} maxLength={120}/></label>
      <label className={s.field}>Nombre del proyecto<input name="project" maxLength={150}/></label>
      <label className={s.field}>WhatsApp *<input name="whatsapp" type="tel" autoComplete="tel" required pattern="[+0-9() .-]{7,25}" title="Ingresá entre 7 y 25 caracteres: números, +, espacios, paréntesis o guiones." maxLength={25}/></label>
      <label className={s.field}>Instagram o sitio web<input name="website" maxLength={250} placeholder="@tuproyecto o https://…"/></label>
      <label className={s.field}>Ciudad o localidad *<input name="city" autoComplete="address-level2" required minLength={2} maxLength={120}/></label>
      <label className={s.field}>Tipo de participación *<select name="type" required defaultValue=""><option value="" disabled>Seleccioná una opción</option>{participationTypes.map(t=><option key={t}>{t}</option>)}</select></label>
      <label className={`${s.field} ${s.wide}`}>Contanos brevemente qué haces *<textarea name="description" required minLength={10} maxLength={2000}/></label>
      <label className={`${s.field} ${s.wide}`}>¿Qué te gustaría mostrar o compartir?<textarea name="share" maxLength={2000}/></label>
    </div><fieldset><legend>¿Qué estás buscando? * Elegí una o más opciones.</legend><div className={s.checks}>{interests.map(t=><label className={s.check} key={t}><input type="checkbox" name="interests" value={t}/>{t}</label>)}</div></fieldset>
    <label className={s.field}>¿Qué podrías aportar a la comunidad?<textarea name="contribution" maxLength={2000}/></label>
    <p className={s.note}>Usaremos tus datos únicamente para organizar la comunidad y las oportunidades informadas en este formulario.</p>
    <label className={s.check}><input type="checkbox" name="consent" required/>Acepto recibir información de FERINHA CULTURAL sobre la comunidad y sus oportunidades. *</label>
    <div className={s.actions}><button className={s.button} type="submit">{status==="loading" ? "Enviando…" : status==="success" ? "Propuesta recibida" : "Enviar mi propuesta ↗"}</button></div></fieldset>
    <p ref={result} tabIndex={-1} role="status" aria-live="polite" className={`${s.status} ${status==="error"?s.error:""}`}>{message}</p>
  </form>;
}
