#!/bin/bash

# Antigravity Skills Global Setup Script
# Usage: Run this in a new project root to link global skills.

GLOBAL_BASE="/Users/namhyeongseog/Documents/solmate-skills"
LOCAL_DIR=".agent/skills"

# Ensure local skill directory exists
mkdir -p "$LOCAL_DIR"

# Match the npm CLI: only top-level directories containing SKILL.md are skills.
SKILLS=()
while IFS= read -r skill_file; do
    skill_dir="$(dirname "$skill_file")"
    SKILLS+=("$(basename "$skill_dir")")
done < <(find "$GLOBAL_BASE" -mindepth 2 -maxdepth 2 -type f -name SKILL.md | sort)

echo "Linking Global Antigravity Skills..."

for skill in "${SKILLS[@]}"; do
    if [ -d "$GLOBAL_BASE/$skill" ]; then
        if [ -L "$LOCAL_DIR/$skill" ] || [ -e "$LOCAL_DIR/$skill" ]; then
            rm -rf "$LOCAL_DIR/$skill"
        fi
        ln -s "$GLOBAL_BASE/$skill" "$LOCAL_DIR/$skill"
        echo "Linked Skill: $skill"
    else
        echo "Warning: Global skill '$skill' not found in $GLOBAL_BASE"
    fi
done

# Link namespaced Claude project agents without touching unrelated agents.
CLAUDE_AGENT_SOURCE="$GLOBAL_BASE/rules-workflow/adapters/claude"
CLAUDE_AGENT_TARGET=".claude/agents"

if [ -d "$CLAUDE_AGENT_SOURCE" ]; then
    mkdir -p "$CLAUDE_AGENT_TARGET"
    for source in "$CLAUDE_AGENT_SOURCE"/solmate-*.md; do
        [ -e "$source" ] || continue
        file_name="$(basename "$source")"
        target="$CLAUDE_AGENT_TARGET/$file_name"
        if [ -L "$target" ] || [ -f "$target" ]; then
            rm -f "$target"
        fi
        ln -s "$source" "$target"
        echo "Linked Claude Agent: $file_name"
    done
fi

# Link AGENTS.md and USAGE.md to Root
for doc in AGENTS.md USAGE.md; do
    echo "Linking Global ${doc}..."
    if [ -f "$GLOBAL_BASE/$doc" ]; then
        if [ -L "$doc" ] || [ -f "$doc" ]; then
            rm -f "$doc"
        fi
        ln -s "$GLOBAL_BASE/$doc" "$doc"
        echo "Linked: $doc"
    else
        echo "Warning: Global $doc not found in $GLOBAL_BASE"
    fi
done

echo "All set. Your project is now powered by Antigravity's global skills."
