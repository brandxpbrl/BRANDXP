import json
import os
import tempfile
import unittest
from pathlib import Path

from services.mpe.mpe_runtime_bridge import build_runtime_snapshot


ENV_KEYS = [
    "MPE_KERNEL_STATUS_PATH",
    "MPE_SERVICE_HEALTH_PATH",
    "MPE_KERNEL_EVENTS_PATH",
    "MPE_EARTH_MEMORY_PATH",
    "MPE_ARTIFACT_INDEX_PATH",
]


class RuntimeBridgeTest(unittest.TestCase):
    def tearDown(self):
        for key in ENV_KEYS:
            os.environ.pop(key, None)

    def test_disconnected_without_configured_sources(self):
        snapshot = build_runtime_snapshot()
        self.assertEqual(snapshot["mode"], "DISCONNECTED")
        self.assertEqual(snapshot["events"], [])
        self.assertEqual(snapshot["artifacts"], [])
        self.assertFalse(snapshot["provenance"]["synthetic_activity"])

    def test_reads_and_sanitizes_real_sources(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            kernel = root / "kernel_status.json"
            services = root / "service_health.csv"
            events = root / "kernel_events.jsonl"
            earth = root / "earth_memory.jsonl"
            artifacts = root / "artifacts.json"

            kernel.write_text(json.dumps({"status": "online", "tick": 7}), encoding="utf-8")
            services.write_text("service,status,timestamp\nEarth Server,online,2026-09-01T18:00:00Z\n", encoding="utf-8")
            events.write_text(json.dumps({"event_id": "evt-1", "event_type": "SENSOR_EVENT", "source": "sensor", "timestamp": "2026-09-01T18:00:01Z"}) + "\n", encoding="utf-8")
            earth.write_text(json.dumps({"event_id": "evt-2", "type": "EARTH_STATE", "source_service": "Earth Server", "ts": "2026-09-01T18:00:02Z"}) + "\n", encoding="utf-8")
            artifacts.write_text(json.dumps([{"artifact_id": "art-1", "artifact_name": "frame.glb", "artifact_type": "GLB", "producer": "morphogenesis", "source_event_ref": "evt-2", "path": "C:/private/output/frame.glb"}]), encoding="utf-8")

            os.environ["MPE_KERNEL_STATUS_PATH"] = str(kernel)
            os.environ["MPE_SERVICE_HEALTH_PATH"] = str(services)
            os.environ["MPE_KERNEL_EVENTS_PATH"] = str(events)
            os.environ["MPE_EARTH_MEMORY_PATH"] = str(earth)
            os.environ["MPE_ARTIFACT_INDEX_PATH"] = str(artifacts)

            snapshot = build_runtime_snapshot()

            self.assertEqual(snapshot["mode"], "LIVE")
            self.assertEqual(snapshot["kernel"]["tick"], 7)
            self.assertEqual(snapshot["services"][0]["name"], "Earth Server")
            self.assertEqual([event["id"] for event in snapshot["events"]], ["evt-1", "evt-2"])
            self.assertEqual(snapshot["artifacts"][0]["source_ref"], "evt-2")
            self.assertNotIn("path", snapshot["artifacts"][0])
            self.assertFalse(snapshot["provenance"]["raw_local_paths_exposed"])


if __name__ == "__main__":
    unittest.main()
