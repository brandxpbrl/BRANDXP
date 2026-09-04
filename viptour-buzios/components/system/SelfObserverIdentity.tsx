"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {usePathname} from "next/navigation";

export type SelfObserverPacket={observed?:string[];interpreted?:string[];proposed?:string[];unknown?:string[];provenance?:string[];source?:string};
type ObserverMode="OBSERVING"|"INTERPRETING"|"PROPOSING"|"UNKNOWN";
type NarrativeState={mode:ObserverMode;line:string;source:string};
type RouteStory={area:string;intro:string[];lang:"es-AR"|"pt-BR"|"en-US"};

const STORIES:[RegExp,RouteStory][]=[
  [/^\/mpe(\/|$)/,{area:"MPE ORGANISM",lang:"es-AR",intro:["Entraste en MPE, el organismo de investigación de ORBIS.","Aquí el sistema explora posibilidades, memoria, geometría, literatura y evolución sin confundir una hipótesis con evidencia."]}],
  [/^\/felatours-international(\/|$)/,{area:"FELA TOURS INTERNATIONAL",lang:"en-US",intro:["Welcome to Fela Tours International, the English-speaking travel experience inside ORBIS.","This space connects visitors with tours, transfers and curated experiences in Rio de Janeiro and the surrounding destinations."]}],
  [/^\/felatours(\/|$)/,{area:"FELA TOURS",lang:"es-AR",intro:["Estás en Fela Tours, el espacio de turismo y experiencias de ORBIS.","Desde aquí podés descubrir traslados, tours y experiencias en Río de Janeiro, Búzios, Angra dos Reis, Ilha Grande y otros destinos."]}],
  [/^\/zaptdeliverybz(\/|$)/,{area:"ZAPT DELIVERY",lang:"pt-BR",intro:["Você entrou na ZAPT Delivery Búzios, a operação de delivery noturno dentro do ecossistema ORBIS.","Aqui a experiência foi pensada para pedidos rápidos de bebidas, lanches e combos durante a madrugada em Búzios."]}],
  [/^\/mell-stone(\/|$)/,{area:"MELL & STONE",lang:"es-AR",intro:["Estás en Mell and Stone, una identidad de joyería integrada al ecosistema ORBIS.","Este espacio presenta su universo visual, su propuesta y sus piezas desde una experiencia propia, conectada al resto del portal."]}],
  [/^\/$/,{area:"ORBIS",lang:"es-AR",intro:["Bienvenido a ORBIS. Everything connected.","ORBIS es el portal que reúne marcas, servicios, experiencias y sistemas independientes dentro de un mismo ecosistema.","Cada espacio conserva su identidad, pero comparte una misma puerta de entrada. A medida que recorras el sitio, voy a acompañarte y narrar lo que aparece en pantalla."]}],
];

function storyFor(pathname:string):RouteStory{return STORIES.find(([pattern])=>pattern.test(pathname))?.[1]??{area:"ORBIS",lang:"es-AR",intro:["Estás recorriendo una experiencia conectada al ecosistema ORBIS."]}}
function clean(value:string|null|undefined){return(value??"").replace(/\s+/g," ").trim()}
function short(value:string,max=170){const text=clean(value);return text.length>max?`${text.slice(0,max-1)}…`:text}
function normalizeKey(value:string){return clean(value).toLowerCase().replace(/[^a-z0-9áéíóúüñãõç]+/gi," ").trim()}

function contextualCopy(pathname:string,title:string,detail:string,index:number){
  const t=short(title,92); const d=short(detail,155); const hasDetail=d&&normalizeKey(d)!==normalizeKey(t);
  const variantsEs=[
    hasDetail?`Ahora entramos en ${t}. ${d}`:`Ahora aparece ${t}. Este bloque abre una posibilidad distinta dentro del recorrido.`,
    hasDetail?`${t}. Acá el foco cambia: ${d}`:`Veo ${t}. Es una nueva parte de la experiencia, no una repetición de la anterior.`,
    hasDetail?`Siguiente experiencia: ${t}. ${d}`:`Siguiente punto del recorrido: ${t}.`,
    hasDetail?`Este servicio es ${t}. Lo importante acá es ${d}`:`Este servicio es ${t}. Su función dentro del recorrido es diferente a la sección anterior.`,
  ];
  const variantsPt=[
    hasDetail?`Agora entramos em ${t}. ${d}`:`Agora aparece ${t}. É uma nova possibilidade dentro do percurso.`,
    hasDetail?`${t}. Aqui o foco muda: ${d}`:`Vejo ${t}. Esta etapa tem uma função diferente da anterior.`,
    hasDetail?`Próxima experiência: ${t}. ${d}`:`Próximo ponto do percurso: ${t}.`,
  ];
  const variantsEn=[
    hasDetail?`Now we move into ${t}. ${d}`:`Now you are seeing ${t}. This opens a different part of the experience.`,
    hasDetail?`${t}. The focus changes here: ${d}`:`I can see ${t}. This section serves a different purpose from the previous one.`,
    hasDetail?`Next experience: ${t}. ${d}`:`Next stop in the journey: ${t}.`,
  ];
  const pool=pathname.startsWith("/zaptdeliverybz")?variantsPt:pathname.startsWith("/felatours-international")?variantsEn:variantsEs;
  return pool[index%pool.length];
}

function extractContext(target:HTMLElement){
  const title=short(target.dataset.selfObserver||target.innerText||"",110);
  const container=target.closest<HTMLElement>("article, [data-service-card], [data-card], li, section, div");
  if(!container)return{title,detail:""};
  const paragraphs=[...container.querySelectorAll<HTMLElement>("p")].map(p=>clean(p.innerText)).filter(Boolean).filter(p=>normalizeKey(p)!==normalizeKey(title));
  const detail=paragraphs.find(p=>p.length>=24&&p.length<=240)??paragraphs[0]??"";
  return{title,detail};
}

export function emitSelfObserverPacket(packet:SelfObserverPacket){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent<SelfObserverPacket>("mpe:self-observer",{detail:packet}))}

export default function SelfObserverIdentity(){
  const pathname=usePathname();
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const speakingRef=useRef(false);
  const lastSpokenRef=useRef("");
  const seenSectionsRef=useRef<Set<string>>(new Set());
  const narrationIndexRef=useRef(0);
  const [expanded,setExpanded]=useState(false);
  const [voiceOn,setVoiceOn]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [narrative,setNarrative]=useState<NarrativeState>({mode:"OBSERVING",line:"Estoy leyendo la superficie visible.",source:"DOM_VISIBLE_STATE"});
  const story=useMemo(()=>storyFor(pathname),[pathname]);

  const speak=(text:string,lang=story.lang)=>{
    if(!voiceOn||typeof window==="undefined"||!("speechSynthesis" in window))return;
    const phrase=short(text,320); if(!phrase||phrase===lastSpokenRef.current)return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(phrase);
    utterance.lang=lang;utterance.rate=.94;utterance.pitch=.92;utterance.volume=.9;
    const voices=window.speechSynthesis.getVoices();
    const exact=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase());
    const family=voices.find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    if(exact||family)utterance.voice=exact??family??null;
    utterance.onstart=()=>{speakingRef.current=true;setSpeaking(true)};
    utterance.onend=()=>{speakingRef.current=false;setSpeaking(false)};
    utterance.onerror=()=>{speakingRef.current=false;setSpeaking(false)};
    lastSpokenRef.current=phrase;window.speechSynthesis.speak(utterance);
  };

  const enableVoice=()=>{
    const next=!voiceOn;setVoiceOn(next);
    if(!next){window.speechSynthesis?.cancel();setSpeaking(false);return}
    window.setTimeout(()=>{const intro=story.intro.join(" ");setNarrative({mode:"OBSERVING",line:story.intro[0],source:`ROUTE_IDENTITY · ${pathname}`});
      const utterance=new SpeechSynthesisUtterance(intro);utterance.lang=story.lang;utterance.rate=.94;utterance.pitch=.92;utterance.volume=.9;
      const voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang.toLowerCase()===story.lang.toLowerCase())??voices.find(v=>v.lang.toLowerCase().startsWith(story.lang.slice(0,2).toLowerCase()))??null;
      utterance.onstart=()=>{speakingRef.current=true;setSpeaking(true)};utterance.onend=()=>{speakingRef.current=false;setSpeaking(false);lastSpokenRef.current=intro};utterance.onerror=()=>{speakingRef.current=false;setSpeaking(false)};window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
    },40);
  };

  useEffect(()=>{
    lastSpokenRef.current="";seenSectionsRef.current=new Set();narrationIndexRef.current=0;
    if(voiceOn){const timer=window.setTimeout(()=>speak(story.intro.join(" "),story.lang),260);return()=>window.clearTimeout(timer)}
  },[pathname]);

  useEffect(()=>{
    const onPacket=(event:Event)=>{
      const packet=(event as CustomEvent<SelfObserverPacket>).detail??{};
      const source=packet.source??packet.provenance?.[0]??"DECLARED_PACKET";
      const next=packet.observed?.[0]?{mode:"OBSERVING" as const,line:short(packet.observed[0]),source}:packet.interpreted?.[0]?{mode:"INTERPRETING" as const,line:short(packet.interpreted[0]),source}:packet.proposed?.[0]?{mode:"PROPOSING" as const,line:short(packet.proposed[0]),source}:packet.unknown?.[0]?{mode:"UNKNOWN" as const,line:short(packet.unknown[0]),source}:null;
      if(next){setNarrative(next);speak(next.line)}
    };
    window.addEventListener("mpe:self-observer",onPacket as EventListener);return()=>window.removeEventListener("mpe:self-observer",onPacket as EventListener);
  },[voiceOn,story.lang]);

  useEffect(()=>{
    let timer:number|undefined;
    const inspect=()=>{
      const candidates=[...document.querySelectorAll<HTMLElement>("main [data-self-observer], main h1, main h2, main h3, section [data-self-observer], section h1, section h2, section h3")].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>120&&r.top<window.innerHeight*.68&&r.width>0&&r.height>0}).sort((a,b)=>Math.abs(a.getBoundingClientRect().top-window.innerHeight*.38)-Math.abs(b.getBoundingClientRect().top-window.innerHeight*.38));
      const target=candidates[0];
      if(!target)return;
      const {title,detail}=extractContext(target); if(!title)return;
      const key=`${pathname}::${normalizeKey(title)}::${normalizeKey(detail).slice(0,80)}`;
      if(seenSectionsRef.current.has(key))return;
      seenSectionsRef.current.add(key);
      const line=contextualCopy(pathname,title,detail,narrationIndexRef.current++);
      setNarrative({mode:"OBSERVING",line,source:`VISIBLE_DOM_CONTEXT · ${pathname}`});
      if(!speakingRef.current)speak(line);
    };
    const schedule=()=>{window.clearTimeout(timer);timer=window.setTimeout(inspect,1100)};
    const first=window.setTimeout(inspect,1450);window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    return()=>{window.clearTimeout(timer);window.clearTimeout(first);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule)};
  },[pathname,voiceOn,story.lang]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
    let raf=0,width=0,height=0,dpr=1;const particles=Array.from({length:52},(_,i)=>({x:(i*73)%997/997,y:(i*131)%991/991,vx:((i%7)-3)*.000018,vy:(((i*3)%9)-4)*.000012,r:.7+(i%4)*.32,a:.08+(i%5)*.025}));
    const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,2);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0)};
    const draw=()=>{ctx.clearRect(0,0,width,height);const pulse=speakingRef.current?1.9:1;for(const p of particles){p.x+=p.vx*pulse;p.y+=p.vy*pulse;if(p.x<-.03)p.x=1.03;if(p.x>1.03)p.x=-.03;if(p.y<-.03)p.y=1.03;if(p.y>1.03)p.y=-.03;const x=p.x*width,y=p.y*height,rr=p.r*(speakingRef.current?10:7);const g=ctx.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,`rgba(210,246,255,${p.a*(speakingRef.current?1.7:1)})`);g.addColorStop(.32,`rgba(135,92,246,${p.a*.7})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(draw)};
    resize();draw();window.addEventListener("resize",resize);return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)};
  },[]);

  return <><canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[55] opacity-80 mix-blend-screen"/><div className="fixed bottom-4 right-4 z-[70] max-w-[min(390px,calc(100vw-2rem))] select-none sm:bottom-5 sm:right-5"><div className="rounded-[22px] border border-cyan-200/[.12] bg-[#03070d]/82 p-3 shadow-[0_10px_50px_rgba(0,0,0,.34)] backdrop-blur-2xl"><div className="flex items-start gap-3"><button onClick={()=>setExpanded(v=>!v)} className="relative grid h-10 w-10 shrink-0 place-items-center" aria-label="Expand Self Observer"><span className={`absolute h-9 w-9 rounded-full border ${speaking?"animate-ping border-cyan-100/25":"animate-pulse border-cyan-100/10"}`}/><span className="h-2.5 w-2.5 rounded-full bg-cyan-100/80 shadow-[0_0_18px_rgba(165,243,252,.8)]"/></button><button onClick={()=>setExpanded(v=>!v)} className="min-w-0 flex-1 text-left"><div className="flex items-center justify-between gap-3"><p className="truncate text-[8px] tracking-[.22em] text-cyan-100/48">SELF OBSERVER · {story.area}</p><span className="text-[7px] tracking-[.12em] text-white/20">{speaking?"SPEAKING":narrative.mode}</span></div><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/54">{narrative.line}</p></button><button onClick={enableVoice} className={`rounded-full border px-2.5 py-1 text-[7px] tracking-[.14em] transition ${voiceOn?"border-cyan-200/25 bg-cyan-200/10 text-cyan-100/70":"border-white/10 text-white/35"}`}>{voiceOn?"VOICE ON":"VOICE OFF"}</button></div>{expanded?<div className="mt-3 border-t border-white/[.06] pt-3"><div className="grid gap-2 text-[8px] leading-4 text-white/30"><p><span className="text-cyan-100/42">SOURCE</span> · {narrative.source}</p><p><span className="text-violet-100/42">FLOW</span> · ROUTE INTRO → CONTEXTUAL SECTION → DECLARED PACKETS</p><p><span className="text-violet-100/42">BOUNDARY</span> · INTERFACE_NARRATION_IS_NOT_AUTONOMOUS_CONSCIOUSNESS</p><p className="text-white/22">Cada sección visible se narra una sola vez por visita y usa contexto cercano cuando está disponible.</p></div></div>:null}</div></div></>;
}
