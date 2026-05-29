import json
import sys
import tempfile
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services import brand_memory_builder
from services import visual_dna_builder
from services import content_intelligence_builder


class AdvancedOsBuildersTests(unittest.TestCase):
    def setUp(self):
        self._temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self._temp_dir.name)
        self.clients_root = self.root / "CLIENTES_ACTIVOS"
        self.clients_root.mkdir(parents=True, exist_ok=True)

        # Mock CLIENTS_ROOT for all services
        self._original_memory_root = brand_memory_builder.CLIENTS_ROOT
        self._original_visual_root = visual_dna_builder.CLIENTS_ROOT
        self._original_content_root = content_intelligence_builder.CLIENTS_ROOT

        brand_memory_builder.CLIENTS_ROOT = self.clients_root
        visual_dna_builder.CLIENTS_ROOT = self.clients_root
        content_intelligence_builder.CLIENTS_ROOT = self.clients_root

    def tearDown(self):
        brand_memory_builder.CLIENTS_ROOT = self._original_memory_root
        visual_dna_builder.CLIENTS_ROOT = self._original_visual_root
        content_intelligence_builder.CLIENTS_ROOT = self._original_content_root
        self._temp_dir.cleanup()

    def _write(self, relative_path, content="x"):
        path = self.clients_root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_full_pipeline_generation(self):
        client_name = "testclient"
        client_slug = "testclient"
        client_path = self.clients_root / client_slug
        client_path.mkdir(parents=True, exist_ok=True)

        # 1. Prepare minimal expected intake files for Memory Core
        # Need identity_cliente.md with required sections and Name field
        identity_content = """
- Nombre: Test Client Name

## Lectura de entidad
Lectura content

## Nucleo de marca
Nucleo content

## Publico ideal
Publico content

## Objetivo creativo
Objetivo content

## Direccion visual
Direccion content

## Logo System Direction
Logo system content

## Storytelling
Storytelling content

## Tono de voz
Tono content

## Contenido
Contenido content
"""
        self._write(f"{client_slug}/identity_cliente.md", identity_content)
        self._write(f"{client_slug}/visual_generation_mode.md", "visual mode content")
        self._write(f"{client_slug}/logo_system_prompt.md", "logo prompt")
        self._write(f"{client_slug}/color_palette_prompt.md", "palette prompt")
        self._write(f"{client_slug}/tone_of_brand_prompt.md", "tone prompt")
        self._write(f"{client_slug}/storytelling_board_prompt.md", "storytelling prompt")
        self._write(f"{client_slug}/visual_universe_board_prompt.md", "visual universe prompt")
        self._write(f"{client_slug}/brand_identity_board_prompt.md", "brand board prompt")
        self._write(f"{client_slug}/full_brand_experience_prompt_pack.md", "prompt pack")

        # --- Test Brand Memory Core builder ---
        result_mem = brand_memory_builder.build_brand_memory_core(client_name)
        self.assertEqual(result_mem["client"], client_name)
        self.assertEqual(result_mem["brand_name"], "Test Client Name")
        
        # Verify directories and key master memory files were created
        self.assertTrue((client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md").is_file())
        self.assertTrue((client_path / "02_MEMORY" / "brand_memory_core.json").is_file())
        self.assertTrue((client_path / "02_MEMORY" / "modules" / "01_ENTITY_CORE.md").is_file())
        self.assertTrue((client_path / "06_EXPORTS" / "chatgpt" / "chatgpt_instructions.md").is_file())

        # --- Test Visual DNA builder ---
        result_vis = visual_dna_builder.build_visual_dna_engine(client_name)
        self.assertEqual(result_vis["client"], client_name)
        self.assertTrue((client_path / "07_VISUAL_DNA_ENGINE" / "VISUAL_DNA_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "07_VISUAL_DNA_ENGINE" / "visual_dna_engine.json").is_file())
        self.assertTrue((client_path / "07_VISUAL_DNA_ENGINE" / "modules" / "01_GEOMETRY_SYSTEM.md").is_file())

        # --- Test Content Intelligence builder ---
        result_content = content_intelligence_builder.build_content_intelligence_engine(client_name)
        self.assertEqual(result_content["client"], client_name)
        self.assertTrue((client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "CONTENT_INTELLIGENCE_ENGINE_MASTER.md").is_file())
        self.assertTrue((client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "content_intelligence_engine.json").is_file())
        self.assertTrue((client_path / "08_CONTENT_INTELLIGENCE_ENGINE" / "modules" / "01_CONTENT_STRATEGY.md").is_file())

    def test_builders_raise_on_missing_dependencies(self):
        client_name = "testclient"
        client_slug = "testclient"
        client_path = self.clients_root / client_slug
        client_path.mkdir(parents=True, exist_ok=True)

        # Content Intelligence Builder raises if Visual DNA is missing
        self._write(f"{client_slug}/identity_cliente.md", "# identity")
        self._write(f"{client_slug}/02_MEMORY/BRAND_MEMORY_CORE_MASTER.md", "# master")
        self._write(f"{client_slug}/02_MEMORY/brand_memory_core.json", '{"brand_name": "Test"}')

        with self.assertRaises(ValueError):
            content_intelligence_builder.build_content_intelligence_engine(client_name)

        # Visual DNA Builder raises if Memory Core is missing
        with self.assertRaises(ValueError):
            visual_dna_builder.build_visual_dna_engine(client_name)


if __name__ == "__main__":
    unittest.main()
