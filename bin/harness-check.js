const fs = require('fs');
const path = require('path');

const DEFAULT_BACKLOG = 'docs/04_Logic_Progress/00_BACKLOG.md';
const RELATED_FIELDS = [
    'Related Concept Docs',
    'Related UI Docs',
    'Related HTML Preview',
    'Related Technical Docs',
    'Related QA Docs',
];
const MANDATORY_WORK_TYPES = new Set(['code', 'deploy']);
const ADVISORY_WORK_TYPES = new Set(['docs', 'prototype']);

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findTaskBlock(content, taskId) {
    const headingPattern = /^#{2,6}\s+\[([ xX])\]\s+([^\n]+)$/gm;
    const headings = [];
    let match;

    while ((match = headingPattern.exec(content)) !== null) {
        headings.push({ start: match.index, heading: match[2], checked: match[1].toLowerCase() === 'x' });
    }

    const idPattern = new RegExp(`(^|\\s)${escapeRegExp(taskId)}(?=\\s|:|$)`, 'i');
    const index = headings.findIndex(item => idPattern.test(item.heading));

    if (index === -1) {
        return null;
    }

    const end = index + 1 < headings.length ? headings[index + 1].start : content.length;
    return {
        block: content.slice(headings[index].start, end),
        checked: headings[index].checked,
        heading: headings[index].heading,
    };
}

function extractField(block, fieldName) {
    const lines = block.split(/\r?\n/);
    const fieldPattern = new RegExp(`^- ${escapeRegExp(fieldName)}:\\s*(.*)$`);
    const start = lines.findIndex(line => fieldPattern.test(line));

    if (start === -1) {
        return null;
    }

    const firstMatch = lines[start].match(fieldPattern);
    const collected = firstMatch[1] ? [firstMatch[1]] : [];

    for (let index = start + 1; index < lines.length; index += 1) {
        if (/^- [A-Za-z][^:]*:\s*/.test(lines[index])) {
            break;
        }
        collected.push(lines[index]);
    }

    return collected.join('\n').replace(/^\n+/, '').replace(/\s+$/, '');
}

function extractNestedField(block, fieldName) {
    const lines = block.split(/\r?\n/);
    const fieldPattern = new RegExp(`^(\\s+)- ${escapeRegExp(fieldName)}:\\s*(.*)$`);
    const start = lines.findIndex(line => fieldPattern.test(line));

    if (start === -1) {
        return null;
    }

    const firstMatch = lines[start].match(fieldPattern);
    const baseIndent = firstMatch[1].length;
    const collected = firstMatch[2] ? [firstMatch[2]] : [];

    for (let index = start + 1; index < lines.length; index += 1) {
        const nestedField = lines[index].match(/^(\s+)- [A-Za-z][^:]*:\s*/);
        if (nestedField && nestedField[1].length <= baseIndent) {
            break;
        }
        collected.push(lines[index]);
    }

    return collected.join('\n').replace(/^\n+/, '').replace(/\s+$/, '');
}

function extractLinks(value) {
    const links = [];
    const pattern = /\[[^\]]+\]\(([^)]+)\)/g;
    let match;

    while ((match = pattern.exec(value || '')) !== null) {
        links.push(match[1].trim().replace(/^<|>$/g, ''));
    }

    return links;
}

function extractBacktickValues(value) {
    const values = [];
    const pattern = /`([^`]+)`/g;
    let match;

    while ((match = pattern.exec(value || '')) !== null) {
        values.push(match[1].trim());
    }

    return values;
}

function normalizeReference(value) {
    const withoutAnchor = value.split('#')[0].split('?')[0];
    return path.normalize(withoutAnchor).replace(/\\/g, '/').replace(/^\.\//, '');
}

function hasReasonedNA(value) {
    return /N\/A\s*-\s*\S+/i.test(value || '');
}

function isExternalLink(value) {
    return /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function validateRelatedFields(task, backlogPath, errors) {
    const relatedLinks = [];
    const backlogDir = path.dirname(backlogPath);

    for (const fieldName of RELATED_FIELDS) {
        const field = extractField(task.block, fieldName);
        if (!field) {
            errors.push(`${fieldName} is missing.`);
            continue;
        }

        const links = extractLinks(field);
        if (links.length === 0) {
            if (!hasReasonedNA(field)) {
                errors.push(`${fieldName} must contain a relative link or \`N/A - reason\`.`);
            }
            continue;
        }

        for (const link of links) {
            if (isExternalLink(link)) {
                errors.push(`${fieldName} must use a relative project path: ${link}`);
                continue;
            }

            const normalized = normalizeReference(link);
            const absolute = path.resolve(backlogDir, normalized);
            if (!fs.existsSync(absolute)) {
                errors.push(`${fieldName} points to a missing file: ${link}`);
                continue;
            }
            relatedLinks.push(normalized);
        }
    }

    return relatedLinks;
}

function validateContextReceipt(task, relatedLinks, errors) {
    const receipt = extractField(task.block, 'Context Receipt');
    if (!receipt) {
        errors.push('Context Receipt is missing.');
        return;
    }

    const status = extractNestedField(receipt, 'Status');
    if (!status || !/^PASS\b/i.test(status)) {
        errors.push('Context Receipt status must be PASS.');
    }

    const readField = extractNestedField(receipt, 'Required References Read');
    if (!readField) {
        errors.push('Context Receipt must list Required References Read.');
    } else {
        const readReferences = [...extractLinks(readField), ...extractBacktickValues(readField)]
            .filter(value => !isExternalLink(value))
            .map(normalizeReference);
        const readSet = new Set(readReferences);

        for (const linkedPath of relatedLinks) {
            if (!readSet.has(linkedPath)) {
                errors.push(`Linked document was not recorded as read: ${linkedPath}`);
            }
        }
    }

    if (!extractNestedField(receipt, 'Constraints')) {
        errors.push('Context Receipt must include Constraints.');
    }
    if (!extractNestedField(receipt, 'Conflicts')) {
        errors.push('Context Receipt must include Conflicts.');
    }
}

function validateVerificationReceipt(task, backlogPath, errors) {
    const receipt = extractField(task.block, 'Verification Receipt');
    if (!receipt) {
        errors.push('Verification Receipt is missing.');
        return;
    }

    const status = extractNestedField(receipt, 'Status');
    if (!status || !/^PASS\b/i.test(status)) {
        errors.push('Verification Receipt status must be PASS.');
    }
    if (/\bFAIL\b/i.test(receipt)) {
        errors.push('Verification Receipt contains a FAIL result.');
    }

    const commands = extractNestedField(receipt, 'Commands and Results');
    if (!commands || !/\bPASS\b/i.test(commands)) {
        errors.push('Verification Receipt must include at least one passing command result.');
    }

    const unrun = extractNestedField(receipt, 'Unrun Checks');
    if (!unrun) {
        errors.push('Verification Receipt must explain Unrun Checks.');
    }

    const evidence = extractNestedField(receipt, 'Detailed Evidence');
    const evidenceLinks = extractLinks(evidence || '');
    if (!evidence || evidenceLinks.length === 0) {
        errors.push('Verification Receipt must link Detailed Evidence to a QA document or PR.');
        return;
    }

    const backlogDir = path.dirname(backlogPath);
    const hasValidEvidence = evidenceLinks.some(link => {
        if (/^https:\/\/github\.com\/.+\/pull\/\d+/i.test(link)) {
            return true;
        }
        if (isExternalLink(link)) {
            return false;
        }
        const absolute = path.resolve(backlogDir, normalizeReference(link));
        return fs.existsSync(absolute) && /(?:^|\/)05_QA_Validation\//.test(absolute.replace(/\\/g, '/'));
    });

    if (!hasValidEvidence) {
        errors.push('Detailed Evidence must point to an existing QA document or a GitHub PR.');
    }
}

function checkHarnessTask(options) {
    const stage = options.stage;
    const mode = options.mode || 'warning';
    const taskId = options.taskId;
    const backlogPath = path.resolve(options.cwd || process.cwd(), options.backlogPath || DEFAULT_BACKLOG);
    const errors = [];
    const notes = [];

    if (!['preflight', 'verify'].includes(stage)) {
        return { operationalError: true, valid: false, errors: [`Unknown harness stage: ${stage}`] };
    }
    if (!['warning', 'blocking'].includes(mode)) {
        return { operationalError: true, valid: false, errors: [`Unknown harness mode: ${mode}`] };
    }
    if (!taskId) {
        return { operationalError: true, valid: false, errors: ['A backlog task ID is required.'] };
    }
    if (!fs.existsSync(backlogPath)) {
        return { operationalError: true, valid: false, errors: [`Backlog file not found: ${backlogPath}`] };
    }

    const content = fs.readFileSync(backlogPath, 'utf8');
    const task = findTaskBlock(content, taskId);
    if (!task) {
        return { operationalError: true, valid: false, errors: [`Task not found in backlog: ${taskId}`] };
    }

    const workTypeValue = extractField(task.block, 'Work Type');
    const workType = (workTypeValue || '').split(/\s/)[0].toLowerCase();
    if (!workType) {
        errors.push('Work Type is missing. Use code, deploy, docs, or prototype.');
    } else if (ADVISORY_WORK_TYPES.has(workType)) {
        notes.push(`Work Type ${workType} uses advisory receipts.`);
        return {
            stage,
            mode,
            taskId,
            backlogPath,
            workType,
            applicable: false,
            valid: true,
            checked: task.checked,
            errors,
            notes,
        };
    } else if (!MANDATORY_WORK_TYPES.has(workType)) {
        errors.push(`Unsupported Work Type: ${workType}`);
    }

    for (const fieldName of ['Implementation Preconditions', 'Acceptance Criteria']) {
        if (!extractField(task.block, fieldName)) {
            errors.push(`${fieldName} is missing.`);
        }
    }

    const relatedLinks = validateRelatedFields(task, backlogPath, errors);
    validateContextReceipt(task, relatedLinks, errors);

    if (stage === 'verify') {
        validateVerificationReceipt(task, backlogPath, errors);
    }

    return {
        stage,
        mode,
        taskId,
        backlogPath,
        workType: workType || 'unknown',
        applicable: true,
        valid: errors.length === 0,
        checked: task.checked,
        errors,
        notes,
    };
}

function formatHarnessResult(result) {
    if (result.operationalError) {
        return ['Harness check: ERROR', ...result.errors.map(error => `- ${error}`)].join('\n');
    }

    let status = 'PASS';
    if (!result.applicable) {
        status = 'ADVISORY';
    } else if (!result.valid) {
        status = result.mode === 'blocking' ? 'BLOCK' : 'WARN';
    }

    const lines = [
        `Harness ${result.stage}: ${status}`,
        `Task: ${result.taskId}`,
        `Work Type: ${result.workType}`,
        `Mode: ${result.mode}`,
        `Backlog: ${result.backlogPath}`,
    ];

    for (const note of result.notes || []) {
        lines.push(`- ${note}`);
    }
    for (const error of result.errors || []) {
        lines.push(`- ${error}`);
    }

    return lines.join('\n');
}

function getHarnessExitCode(result) {
    if (result.operationalError) {
        return 2;
    }
    if (!result.valid && result.mode === 'blocking') {
        return 1;
    }
    return 0;
}

module.exports = {
    DEFAULT_BACKLOG,
    checkHarnessTask,
    extractField,
    extractNestedField,
    findTaskBlock,
    formatHarnessResult,
    getHarnessExitCode,
};
