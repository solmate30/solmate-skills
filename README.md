# solmate-skills

Curated skills for Solmate projects. Easily share and install AI tool skills across your team.

## Installation

You don't need to install this package globally. Simply use `npx`:

```bash
# List available skills
npx solmate-skills list

# Install all available skills
npx solmate-skills install all

# Install a specific skill (e.g., manage-docs)
npx solmate-skills install manage-docs
```

## How it works

When you run the `install` command, the script will:
1. Check for the selected skill in this package.
2. Copy the skill folder to `.agent/skills/<skill-name>` in your current project.

## Available Skills

- `design-md`: Design and UI patterns.
- `dev-conventions`: Development standards and rules.
- `enhance-prompt`: Advanced prompting techniques.
- `implementation-workflow`: Step-by-step implementation guides.
- `manage-collaboration`: Team collaboration protocols.
- `manage-docs`: Documentation structure and standards.
- `manage-skills`: Skill management and creation tool.
- `obsidian-sync`: Obsidian integration.
- `react-components`: Curated React components.
- `remotion`: Video creation as code.
- `shadcn-ui`: Custom Shadcn UI components.
- `stitch-loop`: Integration with Stitch.
- `verify-docs`: Documentation audit tool.
- `verify-drizzle-schema`: Drizzle schema verification.
- `verify-implementation`: Logic and flow verification.
