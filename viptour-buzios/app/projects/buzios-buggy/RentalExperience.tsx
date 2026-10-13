type Language = "br" | "us" | "es";

const copy = {
  br: {
    eyebrow:"LIBERDADE PARA EXPLORAR BÚZIOS",title:"Aluguel de Buggy em Búzios",subtitle:"24 horas de liberdade para descobrir praias, mirantes e paisagens no seu ritmo.",
    promo:"OFERTA DE REFERÊNCIA • CONFIRME NA RESERVA",per:"por 24 horas / buggy",priceNote:"Tarifa de referência do site original. Consulte o valor atualizado antes de reservar.",
    book:"Consultar aluguel pelo WhatsApp",features:["24 horas completas de aluguel","Entrega na hospedagem em Búzios (8h–22h)","Até 4 pessoas por veículo","Sem pagamento antecipado na reserva"],
    benefitsTitle:"O que está incluído",benefits:["Capota para sol e chuva","Orientação sobre o veículo na entrega","Assistência durante a locação","Entrega na pousada, hotel ou Airbnb, conforme região atendida"],
    howTitle:"Como funciona o aluguel",steps:[["1","Escolha a data","Consulte a disponibilidade para o período desejado."],["2","Confirme a reserva","Informe nome, hospedagem e quantidade de passageiros pelo WhatsApp."],["3","Receba o buggy","O veículo é entregue no endereço e horário combinados, após a conferência das condições."],["4","Explore Búzios","Aproveite 24 horas e devolva o veículo conforme o combinado."]],
    rulesTitle:"Requisitos e condições",rules:["Habilitação válida para condução do veículo.","É necessário saber dirigir veículo com câmbio manual.","Caução reembolsável de referência: R$ 500, condicionada à vistoria e aos termos da locação.","Combustível não incluído: devolução no mesmo nível recebido.","O valor, as regras de entrega e as condições de cancelamento devem ser confirmados antes da reserva."],
    photoTitle:"Fotos dos buggies",photoBody:"Em breve: aqui entraremos com as fotografias originais dos veículos da cliente. Não utilizaremos fotos de buggies de outras empresas.",
    faqTitle:"Perguntas frequentes",faq:[["Quanto tempo dura o aluguel?","A referência oferece 24 horas completas a partir da entrega. Confirme o período contratado."],["Preciso de carteira de motorista?","Sim. Consulte os documentos aceitos antes de reservar."],["O pagamento é antecipado?","A referência informa pagamento na entrega, com caução de segurança reembolsável. Confirme as condições atualizadas."],["Onde recebo o veículo?","Consulte a entrega na hospedagem e a área atendida pelo WhatsApp."]],
    footer:"Valores, veículos e condições são referências provisórias. A cliente deve validar estes dados antes de divulgar a oferta."
  },
  us: {
    eyebrow:"EXPLORE BÚZIOS YOUR WAY",title:"24-Hour Buggy Rental in Búzios",subtitle:"Enjoy 24 hours to discover beaches, scenic stops and viewpoints at your own pace.",
    promo:"REFERENCE OFFER • CONFIRM BEFORE BOOKING",per:"per 24 hours / buggy",priceNote:"Reference rate from the original site. Please confirm the current price before booking.",
    book:"Enquire about buggy rental on WhatsApp",features:["Full 24-hour buggy rental","Delivery to Búzios accommodations (8:00–22:00)","Up to 4 passengers per vehicle","No advance payment to reserve"],
    benefitsTitle:"What's included",benefits:["Sun and rain canopy","Vehicle orientation at delivery","Support during the rental","Hotel, guesthouse or Airbnb delivery, where available"],
    howTitle:"How rental works",steps:[["1","Choose your date","Ask about availability for the days you want."],["2","Confirm your booking","Send your name, accommodation and passenger count on WhatsApp."],["3","Receive your buggy","Vehicle delivery at the agreed place and time, following a condition check."],["4","Explore Búzios","Enjoy 24 hours and return the vehicle as agreed."]],
    rulesTitle:"Requirements and conditions",rules:["A valid driving licence is required.","Drivers must be able to operate a manual transmission.","Reference refundable security deposit: R$ 500, subject to an inspection and rental terms.","Fuel is not included: return the buggy with the same fuel level.","Confirm pricing, delivery and cancellation terms before booking."],
    photoTitle:"Real buggy photographs",photoBody:"Coming soon: original photos of the client's own vehicles. We will not display buggies belonging to other companies.",
    faqTitle:"Frequently asked questions",faq:[["How long does a rental last?","The reference offers 24 hours from delivery. Confirm your booking period."],["Do I need a driver's licence?","Yes. Please confirm accepted documentation before booking."],["Do I pay in advance?","The reference offer permits payment at pickup plus a refundable security deposit. Confirm final terms."],["Where is the buggy delivered?","Ask on WhatsApp about hotel delivery and areas served."]],
    footer:"Rates, vehicles and terms are provisional reference information. The client must approve these details before advertising the offer."
  },
  es: {
    eyebrow:"DESCUBRÍ BÚZIOS A TU RITMO",title:"Alquiler de Buggy en Búzios",subtitle:"24 horas de libertad para recorrer playas, miradores y paisajes a tu propio ritmo.",
    promo:"OFERTA DE REFERENCIA • CONFIRMÁ ANTES DE RESERVAR",per:"por 24 horas / buggy",priceNote:"Tarifa tomada como referencia del sitio original. Consultá el precio vigente antes de reservar.",
    book:"Consultar alquiler por WhatsApp",features:["Alquiler por 24 horas completas","Entrega en tu alojamiento en Búzios (8–22 h)","Hasta 4 pasajeros por vehículo","Sin pago anticipado para reservar"],
    benefitsTitle:"Qué incluye",benefits:["Capota para sol y lluvia","Orientación sobre el vehículo al recibirlo","Asistencia durante el alquiler","Entrega en hotel, posada o Airbnb, donde esté disponible"],
    howTitle:"Cómo funciona el alquiler",steps:[["1","Elegí la fecha","Consultá disponibilidad para el período que necesitás."],["2","Confirmá la reserva","Enviá tu nombre, alojamiento y cantidad de pasajeros por WhatsApp."],["3","Recibí el buggy","Entrega en el lugar y horario acordado, con revisión del vehículo."],["4","Recorré Búzios","Disfrutá 24 horas y devolvé el vehículo según lo acordado."]],
    rulesTitle:"Requisitos y condiciones",rules:["Se requiere licencia de conducir vigente.","Es necesario saber conducir con caja de cambios manual.","Depósito de seguridad reembolsable de referencia: R$ 500, sujeto a revisión y condiciones del contrato.","Combustible no incluido: se devuelve con el mismo nivel recibido.","Confirmá precio, entrega y cancelaciones antes de reservar."],
    photoTitle:"Fotografías de los buggies",photoBody:"Próximamente incorporaremos fotos originales de los vehículos de la clienta. No usaremos imágenes de buggies de otras empresas.",
    faqTitle:"Preguntas frecuentes",faq:[["¿Cuánto dura el alquiler?","La referencia indica 24 horas desde la entrega. Confirmá el período al reservar."],["¿Necesito licencia de conducir?","Sí. Consultá los documentos aceptados antes de alquilar."],["¿Hay que pagar por adelantado?","La referencia indica pago al recibir el buggy y depósito de seguridad reembolsable. Confirmá las condiciones."],["¿Dónde recibo el vehículo?","Consultá por WhatsApp las zonas en que se realiza entrega en el alojamiento."]],
    footer:"Precios, vehículos y condiciones son datos provisionales de referencia. La clienta debe aprobarlos antes de anunciar la oferta."
  }
} as const;

export default function RentalExperience({lang,bookingUrl}:{lang:Language;bookingUrl:string}){
 const t=copy[lang];
 return <section id="inicio" className="bb-rental">
   <div className="bb-rental-hero">
     <div className="bb-wrap">
       <span className="bb-rental-eyebrow">✦ {t.eyebrow}</span>
       <h1>{t.title}</h1>
       <p>{t.subtitle}</p>
     </div>
   </div>
   <div className="bb-wrap bb-rental-body">
     <div className="bb-rental-top">
       <div className="bb-rental-price">
         <span className="bb-ref-pill">{t.promo}</span>
         <div className="bb-rental-money"><del>R$ 350</del><strong>R$ 300</strong></div>
         <p>{t.per}</p><small>{t.priceNote}</small>
         <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="bb-button">☏ {t.book}</a>
       </div>
       <div className="bb-rental-keypoints">{t.features.map((x,i)=><div key={x}><span aria-hidden="true">{["◷","⌖","♙","✓"][i]}</span><strong>{x}</strong></div>)}</div>
     </div>
     <div className="bb-rental-photo-placeholder"><span aria-hidden="true">📷</span><div><h2>{t.photoTitle}</h2><p>{t.photoBody}</p></div></div>
     <section className="bb-rental-section"><h2>{t.benefitsTitle}</h2><ul className="bb-rental-benefits">{t.benefits.map(x=><li key={x}><span aria-hidden="true">✓</span>{x}</li>)}</ul></section>
     <section className="bb-rental-section"><h2>{t.howTitle}</h2><div className="bb-rental-steps">{t.steps.map(([n,title,desc])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
     <section className="bb-rental-section"><h2>{t.rulesTitle}</h2><ul className="bb-rental-rules">{t.rules.map(x=><li key={x}>{x}</li>)}</ul></section>
     <section className="bb-rental-section"><h2>{t.faqTitle}</h2><div className="bb-ref-faq">{t.faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
     <div className="bb-rental-bottom"><a className="bb-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">☏ {t.book}</a><p>{t.footer}</p></div>
   </div>
 </section>;
}
