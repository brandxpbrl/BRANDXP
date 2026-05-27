import os
from pathlib import Path

# =========================================================
# BRAND EXPERIENCE OS
# ENTITY BIBLE — KNOWLEDGE INJECTOR V1
# =========================================================

ROOT = Path("BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE")

# =========================================================
# CATEGORY INTELLIGENCE MODELS
# =========================================================

CATEGORY_MODELS = {

    "philosophy": {
        "tone": "deep philosophical",
        "focus": [
            "identity",
            "existence",
            "transmission",
            "meaning",
            "perception"
        ]
    },

    "perception": {
        "tone": "psychological strategic",
        "focus": [
            "human perception",
            "attention",
            "subconscious interpretation",
            "value perception",
            "presence"
        ]
    },

    "visual_psychology": {
        "tone": "visual emotional",
        "focus": [
            "composition",
            "contrast",
            "space",
            "lighting",
            "emotion"
        ]
    },

    "luxury": {
        "tone": "premium sophisticated",
        "focus": [
            "control",
            "silence",
            "elegance",
            "minimalism",
            "high-value perception"
        ]
    },

    "entity_detection": {
        "tone": "symbolic emotional",
        "focus": [
            "identity",
            "energy",
            "frequency",
            "archetypes",
            "entity essence"
        ]
    }

}

# =========================================================
# SECTION GENERATOR
# =========================================================

def generate_sections(topic, category):

    model = CATEGORY_MODELS.get(category, {})

    focus = model.get("focus", [])

    return f"""
# {topic.replace('_', ' ').replace('.md', '').title()}

## Core Principle

This concept exists as a foundational perceptual law inside the Brand Experience Entity System.

It directly affects how entities are emotionally interpreted, visually perceived and psychologically experienced.

---

## Philosophical Foundation

Every entity transmits emotional meaning before logical understanding.

The principles behind {topic.replace('_', ' ')} define how perception becomes emotional reality.

Brand Experience interprets this concept not as decoration, but as perceptual transmission.

---

## Psychological Interpretation

Human beings emotionally react before rationally analyzing.

Because of this:

- aesthetics shape emotional expectation
- perception defines value
- atmosphere influences trust
- visual coherence generates authority

The concept of {topic.replace('_', ' ')} affects subconscious interpretation through emotional perception systems.

---

## Strategic Importance

This principle directly impacts:

"""

# =========================================================
# EXPAND STRATEGIC POINTS
# =========================================================

def strategic_points(focus):

    text = ""

    for item in focus:

        text += f"- {item}\n"

    return text

# =========================================================
# CONTINUE DOCUMENT
# =========================================================

def continue_document(topic):

    return f"""

---

## Emotional Transmission

Entities capable of transmitting emotional coherence create stronger psychological presence.

This concept amplifies:

- authority
- sophistication
- emotional resonance
- cinematic perception
- premium positioning

---

## Premium Perception

High-value entities apply this principle with intentional control.

Luxury perception is never accidental.

It emerges through:
- coherence
- restraint
- emotional precision
- visual rhythm
- symbolic consistency

---

## Visual Translation

This principle should manifest visually through:

- composition
- spacing
- hierarchy
- lighting
- pacing
- contrast
- cinematic framing

---

## Narrative Translation

Narratively, this principle should create:

- emotional depth
- atmospheric storytelling
- symbolic meaning
- identity reinforcement
- transformational perception

---

## Common Mistakes

The following patterns destroy perceptual coherence:

- generic aesthetics
- emotional inconsistency
- trend dependency
- visual noise
- lack of symbolic direction
- superficial execution

---

## Entity Application

Every entity expresses this principle differently depending on:

- emotional frequency
- positioning
- archetype
- visual language
- narrative identity

---

## Cinematic Interpretation

Cinematic perception emerges when visual and emotional rhythm become synchronized.

This principle must feel:

- intentional
- atmospheric
- emotionally controlled
- visually immersive

---

## Final Principle

Brand Experience treats {topic.replace('_', ' ')} as a perceptual architecture system rather than a superficial branding technique.

Its true function is to transmit emotional identity through structured perception.
"""

# =========================================================
# INJECT KNOWLEDGE
# =========================================================

created = 0

for category_path in ROOT.iterdir():

    if category_path.is_dir():

        category = category_path.name

        print(f"\n📂 CATEGORY: {category}")

        for file_path in category_path.glob("*.md"):

            topic = file_path.name

            model = CATEGORY_MODELS.get(category, {})

            focus = model.get("focus", [])

            content = generate_sections(topic, category)

            content += strategic_points(focus)

            content += continue_document(topic)

            with open(file_path, "w", encoding="utf-8") as f:

                f.write(content.strip())

            created += 1

            print(f"   ✅ Injected: {topic}")

# =========================================================
# DONE
# =========================================================

print("\n🚀 KNOWLEDGE INJECTION COMPLETE")
print(f"📚 Files Processed: {created}")
print("🧠 ENTITY BIBLE EXPANDED SUCCESSFULLY")