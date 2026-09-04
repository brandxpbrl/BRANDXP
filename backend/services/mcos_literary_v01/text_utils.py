from __future__ import annotations

import re
import unicodedata
from collections import Counter


WORD_RE = re.compile(r"\b[\wÁÉÍÓÚÜÑáéíóúüñ]+\b", re.UNICODE)
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+|\n{2,}")


def normalize_token(value: str) -> str:
    value = value.lower().strip()
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def normalized_words(text: str) -> list[str]:
    return [normalize_token(word) for word in words(text)]


def sentences(text: str) -> list[str]:
    return [part.strip() for part in SENTENCE_RE.split(text) if part.strip()]


def paragraphs(text: str) -> list[str]:
    return [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]


def headings(text: str) -> list[str]:
    return [line.strip("# ").strip() for line in text.splitlines() if line.startswith("#")]


def clamp_score(value: float) -> int:
    return max(0, min(100, int(round(value))))


def keyword_count(text: str, keywords: set[str]) -> int:
    tokens = normalized_words(text)
    return sum(1 for token in tokens if token in keywords)


def most_common_keywords(text: str, keywords: set[str], limit: int = 8) -> list[str]:
    counts = Counter(token for token in normalized_words(text) if token in keywords)
    return [item for item, _ in counts.most_common(limit)]


def first_matching_sentence(text: str, keywords: set[str]) -> str:
    for sentence in sentences(text):
        if keyword_count(sentence, keywords):
            return sentence
    return ""
