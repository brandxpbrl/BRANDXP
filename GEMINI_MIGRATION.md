# Gemini Migration

Generated: 2026-05-26

## Goal

Migrate Brand Experience OS from OpenAI-primary generation to Gemini-primary generation using a Google AI Studio API key, without breaking the multi-agent architecture.

OpenAI has now been removed from the fallback chain.

## Summary

The backend now uses a configurable AI provider layer:

```text
backend/services/ai_client.py
```

Gemini is the default primary provider:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash
```

OpenAI is no longer used as fallback. Ollama remains available as the only fallback after Gemini.

Note: `gemini-3.5-flash` is configured because it was requested for this migration. If Google AI Studio returns a model-not-found error, change only `GEMINI_MODEL` to an available model from the Gemini model list, for example `gemini-3-flash-preview` or `gemini-2.5-flash`.

Fallback order when `AI_PROVIDER=gemini`:

```text
gemini -> ollama
```

## Files Changed

```text
backend/services/__init__.py
backend/services/ai_client.py
backend/ai_provider.py
backend/requirements.txt
.env.example
backend/.env
GEMINI_MIGRATION.md
```

## Files Intentionally Not Changed

Agent Markdown files were not changed:

```text
backend/agents/AGENTS/
```

The multi-agent prompt architecture remains intact.

## Backend Integration

Existing code still imports from:

```text
backend/ai_provider.py
```

That file is now a compatibility wrapper:

```python
from services.ai_client import chat_completion, get_provider_status, reset_provider_state
```

This means existing imports in `cognitive_orchestrator.py` and `main.py` continue to work.

## Gemini Client

Gemini generation is centralized in:

```text
backend/services/ai_client.py
```

It uses the official SDK:

```python
from google import genai

client = genai.Client(api_key=api_key)
response = client.models.generate_content(
    model=model,
    contents=contents,
    config=config,
)
```

The API key is read from:

```text
GEMINI_API_KEY
```

The key is not hardcoded.

## Environment Variables

Recommended `.env` values:

```text
AI_PROVIDER=gemini
AI_TEMPERATURE=0.55

GEMINI_API_KEY=your-google-ai-studio-key-here
GEMINI_MODEL=gemini-3.5-flash

OLLAMA_MODEL=mistral
OLLAMA_HOST=http://127.0.0.1:11434
```

## Missing Key Behavior

If Gemini is selected but `GEMINI_API_KEY` is missing, the provider raises a clear error:

```text
GEMINI_API_KEY is not configured. Add it to backend/.env or the process environment.
```

Then the client attempts Ollama as the only fallback provider.

## Provider Status

The `/health` endpoint continues to expose provider status through `get_provider_status()`.

New status fields include:

```text
primary_provider
fallback_chain
gemini_configured
gemini_model
gemini_disabled_reason
gemini_retry_after_seconds
ollama_model
ollama_host
```

## Testing Notes

The SDK was installed with:

```text
pip install -U google-genai
```

Validation performed:

1. Import and provider status validation.
2. Missing `GEMINI_API_KEY` validation.
3. Multi-agent loader/orchestrator compatibility check.
4. Full multi-agent flow with Gemini client path mocked locally.
5. Simple live Gemini prompt test.
6. Full live multi-agent Gemini flow.

Live Gemini generation is now working with the configured local `GEMINI_API_KEY`.

Observed local status:

```text
primary_provider: gemini
fallback_chain: gemini -> ollama
gemini_configured: true
```

Missing key behavior was validated:

```text
GEMINI_API_KEY is not configured. Add it to backend/.env or the process environment.
```

Mocked full-flow validation:

```text
7 agent calls + 1 synthesis call = 8 Gemini-path calls
agents: Branding, Strategy, Psychology, Cinematic Director, Content, Instagram Audit, Sales
active_provider: gemini
```

Live simple prompt validation:

```text
provider: gemini
fallback_used: false
response: OK GEMINI
```

Live multi-agent validation:

```text
agents: branding_agent, strategy_agent, psychology_agent, cinematic_director_agent, content_agent, instagram_audit_agent, sales_agent
providers: gemini
fallback_used: false
synthesis_provider: gemini
```

## Important Operational Note

The current machine previously showed OpenAI quota errors and Ollama timeout behavior. OpenAI is no longer part of provider fallback. Gemini is the primary provider, and live generation requires a valid Google AI Studio key in `GEMINI_API_KEY`.

If no Gemini key is configured and Ollama is unavailable, the orchestrator will return provider failure through the existing fallback path.

## OpenAI Removal Update

OpenAI-specific environment variables were removed from `.env` and `.env.example`:

```text
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_TEMPERATURE
```

The active provider chain is now:

```text
gemini -> ollama
```
