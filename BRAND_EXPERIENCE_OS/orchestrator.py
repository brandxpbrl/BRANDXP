import chromadb
from sentence_transformers import SentenceTransformer

# =========================================================
# BRAND EXPERIENCE OS
# ORCHESTRATOR V1
# =========================================================

CHROMA_DB_PATH = "memory_db"

TOP_RESULTS = 6

# =========================================================
# AGENT MAP
# =========================================================

AGENT_KEYWORDS = {

    "branding_agent": [
        "branding",
        "identity",
        "visual",
        "brand",
        "positioning"
    ],

    "cinematic_director_agent": [
        "cinematic",
        "atmosphere",
        "film",
        "visual storytelling",
        "scene"
    ],

    "psychology_agent": [
        "emotion",
        "psychology",
        "human behavior",
        "desire",
        "connection"
    ],

    "content_agent": [
        "content",
        "caption",
        "post",
        "reel",
        "storytelling"
    ],

    "strategy_agent": [
        "strategy",
        "positioning",
        "growth",
        "expansion",
        "market"
    ]

}

# =========================================================
# LOAD MODEL
# =========================================================

print("🧠 Loading Brand Experience Intelligence...")

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
# AGENT DETECTION
# =========================================================

def detect_agents(query):

    detected = []

    query_lower = query.lower()

    for agent, keywords in AGENT_KEYWORDS.items():

        for keyword in keywords:

            if keyword in query_lower:

                detected.append(agent)

                break

    return list(set(detected))

# =========================================================
# RETRIEVE CONTEXT
# =========================================================

def retrieve_context(query):

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(

        query_embeddings=[query_embedding],
        n_results=TOP_RESULTS

    )

    return results

# =========================================================
# BUILD CONTEXT PACKAGE
# =========================================================

def build_context(results):

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context = ""

    for i, doc in enumerate(documents):

        metadata = metadatas[i]

        source = metadata["source"]

        context += f"\n\nSOURCE: {source}\n"
        context += "-" * 40
        context += "\n"

        context += doc[:1200]

    return context

# =========================================================
# MAIN LOOP
# =========================================================

print("\n🚀 BRAND EXPERIENCE ORCHESTRATOR V1")
print("Type 'exit' to quit.\n")

while True:

    query = input("🧠 Request: ")

    if query.lower() == "exit":
        break

    print("\n🔍 Detecting agents...\n")

    agents = detect_agents(query)

    print("ACTIVE AGENTS:\n")

    for agent in agents:

        print(f"✅ {agent}")

    print("\n🧠 Retrieving semantic knowledge...\n")

    results = retrieve_context(query)

    context = build_context(results)

    print("=" * 60)
    print("MASTER CONTEXT PACKAGE")
    print("=" * 60)

    print(context)

    print("\n" + "=" * 60)
    print("ORCHESTRATION COMPLETE")
    print("=" * 60 + "\n")

print("\n👋 Orchestrator session ended.")