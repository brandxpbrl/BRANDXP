# Onboarding Ingestion Classifier Service
# Grades client intake data and categorizes completeness.

def classify_intake(intake_data: dict) -> dict:
    """
    Evaluates intake data and returns a classification (RICH, PARTIAL, SEED) and quality score.
    """
    intake_data = intake_data or {}
    
    instagram = intake_data.get("instagram", "")
    links = intake_data.get("links", [])
    transcription = intake_data.get("transcription", "") or ""
    notes = intake_data.get("notes", "") or ""
    
    # 1. Instagram score (20 pts)
    insta_score = 0
    if instagram and str(instagram).strip():
        insta_score = 20
        
    # 2. Links/website score (20 pts)
    links_score = 0
    if isinstance(links, list):
        valid_links = [l for l in links if l and str(l).strip()]
        if valid_links:
            links_score = 20
    elif isinstance(links, str) and links.strip():
        links_score = 20
        
    # 3. Transcription score (35 pts max)
    trans_len = len(transcription.strip())
    trans_score = 0
    if trans_len > 500:
        trans_score = 35
    elif trans_len > 200:
        trans_score = 25
    elif trans_len > 50:
        trans_score = 15
    elif trans_len > 0:
        trans_score = 5
        
    # 4. Notes score (25 pts max)
    notes_len = len(notes.strip())
    notes_score = 0
    if notes_len > 300:
        notes_score = 25
    elif notes_len > 150:
        notes_score = 20
    elif notes_len > 50:
        notes_score = 15
    elif notes_len > 0:
        notes_score = 5
        
    total_score = min(100, insta_score + links_score + trans_score + notes_score)
    
    if total_score >= 70:
        classification = "RICH DATA"
    elif total_score >= 35:
        classification = "PARTIAL DATA"
    else:
        classification = "ZERO/SEED DATA"
        
    return {
        "intake_quality_score": total_score,
        "classification": classification,
        "metrics": {
            "instagram_present": insta_score > 0,
            "links_present": links_score > 0,
            "transcription_length": trans_len,
            "notes_length": notes_len
        }
    }
