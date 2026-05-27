# =========================================================
# BRAND EXPERIENCE OS — ENTITY BIBLE SETUP
# =========================================================
#
# This script creates:
#
# ✅ entity_bible/
# ✅ philosophy.md
# ✅ luxury.md
# ✅ cinematic.md
# ✅ psychology.md
# ✅ storytelling.md
#
# =========================================================

from pathlib import Path

# =========================================================
# ROOT
# =========================================================

ROOT = Path.cwd()

ENTITY_BIBLE = ROOT / "entity_bible"

ENTITY_BIBLE.mkdir(
    parents=True,
    exist_ok=True
)

# =========================================================
# FILES
# =========================================================

files = {

# =========================================================
# PHILOSOPHY
# =========================================================

"philosophy.md": """

# BRAND EXPERIENCE PHILOSOPHY

Brand Experience does not create brands.

It creates entities.

Perception matters more than marketing.

Atmosphere matters more than trends.

Emotional identity matters more than aesthetics.

The objective is not communication.

The objective is transmission.

Luxury is emotional sophistication.

Cinematic branding creates immersion.

The audience should feel before understanding.

""",

# =========================================================
# LUXURY
# =========================================================

"luxury.md": """

# LUXURY PERCEPTION

Luxury is controlled perception.

Luxury is silence.

Luxury communicates through restraint,
atmosphere and emotional sophistication.

Premium entities never scream.

They transmit.

Darkness creates depth.

Negative space creates authority.

Minimalism creates emotional power.

Premium perception emerges from emotional control.

""",

# =========================================================
# CINEMATIC
# =========================================================

"cinematic.md": """

# CINEMATIC LANGUAGE

Cinematic branding is emotional immersion.

Atmosphere matters more than information.

The audience must feel before understanding.

Visual rhythm creates perception.

Cinematic identity systems are built through:

- light
- silence
- tension
- movement
- emotional framing

Visual storytelling should feel atmospheric,
aspirational and emotionally immersive.

""",

# =========================================================
# PSYCHOLOGY
# =========================================================

"psychology.md": """

# EMOTIONAL PSYCHOLOGY

Human beings react emotionally before logically.

Perception shapes emotional response.

Authority is emotional.

Desire is emotional.

Aspiration is emotional.

Premium entities create:

- emotional elevation
- exclusivity
- mystery
- authority
- aspiration

Luxury positioning is psychological architecture.

""",

# =========================================================
# STORYTELLING
# =========================================================

"storytelling.md": """

# STORYTELLING SYSTEM

Stories should feel cinematic.

Narratives should create emotional transformation.

Do not describe products.

Create emotional universes.

Create perception.

Create symbolic meaning.

Every entity should feel larger than itself.

Brand storytelling should create emotional memory.

"""

}

# =========================================================
# CREATE FILES
# =========================================================

for filename, content in files.items():

    filepath = ENTITY_BIBLE / filename

    with open(filepath, "w", encoding="utf-8") as f:

        f.write(content.strip())

    print(f"✅ Created: {filename}")

# =========================================================
# DONE
# =========================================================

print("""

🔥 =========================================
 ENTITY BIBLE CREATED SUCCESSFULLY
=========================================

FILES GENERATED:

✅ philosophy.md
✅ luxury.md
✅ cinematic.md
✅ psychology.md
✅ storytelling.md

=========================================

NEXT STEP:

Connect the Entity Bible to main.py
to create Brand Experience cognition.

=========================================

""")