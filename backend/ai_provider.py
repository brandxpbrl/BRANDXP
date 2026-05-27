# Backward-compatible provider module.
#
# Existing backend code imports chat_completion/get_provider_status from this
# module. The implementation now lives in services.ai_client so providers can
# be configured without touching the multi-agent orchestration layer.

from services.ai_client import chat_completion, get_provider_status, reset_provider_state