"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSilencingWarnings = exports.silenceWarnings = exports.processExceptions = exports.withValidationDefaults = exports.ValidationErrorUnsafeMessages = void 0;
const log_1 = require("../utils/log");
exports.ValidationErrorUnsafeMessages = {
    'state-variable-assignment': [
        `You are using the \`unsafeAllow.state-variable-assignment\` flag.`,
        `The value will be stored in the implementation and not the proxy.`,
    ],
    'state-variable-immutable': [`You are using the \`unsafeAllow.state-variable-immutable\` flag.`],
    'external-library-linking': [
        `You are using the \`unsafeAllow.external-library-linking\` flag to include external libraries.`,
        `Make sure you have manually checked that the linked libraries are upgrade safe.`,
    ],
    'struct-definition': [
        `You are using the \`unsafeAllow.struct-definition\` flag to skip storage checks for structs.`,
        `Make sure you have manually checked the storage layout for incompatibilities.`,
    ],
    'enum-definition': [
        `You are using the \`unsafeAllow.enum-definition\` flag to skip storage checks for enums.`,
        `Make sure you have manually checked the storage layout for incompatibilities.`,
    ],
    constructor: [`You are using the \`unsafeAllow.constructor\` flag.`],
    delegatecall: [`You are using the \`unsafeAllow.delegatecall\` flag.`],
    selfdestruct: [`You are using the \`unsafeAllow.selfdestruct\` flag.`],
    'missing-public-upgradeto': [
        `You are using the \`unsafeAllow.missing-public-upgradeto\` flag with uups proxy.`,
        `Not having a public upgradeTo function in your implementation can break upgradeability.`,
        `Some implementation might check that onchain, and cause the upgrade to revert.`,
    ],
};
function withValidationDefaults(opts) {
    var _a, _b, _c, _d;
    const unsafeAllow = (_a = opts.unsafeAllow) !== null && _a !== void 0 ? _a : [];
    const unsafeAllowCustomTypes = (_b = opts.unsafeAllowCustomTypes) !== null && _b !== void 0 ? _b : (unsafeAllow.includes('struct-definition') && unsafeAllow.includes('enum-definition'));
    const unsafeAllowLinkedLibraries = (_c = opts.unsafeAllowLinkedLibraries) !== null && _c !== void 0 ? _c : unsafeAllow.includes('external-library-linking');
    if (unsafeAllowCustomTypes) {
        unsafeAllow.push('enum-definition', 'struct-definition');
    }
    if (unsafeAllowLinkedLibraries) {
        unsafeAllow.push('external-library-linking');
    }
    const kind = (_d = opts.kind) !== null && _d !== void 0 ? _d : 'transparent';
    return { unsafeAllowCustomTypes, unsafeAllowLinkedLibraries, unsafeAllow, kind };
}
exports.withValidationDefaults = withValidationDefaults;
function processExceptions(contractName, errors, opts) {
    const { unsafeAllow } = withValidationDefaults(opts);
    if (opts.kind === 'transparent') {
        errors = errors.filter(error => error.kind !== 'missing-public-upgradeto');
    }
    for (const [errorType, errorDescription] of Object.entries(exports.ValidationErrorUnsafeMessages)) {
        if (unsafeAllow.includes(errorType)) {
            let exceptionsFound = false;
            errors = errors.filter(error => {
                const isException = errorType === error.kind;
                exceptionsFound = exceptionsFound || isException;
                return !isException;
            });
            if (exceptionsFound && !silenced && errorDescription) {
                log_1.logWarning(`Potentially unsafe deployment of ${contractName}`, errorDescription);
            }
        }
    }
    return errors;
}
exports.processExceptions = processExceptions;
let silenced = false;
function silenceWarnings() {
    if (!silenced) {
        log_1.logWarning(`All subsequent Upgrades warnings will be silenced.`, [
            `Make sure you have manually checked all uses of unsafe flags.`,
        ]);
        silenced = true;
    }
}
exports.silenceWarnings = silenceWarnings;
function isSilencingWarnings() {
    return silenced;
}
exports.isSilencingWarnings = isSilencingWarnings;
//# sourceMappingURL=overrides.js.map