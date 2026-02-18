#!/bin/bash

# Antigravity Skills Global Setup Script
# Usage: Run this in a new project root to link global skills.

GLOBAL_BASE="/Users/namhyeongseog/Documents/solmate-skills"
LOCAL_DIR=".agent/skills"

# Ensure local skill directory exists
mkdir -p "$LOCAL_DIR"

# Get list of all subdirectories (skills) in GLOBAL_BASE, excluding the directory itself
SKILLS=($(find "$GLOBAL_BASE" -maxdepth 1 -type d -not -path "$GLOBAL_BASE" -exec basename {} \;))

echo "🚀 Linking Global Antigravity Skills..."

for skill in "${SKILLS[@]}"; do
    if [ -d "$GLOBAL_BASE/$skill" ]; then
        if [ -L "$LOCAL_DIR/$skill" ] || [ -e "$LOCAL_DIR/$skill" ]; then
            rm -rf "$LOCAL_DIR/$skill"
        fi
        ln -s "$GLOBAL_BASE/$skill" "$LOCAL_DIR/$skill"
        echo "✅ Linked Skill: $skill"
    else
        echo "⚠️ Warning: Global skill '$skill' not found in $GLOBAL_BASE"
    fi
done

# Link AGENTS.md to Root
echo "🚀 Linking Global AGENTS.md..."
if [ -f "$GLOBAL_BASE/AGENTS.md" ]; then
    if [ -L "AGENTS.md" ] || [ -f "AGENTS.md" ]; then
        rm -f "AGENTS.md"
    fi
    ln -s "$GLOBAL_BASE/AGENTS.md" "AGENTS.md"
    echo "✅ Linked: AGENTS.md"
else
    echo "⚠️ Warning: Global AGENTS.md not found in $GLOBAL_BASE"
fi

echo "✨ All set! Your project is now powered by Antigravity's global skills."
