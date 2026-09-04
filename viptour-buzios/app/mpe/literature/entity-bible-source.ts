export type SourcePrinciple={id:string;text:string;sources:string[]};

// Source-derived compact projection from the user-supplied ENTITY_BIBLE.zip.
// These principles are repeated explicitly across the Entity Bible documents and retain source traceability.
export const ENTITY_BIBLE_SOURCE_PRINCIPLES:SourcePrinciple[]=[
 {id:"perception-before-logic",text:"Every entity transmits emotional meaning before logical understanding.",sources:["perception/perception_before_logic.md","entity_detection/entity_voice.md","philosophy/creative_intelligence.md"]},
 {id:"emotional-reaction-before-analysis",text:"Human beings emotionally react before rationally analyzing.",sources:["perception/perception_before_logic.md","entity_detection/entity_voice.md","philosophy/creative_intelligence.md"]},
 {id:"perceptual-effects",text:"Aesthetics shape emotional expectation; perception defines value; atmosphere influences trust; visual coherence generates authority.",sources:["perception/perception_before_logic.md","narrative_architecture/principles.md","storytelling/framework.md"]},
 {id:"premium-coherence",text:"High-value perception is associated with coherence, restraint, emotional precision, visual rhythm and symbolic consistency.",sources:["luxury/presence_over_noise.md","perception/perception_before_logic.md"]},
 {id:"narrative-translation",text:"Narrative translation should create emotional depth, atmospheric storytelling, symbolic meaning, identity reinforcement and transformational perception.",sources:["narrative_architecture/principles.md","storytelling/framework.md","memory/principles.md"]},
 {id:"avoid-perceptual-noise",text:"Generic aesthetics, emotional inconsistency, trend dependency, visual noise, lack of symbolic direction and superficial execution are listed as coherence risks.",sources:["forbidden_patterns/rules.md","narrative_architecture/principles.md"]},
 {id:"network-intelligence",text:"The Entity Bible states that intelligence should emerge through relationships between concepts rather than isolated information.",sources:["KNOWLEDGE_NETWORK.md","storytelling/framework.md","perception/perception_before_logic.md"]},
 {id:"cross-reference-before-output",text:"Agents connected to the Entity Bible should explore related concepts before generating strategic outputs.",sources:["storytelling/framework.md","perception/perception_before_logic.md","entity_detection/entity_voice.md"]},
];

export const ENTITY_BIBLE_SOURCE_BOUNDARY="SOURCE_PROJECTION_IS_NOT_FULL_DOCUMENT_TEXT" as const;
