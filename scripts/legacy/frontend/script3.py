# =========================================================
# BRAND EXPERIENCE OS — AUTO PATCH SYSTEM
# =========================================================
#
# ESTE SCRIPT:
#
# ✅ actualiza App.jsx
# ✅ agrega ClientSidebar
# ✅ conecta client system
# ✅ actualiza main.py
# ✅ conecta orchestrator
#
# =========================================================

from pathlib import Path

# =========================================================
# PATHS
# =========================================================

ROOT = Path.cwd()

FRONTEND = ROOT / "frontend"
BACKEND = ROOT / "backend"

APP_JSX = FRONTEND / "src" / "App.jsx"

COMPONENTS = FRONTEND / "src" / "components"

MAIN_PY = BACKEND / "main.py"

# =========================================================
# CREATE COMPONENTS FOLDER
# =========================================================

COMPONENTS.mkdir(
    parents=True,
    exist_ok=True
)

# =========================================================
# CLIENT SIDEBAR COMPONENT
# =========================================================

sidebar_content = r'''
export default function ClientSidebar({

  selectedClient,
  setSelectedClient

}) {

  const clients = [

    "miranda_experience",
    "fela_tours",
    "isa_tours"

  ]

  return (

    <div
      style={{

        background:
          "rgba(255,255,255,0.03)",

        border:
          "1px solid rgba(255,255,255,0.08)",

        borderRadius: "24px",

        padding: "24px",

        height: "100%"

      }}
    >

      <div
        style={{

          color: "#67e8f9",

          fontSize: "12px",

          letterSpacing: "4px",

          marginBottom: "24px"

        }}
      >

        CLIENT SYSTEM

      </div>

      <div
        style={{

          display: "flex",

          flexDirection: "column",

          gap: "12px"

        }}
      >

        {clients.map((client) => (

          <button

            key={client}

            onClick={() =>
              setSelectedClient(client)
            }

            style={{

              background:

                selectedClient === client

                  ? "linear-gradient(90deg,#06b6d4,#8b5cf6)"

                  : "rgba(255,255,255,0.04)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "16px",

              padding: "16px",

              color: "white",

              cursor: "pointer",

              textAlign: "left",

              transition: "0.3s"

            }}

          >

            {client}

          </button>

        ))}

      </div>

    </div>

  )

}
'''

sidebar_file = COMPONENTS / "ClientSidebar.jsx"

sidebar_file.write_text(
    sidebar_content,
    encoding="utf-8"
)

print("✅ ClientSidebar.jsx creado")

# =========================================================
# PATCH APP.JSX
# =========================================================

if APP_JSX.exists():

    content = APP_JSX.read_text(
        encoding="utf-8"
    )

    # =============================================
    # IMPORT
    # =============================================

    if 'ClientSidebar' not in content:

        content = content.replace(

            'import BigImage from "./assets/cognitive-core.png"',

            '''import BigImage from "./assets/cognitive-core.png"
import ClientSidebar from "./components/ClientSidebar"'''

        )

    # =============================================
    # STATE
    # =============================================

    if 'selectedClient' not in content:

        content = content.replace(

            'const [loading, setLoading] = useState(false)',

            '''const [loading, setLoading] = useState(false)

  const [selectedClient, setSelectedClient] = useState(

    "miranda_experience"

  )'''

        )

    # =============================================
    # FETCH BODY
    # =============================================

    content = content.replace(

        'prompt\n\n          })',

        '''prompt,

            client_name: selectedClient

          })'''

    )

    # =============================================
    # GRID
    # =============================================

    content = content.replace(

        'gridTemplateColumns: "1fr 1fr"',

        'gridTemplateColumns: "280px 1fr 1fr"'

    )

    # =============================================
    # INSERT SIDEBAR
    # =============================================

    if '<ClientSidebar' not in content:

        content = content.replace(

            '{/* INPUT PANEL */}',

            '''<ClientSidebar

            selectedClient={selectedClient}

            setSelectedClient={setSelectedClient}

          />

          {/* INPUT PANEL */}'''

        )

    APP_JSX.write_text(
        content,
        encoding="utf-8"
    )

    print("✅ App.jsx actualizado")

else:

    print("❌ App.jsx no encontrado")

# =========================================================
# PATCH MAIN.PY
# =========================================================

if MAIN_PY.exists():

    main_content = MAIN_PY.read_text(
        encoding="utf-8"
    )

    # =============================================
    # REQUEST MODEL
    # =============================================

    if 'client_name' not in main_content:

        main_content = main_content.replace(

            'class PromptRequest(BaseModel):\n    prompt: str',

            '''class PromptRequest(BaseModel):

    prompt: str

    client_name: str | None = None'''

        )

    # =============================================
    # PROCESS REQUEST
    # =============================================

    main_content = main_content.replace(

        '''response = process_request(

            request.prompt

        )''',

        '''response = process_request(

            request.prompt,

            request.client_name

        )'''

    )

    MAIN_PY.write_text(
        main_content,
        encoding="utf-8"
    )

    print("✅ main.py actualizado")

else:

    print("❌ main.py no encontrado")

# =========================================================
# DONE
# =========================================================

print("""

=========================================
🔥 BRAND EXPERIENCE PATCH COMPLETED
=========================================

SYSTEMS UPDATED:

✅ Client Sidebar
✅ App.jsx
✅ Backend main.py
✅ Client Awareness
✅ Contextual AI
✅ Multi-Client System

NEXT:

1. Restart backend
2. Restart frontend
3. Test client switching

=========================================

BACKEND:

cd backend
uvicorn main:app --reload

FRONTEND:

cd frontend
npm run dev

=========================================

""")