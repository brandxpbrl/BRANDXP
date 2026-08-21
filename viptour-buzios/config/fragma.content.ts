export type FragmaAssetStatus = "verified" | "candidate-real-unverified" | "editorial" | "generated-or-unverified";

export type FragmaCase = {
  id: "buziosama" | "casa-da-vo";
  name: string;
  category: string;
  summary: string;
  documentedStages: string[];
  assetStatus: FragmaAssetStatus;
  plannedAssetRoot: string;
};

export type FragmaVisualFrame = {
  src: string;
  alt: string;
  label: string;
  aspect: string;
  fit?: "cover" | "contain";
};

export type FragmaCaseAsset = {
  src: string;
  alt: string;
  label: string;
  role: "identity" | "storytelling" | "digital";
  fit?: "cover" | "contain";
};

export const fragmaCases: FragmaCase[] = [
  {
    id: "buziosama",
    name: "BUZIOSAMA",
    category: "Hospitality / destination experience",
    summary: "Caso existente en el portal, pendiente de normalización dentro del modelo de trabajo real de FRAGMA.",
    documentedStages: ["identity", "visual direction", "digital applications"],
    assetStatus: "candidate-real-unverified",
    plannedAssetRoot: "/images/fragma/cases/buziosama/",
  },
  {
    id: "casa-da-vo",
    name: "CASA DA VÓ",
    category: "Hospitality / property experience",
    summary: "Caso documentado mediante brand core, identidad y piezas editoriales; la procedencia de la fotografía debe confirmarse antes de publicarla como evidencia.",
    documentedStages: ["identity foundation", "values and personality", "visual system", "tone and voice", "positioning", "identity applications"],
    assetStatus: "candidate-real-unverified",
    plannedAssetRoot: "/images/fragma/cases/casa-da-vo/",
  },
];

export const fragmaVisualFrames: FragmaVisualFrame[] = [
  {
    src: "/images/buziosama-experiencias.jpg",
    alt: "Material visual de BUZIOSAMA sobre experiencias",
    label: "BUZIOSAMA / EXPERIÊNCIA",
    aspect: "aspect-[3/2]",
  },
  {
    src: "/images/buziosama-quarto.jpg",
    alt: "Material visual de BUZIOSAMA sobre hospitalidade",
    label: "BUZIOSAMA / HOSPITALIDADE",
    aspect: "aspect-[3/2]",
  },
  {
    src: "/images/buziosama-retiros.jpg",
    alt: "Material visual de BUZIOSAMA sobre retiros",
    label: "BUZIOSAMA / RETIROS",
    aspect: "aspect-[3/2]",
    fit: "contain",
  },
  {
    src: "/images/buziosama-board.jpg",
    alt: "Material visual de BUZIOSAMA sobre identidade",
    label: "BUZIOSAMA / IDENTIDADE",
    aspect: "aspect-[3/2]",
    fit: "contain",
  },
  {
    src: "/images/buziosama-decor.jpg",
    alt: "Material visual de BUZIOSAMA sobre direção visual",
    label: "BUZIOSAMA / DIREÇÃO VISUAL",
    aspect: "aspect-[3/2]",
  },
];

export const fragmaCasaDaVoAssets: FragmaCaseAsset[] = [
  {
    src: "/images/fragma/cases/casa-da-vo/identity/brand-core.png",
    alt: "Brand core de Casa da Vo Buzios con identidad, valores y sistema visual",
    label: "IDENTITY / BRAND CORE",
    role: "identity",
    fit: "contain",
  },
  {
    src: "/images/fragma/cases/casa-da-vo/storytelling/property-welcome.png",
    alt: "Pieza de bienvenida de Casa da Vo con la fachada de la casa",
    label: "STORYTELLING / WELCOME",
    role: "storytelling",
    fit: "contain",
  },
  {
    src: "/images/fragma/cases/casa-da-vo/storytelling/slow-days.png",
    alt: "Pieza editorial Dias sem pressa para Casa da Vo",
    label: "STORYTELLING / ATMOSPHERE",
    role: "storytelling",
    fit: "contain",
  },
  {
    src: "/images/fragma/cases/casa-da-vo/storytelling/family-memories.png",
    alt: "Pieza editorial Momentos que viram memorias para Casa da Vo",
    label: "STORYTELLING / MEMORY",
    role: "storytelling",
    fit: "contain",
  },
  {
    src: "/images/fragma/cases/casa-da-vo/digital/five-reasons.png",
    alt: "Pieza digital Cinco pequenos motivos para elegir Casa da Vo",
    label: "DIGITAL / CONTENT PIECE",
    role: "digital",
    fit: "contain",
  },
];
