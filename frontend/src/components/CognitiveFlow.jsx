export default function CognitiveFlow({

  loading

}) {

  return (

    <div
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "30px",
        color: "white"
      }}
    >

      <div
        style={{
          fontSize: "12px",
          letterSpacing: "4px",
          color: "#67e8f9",
          marginBottom: "20px"
        }}
      >

        COGNITIVE FLOW

      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        <div>

          {loading
            ? "🧠 Retrieving semantic memory..."
            : "✓ Semantic memory ready"
          }

        </div>

        <div>

          {loading
            ? "⚡ Activating cognitive agents..."
            : "✓ Agents synchronized"
          }

        </div>

        <div>

          {loading
            ? "🎬 Synthesizing cinematic perception..."
            : "✓ Cinematic synthesis ready"
          }

        </div>

      </div>

    </div>

  )

}