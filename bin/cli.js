#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const IGNORED_FOLDERS = ['bin', 'node_modules', '.git', '.github', '.gemini', '.agent'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'AGENTS.md', 'SKILL.md', 'init-skills.sh', 'README.md', '.DS_Store', 'old_AGENTS.md'];

const packageRoot = path.join(__dirname, '..');
const targetProjectRoot = process.cwd();
const targetSkillsDir = path.join(targetProjectRoot, '.agent', 'skills');

function getAvailableSkills() {
    return fs.readdirSync(packageRoot, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !IGNORED_FOLDERS.includes(dirent.name))
        .map(dirent => dirent.name);
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

function listSkills() {
    const skills = getAvailableSkills();
    console.log('\nAvailable skills to install:');
    skills.forEach(skill => console.log(` - ${skill}`));
    console.log('\nUsage: npx solmate-skills install <skill-name> | install-all\n');
}

function installSkill(skillName) {
    const skills = getAvailableSkills();

    if (skillName === 'install-all') {
        console.log('Installing all skills...');
        skills.forEach(s => installSkill(s));
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
    } else {
        installSkill(subCommand);
    }
} else if (command === 'install-all' || command === 'all') {
    installSkill('install-all');
} else {
    console.log(`Unknown command: ${command}`);
    listSkills();
}
