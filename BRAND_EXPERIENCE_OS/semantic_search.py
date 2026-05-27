import chromadb
from sentence_transformers import SentenceTransformer

# =========================================================
# BRAND EXPERIENCE OS
# SEMANTIC SEARCH ENGINE
# =========================================================

CHROMA_DB_PATH = "memory_db"

# =========================================================
# LOAD MODEL
# =========================================================

print("🧠 Loading embedding model...")

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# =========================================================
# LOAD CHROMA
# =========================================================

print("💾 Connecting to semantic memory...")

client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

collection = client.get_collection(
    name="entity_bible_memory"
)

# =========================================================
# SEARCH LOOP
# =========================================================

print("\n🚀 BRAND EXPERIENCE SEMANTIC SEARCH")
print("Type 'exit' to quit.\n")

while True:

    query = input("🔍 Search: ")

    if query.lower() == "exit":
        break

    print("\n🧠 Thinking semantically...\n")

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(

        query_embeddings=[query_embedding],
        n_results=5

    )

    print("=" * 60)
    print("TOP SEMANTIC RESULTS")
    print("=" * 60)

    for i, doc in enumerate(results["documents"][0]):

        metadata = results["metadatas"][0][i]

        source = metadata["source"]
        category = metadata["category"]

        print(f"\n📄 SOURCE: {source}")
        print(f"📂 CATEGORY: {category}")

        print("\n----------------------------------------\n")

        print(doc[:1200])

        print("\n" + "=" * 60)

print("\n👋 Semantic session ended.")