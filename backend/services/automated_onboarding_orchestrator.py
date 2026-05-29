# Automated Onboarding Orchestrator Service
# Orchestrates classification, identity/prompt pack generation, and Advanced OS Engines.

import sys
import shutil
from pathlib import Path

# Ensure backend path is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.onboarding_classifier_service import classify_intake
from services.prompt_pack_generator_service import generate_prompt_pack_for_client
from services.brand_memory_builder import build_brand_memory_core
from services.visual_dna_builder import build_visual_dna_engine
from services.content_intelligence_builder import build_content_intelligence_engine
from services.ai_agent_os_builder import generate_ai_agent_os
from client_manager import get_client_path, save_client_intake

def onboard_new_client(
    client_name: str,
    category: str = "default",
    intake_data: dict = None
) -> dict:
    """
    Orchestrates the Phase 3 onboarding pipeline:
    1. Classifier
    2. Identity & Prompt Pack generation
    3. Advanced OS Engine Generation (Memory, Visual, Content, AI Agent OS)
    4. Rollback on failure
    """
    if not client_name or not client_name.strip():
        raise ValueError("Client name cannot be empty.")
        
    intake_data = intake_data or {}
    
    # 1. Run Data Completeness Classifier
    classification_report = classify_intake(intake_data)
    classification = classification_report["classification"]
    score = classification_report["intake_quality_score"]
    
    # Ensure client base directory and profile is prepared first
    save_client_intake(client_name, intake_data)
    
    # 2. Run Prompt Pack & Identity Generator (Seed/Full)
    generation_report = generate_prompt_pack_for_client(
        client_name=client_name,
        classification=classification,
        category=category,
        intake_data=intake_data
    )
    
    # 3. Setup folders tracking for rollback
    resolved_path = get_client_path(client_name)
    if not resolved_path:
         raise ValueError(f"Could not resolve client path for '{client_name}'")
         
    client_path = Path(resolved_path)
    
    folders_to_track = [
        "00_SYSTEM",
        "01_IDENTITY",
        "02_MEMORY",
        "04_PROMPTS",
        "06_EXPORTS",
        "07_VISUAL_DNA_ENGINE",
        "08_CONTENT_INTELLIGENCE_ENGINE",
        "09_AI_AGENT_OS"
    ]
    
    # Track pre-existing folders
    pre_existing = {f: (client_path / f).exists() for f in folders_to_track}
    
    engines_status = {
        "brand_memory_core": "PENDING",
        "visual_dna_engine": "PENDING",
        "content_intelligence_engine": "PENDING",
        "ai_agent_os": "PENDING"
    }
    
    created_files_by_engines = {}
    
    # 4. Sequential execution of builders
    try:
        # Step A: Brand Memory Core
        memory_report = build_brand_memory_core(client_name)
        engines_status["brand_memory_core"] = "COMPLETED"
        created_files_by_engines["brand_memory_core"] = memory_report.get("created_files", [])
        
        # Step B: Visual DNA Engine
        visual_report = build_visual_dna_engine(client_name)
        engines_status["visual_dna_engine"] = "COMPLETED"
        created_files_by_engines["visual_dna_engine"] = visual_report.get("created_files", [])
        
        # Step C: Content Intelligence Engine
        content_report = build_content_intelligence_engine(client_name)
        engines_status["content_intelligence_engine"] = "COMPLETED"
        created_files_by_engines["content_intelligence_engine"] = content_report.get("created_files", [])
        
        # Step D: AI Agent OS
        os_report = generate_ai_agent_os(client_name)
        engines_status["ai_agent_os"] = "COMPLETED"
        created_files_by_engines["ai_agent_os"] = os_report.get("created", [])
        
    except Exception as e:
        # Rollback: delete directories created during this build sequence
        for f, existed in pre_existing.items():
            folder_path = client_path / f
            if not existed and folder_path.exists():
                try:
                    shutil.rmtree(folder_path)
                except Exception:
                    pass
                    
        return {
            "client": client_name,
            "category": category,
            "intake_quality_score": score,
            "classification": classification,
            "status": "FAILED",
            "error": str(e),
            "rollback_executed": True,
            "engines_status": engines_status
        }
        
    return {
        "client": client_name,
        "category": category,
        "intake_quality_score": score,
        "classification": classification,
        "status": "COMPLETED",
        "metrics": classification_report["metrics"],
        "prompt_pack": {
            "status": generation_report.get("status"),
            "preset_applied": generation_report.get("preset_applied"),
            "base_folder": generation_report.get("base"),
            "created_files": generation_report.get("created", [])
        },
        "engines": {
            "status": engines_status,
            "created_files": created_files_by_engines
        }
    }
