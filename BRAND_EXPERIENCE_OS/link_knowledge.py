import os
from pathlib import Path
from collections import defaultdict

# =========================================================
# BRAND EXPERIENCE OS
# ENTITY BIBLE — KNOWLEDGE LINKER V1
# =========================================================

ROOT = Path("BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE")

# =========================================================
# CONCEPT RELATIONSHIPS
# =========================================================

RELATIONS = {

    "luxury": [
        "visual_psychology",
        "perception",
        "cinematic",
        "premium_positioning"
    ],

    "visual_psychology": [
        "luxury",
        "perception",
        "cinematic",
        "emotional_intelligence"
    ],

    "perception": [
        "luxury",
        "visual_psychology",
        "psychology",
        "entity_detection"
    ],

    "entity_detection": [
        "psychology",
        "storytelling",
        "archetypes",
        "emotional_intelligence"
    ],

    "storytelling": [
        "cinematic",
        "emotional_intelligence",
        "psychology",
        "narrative_architecture"
    ],

    "cinematic": [
        "visual_psychology",
        "atmospheres",
        "rhythm",
        "storytelling"
    ]

}

# =========================================================
# GET ALL FILES
# =========================================================

all_files = defaultdict(list)

for category_path in ROOT.iterdir():

    if category_path.is_dir():

        category = category_path.name

        for file_path in category_path.glob("*.md"):

            all_files[category].append(file_path)

# =========================================================
# BUILD RELATED CONCEPTS
# =========================================================

for category, files in all_files.items():

    print(f"\n📂 CATEGORY: {category}")

    related_categories = RELATIONS.get(category, [])

    related_files = []

    for rel_cat in related_categories:

        related_files.extend(all_files.get(rel_cat, []))

    for file_path in files:

        try:

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            related_section = "\n\n---\n\n# Related Concepts\n\n"

            # =================================================
            # SAME CATEGORY LINKS
            # =================================================

            related_section += "## Internal Knowledge\n\n"

            for sibling in files:

                if sibling != file_path:

                    relative = sibling.relative_to(ROOT)

                    related_section += f"- {relative}\n"

            # =================================================
            # CROSS CATEGORY LINKS
            # =================================================

            related_section += "\n## Cross Knowledge\n\n"

            for rel_file in related_files[:10]:

                relative = rel_file.relative_to(ROOT)

                related_section += f"- {relative}\n"

            # =================================================
            # ENTITY INTELLIGENCE NOTES
            # =================================================

            related_section += """

---

## Knowledge Network Principle

This concept does not exist independently.

Inside the Entity Bible every principle connects to a broader perceptual system involving:

- emotional transmission
- visual psychology
- cinematic perception
- identity systems
- symbolic meaning
- premium positioning

The intelligence of the system emerges through relationships between concepts rather than isolated information.

---

## Cognitive Navigation

Agents connected to this Entity Bible should explore related concepts before generating strategic outputs.

Cross-referencing increases:

- perceptual depth
- emotional coherence
- cinematic consistency
- symbolic alignment
- strategic intelligence

---

## Final Network Principle

The Entity Bible functions as a living cognitive network.

Every concept strengthens and expands the meaning of the others.
"""

            # =================================================
            # APPEND SECTION
            # =================================================

            if "# Related Concepts" not in content:

                updated_content = content + related_section

                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(updated_content)

                print(f"   🔗 Linked: {file_path.name}")

            else:

                print(f"   ⚠ Already linked: {file_path.name}")

        except Exception as e:

            print(f"❌ Error processing {file_path}: {e}")

# =========================================================
# MASTER NETWORK INDEX
# =========================================================

network_index = ROOT / "KNOWLEDGE_NETWORK.md"

with open(network_index, "w", encoding="utf-8") as f:

    f.write("# ENTITY BIBLE — KNOWLEDGE NETWORK\n\n")

    for category, files in all_files.items():

        f.write(f"## {category.upper()}\n\n")

        for file_path in files:

            relative = file_path.relative_to(ROOT)

            f.write(f"- {relative}\n")

        f.write("\n")

# =========================================================
# DONE
# =========================================================

print("\n🚀 KNOWLEDGE LINKING COMPLETE")
print("🧠 ENTITY BIBLE IS NOW A CONNECTED COGNITIVE NETWORK")