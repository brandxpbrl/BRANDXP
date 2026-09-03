import { buildPossibilityGraph, createState, generateStructuralCandidates } from "./engine";

// Compile-time semantic fixture. This file intentionally has no runtime side effects.
const fixtureState = createState({
  objective: "explore a new project",
  resources: ["time"],
  unknowns: ["demand"],
});
const fixtureNodes = generateStructuralCandidates(fixtureState);
export const LIVING_PLASMA_CONTRACT_FIXTURE = buildPossibilityGraph(fixtureState, fixtureNodes);

// Literal false is enforced by PossibilityGraph's type contract.
const nonExhaustive: false = LIVING_PLASMA_CONTRACT_FIXTURE.exploration.exhaustiveClaimAllowed;
void nonExhaustive;
