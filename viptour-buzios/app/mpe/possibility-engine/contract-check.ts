import { buildPossibilityGraph, createState, generateStructuralCandidates } from "./engine";
import { buildPossibilityMorphospace } from "./possibility-morphospace";

// Compile-time semantic fixture. This file intentionally has no runtime side effects.
const fixtureState = createState({
  objective: "explore a new project",
  resources: ["time"],
  unknowns: ["demand"],
});
const fixtureNodes = generateStructuralCandidates(fixtureState);
export const LIVING_PLASMA_CONTRACT_FIXTURE = buildPossibilityGraph(fixtureState, fixtureNodes);
export const POSSIBILITY_MORPHOSPACE_CONTRACT_FIXTURE = buildPossibilityMorphospace(
  LIVING_PLASMA_CONTRACT_FIXTURE,
  null,
);

// Literal false is enforced by PossibilityGraph's type contract.
const nonExhaustive: false = LIVING_PLASMA_CONTRACT_FIXTURE.exploration.exhaustiveClaimAllowed;
void nonExhaustive;

const morphospaceBoundary: "MORPHOSPACE_IS_STRUCTURAL_MAP_NOT_EVIDENCE" =
  POSSIBILITY_MORPHOSPACE_CONTRACT_FIXTURE.boundary;
const persistenceBoundary: "STRUCTURAL_PERSISTENCE_IS_NOT_PROBABILITY" =
  POSSIBILITY_MORPHOSPACE_CONTRACT_FIXTURE.persistenceBoundary;
const geometryBoundary: "GEOMETRY_IS_VISUALIZATION_NOT_EVIDENCE" =
  POSSIBILITY_MORPHOSPACE_CONTRACT_FIXTURE.geometryBoundary;
void morphospaceBoundary;
void persistenceBoundary;
void geometryBoundary;
