const fs = require('fs');
const path = require('path');

const CONTRACT_PATH = path.join(
    __dirname,
    '..',
    'rules-workflow',
    'resources',
    'agent-harness-v1.schema.json',
);
const ARTIFACT_TYPES = new Set(['manifest', 'message', 'events']);
const DYNAMIC_BLOCK_STATES = new Set(['BLOCKED_DECISION', 'BLOCKED_DEPENDENCY', 'DEGRADED']);
const SKIPPABLE_RECEIPTS = new Set(['REQUIREMENTS', 'DESIGN']);
const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/;

let cachedContract;

function loadContract() {
    if (!cachedContract) {
        cachedContract = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
    }
    return cachedContract;
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function resolveReference(contract, reference) {
    if (!reference.startsWith('#/')) {
        throw new Error(`Unsupported schema reference: ${reference}`);
    }

    return reference.slice(2).split('/').reduce((current, segment) => {
        if (!current || !Object.prototype.hasOwnProperty.call(current, segment)) {
            throw new Error(`Missing schema reference: ${reference}`);
        }
        return current[segment];
    }, contract);
}

function valueMatchesType(value, type) {
    if (type === 'object') return isPlainObject(value);
    if (type === 'array') return Array.isArray(value);
    if (type === 'integer') return Number.isInteger(value);
    if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
    if (type === 'null') return value === null;
    return typeof value === type;
}

function isValidDateTime(value) {
    const match = DATE_TIME_PATTERN.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6]);
    const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
    const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return year >= 1
        && month >= 1
        && month <= 12
        && day >= 1
        && day <= daysInMonth[month - 1]
        && hour <= 23
        && minute <= 59
        && second <= 59
        && offsetHour <= 23
        && offsetMinute <= 59;
}

function validateSchema(value, schema, errors, location, contract) {
    if (schema.$ref) {
        validateSchema(value, resolveReference(contract, schema.$ref), errors, location, contract);
        return;
    }

    if (Object.prototype.hasOwnProperty.call(schema, 'const') && value !== schema.const) {
        errors.push(`${location} must equal ${JSON.stringify(schema.const)}.`);
        return;
    }

    if (schema.enum && !schema.enum.includes(value)) {
        errors.push(`${location} must be one of: ${schema.enum.join(', ')}.`);
        return;
    }

    if (schema.type && !valueMatchesType(value, schema.type)) {
        errors.push(`${location} must be ${schema.type}.`);
        return;
    }

    if (schema.type === 'object') {
        for (const field of schema.required || []) {
            if (!Object.prototype.hasOwnProperty.call(value, field)) {
                errors.push(`${location}.${field} is required.`);
            }
        }

        for (const [field, fieldValue] of Object.entries(value)) {
            const properties = schema.properties || {};
            if (!Object.prototype.hasOwnProperty.call(properties, field)) {
                if (schema.additionalProperties === false) {
                    errors.push(`${location}.${field} is not allowed.`);
                }
                continue;
            }
            const fieldSchema = properties[field];
            validateSchema(fieldValue, fieldSchema, errors, `${location}.${field}`, contract);
        }
    }

    if (schema.type === 'array') {
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push(`${location} must contain at least ${schema.minItems} item(s).`);
        }
        if (schema.uniqueItems) {
            const serialized = value.map(item => JSON.stringify(item));
            if (new Set(serialized).size !== serialized.length) {
                errors.push(`${location} must not contain duplicate items.`);
            }
        }
        if (schema.items) {
            value.forEach((item, index) => {
                validateSchema(item, schema.items, errors, `${location}[${index}]`, contract);
            });
        }
    }

    if (schema.type === 'string') {
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push(`${location} must contain at least ${schema.minLength} character(s).`);
        }
        if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
            errors.push(`${location} has an invalid format.`);
        }
        if (schema.format === 'date-time' && !isValidDateTime(value)) {
            errors.push(`${location} must use the Solmate canonical date-time profile.`);
        }
    }

    if ((schema.type === 'integer' || schema.type === 'number')
        && schema.minimum !== undefined
        && value < schema.minimum) {
        errors.push(`${location} must be at least ${schema.minimum}.`);
    }
}

function isSafeProjectPath(value, options = {}) {
    const { allowRecursive = false } = options;
    if (typeof value !== 'string' || value.length === 0 || value.includes('\0')) {
        return false;
    }

    const recursive = value === '**' || value.endsWith('/**');
    const nonRecursivePart = value === '**'
        ? ''
        : recursive ? value.slice(0, -3) : value;
    if (path.isAbsolute(value)
        || path.win32.isAbsolute(value)
        || value.includes('\\')
        || /^[a-z][a-z0-9+.-]*:/i.test(value)
        || /[*?[\]{}]/.test(nonRecursivePart)
        || (!allowRecursive && recursive)
        || value.endsWith('/')
        || nonRecursivePart.startsWith('./')
        || nonRecursivePart.endsWith('/')
        || nonRecursivePart.includes('//')) {
        return false;
    }

    if (value === '**') return allowRecursive;
    if (!nonRecursivePart || nonRecursivePart === '.') return false;
    if (nonRecursivePart.split('/').includes('..')) return false;
    return path.posix.normalize(nonRecursivePart) === nonRecursivePart;
}

function validateProjectPaths(value, errors, location, options = {}) {
    if (!Array.isArray(value)) return;
    value.forEach((projectPath, index) => {
        if (!isSafeProjectPath(projectPath, options)) {
            errors.push(`${location}[${index}] must be a safe project-relative path.`);
        }
    });
}

function normalizeOwnershipScope(value) {
    if (typeof value !== 'string') return null;
    const recursive = value === '**' || value.endsWith('/**');
    const rawBase = value === '**' ? '' : recursive ? value.slice(0, -3) : value;
    const normalizedBase = rawBase ? path.posix.normalize(rawBase).replace(/\/+$/, '') : '';
    return {
        base: normalizedBase === '.' ? '' : normalizedBase,
        recursive,
    };
}

function ownershipScopesOverlap(left, right) {
    const a = normalizeOwnershipScope(left);
    const b = normalizeOwnershipScope(right);
    if (!a || !b) return false;
    if (a.base === b.base) return true;
    if (a.recursive && a.base === '') return true;
    if (b.recursive && b.base === '') return true;
    if (a.recursive && b.base.startsWith(`${a.base}/`)) return true;
    return b.recursive && a.base.startsWith(`${b.base}/`);
}

function validateManifest(manifest, contract = loadContract()) {
    const errors = [];
    validateSchema(manifest, contract.$defs.manifest, errors, '$', contract);
    if (!isPlainObject(manifest)) return errors;

    const roles = Array.isArray(manifest.roles) ? manifest.roles : [];
    const roleMap = new Map();
    for (const role of roles) {
        if (!isPlainObject(role) || typeof role.role_id !== 'string') continue;
        if (roleMap.has(role.role_id)) {
            errors.push(`$.roles contains duplicate role_id: ${role.role_id}.`);
        } else {
            roleMap.set(role.role_id, role);
        }
        if (role.activation === 'SKIPPED' && !String(role.reason || '').trim()) {
            errors.push(`Skipped role ${role.role_id} must include a reason.`);
        }
    }

    if (['code', 'deploy'].includes(manifest.work_type)) {
        for (const roleId of contract['x-core-roles']) {
            const role = roleMap.get(roleId);
            if (!role || role.activation !== 'ACTIVE') {
                errors.push(`Core role ${roleId} must be ACTIVE for ${manifest.work_type} work.`);
            }
        }
    }

    const activeRoles = new Set(
        roles.filter(role => role && role.activation === 'ACTIVE').map(role => role.role_id),
    );
    if (isPlainObject(manifest.topology)
        && Number.isInteger(manifest.topology.agent_count)
        && manifest.topology.agent_count !== activeRoles.size) {
        errors.push('$.topology.agent_count must equal the number of ACTIVE roles.');
    }

    const ownership = Array.isArray(manifest.write_ownership) ? manifest.write_ownership : [];
    const scopes = [];
    const readOnlyRoles = new Set(contract['x-read-only-roles']);
    ownership.forEach((entry, entryIndex) => {
        if (!isPlainObject(entry)) return;
        if (!activeRoles.has(entry.role_id)) {
            errors.push(`Write owner ${entry.role_id} must be an ACTIVE role.`);
        }
        if (readOnlyRoles.has(entry.role_id)) {
            errors.push(`Read-only role ${entry.role_id} cannot own write paths.`);
        }
        validateProjectPaths(
            entry.paths,
            errors,
            `$.write_ownership[${entryIndex}].paths`,
            { allowRecursive: true },
        );
        for (const ownedPath of Array.isArray(entry.paths) ? entry.paths : []) {
            if (typeof ownedPath !== 'string') continue;
            for (const existing of scopes) {
                if (existing.roleId !== entry.role_id
                    && ownershipScopesOverlap(existing.path, ownedPath)) {
                    errors.push(`Write scope ${ownedPath} for ${entry.role_id} overlaps ${existing.path} owned by ${existing.roleId}.`);
                }
            }
            scopes.push({ roleId: entry.role_id, path: ownedPath });
        }
    });

    const documents = Array.isArray(manifest.canonical_documents)
        ? manifest.canonical_documents
        : [];
    const documentPaths = new Set();
    documents.forEach((document, index) => {
        if (!isPlainObject(document)) return;
        if (documentPaths.has(document.path)) {
            errors.push(`$.canonical_documents contains duplicate path: ${document.path}.`);
        }
        documentPaths.add(document.path);
        validateProjectPaths([document.path], errors, `$.canonical_documents[${index}].path`);
    });

    const receipts = Array.isArray(manifest.receipts) ? manifest.receipts : [];
    const receiptMap = new Map();
    receipts.forEach((receipt, index) => {
        if (!isPlainObject(receipt)) return;
        if (receipt.type !== 'ERROR' && receiptMap.has(receipt.type)) {
            errors.push(`$.receipts contains duplicate ${receipt.type} receipt.`);
        }
        if (receipt.type !== 'ERROR') receiptMap.set(receipt.type, receipt);
        if (receipt.status === 'SKIPPED' && !String(receipt.reason || '').trim()) {
            errors.push(`Skipped ${receipt.type} receipt must include a reason.`);
        }
        validateProjectPaths([receipt.artifact_ref], errors, `$.receipts[${index}].artifact_ref`);
    });

    const requiredReceipts = contract['x-manifest-receipts'][manifest.current_state] || [];
    for (const receiptType of requiredReceipts) {
        const receipt = receiptMap.get(receiptType);
        const skippable = SKIPPABLE_RECEIPTS.has(receiptType)
            && receipt
            && receipt.status === 'SKIPPED'
            && String(receipt.reason || '').trim();
        if (!receipt || (receipt.status !== 'PASS' && !skippable)) {
            errors.push(`${manifest.current_state} requires ${receiptType} receipt evidence.`);
        }
    }

    return errors;
}

function validateMessage(message, manifest, contract = loadContract()) {
    const errors = [];
    validateSchema(message, contract.$defs.message, errors, '$', contract);
    if (!isPlainObject(message)) return errors;

    validateProjectPaths(message.artifact_refs, errors, '$.artifact_refs');
    validateProjectPaths(message.evidence_refs, errors, '$.evidence_refs');

    const recipients = Array.isArray(message.to) ? message.to : [];
    if (recipients.includes(message.from)) {
        errors.push('A message cannot be addressed to its sender.');
    }
    if (['REQUEST', 'REWORK_REQUEST'].includes(message.type) && message.from !== 'coordinator') {
        errors.push(`${message.type} messages may only be sent by coordinator.`);
    }
    if (message.from !== 'coordinator'
        && !recipients.includes('coordinator')
        && !['STATUS', 'QUESTION'].includes(message.type)) {
        errors.push('Direct peer messages may only use STATUS or QUESTION.');
    }
    if (message.from !== 'coordinator'
        && !recipients.includes('coordinator')
        && !['INFO', 'PENDING'].includes(message.status)) {
        errors.push('Direct peer messages may only use INFO or PENDING status.');
    }
    if (['DECISION_REQUIRED', 'HANDOFF', 'FINDING', 'RESULT'].includes(message.type)
        && message.from !== 'coordinator'
        && !recipients.includes('coordinator')) {
        errors.push(`${message.type} messages must route through coordinator.`);
    }
    if (['HANDOFF', 'RESULT'].includes(message.type)
        && (message.artifact_refs || []).length === 0
        && (message.evidence_refs || []).length === 0) {
        errors.push(`${message.type} messages require an artifact or evidence reference.`);
    }

    if (manifest && isPlainObject(manifest)) {
        if (message.task_id !== manifest.task_id) {
            errors.push('Message task_id must match the manifest task_id.');
        }
        if (message.attempt !== manifest.active_attempt) {
            errors.push('Message attempt must match the manifest active_attempt.');
        }
        const activeRoles = new Set(
            (manifest.roles || [])
                .filter(role => role && role.activation === 'ACTIVE')
                .map(role => role.role_id),
        );
        for (const roleId of [message.from, ...recipients]) {
            if (!activeRoles.has(roleId)) {
                errors.push(`Message role ${roleId} is not ACTIVE in the manifest.`);
            }
        }
    }

    return errors;
}

function validateEvent(event, contract = loadContract()) {
    const errors = [];
    validateSchema(event, contract.$defs.event, errors, '$', contract);
    if (!isPlainObject(event)) return errors;

    validateProjectPaths(event.artifact_refs, errors, '$.artifact_refs');
    validateProjectPaths(event.evidence_refs, errors, '$.evidence_refs');

    if (event.actor !== 'coordinator') {
        errors.push('Only coordinator may record state transitions.');
    }
    const legalNextStates = contract['x-state-transitions'][event.from] || [];
    if (!legalNextStates.includes(event.to)) {
        errors.push(`Illegal state transition: ${event.from} -> ${event.to}.`);
    }
    if (event.from === event.to) {
        errors.push('A state event must change the state.');
    }
    if (DYNAMIC_BLOCK_STATES.has(event.to) && event.resume_state !== event.from) {
        errors.push(`${event.to} requires resume_state to equal the previous state.`);
    }
    if (!DYNAMIC_BLOCK_STATES.has(event.to) && event.resume_state !== undefined) {
        errors.push('resume_state is only allowed when entering a dynamic blocked state.');
    }
    for (const field of contract['x-event-evidence'][event.to] || []) {
        if (!Array.isArray(event[field]) || event[field].length === 0) {
            errors.push(`${event.from} -> ${event.to} requires ${field}.`);
        }
    }

    return errors;
}

function validateEvents(events, manifest, contract = loadContract()) {
    const errors = [];
    if (!Array.isArray(events) || events.length === 0) {
        return ['events.jsonl must contain at least one state event.'];
    }
    if (isPlainObject(events[0]) && events[0].from !== 'INTAKE') {
        errors.push('line 1: the event log must start from INTAKE.');
    }
    if (isPlainObject(events[0]) && events[0].attempt !== 1) {
        errors.push('line 1: the event log must start with attempt 1.');
    }

    const eventIds = new Set();

    events.forEach((event, index) => {
        validateEvent(event, contract).forEach(error => errors.push(`line ${index + 1}: ${error}`));
        if (!isPlainObject(event)) return;
        if (eventIds.has(event.event_id)) {
            errors.push(`line ${index + 1}: event_id must be unique.`);
        }
        eventIds.add(event.event_id);
        if (event.sequence !== index + 1) {
            errors.push(`line ${index + 1}: sequence must equal ${index + 1}.`);
        }
        if (index === 0) return;

        const previous = events[index - 1];
        if (!isPlainObject(previous)) return;
        if (event.task_id !== previous.task_id) {
            errors.push(`line ${index + 1}: task_id must match earlier events.`);
        }
        if (event.from !== previous.to) {
            errors.push(`line ${index + 1}: from must equal the previous event to state.`);
        }

        const expectedAttempt = previous.to === 'REWORK' && event.to === 'IMPLEMENTING'
            ? previous.attempt + 1
            : previous.attempt;
        if (event.attempt !== expectedAttempt) {
            errors.push(`line ${index + 1}: attempt must be ${expectedAttempt}.`);
        }
        if (DYNAMIC_BLOCK_STATES.has(previous.to)
            && event.to !== 'CANCELLED'
            && event.to !== previous.resume_state) {
            errors.push(`line ${index + 1}: ${previous.to} must resume to ${previous.resume_state}.`);
        }
    });

    if (!events.every(isPlainObject)) {
        return errors;
    }

    if (manifest && isPlainObject(manifest)) {
        const first = events[0];
        const last = events[events.length - 1];
        if (first.task_id !== manifest.task_id) {
            errors.push('Event task_id must match the manifest task_id.');
        }
        if (last.to !== manifest.current_state) {
            errors.push('Manifest current_state must match the final event state.');
        }
        if (last.attempt !== manifest.active_attempt) {
            errors.push('Manifest active_attempt must match the final event attempt.');
        }
        const coordinator = (manifest.roles || [])
            .find(role => role && role.role_id === 'coordinator');
        if (!coordinator || coordinator.activation !== 'ACTIVE') {
            errors.push('Event validation requires an ACTIVE coordinator in the manifest.');
        }
    }

    return errors;
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonLines(filePath) {
    const lines = fs.readFileSync(filePath, 'utf8')
        .split(/\r?\n/)
        .filter(line => line.trim());
    return lines.map((line, index) => {
        try {
            return JSON.parse(line);
        } catch (error) {
            const wrapped = new Error(`Invalid JSON on line ${index + 1}: ${error.message}`);
            wrapped.cause = error;
            throw wrapped;
        }
    });
}

function checkHarnessArtifact(options) {
    const cwd = options.cwd || process.cwd();
    const artifactType = options.artifactType;
    const mode = options.mode || 'warning';

    if (!ARTIFACT_TYPES.has(artifactType)) {
        return { operationalError: true, valid: false, errors: [`Unknown harness artifact type: ${artifactType}`] };
    }
    if (!['warning', 'blocking'].includes(mode)) {
        return { operationalError: true, valid: false, errors: [`Unknown harness mode: ${mode}`] };
    }
    if (!options.filePath) {
        return { operationalError: true, valid: false, errors: ['A harness artifact path is required.'] };
    }
    if (artifactType !== 'manifest' && !options.manifestPath) {
        return {
            operationalError: true,
            valid: false,
            errors: [`--manifest is required when validating ${artifactType}.`],
        };
    }

    const filePath = path.resolve(cwd, options.filePath);
    if (!fs.existsSync(filePath)) {
        return { operationalError: true, valid: false, errors: [`Harness artifact not found: ${filePath}`] };
    }

    let manifest;
    let value;
    try {
        if (options.manifestPath) {
            const manifestPath = path.resolve(cwd, options.manifestPath);
            if (!fs.existsSync(manifestPath)) {
                return { operationalError: true, valid: false, errors: [`Manifest not found: ${manifestPath}`] };
            }
            manifest = readJson(manifestPath);
            const manifestErrors = validateManifest(manifest);
            if (manifestErrors.length > 0) {
                return {
                    artifactType,
                    mode,
                    filePath,
                    manifestPath,
                    valid: false,
                    errors: manifestErrors.map(error => `Manifest: ${error}`),
                };
            }
        }
        value = artifactType === 'events' ? readJsonLines(filePath) : readJson(filePath);
    } catch (error) {
        return {
            operationalError: true,
            valid: false,
            errors: [`Unable to parse harness artifact: ${error.message}`],
        };
    }

    let errors;
    try {
        if (artifactType === 'manifest') errors = validateManifest(value);
        if (artifactType === 'message') errors = validateMessage(value, manifest);
        if (artifactType === 'events') errors = validateEvents(value, manifest);
    } catch (error) {
        return {
            operationalError: true,
            valid: false,
            errors: [`Unable to validate harness artifact: ${error.message}`],
        };
    }

    return {
        artifactType,
        mode,
        filePath,
        manifestPath: options.manifestPath ? path.resolve(cwd, options.manifestPath) : undefined,
        valid: errors.length === 0,
        errors,
    };
}

function formatHarnessArtifactResult(result) {
    if (result.operationalError) {
        return ['Harness artifact check: ERROR', ...result.errors.map(error => `- ${error}`)].join('\n');
    }

    const status = result.valid
        ? 'PASS'
        : result.mode === 'blocking' ? 'BLOCK' : 'WARN';
    const lines = [
        `Harness artifact ${result.artifactType}: ${status}`,
        `Mode: ${result.mode}`,
        `File: ${result.filePath}`,
    ];
    if (result.manifestPath) lines.push(`Manifest: ${result.manifestPath}`);
    for (const error of result.errors) lines.push(`- ${error}`);
    return lines.join('\n');
}

function getHarnessArtifactExitCode(result) {
    if (result.operationalError) return 2;
    if (!result.valid && result.mode === 'blocking') return 1;
    return 0;
}

module.exports = {
    checkHarnessArtifact,
    formatHarnessArtifactResult,
    getHarnessArtifactExitCode,
    loadContract,
    ownershipScopesOverlap,
    validateEvent,
    validateEvents,
    validateManifest,
    validateMessage,
};
