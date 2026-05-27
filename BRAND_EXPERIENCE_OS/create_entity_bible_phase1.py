import os

# =========================================================
# BRAND EXPERIENCE OS
# ENTITY BIBLE — PHASE 1 GENERATOR
# =========================================================

ROOT = "BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE"

# =========================================================
# PHASE 1 CATEGORIES
# =========================================================

structure = {

    "philosophy": [

        "entity_consciousness.md",
        "transmission_over_communication.md",
        "identity_before_design.md",
        "perception_is_reality.md",
        "emotional_presence.md",
        "creative_intelligence.md",
        "brand_entities.md",
        "symbolic_meaning.md"

    ],

    "perception": [

        "perceptual_control.md",
        "perception_before_logic.md",
        "visual_authority.md",
        "perceived_value.md",
        "emotional_perception.md",
        "attention_dynamics.md",
        "perception_layers.md",
        "subconscious_branding.md"

    ],

    "visual_psychology": [

        "negative_space.md",
        "contrast_psychology.md",
        "color_emotion.md",
        "visual_tension.md",
        "hierarchy_and_focus.md",
        "cinematic_composition.md",
        "visual_silence.md",
        "emotional_design.md"

    ],

    "luxury": [

        "luxury_perception.md",
        "premium_minimalism.md",
        "sophisticated_contrast.md",
        "luxury_rhythm.md",
        "presence_over_noise.md",
        "premium_positioning.md",
        "emotional_luxury.md",
        "high_value_perception.md"

    ],

    "entity_detection": [

        "entity_frequency.md",
        "identity_patterns.md",
        "emotional_energy.md",
        "entity_voice.md",
        "visual_archetypes.md",
        "symbolic_identity.md",
        "narrative_essence.md",
        "perception_mapping.md"

    ]

}

# =========================================================
# CREATE FILE FUNCTION
# =========================================================

def create_file(path, title):

    content = f"""# {title}

## Core Principle

[ Define the foundational principle here ]

---

## Philosophy

[ Explain the deeper meaning and interpretation ]

---

## Psychological Impact

[ Explain how humans emotionally perceive this concept ]

---

## Strategic Application

[ Explain how this principle applies to branding and entities ]

---

## Premium Perception

[ Define how this concept affects luxury and perception ]

---

## Visual Translation

[ Explain how this becomes visual language ]

---

## Emotional Transmission

[ Explain what emotional frequency this principle transmits ]

---

## Forbidden Patterns

- superficial execution
- generic aesthetics
- emotional inconsistency
- visual noise

---

## Final Principle

[ Define the final universal law of this concept ]
"""

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# =========================================================
# CREATE STRUCTURE
# =========================================================

for category, files in structure.items():

    category_path = os.path.join(ROOT, category)

    os.makedirs(category_path, exist_ok=True)

    print(f"\n📂 CATEGORY: {category}")

    for file_name in files:

        file_path = os.path.join(category_path, file_name)

        title = file_name.replace(".md", "").replace("_", " ").title()

        create_file(file_path, title)

        print(f"   ✅ Created: {file_name}")

# =========================================================
# MASTER INDEX
# =========================================================

index_path = os.path.join(ROOT, "PHASE_1_INDEX.md")

with open(index_path, "w", encoding="utf-8") as f:

    f.write("# ENTITY BIBLE — PHASE 1 INDEX\n\n")

    for category, files in structure.items():

        f.write(f"## {category.upper()}\n\n")

        for file_name in files:

            f.write(f"- {file_name}\n")

        f.write("\n")

# =========================================================
# DONE
# =========================================================

print("\n🚀 ENTITY BIBLE — PHASE 1 CREATED SUCCESSFULLY")
print(f"📂 Root: {ROOT}")
print(f"📘 Index: {index_path}")