"use client";

export type SpeechOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
};

export function canSpeak() {
  return typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined";
}

export function speakWithCoordinator(text: string, options: SpeechOptions = {}) {
  if (!canSpeak() || !text.trim()) return false;
  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "es-ES";
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;
  if (options.voice) utterance.voice = options.voice;
  utterance.onstart = options.onstart ?? null;
  utterance.onend = options.onend ?? null;
  utterance.onerror = options.onerror ?? null;
  synthesis.speak(utterance);
  return true;
}

export function cancelCoordinatedSpeech() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
