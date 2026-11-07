from services.entity_bible_v2_mcos import create_candidate, validate_candidate_with_mcos


PILOTS = [
    {
        "knowledge_id": "eb-identity-before-design",
        "title": "Identity Before Design",
        "domain": "philosophy",
        "knowledge_type": "principle",
        "source_path": "philosophy/identity_before_design.md",
        "definition": "A visual or verbal decision is valid only when it expresses a previously defined identity commitment. Design cannot compensate for an unresolved promise, audience, position or behavior; it can only make that ambiguity more visible.",
        "when_to_use": ["Before approving identity assets", "When visual directions compete", "When a brand redesign lacks a strategic reason"],
        "diagnostic_method": ["State the identity commitment", "Link each design decision to that commitment", "Reject or revise decisions without a traceable link"],
        "observable_indicators": ["Every major asset cites an identity commitment", "Contradictory visual choices are documented", "Design reviews use identity criteria instead of personal taste"],
        "analysis_questions": ["What identity commitment does this decision express?", "What would change if the commitment were different?", "Is the choice strategic or merely decorative?"],
        "decision_rules": ["Do not approve an asset without an identity rationale", "When two options are equally attractive, select the one with stronger identity traceability"],
        "good_examples": [{"situation": "A premium travel brand removes visual noise because calm authority is part of its identity", "result": "The design choice reinforces a declared positioning"}],
        "bad_examples": [{"situation": "A brand adopts neon gradients only because they are trending", "result": "The identity becomes interchangeable"}],
        "limits_and_counterexamples": ["Exploratory sketches may precede final identity decisions", "Functional accessibility requirements override stylistic preferences"],
        "expected_result": "Identity decisions become explicit constraints that guide design and reduce arbitrary revisions.",
        "relationships": [{"target_id": "eb-perception-before-logic", "relation": "supports", "justification": "Identity commitments need perceptual translation to become visible before explanation."}],
        "recommended_agents": ["nicolas", "nova"],
    },
    {
        "knowledge_id": "eb-color-emotion",
        "title": "Color as Emotional Expectation",
        "domain": "visual_psychology",
        "knowledge_type": "method",
        "source_path": "visual_psychology/color_emotion.md",
        "definition": "Color establishes an emotional expectation before the audience evaluates content. Its effect depends on context, proportion, contrast, culture and repetition; no isolated color carries one universal emotion.",
        "when_to_use": ["Building a visual system", "Diagnosing inconsistent campaign assets", "Directing cinematic atmosphere"],
        "diagnostic_method": ["Name the intended emotional expectation", "Map dominant, supporting and accent colors", "Test the palette in the real channel and cultural context"],
        "observable_indicators": ["Dominant color matches the intended emotional posture", "Accent color directs attention consistently", "Contrast remains legible across channels"],
        "analysis_questions": ["What should the audience feel before reading?", "Which color controls attention?", "Does the palette preserve meaning in the target culture and medium?"],
        "decision_rules": ["Evaluate color as a system, never as an isolated swatch", "Reject palettes whose emotional effect contradicts the declared positioning"],
        "good_examples": [{"situation": "A financial report uses restrained dark neutrals with one controlled signal color", "result": "The hierarchy feels precise and risk-aware"}],
        "bad_examples": [{"situation": "Every campaign uses a different saturated palette", "result": "Recognition and emotional continuity collapse"}],
        "limits_and_counterexamples": ["Color associations vary by culture", "Accessibility and contrast requirements take precedence", "Photography can shift perceived palette"],
        "expected_result": "Color choices create a consistent, testable emotional expectation across touchpoints.",
        "relationships": [{"target_id": "eb-visual-authority", "relation": "supports", "justification": "Controlled color hierarchy contributes to perceived coherence and authority."}],
        "recommended_agents": ["nova"],
    },
    {
        "knowledge_id": "eb-operational-coherence",
        "title": "Operational Coherence",
        "domain": "systems",
        "knowledge_type": "rule",
        "source_path": "systems/rules.md",
        "definition": "A strategy is operationally coherent when every promised outcome has an owner, an ordered sequence, authorized tools, evidence of completion and a defined escalation path. Activity without these links is motion, not execution.",
        "when_to_use": ["Converting strategy into tasks", "Auditing stalled projects", "Delegating across agents"],
        "diagnostic_method": ["Map outcomes to owners", "Verify dependencies and permissions", "Define evidence and escalation for every critical task"],
        "observable_indicators": ["Every task has one accountable owner", "Dependencies are explicit", "Completion requires evidence", "Sensitive actions have an approval gate"],
        "analysis_questions": ["Who owns the result?", "What must happen first?", "What proves completion?", "Which decision requires human approval?"],
        "decision_rules": ["Do not activate tasks with unresolved dependencies", "Do not mark sensitive work complete without the required approval", "Do not delegate to an unvalidated agent"],
        "good_examples": [{"situation": "A campaign moves from financial review to strategy to operations with evidence at each handoff", "result": "The team can locate responsibility and blockage immediately"}],
        "bad_examples": [{"situation": "Several agents receive the same vague instruction without ownership", "result": "Work is duplicated and no one can verify completion"}],
        "limits_and_counterexamples": ["Creative exploration may begin with looser ownership", "Emergency handling may compress sequence but must preserve retrospective evidence"],
        "expected_result": "Plans become observable execution systems with clear ownership, proof and safe escalation.",
        "relationships": [{"target_id": "eb-memory-rules", "relation": "depends_on", "justification": "Operational coherence requires persistent evidence and decisions across handoffs."}],
        "recommended_agents": ["lyra", "nicolas", "themis"],
    },
]


def run_pilots(persist=True):
    results = []
    for payload in PILOTS:
        candidate = create_candidate(payload, persist=persist)
        validation = validate_candidate_with_mcos(candidate, persist=persist)
        results.append({"candidate": candidate, "validation": validation})
    return results
