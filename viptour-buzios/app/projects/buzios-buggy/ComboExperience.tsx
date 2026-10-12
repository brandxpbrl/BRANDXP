type Language = "br" | "us" | "es";

const price = { current: "160", old: "200", until: "31/10/2026" };

const texts = {
  br: {
    promo:"PROMOÇÃO ESPECIAL 2026",per:"por pessoa",childTitle:"Crianças",kids:["0–5 anos: grátis","6–10 anos: meia-entrada","A partir de 11 anos: inteira"],expiry:"Valor promocional para reservas até 31 de outubro de 2026",pay:"Sem pagamento antecipado — pague no dia",trustTitle:"RESERVA SEM RISCO",trust:["Sem sinal para reservar","Pagamento somente no dia","Alteração e cancelamento conforme confirmação"],
    benefits:["Dois passeios em um único dia","Buggy privativo com guia","Paradas para banho e fotos","Reserva direta por WhatsApp"],scheduleTitle:"Escolha a ordem dos passeios",scheduleIntro:"Terra e mar na mesma experiência. Confirme a combinação de horários disponível para sua data.",
    orderOne:"Opção 1 — Buggy de manhã, barco depois",orderTwo:"Opção 2 — Barco primeiro, buggy depois",orderOneItems:["Buggy guiado — aproximadamente 09h às 10h30","Retirada dos ingressos e chegada ao píer","Passeio de barco — embarque por volta de 11h30"],orderTwoItems:["Passeio de barco e paradas de banho","Após o retorno, passeio guiado de buggy privativo","Consulte a disponibilidade desta sequência"],timeNote:"Os horários são ilustrativos e dependem de confirmação no WhatsApp e das condições do mar.",
    landTag:"TERRA · BUGGY",landTitle:"Terra — tour de buggy guiado (≈1h30)",landIntro:"8 praias e 3 mirantes com paradas flexíveis para contemplar a paisagem e registrar a viagem. O buggy é reservado para o seu grupo.",
    seaTag:"MAR · ESCUNA",seaTitle:"Mar — passeio de barco tradicional",seaIntro:"Navegação de aproximadamente 3 horas por 12 praias e 3 ilhas, com três paradas para banho ou snorkel conforme a segurança da navegação.",
    stopsTitle:"Pontos do percurso de buggy",stops:["Orla Bardot","Monumento dos Três Pescadores","Bairro dos Ossos","Mirante João Fernandes","Praia Brava","Praia do Forno","Mirante do Forno","Praia da Ferradura"],
    seaStats:["12 praias","3 ilhas","3 paradas de snorkel"],boatTitle:"A bordo do barco",boat:["Dois conveses","Toboágua","Dois banheiros","Bar com bebidas e snacks","Tripulação local"],seaRoute:"Praias: Armação · Ossos · Azeda · Azedinha · João Fernandes · João Fernandinho · Brava · Virgens · Amores · Canto · Tartaruga · Forno",islands:"Ilhas: Feia · Branca · Rasa",seaBreak:"Banho: Tartaruga · Azedinha · João Fernandes (sujeito às condições do mar)",
    includesTitle:"O que está incluído",includes:["Passeio de buggy guiado e privativo","Passeio de barco compartilhado no mesmo dia","Paradas programadas de acordo com o clima"],excludesTitle:"Não está incluído",excludes:["Refeições e bebidas","Gorjetas e compras pessoais","Eventual taxa de embarque, se aplicável"],booking:"Reservar Combo pelo WhatsApp",faqTitle:"Perguntas frequentes",faq:[
      ["Os dois passeios acontecem no mesmo dia?","Sim. O combo reúne o roteiro guiado de buggy e uma navegação pelas praias de Búzios. Os horários exatos são confirmados antes da reserva."],
      ["Tenho que pagar antecipadamente?","A referência oferece pagamento no dia, sem sinal. Confirme as condições finais com o atendimento."],
      ["Como funciona para crianças?","Até 5 anos grátis; de 6 a 10 anos meia-entrada; a partir de 11 anos valor integral, sujeito à confirmação."],
      ["E se o mar não estiver seguro?","O passeio marítimo pode ser reagendado, conforme a operação, a previsão e as condições de segurança."],
    ],note:"Fotos das paisagens são ilustrativas. Usaremos exclusivamente as fotos reais dos buggies do cliente quando forem enviadas."
  },
  us: {
    promo:"2026 SPECIAL OFFER",per:"per person",childTitle:"Children",kids:["Ages 0–5: free","Ages 6–10: half price","11+: full price"],expiry:"Promotional rate for bookings through October 31, 2026",pay:"No advance deposit — pay on the day",trustTitle:"BOOK WITH CONFIDENCE",trust:["No booking deposit","Pay on the day","Changes and cancellations subject to confirmation"],
    benefits:["Two experiences in one day","Private guided buggy ride","Swimming and photo stops","Easy WhatsApp booking"],scheduleTitle:"Choose your tour order",scheduleIntro:"Experience Búzios by land and sea. Confirm the available timing for your date.",
    orderOne:"Option 1 — Buggy in the morning, boat later",orderTwo:"Option 2 — Boat first, buggy afterwards",orderOneItems:["Guided buggy tour — approximately 9:00 to 10:30","Collect tickets and reach the pier","Boat departure around 11:30"],orderTwoItems:["Boat trip and swimming stops","After returning, your private guided buggy tour","Ask about availability of this sequence"],timeNote:"Times are illustrative, subject to confirmation on WhatsApp and sea conditions.",
    landTag:"LAND · BUGGY",landTitle:"Land — guided buggy tour (≈90 min)",landIntro:"Explore 8 beaches and 3 scenic viewpoints with flexible stops for photos. The buggy is private for your group.",
    seaTag:"SEA · BOAT",seaTitle:"Sea — traditional boat cruise",seaIntro:"An approximately 3-hour cruise passing 12 beaches and 3 islands, with 3 swimming or snorkelling stops subject to sea conditions.",
    stopsTitle:"Buggy route highlights",stops:["Orla Bardot","Three Fishermen Monument","Ossos neighbourhood","João Fernandes viewpoint","Praia Brava","Praia do Forno","Forno viewpoint","Praia da Ferradura"],
    seaStats:["12 beaches","3 islands","3 snorkelling stops"],boatTitle:"On board",boat:["Two decks","Waterslide","Two restrooms","Bar with drinks and snacks","Experienced local crew"],seaRoute:"Beaches: Armação · Ossos · Azeda · Azedinha · João Fernandes · João Fernandinho · Brava · Virgens · Amores · Canto · Tartaruga · Forno",islands:"Islands: Feia · Branca · Rasa",seaBreak:"Swimming stops: Tartaruga · Azedinha · João Fernandes (weather permitting)",
    includesTitle:"What's included",includes:["Private guided buggy tour","Shared boat trip on the same day","Stops according to the weather"],excludesTitle:"Not included",excludes:["Food and beverages","Tips and personal purchases","Any applicable boarding fee"],booking:"Book the Combo on WhatsApp",faqTitle:"Frequently asked questions",faq:[
      ["Are both experiences on the same day?","Yes. The package combines the guided buggy experience and a boat tour. Times are confirmed before booking."],
      ["Do I need to pay in advance?","The reference offer has no deposit, with payment on the day. Confirm terms before booking."],
      ["Is it suitable for children?","Ages 0–5 are free, 6–10 half price, and 11+ full price, subject to confirmation."],
      ["What if sea conditions are unsafe?","Boat departures may be rescheduled based on weather, safety and operator availability."],
    ],note:"Destination photos are illustrative. Actual buggy photos will be added only from the client's vehicles."
  },
  es: {
    promo:"PROMOCIÓN ESPECIAL 2026",per:"por persona",childTitle:"Niños",kids:["0–5 años: gratis","6–10 años: mitad de precio","11+ años: tarifa completa"],expiry:"Precio promocional para reservas hasta el 31 de octubre de 2026",pay:"Sin pago anticipado — pagá el día del paseo",trustTitle:"RESERVÁ SIN RIESGO",trust:["Sin adelanto para reservar","Pagás el día del paseo","Cambios y cancelaciones sujetos a confirmación"],
    benefits:["Dos experiencias en un mismo día","Buggy privado con guía","Paradas para baño y fotografías","Reserva directa por WhatsApp"],scheduleTitle:"Elegí el orden de tus paseos",scheduleIntro:"Conocé Búzios por tierra y por mar. Consultá los horarios disponibles para tu fecha.",
    orderOne:"Opción 1 — Buggy por la mañana y barco después",orderTwo:"Opción 2 — Barco primero y buggy después",orderOneItems:["Tour guiado en buggy — aproximadamente de 09:00 a 10:30","Retiro de tickets y llegada al muelle","Salida en barco alrededor de las 11:30"],orderTwoItems:["Paseo en barco y paradas para bañarse","Al regresar, tour guiado en buggy privado","Consultá la disponibilidad de esta secuencia"],timeNote:"Los horarios son ilustrativos y dependen de confirmación y condiciones del mar.",
    landTag:"TIERRA · BUGGY",landTitle:"Tierra — tour guiado en buggy (≈1h30)",landIntro:"Conocé 8 playas y 3 miradores con paradas flexibles para fotos y paisajes. El buggy es exclusivo para tu grupo.",
    seaTag:"MAR · BARCO",seaTitle:"Mar — paseo tradicional en barco",seaIntro:"Un recorrido de aproximadamente 3 horas por 12 playas y 3 islas, con tres paradas para baño o snorkel según las condiciones del mar.",
    stopsTitle:"Paradas del recorrido en buggy",stops:["Orla Bardot","Monumento de los Tres Pescadores","Barrio de Ossos","Mirador João Fernandes","Praia Brava","Praia do Forno","Mirador do Forno","Praia da Ferradura"],
    seaStats:["12 playas","3 islas","3 paradas de snorkel"],boatTitle:"A bordo del barco",boat:["Dos cubiertas","Tobogán","Dos baños","Bar de bebidas y snacks","Tripulación local"],seaRoute:"Playas: Armação · Ossos · Azeda · Azedinha · João Fernandes · João Fernandinho · Brava · Virgens · Amores · Canto · Tartaruga · Forno",islands:"Islas: Feia · Branca · Rasa",seaBreak:"Baño: Tartaruga · Azedinha · João Fernandes (según las condiciones del mar)",
    includesTitle:"Qué está incluido",includes:["Paseo guiado en buggy privado","Paseo compartido en barco en el mismo día","Paradas según el clima"],excludesTitle:"No está incluido",excludes:["Comidas y bebidas","Propinas y gastos personales","Tasa de embarque, si corresponde"],booking:"Reservar Combo por WhatsApp",faqTitle:"Preguntas frecuentes",faq:[
      ["¿Ambos paseos son el mismo día?","Sí. El combo une la experiencia guiada en buggy con un paseo por mar. Los horarios se confirman antes de reservar."],
      ["¿Tengo que pagar por adelantado?","La oferta de referencia permite pagar el día del paseo. Confirmá las condiciones finales al reservar."],
      ["¿Cómo funciona para niños?","De 0 a 5 gratis; de 6 a 10 mitad de precio; desde los 11 años tarifa completa, sujeto a confirmación."],
      ["¿Qué ocurre si hay mal tiempo?","La navegación puede reprogramarse según el clima, la seguridad y la operación."],
    ],note:"Las fotografías de destinos son ilustrativas. Las fotos de buggies serán únicamente de los vehículos reales de la clienta."
  }
} as const;

const landImages = [
  ["Orla Bardot","https://buggybuzios.com/__l5e/assets-v1/fd52298f-b9b1-4835-95b5-03745cedcf9d/gallery-mirante-joao-fernandes-buzios.jpg"],
  ["Praia Brava","https://buggybuzios.com/__l5e/assets-v1/afdb1be5-a7d6-413b-a032-e3201d742517/gallery-mirante-praia-forno-buzios.jpg"],
  ["Praia da Ferradura","https://buggybuzios.com/__l5e/assets-v1/f38111f3-8bf8-4729-93ce-0414798561df/gallery-praia-ferradura-aerea-buzios.jpg"],
];

function DetailPrice({lang}:{lang:Language}) {
  const t=texts[lang];
  return <div className="bb-ref-pricing"><span className="bb-ref-pill">{t.promo}</span><p className="bb-ref-price-label">{t.pay}</p><div className="bb-ref-price"><del>R$ {price.old}</del><strong>R$ {price.current}</strong><span>{t.per}</span></div><hr/><p className="bb-ref-kid-title">{t.childTitle}</p><div className="bb-ref-kids">{t.kids.map(x=><span key={x}>{x}</span>)}</div><p className="bb-ref-expiry">{t.expiry}</p></div>
}

export default function ComboExperience({lang,bookingUrl}:{lang:Language;bookingUrl:string}){
  const t=texts[lang];
  return <div className="bb-reference bb-combo-reference">
    <div className="bb-wrap">
      <div className="bb-ref-top-grid">
        <DetailPrice lang={lang}/>
        <div className="bb-ref-assurance"><span className="bb-ref-check">✓</span><h2>{t.trustTitle}</h2>{t.trust.map(a=><p key={a}>{a}</p>)}</div>
      </div>
      <div className="bb-ref-perks">{t.benefits.map((b,i)=><div key={b}><span>{["☆","🚙","◷","☏"][i]}</span><strong>{b}</strong></div>)}</div>
    </div>
    <section className="bb-ref-section bb-ref-mist"><div className="bb-wrap"><h2>{t.scheduleTitle}</h2><p className="bb-ref-deck">{t.scheduleIntro}</p><div className="bb-ref-options">{[0,1].map(n=><article key={n} className="bb-ref-option"><div className="bb-ref-number">{n+1}</div><h3>{n===0?t.orderOne:t.orderTwo}</h3><ul>{(n===0?t.orderOneItems:t.orderTwoItems).map(x=><li key={x}>{x}</li>)}</ul></article>)}</div><p className="bb-ref-footnote">{t.timeNote}</p></div></section>
    <section className="bb-ref-section"><div className="bb-wrap"><span className="bb-ref-tag">🚙 {t.landTag}</span><h2>{t.landTitle}</h2><p className="bb-ref-deck">{t.landIntro}</p><div className="bb-ref-land-list"><h3>{t.stopsTitle}</h3><ol>{t.stops.map(x=><li key={x}><span>{t.stops.indexOf(x)+1}</span>{x}</li>)}</ol></div><div className="bb-ref-photo-grid">{landImages.map(([alt,url])=><figure key={url}><img src={url} alt={alt} loading="lazy"/><figcaption>{alt}</figcaption></figure>)}</div></div></section>
    <section className="bb-ref-section bb-ref-mist"><div className="bb-wrap"><span className="bb-ref-tag">⛵ {t.seaTag}</span><h2>{t.seaTitle}</h2><p className="bb-ref-deck">{t.seaIntro}</p><div className="bb-ref-stats">{t.seaStats.map((s,i)=><div key={s}><strong>{["12","3","3"][i]}</strong><span>{s}</span></div>)}</div><img className="bb-ref-ship" src="https://buggybuzios.com/__l5e/assets-v1/9ed83313-8b3e-4b9d-9737-3a7c437fbf6e/boat-tour-schooner-buzios.jpg" alt="Escuna com toboágua azul do passeio de barco em Búzios" loading="lazy"/><div className="bb-ref-boat-details"><h3>{t.boatTitle}</h3><ul>{t.boat.map(x=><li key={x}>✓ {x}</li>)}</ul><p>{t.seaRoute}</p><p>{t.islands}</p><p>{t.seaBreak}</p></div></div></section>
    <section className="bb-ref-section"><div className="bb-wrap"><div className="bb-ref-included"><div><h2>✓ {t.includesTitle}</h2><ul>{t.includes.map(x=><li key={x}>{x}</li>)}</ul></div><div><h2>○ {t.excludesTitle}</h2><ul>{t.excludes.map(x=><li key={x}>{x}</li>)}</ul></div></div><h2 className="bb-ref-faq-title">{t.faqTitle}</h2><div className="bb-ref-faq">{t.faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><div className="bb-ref-book"><a className="bb-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">☏ {t.booking}</a></div><p className="bb-ref-footnote">{t.note}</p></div></section>
  </div>;
}
