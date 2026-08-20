"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Diagnóstico", desc: "Analisamos o cenário, o público e o valor que precisa emergir." },
  { num: "02", title: "Direção", desc: "Definimos a narrativa, a estratégia e o caminho criativo." },
  { num: "03", title: "Identidade", desc: "Construímos uma linguagem visual que representa a essência." },
  { num: "04", title: "Produção", desc: "Fotografamos, filmamos e criamos com técnica e sensibilidade." },
  { num: "05", title: "Ativação", desc: "Entregamos e ativamos o sistema nos canais relevantes." },
];

export default function Method() {
  return (
    <section id="method" className="fragma-method-section px-6">
      <div className="mx-auto max-w-[var(--fragma-content-max)]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end">
          <div className="space-y-5">
            <span className="fragma-eyebrow">FRAGMA method</span>
            <h2 className="fragma-display max-w-3xl text-4xl leading-[1.04] tracking-[-0.035em] text-[#1F1F1F] sm:text-6xl">
              Antes de produzir, entendemos.
            </h2>
          </div>
          <p className="fragma-body max-w-md text-base leading-8 text-[#8E7867]">
            Um percurso editorial para transformar intenção em uma experiência clara, reconhecível e consistente.
          </p>
        </div>

        <div className="fragma-method-grid">
          {steps.map((step, idx) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="fragma-method-step min-h-[15rem] p-6 sm:p-7"
            >
              <span className="fragma-index">{step.num}</span>
              <h3 className="fragma-display mt-10 text-2xl leading-tight text-[#1F1F1F]">{step.title}</h3>
              <p className="fragma-body mt-4 text-sm leading-7 text-[#8E7867]">{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
