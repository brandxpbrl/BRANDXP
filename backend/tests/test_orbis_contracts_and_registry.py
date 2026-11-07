import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.orbis.contracts import Evidence, TruthKind
from services.orbis_agent_registry import list_orbis_agents


class OrbisContractsAndRegistryTests(unittest.TestCase):
    def test_registry_contains_ten_positions_with_four_validated(self):
        agents = list_orbis_agents()
        self.assertEqual(len(agents), 10)
        validated = [item for item in agents if item["activation_state"] == "identity_validated"]
        self.assertEqual({item["id"] for item in validated}, {"nicolas", "nova", "lyra", "axiom"})

    def test_evidence_keeps_truth_kind_and_provenance(self):
        evidence = Evidence(
            id="evidence-1",
            claim="El ingreso aproximado fue USD 4,00.",
            source="Meta dashboard",
            observed_at="2026-11-07T00:00:00-03:00",
            truth_kind=TruthKind.FACT,
            confidence=0.95,
            period="9 oct - 5 nov",
        )
        payload = evidence.to_dict()
        self.assertEqual(payload["truth_kind"], TruthKind.FACT)
        self.assertEqual(payload["source"], "Meta dashboard")

    def test_evidence_rejects_invalid_confidence(self):
        with self.assertRaises(ValueError):
            Evidence(
                id="evidence-2",
                claim="Hipotesis",
                source="Simulation",
                observed_at="2026-11-07T00:00:00-03:00",
                truth_kind=TruthKind.SIMULATION,
                confidence=1.2,
            )


if __name__ == "__main__":
    unittest.main()
