# =========================================================
# BRAND EXPERIENCE OS — UI AUTO BUILDER
# =========================================================
#
# This script creates:
#
# ✅ App.jsx
# ✅ Sidebar.jsx
# ✅ CognitiveInput.jsx
# ✅ CognitiveFlow.jsx
# ✅ HeroCore.jsx
# ✅ RetrievedConcepts.jsx
# ✅ SystemOutput.jsx
# ✅ SystemStatus.jsx
#
# =========================================================

from pathlib import Path

# =========================================================
# ROOT
# =========================================================

ROOT = Path.cwd()

SRC = ROOT / "frontend" / "src"

COMPONENTS = SRC / "components"

COMPONENTS.mkdir(
    parents=True,
    exist_ok=True
)

# =========================================================
# FILES
# =========================================================

files = {

# =========================================================
# APP
# =========================================================

"App.jsx": r'''
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import CognitiveInput from "./components/CognitiveInput";
import CognitiveFlow from "./components/CognitiveFlow";
import RetrievedConcepts from "./components/RetrievedConcepts";
import SystemOutput from "./components/SystemOutput";
import SystemStatus from "./components/SystemStatus";
import HeroCore from "./components/HeroCore";

export default function App() {

  const [response, setResponse] = useState("");

  const [retrievedConcepts, setRetrievedConcepts] = useState([]);

  const [loading, setLoading] = useState(false);

  const executeFlow = async (prompt) => {

    if (!prompt.trim()) return;

    setLoading(true);

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/orchestrator",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            prompt: prompt

          })

        }

      );

      const data = await response.json();

      setResponse(

        data.response || ""

      );

      setRetrievedConcepts(

        data.retrieved_concepts || []

      );

    } catch (error) {

      console.error(error);

      setResponse(

        "Connection error with Brand Experience OS backend."

      );

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,0,200,0.12),transparent_25%)]" />

      <div className="relative z-10 flex">

        <Sidebar />

        <main className="flex-1 p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h1 className="text-5xl font-black tracking-tight">
                COGNITIVE COMMAND CENTER
              </h1>

              <p className="text-white/40 mt-2">
                The Operating System for Brand Creation
              </p>

            </div>

          </div>

          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-7 flex flex-col gap-6">

              <CognitiveInput
                executeFlow={executeFlow}
                loading={loading}
              />

              <HeroCore />

            </div>

            <div className="col-span-5 flex flex-col gap-6">

              <CognitiveFlow />

              <RetrievedConcepts
                concepts={retrievedConcepts}
              />

              <SystemOutput
                response={response}
              />

            </div>

          </div>

        </main>

      </div>

      <SystemStatus />

    </div>

  );

}
''',

# =========================================================
# SIDEBAR
# =========================================================

"components/Sidebar.jsx": r'''
import { Sparkles } from "lucide-react";

export default function Sidebar() {

  return (

    <aside className="w-[280px] min-h-screen border-r border-white/10 bg-black/30 backdrop-blur-2xl p-6">

      <div className="flex items-center gap-4 mb-10">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center">

          <Sparkles size={24} />

        </div>

        <div>

          <h2 className="font-bold">
            BRAND EXPERIENCE OS
          </h2>

          <p className="text-xs text-white/40">
            Cognitive Brand Engine
          </p>

        </div>

      </div>

    </aside>

  );

}
''',

# =========================================================
# INPUT
# =========================================================

"components/CognitiveInput.jsx": r'''
import { useState } from "react";

export default function CognitiveInput({

  executeFlow,
  loading

}) {

  const [prompt, setPrompt] = useState("");

  return (

    <div className="rounded-[36px] border border-white/10 bg-black/30 backdrop-blur-2xl p-8">

      <textarea

        value={prompt}

        onChange={(e) => setPrompt(e.target.value)}

        placeholder="Create a cinematic luxury identity system..."

        className="w-full h-[220px] bg-black/30 rounded-[24px] p-6 outline-none resize-none"

      />

      <button

        onClick={() => executeFlow(prompt)}

        className="mt-6 px-6 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-300"

      >

        {loading ? "Thinking..." : "Execute"}

      </button>

    </div>

  );

}
''',

# =========================================================
# FLOW
# =========================================================

"components/CognitiveFlow.jsx": r'''
export default function CognitiveFlow() {

  return (

    <div className="rounded-[36px] border border-white/10 bg-black/30 p-7">

      <h2 className="text-2xl font-bold mb-6">
        Cognitive Flow
      </h2>

      <div className="space-y-4">

        <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-5">
          Semantic Retrieval Active
        </div>

        <div className="rounded-2xl bg-pink-500/10 border border-pink-500/20 p-5">
          Multi-Agent Thinking
        </div>

      </div>

    </div>

  );

}
''',

# =========================================================
# HERO
# =========================================================

"components/HeroCore.jsx": r'''
export default function HeroCore() {

  return (

    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-black/30 h-[520px]">

      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,255,0.15),transparent_35%)]" />

      <div className="absolute top-1/2 left-1/2 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 -translate-x-1/2 -translate-y-1/2 blur-[20px]" />

      <div className="absolute bottom-10 left-10">

        <h2 className="text-5xl font-black leading-none">

          Transmit
          <br />
          Beyond Words

        </h2>

      </div>

    </div>

  );

}
''',

# =========================================================
# CONCEPTS
# =========================================================

"components/RetrievedConcepts.jsx": r'''
export default function RetrievedConcepts({

  concepts = []

}) {

  return (

    <div className="rounded-[36px] border border-white/10 bg-black/30 p-7">

      <h2 className="text-2xl font-bold mb-6">
        Retrieved Concepts
      </h2>

      <div className="space-y-3">

        {concepts.map((concept, index) => (

          <div

            key={index}

            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"

          >

            {concept}

          </div>

        ))}

      </div>

    </div>

  );

}
''',

# =========================================================
# OUTPUT
# =========================================================

"components/SystemOutput.jsx": r'''
export default function SystemOutput({

  response

}) {

  return (

    <div className="rounded-[36px] border border-white/10 bg-black/30 p-7">

      <h2 className="text-2xl font-bold mb-6">
        Generated Intelligence
      </h2>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 whitespace-pre-line text-white/70">

        {response}

      </div>

    </div>

  );

}
''',

# =========================================================
# STATUS
# =========================================================

"components/SystemStatus.jsx": r'''
export default function SystemStatus() {

  return (

    <div className="fixed bottom-6 right-6">

      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl px-6 py-4">

        <div className="text-sm text-cyan-300">

          ● Systems Operational

        </div>

      </div>

    </div>

  );

}
'''

}

# =========================================================
# CREATE FILES
# =========================================================

for filepath, content in files.items():

    fullpath = SRC / filepath

    fullpath.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(fullpath, "w", encoding="utf-8") as f:

        f.write(content.strip())

    print(f"✅ Created: {filepath}")

# =========================================================
# DONE
# =========================================================

print("""

🔥 =========================================
 BRAND EXPERIENCE OS UI CREATED
=========================================

FILES GENERATED:

✅ App.jsx
✅ Sidebar.jsx
✅ CognitiveInput.jsx
✅ CognitiveFlow.jsx
✅ HeroCore.jsx
✅ RetrievedConcepts.jsx
✅ SystemOutput.jsx
✅ SystemStatus.jsx

=========================================

NEXT:

1. npm install lucide-react
2. npm run dev

=========================================
""")