import os
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

# =========================================================
# BRAND EXPERIENCE OS
# SEMANTIC MEMORY ENGINE V1
# =========================================================

ENTITY_BIBLE_PATH = Path(
    "BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE"
)

CHROMA_DB_PATH = "memory_db"

# =========================================================
# LOAD EMBEDDING MODEL
# =========================================================

print("🧠 Loading embedding model...")

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# =========================================================
# INIT CHROMA
# =========================================================

print("💾 Initializing semantic memory...")

client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

collection = client.get_or_create_collection(
    name="entity_bible_memory"
)

# =========================================================
# CHUNKING FUNCTION
# =========================================================

def chunk_text(text, chunk_size=1200):

    chunks = []

    for i in range(0, len(text), chunk_size):

        chunks.append(
            text[i:i + chunk_size]
        )

    return chunks

# =========================================================
# PROCESS FILES
# =========================================================

documents = []
metadatas = []
ids = []

counter = 0

print("\n📚 Processing Entity Bible...\n")

for root, dirs, files in os.walk(ENTITY_BIBLE_PATH):

    for file in files:

        if file.endswith(".md"):

            path = Path(root) / file

            relative_path = str(
                path.relative_to(
                    ENTITY_BIBLE_PATH
                )
            )

            category = relative_path.split("/")[0]

            try:

                with open(
                    path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read()

                chunks = chunk_text(content)

                for index, chunk in enumerate(chunks):

                    documents.append(chunk)

                    metadatas.append({

                        "source": relative_path,
                        "category": category,
                        "chunk": index

                    })

                    ids.append(
                        f"{relative_path}_{index}"
                    )

                    counter += 1

                print(
                    f"✅ Indexed: {relative_path}"
                )

            except Exception as e:

                print(
                    f"❌ Error processing {path}: {e}"
                )

# =========================================================
# GENERATE EMBEDDINGS
# =========================================================

print("\n⚡ Generating embeddings...\n")

embeddings = model.encode(
    documents,
    show_progress_bar=True
).tolist()

# =========================================================
# STORE IN CHROMA
# =========================================================

print("\n💾 Storing semantic memory...\n")

collection.add(

    embeddings=embeddings,
    documents=documents,
    metadatas=metadatas,
    ids=ids

)

# =========================================================
# COMPLETE
# =========================================================

print("\n🚀 SEMANTIC MEMORY CREATED")
print(f"🧠 Total Chunks Indexed: {counter}")
print(f"📂 Memory DB: {CHROMA_DB_PATH}")

# =========================================================
# TEST SEARCH
# =========================================================

print("\n🔍 Running semantic test search...\n")

query = "premium emotional perception"

query_embedding = model.encode(
    query
).tolist()

results = collection.query(

    query_embeddings=[query_embedding],
    n_results=5

)

print("\n============================")
print("TOP SEMANTIC RESULTS")
print("============================\n")

for i, doc in enumerate(results["documents"][0]):

    metadata = results["metadatas"][0][i]

    print(f"📄 SOURCE: {metadata['source']}")
    print(f"📂 CATEGORY: {metadata['category']}")
    print(f"\n{doc[:500]}")
    print("\n----------------------------\n")