#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
    checkHarnessTask,
    formatHarnessResult,
    getHarnessExitCode,
} = require('./harness-check');
const {
    checkHarnessArtifact,
    formatHarnessArtifactResult,
    getHarnessArtifactExitCode,
} = require('./harness-artifact');

const IGNORED_FOLDERS = ['bin', 'node_modules', '.git', '.github', '.gemini', '.agent'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'AGENTS.md', 'SKILL.md', 'init-skills.sh', 'README.md', '.DS_Store', 'old_AGENTS.md'];

// Root-level docs copied to the target project on every install.
const PACKAGE_DOC_FILES = ['USAGE.md'];

// Skills that require a post-install script to be executed after copying.
// Key: skill name, Value: path relative to the skill folder.
const POST_INSTALL_SCRIPTS = {
    'hooks': 'install.sh',
};

const packageRoot = path.join(__dirname, '..');
const targetProjectRoot = process.cwd();
const targetSkillsDir = path.join(targetProjectRoot, '.agent', 'skills');
const claudeAgentSourceDir = path.join(packageRoot, 'rules-workflow', 'adapters', 'claude');
const targetClaudeAgentsDir = path.join(targetProjectRoot, '.claude', 'agents');

function getAvailableSkills() {
    return fs.readdirSync(packageRoot, { withFileTypes: true })
        .filter(dirent => {
            if (!dirent.isDirectory() || IGNORED_FOLDERS.includes(dirent.name)) {
                return false;
            }
            return fs.existsSync(path.join(packageRoot, dirent.name, 'SKILL.md'));
        })
        .map(dirent => dirent.name);
}

function installPackageDocs() {
    for (const fileName of PACKAGE_DOC_FILES) {
        const sourcePath = path.join(packageRoot, fileName);
        const destPath = path.join(targetProjectRoot, fileName);

        if (!fs.existsSync(sourcePath)) {
            console.warn(`Warning: ${fileName} not found in package; skipping.`);
            continue;
        }

        fs.copyFileSync(sourcePath, destPath);
        console.log(`Installed ${fileName} to project root`);
    }
}

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    });
}

function installAgentAdapters() {
    if (!fs.existsSync(claudeAgentSourceDir)) {
        console.error('Error: Claude agent adapters not found in rules-workflow.');
        process.exit(1);
    }

    fs.mkdirSync(targetClaudeAgentsDir, { recursive: true });
    const agentFiles = fs.readdirSync(claudeAgentSourceDir)
        .filter(fileName => fileName.startsWith('solmate-') && fileName.endsWith('.md'));

    for (const fileName of agentFiles) {
        fs.copyFileSync(
            path.join(claudeAgentSourceDir, fileName),
            path.join(targetClaudeAgentsDir, fileName),
        );
    }

    console.log(`Installed ${agentFiles.length} Claude agent adapters to .claude/agents`);
    console.log('Codex uses the same contract through rules-workflow; linked AGENTS.md reinforces it globally.');
}

function listSkills() {
    const skills = getAvailableSkills();
    console.log('\nAvailable skills to install:');
    skills.forEach(skill => console.log(` - ${skill}`));
    console.log('\nUtilities:');
    console.log(' - hooks (install with: npx solmate-skills install hooks)');
    console.log(' - agents (install with: npx solmate-skills install agents)');
    console.log('\nHarness checks:');
    console.log(' - npx solmate-skills preflight TASK-000 [--strict]');
    console.log(' - npx solmate-skills verify TASK-000 [--strict]');
    console.log(' - npx solmate-skills validate-harness <manifest|message|events> <path> [--manifest <path>] [--strict]');
    console.log('   message and events validation require --manifest <path>');
    console.log('\nUsage: npx solmate-skills install <skill-name> | all | hooks | agents\n');
}

function installHooks() {
    const sourcePath = path.join(packageRoot, 'hooks');
    const destPath = path.join(targetSkillsDir, 'hooks');

    if (!fs.existsSync(sourcePath)) {
        console.error('Error: hooks directory not found.');
        process.exit(1);
    }

    console.log('Installing hooks utility...');
    copyFolderSync(sourcePath, destPath);
    console.log('Successfully installed hooks utility to .agent/skills/hooks');
    installPackageDocs();

    const scriptPath = path.join(destPath, 'install.sh');
    if (fs.existsSync(scriptPath)) {
        console.log('Running hook installer...');
        try {
            execSync(`bash "${scriptPath}"`, { stdio: 'inherit', cwd: targetProjectRoot });
        } catch (err) {
            console.error('Warning: hook installer exited with an error.');
        }
    }
}

function installSkill(skillName, options = {}) {
    const { deferPackageDocs = false } = options;
    const skills = getAvailableSkills();

    if (skillName === 'install-all') {
        console.log('Installing all skills...');
        skills.forEach(s => installSkill(s, { deferPackageDocs: true }));
        installPackageDocs();
        return;
    }

    if (skillName === 'hooks') {
        installHooks();
        return;
    }

    if (!skills.includes(skillName)) {
        console.error(`Error: Skill "${skillName}" not found.`);
        process.exit(1);
    }

    const sourcePath = path.join(packageRoot, skillName);
    const destPath = path.join(targetSkillsDir, skillName);

    console.log(`Installing ${skillName}...`);
    copyFolderSync(sourcePath, destPath);
    console.log(`Successfully installed ${skillName} to .agent/skills/${skillName}`);

    if (skillName === 'rules-workflow') {
        installAgentAdapters();
    }

    // Run post-install script if defined for this skill
    if (POST_INSTALL_SCRIPTS[skillName]) {
        const scriptPath = path.join(destPath, POST_INSTALL_SCRIPTS[skillName]);
        if (fs.existsSync(scriptPath)) {
            console.log(`Running post-install for ${skillName}...`);
            try {
                execSync(`bash "${scriptPath}"`, { stdio: 'inherit', cwd: targetProjectRoot });
            } catch (err) {
                console.error(`Warning: post-install script for ${skillName} exited with an error.`);
            }
        }
    }

    if (!deferPackageDocs) {
        installPackageDocs();
    }
}

function installHarnessAgents() {
    installSkill('rules-workflow');
}

function parseHarnessOptions(rawArgs) {
    const options = { mode: 'warning' };

    for (let index = 0; index < rawArgs.length; index += 1) {
        const arg = rawArgs[index];
        if (arg === '--strict') {
            options.mode = 'blocking';
        } else if (arg === '--mode') {
            if (!rawArgs[index + 1]) {
                throw new Error('--mode requires warning or blocking.');
            }
            options.mode = rawArgs[index + 1];
            index += 1;
        } else if (arg === '--backlog') {
            if (!rawArgs[index + 1]) {
                throw new Error('--backlog requires a file path.');
            }
            options.backlogPath = rawArgs[index + 1];
            index += 1;
        } else if (arg === '--json') {
            options.json = true;
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }

    return options;
}

function runHarnessCommand(stage, taskId, rawArgs) {
    let options;
    try {
        options = parseHarnessOptions(rawArgs);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 2;
        return;
    }

    const result = checkHarnessTask({
        stage,
        taskId,
        mode: options.mode,
        backlogPath: options.backlogPath,
        cwd: targetProjectRoot,
    });

    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log(formatHarnessResult(result));
    }
    process.exitCode = getHarnessExitCode(result);
}

function parseHarnessArtifactOptions(rawArgs) {
    const options = { mode: 'warning' };

    for (let index = 0; index < rawArgs.length; index += 1) {
        const arg = rawArgs[index];
        if (arg === '--strict') {
            options.mode = 'blocking';
        } else if (arg === '--mode') {
            if (!rawArgs[index + 1]) {
                throw new Error('--mode requires warning or blocking.');
            }
            options.mode = rawArgs[index + 1];
            index += 1;
        } else if (arg === '--manifest') {
            if (!rawArgs[index + 1]) {
                throw new Error('--manifest requires a file path.');
            }
            options.manifestPath = rawArgs[index + 1];
            index += 1;
        } else if (arg === '--json') {
            options.json = true;
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }

    return options;
}

function runHarnessArtifactCommand(artifactType, filePath, rawArgs) {
    let options;
    try {
        options = parseHarnessArtifactOptions(rawArgs);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 2;
        return;
    }

    const result = checkHarnessArtifact({
        artifactType,
        filePath,
        mode: options.mode,
        manifestPath: options.manifestPath,
        cwd: targetProjectRoot,
    });

    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log(formatHarnessArtifactResult(result));
    }
    process.exitCode = getHarnessArtifactExitCode(result);
}

const args = process.argv.slice(2);
const command = args[0];
const subCommand = args[1];

if (!command || command === 'list') {
    listSkills();
} else if (command === 'install') {
    if (!subCommand) {
        console.error('Error: Please specify a skill name or "all".');
        listSkills();
        process.exit(1);
    }
    if (subCommand === 'all' || subCommand === 'install-all') {
        installSkill('install-all');
    } else if (subCommand === 'hooks' || subCommand === 'install-hooks') {
        installHooks();
    } else if (subCommand === 'agents' || subCommand === 'install-agents') {
        installHarnessAgents();
    } else {
        installSkill(subCommand);
    }
} else if (command === 'install-all' || command === 'all') {
    installSkill('install-all');
} else if (command === 'install-hooks' || command === 'hooks') {
    installHooks();
} else if (command === 'install-agents' || command === 'agents') {
    installHarnessAgents();
} else if (command === 'preflight' || command === 'verify') {
    if (!subCommand) {
        console.error(`Error: ${command} requires a backlog task ID.`);
        process.exitCode = 2;
    } else {
        runHarnessCommand(command, subCommand, args.slice(2));
    }
} else if (command === 'validate-harness') {
    runHarnessArtifactCommand(subCommand, args[2], args.slice(3));
} else {
    console.log(`Unknown command: ${command}`);
    listSkills();
}
