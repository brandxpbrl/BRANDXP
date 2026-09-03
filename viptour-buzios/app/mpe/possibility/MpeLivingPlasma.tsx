"use client";
import { useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { PossibilityGraph } from "../possibility-engine/model";

type Particle = { x:number; y:number; vx:number; vy:number; anchor:number; phase:number };
type Center = { x:number; y:number; id:string; closed:boolean; selected:boolean };
const hash=(s:string)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rand=(seed:number)=>{let x=seed||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967295}};

export default function MpeLivingPlasma({graph,activeId,onSelect}:{graph:PossibilityGraph|null;activeId?:string;onSelect?:(id:string)=>void}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const centersRef=useRef<Center[]>([]);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
    let frame=0,raf=0;const nodes=graph?.nodes??[],edges=graph?.edges??[],random=rand(hash(graph?.rootStateId??"mpe-idle"));
    const particles:Particle[]=Array.from({length:Math.max(180,nodes.length*60)},(_,i)=>({x:random(),y:random(),vx:0,vy:0,anchor:nodes.length?i%nodes.length:-1,phase:random()*Math.PI*2}));
    const resize=()=>{const d=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)};
    resize();const ro=new ResizeObserver(resize);ro.observe(canvas);
    const draw=()=>{
      frame++;const w=canvas.clientWidth,h=canvas.clientHeight,t=frame*.007;ctx.clearRect(0,0,w,h);
      const opens=new Map<string,number>();edges.filter(e=>e.relation==="opens").forEach(e=>opens.set(e.from,(opens.get(e.from)??0)+1));
      const centers:Center[]=nodes.map((n,i)=>{const incoming=edges.filter(e=>e.to===n.id),depth=incoming.some(e=>e.relation==="depends_on"||e.relation==="opens")?2:1,a=(i/Math.max(nodes.length,1))*Math.PI*2+(hash(n.id)%100)/100+t*.03,ring=Math.min(w,h)*(.12+depth*.09+(opens.get(n.id)??0)*.008);return{x:w/2+Math.cos(a)*ring,y:h/2+Math.sin(a)*ring,id:n.id,closed:n.lifecycleStage==="rejected"||Boolean(n.closedReason),selected:n.id===activeId}});
      centersRef.current=centers;
      const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.48);glow.addColorStop(0,"rgba(34,211,238,.10)");glow.addColorStop(.48,"rgba(168,85,247,.04)");glow.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      for(const e of edges){const a=centers.find(c=>c.id===e.from),b=centers.find(c=>c.id===e.to);if(!a||!b)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.setLineDash(e.relation==="depends_on"?[4,7]:e.relation==="closes"?[2,8]:[]);ctx.strokeStyle=e.relation==="opens"?"rgba(34,211,238,.24)":e.relation==="closes"?"rgba(244,63,94,.22)":e.relation==="contradicts"?"rgba(251,146,60,.20)":"rgba(192,132,252,.13)";ctx.lineWidth=e.relation==="opens"?1.2:.8;ctx.stroke();ctx.setLineDash([])}
      particles.forEach((p,i)=>{let tx=w/2,ty=h/2;if(p.anchor>=0&&centers[p.anchor]){const c=centers[p.anchor],spread=c.closed?6:18+(opens.get(c.id)??0)*3,speed=c.closed?.25:1;tx=c.x+Math.cos(p.phase+t*speed)*spread;ty=c.y+Math.sin(p.phase*1.7+t*speed)*spread}const dx=tx-p.x*w,dy=ty-p.y*h;p.vx=(p.vx+dx*.000014)*.972;p.vy=(p.vy+dy*.000014)*.972;p.x+=p.vx;p.y+=p.vy;const x=((p.x%1)+1)%1*w,y=((p.y%1)+1)%1*h,c=p.anchor>=0?centers[p.anchor]:undefined;ctx.beginPath();ctx.arc(x,y,c?.selected?1.8:c?.closed?.7:1.05,0,Math.PI*2);ctx.fillStyle=c?.closed?"rgba(244,63,94,.18)":c?.selected?"rgba(217,70,239,.9)":i%5===0?"rgba(34,211,238,.7)":"rgba(125,211,252,.34)";ctx.fill()});
      for(const c of centers){ctx.beginPath();ctx.arc(c.x,c.y,c.selected?11:c.closed?4:6,0,Math.PI*2);ctx.strokeStyle=c.closed?"rgba(244,63,94,.35)":c.selected?"rgba(232,121,249,.95)":"rgba(34,211,238,.55)";ctx.lineWidth=c.selected?1.6:1;ctx.stroke()}
      raf=requestAnimationFrame(draw);
    };
    draw();return()=>{cancelAnimationFrame(raf);ro.disconnect()};
  },[graph,activeId]);
  const click=(e:ReactMouseEvent<HTMLCanvasElement>)=>{if(!onSelect)return;const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best:Center|undefined;let bestDistance=Infinity;for(const c of centersRef.current){const d=Math.hypot(x-c.x,y-c.y);if(d<bestDistance){bestDistance=d;best=c}}if(best&&bestDistance<65)onSelect(best.id)};
  return <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-cyan-300/10 bg-[#01050b]"><canvas ref={ref} onClick={click} className="absolute inset-0 h-full w-full cursor-crosshair"/><div className="pointer-events-none absolute left-5 top-5"><p className="text-[9px] tracking-[.24em] text-cyan-200/45">LIVING POSSIBILITY SPACE</p><p className="mt-2 max-w-sm text-xs leading-5 text-white/35">Ramas y relaciones provienen del grafo. Movimiento interno ambiental ≠ evidencia.</p></div><div className="pointer-events-none absolute bottom-5 left-5 flex flex-wrap gap-2 text-[8px] tracking-[.12em] text-white/30"><span>{graph?.nodes.length??0} NODES</span><span>·</span><span>{graph?.edges.length??0} RELATIONS</span><span>·</span><span>CYAN OPEN</span><span>·</span><span>RED CLOSED</span><span>·</span><span>NON-EXHAUSTIVE</span></div></div>;
}
