import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.orbis import runtime


class OrbisRuntimeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_root = runtime.OBJECTIVES_ROOT
        runtime.OBJECTIVES_ROOT = Path(self.temp.name) / "objectives"

    def tearDown(self):
        runtime.OBJECTIVES_ROOT = self.original_root
        self.temp.cleanup()

    def test_creates_durable_objective_with_plan_delegations_and_gate(self):
        result = runtime.create_objective(
            {
                "title": "Lanzar campaña validada",
                "description": "Preparar una campaña sin publicar automáticamente.",
                "success_criteria": ["Reporte aprobado", "Guion listo"],
            }
        )
        self.assertEqual(result["goal"]["owner_agent_id"], "nicolas")
        self.assertEqual(len(result["tasks"]), 4)
        self.assertEqual(len(result["delegations"]), 3)
        self.assertEqual(result["execution_gate"]["state"], "locked")
        self.assertFalse(result["execution_gate"]["external_actions_allowed"])
        reloaded = runtime.get_objective(result["goal"]["id"])
        self.assertEqual(reloaded["plan"]["id"], result["plan"]["id"])

    def test_rejects_draft_agent_assignment(self):
        with self.assertRaisesRegex(ValueError, "not validated"):
            runtime.create_objective(
                {
                    "title": "Investigación",
                    "tasks": [{"title": "Investigar", "assignee_agent_id": "gaia"}],
                }
            )

    def test_enforces_dependencies_and_human_approval(self):
        result = runtime.create_objective({"title": "Flujo controlado"})
        goal_id = result["goal"]["id"]
        first, second, third, final = result["tasks"]
        with self.assertRaisesRegex(ValueError, "dependencies"):
            runtime.transition_task(goal_id, second["id"], "active", "axiom")
        runtime.transition_task(goal_id, first["id"], "active", "nicolas")
        runtime.transition_task(goal_id, first["id"], "completed", "nicolas")
        runtime.transition_task(goal_id, second["id"], "active", "axiom")
        runtime.transition_task(goal_id, second["id"], "completed", "axiom")
        runtime.transition_task(goal_id, third["id"], "active", "nova")
        runtime.transition_task(goal_id, third["id"], "completed", "nova")
        runtime.transition_task(goal_id, final["id"], "active", "lyra")
        with self.assertRaisesRegex(ValueError, "Human approval"):
            runtime.transition_task(goal_id, final["id"], "completed", "lyra")
        approval_id = result["approvals"][0]["id"]
        with self.assertRaisesRegex(ValueError, "not authorized"):
            runtime.decide_approval(goal_id, approval_id, "approved", "Otro usuario")
        approved = runtime.decide_approval(goal_id, approval_id, "approved", "Felipe Vallejo")
        self.assertTrue(approved["execution_gate"]["external_actions_allowed"])
        completed = runtime.transition_task(goal_id, final["id"], "completed", "lyra")
        self.assertEqual(completed["tasks"][-1]["state"], "completed")


if __name__ == "__main__":
    unittest.main()
