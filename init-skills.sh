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

# Link AGENTS.md and USAGE.md to Root
for doc in AGENTS.md USAGE.md; do
    echo "🚀 Linking Global ${doc}..."
    if [ -f "$GLOBAL_BASE/$doc" ]; then
        if [ -L "$doc" ] || [ -f "$doc" ]; then
            rm -f "$doc"
        fi
        ln -s "$GLOBAL_BASE/$doc" "$doc"
        echo "✅ Linked: $doc"
    else
        echo "⚠️ Warning: Global $doc not found in $GLOBAL_BASE"
    fi
done

echo "✨ All set! Your project is now powered by Antigravity's global skills."
