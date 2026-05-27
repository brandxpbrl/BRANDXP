# BRAND EXPERIENCE OS - AGENTS EXPORT

Generated: 2026-05-26

Purpose: portable documentation for analyzing the Brand Experience OS multi-agent system with another AI.

---

# 1. General System Summary

Brand Experience OS is a local creative intelligence system for brand diagnosis, identity creation, visual direction, content strategy, Instagram auditing, sales guidance and client deliverable generation.

The active runtime is composed of:

- FastAPI backend in `backend/`
- React/Vite frontend in `frontend/`
- client operating system in `BRAND_EXPERIENCE/`
- knowledge base / Entity Bible in `BRAND_EXPERIENCE_OS/` and `backend/entity_bible/`
- active agent folders in `backend/agents/AGENTS/`

The core philosophy of the system:

- identity before design
- perception before sales
- emotion before explanation
- strategy before execution
- visual language as emotional perception
- AI as creative intelligence, not generic automation

The current active multi-agent layer is file-based: each agent is a folder containing Markdown knowledge files. The backend reads those files and turns them into system prompts.

---

# 2. Complete Agent List

Active agents loaded by the backend:

1. `branding_agent`
2. `strategy_agent`
3. `psychology_agent`
4. `cinematic_director_agent`
5. `content_agent`
6. `instagram_audit_agent`
7. `sales_agent`

Agent source root:

```text
backend/agents/AGENTS/
```

Load priority is defined in:

```text
backend/dynamic_agent_loader.py
```

---

# 3. Agent Functions

## branding_agent

Reveals latent brand identity and translates it into visual, emotional and perceptual systems.

Primary lens:

- entity reading
- brand core
- perception strategy
- verbal identity
- visual identity
- strategic opportunity

Status: complete and used as reference depth. It was not modified during the latest specialist expansion.

## strategy_agent

Transforms identity into business direction, positioning, roadmap, offer logic and growth priorities.

Primary lens:

- strategic diagnosis
- positioning decision
- growth opportunity
- roadmap
- next strategic action

## psychology_agent

Interprets the emotional, subconscious and behavioral forces behind perception, trust, desire and decision-making.

Primary lens:

- emotional diagnosis
- trust gaps
- audience fears/desires
- decision psychology
- perception shift

## cinematic_director_agent

Transforms identity into atmosphere, light, composition, rhythm, visual world and production-ready cinematic direction.

Primary lens:

- visual diagnosis
- cinematic direction
- lighting
- composition
- AI image/video prompt guidance

## content_agent

Transforms brand identity into content systems, editorial pillars, narrative angles, captions, reels and publishing logic.

Primary lens:

- content diagnosis
- editorial strategy
- format direction
- content journey
- production priorities

## instagram_audit_agent

Diagnoses Instagram as a perception, authority and conversion environment.

Primary lens:

- profile diagnosis
- bio clarity
- visual perception
- content audit
- highlights / pinned posts / CTA path

## sales_agent

Transforms brand identity, trust and perceived value into commercial communication, offer logic, WhatsApp flow, objection handling and conversion direction.

Primary lens:

- sales diagnosis
- offer clarity
- value positioning
- conversation strategy
- objection handling

---

# 4. Summarized Agent File Contents

Each specialist agent is primarily defined by these files:

```text
identity.md
mission.md
workflow.md
behavior.md
output_structure.md
```

The loader also reads other Markdown files when present.

---

## branding_agent

Path:

```text
backend/agents/AGENTS/branding_agent/
```

### identity.md

Defines the Branding Agent as a specialist that reveals emotional identities and transforms them into coherent visual systems. It thinks like a creative director, perception psychologist, visual architect, emotional strategist and systemic designer.

### mission.md

Mission: reveal the true identity of an entity and transform it into a coherent visual, emotional and perceptual system.

### workflow.md

Flow:

1. analyze identity, perception, emotions, narrative and current aesthetics
2. detect essence, energy, disconnections and hidden potential
3. reveal real identity, emotional frequency and positioning
4. build branding, visual system, emotional narrative and premium perception
5. refine visual and emotional coherence

### behavior.md

Behavior:

- think deeply
- transmit emotionally
- analyze before creating
- maintain aesthetic coherence
- avoid superficiality

Forbidden:

- generic branding
- empty trend copying
- saturated visuals
- incoherent emotional direction

### output_structure.md

Uses a detailed structure:

- Entity Reading
- Brand Core
- Perception Strategy
- Verbal Identity
- Visual Identity Direction
- Strategic Opportunity
- Next Actions

Supports downstream deliverables such as `identity_cliente.md`, `MASTER_BRAND_EXPERIENCE.md`, logo prompts, palette prompts and brand identity boards.

---

## strategy_agent

Path:

```text
backend/agents/AGENTS/strategy_agent/
```

### identity.md

Defines the Strategy Agent as the specialist that turns brand identity into business direction, positioning, roadmap, offer logic and growth priorities. It connects essence, market, offer, audience, content, experience and conversion.

### mission.md

Mission: transform brand diagnosis into a coherent roadmap for positioning, growth, content, offer, experience and execution.

Key questions:

- What should the brand become?
- What should it stop doing?
- What should the market understand first?
- What should be built next?
- What decision has highest leverage?

### workflow.md

Flow:

1. orient around context, stage, audience, offer and goal
2. diagnose strategic gap, positioning weakness, offer confusion and growth bottlenecks
3. prioritize urgent corrections and highest leverage decisions
4. architect positioning, roadmap, offer, journey, content and experience implications
5. activate with concrete actions, deliverables and validation decisions

### behavior.md

Behavior:

- think in systems
- prioritize before expanding
- connect brand with business impact
- separate symptoms from root causes
- avoid vague strategy

### output_structure.md

Structure:

- Strategic Diagnosis
- Positioning Decision
- Growth Opportunity
- Roadmap
- Next Actions

The agent must end with the next strategic move, not abstract advice.

---

## psychology_agent

Path:

```text
backend/agents/AGENTS/psychology_agent/
```

### identity.md

Defines the Psychology Agent as the specialist for emotional, subconscious and behavioral forces behind perception, trust, desire and decision-making.

It analyzes what people need to feel before they believe, follow, ask or buy.

### mission.md

Mission: transform emotional understanding into strategic perception, trust and conversion insight.

Key objectives:

- detect emotional triggers
- identify fears and objections
- reveal trust gaps
- map aspiration and desire
- guide tone, visuals and sales from emotional truth

### workflow.md

Flow:

1. sense emotional tone, audience state, desires, fears and trust signals
2. decode subconscious perception and emotional contradictions
3. reframe emotional truth and required belief shift
4. translate psychology into tone, content, visual signals and sales arguments
5. ground with next action, evidence, risk and emotional metric

### behavior.md

Behavior:

- read beneath the surface
- prioritize emotional truth
- connect feelings with business outcomes
- detect fear, desire, trust and aspiration
- avoid manipulation

### output_structure.md

Structure:

- Emotional Diagnosis
- Decision Psychology
- Perception Shift
- Strategic Application
- Next Actions

The agent must finish with the emotional shift the brand must create.

---

## cinematic_director_agent

Path:

```text
backend/agents/AGENTS/cinematic_director_agent/
```

### identity.md

Defines the Cinematic Director Agent as the specialist that turns brand identity into atmosphere, composition, light, rhythm, visual language and sensory perception.

It directs feeling, not decoration.

### mission.md

Mission: transform brand identity into cinematic visual direction for images, reels, boards, campaigns and AI generation.

Key objectives:

- define atmosphere
- guide composition
- establish lighting direction
- create visual rhythm
- translate emotion into frames
- prevent generic visual output

### workflow.md

Flow:

1. read identity, emotional frequency, desired perception and symbolic territory
2. diagnose atmosphere, color, composition, lighting, rhythm, texture and visual tension
3. direct the frame with visual world, first-frame sensation, hero composition and light behavior
4. translate to visual boards, reels, photos, AI prompts, campaigns and social rhythm
5. refine by removing generic stock feeling, noise and meaningless effects

### behavior.md

Behavior:

- think in frames
- prioritize atmosphere over decoration
- connect visuals with perception
- describe light, space, rhythm and texture clearly
- protect premium feeling

### output_structure.md

Structure:

- Visual Diagnosis
- Cinematic Direction
- Production Guidance
- Perception Impact
- Next Actions

The agent must end with usable visual direction, not only a mood.

---

## content_agent

Path:

```text
backend/agents/AGENTS/content_agent/
```

### identity.md

Defines the Content Agent as the specialist that turns brand identity into emotionally intelligent content systems, editorial pillars, narratives, captions, reels and publishing logic.

Content is treated as public brand behavior, not post volume.

### mission.md

Mission: transform brand essence, strategy and perception goals into a content system executable across Instagram, WhatsApp, campaigns and brand assets.

Key objectives:

- define content pillars
- create narrative angles
- guide reels and captions
- align content with brand voice
- build trust through consistency
- connect content with sales without losing identity

### workflow.md

Flow:

1. extract essence, audience need, desired perception, offer and proof
2. diagnose content gaps, voice inconsistency, weak authority signals and unclear conversion path
3. architect pillars, narrative territories, format strategy and editorial rhythm
4. produce direction for reels, captions, carousels, stories, CTAs and WhatsApp handoff
5. systematize into repeatable content, next posts, next campaign or deliverable

### behavior.md

Behavior:

- protect brand voice
- create content from identity
- prioritize perception over volume
- connect content with audience emotion
- avoid empty trends

### output_structure.md

Structure:

- Content Diagnosis
- Editorial Strategy
- Format Direction
- Content Journey
- Next Actions

The agent must end with a clear content system decision.

---

## instagram_audit_agent

Path:

```text
backend/agents/AGENTS/instagram_audit_agent/
```

### identity.md

Defines the Instagram Audit Agent as the specialist that diagnoses Instagram perception through profile, bio, feed, highlights, content rhythm, authority signals and conversion path.

Instagram is treated as a public proof system.

### mission.md

Mission: evaluate Instagram presence and convert perception gaps into improvements for clarity, authority, content, aesthetics and conversion.

Key objectives:

- diagnose profile clarity
- evaluate bio and positioning
- detect feed inconsistency
- assess content value
- identify missing trust signals
- improve conversion path
- align Instagram with brand identity

### workflow.md

Flow:

1. scan username, name field, bio, profile image, highlights, pinned posts, feed, reels and CTAs
2. interpret first impression, perceived value, authority, trust and conversion friction
3. detect missing positioning, weak proof, generic visuals, confusing offer and weak CTA
4. recommend profile fixes, bio direction, highlight structure, content corrections and conversion path
5. prioritize urgent fix, highest impact improvement and deliverable

### behavior.md

Behavior:

- audit perception before aesthetics
- be specific with profile improvements
- connect content with conversion
- identify missing trust signals
- avoid vague social media advice

### output_structure.md

Structure:

- Profile Diagnosis
- Perception Gap
- Content Audit
- Conversion Path
- Next Actions

The agent must end with what should be fixed first.

---

## sales_agent

Path:

```text
backend/agents/AGENTS/sales_agent/
```

### identity.md

Defines the Sales Agent as the specialist that turns brand identity, trust and perceived value into commercial communication, offer logic, WhatsApp flow, objection handling and conversion direction.

It sells through clarity, desire, trust and fit, not pressure.

### mission.md

Mission: transform brand strategy and emotional perception into a commercial system for offers, WhatsApp conversations, proposals, CTAs and follow-up.

Key objectives:

- clarify the offer
- raise perceived value
- identify objections
- build trust signals
- guide WhatsApp conversations
- improve CTA and conversion flow
- align sales language with brand identity

### workflow.md

Flow:

1. clarify offer, buyer, desired outcome, price/value tension, CTA and sales context
2. diagnose offer confusion, trust gap, objection patterns, urgency weakness and value perception gap
3. position value with proof, transformation promise and emotional/rational reasons to act
4. build conversation flow for WhatsApp, qualification, objections, proposal, close and follow-up
5. convert with integrity through next message, deliverable and risk

### behavior.md

Behavior:

- sell through clarity
- protect brand tone
- detect objections early
- connect emotion with value
- make next steps simple
- avoid pressure tactics

### output_structure.md

Structure:

- Sales Diagnosis
- Value Positioning
- Conversation Strategy
- Offer / Proposal Implication
- Next Actions

The agent must end with the next commercial move.

---

# 5. How The Backend Loads Agents

Agent loading is implemented in:

```text
backend/dynamic_agent_loader.py
```

Key behavior:

1. `AGENTS_ROOT` points to:

```text
backend/agents/AGENTS/
```

2. `AGENT_PRIORITY` defines load order:

```text
branding_agent
strategy_agent
psychology_agent
cinematic_director_agent
content_agent
instagram_audit_agent
sales_agent
```

3. `_read_markdown_files(agent_path)` reads all `.md` files inside each agent folder.

4. Empty Markdown files are skipped.

5. Each file is appended into a combined prompt section:

```text
# FILE: filename.md

file content
```

6. `load_agent(agent_name)` returns:

```text
{
  "name": agent_name,
  "system_prompt": combined_markdown_content,
  "source": agent_folder_path
}
```

7. `load_all_agents()` returns all valid agents sorted by priority.

Current loader validation:

```text
agents_loaded: 7
```

---

# 6. How The Orchestrator Works

Orchestration is implemented in:

```text
backend/cognitive_orchestrator.py
```

Important constants:

```text
MAX_ACTIVE_AGENTS = 7
MAX_PARALLEL_AGENT_WORKERS = 2
```

Main flow:

1. `process_request(prompt, client_name=None)` receives the user request.
2. It calls `ensure_client_from_prompt()` to detect or create a client context.
3. It loads client context with `load_client()`.
4. It loads agents with `load_all_agents()[:MAX_ACTIVE_AGENTS]`.
5. It runs agents using `ThreadPoolExecutor`.
6. Maximum concurrent workers: `2`.
7. Each agent runs through `run_agent()`.
8. Agent outputs are sorted back into agent priority order.
9. `synthesize_responses()` sends all agent outputs to the Master Synthesis Agent.
10. `build_brand_analysis()` creates structured analysis.
11. `save_client_analysis()` saves the result to the client system.
12. The API response includes:

```text
response
structured_analysis
agents
concepts
flow
duration_ms
provider
provider_errors
client
saved_analysis
```

Important current behavior:

`run_agent()` now includes a specialist operating rule:

```text
Use the agent's own output_structure.md as the primary response structure.
Do not flatten your answer into a generic consulting template.
Stay inside your specialist lens.
```

This prevents the orchestrator from forcing all agents into the same generic response shape.

---

# 7. What Each Agent Does In The Multi-Agent Flow

## Branding Layer

The Branding Agent defines what the brand is as an entity:

- essence
- emotional frequency
- identity tension
- perception gap
- verbal identity
- visual direction

## Strategy Layer

The Strategy Agent defines where the brand should move:

- positioning decision
- growth opportunity
- offer focus
- roadmap
- execution priorities

## Psychology Layer

The Psychology Agent defines what the audience must feel and believe:

- fears
- desires
- trust gaps
- objections
- emotional triggers
- perception shift

## Cinematic Direction Layer

The Cinematic Director Agent defines how the brand should feel visually:

- atmosphere
- lighting
- composition
- visual rhythm
- production guidance
- AI prompt direction

## Content Layer

The Content Agent defines how identity becomes repeated public communication:

- content pillars
- narrative territories
- reels
- captions
- content journey
- editorial rhythm

## Instagram Audit Layer

The Instagram Audit Agent defines how the Instagram presence should be corrected:

- profile clarity
- bio positioning
- highlights
- pinned posts
- feed perception
- CTA / WhatsApp path

## Sales Layer

The Sales Agent defines how interest becomes action:

- offer clarity
- value argument
- objection response
- WhatsApp flow
- proposal framing
- follow-up

## Master Synthesis Layer

After all specialists respond, the Master Synthesis Agent merges the outputs into one final response.

Its job:

- preserve useful specialist insight
- remove repetition
- keep the answer concrete
- prioritize next actions
- convert recommendations into deliverables and execution steps

---

# 8. Current System State

## Active Agents

```text
branding_agent: active, complete
strategy_agent: active, completed as specialist
psychology_agent: active, completed as specialist
cinematic_director_agent: active, completed as specialist
content_agent: active, completed as specialist
instagram_audit_agent: active, completed as specialist
sales_agent: active, completed as specialist
```

## Markdown File State

Current agent folders:

```text
branding_agent: 13 md files, 0 empty
strategy_agent: 9 md files, 0 empty
psychology_agent: 9 md files, 0 empty
cinematic_director_agent: 9 md files, 0 empty
content_agent: 9 md files, 0 empty
instagram_audit_agent: 9 md files, 0 empty
sales_agent: 9 md files, 0 empty
```

## Prompt Size Snapshot

Loader prompt sizes from latest validation:

```text
branding_agent: 9269 chars
strategy_agent: 5062 chars
psychology_agent: 5025 chars
cinematic_director_agent: 4941 chars
content_agent: 4804 chars
instagram_audit_agent: 5046 chars
sales_agent: 4876 chars
```

## Validation Status

The system was validated with a local test harness using:

- real `dynamic_agent_loader`
- real `run_agent`
- real `synthesize_responses`
- mocked provider response to avoid external quota/fallback issues

Specialist structure check:

```text
branding_agent => ENTITY READING
strategy_agent => STRATEGIC DIAGNOSIS
psychology_agent => EMOTIONAL DIAGNOSIS
cinematic_director_agent => VISUAL DIAGNOSIS
content_agent => CONTENT DIAGNOSIS
instagram_audit_agent => PROFILE DIAGNOSIS
sales_agent => SALES DIAGNOSIS
```

Result:

```text
distinct specialist headings = 7 of 7
```

Provider status during real test:

```text
OpenAI configured: true
OpenAI result: 429 insufficient_quota
Ollama fallback: timed out
```

This means the system structure is valid, but live end-to-end provider execution currently depends on fixing OpenAI quota or Ollama availability/performance.

---

# 9. Recommended Next Steps

1. Fix live provider availability.

Options:

- resolve OpenAI quota/billing
- configure a valid OpenAI model/API key
- run Ollama locally with the configured model
- reduce Ollama timeout risk by testing a smaller model or fewer agents

2. Run a live end-to-end `/orchestrator` test.

Use a controlled prompt such as:

```text
Cliente ficticio: empresa de transfer turistico premium en Rio de Janeiro...
```

Validate:

- all 7 agents respond
- provider errors are empty or acceptable
- final synthesis preserves specialist layers

3. Add a development-only agent inspection endpoint or script.

Recommended output:

- agent name
- source path
- prompt character count
- first heading
- empty file count
- last modified date

4. Add regression test for specialist differentiation.

The test should verify:

- 7 agents loaded
- each agent has `identity.md`, `mission.md`, `workflow.md`, `behavior.md`, `output_structure.md`
- first output section differs by specialist
- orchestrator includes the specialist operating rule

5. Expand non-core files later if needed.

Possible future improvements:

- richer `prompts.md` per specialist
- specialist examples for each agent
- memory rules per agent
- stronger connection between agent outputs and generated deliverables

6. Improve final synthesis prompt.

The Master Synthesis Agent could explicitly preserve these sections:

- Brand Entity
- Strategic Move
- Emotional Unlock
- Visual Direction
- Content System
- Instagram Fixes
- Sales Path
- Next Sprint

---

# 10. Recently Modified Files

Recent specialist agent expansion:

```text
backend/agents/AGENTS/strategy_agent/identity.md
backend/agents/AGENTS/strategy_agent/mission.md
backend/agents/AGENTS/strategy_agent/workflow.md
backend/agents/AGENTS/strategy_agent/behavior.md
backend/agents/AGENTS/strategy_agent/output_structure.md

backend/agents/AGENTS/psychology_agent/identity.md
backend/agents/AGENTS/psychology_agent/mission.md
backend/agents/AGENTS/psychology_agent/workflow.md
backend/agents/AGENTS/psychology_agent/behavior.md
backend/agents/AGENTS/psychology_agent/output_structure.md

backend/agents/AGENTS/cinematic_director_agent/identity.md
backend/agents/AGENTS/cinematic_director_agent/mission.md
backend/agents/AGENTS/cinematic_director_agent/workflow.md
backend/agents/AGENTS/cinematic_director_agent/behavior.md
backend/agents/AGENTS/cinematic_director_agent/output_structure.md

backend/agents/AGENTS/content_agent/identity.md
backend/agents/AGENTS/content_agent/mission.md
backend/agents/AGENTS/content_agent/workflow.md
backend/agents/AGENTS/content_agent/behavior.md
backend/agents/AGENTS/content_agent/output_structure.md

backend/agents/AGENTS/instagram_audit_agent/identity.md
backend/agents/AGENTS/instagram_audit_agent/mission.md
backend/agents/AGENTS/instagram_audit_agent/workflow.md
backend/agents/AGENTS/instagram_audit_agent/behavior.md
backend/agents/AGENTS/instagram_audit_agent/output_structure.md

backend/agents/AGENTS/sales_agent/identity.md
backend/agents/AGENTS/sales_agent/mission.md
backend/agents/AGENTS/sales_agent/workflow.md
backend/agents/AGENTS/sales_agent/behavior.md
backend/agents/AGENTS/sales_agent/output_structure.md
```

Recent orchestration adjustment:

```text
backend/cognitive_orchestrator.py
```

Change summary:

- replaced a generic shared response format with a specialist operating rule
- each agent is now instructed to use its own `output_structure.md`
- the system explicitly tells agents not to flatten into generic consulting responses

Not modified during the latest specialist expansion:

```text
backend/agents/AGENTS/branding_agent/
```

This export file:

```text
BRAND_EXPERIENCE_OS_AGENTS_EXPORT.md
```

