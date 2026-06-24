#!/usr/bin/env bash
# solmate-skills: install.sh
# Purpose: Install Solmate hook scripts into the current project's .claude/ directory
#          and merge hook configuration into .claude/settings.json.
# Usage:   bash .agent/skills/hooks/install.sh
#          (or run from any location: bash <path-to-hooks>/install.sh)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(pwd)"
CLAUDE_DIR="$PROJECT_ROOT/.claude"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "Solmate Skills — Hook Installer"
echo "Project: $PROJECT_ROOT"
echo ""

# --- Step 1: Create .claude/hooks/ ---
mkdir -p "$HOOKS_DIR"
echo "[1/4] Created $HOOKS_DIR"

# --- Step 2: Copy hook scripts ---
cp "$SCRIPT_DIR/suggest-skills.sh"   "$HOOKS_DIR/solmate-suggest.sh"
cp "$SCRIPT_DIR/watch-files.sh"      "$HOOKS_DIR/solmate-watch.sh"
cp "$SCRIPT_DIR/verify-suggest.sh"   "$HOOKS_DIR/solmate-verify-suggest.sh"
chmod +x "$HOOKS_DIR/solmate-suggest.sh"
chmod +x "$HOOKS_DIR/solmate-watch.sh"
chmod +x "$HOOKS_DIR/solmate-verify-suggest.sh"
echo "[2/4] Copied hook scripts:"
echo "      .claude/hooks/solmate-suggest.sh         (UserPromptSubmit)"
echo "      .claude/hooks/solmate-watch.sh           (PreToolUse)"
echo "      .claude/hooks/solmate-verify-suggest.sh  (Stop)"

# --- Step 3: Merge hook config into settings.json ---
echo "[3/4] Merging hook config into $SETTINGS_FILE"

python3 - "$SETTINGS_FILE" <<'PYEOF'
import sys, json, os

settings_path = sys.argv[1]

# Load existing settings or start fresh
if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        try:
            settings = json.load(f)
        except json.JSONDecodeError:
            print(f"  WARNING: {settings_path} has invalid JSON. Backing up and starting fresh.")
            os.rename(settings_path, settings_path + '.bak')
            settings = {}
else:
    settings = {}

hooks = settings.setdefault('hooks', {})

# --- UserPromptSubmit hook ---
suggest_cmd = "bash .claude/hooks/solmate-suggest.sh"
submit_hooks = hooks.setdefault('UserPromptSubmit', [])

# Check for duplicate
already_has_suggest = any(
    h.get('command') == suggest_cmd
    for entry in submit_hooks
    for h in entry.get('hooks', [])
)
if not already_has_suggest:
    submit_hooks.append({
        "hooks": [{
            "type": "command",
            "command": suggest_cmd,
            "timeout": 5
        }]
    })
    print("  Added: UserPromptSubmit → solmate-suggest.sh")
else:
    print("  Skipped (already exists): UserPromptSubmit → solmate-suggest.sh")

# --- PreToolUse hook ---
watch_cmd = "bash .claude/hooks/solmate-watch.sh"
pre_hooks = hooks.setdefault('PreToolUse', [])

already_has_watch = any(
    h.get('command') == watch_cmd
    for entry in pre_hooks
    for h in entry.get('hooks', [])
)
if not already_has_watch:
    pre_hooks.append({
        "matcher": "Write|Edit",
        "hooks": [{
            "type": "command",
            "command": watch_cmd,
            "timeout": 5
        }]
    })
    print("  Added: PreToolUse (Write|Edit) → solmate-watch.sh")
else:
    print("  Skipped (already exists): PreToolUse → solmate-watch.sh")

# --- Stop hook ---
verify_cmd = "bash .claude/hooks/solmate-verify-suggest.sh"
stop_hooks = hooks.setdefault('Stop', [])

already_has_verify = any(
    h.get('command') == verify_cmd
    for entry in stop_hooks
    for h in entry.get('hooks', [])
)
if not already_has_verify:
    stop_hooks.append({
        "hooks": [{
            "type": "command",
            "command": verify_cmd,
            "timeout": 10,
            "statusMessage": "변경 파일 분석 중..."
        }]
    })
    print("  Added: Stop → solmate-verify-suggest.sh")
else:
    print("  Skipped (already exists): Stop → solmate-verify-suggest.sh")

# Write back
os.makedirs(os.path.dirname(settings_path), exist_ok=True)
with open(settings_path, 'w') as f:
    json.dump(settings, f, indent=2, ensure_ascii=False)
    f.write('\n')

print(f"  Saved: {settings_path}")
PYEOF

# --- Step 4: Add .claude/hooks/ to .gitignore if not already there ---
GITIGNORE="$PROJECT_ROOT/.gitignore"
if [ -f "$GITIGNORE" ]; then
  if ! grep -q "\.claude/hooks/" "$GITIGNORE" 2>/dev/null; then
    echo "" >> "$GITIGNORE"
    echo "# Solmate hook scripts (project-local)" >> "$GITIGNORE"
    echo ".claude/hooks/" >> "$GITIGNORE"
    echo "[4/4] Added .claude/hooks/ to .gitignore"
  else
    echo "[4/4] .gitignore already excludes .claude/hooks/"
  fi
else
  echo "[4/4] No .gitignore found — skipping"
fi

echo ""
echo "Done. Hooks are active in this project."
echo ""
echo "What was installed:"
echo "  UserPromptSubmit  → 프롬프트 키워드 감지 → 관련 스킬 제안"
echo "  PreToolUse        → 편집 중인 파일 패턴 감지 → 관련 스킬 제안"
echo "  Stop              → 작업 완료 후 변경 파일 분석 → verify-* 스킬 실행 시점 알림"
echo ""
echo "To review or disable hooks, open /hooks in Claude Code."
echo "To uninstall, remove .claude/hooks/ and the 'hooks' section from .claude/settings.json."
