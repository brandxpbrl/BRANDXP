import type { MpeState, Possibility } from "./model";
import { applyStatePerturbation, createFactRemovalPerturbation } from "./perturbation-engine";
import type { ScenarioCase } from "./scenario-persistence";

export function buildResourceRemovalScenarioSuite(state:MpeState, possibilities:Possibility[]):ScenarioCase[] {
  return state.resources.map((resource,index)=>{
    const perturbation=createFactRemovalPerturbation(resource.id,resource.label);
    return {
      id:`scenario-resource-${index+1}`,
      label:`Sin ${resource.label}`,
      result:applyStatePerturbation(state,possibilities,perturbation),
    };
  });
}
