const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { checkHarnessTask, getHarnessExitCode } = require('./harness-check');
const cliPath = path.join(__dirname, 'cli.js');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'solmate-harness-'));
const backlogDir = path.join(root, 'docs', '04_Logic_Progress');
const conceptDir = path.join(root, 'docs', '01_Concept_Design');
const qaDir = path.join(root, 'docs', '05_QA_Validation');

fs.mkdirSync(backlogDir, { recursive: true });
fs.mkdirSync(conceptDir, { recursive: true });
fs.mkdirSync(qaDir, { recursive: true });
fs.writeFileSync(path.join(conceptDir, '03_PRODUCT_SPECS.md'), '# Product Specs\n');
fs.writeFileSync(path.join(qaDir, '10_FEATURE_QA.md'), '# QA Report\n');

const backlogPath = path.join(backlogDir, '00_BACKLOG.md');
const validTask = `### [ ] TASK-001: Harness fixture

- Status: Doing
- Work Type: code
- Related Concept Docs:
  - [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - scope
- Related UI Docs:
  - N/A - no UI change
- Related HTML Preview:
  - N/A - no UI change
- Related Technical Docs:
  - N/A - no technical contract change
- Related QA Docs:
  - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - verification evidence
- Implementation Preconditions:
  - [x] Read all related documents
- Acceptance Criteria:
  - [x] Harness fixture passes
- Context Receipt:
  - Status: PASS
  - Required References Read:
    - [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - constraints extracted
    - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - criteria extracted
  - Constraints:
    - Keep the fixture minimal
  - Conflicts: None
- Change Receipt:
  - Files Changed:
    - \`bin/harness-check.test.js\`
- Verification Receipt:
  - Status: PASS
  - Commands and Results:
    - \`npm test\` - PASS - fixture complete
  - Unrun Checks:
    - N/A - all planned checks ran
  - Detailed Evidence:
    - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - full evidence
`;

fs.writeFileSync(backlogPath, validTask);

const preflight = checkHarnessTask({
    stage: 'preflight',
    mode: 'blocking',
    taskId: 'TASK-001',
    backlogPath,
});
assert.strictEqual(preflight.valid, true, preflight.errors.join('\n'));
assert.strictEqual(getHarnessExitCode(preflight), 0);

const verification = checkHarnessTask({
    stage: 'verify',
    mode: 'blocking',
    taskId: 'TASK-001',
    backlogPath,
});
assert.strictEqual(verification.valid, true, verification.errors.join('\n'));

const cliPass = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'verify', 'TASK-001', '--strict', '--backlog', backlogPath],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(cliPass.status, 0, cliPass.stderr || cliPass.stdout);
assert(cliPass.stdout.includes('Harness verify: PASS'));

fs.writeFileSync(backlogPath, validTask.replace(
    '    - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - criteria extracted\n',
    '',
));
const missingRead = checkHarnessTask({
    stage: 'preflight',
    mode: 'warning',
    taskId: 'TASK-001',
    backlogPath,
});
assert.strictEqual(missingRead.valid, false);
assert.strictEqual(getHarnessExitCode(missingRead), 0);
assert(missingRead.errors.some(error => error.includes('not recorded as read')));

const cliWarning = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'preflight', 'TASK-001', '--backlog', backlogPath],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(cliWarning.status, 0, cliWarning.stderr || cliWarning.stdout);
assert(cliWarning.stdout.includes('Harness preflight: WARN'));

const cliBlock = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'preflight', 'TASK-001', '--strict', '--backlog', backlogPath],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(cliBlock.status, 1, cliBlock.stderr || cliBlock.stdout);
assert(cliBlock.stdout.includes('Harness preflight: BLOCK'));

fs.writeFileSync(backlogPath, validTask.replace(
    '  - Detailed Evidence:\n    - [QA Report](../05_QA_Validation/10_FEATURE_QA.md) - full evidence\n',
    '',
));
const missingEvidence = checkHarnessTask({
    stage: 'verify',
    mode: 'blocking',
    taskId: 'TASK-001',
    backlogPath,
});
assert.strictEqual(missingEvidence.valid, false);
assert.strictEqual(getHarnessExitCode(missingEvidence), 1);
assert(missingEvidence.errors.some(error => error.includes('Detailed Evidence')));

fs.writeFileSync(backlogPath, validTask.replace('Work Type: code', 'Work Type: docs'));
const docsTask = checkHarnessTask({
    stage: 'verify',
    mode: 'blocking',
    taskId: 'TASK-001',
    backlogPath,
});
assert.strictEqual(docsTask.valid, true);
assert.strictEqual(docsTask.applicable, false);

const installRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'solmate-agent-install-'));
const customAgentDir = path.join(installRoot, '.claude', 'agents');
fs.mkdirSync(customAgentDir, { recursive: true });
fs.writeFileSync(path.join(customAgentDir, 'custom-reviewer.md'), '# Keep this project agent\n');

const agentInstall = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'install', 'agents'],
    { cwd: installRoot, encoding: 'utf8' },
);
assert.strictEqual(agentInstall.status, 0, agentInstall.stderr || agentInstall.stdout);
assert(fs.existsSync(path.join(installRoot, '.agent', 'skills', 'rules-workflow', 'resources', 'agent-harness-contract.md')));
assert(fs.existsSync(path.join(installRoot, '.agent', 'skills', 'rules-workflow', 'resources', 'agent-harness-v1.schema.json')));
assert(fs.existsSync(path.join(customAgentDir, 'custom-reviewer.md')));
for (const fileName of ['solmate-context-reader.md', 'solmate-implementer.md', 'solmate-verifier.md']) {
    assert(fs.existsSync(path.join(customAgentDir, fileName)), `${fileName} was not installed`);
}

const listOutput = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'list'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(listOutput.status, 0, listOutput.stderr || listOutput.stdout);
assert(listOutput.stdout.includes('Feature work is verified automatically'));
assert(!listOutput.stdout.includes('preflight TASK-000'));

console.log('harness checks ok');
