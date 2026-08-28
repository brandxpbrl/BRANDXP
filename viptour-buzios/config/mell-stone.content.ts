export type MellCollection = {
  slug: string;
  name: string;
  mood: string;
  description: string;
};

export type MellMaterial = {
  slug: string;
  name: string;
  description: string;
  visualCharacteristics: string[];
};

export type MellProductStatus = "placeholder" | "available" | "reserved" | "sold";

export type MellProduct = {
  id: string;
  slug: string;
  name: string;
  category: "colares" | "pulseiras" | "brincos" | "conjuntos" | "outros";
  collection: string;
  price: number | null;
  currency: "BRL";
  description: string;
  shortDescription: string;
  images: string[];
  materials: string[];
  color: string;
  isUnique: boolean;
  stock: number | null;
  featured: boolean;
  dimensions: string;
  hardware: string;
  care: string;
  status: MellProductStatus;
};

export const mellStoneBrand = {
  name: "Mell & Stone",
  tagline: "Where Nature Becomes Art.",
  essence: "Natural Luxury",
  canonical: "https://www.riovibestransfer.com/mell-stone",
  whatsapp:
    "https://wa.me/5545999686381?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Mell%20%26%20Stone%20e%20quero%20conhecer%20as%20pe%C3%A7as.",
  instagram: "https://www.instagram.com/",
  statement:
    "A natureza levou milhões de anos criando a obra. Nós apenas a finalizamos.",
  manifesto:
    "Mell & Stone não fabrica acessórios. Revela a beleza irrepetível que a natureza levou milhões de anos para criar, unindo a força dos minerais à delicadeza das mãos que os transformam.",
} as const;

export const mellCollections: MellCollection[] = [
  {
    slug: "earth",
    name: "Earth",
    mood: "matéria, tempo e superfície",
    description:
      "Peças de presença mineral, feitas para carregar a beleza imperfeita das formas naturais.",
  },
  {
    slug: "ocean",
    name: "Ocean",
    mood: "brilho orgânico e calma",
    description:
      "Texturas claras, pérolas, nácar e movimentos que lembram água, luz e silêncio.",
  },
  {
    slug: "forest",
    name: "Forest",
    mood: "profundidade verde",
    description:
      "Materiais com tons botânicos e leitura mais introspectiva, entre sombra e detalhe.",
  },
  {
    slug: "fire",
    name: "Fire",
    mood: "calor, contraste e gesto",
    description:
      "Composições mais intensas, com metais quentes e pontos de luz controlados.",
  },
  {
    slug: "signature",
    name: "Signature",
    mood: "a linguagem essencial",
    description:
      "A seleção mais reconhecível da marca, pensada como pequenas obras de arte vestíveis.",
  },
];

export const mellMaterials: MellMaterial[] = [
  {
    slug: "perolas",
    name: "Pérolas",
    description:
      "Superfície luminosa e orgânica, com variações sutis que tornam cada composição singular.",
    visualCharacteristics: ["brilho suave", "forma orgânica", "luz cremosa"],
  },
  {
    slug: "jade",
    name: "Jade",
    description:
      "Pedra de presença calma, valorizada pela profundidade visual e pelo verde naturalmente sofisticado.",
    visualCharacteristics: ["verde mineral", "toque polido", "densidade visual"],
  },
  {
    slug: "onix",
    name: "Ônix",
    description:
      "Preto profundo e elegante, ideal para contraste, linhas gráficas e composições atemporais.",
    visualCharacteristics: ["preto intenso", "alto contraste", "acabamento polido"],
  },
  {
    slug: "nacar",
    name: "Nácar",
    description:
      "Reflexos delicados e irregulares que mudam conforme a luz, como uma superfície natural em movimento.",
    visualCharacteristics: ["iridescência", "claridade", "reflexo natural"],
  },
  {
    slug: "pedra-vulcanica",
    name: "Pedra vulcânica",
    description:
      "Textura porosa, escura e tátil, com uma força visual que vem da própria matéria.",
    visualCharacteristics: ["textura porosa", "grafite natural", "presença tátil"],
  },
  {
    slug: "agua-marinha",
    name: "Água-marinha",
    description:
      "Tonalidade translúcida e fria, escolhida por sua delicadeza visual e leitura contemporânea.",
    visualCharacteristics: ["azul suave", "transparência", "leveza"],
  },
  {
    slug: "howlita-turquesa",
    name: "Howlita turquesa",
    description:
      "Veios naturais e cor marcante para peças com caráter artesanal e ritmo mediterrâneo.",
    visualCharacteristics: ["veios aparentes", "azul mineral", "desenho natural"],
  },
  {
    slug: "olho-de-tigre",
    name: "Olho de tigre",
    description:
      "Camadas douradas e marrons que criam profundidade visual e movimento quando recebem luz.",
    visualCharacteristics: ["camadas quentes", "reflexo dourado", "profundidade"],
  },
  {
    slug: "jaspe-imperial",
    name: "Jaspe imperial",
    description:
      "Desenhos minerais irregulares, escolhidos pela composição gráfica que cada peça revela.",
    visualCharacteristics: ["padrão mineral", "tons terrosos", "desenho único"],
  },
  {
    slug: "agata",
    name: "Ágata",
    description:
      "Linhas e camadas naturais que fazem cada fragmento parecer uma pequena paisagem.",
    visualCharacteristics: ["linhas naturais", "camadas", "translucidez"],
  },
  {
    slug: "quartzo-verde",
    name: "Quartzo verde",
    description:
      "Verde suave, aspecto translúcido e presença discreta para composições calmas.",
    visualCharacteristics: ["verde claro", "luz interna", "suavidade"],
  },
];

export const mellProducts: MellProduct[] = [
  {
    id: "ms-perolas-cristal-01",
    slug: "conjunto-perolas-cristal-01",
    name: "Conjunto Pérolas & Cristal 01",
    category: "colares",
    collection: "ocean",
    price: null,
    currency: "BRL",
    description:
      "Conjunto artesanal de colar e pulseira com pérolas e cristais naturais em uma composição luminosa, delicada e orgânica.",
    shortDescription: "Pérolas, brilho natural e acabamento dourado.",
    images: ["/images/mell-stone/products/conjunto-perolas-cristal-01.png"],
    materials: ["Pérolas", "Cristais naturais", "Metal dourado"],
    color: "Ivory / Champagne",
    isUnique: true,
    stock: null,
    featured: true,
    dimensions: "A confirmar",
    hardware: "A confirmar",
    care: "Evitar contato com água, perfumes e abrasivos. Guardar separadamente.",
    status: "available",
  },
  {
    id: "ms-perolas-cristal-02",
    slug: "conjunto-perolas-cristal-02",
    name: "Conjunto Pérolas & Cristal 02",
    category: "conjuntos",
    collection: "ocean",
    price: null,
    currency: "BRL",
    description:
      "Composição artesanal de colar e pulseira criada para revelar a transparência dos cristais, o brilho das pérolas e a beleza dos pequenos desvios naturais.",
    shortDescription: "Uma composição luminosa feita à mão.",
    images: ["/images/mell-stone/products/conjunto-perolas-cristal-02.png"],
    materials: ["Pérolas", "Cristais naturais", "Metal dourado"],
    color: "Champagne",
    isUnique: true,
    stock: null,
    featured: true,
    dimensions: "A confirmar",
    hardware: "A confirmar",
    care: "Guardar longe de umidade e limpar com pano seco e macio.",
    status: "available",
  },
  {
    id: "ms-perolas-prata-01",
    slug: "conjunto-perolas-prata-01",
    name: "Conjunto Pérolas Prata 01",
    category: "conjuntos",
    collection: "signature",
    price: null,
    currency: "BRL",
    description:
      "Conjunto de pérolas naturais com acabamento prateado, pensado para quem procura elegância silenciosa e uma presença que permanece.",
    shortDescription: "Pérolas naturais e acabamento prateado.",
    images: ["/images/mell-stone/products/conjunto-perolas-prata-01.jpeg"],
    materials: ["Pérolas", "Metal prateado"],
    color: "Pearl / Silver",
    isUnique: true,
    stock: null,
    featured: true,
    dimensions: "A confirmar",
    hardware: "A confirmar",
    care: "Evitar quedas e contato com produtos químicos.",
    status: "available",
  },
];

export const mellCategories = [
  "colares",
  "pulseiras",
  "brincos",
  "conjuntos",
  "outros",
] as const;

export function getMellProduct(slug: string) {
  return mellProducts.find((product) => product.slug === slug);
}
