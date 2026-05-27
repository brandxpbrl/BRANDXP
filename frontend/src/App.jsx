import { useEffect, useMemo, useState } from "react"

import BigImage from "./assets/cognitive-core.png"

import Layout from "./components/Layout"
import ThinkingFlow from "./components/ThinkingFlow"
import RetrievedConcepts from "./components/RetrievedConcepts"
import OutputPanel from "./components/OutputPanel"
import DeliverablesPanel from "./components/DeliverablesPanel"
import FrameworkResultsHub from "./components/FrameworkResultsHub"
import ClientMemoryPanel from "./components/ClientMemoryPanel"
import ClientWorkbench from "./components/ClientWorkbench"
import AnalysisReadinessPanel from "./components/AnalysisReadinessPanel"
import WorkspaceModuleHeader from "./components/WorkspaceModuleHeader"
import EntityAdvisorPanel from "./components/EntityAdvisorPanel"
import ClientPortalPanel from "./components/ClientPortalPanel"
import ClientOperatorChat from "./components/ClientOperatorChat"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [response, setResponse] = useState("")
  const [concepts, setConcepts] = useState([])
  const [flow, setFlow] = useState([])
  const [agents, setAgents] = useState([])
  const [analysisMeta, setAnalysisMeta] = useState(null)
  const [structuredAnalysis, setStructuredAnalysis] = useState(null)
  const [clients, setClients] = useState([])
  const [analysisPlan, setAnalysisPlan] = useState(null)
  const [analysisPlanLoading, setAnalysisPlanLoading] = useState(false)
  const [analysisPlanError, setAnalysisPlanError] = useState("")
  const [deliverablesData, setDeliverablesData] = useState(null)
  const [deliverablesLoading, setDeliverablesLoading] = useState(false)
  const [deliverablesError, setDeliverablesError] = useState("")
  const [deliverablesGenerating, setDeliverablesGenerating] = useState(false)
  const [visualBoardsGenerating, setVisualBoardsGenerating] = useState(false)
  const [masterDeliverableGenerating, setMasterDeliverableGenerating] = useState(false)
  const [promptPackGenerating, setPromptPackGenerating] = useState(false)
  const [deliverablesActionMessage, setDeliverablesActionMessage] = useState("")
  const [deliverablesActionError, setDeliverablesActionError] = useState("")
  const [deliverableContent, setDeliverableContent] = useState(null)
  const [deliverableContentLoading, setDeliverableContentLoading] = useState(false)
  const [deliverableContentError, setDeliverableContentError] = useState("")
  const [sidebarSection, setSidebarSection] = useState("panel")
  const [dashboardSection, setDashboardSection] = useState("framework")
  const [clientName, setClientName] = useState("")
  const [clientNotes, setClientNotes] = useState("")
  const [instagram, setInstagram] = useState("")
  const [links, setLinks] = useState("")
  const [transcription, setTranscription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [intakeStatus, setIntakeStatus] = useState("")
  const [entityAdvisorData, setEntityAdvisorData] = useState(null)
  const [entityAdvisorLoading, setEntityAdvisorLoading] = useState(false)
  const [entityAdvisorError, setEntityAdvisorError] = useState("")
  const [entityAdvisorActionLoading, setEntityAdvisorActionLoading] = useState(false)
  const [entityAdvisorActionMessage, setEntityAdvisorActionMessage] = useState("")
  const [entityAdvisorActionError, setEntityAdvisorActionError] = useState("")
  const [entityDeliverablesReview, setEntityDeliverablesReview] = useState(null)
  const [entityDeliverablesReviewLoading, setEntityDeliverablesReviewLoading] = useState(false)
  const [entityDeliverablesReviewError, setEntityDeliverablesReviewError] = useState("")
  const [clientPortalData, setClientPortalData] = useState(null)
  const [clientPortalLoading, setClientPortalLoading] = useState(false)
  const [clientPortalError, setClientPortalError] = useState("")
  const [clientPortalActionLoading, setClientPortalActionLoading] = useState("")
  const [clientPortalActionMessage, setClientPortalActionMessage] = useState("")
  const [clientPortalActionError, setClientPortalActionError] = useState("")
  const [clientChatContext, setClientChatContext] = useState(null)
  const [clientChatLoading, setClientChatLoading] = useState(false)
  const [clientChatError, setClientChatError] = useState("")
  const [clientChatMessages, setClientChatMessages] = useState([])
  const [clientChatSending, setClientChatSending] = useState(false)
  const [clientChatSendError, setClientChatSendError] = useState("")
  const [clientChatSendMessage, setClientChatSendMessage] = useState("")
  const [selectedChatPromptId, setSelectedChatPromptId] = useState("")

  const activeClient = useMemo(
    () => clients.find((client) => client.name === clientName),
    [clients, clientName]
  )

  const currentClientName = activeClient?.name || clientName.trim()
  const deliverablesCount = deliverablesData?.items?.length || 0

  const loadClients = async () => {
    try {
      const res = await fetch(`${API_URL}/clients`)
      const data = await res.json()
      setClients(data.clients || [])
    } catch {
      setClients([])
    }
  }

  useEffect(() => {
    let isMounted = true

    fetch(`${API_URL}/clients`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setClients(data.clients || [])
        }
      })
      .catch(() => {
        if (isMounted) {
          setClients([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const streamText = async (text) => {
    const words = text.split(" ")
    let current = ""

    for (const word of words) {
      current += `${word} `
      setResponse(current)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }

  const getIntakePayload = () => ({
    client_name: clientName.trim(),
    instagram: instagram.trim(),
    links: links
      .split(/\r?\n/)
      .map((link) => link.trim())
      .filter(Boolean),
    transcription: transcription.trim(),
    notes: clientNotes.trim(),
  })

  const checkAnalysisPlan = async () => {
    if (!clientName.trim()) {
      setAnalysisPlan(null)
      setAnalysisPlanError("Selecciona o crea un cliente para verificar fuentes.")
      return
    }

    setAnalysisPlanLoading(true)
    setAnalysisPlanError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(clientName.trim())}/analysis-plan`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo verificar fuentes.")
      }

      setAnalysisPlan(data)
    } catch (err) {
      setAnalysisPlan(null)
      setAnalysisPlanError(err.message)
    } finally {
      setAnalysisPlanLoading(false)
    }
  }

  const loadClientDeliverables = async (clientOverride = "") => {
    const targetClient = clientOverride || activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverablesData(null)
      setDeliverablesError("Selecciona o crea un cliente para ver entregables.")
      return
    }

    setDeliverablesLoading(true)
    setDeliverablesError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/deliverables`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudieron cargar los entregables.")
      }

      setDeliverablesData(data)
    } catch (err) {
      setDeliverablesData(null)
      setDeliverablesError(err.message)
    } finally {
      setDeliverablesLoading(false)
    }
  }

  const loadEntityAdvisor = async (clientOverride = "") => {
    const targetClient = clientOverride || activeClient?.name || clientName.trim()

    if (!targetClient) {
      setEntityAdvisorData(null)
      setEntityAdvisorError("")
      setEntityAdvisorActionMessage("")
      setEntityAdvisorActionError("")
      return
    }

    setEntityAdvisorLoading(true)
    setEntityAdvisorError("")

    try {
      const res = await fetch(`${API_URL}/entity-advisor/${encodeURIComponent(targetClient)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo cargar la Entidad.")
      }

      setEntityAdvisorData(data)
    } catch (err) {
      setEntityAdvisorData(null)
      setEntityAdvisorError(err.message)
    } finally {
      setEntityAdvisorLoading(false)
    }
  }

  const loadClientPortal = async (clientOverride = "") => {
    const targetClient = clientOverride || activeClient?.name || clientName.trim()

    if (!targetClient) {
      setClientPortalData(null)
      setClientPortalError("Selecciona un cliente para abrir su portal.")
      return
    }

    setClientPortalLoading(true)
    setClientPortalError("")

    try {
      const res = await fetch(`${API_URL}/api/clients/${encodeURIComponent(targetClient)}/portal`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo cargar el Portal del Cliente.")
      }

      setClientPortalData(data)
    } catch (err) {
      setClientPortalData(null)
      setClientPortalError(err.message)
    } finally {
      setClientPortalLoading(false)
    }
  }

  const runClientPortalAction = async (actionId) => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setClientPortalActionError("Selecciona un cliente para ejecutar la accion.")
      return
    }

    const endpoints = {
      create_sprint: `/api/clients/${encodeURIComponent(targetClient)}/activation/sprint`,
      mark_reviewed: `/api/clients/${encodeURIComponent(targetClient)}/deliverables/mark-reviewed`,
      generate_summary: `/api/clients/${encodeURIComponent(targetClient)}/portal/summary`,
    }
    const endpoint = endpoints[actionId]

    if (!endpoint) {
      setClientPortalActionMessage("")
      setClientPortalActionError("Esta accion todavia no esta conectada.")
      return
    }

    setClientPortalActionLoading(actionId)
    setClientPortalActionMessage("")
    setClientPortalActionError("")

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo ejecutar la accion.")
      }

      const fileText = data.file || data.files?.join(", ") || "archivo creado"
      const messages = {
        create_sprint: `Sprint creado: ${fileText}`,
        mark_reviewed: `Entregables marcados como revisados: ${fileText}`,
        generate_summary: `Resumen generado: ${fileText}`,
      }

      setClientPortalActionMessage(messages[actionId] || "Accion completada.")
      await loadClientPortal(targetClient)
      await loadClientDeliverables(targetClient)
      await loadEntityAdvisor(targetClient)
    } catch (err) {
      setClientPortalActionError(err.message)
    } finally {
      setClientPortalActionLoading("")
    }
  }

  const loadClientChatContext = async (clientOverride = "") => {
    const targetClient = clientOverride || activeClient?.name || clientName.trim()

    if (!targetClient) {
      setClientChatContext(null)
      setClientChatError("Selecciona un cliente para abrir el chat operativo.")
      return
    }

    setClientChatLoading(true)
    setClientChatError("")

    try {
      const res = await fetch(`${API_URL}/api/clients/${encodeURIComponent(targetClient)}/chat/context`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo cargar el chat del cliente.")
      }

      setClientChatContext(data)
      setClientChatMessages(data.history || [])
    } catch (err) {
      setClientChatContext(null)
      setClientChatError(err.message)
    } finally {
      setClientChatLoading(false)
    }
  }

  const sendClientChatMessage = async (message, promptId = "") => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setClientChatSendError("Selecciona un cliente para usar el chat.")
      return
    }

    setClientChatSending(true)
    setClientChatSendError("")
    setClientChatSendMessage("")

    const optimisticUserMessage = {
      role: "user",
      content: message,
      prompt_id: promptId,
      created_at: new Date().toISOString(),
    }
    setClientChatMessages((current) => [...current, optimisticUserMessage])

    try {
      const res = await fetch(`${API_URL}/api/clients/${encodeURIComponent(targetClient)}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          prompt_id: promptId || null,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo ejecutar el chat.")
      }

      setClientChatMessages(data.history || [])
      setClientChatSendMessage(`Respuesta generada con ${data.provider || "IA"}. Historial guardado.`)
      setSelectedChatPromptId("")
      await loadClientChatContext(targetClient)
    } catch (err) {
      setClientChatSendError(err.message)
    } finally {
      setClientChatSending(false)
    }
  }

  const runEntityAdvisorAction = async (actionKey) => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setEntityAdvisorActionMessage("")
      setEntityAdvisorActionError("Selecciona un cliente para ejecutar la accion.")
      return
    }

    if (actionKey === "review_deliverables") {
      setEntityAdvisorActionError("")
      setEntityAdvisorActionMessage("")
      setEntityDeliverablesReviewLoading(true)
      setEntityDeliverablesReviewError("")

      try {
        const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/deliverables/review`, {
          method: "POST",
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.detail || "No se pudo revisar los entregables.")
        }

        setEntityDeliverablesReview(data)
        setEntityAdvisorActionMessage("Revision de entregables preparada.")
        setDashboardSection("results")
        await loadClientDeliverables(targetClient)
        await loadClientPortal(targetClient)
      } catch (err) {
        setEntityDeliverablesReview(null)
        setEntityDeliverablesReviewError(err.message)
        setEntityAdvisorActionError(err.message)
      } finally {
        setEntityDeliverablesReviewLoading(false)
      }
      return
    }

    if (actionKey === "render_visual_assets") {
      setDashboardSection("results")
      await generateVisualBoardSpecs()
      await loadEntityAdvisor(targetClient)
      return
    }

    const actionEndpoints = {
      generate_ai_agent_os: `/clients/${encodeURIComponent(targetClient)}/ai-agent-os/generate`,
      generate_campaign: `/api/clients/${encodeURIComponent(targetClient)}/campaign/generate`,
      generate_evolution_timeline: `/api/clients/${encodeURIComponent(targetClient)}/timeline/generate`,
    }
    const endpoint = actionEndpoints[actionKey]

    if (!endpoint) {
      setEntityAdvisorActionMessage("")
      setEntityAdvisorActionError("Esta accion todavia no esta conectada.")
      return
    }

    setEntityAdvisorActionLoading(true)
    setEntityAdvisorActionMessage("")
    setEntityAdvisorActionError("")

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo ejecutar la accion.")
      }

      const actionMessages = {
        generate_ai_agent_os: `AI Agent OS generado: ${data.created?.length || 0} archivos.`,
        generate_campaign: `Campaña estrategica generada: ${data.files?.length || 0} archivos.`,
        generate_evolution_timeline: `Timeline de evolucion generado: ${data.files?.length || 0} archivos.`,
      }
      setEntityAdvisorActionMessage(actionMessages[actionKey] || "Accion completada.")
      await loadEntityAdvisor(targetClient)
      await loadClientDeliverables(targetClient)
      await loadClientPortal(targetClient)
    } catch (err) {
      setEntityAdvisorActionError(err.message)
    } finally {
      setEntityAdvisorActionLoading(false)
    }
  }

  const generateClientDeliverables = async () => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverablesActionMessage("")
      setDeliverablesActionError("Selecciona o crea un cliente para generar entregables.")
      return
    }

    setDeliverablesGenerating(true)
    setDeliverablesActionMessage("")
    setDeliverablesActionError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/deliverables/generate`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudieron generar los entregables.")
      }

      setDeliverablesActionMessage(`Entregables generados: ${data.created?.length || 0} archivos.`)
      await loadClientDeliverables(targetClient)
    } catch (err) {
      setDeliverablesActionError(err.message)
    } finally {
      setDeliverablesGenerating(false)
    }
  }

  const generateVisualBoardSpecs = async () => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverablesActionMessage("")
      setDeliverablesActionError("Selecciona o crea un cliente para generar visual boards.")
      return
    }

    setVisualBoardsGenerating(true)
    setDeliverablesActionMessage("")
    setDeliverablesActionError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/visual-boards/generate-specs`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudieron generar los visual boards.")
      }

      const imageRes = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/visual-boards/render-images`, {
        method: "POST",
      })
      const imageData = await imageRes.json()

      if (!imageRes.ok) {
        throw new Error(imageData.detail || "Se generaron specs, pero no se pudieron renderizar las imagenes.")
      }

      setDeliverablesActionMessage(
        `Visual boards generados: ${data.created?.length || 0} specs y ${imageData.created?.length || 0} imagenes.`,
      )
      await loadClientDeliverables(targetClient)
    } catch (err) {
      setDeliverablesActionError(err.message)
    } finally {
      setVisualBoardsGenerating(false)
    }
  }

  const generateMasterDeliverable = async () => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverablesActionMessage("")
      setDeliverablesActionError("Selecciona o crea un cliente para generar el master.")
      return
    }

    setMasterDeliverableGenerating(true)
    setDeliverablesActionMessage("")
    setDeliverablesActionError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/deliverables/generate-master`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo generar el entregable master.")
      }

      setDeliverablesActionMessage(`Master generado: ${data.created || "archivo creado"}.`)
      await loadClientDeliverables(targetClient)
    } catch (err) {
      setDeliverablesActionError(err.message)
    } finally {
      setMasterDeliverableGenerating(false)
    }
  }

  const generatePromptPack = async () => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverablesActionMessage("")
      setDeliverablesActionError("Selecciona o crea un cliente para generar el Prompt Pack.")
      return
    }

    setPromptPackGenerating(true)
    setDeliverablesActionMessage("")
    setDeliverablesActionError("")

    try {
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/prompt-pack/generate`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo generar el Prompt Pack.")
      }

      setDeliverablesActionMessage("Prompt Pack generado correctamente.")
      await loadClientDeliverables(targetClient)
    } catch (err) {
      setDeliverablesActionError(err.message)
    } finally {
      setPromptPackGenerating(false)
    }
  }

  const loadDeliverableContent = async (relativePath) => {
    const targetClient = activeClient?.name || clientName.trim()

    if (!targetClient) {
      setDeliverableContent(null)
      setDeliverableContentError("Selecciona o crea un cliente para ver entregables.")
      return
    }

    setDeliverableContentLoading(true)
    setDeliverableContentError("")

    try {
      const params = new URLSearchParams({ path: relativePath })
      const res = await fetch(`${API_URL}/clients/${encodeURIComponent(targetClient)}/deliverables/content?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo abrir el entregable.")
      }

      setDeliverableContent(data)
    } catch (err) {
      setDeliverableContent(null)
      setDeliverableContentError(err.message)
    } finally {
      setDeliverableContentLoading(false)
    }
  }

  const closeDeliverableContent = () => {
    setDeliverableContent(null)
    setDeliverableContentError("")
  }

  useEffect(() => {
    if (!activeClient?.name) return

    setDeliverableContent(null)
    setDeliverableContentError("")
    loadClientDeliverables(activeClient.name)
    loadEntityAdvisor(activeClient.name)
    loadClientPortal(activeClient.name)
    loadClientChatContext(activeClient.name)
  }, [activeClient?.name])

  const selectClient = (name) => {
    if (name !== clientName) {
      setResponse("")
      setConcepts([])
      setFlow([])
      setAgents([])
      setAnalysisMeta(null)
      setStructuredAnalysis(null)
      setAnalysisPlan(null)
      setDeliverablesActionMessage("")
      setDeliverablesActionError("")
      setEntityDeliverablesReview(null)
      setEntityDeliverablesReviewError("")
    }

    setClientName(name)
    setSidebarSection("entities")
    setDashboardSection("results")
  }

  const changeSidebarSection = (item) => {
    setSidebarSection(item.id)
    setDashboardSection(item.target)

    if (item.target === "portal") {
      loadClientPortal(currentClientName)
    }

    if (item.target === "client_chat") {
      loadClientChatContext(currentClientName)
    }
  }

  const createClient = async () => {
    if (!clientName.trim()) return

    setSaving(true)
    setIntakeStatus("Creando cliente...")

    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clientName.trim(),
          notes: clientNotes.trim(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo crear el cliente.")
      }

      setClientName(data.client.name)
      setIntakeStatus(data.client.created ? "Cliente creado." : "Cliente actualizado.")
      await loadClients()
      await loadEntityAdvisor(data.client.name)
    } catch (err) {
      setIntakeStatus(err.message)
    } finally {
      setSaving(false)
    }
  }

  const saveIntake = async () => {
    if (!clientName.trim()) return

    setSaving(true)
    setIntakeStatus("Guardando fuentes...")

    try {
      const res = await fetch(`${API_URL}/clients/intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getIntakePayload()),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo guardar el intake.")
      }

      if (selectedFiles.length) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append("category", file.type.includes("pdf") ? "Material_Actual" : "Instagram_Actual")
          formData.append("file", file)

          const uploadRes = await fetch(`${API_URL}/clients/${encodeURIComponent(clientName.trim())}/uploads`, {
            method: "POST",
            body: formData,
          })

          if (!uploadRes.ok) {
            throw new Error(`No se pudo subir ${file.name}.`)
          }
        }
      }

      setIntakeStatus("Fuentes guardadas en memoria del cliente.")
      setSelectedFiles([])
      await loadClients()
      await loadEntityAdvisor(clientName.trim())
      return data
    } catch (err) {
      setIntakeStatus(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const executeFramework = async () => {
    if (!clientName.trim()) {
      setIntakeStatus("Primero define el nombre del cliente.")
      return
    }

    setLoading(true)
    setResponse("")
    setConcepts([])
    setFlow(["Creando cliente", "Guardando fuentes", "Ejecutando framework"])
    setAgents([])
    setAnalysisMeta(null)
    setStructuredAnalysis(null)

    try {
      await createClient()
      await saveIntake()

      const res = await fetch(`${API_URL}/clients/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...getIntakePayload(),
          intake_already_saved: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Backend request failed.")
      }

      if (!data.saved_analysis?.latest) {
        throw new Error("El framework respondio, pero no confirmo el guardado de LATEST_ANALYSIS.")
      }

      setConcepts(data.concepts || [])
      setFlow(data.flow || [])
      setAgents(data.agents || [])
      setStructuredAnalysis(data.structured_analysis || null)
      setAnalysisMeta({
        duration: data.duration_ms,
        error: data.error,
        provider: data.provider,
        providerErrors: data.provider_errors || [],
        client: data.client,
        savedAnalysis: data.saved_analysis,
      })
      setIntakeStatus("Framework ejecutado y analisis guardado.")
      setDashboardSection("results")
      await loadClientDeliverables(data.client?.name || clientName.trim())
      await loadEntityAdvisor(data.client?.name || clientName.trim())
      await loadClientPortal(data.client?.name || clientName.trim())
      await loadClientChatContext(data.client?.name || clientName.trim())

      await streamText(data.response || "No response was generated.")
    } catch (err) {
      setFlow(["Conexion interrumpida", "Revision requerida"])
      setResponse(
        "No pude conectar con el motor local. Inicia el backend en http://127.0.0.1:8000 y vuelve a ejecutar el analisis."
      )
      setAnalysisMeta({
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="app-shell"
      style={{
        backgroundImage: `url(${BigImage})`,
      }}
    >
      <div className="app-overlay" />

      <div className="app-content">
        <Layout activeSection={sidebarSection} onSectionChange={changeSidebarSection}>
          <div className="command-grid">
            <div className="panel-stack">
              <WorkspaceModuleHeader activeSection={sidebarSection} />

              <section className="glass-panel workspace-tabs-panel">
                <div className="workspace-tabs-head">
                  <div>
                    <div className="panel-kicker">Dashboard operativo</div>
                    <div className="panel-title">Workspace del cliente</div>
                  </div>
                  <div className="workspace-client-chip">
                    <span>Cliente activo</span>
                    <strong>{currentClientName || "Sin seleccionar"}</strong>
                  </div>
                </div>
                <div className="workspace-tabs" role="tablist" aria-label="Secciones del dashboard">
                  <button
                    className={dashboardSection === "framework" ? "workspace-tab active" : "workspace-tab"}
                    type="button"
                    onClick={() => setDashboardSection("framework")}
                  >
                    Framework
                  </button>
                  <button
                    className={dashboardSection === "results" ? "workspace-tab active" : "workspace-tab"}
                    type="button"
                    onClick={() => setDashboardSection("results")}
                  >
                    Analisis y entregables
                  </button>
                  <button
                    className={dashboardSection === "portal" ? "workspace-tab active" : "workspace-tab"}
                    type="button"
                    onClick={() => {
                      setSidebarSection("client_portal")
                      setDashboardSection("portal")
                      loadClientPortal(currentClientName)
                    }}
                  >
                    Portal del Cliente
                  </button>
                  <button
                    className={dashboardSection === "client_chat" ? "workspace-tab active" : "workspace-tab"}
                    type="button"
                    onClick={() => {
                      setSidebarSection("client_chat")
                      setDashboardSection("client_chat")
                      loadClientChatContext(currentClientName)
                    }}
                  >
                    Chat operativo
                  </button>
                </div>
              </section>

              {dashboardSection === "framework" ? (
                <>
                  <ClientWorkbench
                    clientName={clientName}
                    setClientName={setClientName}
                    clientNotes={clientNotes}
                    setClientNotes={setClientNotes}
                    instagram={instagram}
                    setInstagram={setInstagram}
                    links={links}
                    setLinks={setLinks}
                    transcription={transcription}
                    setTranscription={setTranscription}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    intakeStatus={intakeStatus}
                    loading={loading}
                    saving={saving}
                    onCreateClient={createClient}
                    onSaveIntake={saveIntake}
                    onExecuteFramework={executeFramework}
                  />

                  <AnalysisReadinessPanel
                    clientName={clientName}
                    analysisPlan={analysisPlan}
                    loading={analysisPlanLoading}
                    error={analysisPlanError}
                    onCheck={checkAnalysisPlan}
                  />
                </>
              ) : dashboardSection === "portal" ? (
                <ClientPortalPanel
                  clientName={currentClientName}
                  portalData={clientPortalData}
                  loading={clientPortalLoading}
                  error={clientPortalError}
                  apiUrl={API_URL}
                  onRefresh={() => loadClientPortal(currentClientName)}
                  onViewDeliverable={loadDeliverableContent}
                  deliverableContent={deliverableContent}
                  contentLoading={deliverableContentLoading}
                  contentError={deliverableContentError}
                  onCloseDeliverable={closeDeliverableContent}
                  onPortalAction={runClientPortalAction}
                  portalActionLoading={clientPortalActionLoading}
                  portalActionMessage={clientPortalActionMessage}
                  portalActionError={clientPortalActionError}
                />
              ) : dashboardSection === "client_chat" ? (
                <ClientOperatorChat
                  clientName={currentClientName}
                  chatContext={clientChatContext}
                  loading={clientChatLoading}
                  error={clientChatError}
                  messages={clientChatMessages}
                  selectedPromptId={selectedChatPromptId}
                  onSelectPrompt={setSelectedChatPromptId}
                  onSendMessage={sendClientChatMessage}
                  sending={clientChatSending}
                  sendError={clientChatSendError}
                  sendMessage={clientChatSendMessage}
                />
              ) : (
                <>
                  <FrameworkResultsHub
                    clientName={currentClientName}
                    analysisMeta={analysisMeta}
                    structuredAnalysis={structuredAnalysis}
                    deliverablesCount={deliverablesCount}
                    deliverablesLoading={deliverablesLoading}
                    onRefreshDeliverables={() => loadClientDeliverables(currentClientName)}
                    onRunAgain={executeFramework}
                  />

                  <OutputPanel
                    response={response}
                    agents={agents}
                    analysisMeta={analysisMeta}
                    structuredAnalysis={structuredAnalysis}
                  />

                  <DeliverablesPanel
                    clientName={currentClientName}
                    apiUrl={API_URL}
                    deliverablesData={deliverablesData}
                    loading={deliverablesLoading}
                    error={deliverablesError}
                    onRefresh={() => loadClientDeliverables(currentClientName)}
                    onGenerateDeliverables={generateClientDeliverables}
                    onGenerateVisualBoards={generateVisualBoardSpecs}
                    onGenerateMaster={generateMasterDeliverable}
                    onGeneratePromptPack={generatePromptPack}
                    generatingDeliverables={deliverablesGenerating}
                    generatingVisualBoards={visualBoardsGenerating}
                    generatingMaster={masterDeliverableGenerating}
                    generatingPromptPack={promptPackGenerating}
                    actionMessage={deliverablesActionMessage}
                    actionError={deliverablesActionError}
                    deliverableContent={deliverableContent}
                    contentLoading={deliverableContentLoading}
                    contentError={deliverableContentError}
                    onViewDeliverable={loadDeliverableContent}
                    onCloseDeliverable={closeDeliverableContent}
                  />
                </>
              )}
            </div>

            <div className="panel-stack">
              <EntityAdvisorPanel
                advisorData={entityAdvisorData}
                loading={entityAdvisorLoading}
                error={entityAdvisorError}
                apiUrl={API_URL}
                clientName={currentClientName}
                onRefresh={() => loadEntityAdvisor(currentClientName)}
                onPrimaryAction={runEntityAdvisorAction}
                actionLoading={entityAdvisorActionLoading}
                actionMessage={entityAdvisorActionMessage}
                actionError={entityAdvisorActionError}
                deliverablesReview={entityDeliverablesReview}
                reviewLoading={entityDeliverablesReviewLoading}
                reviewError={entityDeliverablesReviewError}
                onOpenPortal={() => {
                  setSidebarSection("client_portal")
                  setDashboardSection("portal")
                  loadClientPortal(currentClientName)
                }}
              />

              <ClientMemoryPanel
                clients={clients}
                activeClient={activeClient}
                onSelectClient={selectClient}
              />
              <ThinkingFlow loading={loading} steps={flow} />
              <RetrievedConcepts concepts={concepts} />
            </div>
          </div>
        </Layout>
      </div>
    </div>
  )
}
