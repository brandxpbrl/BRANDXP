export type NarratorLang="es-AR"|"pt-BR"|"en-US";

export type VisibleNarrativeContext={
  pathname:string;
  title:string;
  detail:string;
  category?:string;
  location?:string;
  visibleText?:string;
};

export type NarrationMemory={
  seen:Set<string>;
  recentOpenings:string[];
  recentAngles:string[];
};

export type GeneratedNarration={
  text:string;
  semanticKey:string;
  angle:string;
  source:"GENERATED_FROM_VISIBLE_STATE";
};

const clean=(value:string|null|undefined)=>(value??"").replace(/\s+/g," ").trim();
const normalize=(value:string)=>clean(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const short=(value:string,max=180)=>{const t=clean(value);return t.length>max?`${t.slice(0,max-1)}…`:t};
const hash=(value:string)=>{let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};

function semanticAngle(ctx:VisibleNarrativeContext){
  const blob=normalize([ctx.title,ctx.detail,ctx.category,ctx.location,ctx.pathname].filter(Boolean).join(" "));
  if(/transfer|traslado|airport|aeroporto|transport|movilidad|mobilidade/.test(blob))return"connection";
  if(/mpe|possibility|posibilidad|memory|memoria|literature|literatura|geometry|geometr/.test(blob))return"system";
  if(/delivery|lanche|bebida|combo|madrugada/.test(blob))return"utility";
  if(/joya|joia|jewel|anel|colar|stone|mell/.test(blob))return"identity";
  if(/floresta|forest|nature|naturaleza|trilha|hiking|pedra|fauna/.test(blob))return"nature";
  if(/barco|boat|lancha|ilha|isla|beach|praia|playa|mar|diving|buceo|jet ski|paddle/.test(blob))return"water";
  if(/favela|rocinha|vidigal|cultura|culture|local/.test(blob))return"culture";
  if(/cristo|sugarloaf|pan de azucar|rio de janeiro|aquario|maracana|helicopter/.test(blob))return"iconic";
  return"experience";
}

function openingPool(lang:NarratorLang,angle:string){
  const es:{[k:string]:string[]}={
    connection:["Acá cambia la lógica del recorrido.","Este punto conecta el viaje.","No estamos ante una excursión, sino ante la infraestructura que la hace posible."],
    system:["Acá no estoy describiendo un servicio: estoy leyendo una función del sistema.","En esta zona, ORBIS cambia de escala y entra en lógica de sistema.","Este bloque forma parte del organismo digital, no del catálogo comercial."],
    utility:["Acá la experiencia se vuelve inmediata y práctica.","Este espacio responde a una necesidad concreta del momento.","La lógica cambia: menos contemplación, más resolución."],
    identity:["Acá el foco pasa de servicio a identidad.","Este espacio trabaja con símbolo, materia e identidad.","Lo que aparece acá no es sólo producto: también es lenguaje de marca."],
    nature:["Acá la ciudad cede lugar al entorno natural.","Este tramo cambia ruido urbano por paisaje y vegetación.","La experiencia se desplaza hacia naturaleza, recorrido y observación."],
    water:["Acá el paisaje se abre hacia el agua.","En este punto, el recorrido cambia de tierra a mar.","La experiencia pasa a depender del mar, el clima y el movimiento."],
    culture:["Acá el recorrido entra en una capa cultural y humana.","Este punto cambia paisaje por contexto social e historias locales.","La experiencia se vuelve más cercana al territorio vivido."],
    iconic:["Acá entramos en uno de los imaginarios más reconocibles de Río.","Este punto concentra una parte icónica del viaje.","La ciudad acá se vuelve símbolo y perspectiva."],
    experience:["Acá aparece una experiencia con lógica propia.","Este bloque abre una parte distinta del recorrido.","El foco cambia otra vez y aparece una nueva experiencia."],
  };
  const pt:{[k:string]:string[]}={
    connection:["Aqui a lógica do percurso muda.","Este ponto conecta a viagem.","Não é apenas um passeio: é a infraestrutura que torna o restante possível."],
    system:["Aqui não estou descrevendo um serviço, mas uma função do sistema.","Nesta área, ORBIS muda de escala e entra em lógica de sistema.","Este bloco pertence ao organismo digital, não ao catálogo comercial."],
    utility:["Aqui a experiência fica imediata e prática.","Este espaço responde a uma necessidade concreta do momento.","A lógica muda: menos contemplação, mais resolução."],
    identity:["Aqui o foco passa de serviço para identidade.","Este espaço trabalha símbolo, matéria e identidade.","O que aparece aqui não é só produto: também é linguagem de marca."],
    nature:["Aqui a cidade dá lugar ao ambiente natural.","Este trecho troca ruído urbano por paisagem e vegetação.","A experiência se desloca para natureza, percurso e observação."],
    water:["Aqui a paisagem se abre para a água.","Neste ponto, o percurso sai da terra e vai para o mar.","A experiência passa a depender do mar, do clima e do movimento."],
    culture:["Aqui o percurso entra numa camada cultural e humana.","Este ponto troca paisagem por contexto social e histórias locais.","A experiência se aproxima do território vivido."],
    iconic:["Aqui entramos em um dos imaginários mais reconhecíveis do Rio.","Este ponto concentra uma parte icônica da viagem.","A cidade aqui vira símbolo e perspectiva."],
    experience:["Aqui aparece uma experiência com lógica própria.","Este bloco abre uma parte diferente do percurso.","O foco muda novamente e surge uma nova experiência."],
  };
  const en:{[k:string]:string[]}={
    connection:["The logic of the journey changes here.","This point connects the trip.","This is not only an excursion; it is part of the infrastructure that makes the journey work."],
    system:["Here I am not describing a service; I am reading a function of the system.","At this point ORBIS shifts scale and enters system logic.","This block belongs to the digital organism, not the commercial catalogue."],
    utility:["The experience becomes immediate and practical here.","This space answers a concrete need in the moment.","The logic changes: less contemplation, more resolution."],
    identity:["The focus shifts from service to identity here.","This space works with symbol, material and identity.","What appears here is not only a product; it is also brand language."],
    nature:["The city gives way to the natural environment here.","This part exchanges urban noise for landscape and vegetation.","The experience moves toward nature, movement and observation."],
    water:["The landscape opens toward the water here.","At this point the journey moves from land to sea.","The experience now depends on sea, weather and movement."],
    culture:["The journey enters a cultural and human layer here.","This point shifts from scenery to local stories and social context.","The experience moves closer to lived territory."],
    iconic:["Here we enter one of Rio's most recognizable visual worlds.","This point concentrates an iconic part of the trip.","The city becomes symbol and perspective here."],
    experience:["A distinct experience opens here.","This block opens a different part of the journey.","The focus changes again and a new experience appears."],
  };
  return(lang==="pt-BR"?pt:lang==="en-US"?en:es)[angle]??(lang==="pt-BR"?pt:lang==="en-US"?en:es).experience;
}

function bridge(lang:NarratorLang,title:string,detail:string,location?:string,category?:string){
  const t=short(title,96),d=short(detail,170),l=short(location??"",70),c=short(category??"",70);
  const facts=[d,c&&c!==d?c:"",l&&l!==d?l:""].filter(Boolean);
  if(lang==="pt-BR"){
    if(facts.length>=2)return `${t}: ${facts[0]}. O contexto é ${facts.slice(1).join(" · ")}.`;
    if(facts[0])return `${t}: ${facts[0]}.`;
    return `O elemento visível é ${t}.`;
  }
  if(lang==="en-US"){
    if(facts.length>=2)return `${t}: ${facts[0]}. Context: ${facts.slice(1).join(" · ")}.`;
    if(facts[0])return `${t}: ${facts[0]}.`;
    return `The visible element is ${t}.`;
  }
  if(facts.length>=2)return `${t}: ${facts[0]}. El contexto es ${facts.slice(1).join(" · ")}.`;
  if(facts[0])return `${t}: ${facts[0]}.`;
  return `El elemento visible es ${t}.`;
}

function implication(lang:NarratorLang,angle:string){
  const es:{[k:string]:string[]}={
    connection:["Su valor está en reducir fricción entre un punto del viaje y el siguiente.","Funciona como conexión: menos incertidumbre operativa y más continuidad."],
    system:["Lo relevante no es sólo lo que muestra, sino cómo conecta estado, memoria y acción.","Acá la interfaz representa una función interna y debe distinguir observación, interpretación y propuesta."],
    utility:["Su valor está en resolver rápido sin obligar al usuario a abandonar el flujo.","Acá importa la disponibilidad, la claridad y la velocidad de respuesta."],
    identity:["Su función es sostener una identidad reconocible mientras cambia el contexto.","Acá el valor está en coherencia, significado y percepción."],
    nature:["El atractivo depende del entorno real, por eso clima y condiciones naturales importan.","Acá el valor no es sólo llegar, sino cómo cambia la percepción del lugar."],
    water:["El mar introduce variabilidad real: clima, navegación y condiciones operativas pasan a importar.","Su valor está en cambiar la perspectiva del destino desde el agua."],
    culture:["La calidad depende de contexto, respeto y mediación local, no sólo de recorrer un lugar.","Acá el valor aparece cuando el territorio deja de ser fondo y se vuelve historia."],
    iconic:["Su función es condensar ciudad, paisaje y memoria visual en una experiencia fácil de reconocer.","Acá el valor está en combinar escala, vista y símbolo."],
    experience:["Lo que la diferencia es la relación entre contexto, recorrido y expectativa del visitante.","Su función es abrir una forma distinta de vivir el mismo destino."],
  };
  const pt:{[k:string]:string[]}={
    connection:["Seu valor está em reduzir atrito entre um ponto da viagem e o seguinte.","Funciona como conexão: menos incerteza operacional e mais continuidade."],
    system:["O relevante não é só o que mostra, mas como conecta estado, memória e ação.","Aqui a interface representa uma função interna e precisa distinguir observação, interpretação e proposta."],
    utility:["Seu valor está em resolver rápido sem obrigar o usuário a sair do fluxo.","Aqui importam disponibilidade, clareza e velocidade de resposta."],
    identity:["Sua função é sustentar uma identidade reconhecível enquanto o contexto muda.","Aqui o valor está em coerência, significado e percepção."],
    nature:["O atrativo depende do ambiente real, por isso clima e condições naturais importam.","Aqui o valor não é só chegar, mas como a percepção do lugar muda."],
    water:["O mar introduz variabilidade real: clima, navegação e condições operacionais passam a importar.","Seu valor está em mudar a perspectiva do destino a partir da água."],
    culture:["A qualidade depende de contexto, respeito e mediação local, não só de percorrer um lugar.","Aqui o valor aparece quando o território deixa de ser fundo e vira história."],
    iconic:["Sua função é condensar cidade, paisagem e memória visual em uma experiência reconhecível.","Aqui o valor está em combinar escala, vista e símbolo."],
    experience:["O diferencial está na relação entre contexto, percurso e expectativa do visitante.","Sua função é abrir uma forma diferente de viver o mesmo destino."],
  };
  const en:{[k:string]:string[]}={
    connection:["Its value is reducing friction between one part of the journey and the next.","It works as a connection: less operational uncertainty and more continuity."],
    system:["What matters is not only what it shows, but how it connects state, memory and action.","Here the interface represents an internal function and must separate observation, interpretation and proposal."],
    utility:["Its value is solving something quickly without forcing the user out of the flow.","Availability, clarity and response speed matter here."],
    identity:["Its function is to preserve a recognizable identity while the context changes.","The value here is coherence, meaning and perception."],
    nature:["The attraction depends on the real environment, so weather and natural conditions matter.","The value is not only arrival, but how the place changes perception."],
    water:["The sea introduces real variability: weather, navigation and operating conditions start to matter.","Its value is changing the perspective of the destination from the water."],
    culture:["Quality depends on context, respect and local mediation, not only on moving through a place.","The value appears when territory stops being background and becomes story."],
    iconic:["Its function is to condense city, landscape and visual memory into a recognizable experience.","The value here is the combination of scale, view and symbol."],
    experience:["What distinguishes it is the relationship between context, journey and visitor expectation.","Its function is to open a different way of experiencing the same destination."],
  };
  const pool=(lang==="pt-BR"?pt:lang==="en-US"?en:es)[angle]??(lang==="pt-BR"?pt:lang==="en-US"?en:es).experience;
  return pool;
}

export function extractVisibleNarrativeContext(pathname:string,target:HTMLElement):VisibleNarrativeContext{
  const container=target.closest<HTMLElement>("article,[data-service-card],[data-card],li,section,div")??target;
  const heading=container.querySelector<HTMLElement>("[data-self-observer],h1,h2,h3")??target;
  const title=short(heading.dataset.selfObserver||heading.innerText||target.innerText||"",120);
  const ps=[...container.querySelectorAll<HTMLElement>("p")];
  const byClass=(needle:string)=>clean(ps.find(p=>String(p.className).toLowerCase().includes(needle))?.innerText);
  const category=byClass("category")||byClass("eyebrow");
  const location=byClass("location");
  const candidates=ps.map(p=>clean(p.innerText)).filter(Boolean).filter(v=>normalize(v)!==normalize(title)&&normalize(v)!==normalize(category)&&normalize(v)!==normalize(location));
  const detail=candidates.find(v=>v.length>=28&&v.length<=280)??candidates[0]??"";
  return{pathname,title,detail,category,location,visibleText:short(container.innerText,420)};
}

export function generateVisibleNarration(ctx:VisibleNarrativeContext,lang:NarratorLang,memory:NarrationMemory):GeneratedNarration|null{
  const semanticKey=`${ctx.pathname}::${normalize(ctx.title)}::${normalize(ctx.detail).slice(0,100)}`;
  if(!ctx.title||memory.seen.has(semanticKey))return null;
  const angle=semanticAngle(ctx);
  const seed=hash([semanticKey,angle,memory.recentOpenings.join("|")].join("::"));
  const openings=openingPool(lang,angle);
  let opening=openings[seed%openings.length];
  if(memory.recentOpenings.includes(opening)&&openings.length>1)opening=openings[(seed+1)%openings.length];
  const implications=implication(lang,angle);
  const closing=implications[(seed>>>3)%implications.length];
  const text=[opening,bridge(lang,ctx.title,ctx.detail,ctx.location,ctx.category),closing].filter(Boolean).join(" ");
  memory.seen.add(semanticKey);
  memory.recentOpenings=[...memory.recentOpenings.slice(-2),opening];
  memory.recentAngles=[...memory.recentAngles.slice(-3),angle];
  return{text,semanticKey,angle,source:"GENERATED_FROM_VISIBLE_STATE"};
}
