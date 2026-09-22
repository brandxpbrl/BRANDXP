"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {usePathname} from "next/navigation";
import {captureVisibleScene,observeScene,type Observation,type VisibleScene} from "./mpe-observation-engine";
import {canSpeak,cancelCoordinatedSpeech,speakWithCoordinator} from "./speechCoordinator";

export type SelfObserverPacket={observed?:string[];interpreted?:string[];proposed?:string[];unknown?:string[];provenance?:string[];source?:string};
type ObserverMode="OBSERVING"|"INTERPRETING"|"PROPOSING"|"UNKNOWN";
type NarrativeState={mode:ObserverMode;line:string;source:string;observation?:Observation};
type RouteStory={area:string;lang:"es-AR"|"pt-BR"|"en-US";intro:string[]};

const ROUTE_IDENTITY:[RegExp,string][]=[
  [/^\/mpe(\/|$)/,"MPE ORGANISM"],
  [/^\/felatours\/international(\/|$)/,"FELA TOURS INTERNATIONAL"],
  [/^\/felatours-international(\/|$)/,"FELA TOURS INTERNATIONAL"],
  [/^\/felatours(\/|$)/,"FELA TOURS"],
  [/^\/zaptdeliverybz(\/|$)/,"ZAPT DELIVERY"],
  [/^\/mell-stone(\/|$)/,"MELL & STONE"],
  [/^\/$/,"ORBIS"],
];

const STORIES:[RegExp,RouteStory][]=[
  [/^\/mpe(\/|$)/,{area:"MPE ORGANISM",lang:"es-AR",intro:["Entraste en MPE, el organismo de investigación de ORBIS.","Aquí el sistema explora posibilidades, memoria, geometría, literatura y evolución sin confundir una hipótesis con evidencia."]}],
  [/^\/felatours\/international(\/|$)/,{area:"FELA TOURS INTERNATIONAL",lang:"en-US",intro:["Welcome to Fela Tours International, the English-speaking travel experience inside ORBIS.","This space connects visitors with tours, transfers and curated experiences in Rio de Janeiro and the surrounding destinations."]}],
  [/^\/felatours-international(\/|$)/,{area:"FELA TOURS INTERNATIONAL",lang:"en-US",intro:["Welcome to Fela Tours International, the English-speaking travel experience inside ORBIS.","This space connects visitors with tours, transfers and curated experiences in Rio de Janeiro and the surrounding destinations."]}],
  [/^\/felatours(\/|$)/,{area:"FELA TOURS",lang:"es-AR",intro:["Estás en Fela Tours, el espacio de turismo y experiencias de ORBIS.","Desde aquí podés descubrir traslados, tours y experiencias en Río de Janeiro, Búzios, Angra dos Reis, Ilha Grande y otros destinos."]}],
  [/^\/zaptdeliverybz(\/|$)/,{area:"ZAPT DELIVERY",lang:"pt-BR",intro:["Você entrou na ZAPT Delivery Búzios, a operação de delivery noturno dentro do ecossistema ORBIS.","Aqui a experiência foi pensada para pedidos rápidos de bebidas, lanches e combos durante a madrugada em Búzios."]}],
  [/^\/mell-stone(\/|$)/,{area:"MELL & STONE",lang:"es-AR",intro:["Estás en Mell and Stone, una identidad de joyería integrada al ecosistema ORBIS.","Este espacio presenta su universo visual, su propuesta y sus piezas desde una experiencia propia, conectada al resto del portal."]}],
  [/^\/$/,{area:"ORBIS",lang:"es-AR",intro:["Bienvenido a ORBIS. Everything connected.","ORBIS reúne marcas, servicios, experiencias y sistemas independientes dentro de un mismo ecosistema."]}],
];

function areaFor(pathname:string){return ROUTE_IDENTITY.find(([pattern])=>pattern.test(pathname))?.[1]??"ORBIS"}
function storyFor(pathname:string):RouteStory{return STORIES.find(([pattern])=>pattern.test(pathname))?.[1]??{area:"ORBIS",lang:"es-AR",intro:["Estás recorriendo una experiencia conectada al ecosistema ORBIS."]}}
function clean(value:string|null|undefined){return(value??"").replace(/\s+/g," ").trim()}
function short(value:string,max=220){const text=clean(value);return text.length>max?`${text.slice(0,max-1)}…`:text}

export function emitSelfObserverPacket(packet:SelfObserverPacket){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent<SelfObserverPacket>("mpe:self-observer",{detail:packet}))}

export default function SelfObserverIdentity(){
  const pathname=usePathname();
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const previousScene=useRef<VisibleScene|null>(null);
  const lastSpokenRef=useRef("");
  const speakingRef=useRef(false);
  const [expanded,setExpanded]=useState(false);
  const [voiceOn,setVoiceOn]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const story=useMemo(()=>storyFor(pathname),[pathname]);
  const area=useMemo(()=>areaFor(pathname),[pathname]);
  const [narrative,setNarrative]=useState<NarrativeState>({mode:"OBSERVING",line:"Estoy percibiendo la superficie visible.",source:"MPE_OBSERVATION_LAYER"});

  const speak=(text:string,lang=story.lang)=>{
    if(!voiceOn||!canSpeak())return;
    const phrase=short(text,430);
    if(!phrase||phrase===lastSpokenRef.current)return;
    const voices=window.speechSynthesis.getVoices();
    const exact=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase());
    const family=voices.find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    lastSpokenRef.current=phrase;
    speakWithCoordinator(phrase,{
      lang,rate:.94,pitch:.92,volume:.9,voice:exact??family??null,
      onstart:()=>{speakingRef.current=true;setSpeaking(true)},
      onend:()=>{speakingRef.current=false;setSpeaking(false)},
      onerror:()=>{speakingRef.current=false;setSpeaking(false)},
    });
  };

  const enableVoice=()=>{
    const next=!voiceOn;
    if(next&&!canSpeak()){
      setNarrative({mode:"UNKNOWN",line:"La voz no está disponible en este navegador.",source:"SPEECH_SYNTHESIS_UNAVAILABLE"});
      setVoiceOn(false);
      return;
    }
    setVoiceOn(next);
    if(!next){cancelCoordinatedSpeech();setSpeaking(false);return}
    const intro=story.intro.join(" ");
    setNarrative({mode:"OBSERVING",line:story.intro[0],source:`ROUTE_IDENTITY · ${pathname}`});
    window.setTimeout(()=>speak(intro,story.lang),40);
  };

  useEffect(()=>{
    lastSpokenRef.current="";
    previousScene.current=null;
    if(voiceOn){const timer=window.setTimeout(()=>speak(story.intro.join(" "),story.lang),260);return()=>window.clearTimeout(timer)}
  },[pathname]);

  useEffect(()=>{
    const onPacket=(event:Event)=>{
      const p=(event as CustomEvent<SelfObserverPacket>).detail??{};
      const source=p.source??p.provenance?.[0]??"DECLARED_PACKET";
      const next=p.observed?.[0]?{mode:"OBSERVING" as const,line:short(p.observed[0]),source}:p.interpreted?.[0]?{mode:"INTERPRETING" as const,line:short(p.interpreted[0]),source}:p.proposed?.[0]?{mode:"PROPOSING" as const,line:short(p.proposed[0]),source}:p.unknown?.[0]?{mode:"UNKNOWN" as const,line:short(p.unknown[0]),source}:null;
      if(next){setNarrative(next);speak(next.line)}
    };
    window.addEventListener("mpe:self-observer",onPacket as EventListener);
    return()=>window.removeEventListener("mpe:self-observer",onPacket as EventListener);
  },[voiceOn,story.lang]);

  useEffect(()=>{
    let timer:number|undefined;
    const inspect=()=>{
      const current=captureVisibleScene(pathname,area);
      const observation=observeScene(current,previousScene.current);
      previousScene.current=current;
      setNarrative({mode:observation.mode,line:observation.line,source:observation.source,observation});
      if(observation.line)speak(observation.line);
    };
    const schedule=()=>{window.clearTimeout(timer);timer=window.setTimeout(inspect,220)};
    inspect();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    const observer=new MutationObserver(schedule);
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>{window.clearTimeout(timer);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);observer.disconnect()};
  },[pathname,area,voiceOn]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    let raf=0,width=0,height=0,dpr=1;
    const particles=Array.from({length:44},(_,i)=>({x:(i*73)%997/997,y:(i*131)%991/991,vx:((i%7)-3)*.000018,vy:(((i*3)%9)-4)*.000012,r:.7+(i%4)*.32,a:.08+(i%5)*.025}));
    const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,2);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0)};
    const draw=()=>{ctx.clearRect(0,0,width,height);const pulse=speakingRef.current?1.8:1;for(const p of particles){p.x+=p.vx*pulse;p.y+=p.vy*pulse;if(p.x<-.03)p.x=1.03;if(p.x>1.03)p.x=-.03;if(p.y<-.03)p.y=1.03;if(p.y>1.03)p.y=-.03;const x=p.x*width,y=p.y*height,rr=p.r*(speakingRef.current?10:7),g=ctx.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,`rgba(210,246,255,${p.a*(speakingRef.current?1.7:1)})`);g.addColorStop(.32,`rgba(135,92,246,${p.a*.7})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(draw)};
    resize();draw();window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)};
  },[]);

  const o=narrative.observation;
  return <><canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[55] opacity-80 mix-blend-screen"/>
    <button type="button" onClick={enableVoice} aria-pressed={voiceOn} aria-label={voiceOn?"Desactivar narración por voz":"Activar narración por voz"} className={`fixed bottom-5 left-5 z-[75] grid h-12 w-12 place-items-center rounded-full border shadow-[0_0_28px_rgba(126,221,255,.18)] backdrop-blur-xl transition ${voiceOn?"border-cyan-100/45 bg-cyan-100/15 text-cyan-50":"border-cyan-100/15 bg-[#03070d]/75 text-cyan-100/45"}`}>
      <span className={`absolute inset-1 rounded-full border ${speaking?"animate-ping border-cyan-100/35":"border-cyan-100/10"}`}/>
      <span className="relative text-[9px] tracking-[.12em]">{voiceOn?"ON":"◉"}</span>
    </button>
    <div className="fixed bottom-4 right-4 z-[70] max-w-[min(380px,calc(100vw-2rem))] select-none sm:bottom-5 sm:right-5">
      <button onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded} className="group w-full rounded-[22px] border border-cyan-200/[.12] bg-[#03070d]/80 p-3 text-left shadow-[0_10px_50px_rgba(0,0,0,.34)] backdrop-blur-2xl transition hover:border-violet-300/20">
        <div className="flex items-center gap-3"><span className="relative grid h-9 w-9 shrink-0 place-items-center"><span className="absolute h-8 w-8 animate-pulse rounded-full border border-cyan-100/10"/><span className="h-2 w-2 rounded-full bg-cyan-100/80 shadow-[0_0_18px_rgba(165,243,252,.8)]"/></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-[8px] tracking-[.22em] text-cyan-100/48">SELF OBSERVER · {area}</p><span className="text-[7px] tracking-[.12em] text-white/20">{speaking?"SPEAKING":narrative.mode}</span></div><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/54">{narrative.line}</p></div></div>
        {expanded?<div className="mt-3 border-t border-white/[.06] pt-3"><div className="grid gap-2 text-[8px] leading-4 text-white/30"><p><span className="text-cyan-100/42">SOURCE</span> · {narrative.source}</p><p><span className="text-cyan-100/42">EPISTEMIC</span> · {o?.epistemicStatus??"DECLARED"}</p>{o?.differences?.[0]?<p><span className="text-violet-100/42">Δ</span> · {o.differences[0]}</p>:null}{o?.evidence?.[0]?<p><span className="text-violet-100/42">EVIDENCE</span> · {o.evidence[0]}</p>:null}{o?.possibilities?.[0]?<p><span className="text-violet-100/42">POSSIBILITY</span> · {o.possibilities[0]}</p>:null}<p><span className="text-violet-100/42">BOUNDARY</span> · OBSERVATION_IS_NOT_TRUTH · MCOS_EXPRESSION_IS_NOT_EVIDENCE</p><p><span className="text-violet-100/42">PIPELINE</span> · PERCEPTION → Δ → CONTEXT → AGENTS/MPE → MCOS</p></div></div>:null}
      </button>
    </div>
  </>;
}
