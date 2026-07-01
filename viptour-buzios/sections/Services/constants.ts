import { siteConfig } from "@/config/site";
import type { ServiceCard } from "./types";

const whatsappLink = siteConfig.links.whatsappMessage;

export const servicesLabel = "Passeios e serviços";
export const servicesTitle = "Uma tabela clara, direta e pronta para reservar";
export const servicesDescription =
  "Mostramos o valor de venda para cada experiência y dejamos los detalles internos fuera de la vista del cliente.";

export const services: ServiceCard[] = [
  {
    title: "Passeio de escuna",
    description: "Passeio marítimo para explorar a costa com paradas selecionadas.",
    price: { label: "Valor de venda", value: "R$ 80" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Passeio de buggy com motorista",
    description: "Roteiro guiado com conforto, praticidade e visão local.",
    price: { label: "Valor de venda", value: "R$ 100" },
    ctaLabel: "Reservar agora",
    href: whatsappLink,
  },
  {
    title: "Aluguel de buggy",
    description: "Buggy para quem quer total liberdade de explorar Búzios no próprio ritmo.",
    price: { label: "Valor de venda", value: "R$ 350" },
    ctaLabel: "Pedir disponibilidade",
    href: whatsappLink,
  },
  {
    title: "Aluguel de carro",
    description: "Opção prática para deslocamentos e roteiros personalizados.",
    price: { label: "Valor de venda", value: "R$ 450" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Passeio Arraial do Cabo",
    description: "Experiência com almoço incluso para curtir a região sem preocupação.",
    price: { label: "Valor de venda", value: "R$ 220" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Passeio Arraial do Cabo completo",
    description: "Roteiro completo com caipirinha para uma experiência ainda mais especial.",
    price: { label: "Valor de venda", value: "R$ 280" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Passeio Cabo Frio",
    description: "Passeio clássico para aproveitar a beleza da região com boa logística.",
    price: { label: "Valor de venda", value: "R$ 220" },
    ctaLabel: "Reservar pelo WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Passeio Rio de Janeiro",
    description: "Opção para conhecer a cidade com suporte e organização.",
    price: { label: "Valor de venda", value: "R$ 380" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Locação de bicicleta 24h",
    description: "Alternativa econômica para deslocamentos curtos e passeio livre.",
    price: { label: "Valor de venda", value: "R$ 140" },
    ctaLabel: "Pedir disponibilidade",
    href: whatsappLink,
  },
  {
    title: "Mergulho batismo",
    description: "Primeiro contato com o mergulho com acompanhamento e segurança.",
    price: { label: "Valor de venda", value: "R$ 240" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Transfer aeroporto",
    description: "Traslado prático para começar a viagem sem fricção.",
    price: { label: "Valor de venda", value: "R$ 140" },
    ctaLabel: "Reservar agora",
    href: whatsappLink,
  },
  {
    title: "Transfer privado",
    description: "Carro para 4 ou 6 lugares com atendimento dedicado.",
    price: { label: "Valor de venda", value: "R$ 600" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Lancha privada",
    description: "Passeio privativo para 8 pessoas com experiência exclusiva.",
    price: { label: "Valor de venda", value: "R$ 1.600" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Helicóptero",
    description: "Experiência premium sujeita a consulta.",
    price: { label: "Valor de venda", value: "A consultar" },
    note: "Consulta personalizada por WhatsApp",
    ctaLabel: "Falar com a equipe",
    href: whatsappLink,
  },
  {
    title: "Arubinha / Caminho de Moisés",
    description: "Passeio para explorar um dos pontos mais buscados da região.",
    price: { label: "Valor de venda", value: "R$ 350" },
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Caminhada guiada de bicicleta",
    description: "Experiência guiada sujeita a consulta.",
    price: { label: "Valor de venda", value: "A consultar" },
    note: "Confirme disponibilidade por WhatsApp",
    ctaLabel: "Consultar no WhatsApp",
    href: whatsappLink,
  },
  {
    title: "Valores para grandes grupos",
    description: "Tarifas especiais sob consulta para grupos maiores.",
    price: { label: "Valor de venda", value: "A consultar" },
    note: "Atendimento especial para grupos",
    ctaLabel: "Pedir cotação",
    href: whatsappLink,
  },
];
