import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.gravity_registry import get_gravity_agent, gravity_execution_graph, list_gravity_agents
from services.gravity_trace import GravityEventType, GravityTraceEvent


class GravityRegistryAndTraceTests(unittest.TestCase):
    def test_registry_has_exactly_34_prompt_only_agents(self):
        agents = list_gravity_agents()
        self.assertEqual(len(agents), 34)
        self.assertTrue(all(agent["execution_kind"] == "prompt_only" for agent in agents))
        self.assertEqual(len({agent["source_sha256"] for agent in agents}), 34)

    def test_namespaces_keep_gravity_and_mpe_agents_distinct(self):
        self.assertEqual(get_gravity_agent("A00B")["namespaced_id"], "GRAVITY:A00B")
        graph = gravity_execution_graph()
        self.assertTrue(graph["governance"]["gravity_a00b_is_not_mpe_00b"])

    def test_macro_agents_are_truly_sequential_in_graph(self):
        self.assertEqual(get_gravity_agent("A27")["depends_on"], ["A00B"])
        for number in range(28, 35):
            self.assertEqual(get_gravity_agent(f"A{number}")["depends_on"], [f"A{number - 1:02d}"])
        self.assertEqual(get_gravity_agent("A00")["depends_on"], ["A34", "A00B"])

    def test_failed_and_skipped_events_require_reasons(self):
        base = dict(id="event-1", run_id="run-1", task_id="task-1", component_id="GRAVITY:A23", sequence=1, origin="runtime")
        with self.assertRaises(ValueError):
            GravityTraceEvent(event_type=GravityEventType.FAILED, **base)
        with self.assertRaises(ValueError):
            GravityTraceEvent(event_type=GravityEventType.SKIPPED, **base)

    def test_trace_preserves_hashes_and_causal_parents(self):
        event = GravityTraceEvent(
            id="event-2", run_id="run-1", task_id="task-1", component_id="GRAVITY:A23",
            event_type=GravityEventType.AGENT_OUTPUT_SAVED, sequence=2, origin="runtime",
            causal_parent_ids=["event-1"], source_hashes=["a" * 64], output_hash="b" * 64,
        ).to_dict()
        self.assertEqual(event["causal_parent_ids"], ["event-1"])
        self.assertEqual(event["source_hashes"], ["a" * 64])


if __name__ == "__main__":
    unittest.main()
