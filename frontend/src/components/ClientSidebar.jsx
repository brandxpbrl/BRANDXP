export default function ClientSidebar({
  selectedClient,
  setSelectedClient,
  activeAgents
}) {

  const clients = [
    "miranda_experience",
    "fela_tours",
    "isa_tours"
  ]

  return (

    <div style={{

      background: "rgba(255,255,255,0.03)",

      border: "1px solid rgba(255,255,255,0.08)",

      borderRadius: "24px",

      padding: "24px",

      height: "100%"

    }}>

      <div style={{

        color: "#67e8f9",

        fontSize: "12px",

        letterSpacing: "4px",

        marginBottom: "24px"

      }}>

        CLIENT SYSTEM

      </div>

      <div style={{

        display: "flex",

        flexDirection: "column",

        gap: "12px"

      }}>

        {clients.map((client) => (

          <button

            key={client}

            onClick={() => setSelectedClient(client)}

            style={{

              background:

                selectedClient === client

                  ? "linear-gradient(90deg,#06b6d4,#8b5cf6)"

                  : "rgba(255,255,255,0.04)",

              border: "1px solid rgba(255,255,255,0.08)",

              borderRadius: "16px",

              padding: "16px",

              color: "white",

              cursor: "pointer",

              textAlign: "left"

            }}

          >

            {client}

          </button>

        ))}

      </div>

      <div style={{

        marginTop: "32px",

        borderTop: "1px solid rgba(255,255,255,0.08)",

        paddingTop: "24px"

      }}>

        <div style={{

          color: "#67e8f9",

          fontSize: "12px",

          letterSpacing: "4px",

          marginBottom: "18px"

        }}>

          ACTIVE AGENTS

        </div>

        <div style={{

          display: "flex",

          flexDirection: "column",

          gap: "12px"

        }}>

          {activeAgents?.map((agent) => (

            <div

              key={agent}

              style={{

                background: "rgba(255,255,255,0.04)",

                border: "1px solid rgba(255,255,255,0.08)",

                borderRadius: "14px",

                padding: "14px",

                color: "white"

              }}

            >

              ● {agent}

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}