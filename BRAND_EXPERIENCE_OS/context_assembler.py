import chromadb
from sentence_transformers import SentenceTransformer

# =========================================================
# BRAND EXPERIENCE OS
# CONTEXT ASSEMBLER
# =========================================================

CHROMA_DB_PATH = "memory_db"

TOP_RESULTS = 8

# =========================================================
# LOAD MODEL
# =========================================================

print("🧠 Loading semantic intelligence...")

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# =========================================================
# LOAD MEMORY
# =========================================================

client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

collection = client.get_collection(
    name="entity_bible_memory"
)

# =========================================================
# ASSEMBLER FUNCTION
# =========================================================

def assemble_context(query):

    print("\n🔍 Searching semantic memory...\n")

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(

        query_embeddings=[query_embedding],
        n_results=TOP_RESULTS

    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context = "\n"
    context += "=" * 60
    context += "\nCOGNITIVE CONTEXT PACKAGE\n"
    context += "=" * 60
    context += "\n"

    used_sources = set()

    for i, doc in enumerate(documents):

        metadata = metadatas[i]

        source = metadata["source"]
        category = metadata["category"]

        used_sources.add(source)

        context += f"\n📄 SOURCE: {source}\n"
        context += f"📂 CATEGORY: {category}\n"

        context += "\n"
        context += "-" * 40
        context += "\n"

        context += doc[:1500]

        context += "\n\n"

    context += "=" * 60
    context += "\nCONNECTED KNOWLEDGE SOURCES\n"
    context += "=" * 60
    context += "\n"

    for source in used_sources:

        context += f"- {source}\n"

    return context

# =========================================================
# MAIN LOOP
# =========================================================

print("\n🚀 BRAND EXPERIENCE CONTEXT ASSEMBLER")
print("Type 'exit' to quit.\n")

while True:

    query = input("🧠 Cognitive Query: ")

    if query.lower() == "exit":
        break

    assembled = assemble_context(query)

    print("\n")
    print(assembled)
    print("\n")

print("\n👋 Context session ended.")