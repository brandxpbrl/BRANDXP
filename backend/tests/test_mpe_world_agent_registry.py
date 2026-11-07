import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.mpe_world_agent_registry import (
    get_mpe_world_agent,
    gravity_governance_context,
    list_mpe_world_agents,
    mpe_world_registry,
)


class MpeWorldAgentRegistryTests(unittest.TestCase):
    def test_registry_contains_canonical_agents_without_replacing_orbis(self):
        agents = list_mpe_world_agents()
        self.assertEqual(len(agents), 13)
        self.assertEqual(
            {item["id"] for item in agents},
            {"00B", "001", "027", "028", "029", "030", "031", "032", "033", "034", "099", "GPT", "GEMINI"},
        )

    def test_human_authority_and_truth_boundaries_are_explicit(self):
        registry = mpe_world_registry()
        governance = registry["human_governance"]
        self.assertEqual(governance["ultimate_authority"], "human")
        self.assertTrue(governance["simulations_are_not_facts"])
        self.assertTrue(governance["creative_outputs_are_not_evidence"])

    def test_every_agent_has_snapshot_provenance_without_runtime_dependency(self):
        agents = list_mpe_world_agents()
        self.assertTrue(all(len(item["provenance"]["sha256"]) == 64 for item in agents))
        self.assertEqual(len({item["provenance"]["sha256"] for item in agents}), 13)
        registry = mpe_world_registry()
        self.assertEqual(registry["source_manifest"]["capture_kind"], "founder_supplied_attachment_snapshot")
        self.assertIn("pending_resolution", registry["source_manifest"]["canonical_drive_location"])

    def test_sensitive_agents_have_runtime_limits(self):
        legislator = get_mpe_world_agent("034")
        purger = get_mpe_world_agent("099")
        dreamer = get_mpe_world_agent("El Soñador")
        self.assertIn("override_human_authority", legislator["must_not"])
        self.assertIn("delete_without_policy", purger["must_not"])
        self.assertIn("present_creative_output_as_evidence", dreamer["must_not"])

    def test_gravity_receives_mpe_governance_before_execution(self):
        context = gravity_governance_context()
        self.assertIn("Human authority is final", context)
        self.assertIn("00B El Escribano", context)
        self.assertIn("GPT El Auditor", context)
        self.assertIn("099 El Purgador", context)


if __name__ == "__main__":
    unittest.main()
