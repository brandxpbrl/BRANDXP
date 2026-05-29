# Prompt Pack Generator Service
# Dispatches generation based on client intake completeness.

import os
from pathlib import Path
import sys

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from client_manager import build_framework_prompt, generate_client_prompt_pack, get_client_path
from cognitive_orchestrator import process_request
from services.seed_identity_generator import generate_seed_identity

def generate_prompt_pack_for_client(
    client_name: str,
    classification: str,
    category: str = "default",
    intake_data: dict = None
) -> dict:
    """
    Coordinates prompt pack generation based on classification.
    """
    intake_data = intake_data or {}
    
    if classification == "ZERO/SEED DATA":
        # Direct generation of Seed Identity + Prompt Pack
        return generate_seed_identity(
            client_name=client_name,
            category=category,
            notes=intake_data.get("notes", "")
        )
        
    elif classification in ("RICH DATA", "PARTIAL DATA"):
        # For Rich and Partial, check if latest analysis files exist.
        client_dir = get_client_path(client_name)
        if client_dir:
            client_path = Path(client_dir)
            analysis_json = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience" / "LATEST_ANALYSIS.json"
            
            # If analysis does not exist, trigger the multi-agent framework to create it.
            if not analysis_json.is_file():
                prompt = build_framework_prompt(client_name, intake_data)
                process_request(prompt, client_name)
                
        # Generate standard prompt pack files from the analysis outputs.
        result = generate_client_prompt_pack(client_name)
        if not result:
            raise ValueError(f"Failed to generate prompt pack files from latest analysis for client '{client_name}'")
            
        return {
            "client": result.get("client", client_name),
            "category": category,
            "preset_applied": "Multi-Agent Framework Analysis",
            "base": result.get("base"),
            "created": result.get("created", []),
            "status": "FULL IDENTITY & PROMPT PACK ACTIVATED"
        }
        
    else:
        raise ValueError(f"Invalid classification '{classification}' provided.")
