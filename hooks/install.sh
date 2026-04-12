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
cp "$SCRIPT_DIR/suggest-skills.sh" "$HOOKS_DIR/solmate-suggest.sh"
cp "$SCRIPT_DIR/watch-files.sh"    "$HOOKS_DIR/solmate-watch.sh"
chmod +x "$HOOKS_DIR/solmate-suggest.sh"
chmod +x "$HOOKS_DIR/solmate-watch.sh"
echo "[2/4] Copied hook scripts:"
echo "      .claude/hooks/solmate-suggest.sh  (UserPromptSubmit)"
echo "      .claude/hooks/solmate-watch.sh    (PreToolUse)"

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
        "matcher": "Read|Write|Edit|Bash",
        "hooks": [{
            "type": "command",
            "command": watch_cmd,
            "timeout": 5
        }]
    })
    print("  Added: PreToolUse (Read|Write|Edit|Bash) → solmate-watch.sh")
else:
    print("  Skipped (already exists): PreToolUse → solmate-watch.sh")

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
echo "  UserPromptSubmit  → detects keywords in your prompts → suggests relevant skills"
echo "  PreToolUse        → detects file patterns being edited → suggests relevant skills"
echo ""
echo "To review or disable hooks, open /hooks in Claude Code."
echo "To uninstall, remove .claude/hooks/ and the 'hooks' section from .claude/settings.json."
