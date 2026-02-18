---
name: obsidian-sync
description: Manages the synchronization between the project's documentation and an Obsidian vault via symbolic links. Ensures metadata compatibility and provides tools to verify the link status.
---

# Obsidian Sync Skill

This skill maintains the connection between the project's `docs/` directory and an external Obsidian vault.

## 1. Setup Overview

The documentation is linked using a **Symbolic Link (Symlink)**. This allows real-time synchronization without duplicating files.

- **Source Path**: `[CURRENT_PROJECT_PATH]/docs`
- **Obsidian Path**: `/Users/namhyeongseog/Documents/obsidian/PROJECT/[PROJECT_NAME]/docs`

## 2. Key Features

- **Project Isolation**: Every project is managed under the `PROJECT/` parent directory in the vault.
- **Real-time Sync**: Uses symbolic links for instant updates.
- **Reusable Pattern**: Can be applied to any project by creating the corresponding folder and link.

## 3. Usage Instructions

### 3.1. General Sync Procedure
1. Identify the project name (e.g., `Rural-Rest`).
2. Create the target folder in Obsidian: `mkdir -p /Users/namhyeongseog/Documents/obsidian/PROJECT/[PROJECT_NAME]`
3. Create the symbolic link: `ln -sfn [ABS_PATH_TO_PROJECT]/docs /Users/namhyeongseog/Documents/obsidian/PROJECT/[PROJECT_NAME]/docs`


### 3.2. Updating Metadata
When the user asks to "optimize for Obsidian", the agent should:
1. Ensure all markdown files have a consistent YAML header.
2. Add `#project/rural-rest` and `#layer/[layer_name]` tags to the metadata.
3. Ensure file-to-file links follow Obsidian's preferred format (e.g., `[[filename|label]]` is supported but we stick to standard markdown `[label](path)` for cross-compatibility).

## 4. Maintenance

If the project directory moves, the symlink MUST be recreated:
`ln -sfn [NEW_PROJECT_PATH]/docs /Users/namhyeongseog/Documents/obsidian/Rural-Rest/docs`

## 5. Related Skills
- **manage-docs**: The primary skill that generates the content being synced.
- **design-md**: Generates design-related documentation that will also be visible in Obsidian.
