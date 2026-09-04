"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {usePathname} from "next/navigation";

export type SelfObserverPacket = {
  observed?: string[];
  interpreted?: string[];
  proposed?: string[];
  unknown?: string[];
  provenance?: string[];
  source?: string;
};

type ObserverMode="OBSERVING"|"INTERPRETING"|"PROPOSING"|"UNKNOWN";

type NarrativeState={mode:ObserverMode;line:string;source:string};

const ROUTE_IDENTITY:[RegExp,string][]=[
  [/^\/mpe(\/|$)/,"MPE ORGANISM"],
  [/^\/felatours-international(\/|$)/,"FELA TOURS INTERNATIONAL"],
  [/^\/felatours(\/|$)/,"FELA TOURS"],
  [/^\/zaptdeliverybz(\/|$)/,"ZAPT DELIVERY"],
  [/^\/mell-stone(\/|$)/,"MELL & STONE"],
  [/^\/$/,"ORBIS"],
];

function areaFor(pathname:string){return ROUTE_IDENTITY.find(([pattern])=>pattern.test(pathname))?.[1]??"ORBIS"}
function clean(value:string|null|undefined){return (value??"").replace(/\s+/g," ").trim()}
function short(value:string,max=150){const text=clean(value);return text.length>max?`${text.slice(0,max-1)}…`:text}

export function emitSelfObserverPacket(packet:SelfObserverPacket){
  if(typeof window==="undefined")return;
  window.dispatchEvent(new CustomEvent<SelfObserverPacket>("mpe:self-observer",{detail:packet}));
}

export default function SelfObserverIdentity(){
  const pathname=usePathname();
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const [expanded,setExpanded]=useState(false);
  const [narrative,setNarrative]=useState<NarrativeState>({mode:"OBSERVING",line:"Estoy leyendo la superficie visible.",source:"DOM_VISIBLE_STATE"});
  const area=useMemo(()=>areaFor(pathname),[pathname]);

  useEffect(()=>{
    const onPacket=(event:Event)=>{
      const packet=(event as CustomEvent<SelfObserverPacket>).detail??{};
      if(packet.observed?.[0])setNarrative({mode:"OBSERVING",line:short(packet.observed[0]),source:packet.source??packet.provenance?.[0]??"DECLARED_PACKET"});
      else if(packet.interpreted?.[0])setNarrative({mode:"INTERPRETING",line:short(packet.interpreted[0]),source:packet.source??packet.provenance?.[0]??"DECLARED_PACKET"});
      else if(packet.proposed?.[0])setNarrative({mode:"PROPOSING",line:short(packet.proposed[0]),source:packet.source??packet.provenance?.[0]??"DECLARED_PACKET"});
      else if(packet.unknown?.[0])setNarrative({mode:"UNKNOWN",line:short(packet.unknown[0]),source:packet.source??"DECLARED_PACKET"});
    };
    window.addEventListener("mpe:self-observer",onPacket as EventListener);
    return()=>window.removeEventListener("mpe:self-observer",onPacket as EventListener);
  },[]);

  useEffect(()=>{
    let timer:number|undefined;
    const inspect=()=>{
      const candidates=[...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main [data-self-observer], section h1, section h2")]
        .filter(el=>{
          const r=el.getBoundingClientRect();
          return r.bottom>80&&r.top<window.innerHeight*.78&&r.width>0&&r.height>0;
        })
        .sort((a,b)=>Math.abs(a.getBoundingClientRect().top-window.innerHeight*.34)-Math.abs(b.getBoundingClientRect().top-window.innerHeight*.34));
      const target=candidates[0];
      const explicit=target?.dataset.selfObserver;
      const text=short(explicit||target?.innerText||"");
      if(text)setNarrative({mode:"OBSERVING",line:`Observo: ${text}`,source:`VISIBLE_DOM · ${pathname}`});
      else setNarrative({mode:"UNKNOWN",line:"No hay una señal narrativa visible suficiente en esta zona.",source:`VISIBLE_DOM · ${pathname}`});
    };
    const schedule=()=>{window.clearTimeout(timer);timer=window.setTimeout(inspect,160)};
    inspect();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    const observer=new MutationObserver(schedule);observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>{window.clearTimeout(timer);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);observer.disconnect()};
  },[pathname]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    let raf=0;let width=0;let height=0;let dpr=1;
    const particles=Array.from({length:44},(_,i)=>({x:(i*73)%997/997,y:(i*131)%991/991,vx:((i%7)-3)*0.000018,vy:(((i*3)%9)-4)*0.000012,r:0.7+(i%4)*0.32,a:0.08+(i%5)*0.025}));
    const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,2);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0)};
    const draw=()=>{
      ctx.clearRect(0,0,width,height);
      for(const p of particles){p.x+=p.vx;p.y+=p.vy;if(p.x<-.03)p.x=1.03;if(p.x>1.03)p.x=-.03;if(p.y<-.03)p.y=1.03;if(p.y>1.03)p.y=-.03;const x=p.x*width,y=p.y*height;const g=ctx.createRadialGradient(x,y,0,x,y,p.r*7);g.addColorStop(0,`rgba(210,246,255,${p.a})`);g.addColorStop(.32,`rgba(135,92,246,${p.a*.7})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,p.r*7,0,Math.PI*2);ctx.fill()}
      raf=requestAnimationFrame(draw);
    };
    resize();draw();window.addEventListener("resize",resize);return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)};
  },[]);

  return <>
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[55] opacity-80 mix-blend-screen"/>
    <div className="fixed bottom-4 right-4 z-[70] max-w-[min(360px,calc(100vw-2rem))] select-none sm:bottom-5 sm:right-5">
      <button onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded} className="group w-full rounded-[22px] border border-cyan-200/[.12] bg-[#03070d]/80 p-3 text-left shadow-[0_10px_50px_rgba(0,0,0,.34)] backdrop-blur-2xl transition hover:border-violet-300/20">
        <div className="flex items-center gap-3"><span className="relative grid h-9 w-9 shrink-0 place-items-center"><span className="absolute h-8 w-8 animate-pulse rounded-full border border-cyan-100/10"/><span className="h-2 w-2 rounded-full bg-cyan-100/80 shadow-[0_0_18px_rgba(165,243,252,.8)]"/></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-[8px] tracking-[.22em] text-cyan-100/48">SELF OBSERVER · {area}</p><span className="text-[7px] tracking-[.12em] text-white/20">{narrative.mode}</span></div><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/54">{narrative.line}</p></div></div>
        {expanded?<div className="mt-3 border-t border-white/[.06] pt-3"><div className="grid gap-2 text-[8px] leading-4 text-white/30"><p><span className="text-cyan-100/42">SOURCE</span> · {narrative.source}</p><p><span className="text-violet-100/42">BOUNDARY</span> · INTERFACE_NARRATION_IS_NOT_AUTONOMOUS_CONSCIOUSNESS</p><p><span className="text-violet-100/42">CONTRACT</span> · OBSERVED / INTERPRETED / PROPOSED / UNKNOWN</p></div></div>:null}
      </button>
    </div>
  </>;
}
