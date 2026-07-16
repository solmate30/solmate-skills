const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
    loadContract,
    ownershipScopesOverlap,
    validateEvent,
    validateEvents,
    validateManifest,
    validateMessage,
} = require('./harness-artifact');

const cliPath = path.join(__dirname, 'cli.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'solmate-harness-artifact-'));
const workspace = path.join(root, '_workspace', 'harness', 'TASK-HARNESS-002');
fs.mkdirSync(workspace, { recursive: true });

const validManifest = {
    schema_version: 1,
    artifact_type: 'task_manifest',
    task_id: 'TASK-HARNESS-002',
    work_type: 'code',
    current_state: 'COMPLETE',
    active_attempt: 1,
    topology: {
        pattern: 'LINEAR',
        reason: 'The contract change has one implementation owner.',
        agent_count: 4,
        fallback: 'Run the same roles sequentially.',
    },
    roles: [
        { role_id: 'coordinator', activation: 'ACTIVE', reason: 'Owns task state and user decisions.' },
        { role_id: 'context-reader', activation: 'ACTIVE', reason: 'Reads every linked reference.' },
        { role_id: 'implementer', activation: 'ACTIVE', reason: 'Owns the declared source changes.' },
        { role_id: 'qa-inspector', activation: 'ACTIVE', reason: 'Independently verifies the change.' },
        { role_id: 'architect', activation: 'SKIPPED', reason: 'The approved architecture is already canonical.' },
    ],
    write_ownership: [
        { role_id: 'implementer', paths: ['bin/**', 'rules-workflow/resources/**'], mode: 'EXCLUSIVE' },
    ],
    canonical_documents: [
        {
            kind: 'REQUIREMENTS',
            path: 'docs/01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md',
        },
        {
            kind: 'ARCHITECTURE',
            path: 'docs/03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md',
        },
        {
            kind: 'QA',
            path: 'docs/05_QA_Validation/01_TEST_SCENARIOS.md',
        },
    ],
    receipts: [
        {
            type: 'REQUIREMENTS',
            status: 'PASS',
            artifact_ref: 'docs/01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md',
        },
        {
            type: 'CONTEXT',
            status: 'PASS',
            artifact_ref: 'docs/04_Logic_Progress/00_BACKLOG.md',
        },
        {
            type: 'DESIGN',
            status: 'SKIPPED',
            artifact_ref: 'docs/04_Logic_Progress/00_BACKLOG.md',
            reason: 'The approved architecture already covers this implementation.',
        },
        {
            type: 'CHANGE',
            status: 'PASS',
            artifact_ref: 'docs/04_Logic_Progress/00_BACKLOG.md',
        },
        {
            type: 'VERIFICATION',
            status: 'PASS',
            artifact_ref: 'docs/05_QA_Validation/03_AGENT_HARNESS_CONTRACT_QA.md',
        },
    ],
};

const validMessage = {
    schema_version: 1,
    artifact_type: 'agent_message',
    message_id: 'msg-task-harness-002-01',
    task_id: 'TASK-HARNESS-002',
    attempt: 1,
    timestamp: '2026-07-17T01:31:00+09:00',
    from: 'implementer',
    to: ['coordinator'],
    type: 'HANDOFF',
    status: 'PASS',
    summary: 'The versioned contract validator is ready for independent QA.',
    requirement_refs: ['FR-006', 'FR-007'],
    artifact_refs: ['bin/harness-artifact.js'],
    decision_refs: ['DEC-002'],
    evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
    blockers: [],
    next_action: 'Coordinator may start independent verification.',
    retry_count: 0,
};

function event(sequence, from, to, fields = {}) {
    return {
        schema_version: 1,
        artifact_type: 'state_event',
        event_id: `evt-task-harness-002-${sequence}`,
        task_id: 'TASK-HARNESS-002',
        attempt: 1,
        sequence,
        timestamp: `2026-07-17T01:${String(31 + sequence).padStart(2, '0')}:00+09:00`,
        actor: 'coordinator',
        from,
        to,
        reason: `Advance the approved task to ${to}.`,
        artifact_refs: [],
        evidence_refs: [],
        ...fields,
    };
}

const validEvents = [
    event(1, 'INTAKE', 'REQUIREMENTS_READY', {
        artifact_refs: ['docs/01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md'],
    }),
    event(2, 'REQUIREMENTS_READY', 'CONTEXT_LOCKED', {
        evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
    }),
    event(3, 'CONTEXT_LOCKED', 'DESIGN_READY', {
        artifact_refs: ['docs/03_Technical_Specs/01_AGENT_HARNESS_ARCHITECTURE.md'],
    }),
    event(4, 'DESIGN_READY', 'IMPLEMENTING', {
        evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
    }),
    event(5, 'IMPLEMENTING', 'CHANGE_READY', {
        artifact_refs: ['bin/harness-artifact.js'],
        evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
    }),
    event(6, 'CHANGE_READY', 'VERIFYING', {
        evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
    }),
    event(7, 'VERIFYING', 'COMPLETE', {
        evidence_refs: ['docs/05_QA_Validation/03_AGENT_HARNESS_CONTRACT_QA.md'],
    }),
];

assert.deepStrictEqual(validateManifest(validManifest), []);
assert.deepStrictEqual(validateMessage(validMessage, validManifest), []);
assert.deepStrictEqual(validateEvents(validEvents, validManifest), []);
assert.strictEqual(ownershipScopesOverlap('bin/**', 'bin/cli.js'), true);
assert.strictEqual(ownershipScopesOverlap('bin/**', 'docs/00.md'), false);
assert.strictEqual(ownershipScopesOverlap('bin/cli.js', 'bin/./cli.js'), true);
assert.strictEqual(ownershipScopesOverlap('a//b', 'a/b'), true);
assert.strictEqual(ownershipScopesOverlap('./**', 'bin/cli.js'), true);
assert.strictEqual(loadContract().oneOf.length, 3);

for (const field of Object.keys(validManifest)) {
    const invalid = { ...validManifest, [field]: null };
    assert.doesNotThrow(() => validateManifest(invalid), `manifest field ${field} must not throw`);
}
for (const field of Object.keys(validMessage)) {
    const invalid = { ...validMessage, [field]: null };
    assert.doesNotThrow(
        () => validateMessage(invalid, validManifest),
        `message field ${field} must not throw`,
    );
}
for (const field of Object.keys(validEvents[0])) {
    const invalid = { ...validEvents[0], [field]: null };
    assert.doesNotThrow(() => validateEvent(invalid), `event field ${field} must not throw`);
    assert.doesNotThrow(
        () => validateEvents([invalid], validManifest),
        `event log field ${field} must not throw`,
    );
}

const unsupportedVersion = { ...validManifest, schema_version: 2 };
assert(validateManifest(unsupportedVersion)
    .some(error => error.includes('$.schema_version must equal 1')));

const prototypeNamedFields = JSON.parse(
    `${JSON.stringify(validManifest).slice(0, -1)},"constructor":"forbidden","__proto__":"forbidden"}`,
);
const prototypeFieldErrors = validateManifest(prototypeNamedFields);
assert(prototypeFieldErrors.some(error => error.includes('$.constructor is not allowed')));
assert(prototypeFieldErrors.some(error => error.includes('$.__proto__ is not allowed')));

const missingVerification = JSON.parse(JSON.stringify(validManifest));
missingVerification.receipts = missingVerification.receipts
    .filter(receipt => receipt.type !== 'VERIFICATION');
assert(validateManifest(missingVerification)
    .some(error => error.includes('COMPLETE requires VERIFICATION receipt evidence')));

const overlappingOwnership = JSON.parse(JSON.stringify(validManifest));
overlappingOwnership.roles.push({
    role_id: 'release-guardian',
    activation: 'ACTIVE',
    reason: 'Checks release evidence.',
});
overlappingOwnership.topology.agent_count = 5;
overlappingOwnership.write_ownership.push({
    role_id: 'release-guardian',
    paths: ['bin/cli.js'],
    mode: 'EXCLUSIVE',
});
assert(validateManifest(overlappingOwnership)
    .some(error => error.includes('overlaps bin/** owned by implementer')));

const readOnlyOwnership = JSON.parse(JSON.stringify(validManifest));
readOnlyOwnership.write_ownership.push({
    role_id: 'context-reader',
    paths: ['docs/**'],
    mode: 'EXCLUSIVE',
});
assert(validateManifest(readOnlyOwnership)
    .some(error => error.includes('Read-only role context-reader')));

const ambiguousOwnership = JSON.parse(JSON.stringify(validManifest));
ambiguousOwnership.write_ownership[0].paths = ['bin/*'];
assert(validateManifest(ambiguousOwnership)
    .some(error => error.includes('safe project-relative path')));

for (const recursiveAlias of ['bin//**', './/**']) {
    const invalidRecursiveScope = JSON.parse(JSON.stringify(validManifest));
    invalidRecursiveScope.write_ownership[0].paths = [recursiveAlias];
    assert(validateManifest(invalidRecursiveScope)
        .some(error => error.includes('safe project-relative path')));
}

const aliasOwnership = JSON.parse(JSON.stringify(validManifest));
aliasOwnership.roles.push({
    role_id: 'release-guardian',
    activation: 'ACTIVE',
    reason: 'Checks release evidence.',
});
aliasOwnership.topology.agent_count = 5;
aliasOwnership.write_ownership.push({
    role_id: 'release-guardian',
    paths: ['bin/./cli.js'],
    mode: 'EXCLUSIVE',
});
const aliasErrors = validateManifest(aliasOwnership);
assert(aliasErrors.some(error => error.includes('safe project-relative path')));
assert(aliasErrors.some(error => error.includes('overlaps bin/** owned by implementer')));

const invalidOwnershipType = JSON.parse(JSON.stringify(validManifest));
invalidOwnershipType.write_ownership.push({
    role_id: 'implementer',
    paths: [42],
    mode: 'EXCLUSIVE',
});
assert(validateManifest(invalidOwnershipType)
    .some(error => error.includes('must be string')));

const inactiveRecipient = { ...validMessage, to: ['architect'] };
assert(validateMessage(inactiveRecipient, validManifest)
    .some(error => error.includes('architect is not ACTIVE')));

const validPeerQuestion = {
    ...validMessage,
    message_id: 'msg-task-harness-002-peer-question',
    to: ['qa-inspector'],
    type: 'QUESTION',
    status: 'PENDING',
    artifact_refs: [],
    evidence_refs: [],
    next_action: 'QA Inspector may answer the bounded clarification.',
};
assert.deepStrictEqual(validateMessage(validPeerQuestion, validManifest), []);

const peerPass = {
    ...validPeerQuestion,
    message_id: 'msg-task-harness-002-peer-pass',
    type: 'STATUS',
    status: 'PASS',
    next_action: 'Treat the implementation as complete.',
};
assert(validateMessage(peerPass, validManifest)
    .some(error => error.includes('Direct peer messages may only use INFO or PENDING status')));

const invalidCalendarTimestamp = {
    ...validMessage,
    timestamp: '2026-02-30T12:00:00Z',
};
assert(validateMessage(invalidCalendarTimestamp, validManifest)
    .some(error => error.includes('Solmate canonical date-time profile')));

const validLeapDayTimestamp = {
    ...validMessage,
    timestamp: '2024-02-29T23:59:59.123+09:00',
};
assert.deepStrictEqual(validateMessage(validLeapDayTimestamp, validManifest), []);

const validLeapSecondTimestamp = {
    ...validMessage,
    timestamp: '2016-12-31T23:59:60Z',
};
assert(validateMessage(validLeapSecondTimestamp, validManifest)
    .some(error => error.includes('Solmate canonical date-time profile')));

const invalidSecondTimestamp = {
    ...validMessage,
    timestamp: '2016-12-31T23:59:61Z',
};
assert(validateMessage(invalidSecondTimestamp, validManifest)
    .some(error => error.includes('Solmate canonical date-time profile')));

for (const timestamp of ['2026-07-17t12:34:56z', '0000-01-01T00:00:00Z']) {
    assert(validateMessage({ ...validMessage, timestamp }, validManifest)
        .some(error => error.includes('Solmate canonical date-time profile')));
}

const illegalTransition = event(1, 'CHANGE_READY', 'COMPLETE', {
    evidence_refs: ['docs/05_QA_Validation/03_AGENT_HARNESS_CONTRACT_QA.md'],
});
assert(validateEvent(illegalTransition)
    .some(error => error.includes('Illegal state transition')));

const unauthorizedTransition = {
    ...validEvents[6],
    actor: 'implementer',
};
assert(validateEvent(unauthorizedTransition)
    .some(error => error.includes('Only coordinator')));

const missingEvidence = {
    ...validEvents[6],
    evidence_refs: [],
};
assert(validateEvent(missingEvidence)
    .some(error => error.includes('requires evidence_refs')));

const duplicateEventIds = validEvents.map(value => ({ ...value }));
duplicateEventIds[1].event_id = duplicateEventIds[0].event_id;
assert(validateEvents(duplicateEventIds, validManifest)
    .some(error => error.includes('event_id must be unique')));

const cancelledReworkEvents = [
    ...validEvents.slice(0, 4),
    event(5, 'IMPLEMENTING', 'REWORK'),
    event(6, 'REWORK', 'CANCELLED'),
];
assert.deepStrictEqual(validateEvents(cancelledReworkEvents), []);

const restartedReworkEvents = [
    ...validEvents.slice(0, 4),
    event(5, 'IMPLEMENTING', 'REWORK'),
    {
        ...event(6, 'REWORK', 'IMPLEMENTING', {
            evidence_refs: ['docs/04_Logic_Progress/00_BACKLOG.md'],
        }),
        attempt: 2,
    },
];
assert.deepStrictEqual(validateEvents(restartedReworkEvents), []);

const prematureAttemptEvents = cancelledReworkEvents.map(value => ({ ...value }));
prematureAttemptEvents[4].attempt = 2;
assert(validateEvents(prematureAttemptEvents)
    .some(error => error.includes('attempt must be 1')));

const blockedDecisionEvents = [
    validEvents[0],
    event(2, 'REQUIREMENTS_READY', 'BLOCKED_DECISION', {
        resume_state: 'REQUIREMENTS_READY',
    }),
    event(3, 'BLOCKED_DECISION', 'REQUIREMENTS_READY', {
        artifact_refs: ['docs/01_Concept_Design/01_AGENT_HARNESS_REQUIREMENTS_ANALYSIS.md'],
    }),
];
assert.deepStrictEqual(validateEvents(blockedDecisionEvents), []);

const invalidResumeEvents = blockedDecisionEvents.map(value => ({ ...value }));
invalidResumeEvents[2].to = 'CONTEXT_LOCKED';
invalidResumeEvents[2].evidence_refs = ['docs/04_Logic_Progress/00_BACKLOG.md'];
assert(validateEvents(invalidResumeEvents)
    .some(error => error.includes('must resume to REQUIREMENTS_READY')));

const invalidSequenceEvents = validEvents.map(value => ({ ...value }));
invalidSequenceEvents[1].sequence = 9;
assert(validateEvents(invalidSequenceEvents, validManifest)
    .some(error => error.includes('sequence must equal 2')));

const invalidAttemptEvents = validEvents.map(value => ({ ...value }));
invalidAttemptEvents[1].attempt = 3;
assert(validateEvents(invalidAttemptEvents, validManifest)
    .some(error => error.includes('attempt must be 1')));

const mismatchedStateManifest = { ...validManifest, current_state: 'VERIFYING' };
assert(validateEvents(validEvents, mismatchedStateManifest)
    .some(error => error.includes('Manifest current_state must match')));

const manifestPath = path.join(workspace, 'manifest.json');
const messagePath = path.join(workspace, 'message.json');
const eventsPath = path.join(workspace, 'events.jsonl');
fs.writeFileSync(manifestPath, `${JSON.stringify(validManifest, null, 2)}\n`);
fs.writeFileSync(messagePath, `${JSON.stringify(validMessage, null, 2)}\n`);
fs.writeFileSync(eventsPath, `${validEvents.map(value => JSON.stringify(value)).join('\n')}\n`);

for (const [artifactType, artifactPath] of [
    ['manifest', manifestPath],
    ['message', messagePath],
    ['events', eventsPath],
]) {
    const args = [cliPath, 'validate-harness', artifactType, artifactPath, '--strict'];
    if (artifactType !== 'manifest') args.push('--manifest', manifestPath);
    const result = childProcess.spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
    assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    assert(result.stdout.includes(`Harness artifact ${artifactType}: PASS`));
}

const invalidMessage = { ...validMessage };
delete invalidMessage.summary;
const invalidMessagePath = path.join(workspace, 'invalid-message.json');
fs.writeFileSync(invalidMessagePath, `${JSON.stringify(invalidMessage, null, 2)}\n`);

const warningResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'message', invalidMessagePath, '--manifest', manifestPath],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(warningResult.status, 0, warningResult.stderr || warningResult.stdout);
assert(warningResult.stdout.includes('Harness artifact message: WARN'));

const blockingResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'message', invalidMessagePath, '--manifest', manifestPath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(blockingResult.status, 1, blockingResult.stderr || blockingResult.stdout);
assert(blockingResult.stdout.includes('Harness artifact message: BLOCK'));

const jsonBlockingResult = childProcess.spawnSync(
    process.execPath,
    [
        cliPath,
        'validate-harness',
        'message',
        invalidMessagePath,
        '--manifest',
        manifestPath,
        '--mode',
        'blocking',
        '--json',
    ],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(jsonBlockingResult.status, 1, jsonBlockingResult.stderr || jsonBlockingResult.stdout);
assert.strictEqual(JSON.parse(jsonBlockingResult.stdout).valid, false);

const missingManifestResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'message', messagePath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(missingManifestResult.status, 2, missingManifestResult.stderr || missingManifestResult.stdout);
assert(missingManifestResult.stdout.includes('--manifest is required'));

for (const [name, invalidEvent] of [
    ['illegal-transition', illegalTransition],
    ['unauthorized-transition', unauthorizedTransition],
    ['missing-evidence', missingEvidence],
]) {
    const invalidEventsPath = path.join(workspace, `${name}.jsonl`);
    fs.writeFileSync(invalidEventsPath, `${JSON.stringify(invalidEvent)}\n`);
    const result = childProcess.spawnSync(
        process.execPath,
        [cliPath, 'validate-harness', 'events', invalidEventsPath, '--manifest', manifestPath, '--strict'],
        { cwd: root, encoding: 'utf8' },
    );
    assert.strictEqual(result.status, 1, result.stderr || result.stdout);
    assert(result.stdout.includes('Harness artifact events: BLOCK'));
}

const malformedPath = path.join(workspace, 'malformed.json');
fs.writeFileSync(malformedPath, '{ invalid json\n');
const malformedResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'manifest', malformedPath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(malformedResult.status, 2, malformedResult.stderr || malformedResult.stdout);
assert(malformedResult.stdout.includes('Harness artifact check: ERROR'));

const malformedEventsPath = path.join(workspace, 'malformed-events.jsonl');
fs.writeFileSync(malformedEventsPath, `${JSON.stringify(validEvents[0])}\n{ invalid json\n`);
const malformedEventsResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'events', malformedEventsPath, '--manifest', manifestPath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(malformedEventsResult.status, 2, malformedEventsResult.stderr || malformedEventsResult.stdout);
assert(malformedEventsResult.stdout.includes('Invalid JSON on line 2'));

const nullEventsPath = path.join(workspace, 'null-events.jsonl');
fs.writeFileSync(nullEventsPath, 'null\n');
const nullEventsResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'events', nullEventsPath, '--manifest', manifestPath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(nullEventsResult.status, 1, nullEventsResult.stderr || nullEventsResult.stdout);
assert(nullEventsResult.stdout.includes('Harness artifact events: BLOCK'));

const invalidOwnershipPath = path.join(workspace, 'invalid-ownership.json');
fs.writeFileSync(invalidOwnershipPath, `${JSON.stringify(invalidOwnershipType, null, 2)}\n`);
const invalidOwnershipResult = childProcess.spawnSync(
    process.execPath,
    [cliPath, 'validate-harness', 'manifest', invalidOwnershipPath, '--strict'],
    { cwd: root, encoding: 'utf8' },
);
assert.strictEqual(invalidOwnershipResult.status, 1, invalidOwnershipResult.stderr || invalidOwnershipResult.stdout);
assert(invalidOwnershipResult.stdout.includes('Harness artifact manifest: BLOCK'));

console.log('harness artifact checks ok');
