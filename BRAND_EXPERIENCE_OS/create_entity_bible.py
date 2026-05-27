import os

# =========================================================
# BRAND EXPERIENCE OS — ENTITY BIBLE STRUCTURE GENERATOR
# =========================================================

ROOT = "BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE"

# =========================================================
# MAIN CATEGORIES
# =========================================================

categories = [

    "philosophy",
    "perception",
    "psychology",
    "emotional_intelligence",
    "aesthetics",
    "cinematic",
    "storytelling",
    "luxury",
    "entity_detection",
    "visual_psychology",
    "premium_positioning",
    "transformation",
    "systems",
    "prompts",
    "frameworks",
    "examples",
    "forbidden_patterns",
    "communication",
    "social_media",
    "visual_direction",
    "narrative_architecture",
    "perception_engineering",
    "archetypes",
    "symbols",
    "atmospheres",
    "rhythm",
    "memory",
    "entity_models",
    "audience_psychology",
    "emotional_triggers"

]

# =========================================================
# CREATE ROOT
# =========================================================

os.makedirs(ROOT, exist_ok=True)

# =========================================================
# CREATE CATEGORY FOLDERS
# =========================================================

for category in categories:

    path = os.path.join(ROOT, category)

    os.makedirs(path, exist_ok=True)

    print(f"✅ Created: {path}")

# =========================================================
# CORE FILES FOR EACH CATEGORY
# =========================================================

base_files = [

    "principles.md",
    "psychology.md",
    "patterns.md",
    "examples.md",
    "rules.md",
    "framework.md"

]

# =========================================================
# CREATE BASE FILES
# =========================================================

for category in categories:

    category_path = os.path.join(ROOT, category)

    for file in base_files:

        file_path = os.path.join(category_path, file)

        if not os.path.exists(file_path):

            with open(file_path, "w", encoding="utf-8") as f:

                title = file.replace(".md", "").replace("_", " ").title()

                f.write(f"# {title}\n")

            print(f"📄 Created: {file_path}")

# =========================================================
# DONE
# =========================================================

print("\n🚀 ENTITY BIBLE STRUCTURE CREATED SUCCESSFULLY")
print(f"📂 Root Path: {ROOT}")