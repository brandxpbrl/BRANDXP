import json
import sys
import tempfile
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import agent_report_pipeline, orbis_agent_registry


class OrbisAgentReportPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.original_docs = orbis_agent_registry.ORBIS_DOCUMENTATION_ROOT
        self.original_reports = agent_report_pipeline.REPORTS_ROOT
        orbis_agent_registry.ORBIS_DOCUMENTATION_ROOT = self.root / "documentation"
        agent_report_pipeline.REPORTS_ROOT = self.root / "reports"
        self._seed_axiom()

    def tearDown(self):
        orbis_agent_registry.ORBIS_DOCUMENTATION_ROOT = self.original_docs
        agent_report_pipeline.REPORTS_ROOT = self.original_reports
        self.temp.cleanup()

    def _write(self, relative, content):
        path = orbis_agent_registry.ORBIS_DOCUMENTATION_ROOT / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def _seed_axiom(self):
        for folder in orbis_agent_registry.DOCUMENT_SECTIONS.values():
            content = "# Axiom Vale — Documento\n"
            if folder == "00_MASTER_IDENTIDAD":
                content += """
**Nombre completo:** Axiom Vale
**Cargo:** Director de Finanzas y Economia
**Especialidad organizacional:** presupuestos e indicadores

## Mision
Transformar informacion economica en decisiones verificables.

## Estado
Identidad definida.
"""
            self._write(f"axiom/{folder}/document.md", content)

    def test_registry_discovers_agent_from_documentation(self):
        agents = orbis_agent_registry.list_orbis_agents()
        self.assertEqual(len(agents), 1)
        self.assertEqual(agents[0]["name"], "Axiom Vale")
        self.assertTrue(agents[0]["documentation_complete"])

    def test_finance_report_builds_script_video_plan_and_files(self):
        result = agent_report_pipeline.generate_agent_report(
            {
                "agent_id": "axiom",
                "company": "Facemoney",
                "objective": "Explicar la primera monetizacion",
                "duration_seconds": 45,
                "metrics": [
                    {
                        "label": "Visualizaciones",
                        "value": "1.963",
                        "period": "9 oct - 5 nov",
                        "source": "metricas2.png",
                    },
                    {
                        "label": "Ingresos aproximados",
                        "value": "US$4,00",
                        "period": "9 oct - 5 nov",
                        "source": "metricas2.png",
                    },
                ],
                "evidence": [
                    {
                        "claim": "Facebook pago casi US$3.000 millones a creadores en 2025.",
                        "source": "Meta Newsroom",
                        "url": "https://about.fb.com/",
                        "confidence": "high",
                    }
                ],
            },
            persist=True,
        )

        self.assertEqual(result["agent"]["name"], "Axiom Vale")
        self.assertIn("circuito de ingresos funciona", result["voice_script"])
        self.assertIn("Facebook pago casi US$3.000 millones", result["voice_script"])
        self.assertGreaterEqual(len(result["video_plan"]["scenes"]), 3)
        self.assertTrue(Path(result["files"]["json"]).is_file())
        saved = json.loads(Path(result["files"]["json"]).read_text(encoding="utf-8"))
        self.assertEqual(saved["report"]["company"], "Facemoney")

    def test_warns_when_metric_periods_are_different(self):
        result = agent_report_pipeline.generate_agent_report(
            {
                "agent_id": "axiom",
                "company": "Facemoney",
                "objective": "Comparar resultados",
                "metrics": [
                    {"label": "Visualizaciones", "value": "1.920", "period": "14 dias", "source": "a.png"},
                    {"label": "Ingresos", "value": "US$4", "period": "28 dias", "source": "b.png"},
                ],
            },
            persist=False,
        )
        self.assertEqual(result["quality"]["status"], "review_required")
        self.assertIn("no sumarse", result["quality"]["warnings"][0])


if __name__ == "__main__":
    unittest.main()
