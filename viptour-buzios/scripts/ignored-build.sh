#!/usr/bin/env bash
# 0 = skip build, 1 = run build. Fail open on uncertainty.
set -u
APP="viptour-buzios"
base="${VERCEL_GIT_PREVIOUS_SHA:-}"
[ -n "$base" ] || { echo "No prior SHA: BUILD"; exit 1; }
command -v git >/dev/null 2>&1 || exit 1
root="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 1
[ -e "$root/.git" ] || exit 1
git -C "$root" cat-file -e "${base}^{commit}" 2>/dev/null || exit 1
head="${VERCEL_GIT_COMMIT_SHA:-HEAD}"
git -C "$root" cat-file -e "${head}^{commit}" 2>/dev/null || exit 1
changed="$(git -C "$root" diff --name-only "$base" "$head" -- 2>/dev/null)" || exit 1
[ -n "$changed" ] || { echo "No changes: SKIP"; exit 0; }
while IFS= read -r path; do
  case "$path" in
    "$APP"/*) echo "App changed: BUILD $path"; exit 1 ;;
    viptour-buzios/*|bz-lanchas/*) ;;
    docs/*|README.md|*.md) ;;
    *) echo "Shared/unknown change: BUILD $path"; exit 1 ;;
  esac
done <<< "$changed"
echo "Unrelated changes only: SKIP"
exit 0
